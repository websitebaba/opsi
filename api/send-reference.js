export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const { reference } = request.body || {};

  if (!/^\d{6}$/.test(reference || '')) {
    return response.status(400).json({ error: 'Reference harus terdiri dari 6 angka' });
  }

  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
    return response.status(500).json({ error: 'Konfigurasi Telegram belum tersedia' });
  }

  const telegramResponse = await fetch(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: `Referensi baru: ${reference}`,
      }),
    },
  );

  if (!telegramResponse.ok) {
    return response.status(502).json({ error: 'Telegram gagal menerima pesan' });
  }

  return response.status(200).json({ ok: true });
}
