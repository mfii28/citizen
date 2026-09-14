# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: prospective donors, volunteers, and community members in South Tongu District, Volta Region, Ghana, who want to learn about The Citizen Project's initiatives, donate, volunteer, report a local social issue, or check the transparency dashboard before trusting the org with money or time.

Secondary: partner organizations (schools, government agencies, community groups, NGOs) considering a formal collaboration, and prospective ambassadors/volunteers checking the leaderboard and certificate program.

Operator: The Citizen Project — the client organization this site is built for, who will review the build and eventually operate it and its content.

## Product Purpose

Promote civic responsibility, community development, education, youth empowerment, environmental sustainability, and social justice across South Tongu District, Ghana. Success means a visitor understands what the org actually does, trusts its financial transparency, and takes one concrete action: donates, volunteers, applies to partner, or reports a community issue.

## Positioning

Two mechanisms a generic "civic NGO" site would not credibly copy:

1. A structured five-event civic education calendar (launch seminar → adolescence/social-vices dialogue → community-responsibility play-based event → national service day → closing pledge ceremony), tied explicitly to the National Commission for Civic Education's mandate and UN SDG 4.
2. Visible accountability infrastructure: a public "ledger-style" transparency dashboard (real donation/expenditure figures, not aggregated PR numbers) and a community-reported issue map (Leaflet/OpenStreetMap) showing exactly what residents flagged and its resolution status — accountability as a designed feature, not a claim.

## Operating Context

South Tongu District, Volta Region, Ghana — communities along the Volta estuary (Sogakope, Dabala, Agorkpo, and others). The org runs community initiatives (civic education, environmental clean-up, youth livelihood/skills), a recurring event calendar, a volunteer/ambassador program with logged hours and badges, a partner network (schools, government agencies, community groups), and a donor relationship built on public financial disclosure.

## Capabilities and Constraints

- **Currently a static frontend by design, temporarily.** As of this build, there is no database, authentication, or real payment processing — all data (initiatives, donations, partners, survey reports, blog posts, financial figures, the ambassador leaderboard) comes from a single static fixture file (`src/lib/mock-data.ts`). Forms show a local "thank you" confirmation and persist nothing.
- **The backend is expected to return in a later phase** (a previous build had Prisma/PostgreSQL, NextAuth, Server Actions, and Paystack/PayPal donation processing — preserved in git history). Until then, avoid decisions that would be painful to reverse when real data, accounts, and payments are reconnected — e.g. don't bake "there is no logged-in user" assumptions into content or layout in ways that would need rework later.
- **No media pipeline yet.** Image uploads (would-be Cloudinary integration) were never wired up; Gallery intentionally shows an empty/placeholder state. Success Stories can carry an optional interview slot (video/audio placeholder + transcript excerpt) that reads as "footage coming soon" — a UI placeholder, not real beneficiary media, until real files exist.
- **All current content is placeholder.** Partner names, donation figures, survey reports, testimonials, blog posts, initiative milestones, and interview transcripts are illustrative, not real organizational data — every one should be treated as replaceable, not evidence of real activity.
- **The Survey form captures live geolocation and persists client-side.** "Report a Social Issue" can request the browser's GPS location (with a manual community/town fallback when denied/unavailable) and saves the submitted report to that device's `localStorage` only (`src/lib/local-reports.ts`) — visible on the Community Map for that visitor alone, not shared with other visitors, until the real backend returns. Map pins support a full-report detail view and a client-side PDF export (`jspdf`) of any single report, seeded or device-local.
- **Initiatives carry a milestone/phase timeline**, separate from the funding progress bar — each initiative has 3–5 dated stages (complete/current/upcoming) shown on its detail page and summarized as a phase chip on initiative cards (homepage and list).

## Brand Commitments

- Name: **The Citizen Project**. Tagline: "One citizen. One community. One responsibility."
- Ocean-blue palette (Tailwind `ocean` scale), evoking South Tongu's location on the Volta estuary, with a gold accent (from Ghana's flag) used sparingly for calls to action.
- Typography: Space Grotesk for headings, Inter for body text, IBM Plex Mono for data/stats — a deliberate "public ledger" feel on transparency-related content.

## Evidence on Hand

No real logos, photos, partner organizations, or financial figures exist yet. All content currently on the site (donations, partners, survey reports, blog posts, testimonials, the volunteer leaderboard) is clearly-labeled illustrative/mock content pending real material from the client. Future design work must not treat any of it as a real testimonial, real partner, or real number.

## Product Principles

1. Transparency reads as a public ledger, not a PR figure — financial and impact numbers should look audited, not marketed.
2. Every page routes toward one concrete civic action (donate, volunteer, report, partner) rather than staying purely informational.
3. South Tongu's real geography and named communities anchor the content — avoid generic "impact org" tropes that could belong to any NGO anywhere.
4. Design for reversibility: the backend returns later, so avoid static-only shortcuts that would be costly to unwind.
