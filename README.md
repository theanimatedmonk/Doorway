# Personal Links

A single-user tool for creating personalized portfolio links. Share a custom URL with someone, greet them by name, track when they visit, and get notified instantly.

## Features

### Create Personalized Links

Generate a unique link for each recipient with a purpose, name, and destination URL.

Example: `https://personal-links.vercel.app/quyen`

### Dashboard

View all your links at a glance:

- Purpose
- Recipient
- Status (Viewed / Not Viewed)
- View count
- Created date

### Link Details

Drill into any link to see:

- Destination URL
- First and last viewed timestamps
- Total views
- Recent visits with time, location, and device

### Visitor Experience

When someone opens your link:

1. They see a personalized welcome screen — *"Hello Quyen 👋"*
2. After ~2 seconds, they are redirected to your destination URL

### Visit Tracking

Every visit is logged with:

- Timestamp
- Location (city, country)
- Browser and OS
- Referrer

### Telegram Notifications

Receive a Telegram message on every visit:

```
👀 Portfolio Viewed

Recipient: Quyen
Purpose: Canva Outreach
Time: Jun 11, 10:42 PM
Location: Sydney, Australia
Device: Chrome on macOS
```

## How It Works

1. Create a link with a purpose, recipient name, and destination URL
2. Share the generated slug (e.g. `/quyen`)
3. The visitor sees a welcome screen, then gets redirected
4. You receive a Telegram notification and can review visit history in the dashboard
