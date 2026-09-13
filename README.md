# The Citizen Project — Website

A Next.js 14 (App Router) + TypeScript + Tailwind **static frontend** for The Citizen Project's public website,
built around South Tongu District, Ghana.

## Architecture

This build has **no backend**: no database, no authentication, and no server-side data mutation. Every page
reads from a single static fixture file, [`src/lib/mock-data.ts`](src/lib/mock-data.ts) — edit that file to
change what appears on Initiatives, Events, Blog, Donate, Transparency, Ambassadors, and the other data-driven
pages.

Forms (newsletter, contact, survey, partner application, donation) are client-side only: submitting one shows
a local confirmation message, but nothing is sent anywhere or persisted. There is no login, admin dashboard,
donor account area, or payment processing — those all required a real backend and have been removed.

## What's in this build

- Public pages, driven by the static fixtures: Home, About, Vision, Mission, Initiatives (list + detail),
  Events, Donate, Transparency Dashboard (charts), Blog (list + post), Partners (directory + application),
  Volunteer, Ambassadors (leaderboard), Contact, Community Survey ("Report a Social Issue"),
  Community Map (Leaflet/OpenStreetMap), Success Stories, Media Gallery, Reports, Impact Dashboard, Search,
  Privacy/Terms/Cookies.
- Dark/light mode, responsive nav with mobile menu, SEO metadata, sitemap.xml, robots.txt, PWA manifest.
- Client-only forms with local "thank you" confirmation states — no network calls, no persistence.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

No environment variables are required to run the site. `.env.example` only documents
`NEXT_PUBLIC_SITE_URL`, used for SEO metadata.

## Folder structure

```
src/app/           one folder per route (App Router)
src/components/    ui.tsx (shared primitives), layout/, home/, forms/, charts/
src/lib/           mock-data.ts (all site content), utils, communities (map coordinates)
src/types/         shared enums/constants
```

## Design notes

Ocean-blue palette (from Tailwind's `ocean` scale) reflects South Tongu's location on the Volta estuary, with
a gold accent from Ghana's flag used sparingly for calls to action. Headings use Space Grotesk, body text uses
Inter, and data/stats use IBM Plex Mono — a deliberate "public ledger" feel for the transparency-first parts
of the site.

## Adding a real backend later

If this site needs a database, authentication, or real donation processing again, the previous full-stack
build (Prisma/PostgreSQL, NextAuth, Server Actions, Paystack) is preserved in the git history — see the
"Initial commit" before the backend was removed.
