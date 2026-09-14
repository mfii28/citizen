---
target: homepage (src/app/page.tsx)
total_score: 25
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 3
target_identity: "file:C:\\Users\\manue\\OneDrive\\Documents\\citizen-project-new\\src\\app\\page.tsx"
target_fingerprint: "sha256:2b8fc8d1438020b7e82446d600d7049683b5fd0222f6d52a6ead957dde2ca9f1"
target_path: "C:\\Users\\manue\\OneDrive\\Documents\\citizen-project-new\\src\\app\\page.tsx"
timestamp: 2026-09-13T23-17-56Z
slug: src-app-page-tsx
closed: true
---
Method: dual-agent (A: a7637cbeff1b774f8 · B: a1a29d45d0d216cee)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Count-up/progress-fill communicate state well; fast-scroll can catch content mid-animation, briefly misrepresenting it as unloaded. |
| 2 | Match System / Real World | 4 | Genuinely local: named communities, GHS currency, dated five-event civic calendar, named partners. |
| 3 | User Control and Freedom | 3 | Mobile flyout has a clear close; nothing traps the visitor. |
| 4 | Consistency and Standards | 3 | DESIGN.md's pill/16px-radius/mono-for-numbers system applied consistently; undercut by the logo wrapping to 3 lines at the `lg` breakpoint. |
| 5 | Error Prevention | 3 | Little error-prone surface on this page; nothing observed to fault. |
| 6 | Recognition Rather Than Recall | 3 | Icon+label pairing helps; undercut on mobile by a flattened 17-item nav requiring recall instead of scannable grouping. |
| 7 | Flexibility and Efficiency | n/a | No power-user path expected on a static marketing homepage. |
| 8 | Aesthetic and Minimalist Design | 3 | Restrained 3-hue palette and flat cards read clean; the 2-name Partners strip reads as unfinished rather than intentionally minimal. |
| 9 | Error Recovery | 3 | No error states present on this page to evaluate. |
| 10 | Help and Documentation | n/a | Not the job of a marketing homepage; belongs on About/FAQ. |
| **Total** | | **25/32** | **Good (78%)** |

## Design Specificity Verdict

**LLM assessment:** Grounded, not generic. The "featured initiatives / upcoming events / testimonials / partners" template shape is standard NGO scaffolding, but every piece of content in it is specific to South Tongu District: named communities, a dated five-event civic calendar with NCCE-style programming, GHS currency, testimonials referencing specific initiatives, and named local partners (Ghana Health Service — South Tongu, Volta Traders Union). This could not be handed unchanged to an unrelated NGO.

**Deterministic scan:** The CLI detector (`impeccable detect --json`) returned one advisory finding — a 10px font size on the event-card month badge (`sections.tsx:101`), off DESIGN.md's documented type ramp (which bottoms out at 12px/Label). The in-browser detector (injected via `detect.js`) independently corroborated this as `undersized-ui-text` (10px, below an 11px floor) and additionally reported: 15× `ai-color-palette` hits on cyan/teal text over dark backgrounds, 5× on decorative cyan gradients, 4× WCAG AA contrast failures (2.7:1–4.0:1 against a 4.5:1 requirement, all on the ocean-blue brand color over white/light backgrounds), and 1× all-caps body-text run (43 characters). No clear false positives — the teal/cyan color itself is the documented brand identity, but the detector is still correct that several instances of it fail contrast regardless of intent.

**Visual overlays:** Browser mutation and script injection succeeded in a fresh tab; overlay findings were read from the console rather than a persistent on-page overlay (this detector build reports via console, not a DOM overlay). Additionally, screenshot inspection during scroll caught the sticky/frosted navbar visibly ghosting the tops of large stat numerals ("Communities reached", GHS raised) as they scroll underneath it.

## Overall Impression

The homepage's content and mechanics (the funding progress bar, the dated event calendar, the specific testimonials) are genuinely on-brand and hard to mistake for a different organization's site — that's the hardest part of this kind of critique to earn, and it's earned here. What's missing is follow-through at the edges: mobile loses the desktop nav's grouping and its persistent path to Donate, several instances of the brand's own signature blue fail contrast against light backgrounds, and the page's structure ends on its weakest section (a 2-name partner strip) right after its emotional peak (testimonials) instead of converting that trust into a final ask. The single biggest opportunity: close the gap between "this page clearly knows what it's for" (content) and "this page is easy to act on" (mobile IA + a closing CTA).

## What's Working

1. **The initiative funding mechanic** — GH₵ mono figure, percent, and the ocean-to-leaf gradient progress bar — is a real, on-brand execution of DESIGN.md's "public ledger" thesis, not a generic "donate now" card.
2. **The five-event civic calendar**, rendered with mono day/month date-stamps, is content a generic NGO template could not credibly reuse — it's the site's actual positioning made visible on the homepage.
3. **The hero's tideline motion** (a slow, 22s mirrored SVG wave) is a restrained signature element that references the Volta estuary without a literal photo or map-pin cliché.

## Priority Issues

**[P1] No persistent Donate access on mobile past the hero**
- **Why it matters:** This is a Persuade-mode page whose job is conversion at the moment trust peaks (right after testimonials). On mobile, once scrolled past the hero, Donate/Volunteer/Report exist only inside a flat 17-link hamburger flyout — forcing a multi-tap detour exactly when friction costs the most, for the audience segment (mobile, South Tongu) most likely to be majority traffic.
- **Fix:** Add a small persistent Donate affordance to the collapsed mobile header, next to the hamburger icon.
- **Suggested command:** `/impeccable clarify`

**[P1] Mobile nav flattens all 17 links with no grouping**
- **Why it matters:** Desktop groups items into "About" and "Get Involved" dropdowns; the mobile flyout (`navbar.tsx`'s `NAV.flatMap(...)`) discards that structure into one undifferentiated list of 17 items. A first-time visitor has to read serially through all of them to find "Report a Social Issue" — exactly the IA scaffolding that makes the page scannable on desktop disappears where scanning is hardest.
- **Fix:** Reintroduce group eyebrow labels ("ABOUT" / "GET INVOLVED") above their sub-lists in the mobile flyout instead of flattening.
- **Suggested command:** `/impeccable clarify`

**[P1] WCAG AA contrast failures on the brand's own blue**
- **Why it matters:** The in-browser detector measured 4 concrete failures — `#1e8aa8` text at 4.0:1 on white and 3.7:1 on the lightest mist tint, `#45aac3` at 2.7:1 on white — all below the 4.5:1 body-text requirement. This is the site's primary brand color, so the failure is widespread rather than a one-off, and it directly hits low-vision visitors on a civic-accountability site that should be usable by everyone it serves.
- **Fix:** Darken the affected text instances toward `ocean-600`/`ocean-700` (both already in DESIGN.md's ramp) wherever ocean-500/400 currently renders as body or label text on light backgrounds.
- **Suggested command:** `/impeccable audit`

**[P2] Logo wraps to 3 lines at ~1024px width**
- **Why it matters:** "The Citizen Project" wraps into "The / Citizen / Project" right next to "Home" at browser widths around the `lg` (1024px) breakpoint — reproducible on every reload at that width. This is the org's own logo lockup appearing broken on a very common laptop viewport, a visible credibility problem for a site whose whole thesis is "sober, factual, accountable."
- **Fix:** Add `whitespace-nowrap`/`shrink-0` to the logo flex item, or shift the nav-links breakpoint earlier.
- **Suggested command:** `/impeccable harden`

**[P2] No closing conversion section before the footer**
- **Why it matters:** Page order is Hero → Stats → Initiatives → Events → Testimonials → Partners (2 names) → Footer, with no reinforcing CTA band after the emotional peak (testimonials). Visitors who read all the way through get a sparse partner strip and a standard footer instead of a decisive next step — a peak-end violation on a page whose job is conversion.
- **Fix:** Add a compact closing CTA band (headline + Donate/Volunteer) between Testimonials/Partners and the Footer.
- **Suggested command:** `/impeccable distill`

## Persona Red Flags

**Jordan (First-Timer):** Asked to choose among 4 hero CTAs (Donate/Volunteer/Report/Join Us) after only two sentences of context — asked to commit before understanding the org. Reaches the stats band and sees "GH₵5,350 raised" / "3 Initiatives" — small numbers in bold ledger mono may read as "this org is small/new" before reaching the more convincing calendar or testimonials. Ends the page on exactly 2 partner names right before the footer, reinforcing that impression with nothing to counter it.

**Riley (Stress Tester):** Resizing to ~1024px — a common, legitimate width — reliably breaks the navbar logo into 3 lines. Fast repeated scrolling catches Reveal-animated content (3rd initiative card, 3rd testimonial, partner names) at ~10-20% opacity mid-transition on every brisk pass, reading like a rendering bug. `StatCounter`'s count-up is catchable showing literal "0 Initiatives" / "0 Communities" within the first second the stats band enters view — an alarming false signal on a transparency-focused site if screenshotted at the wrong moment.

**Casey (Mobile):** No persistent Donate affordance once scrolled past the hero — must reopen the hamburger and scan 17 flat, ungrouped links to find Donate, Volunteer, or Report a Social Issue. On first paint, hero copy/buttons sit at very low opacity for a couple of seconds during the entrance animation; on a slow connection this window could stretch into a near-black screen with no visible CTA.

**Sam (Accessibility-Dependent):** The detector measured the site's own primary brand blue failing WCAG AA in multiple places (2.7:1–4.0:1 against a 4.5:1 requirement) — text Sam may already be straining to read drops further below the line specifically where the brand's signature color is used at body/label size, on both light and near-white backgrounds.

## Minor Observations

- The event-card month badge ("Oct", "Nov", etc.) renders at 10px — below both DESIGN.md's documented 12px type floor and a general 11px legibility floor; confirmed independently by the CLI scan and the in-browser detector.
- A 43-character run of body text renders in all-caps — flagged by the detector as a readability antipattern at that length.
- Scrolling reveals the sticky/frosted navbar visibly ghosting the tops of large stat numerals as they pass underneath it — may be intentional frosted-header behavior, but reads as clipped/cut-off text.
- "Report a Social Issue" — one of the org's three named primary actions per PRODUCT.md — sits 4th of 5 items inside the "Get Involved" dropdown rather than being promoted.
- `SectionHeading` + its "View all" link wraps onto separate lines at narrow widths, creating slightly awkward vertical rhythm on mobile/tablet.
- All 6 footer social icons link to `href="#"` (expected — no real socials yet per PRODUCT.md) with no visible feedback on tap.
- The hero eyebrow text (ocean-300 mono on ocean-950) is the lowest-contrast text on the page by visual inspection, consistent with the detector's broader contrast findings.

## Questions to Consider

1. If the page's highest-emotion content (testimonials) sits second-to-last with nothing asking the reader to act right after it, is this homepage optimized to convert, or just to inform?
2. PRODUCT.md names the transparency dashboard and community-issue map as the two mechanisms no generic NGO could credibly copy — yet neither is referenced on the homepage itself. Should the homepage foreground the org's actual differentiators more than its generic initiatives/events/testimonials template does?
3. Given DESIGN.md's own thesis is "confidence comes from showing real numbers plainly," does leading with a raw GH₵5,350 total (rather than, say, percent-funded per initiative) help or hurt first-time trust when the absolute number is this small?
