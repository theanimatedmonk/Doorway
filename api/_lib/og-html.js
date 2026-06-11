export function buildOgHtml({ recipientName, canonicalUrl }) {
  const title = `Hello ${recipientName}`
  const escapedTitle = escapeHtml(title)
  const escapedUrl = escapeHtml(canonicalUrl)

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapedTitle}</title>
  <meta property="og:title" content="${escapedTitle}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${escapedUrl}" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="${escapedTitle}" />
</head>
<body>
  <p>${escapedTitle}</p>
</body>
</html>`
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
