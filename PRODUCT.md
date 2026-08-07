# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

GameStore has two co-primary audiences, recorded as equal by the product owner. Neither is subordinate to the other; where they conflict, the tension is surfaced rather than resolved silently.

- **The game shopper.** A signed-in visitor browsing a catalogue of games, deciding what to buy, adding to a cart, checking out, and returning to a personal library of what they own. Today they arrive already knowing this is a members' store; the intended future state (see Capabilities and Constraints) opens catalogue discovery to signed-out visitors.
- **The recruiter or hiring manager.** A short-window evaluator — see `docs/architecture.html` §13 Recruiter Checklist and the "Portfolio Ready" maturity rung in §10–§12. They read the running app *and* the documented architecture as one deliverable. Their job is a 90-second judgment about whether the person who built this can build and ship.

Design decisions that would visibly serve one audience at the cost of the other must call out the trade-off, not pretend it isn't there.

## Product Purpose

A game storefront that demonstrates a complete commerce loop — discover → cart → own — running against a Spring Boot + JWT backend, with the architecture behind it documented as first-class deliverable.

Success is measured against both audiences simultaneously:

- The shopping experience holds together internally: a shopper can find something, understand what they're getting, purchase it, and see it in their library, without friction that reads as unfinished.
- The engineering is legible as evidence: the running app and the `docs/` handbook together make the build's judgment visible in the time a hiring reviewer actually has.

## Positioning

The differentiator is honest and narrow: a working full-stack commerce loop with a documented architecture and an explicit maturity ladder — not a market claim. GameStore does not compete with real storefronts, and no positioning language should suggest otherwise.

## Operating Context

- **Two distinct operating surfaces.** A customer store (home, browse, game detail, cart, library) and an admin portal (`/admin`, `/admin/games`, `/admin/users`) with full CRUD over games and users. They share auth but are architecturally separate layouts.
- **Two roles.** `USER` and `ADMIN`. Admin login is unified with regular login; `/admin/login` is a legacy redirect.
- **Backend dependency.** The frontend expects the GameStore Spring Boot API at `http://localhost:8181` in development; the URL is inlined at Vite build time via `VITE_API_URL`. There is no deployed instance today.
- **Desktop-first browser use.** The `docs/frontend-roadmap.html` explicitly names missing width-based breakpoints as an open item, so responsive parity is a stated future concern, not present truth.
- **Documentation is part of the product.** `docs/architecture.html`, `docs/catalog-architecture.html`, and `docs/frontend-roadmap.html` are how the second audience evaluates it and how the maturity ladder is expressed.

## Capabilities and Constraints

### Confirmed capabilities

- Register, log in, and JWT session handling with automatic redirect on 401, via axios request/response interceptors (`src/services/api.ts`, `src/context/AuthContext.tsx`).
- Catalogue of `Game` records: `{ title, genre, price, rating, description, imageUrl, heroImage }` where `genre` is a comma-separated string served by the backend and split client-side.
- Client-side search and genre filter over the full catalogue (`src/services/gameService.ts`). The backend `searchGames()` and `getGamesByGenre()` methods exist but no controller currently exposes them.
- 60-second read-through cache of `/games/all` and a by-id map, invalidated on every admin mutation.
- Cart, checkout, and library. Checkout is idempotent: games the user already owns are reported via `alreadyOwned`, not treated as an error.
- Admin CRUD over games and users. A page count / totals surface and role management sit inside the admin layout.
- Public RBAC demo page at `/demo`, and an admin-triggered RAWG sync stub button that currently calls a 501 endpoint.

### Backend contract constraints (future work must preserve)

- Non-conventional REST paths: `GET /games/find/{id}` and `POST /games/add` are the shapes the backend actually serves today. The service layer documents this; do not "correct" these without a coordinated backend change.
- `Game.genre` is a single comma-separated column, not an array. `parseGenres()` is the seam.
- Display currency is South African Rand, rendered as `R {price}`. The product does not process real money (see below).
- Frontend and backend live in separate repositories; contract changes require coordination.

### Explicitly undecided (future work must not invent an answer)

- **Economy — simulated, permanently.** No real payment provider is planned. ZAR prices and checkout are demonstration mechanics that grant server-side ownership; nothing on this surface should imply real financial transactions, real refunds, or real fulfilment.
- **The `points` field on `User`.** It is real on the backend contract and editable in the admin table, but is not surfaced anywhere in the store. Its meaning is not yet decided — do not design flows that assume points are a currency, a loyalty score, or a rank until this is settled.
- **Auth wall correction.** Today `ProtectedRoute` wraps all five customer routes (`src/routes/AppRoutes.tsx`). The intended product truth is: **home, browse, and game details are public; auth gates cart, checkout, and library only.** This is recorded as the intended state; moving the guard is separate work.
- **RAWG external-catalogue pivot.** `docs/catalog-architecture.html` describes a tiered-cache pivot; the endpoint returns 501. Whether the catalogue stays self-owned or moves to RAWG-plus-cache is an open architectural decision.
- **Design-system consolidation.** The roadmap has an unshipped decision between Chakra UI v3, Bootstrap + react-bootstrap, and a custom CSS system (`docs/frontend-roadmap.html`). All three are currently present as dependencies. PRODUCT.md does not resolve this; it records it as open.

## Brand Commitments

- **Name:** GameStore.
- **Assets:** none binding. `public/` contains only Vite's default logo; there is no GameStore logo, wordmark, illustration set, or photography of its own. Per-game imagery comes from the backend as URLs.
- **Voice:** none explicitly committed. The engineering handbook in `docs/` has a distinct, plain-spoken and technically candid voice ("Honest now, with a target to close to", etc.); whether that voice extends to the storefront UI has not been decided.
- **Aesthetic direction:** intentionally not captured here. Init records product truth only; the incumbent visual system (a dark theme with a single warm accent, DM Sans + Sora) lives in code and is `document`'s subject, not this file's.

## Evidence on Hand

### Real

- A backend-served catalogue with per-game hero and card imagery loaded via URL (source and licensing of those URLs is not documented in this repo).
- Working JWT auth including 401 handling and token attachment.
- A working cart → checkout → library round-trip against a live backend.
- The engineering handbook in `docs/` (architecture, catalog pivot, frontend roadmap), which is itself part of what the recruiter audience judges.

### Absent — future work must not fabricate

- **No reviews or testimonials.** `src/assets/gameData.ts` is a dead fixture containing invented reviewer names, avatars, and comments; the only component that reads it (`src/components/AboutGame.tsx`) is not mounted anywhere in the app. No review, rating comment, testimonial, or user quote may be invented on any surface.
- **No user counts, sales figures, "trusted by" logos, press mentions, awards, or partnerships.**
- **No live deployment.** The README's "Live demo: coming soon" is aspirational; no public URL exists yet, and no surface may imply otherwise.
- **No pricing legitimacy.** ZAR prices are demonstration values; no discount, sale, tax, refund, or currency-conversion claim may be added.
- **No licensing or storefront-agreement content.** There are no terms of service, refund policy, or age-rating claims to draw from.

## Product Principles

1. **The store fiction stays internally consistent, and never claims to be real commerce.** Prices, checkouts, and ownership behave like a store because that is the demonstration; nothing on any surface may cross into implying real financial transactions, real fulfilment, or real market position.
2. **The build is the portfolio evidence.** Because a second audience is a hiring reviewer with 90 seconds, shortcuts that read as shortcuts cost twice — once in the shopping experience and once in the evaluation. Half-finished states are worse here than in a normal product.
3. **Discovery is public; ownership is gated.** Browsing, understanding a game, and reading detail pages belong to anyone; carting, buying, and owning belong to a signed-in identity. Surfaces should honor this even where the current code doesn't yet.
4. **Say what's true, hold what's undecided.** Where product facts are not settled (economy, `points`, RAWG, design system), surfaces treat those areas as explicitly reserved rather than invent an answer. The record here is the authority; do not overwrite it silently.
5. **Docs are part of the product.** The engineering handbook is not marketing; it is a running artifact evaluated at the same time as the app. Changes that affect architecture, roadmap position, or capabilities update `docs/` in the same beat.

## Accessibility & Inclusion

No formal accessibility standard has been committed. `docs/frontend-roadmap.html` names an "Accessibility pass on the interactive bits" as a planned but unshipped item — record that as the honest current state. Do not claim WCAG conformance until it is measured and true.
