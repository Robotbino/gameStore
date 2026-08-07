---
name: GameStore
description: A cinematic, single-accent dark storefront where one gold light does all the work.
colors:
  bg-primary: "#121212"
  bg-raised: "#1a1a1a"
  bg-card-hover: "#1e1e1e"
  bg-sidebar: "#0f0f0f"
  border-subtle: "#1e1e1e"
  border-medium: "#2a2a2a"
  border-strong: "#333333"
  text-primary: "#e8e8e8"
  text-secondary: "#aaaaaa"
  text-muted: "#666666"
  text-faint: "#555555"
  marquee-gold: "#F5C518"
  marquee-gold-hover: "#e0b200"
  ink-on-gold: "#000000"
  spotlight-white: "#ffffff"
  danger: "#ff6b6b"
typography:
  display:
    fontFamily: "Sora Variable, Sora, sans-serif"
    fontSize: "clamp(1.5rem, 3vw, 2.5rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Sora Variable, Sora, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Sora Variable, Sora, sans-serif"
    fontSize: "1.1rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "normal"
  body:
    fontFamily: "DM Sans Variable, DM Sans, -apple-system, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "DM Sans Variable, DM Sans, sans-serif"
    fontSize: "0.7rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.08em"
rounded:
  xs: "4px"
  sm: "6px"
  md: "8px"
  lg: "10px"
  xl: "12px"
  2xl: "14px"
  3xl: "20px"
  pill: "999px"
  full: "50%"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.marquee-gold}"
    textColor: "{colors.ink-on-gold}"
    rounded: "{rounded.sm}"
    padding: "10px 28px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.marquee-gold-hover}"
    textColor: "{colors.ink-on-gold}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.sm}"
    padding: "10px 24px"
  button-outline-hover:
    textColor: "{colors.spotlight-white}"
  button-danger:
    backgroundColor: "transparent"
    textColor: "{colors.danger}"
    rounded: "{rounded.sm}"
    padding: "10px 24px"
  game-card:
    backgroundColor: "transparent"
    rounded: "{rounded.md}"
  game-card-hover:
    backgroundColor: "{colors.bg-card-hover}"
  input:
    backgroundColor: "{colors.bg-primary}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "9px 12px"
  chip-genre:
    backgroundColor: "rgba(245, 197, 24, 0.08)"
    textColor: "{colors.marquee-gold}"
    rounded: "{rounded.pill}"
    padding: "3px 10px"
  stat-card:
    backgroundColor: "{colors.bg-raised}"
    rounded: "{rounded.xl}"
    padding: "24px"
---

# Design System: GameStore

## Overview

**Creative North Star: "The Midnight Marquee"**

GameStore is a dark street with a single warm-gold light over the door. Every surface is near-black; the imagery — game posters and cinematic hero art — supplies the color and the heat. Against that quiet ground, one gold (Marquee Gold, `#F5C518`) does all of the signalling: it names the price, the action, the active tab, the focused field. The discipline is the point. Where other stores reach for a second and third hue, this one turns the lights down and lets a single bulb carry the room.

The temperament is **premium and tactile**. Nothing is decorated at rest — cards are transparent, borders are hairline, shadows are absent. The richness lives in *response*: hover a card and it lifts four pixels, warms to a raised surface, zooms its poster a hair, and fades in a "View Details" control that wasn't there a moment ago. The store is meant to feel expensive under the cursor, the way a good marquee feels when its bulbs come up. Type is authored, not defaulted: Sora sets the display voice in tight, confident weights; DM Sans carries everything readable; wide-tracked uppercase micro-labels mark the small structural cues.

This world explicitly rejects two neighbors. It is **not neon-arcade gamer RGB** — no rainbow gradients, no cyan-magenta glow, no aggressive "gaming" chrome; the restraint would shatter. And it is **not a light SaaS dashboard** — the dark, media-forward ground is core identity and holds even across the admin tables, which wear the same near-black and the same single gold.

**Key Characteristics:**
- One accent, one job — Marquee Gold is the entire color voice.
- Flat at rest, alive on interaction — depth and warmth are earned by state, never ambient.
- Near-black surfaces layered by tone (`#0f0f0f` → `#1e1e1e`), not by shadow.
- Poster-forward: 3:4 game art and 21:9 hero art lead; the chrome recedes.
- Sora display / DM Sans body, with uppercase wide-tracked labels for micro-structure.

## Colors

A near-monochrome dark field carrying exactly one warm accent; everything else is a rung on a black-to-soft-white neutral ladder.

### Primary
- **Marquee Gold** (`#F5C518`): The single accent and the entire color voice. It marks price emphasis, primary-button fills, active nav items and their icons, focus borders and rings, the brand mark's dot, and every accent-tinted badge and chip. Its rarity is what gives it authority.
- **Marquee Gold (Warm)** (`#e0b200`): The hover/pressed shade of the accent — used only as the darker end of button and link interaction, never as a second accent in its own right.

### Neutral
- **Ink** (`#121212`): The primary ground — page background, input fills, the base everything sits on.
- **Stage Black** (`#0f0f0f`): The deepest surface — the sidebar and auth backdrop, one step below the page.
- **Raised** (`#1a1a1a`): The lifted surface — search bars, menus, modals, stat cards, table row hover.
- **Card Warm** (`#1e1e1e`): The hover fill for game cards (shared value with `border-subtle`, used as a surface here).
- **Hairline / Medium / Strong borders** (`#1e1e1e` / `#2a2a2a` / `#333333`): The three-step divider ladder — subtle section rules, standard component outlines, and the strongest resting stroke.
- **Spotlight White** (`#ffffff`): Reserved for the brightest moment — hero titles over art, and text on an outline button at hover.
- **Text: Primary / Secondary / Muted / Faint** (`#e8e8e8` / `#aaaaaa` / `#666666` / `#555555`): The reading ladder — primary copy and headings, supporting text, labels and de-emphasized values, and the faintest structural hints.

### Danger
- **Alarm Coral** (`#ff6b6b`): The only color permitted outside the gold/neutral system, and only for destructive or error states — delete buttons, auth errors, page errors. Always delivered on a low-alpha coral wash, never as a filled block.

### Named Rules
**The One Voice Rule.** Marquee Gold is used on ≤10% of any given screen, and only ever means "this matters most, or you can act here." A second saturated hue never joins it; genres, categories, and statuses are *not* color-coded. If something needs to stand out and it isn't the single most important element, restyle it with weight, size, or a neutral rung — not with color.

**The Accent Wash Rule.** When the accent appears as anything other than a solid fill or text, it appears as a low-alpha tint of itself: `rgba(245, 197, 24, 0.08)` backgrounds, `0.30–0.35` borders, `0.10–0.12` focus rings. Badges, genre chips, the admin icon tile, and focus glows all draw from this one wash family. Never introduce a separate pastel or tint token to stand in for it.

## Typography

**Display Font:** Sora Variable (with Sora, sans-serif)
**Body Font:** DM Sans Variable (with DM Sans, -apple-system)
**Label Font:** DM Sans Variable, set uppercase with wide tracking

**Character:** Sora is geometric, slightly condensed, and confident — it gives titles a modern, premium edge without ornament. DM Sans is quiet, humanist, and highly legible — it never competes with the display voice. The pairing is deliberately restrained: one face to announce, one face to read.

Note: the document root is set to `0.95rem`, so `rem`-based sizes below scale from that base rather than the browser default 16px.

### Hierarchy
- **Display** (Sora 700, `clamp(1.5rem, 3vw, 2.5rem)`, line-height 1.15, tracking -0.02em): Page and section titles — hero title, browse/library/admin page titles, the 404 headline. Tight tracking is part of its authority.
- **Headline** (Sora 700, `1.25rem` / `--text-xl`): Grid section headings ("Available Games"), stat values.
- **Title** (Sora 700, `1.1rem` / `--text-lg`): Modal titles, sidebar brand, smaller structural headings.
- **Body** (DM Sans 400, `0.95rem` / `--text-base`, line-height 1.5): Default reading text, descriptions, table cells.
- **Label** (DM Sans 600, `0.7rem` / `--text-xs`, tracking 0.06–0.10em, UPPERCASE): Eyebrows and micro-structure — genre kickers, quick-launch and stat labels, table column headers, form-field labels, badges. This is the system's signature small-type treatment.

### Named Rules
**The Two-Voice Rule.** Sora announces, DM Sans reads. Sora is reserved for titles and headings; body copy, controls, and inputs are always DM Sans. Never set a paragraph in the display face or a heading in the body face.

**The Eyebrow Rule.** Micro-labels are the only text set in uppercase, and they are always tracked out (0.06–0.10em) at `--text-xs`/`--text-sm` in a muted or faint neutral (or gold when they sit on an accent element). Sentence-case everything else.

## Layout

A fixed left sidebar (`260px`, collapsible to `60px`) anchors the app shell; content sits in a right column that shifts its left margin to match and caps at `--content-max-width: 1400px`. The collapse is driven structurally via `:has(.sidebar.collapsed)`, so the content reflows without JS coupling.

Spacing follows a compact 8px-derived rhythm (`4 / 8 / 16 / 24 / 32 / 48`), applied tightly within components and generously between sections. Catalogue grids are intrinsic and responsive by default — `repeat(auto-fill, minmax(190px, 1fr))` for game cards, `minmax(200px, 1fr)` for admin stats — so column count follows available width without media queries.

**Responsive status (honest):** the system is currently **desktop-first and fluid**, not breakpoint-driven. It leans on intrinsic grids, `clamp()` type, and `max-width` rather than width breakpoints; the only media queries present are `(hover: none)` fallbacks. Width-based breakpoints are a known, unshipped gap (see PRODUCT.md). Treat any narrow-viewport composition as not-yet-designed rather than as intended behavior.

## Elevation & Depth

Depth is conveyed by **tone first, shadow only on demand.** Surfaces stack by getting lighter (`#0f0f0f` sidebar → `#121212` page → `#1a1a1a` raised → `#1e1e1e` card-warm), and at rest almost nothing casts a shadow. Shadows are dark, soft, and generous when they do appear — they read as the object physically lifting off the near-black ground.

### Shadow Vocabulary
- **Lift** (`box-shadow: 0 12px 32px rgba(0,0,0,0.5)`): The hover state of a game card and the resting weight of the auth card — the "this rose toward you" shadow.
- **Menu** (`box-shadow: 0 8px 32px rgba(0,0,0,0.5)`): Floating overlays anchored to a trigger — the avatar dropdown.
- **Modal** (`box-shadow: 0 24px 60px rgba(0,0,0,0.6)`): The deepest, softest shadow, reserved for centered dialogs over the dimmed, blurred backdrop.
- **Focus Ring** (`box-shadow: 0 0 0 3px rgba(245,197,24,0.10–0.12)`): Not a depth cue but a state cue — the gold glow paired with a gold border on focused inputs.

### Named Rules
**The Shadow-As-Response Rule.** Surfaces are flat at rest; a drop shadow appears only as a response to state (hover) or as the signature of a true overlay (modal, menu, dropdown). Depth is earned, never ambient — no resting card, panel, or tile wears a shadow just to look raised. Layer with tone instead.

## Shapes

Rounding is soft and **scales with the surface**: the bigger the object, the rounder its corners. Small utilities and badges are barely rounded (`4px`), buttons a touch more (`6px`), cards and inputs a clear `8px`, floating menus `10px`, hero and stat cards `12px`, modals `14px`, and the large auth card `20px`. Two shapes break the scale on purpose: genre chips are full pills (`999px`), and the user avatar is a circle (`50%`).

Borders are hairline (`1px`) and neutral by default, stepping through the three-rung divider ladder; the accent enters borders only as a low-alpha wash on badges, chips, and focus states. There are no thick or colored side-borders, no hard-offset block shadows, and no heavy outlines — the form language is quiet geometry, not ornament.

### Named Rules
**The Growing Radius Rule.** Corner radius tracks surface size — never give a small control a large radius or a large surface a tight one. Pills are reserved for chips; the full circle is reserved for the avatar.

## Components

The component feel is **responsive and lifted**: flat and quiet until touched, then they lift, warm, and reveal. Interaction is meant to be *felt*.

### Buttons
- **Shape:** Gently rounded (`6px` / `{rounded.sm}`), compact padding.
- **Primary:** Solid Marquee Gold fill with black (`ink-on-gold`) text, weight 700, slight tracking; `10px 28px`. Hover deepens to Warm Gold. This is the single "act here" control per view.
- **Outline:** Transparent with a `1px #444` border and secondary-gray text; hover shifts the border toward muted and the text to Spotlight White. The default secondary action.
- **Danger:** Transparent with a coral border and coral text on a low-alpha coral wash at hover; destructive actions only.
- **Small variant:** `5px 12px` at `--text-xs` for in-table actions.
- **Disabled:** `opacity: 0.5` and `not-allowed`, shared across all button variants.

### Chips (Genre)
- **Style:** Full-pill (`999px`), gold text on the `0.08` accent wash with a `0.35` gold border. Used for genre tags on the game-details page.
- **State:** Display-only tags here; the underlying selection/filter logic is client-side and does not restyle the chip into a second color.

### Cards (Game Card — the signature component)
- **Corner Style:** `8px`, poster image clipped to a `3:4` aspect ratio.
- **Rest:** Fully transparent — no background, a transparent border, no shadow. The poster is the card.
- **Hover:** Background warms to `#1e1e1e`, border becomes `border-strong`, the whole card lifts `translateY(-4px)` with the **Lift** shadow, and the poster image scales to `1.05`.
- **Reveal:** A "View Details" outline button lives at `opacity: 0` and fades in only on hover/focus-within (forced visible under `@media (hover: none)` so touch users aren't stranded).
- **Selected:** A medium-gray fill with a `0.30` gold border — the only place a card carries gold at rest.
- **Entrance:** Cards animate in with `fadeSlideUp` (rise `16px` + fade over `0.4s`), staggered `0.06s` per child for the first eight — the catalogue's authored arrival moment.

### Inputs / Fields
- **Style:** `#121212` fill, `1px` medium border, `8–10px` radius, DM Sans.
- **Focus:** Border becomes Marquee Gold and a `3px` gold glow ring appears (`rgba(245,197,24,0.10–0.12)`); the search bar variant uses `:focus-within` to light the whole pill.
- **Error:** Field-level errors surface as coral text on a coral wash (`.auth-error`, `.page-error`), not as a red border on the input.

### Navigation (Sidebar)
- **Style:** Fixed, `#0f0f0f`, collapsible `260px ↔ 60px` with a smooth width transition. Nav items are muted gray with gold icons; hover raises the row to `#1a1a1a` and text to primary.
- **Active:** Row background lifts to raised and its icon turns gold — the active state is the one place gold marks position in the nav.
- **Brand:** Sora, tight tracking, with a single gold accent character.

### Modal
- Centered `520px` dialog on a `rgba(0,0,0,0.72)` backdrop with a `2px` blur; `14px` radius, medium border, the deep **Modal** shadow, and a bordered footer for actions. Reserved for focused create/edit tasks (admin forms), not casual confirmation.

## Do's and Don'ts

### Do:
- **Do** keep Marquee Gold to ≤10% of any screen and to a single job — price, primary action, active state, focus. If two golds compete, one of them is wrong.
- **Do** convey depth by tone at rest and add shadow only on hover or for true overlays (the Shadow-As-Response Rule).
- **Do** deliver every accent-that-isn't-a-fill as the low-alpha accent wash (`rgba(245,197,24,0.08)` bg, `0.30–0.35` border, `0.10–0.12` ring).
- **Do** set titles in Sora and everything readable in DM Sans; reserve UPPERCASE + wide tracking for `--text-xs`/`--text-sm` micro-labels only.
- **Do** let posters and hero art carry the color; keep the surrounding chrome near-black and quiet.
- **Do** scale corner radius with surface size, and keep the raised-on-hover lift (`translateY(-4px)` + poster `scale(1.05)`) as the catalogue's tactile signature.

### Don't:
- **Don't** introduce a second accent hue or color-code genres, statuses, or categories — the One Voice Rule is the identity.
- **Don't** drift toward neon-arcade gamer RGB (rainbow gradients, cyan-magenta glow) or a light SaaS dashboard (white/gray corporate chrome). Both are confirmed anti-references, including on the admin pages.
- **Don't** put resting shadows on cards, tiles, or panels to fake elevation; layer with the tonal surface ladder instead.
- **Don't** use Alarm Coral for anything but destructive or error states, and never as a filled block — always the coral wash.
- **Don't** set body copy in Sora or headings in DM Sans, and don't uppercase anything larger than a micro-label.
- **Don't** give a small control a large radius or a large surface a tight one (the Growing Radius Rule).
