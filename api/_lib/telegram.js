function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export async function sendTelegramNotification({ recipientName, purpose, time, location, device }) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    console.warn('Telegram credentials not configured, skipping notification')
    return
  }

  const recipient = escapeHtml(recipientName)
  const linkPurpose = escapeHtml(purpose)

  const message = [
    `👀 <b>${recipient}</b> viewed your link "<b>${linkPurpose}</b>"`,
    '',
    `Time: ${escapeHtml(time)}`,
    `Location: ${escapeHtml(location)}`,
    `Device: ${escapeHtml(device)}`,
  ].join('\n')

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('Telegram notification failed:', error)
  }
}
