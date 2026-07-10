# Plus One Promo — Frontend

Next.js App Router site for Plus One Promo.

## Setup

```bash
npm install
cp .env.example .env.local
# Paste the Cloud Function trigger URL into NEXT_PUBLIC_CONTACT_API_URL
npm run dev
```

## Contact form

The form posts to `NEXT_PUBLIC_CONTACT_API_URL` (Google Cloud Function).  
It does **not** call Resend from the browser — the API key stays on the backend.
