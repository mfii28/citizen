---
name: The Citizen Project
description: A civic-education and transparency-first NGO site for South Tongu District, Ghana
colors:
  ocean-primary: "#1E8AA8"
  ocean-secondary: "#125771"
  ocean-secondary-hover: "#146D8A"
  ocean-deep: "#081D26"
  ocean-ink: "#0F3549"
  ocean-surface-dark: "#12455B"
  ocean-line: "#DCEFF5"
  ocean-mist: "#EFF8FB"
  gold-accent: "#E8A233"
  gold-bright: "#F2B84B"
  gold-deep: "#C4841F"
  leaf-progress: "#3D9A6C"
  leaf-bright: "#5FB88A"
  critical-red: "#DC2626"
typography:
  display:
    fontFamily: "Space Grotesk, ui-sans-serif, sans-serif"
    fontSize: "clamp(1.875rem, 4vw, 3.75rem)"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Inter, ui-sans-serif, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    letterSpacing: "0.2em"
rounded:
  sm: "8px"
  lg: "16px"
  pill: "9999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "64px"
  xl: "96px"
components:
  button-primary:
    backgroundColor: "{colors.gold-accent}"
    textColor: "{colors.ocean-deep}"
    rounded: "{rounded.pill}"
    padding: "14px 28px"
  button-primary-hover:
    backgroundColor: "{colors.gold-bright}"
  button-secondary:
    backgroundColor: "{colors.ocean-secondary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.pill}"
    padding: "14px 28px"
  button-secondary-hover:
    backgroundColor: "{colors.ocean-secondary-hover}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "#FFFFFF"
    rounded: "{rounded.pill}"
    padding: "14px 28px"
  badge-ocean:
    backgroundColor: "{colors.ocean-line}"
    textColor: "{colors.ocean-secondary}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  badge-gold:
    backgroundColor: "{colors.gold-bright}"
    textColor: "{colors.gold-deep}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  badge-leaf:
    backgroundColor: "{colors.leaf-bright}"
    textColor: "{colors.leaf-progress}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  card:
    backgroundColor: "#FFFFFF"
    rounded: "{rounded.lg}"
    padding: "24px"
  input:
    backgroundColor: "#FFFFFF"
    rounded: "{rounded.sm}"
    padding: "10px 12px"
---

# Design System: The Citizen Project

## Overview

**Creative North Star: "The Estuary Ledger"**

The Citizen Project's design reads like a public ledger set on the bank of the Volta estuary: sober, factual, and accountable, with a single recurring tideline motif tying the civic mission back to its place. The system is grounded and transparent by design — confidence comes from showing real numbers plainly (mono-font stats, an ocean-to-leaf progress gradient that visually reads as "money moving toward good"), not from decorative polish. Color is used with restraint: two calm blues do most of the work, gold marks the handful of moments that matter (primary actions, SDG tags, the one accent word in the hero), and a reserved red appears only for genuine urgency.

Surfaces stay flat at rest — cards carry only a faint, ocean-tinted shadow, never a plain black one — and depth is something the interface earns through interaction (a hover lift, a focus ring) rather than something applied everywhere by default. The one moment of motion the system allows itself unprompted is the hero's tideline: a slow, looping wave beneath the headline, referencing the Volta without needing to say so.

**Key Characteristics:**
- Three-hue palette (ocean blue, Ghana-flag gold, leaf green) doing double duty as both brand color and the entire neutral scale — there is no separate gray
- Mono font (IBM Plex Mono) reserved specifically for numbers, dates, and eyebrows — a deliberate "ledger" signal, never used for prose
- Fully pill-shaped buttons and badges; cards and inputs use a softer, partial radius — two distinct silhouette families, never mixed
- Flat-by-default surfaces that lift only on hover/focus; shadows are always ocean-tinted, never neutral black
- Red is reserved exclusively for "Critical" urgency and the active-favorite heart — it never appears decoratively

## Colors

A three-hue palette — Deep Estuary Blue, Ghana Flag Gold, Riverbank Leaf Green — plus a reserved alert red, where the blue scale also serves as the system's entire neutral/background ramp (there is no separate gray scale anywhere in the project).

### Primary
- **Deep Estuary Blue** (`#1E8AA8`, ocean-500): the core brand blue — nav active states, links, chart "raised" series, icons.
- **Estuary Ink** (`#125771`, ocean-700): secondary-button fill and darker blue accents (hover: `#146D8A`, ocean-600).

### Secondary
- **Ghana Flag Gold** (`#E8A233`, gold-500): primary CTA fill (Donate, Submit buttons), SDG tag badges, the one accent word in the hero headline. Hover/brighter state: `#F2B84B` (gold-400). Deeper text-on-light variant: `#C4841F` (gold-600).

### Tertiary
- **Riverbank Leaf Green** (`#3D9A6C`, leaf-500): positive/progress signal — the far end of every funding progress-bar gradient, "Low" urgency map pins, environmental-initiative badges. Lighter tint for badge backgrounds: `#5FB88A` (leaf-400).

### Neutral
- **Estuary Deep** (`#081D26`, ocean-950): darkest surface — hero/footer background, dark-mode page background, and (inverted) the text color sitting on gold buttons.
- **Estuary Dusk** (`#0F3549`, ocean-900) and **Estuary Surface** (`#12455B`, ocean-800): dark-mode card backgrounds and borders.
- **Estuary Mist Line** (`#DCEFF5`, ocean-100): light-mode borders, dividers, and the default badge background.
- **Estuary Mist** (`#EFF8FB`, ocean-50): the lightest tint, used sparingly for subtle section backgrounds.

### Named Rules
**The One Palette Rule.** There is no separate gray scale. Every neutral — backgrounds, borders, dividers, muted text — is drawn from the ocean blue scale at low saturation/high or low lightness. A gray hex value anywhere in this system is a bug, not a shortcut.

**The Reserved Red Rule.** `#DC2626` (critical-red) appears in exactly two places: the "Critical" urgency map pin and the active/filled favorite heart. It is never used decoratively, for generic errors, or for anything the user did not flag as urgent.

## Typography

**Display Font:** Space Grotesk (with system sans-serif fallback)
**Body Font:** Inter (with system sans-serif fallback)
**Label/Mono Font:** IBM Plex Mono (with system monospace fallback)

**Character:** Space Grotesk's geometric, slightly technical display forms pair with Inter's warm, highly-legible body text — confident headlines over approachable prose. IBM Plex Mono is the system's signature move: it never carries prose, only numbers, dates, and short uppercase labels, so its appearance itself signals "this is data, treat it as fact."

### Hierarchy
- **Display** (600 weight, `clamp(1.875rem, 4vw, 3.75rem)`, line-height 1.08, tracking -0.01em): hero and section H1/H2 headlines. Set with `text-wrap: balance` so multi-line headlines break evenly.
- **Headline** (600 weight, 1.5rem–1.875rem): section and card titles (`h3`, `SectionHeading`).
- **Body** (400 weight, 1rem, line-height 1.6): all prose. Inter is rendered with stylistic sets cv02/cv03/cv04/cv11 enabled globally for slightly warmer numeral and letterform shapes.
- **Label** (500 weight, 0.75rem, letter-spacing 0.2em, uppercase): eyebrows above headings, stat labels, dates, and every donation/expenditure figure on the transparency dashboard.

### Named Rules
**The Ledger Font Rule.** IBM Plex Mono renders only numbers, dates, and short uppercase labels — donation amounts, percentages, timestamps, eyebrows. The moment a paragraph of prose appears in mono, the "public ledger" signal breaks; it does not happen anywhere in this system.

## Layout

A single `container-page` utility (`max-width: 80rem`, horizontal padding 20px→32px at `sm`) centers all page content; a `section-y` utility (padding 64px→96px vertical at `sm`) sets the rhythm between major sections. Card grids default to 1 column on mobile, 2 at `sm`, 3 at `lg` — used identically for initiatives, blog posts, partners, and success stories. The header is a sticky, frosted-glass bar (`backdrop-blur-md`, 90%-opacity background) with a desktop horizontal nav (hover-reveal dropdown groups for "About" and "Get Involved") collapsing to a full-height mobile flyout below `lg`.

## Elevation & Depth

Flat-by-default, lift-on-interaction. At rest, cards carry only a barely-visible shadow tinted with the deep ocean color (`shadow-ocean-950/[0.03]`) rather than plain black — depth is nearly imperceptible until the user does something. Clickable cards (initiatives, blog posts, partners) add a visible lift (`-translate-y-1` + a stronger shadow) only on hover, and every focusable element gets a gold-colored focus ring (`ring-2 ring-gold-500`) rather than a shadow change. There is no ambient/constant elevation anywhere in the system; shadow strength is always a direct response to state.

### Shadow Vocabulary
- **Resting** (`box-shadow: 0 1px 2px rgba(8,29,38,0.03)` equivalent — `shadow-sm shadow-ocean-950/[0.03]`): the only shadow present at rest, on every card.
- **Hover-lift** (`hover:shadow-lg` + `hover:-translate-y-1`): the interaction response on clickable cards; never present at rest.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows exist only as a response to hover or focus, and are always tinted with the deep ocean color — never neutral black.

## Shapes

Two deliberately distinct radius families, never mixed. **Pill** (`rounded-full`, effectively 9999px) governs every button and badge — the fully-rounded silhouette is the system's "actionable/tag" signal. **Soft** (`rounded-2xl`, 16px) governs cards and their image-header blocks — generous but not pill-shaped, signaling "container" rather than "action." Inputs sit in between at a smaller 8px (`rounded-lg`), distinct from both. Borders are hairline (1px) and always drawn from the ocean neutral scale (`border-ocean-100` light / `border-ocean-800` dark); no component uses a colored border at rest.

## Components

Warm but official: soft pill-shaped buttons and generously rounded cards read as approachable, while crisp hairline borders and mono-font data keep everything feeling credible and audited rather than casual.

### Buttons
- **Shape:** fully pill-shaped (`rounded-full`) at every size.
- **Primary:** Ghana Flag Gold fill (`#E8A233`) with Estuary Deep text (`#081D26`) — reserved for the single most important action per context (Donate, Submit). Padding scales by size: 16px/8px (sm) → 20px/10px (md) → 28px/14px (lg).
- **Secondary:** solid Estuary Ink fill (`#125771`) with white text — the "confirm, but not the headline action" button (e.g. "Volunteer for this initiative").
- **Outline / Ghost:** transparent with a white or ocean border/text — used on dark hero backgrounds and for tertiary actions.
- **Hover / Focus:** primary brightens to gold-400; secondary brightens to ocean-600; all buttons get the shared gold focus ring on keyboard focus. Disabled state drops to 50% opacity and disables pointer events — no separate disabled color.

### Badges
- **Style:** pill-shaped, `text-xs font-medium`, no border. Three tones only: ocean (light blue bg, ocean-ink text — the default/neutral tag), gold (used for SDG tags and impact-metric highlights), leaf (used for "positive" or environmental tags).
- **State:** static, no hover/interactive behavior — badges are labels, not controls.

### Cards / Containers
- **Corner Style:** 16px (`rounded-2xl`).
- **Background:** white (light) / Estuary Surface `#12455B` (dark).
- **Shadow Strategy:** see Elevation & Depth — flat at rest, lift only on hover for clickable cards.
- **Border:** 1px hairline, Estuary Mist Line (`#DCEFF5`) light / Estuary Surface `#12455B` dark.
- **Internal Padding:** 20–24px (`p-5`/`p-6`) is the default; compact list-row cards use 16px (`p-4`).

### Inputs / Fields
- **Style:** 8px radius (`rounded-lg`), 1px Estuary Mist Line border, white background (dark: ocean-900).
- **Focus:** border shifts to Deep Estuary Blue (`ocean-500`); no glow or shadow added.
- **Disabled:** 60% opacity with a not-allowed cursor, used specifically for the "needs a future integration" file inputs (photo/logo/proposal uploads).

### Navigation
- **Style:** sticky frosted-glass header (`backdrop-blur-md`, white/90% light, ocean-950/90% dark). Top-level items are plain text links; grouped items ("About", "Get Involved") reveal a dropdown panel on hover with `rounded-xl` corners and the same card shadow language.
- **States:** active route gets a light ocean tint background; hover gets the same tint at lower opacity. Mobile collapses to a hamburger-triggered full-width flyout panel below the header.

### Progress Bar (signature component)
A 2px-tall pill track (Estuary Mist Line background) filled with a gradient from Deep Estuary Blue to Riverbank Leaf Green, animated over 700ms on value change. This is the system's clearest embodiment of its North Star: funding progress is never a flat color, it visually reads as money moving from "raised" (blue) toward "impact" (green).

### Tideline Motif (signature component)
A looping, slowly-drifting SVG wave (22s mirror-loop) sits beneath hero headlines on a deep ocean background, in a low-opacity ocean gradient. It is the system's one piece of ambient, non-interactive motion, and it appears only in the hero — never repeated elsewhere as decoration.

## Do's and Don'ts

### Do:
- **Do** reserve IBM Plex Mono exclusively for numbers, dates, and short uppercase labels — never prose.
- **Do** use the ocean→leaf gradient specifically for funding/progress bars; never a flat single-color fill for progress.
- **Do** keep cards flat at rest and lift them only on hover/focus — depth is earned by interaction, not applied by default.
- **Do** draw every border and neutral tone from the ocean blue scale — there is no separate gray in this system.
- **Do** keep buttons and badges fully pill-shaped; keep cards and inputs on their own, smaller radius.

### Don't:
- **Don't** use a plain black or gray shadow anywhere — shadows are always ocean-tinted.
- **Don't** use the reserved red (`#DC2626`) for anything other than "Critical" urgency and the active favorite heart.
- **Don't** introduce a fourth accent hue — the system commits to exactly three (ocean, gold, leaf) plus the one reserved red.
- **Don't** repeat the hero's tideline animation elsewhere as generic decoration; it is a one-place signature, not a reusable pattern.
