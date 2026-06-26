This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Buurthuis Order Log

The form on `/voor-buurthuizen` posts to `/api/orders`. In production, submissions should be logged to Google Sheets.

Preferred setup is a Google Apps Script webhook attached to the target spreadsheet. Configure Vercel with:

```bash
GOOGLE_SHEETS_WEBHOOK_URL=...
GOOGLE_SHEETS_WEBHOOK_SECRET=...
```

Alternative setup is a Google Cloud service account with access to the Google Sheets API. Share the target spreadsheet with the service-account email as editor, then configure Vercel with:

```bash
GOOGLE_SHEETS_SPREADSHEET_ID=...
GOOGLE_SHEETS_SHEET_NAME=Bestellingen
GOOGLE_SERVICE_ACCOUNT_EMAIL=...
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

If the sheet tab does not exist, the API creates it. If the header row is empty, the API writes the column headers.

Local development appends to `content/buurthuis-bestellingen.csv` unless Google Sheets env vars are set. GitHub CSV logging is still available as fallback and requires:

```bash
ORDER_LOG_GITHUB_TOKEN=github_pat_...
ORDER_LOG_GITHUB_REPO=sirprikkel/goodness-for-all
ORDER_LOG_GITHUB_BRANCH=master
ORDER_LOG_GITHUB_PATH=content/buurthuis-bestellingen.csv
```

Use a fine-grained GitHub token scoped to this repository with `Contents: read/write`.

## Contact Forms

The contact form and partner form post to `/api/contact`. Production mail is sent through Resend and requires:

```bash
CONTACT_TO=info@goodnessforall.nl
RESEND_API_KEY=re_...
RESEND_FROM="Goodness for All <noreply@goodnessforall.nl>"
```

`RESEND_FROM` must use a domain verified in Resend.
