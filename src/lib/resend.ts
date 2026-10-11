import { formatFCFA } from './utils';

/**
 * Envoie un email de notification lors d'une nouvelle commande via Resend
 */
export async function sendOrderEmailNotification(order: {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  city: string;
  district: string;
  address: string;
  totalXOF: number;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@mahugnon.bj';

  if (!apiKey || apiKey.includes('123456789')) {
    console.log(`[Email Simulation] Notification envoyée à ${adminEmail} pour la commande ${order.orderNumber}`);
    return true;
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || 'commandes@mahugnon.bj',
        to: [adminEmail],
        subject: `🚨 [MAHUGNON] Nouvelle commande à rappeler : ${order.orderNumber}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
            <div style="background-color: #1e40af; padding: 20px; text-align: center; color: white; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 24px;">MAHUGNON</h1>
              <p style="margin: 5px 0 0; opacity: 0.9;">Nouvelle commande reçue — À rappeler</p>
            </div>
            <div style="padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
              <p><strong>Numéro de commande :</strong> ${order.orderNumber}</p>
              <p><strong>Client :</strong> ${order.customerName}</p>
              <p><strong>Téléphone WhatsApp :</strong> <a href="tel:${order.customerPhone}">${order.customerPhone}</a></p>
              <p><strong>Lieu de livraison :</strong> ${order.city}, Quartier ${order.district}</p>
              <p><strong>Adresse :</strong> ${order.address}</p>
              <p><strong>Montant total :</strong> <span style="font-size: 18px; color: #1e40af; font-weight: bold;">${formatFCFA(order.totalXOF)}</span></p>
              <div style="margin-top: 30px; text-align: center;">
                <a href="https://wa.me/${order.customerPhone.replace(/[^\d]/g, '')}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                  Rappeler sur WhatsApp
                </a>
              </div>
            </div>
          </div>
        `,
      }),
    });

    return res.ok;
  } catch (error) {
    console.error('[Resend Email Error]:', error);
    return false;
  }
}
