import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkoutFormSchema } from '@/lib/validators/order';
import { OrderStatus, LoyaltyTxType, DiscountType } from '@prisma/client';
import { FALLBACK_CURRENCIES } from '@/lib/currency';
import { calculatePointsEarned, determineTier, calculateLoyaltyDiscount } from '@/lib/loyalty';
import {
  sendWhatsAppMessage,
  buildAdminOrderAlert,
  buildCustomerOrderConfirmation,
} from '@/lib/whatsapp';
import { sendOrderEmailNotification } from '@/lib/resend';
import { waLink } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    const rawData = await req.json();
    const validated = checkoutFormSchema.parse(rawData);

    // 1. Récupération de la devise client et du taux de change
    const clientCurrency = validated.clientCurrency.toUpperCase();
    let exchangeRate = 1.0;

    if (clientCurrency !== 'XOF' && clientCurrency !== 'XAF') {
      try {
        const cur = await prisma.currency.findUnique({
          where: { code: clientCurrency },
        });
        if (cur && cur.rateToXOF > 0) {
          exchangeRate = cur.rateToXOF;
        } else {
          const fb = FALLBACK_CURRENCIES.find((c) => c.code === clientCurrency);
          if (fb) exchangeRate = fb.rateToXOF;
        }
      } catch (e) {
        const fb = FALLBACK_CURRENCIES.find((c) => c.code === clientCurrency);
        if (fb) exchangeRate = fb.rateToXOF;
      }
    }

    // 2. Calcul du sous-total brut en XOF
    let subtotalXOF = 0;
    const itemsData = [];

    for (const item of validated.items) {
      const lineTotalXOF = item.priceXOF * item.quantity;
      subtotalXOF += lineTotalXOF;

      const unitClient =
        clientCurrency === 'XOF' ? item.priceXOF : Math.round(item.priceXOF * exchangeRate * 100) / 100;
      const totalClient =
        clientCurrency === 'XOF' ? lineTotalXOF : Math.round(lineTotalXOF * exchangeRate * 100) / 100;

      itemsData.push({
        productId: item.productId,
        productName: item.productName,
        variantName: item.variantName || null,
        quantity: item.quantity,
        unitPriceXOF: item.priceXOF,
        unitPriceClient: unitClient,
        totalPriceXOF: lineTotalXOF,
        totalPriceClient: totalClient,
        imageUrl: item.imageUrl || null,
      });
    }

    // 3. Calcul des frais de livraison selon la zone
    let shippingFeeXOF = 1500; // Défaut Cotonou
    try {
      const zone = await prisma.shippingZone.findFirst({
        where: {
          active: true,
          OR: [
            { city: { contains: validated.city, mode: 'insensitive' } },
            { district: { contains: validated.district, mode: 'insensitive' } },
          ],
        },
      });

      if (zone) {
        if (zone.freeShippingThresholdXOF && subtotalXOF >= zone.freeShippingThresholdXOF) {
          shippingFeeXOF = 0;
        } else {
          shippingFeeXOF = zone.feeXOF;
        }
      }
    } catch (e) {
      // Fallback
    }

    // 4. Vérification d'un éventuel Code Promo
    let promoDiscountXOF = 0;
    let promoCodeApplied: string | null = null;

    if (validated.promoCode && validated.promoCode.trim().length > 0) {
      try {
        const promo = await prisma.promoCode.findUnique({
          where: { code: validated.promoCode.trim().toUpperCase() },
        });

        if (promo && promo.active) {
          const isValidDate = !promo.expiresAt || promo.expiresAt > new Date();
          const isValidLimit = !promo.maxUses || promo.usedCount < promo.maxUses;
          const isValidMin = subtotalXOF >= promo.minOrderAmountXOF;

          if (isValidDate && isValidLimit && isValidMin) {
            promoCodeApplied = promo.code;
            if (promo.discountType === DiscountType.PERCENTAGE) {
              promoDiscountXOF = Math.round((subtotalXOF * promo.discountValue) / 100);
            } else {
              promoDiscountXOF = promo.discountValue;
            }

            await prisma.promoCode.update({
              where: { id: promo.id },
              data: { usedCount: { increment: 1 } },
            });
          }
        }
      } catch (e) {
        // Fallback
      }
    }

    // 5. Vérification du Programme de Fidélité
    let loyaltyDiscountXOF = 0;
    try {
      const member = await prisma.loyaltyMember.findUnique({
        where: { phone: validated.customerPhone },
      });
      if (member) {
        const { discountXOF, isFreeShipping } = calculateLoyaltyDiscount(subtotalXOF, member.tier);
        loyaltyDiscountXOF = discountXOF;
        if (isFreeShipping) {
          shippingFeeXOF = 0;
        }
      }
    } catch (e) {
      // Fallback
    }

    // 6. Calcul du Total Final
    const totalXOF = Math.max(0, subtotalXOF + shippingFeeXOF - promoDiscountXOF - loyaltyDiscountXOF);
    const totalClientCurrency =
      clientCurrency === 'XOF' ? totalXOF : Math.round(totalXOF * exchangeRate * 100) / 100;

    // 7. Génération du Numéro de commande unique MAHUGNON
    const count = await prisma.order.count().catch(() => 0);
    const year = new Date().getFullYear();
    const orderNumber = `MHG-${year}-${String(count + 1).padStart(4, '0')}`;

    // 8. Création de la commande en base de données
    const order = await prisma.order.create({
      data: {
        orderNumber,
        shopId: validated.shopId,
        status: OrderStatus.NEW_TO_CALL,
        customerName: validated.customerName,
        customerPhone: validated.customerPhone,
        secondaryPhone: validated.secondaryPhone || null,
        customerEmail: validated.customerEmail || null,
        city: validated.city,
        district: validated.district,
        address: validated.address,
        landmark: validated.landmark || null,
        notes: validated.notes || null,
        subtotalXOF,
        shippingFeeXOF,
        loyaltyDiscountXOF,
        promoDiscountXOF,
        promoCode: promoCodeApplied,
        totalXOF,
        clientCurrency,
        exchangeRate,
        totalClientCurrency,
        items: {
          create: itemsData,
        },
        history: {
          create: {
            status: OrderStatus.NEW_TO_CALL,
            note: 'Commande soumise en ligne. En attente de rappel.',
            changedBy: 'Système',
          },
        },
      },
      include: {
        items: true,
        shop: true,
      },
    });

    // 9. Mise à jour / Création de la fiche client (mini-CRM) & fidélité
    const pointsToEarn = calculatePointsEarned(totalXOF);

    try {
      await prisma.customer.upsert({
        where: { phone: validated.customerPhone },
        update: {
          fullName: validated.customerName,
          email: validated.customerEmail || undefined,
          city: validated.city,
          district: validated.district,
          address: validated.address,
          totalOrders: { increment: 1 },
          totalSpentXOF: { increment: totalXOF },
          preferredCurrency: clientCurrency,
        },
        create: {
          fullName: validated.customerName,
          phone: validated.customerPhone,
          email: validated.customerEmail || null,
          city: validated.city,
          district: validated.district,
          address: validated.address,
          totalOrders: 1,
          totalSpentXOF: totalXOF,
          preferredCurrency: clientCurrency,
        },
      });

      const loyaltyMember = await prisma.loyaltyMember.upsert({
        where: { phone: validated.customerPhone },
        update: {
          fullName: validated.customerName,
          currentPoints: { increment: pointsToEarn },
          totalSpentXOF: { increment: totalXOF },
        },
        create: {
          fullName: validated.customerName,
          phone: validated.customerPhone,
          currentPoints: pointsToEarn,
          tier: determineTier(pointsToEarn),
          totalSpentXOF: totalXOF,
        },
      });

      // Recalcul du palier
      const newTier = determineTier(loyaltyMember.currentPoints);
      if (newTier !== loyaltyMember.tier) {
        await prisma.loyaltyMember.update({
          where: { id: loyaltyMember.id },
          data: { tier: newTier },
        });
      }

      await prisma.loyaltyTransaction.create({
        data: {
          memberId: loyaltyMember.id,
          points: pointsToEarn,
          type: LoyaltyTxType.EARNED,
          reason: `Commande ${order.orderNumber}`,
          orderId: order.id,
        },
      });
    } catch (e) {
      console.warn('Erreur mise à jour CRM/Fidélité:', e);
    }

    // 10. Envoi des Notifications d'alerte immédiate (WhatsApp + Email)
    const adminWhatsAppNumber =
      process.env.ADMIN_WHATSAPP_NUMBER || order.shop.whatsappNumber || '+22997000000';

    const adminAlertMessage = buildAdminOrderAlert({
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      city: order.city,
      district: order.district,
      address: order.address,
      landmark: order.landmark,
      notes: order.notes,
      totalXOF: order.totalXOF,
      totalClientCurrency: order.totalClientCurrency,
      clientCurrency: order.clientCurrency,
      items: itemsData,
    });

    const customerConfirmationMessage = buildCustomerOrderConfirmation({
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      shopName: order.shop.name,
      totalXOF: order.totalXOF,
    });

    // Alertes asynchrones
    Promise.allSettled([
      sendWhatsAppMessage(adminWhatsAppNumber, adminAlertMessage),
      sendWhatsAppMessage(order.customerPhone, customerConfirmationMessage),
      sendOrderEmailNotification({
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        customerEmail: order.customerEmail,
        city: order.city,
        district: order.district,
        address: order.address,
        totalXOF: order.totalXOF,
      }),
    ]).catch((err) => console.error('Erreur alertes commande:', err));

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        totalXOF: order.totalXOF,
        totalClientCurrency: order.totalClientCurrency,
        clientCurrency: order.clientCurrency,
        shopWhatsapp: order.shop.whatsappNumber,
        waDirectUrl: waLink(
          order.shop.whatsappNumber || '+22997000000',
          `Bonjour, je viens de passer la commande N° ${order.orderNumber} sur MAHUGNON.`
        ),
      },
    });
  } catch (error: any) {
    console.error('Erreur soumission commande:', error);
    return NextResponse.json(
      { error: error?.message || 'Erreur lors de l\'enregistrement de votre commande' },
      { status: 400 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get('phone');
    const orderNumber = searchParams.get('orderNumber');

    if (!phone && !orderNumber) {
      return NextResponse.json({ error: 'Numéro WhatsApp ou commande requis' }, { status: 400 });
    }

    const order = await prisma.order.findFirst({
      where: {
        OR: [
          orderNumber ? { orderNumber } : {},
          phone ? { customerPhone: phone } : {},
        ],
      },
      include: {
        items: true,
        history: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
