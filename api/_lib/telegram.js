export async function sendTelegramNotification({ recipientName, purpose, time, location, device }) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    console.warn('Telegram credentials not configured, skipping notification')
    return
  }

  const message = [
    '👀 Portfolio Viewed',
    '',
    `Recipient: ${recipientName}`,
    `Purpose: ${purpose}`,
    `Time: ${time}`,
    `Location: ${location}`,
    `Device: ${device}`,
  ].join('\n')

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('Telegram notification failed:', error)
  }
}
