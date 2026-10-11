import { formatFCFA, waLink } from './utils';

export interface WhatsAppNotificationPayload {
  to: string; // Numéro format international E.164 (ex: +22997000000)
  message: string;
}

/**
 * Envoie une notification WhatsApp via l'API officielle WhatsApp Cloud (Meta) si configurée.
 * Sinon, consigne dans la console pour le suivi et n'interrompt jamais le flux de commande.
 */
export async function sendWhatsAppMessage(to: string, message: string): Promise<boolean> {
  const token = process.env.WHATSAPP_BUSINESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneNumberId || token.includes('xxxx')) {
    console.log(`[WhatsApp Simulation] Message à destination de ${to}:\n${message}`);
    return true;
  }

  try {
    const cleanTo = to.replace(/[^\d]/g, '');
    const res = await fetch(`https://graph.facebook.com/v19.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: cleanTo,
        type: 'text',
        text: { preview_url: false, body: message },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('[WhatsApp Cloud API Error]:', err);
      return false;
    }
    return true;
  } catch (error) {
    console.error('[WhatsApp Network Error]:', error);
    return false;
  }
}

/**
 * Construit le message pour alerter l'administrateur d'une nouvelle commande à rappeler
 */
export function buildAdminOrderAlert(order: {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  city: string;
  district: string;
  address: string;
  landmark?: string | null;
  notes?: string | null;
  totalXOF: number;
  totalClientCurrency: number;
  clientCurrency: string;
  items: { productName: string; quantity: number }[];
}): string {
  const itemsList = order.items
    .map((item) => `• ${item.quantity}x ${item.productName}`)
    .join('\n');

  return `🚨 *NOUVELLE COMMANDE MAHUGNON : ${order.orderNumber}*
Statut : 🆕 *À rappeler immédiatement*

👤 *Client :* ${order.customerName}
📞 *WhatsApp :* ${order.customerPhone}
📍 *Ville :* ${order.city} (${order.district})
🏠 *Adresse :* ${order.address} ${order.landmark ? `(Repère: ${order.landmark})` : ''}
📝 *Notes :* ${order.notes || 'Aucune note'}

🛍️ *Articles :*
${itemsList}

💰 *Total :* ${formatFCFA(order.totalXOF)} ${
    order.clientCurrency !== 'XOF' ? `(~ ${order.totalClientCurrency} ${order.clientCurrency})` : ''
  }

👉 *Rappeler le client maintenant via WhatsApp :*
${waLink(order.customerPhone, `Bonjour ${order.customerName}, je vous appelle concernant votre commande MAHUGNON N° ${order.orderNumber}.`)}`;
}

/**
 * Construit le message de confirmation transmis au client
 */
export function buildCustomerOrderConfirmation(order: {
  orderNumber: string;
  customerName: string;
  shopName?: string;
  totalXOF: number;
}): string {
  return `Bonjour *${order.customerName}* ! 👋

Merci pour votre commande sur *MAHUGNON* (N° *${order.orderNumber}*).

Notre équipe commerciale a bien reçu votre demande pour un montant de *${formatFCFA(order.totalXOF)}*.
Nous allons vous appeler d'ici quelques minutes sur ce numéro pour convenir du lieu et de l'heure de livraison.

Paiement en espèces ou Mobile Money (MTN MoMo / Moov Money / Wave) à la livraison.

À très bientôt ! 🇧🇯`;
}
