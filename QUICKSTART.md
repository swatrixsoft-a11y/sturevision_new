# Sturevision — Quickstart Guide

## Get running in 5 minutes

### Step 1 — Install dependencies (already done if node_modules exists)
```bash
cd sturevision
npm install
```

### Step 2 — Set up environment variables
```bash
cp .env.example .env.local
```
Open `.env.local` and fill in your keys (see below for where to get each one).

### Step 3 — Start the dev server
```bash
npm run dev
```
Open http://localhost:3000 — your landing page is live!

### Step 4 — Start the Socket.io server (in a separate terminal)
```bash
npm run socket
```
This powers real-time leaderboard and study rooms.

---

## API Keys you need

| Service | Where to get | Used for |
|---------|-------------|----------|
| MongoDB Atlas | cloud.mongodb.com | Database |
| Clerk | dashboard.clerk.com | Auth (login/signup) |
| OpenAI | platform.openai.com | AI quiz & flashcard generation |
| Upstash Redis | console.upstash.com | AI response caching (saves cost) |
| Razorpay | dashboard.razorpay.com | Indian payments |
| Cloudinary | cloudinary.com/console | PDF uploads |
| Resend | resend.com | Revision reminder emails |

### Minimum to get started (just to see it running):
1. **MongoDB** — create a free cluster on Atlas
2. **Clerk** — create a free app, copy publishable + secret key
3. **OpenAI** — add your key (even $5 credit is enough for testing)

---

## Project structure

```
src/
├── app/
│   ├── (auth)/          # Login & Register pages (Clerk)
│   ├── (dashboard)/     # All dashboard pages
│   │   ├── dashboard/   # Home dashboard
│   │   ├── upload/      # PDF upload + AI generation
│   │   ├── quiz/        # Quiz taking screen
│   │   ├── flashcards/  # SM-2 spaced flashcards
│   │   ├── scheduler/   # Revision schedule
│   │   ├── analytics/   # Charts & progress
│   │   ├── leaderboard/ # Live Socket.io leaderboard
│   │   └── settings/    # Profile, billing, notifications
│   ├── api/             # All API routes
│   └── page.tsx         # Landing page
├── components/          # UI components
├── models/              # MongoDB/Mongoose models
├── lib/                 # mongodb, openai, redis clients
├── hooks/               # useSocket, useStats
├── utils/               # cn(), spaced-repetition algo
└── types/               # TypeScript types
```

## Deployment

### Frontend (Vercel)
1. Push to GitHub
2. Import to vercel.com
3. Add all env vars in Vercel dashboard
4. Deploy

### Socket.io server (Railway)
1. Create new Railway project
2. Point to `/src/lib/socket-server.js`
3. Add `NEXT_PUBLIC_APP_URL` env var
4. Copy the Railway URL → set as `NEXT_PUBLIC_SOCKET_URL` in Vercel

### Clerk webhooks
1. Go to Clerk dashboard → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhook/clerk`
3. Subscribe to `user.created` and `user.deleted`
4. Copy signing secret → add as `CLERK_WEBHOOK_SECRET` in env

---

Built with: Next.js 15 · MongoDB · Socket.io · Clerk · OpenAI · Razorpay · Framer Motion · Tailwind CSS
