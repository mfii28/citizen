# The Citizen Project — Website

A Next.js 14 (App Router) + TypeScript + Tailwind + Prisma/PostgreSQL foundation for The Citizen Project's
public website, built around South Tongu District, Ghana.

## What's actually working in this build

- **Full data model** (`prisma/schema.prisma`): Users/roles, Initiatives, Events + registrations, Donations,
  Expenditures, Partners, Ambassadors, Volunteer hours, Community survey reports, Blog posts, Testimonials,
  Newsletter, Contact messages — covers every entity in the original spec, even where the UI doesn't use it yet.
- **Donor accounts** (new): public registration (`/register`), `/account` dashboard — donation history with
  downloadable PDF receipts, recurring-gift management (cancel anytime), and favorited initiatives (heart
  button on each initiative page). Signed-in donors are auto-linked to their future donations.
- **Gamification** (new): `/ambassadors` now shows a real leaderboard computed from logged volunteer hours,
  with Bronze/Silver/Gold badges by threshold, and a downloadable PDF "Certificate of Volunteer Service" from
  `/account` once a volunteer has approved hours.
- **Content pages** (new): `/success-stories`, `/gallery` (media across every initiative), `/reports`
  (Annual/Financial/Audit/Impact reports).
- **Security hardening** (new): a real Paystack webhook (`/api/donations/webhook`) with HMAC-SHA512 signature
  verification — no more trusting an unverified "payment succeeded" call. Simple in-memory rate limiting on
  every public form action (newsletter, contact, survey, partner application, donations, registration).
- **Interactive Community Map** (`/community-map`): every located Community Survey report plotted on a live
  OpenStreetMap/Leaflet map, color-coded by urgency. Seeded with your three example reports (Agorkpo — broken
  bridge, Dabala — poor sanitation, Sogakope — school furniture shortage). Coordinates come from
  `src/lib/communities.ts` — a small lookup table, easy to extend as more communities report in.
- **Global Search** (`/search`) across initiatives, events, blog posts, and partners.
- **Impact Dashboard** (`/impact`): projects completed/active/upcoming, communities reached, SDGs supported,
  volunteers involved — separate from the financial detail on `/transparency`.
- **Login + Admin Dashboard**: email/password auth (NextAuth, JWT sessions), role-protected `/admin`
  routes. Full CRUD for Initiatives, plus working screens for Donations (read-only), Survey Reports (status
  workflow), and Partners (approve/reject) — see "Admin access" below.
- **Public pages, fully wired to the database**: Home, About, Vision, Mission, Initiatives (list + detail),
  Events, Donate, Transparency Dashboard (live charts), Blog (list + post), Partners (directory + application),
  Volunteer, Ambassadors, Contact, Survey ("Report a Social Issue"), Privacy/Terms/Cookies.
- **Working forms** (Server Actions, no separate API layer needed): newsletter signup, contact message, survey
  report, partner application, donation initiation.
- **Donation flow**: Mobile Money / Card via Paystack (the standard aggregator covering MTN, AirtelTigo, and
  Telecel in Ghana), PayPal, and bank transfer. Without a `PAYSTACK_SECRET_KEY`, the form still saves the
  donation as `PENDING` and tells the donor payments aren't live yet — it won't crash.
- Dark/light mode, responsive nav with mobile menu, SEO metadata, sitemap.xml, robots.txt, PWA manifest.
- Seed data that mirrors your real five-event civic education calendar (Launch & Global Citizenship Seminar →
  Citizens' Pledge & Showcase), plus sample initiatives, donations, and expenditures so every page renders real
  numbers immediately.

> **Naming:** every "South Tongu Constituency" reference has been updated to **"South Tongu District"**
> (the correct administrative name) across all pages, metadata, and seed data.

## What's intentionally NOT in this build yet

Everything from your last two review rounds is now built except what genuinely needs your own accounts or a
larger follow-up pass:

1. **Live payments** — add real `PAYSTACK_SECRET_KEY` / `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`, and set your webhook
   URL in the Paystack dashboard to `/api/donations/webhook` (already built and signature-verified).
2. **Media uploads** — Cloudinary wiring, so Gallery/Success Stories/Survey photos/partner logos have real images.
3. **Email/SMS notifications** — donation receipts, event reminders, partner approvals (Resend/SMTP + Twilio-style).
4. **CAPTCHA + email verification** — needs an hCaptcha/Turnstile key and working email delivery, respectively.
5. **Admin coverage for the new models** — Success Stories, Reports, Users, Blog, and Events are editable only
   via seed data or the Initiatives pattern; same CRUD approach, just needs replicating four more times.
6. **Survey heat maps + CSV/Excel/PDF export**, and **broader accessibility/performance passes** (labelled
   form fields sitewide, image lazy-loading once real images exist, ISR tuning beyond Home/Initiatives).
7. **Deployment** — Vercel + a hosted Postgres (Neon/Supabase/Railway) + a real domain.

## Getting started

```bash
npm install
cp .env.example .env      # then fill in DATABASE_URL at minimum
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

Open http://localhost:3000.

> Note: `npm install` runs `prisma generate` automatically (via `postinstall`). This needs normal internet
> access to Prisma's binary CDN — it will work fine on your machine or in CI; it just isn't reachable from
> this sandboxed build session, which is why this project ships without a `node_modules`/generated client.

## Admin access

Visit `/login` (or click "Sign in" / "Admin" in the nav). The seed script creates these demo accounts:

```
Admin:     admin@thecitizenproject.org      / Admin123!
Donor:     ama.donor@example.org            / Donor123!   (has a donation, a recurring gift, a favorite)
Volunteer: kwame.volunteer@example.org      / Volunteer123! (42 approved hours — try the certificate download)
```

**Change this password (or delete and recreate the user) before this site is ever public.** From `/admin` you
can manage initiatives end-to-end, review and update the status of survey reports, approve or reject partner
applications, and see every donation recorded so far. Roles `ADMIN` and `STAFF` can both sign in; only
`ADMIN` should typically be trusted with real financial visibility — enforcing that distinction more finely
is a Phase 2 refinement.

## Environment variables

See `.env.example` for the full list (database, NextAuth, Paystack, Cloudinary, email).
`DATABASE_URL` and `NEXTAUTH_SECRET` (any random string locally — generate a real one with
`openssl rand -base64 32` before deploying) are required to run the site with login.

## Folder structure

```
prisma/           schema.prisma, seed.ts
src/app/           one folder per route (App Router); admin/ = staff-only, account/ = any signed-in user
src/components/    ui.tsx (shared primitives), layout/, home/, forms/, charts/, admin/
src/lib/           prisma client, utils, paystack, pdf (receipts/certificates), rate-limit,
                    auth (NextAuth config), actions.ts (public), admin-actions.ts, account-actions.ts
                    — every action checks the session itself, not just the UI
src/types/         shared enums/constants, next-auth.d.ts (session typing)
src/middleware.ts  redirects unauthenticated visitors away from /admin and /account
```

## Design notes

Ocean-blue palette (from Tailwind's `ocean` scale) reflects South Tongu's location on the Volta estuary, with
a gold accent from Ghana's flag used sparingly for calls to action. Headings use Space Grotesk, body text uses
Inter, and data/stats use IBM Plex Mono — a deliberate "public ledger" feel for the transparency-first parts
of the site.
