/**
 * Envoi de SMS via Africa's Talking pour l'Afrique de l'Ouest (Bénin, Togo, CI, etc.)
 */
export async function sendSmsNotification(to: string, message: string): Promise<boolean> {
  const username = process.env.AFRICASTALKING_USERNAME;
  const apiKey = process.env.AFRICASTALKING_API_KEY;

  if (!username || !apiKey || apiKey.includes('xxxx')) {
    console.log(`[SMS Simulation] Envoi à ${to} : ${message}`);
    return true;
  }

  try {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('to', to);
    params.append('message', message);

    const res = await fetch('https://api.africastalking.com/version1/messaging', {
      method: 'POST',
      headers: {
        'apiKey': apiKey,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: params.toString(),
    });

    return res.ok;
  } catch (error) {
    console.error('[SMS Africa\'s Talking Error]:', error);
    return false;
  }
}
