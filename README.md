# InlineAgent

InlineAgent is a lightweight, embeddable AI customer support chatbot built with Next.js and TypeScript.

This repository contains the InlineAgent web admin and an embeddable client script you can drop into any website.

## Features
- Plug & play embed script to add a chat widget to any site
- Admin dashboard for content, settings and user sessions
- MongoDB-backed settings and session storage
- Scalable integrations (ScaleKit, Gemini/GenAI providers)

## Quick start (local)

1. Install dependencies:

```bash
npm install
```

2. Create a `.env.local` file in the project root with the required environment variables listed below.

3. Run the dev server:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
npm run start
```

## Required environment variables
- `NEXT_PUBLIC_APP_URL` — public URL where the app will be hosted (used by the embed script)
- `MONGODB_URL` — MongoDB connection string for settings and sessions
- `SCALEKIT_ENVIRONMENT_URL` — (optional) ScaleKit environment URL if using ScaleKit
- `SCALEKIT_CLIENT_ID` and `SCALEKIT_CLIENT_SECRET` — (optional) ScaleKit credentials
- `GEMINI_API_KEY` or other provider API keys — set per provider you want to use

Important: Do NOT commit secrets into source control. Use your provider dashboards to rotate/update secrets.

## Running tests & linters

- Lint (if configured):

```bash
npm run lint
```

## Embed script (client-side)

To embed the chat widget into a site, include the script tag that loads the `chatBot.js` file from the app host. Example:

```html
<script src="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/chatBot.js" async></script>
```

## Notes & deployment

- Lockfiles (`package-lock.json`) will need regeneration after `npm install` — do this locally or in CI.
- Update any external redirects (ScaleKit or OAuth providers) to use the `InlineAgent` host/domain when you change your public URL.
- For Vercel deployment, set the environment variables in the Vercel dashboard and deploy the project root.

## Files of interest
- `app/` — Next.js app router source
- `app/components/` — React components including the admin UI
- `app/embed/page.tsx` and `public/chatBot.js` — embeddable client
- `app/lib/db.ts` — MongoDB connection helper

## License
- MIT
