# GameStore

A game storefront web app with a customer-facing shop and a separate admin portal, built as the React + TypeScript frontend for a Spring Boot + JWT backend.

It demonstrates a complete commerce loop — **discover → cart → own** — with the architecture behind it documented as a first-class deliverable.

> **Live demo:** _coming soon_ &nbsp;·&nbsp; **Backend repo:** [`gameStore-backend`](../gameStore-backend) &nbsp;·&nbsp; **Architecture docs:** [Frontend](docs/architecture.html) · [Catalog pivot](docs/catalog-architecture.html) · [Roadmap](docs/frontend-roadmap.html)

---

## Screenshots

### Store — home

Featured hero with the paginated catalogue below it. The sidebar's **Quick Launch** strip cycles through games the signed-in user actually owns, and hands the hero over to whichever one is showing.

![GameStore home page — featured hero for The Witcher 3 over a grid of available games](docs/screenshots/home.png)

### Store — game details

Full-bleed hero art, genre chips parsed from the backend's comma-separated `genre` column, star rating, and add-to-cart.

![Game details page for Marvel's Spider-Man Remastered, showing genre chips, rating, description and an Add to Cart button](docs/screenshots/game-details.png)

### Admin — manage games

The admin portal is a separate layout behind an `ADMIN` role guard. Full CRUD over the catalogue, server-side paginated.

![Admin Manage Games table listing games with id, title, genre, price, rating and edit/delete actions](docs/screenshots/admin-manage-games.png)

### Admin — manage users

Role badges, points, and user CRUD. Passwords never leave the server — the backend serves a `UserResponse` DTO with no hash on it.

![Admin Manage Employees table listing users with role badges and edit/delete actions](docs/screenshots/admin-manage-users.png)

---

## Features

**Store (role `USER`)**

- **Home** — featured hero, plus a paginated catalogue grid
- **Search** — one centred navbar box, shown only on the store's browsing routes. Debounced, URL-synced (`?q=&page=`) against the server-side `GET /games/all` query, with up to six live suggestions as a keyboard-navigable combobox. `/` focuses it from anywhere; Escape clears it
- **Browse** — genre filtering and server-side pagination; the hero steps aside while a search term is active so results start at the top
- **Game details** — hero art, parsed genre chips, star rating, add to cart, and a wishlist heart
- **Wishlist** — a heart on the hero, the details page and every card, backed by `GET /wishlist/me` and `POST`/`DELETE /wishlist/{gameId}` with optimistic toggling and rollback; the `/wishlist` page lists what you saved
- **Cart & checkout** — a four-step checkout modal (review → pay → processing → success) with a live card preview and a visible "Demo checkout, no money moves" badge. `POST /orders/checkout` snapshots title and price per line, returns a `DEMO-` payment reference, and is idempotent: games you already own come back in `alreadyOwned` rather than failing the whole transaction
- **Rewards** — a simulated points balance: 10 points per R1 of an order's final total, redeemable at checkout at 100 points = R1 off, capped at the subtotal. The cart shows points to earn; the profile shows the balance, its Rand worth and the last five ledger entries from `GET /rewards/me`
- **Library** — everything the signed-in user owns, resolved from the token (never a URL param)
- **Quick Launch** — an idle carousel in the sidebar that rotates through the user's own library and drives the Browse hero
- **Profile & settings** — reached from the avatar menu. Identity, region, join month, games owned, rewards balance, the ledger and recent orders on `/profile`; three independent forms on `/settings` for presentation (display name, avatar preset, bio, region), account (username, email) and password

**Admin (role `ADMIN`)**

- Separate `AdminLayout` behind an `AdminRoute` guard
- Dashboard, plus full CRUD for games and users
- RAWG catalogue-sync button, wired to a backend endpoint that currently returns `501` (see [catalog-architecture.html](docs/catalog-architecture.html))

**Cross-cutting**

- Register / sign in with JWT, role decoded from the token claim
- Axios interceptors: attach `Authorization` on every request, and on a `401` from anything other than `/auth/*`, clear the token and bounce to `/login`
- 60-second read-through cache over the catalogue, keyed by query string and invalidated on every admin mutation
- A motion system on one token ladder (`--duration-*`, `--ease-*`): route enter transitions, staggered card arrival, a two-layer hero crossfade, press and focus feedback on every control, and one `prefers-reduced-motion` rule that collapses all of it
- Skeleton loaders on every loading route instead of "Loading…" text; a shared `Modal` with enter/exit motion, Escape and a focus trap for admin forms and checkout
- Public RBAC demo page at `/demo`

---

## Tech Stack

| Layer | Choice |
|---|---|
| UI | React 19 + TypeScript 5.9 |
| Build | Vite (`rolldown-vite`) |
| Routing | React Router 7 (nested layout routes + guards) |
| Components | Chakra UI 3, with a custom CSS design system on top |
| HTTP | Axios, with request/response interceptors for JWT |
| Auth | `jwt-decode`, token in `localStorage` |
| Fonts | Sora (display) + DM Sans (body), self-hosted via Fontsource |
| Tooling | ESLint 9 (flat config), Prettier 3 |

The visual system — a single-accent gold-on-near-black dark theme — is specified in [`DESIGN.md`](DESIGN.md); the product's audiences, constraints, and explicitly-undecided questions are in [`PRODUCT.md`](PRODUCT.md).

---

## Getting Started

### Prerequisites

- **Node.js 20+** and npm
- The **GameStore Spring Boot API** running on `http://localhost:8181` — without it the app renders, but every data call fails

### Install and run

```bash
npm ci
```

```bash
npm run dev
```

Vite serves on `http://localhost:5173`.

### Configuration

Copy the example env file and adjust if your API isn't on the default port:

```bash
cp .env.example .env.local
```

| Variable | Default | Notes |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8181` | Base URL of the Spring Boot API |

> ⚠️ Vite inlines `VITE_*` variables at **build** time, not runtime. A deployed bundle has the value baked in, so it must be set before `npm run build` — setting it as an env var on the host does nothing. And only put non-secrets here: everything in `.env.local` ships to the browser.

### Scripts

```bash
npm run dev           # dev server with HMR
npm run build         # tsc -b (typecheck) + production build
npm run preview       # serve the production build locally
npm run lint          # eslint
npm run format        # prettier --write .
npm run format:check  # prettier --check .
```

---

## Project Structure

```
src/
├── assets/         # local images
├── components/
│   ├── account/    # AvatarMark, AvatarPicker, avatarPresets
│   ├── auth/       # AuthShell (shared login/register frame)
│   ├── checkout/   # CheckoutModal (review → pay → processing → success)
│   ├── game/       # GameGrid, GameGridSkeleton, HeroSection
│   ├── layout/     # AppLayout (store), AdminLayout (portal), PageTransition
│   ├── payment/    # PaymentMarks (inline demo card/provider marks)
│   ├── search/     # SearchBar, SearchSuggestions
│   ├── ui/         # Chakra color-mode plumbing
│   └── *.tsx       # Navbar, SideBar, GameCard, WishlistButton, Modal, Pagination, StarRating, ...
├── context/        # AuthContext, CartContext, WishlistProvider, QuickLaunchProvider
├── hooks/          # useAuth, useCart, useWishlist, useOrders, useRewards, usePurchases, useGameSuggestions, useQuickLaunch
├── pages/
│   ├── account/    # ProfilePage, SettingsPage
│   ├── admin/      # AdminDashBoard, ManageGamesPage, ManageUsersPage
│   ├── auth/       # LoginPage, RegisterPage
│   └── user/       # Home, Browse, GameDetails, Cart, Library, Wishlist
├── routes/         # AppRoutes + ProtectedRoute / AdminRoute guards
├── services/       # axios layer: api, auth, games, users, purchases, orders, rewards, wishlist
├── styles/         # index.css (design tokens + base styles)
├── types/          # Game, User, Purchase, Order, Rewards, Wishlist, auth, pagination
└── utils/          # apiError, genre parsing, country codes, rewards maths
```

### Routes

| Path | Access | Page |
|---|---|---|
| `/login`, `/register` | public | Auth (redirects away if already signed in) |
| `/demo` | public | RBAC demo |
| `/` | `USER` | Home |
| `/browse` | `USER` | Browse + search |
| `/games/:id` | `USER` | Game details |
| `/cart` | `USER` | Cart & checkout |
| `/library` | `USER` | Owned games |
| `/wishlist` | `USER` | Saved games |
| `/profile` | `USER` | Profile |
| `/settings` | `USER` | Account settings |
| `/admin` | `ADMIN` | Dashboard |
| `/admin/games` | `ADMIN` | Manage games |
| `/admin/users` | `ADMIN` | Manage users |
| `/admin/login` | — | legacy redirect to `/login` |
| `*` | — | 404 (deliberately shown, not silently bounced home) |

---

## Architecture Notes

A few decisions worth knowing before you read the code — the full reasoning lives in [`docs/architecture.html`](docs/architecture.html).

**Auth lives in one place.** `services/api.ts` owns the single axios instance. The request interceptor attaches the bearer token; the response interceptor handles `401` by clearing the token and redirecting — but it deliberately skips `/auth/*` URLs, so a wrong password shows an error on the login form instead of reloading it. No other service holds auth logic.

**The token is the identity.** `GET /users/me` and `GET /purchases/me` take no id parameter; the server resolves the caller from the JWT. `applyToken()` throws rather than returning a role it never applied — an earlier version of that let a failed register look like a success.

**Changing your email re-issues your token.** A JWT's subject is the email, and the backend resolves
the caller by looking that subject up. So `PUT /users/me/account` returns a freshly minted token
alongside the updated record, and `AuthContext.applyNewToken` swaps it in — without that, the next
request after an email change would arrive anonymous and the 401 interceptor would bounce you to
`/login` mid-save. For the same interceptor reason, a wrong *current* password on the password form
comes back as `400`, not `401`: a typo must not read as a dead session.

**The catalogue is cached, searches aren't.** `gameService` keeps a 60-second read-through cache keyed by the full query string, capped at 20 pages with FIFO eviction, plus a by-id map primed from every page fetch. Keyword searches are excluded: they're already debounced, every keystroke is a distinct key, so caching them would grow the map without ever scoring a hit. Every admin mutation clears both caches.

**The backend contract is mirrored, not corrected.** `GET /games/find/{id}` and `POST /games/add` aren't REST-conventional, but they're what the backend serves today — the service layer documents this rather than "fixing" it unilaterally. Likewise `Game.genre` is one comma-separated column (`"RPG, Open World, Fantasy"`), not an array; `parseGenres()` in `utils/genre.ts` is the single seam that turns it into chips.

**Prices and payment are simulated.** Display currency is South African Rand (`R 899.99`). There is no payment provider and none is planned. The checkout modal's provider marks and card preview are visual cues under a visible demo badge; `POST /orders/checkout` grants server-side ownership, snapshots each line's title and price, and hands back a `DEMO-` reference. Nothing else happens.

**Rewards maths lives in one file, and the server always recomputes.** `utils/rewards.ts` mirrors the backend's `RewardsService` constants (10 points earned per R1, 100 points per R1 off) so the cart and checkout preview show the same numbers the server will return. The frontend never trusts its own arithmetic: the order response carries the authoritative `pointsEarned`, `discount` and `pointsBalance`.

---

## Documentation

This project ships an interactive engineering handbook — open the HTML files in any browser, no build needed:

| Doc | What it covers |
|---|---|
| [`docs/architecture.html`](docs/architecture.html) | Full-stack architecture and data flows, plus the **maturity ladder, roadmap board, scorecard, and recruiter checklist** (§10–§13) |
| [`docs/catalog-architecture.html`](docs/catalog-architecture.html) | Proposed RAWG external-catalog pivot with a tiered cache (target architecture, not yet built) |
| [`docs/frontend-roadmap.html`](docs/frontend-roadmap.html) | Frontend backlog and open items |
| [`gameStore-backend`](../gameStore-backend/docs/architecture.html) | Backend architecture, **caching strategy, persistence, $0 deployment, Docker topology, and hardening** (§11–§16) |

The two repos' docs cross-link via a switcher strip at the top of each page.

---

## Known Limitations

Stated plainly rather than hidden — these are tracked in the roadmap, not oversights:

- **No deployed instance yet.** Everything runs locally against a local API.
- **Desktop-first.** Two width breakpoints exist today (900px and 640px, covering the auth page, the profile header and the checkout modal); the store layout itself is still built for a desktop viewport and a full responsive pass is an open roadmap item.
- **Catalogue discovery requires sign-in.** Opening browse to signed-out visitors is intended future state.
- **Genre filtering is exact-match.** The backend matches `g.genre = :genre` against a column that stores a comma-separated list, so a single genre like `"RPG"` won't match a multi-genre row until the backend splits that column or switches to `LIKE`.
- **RAWG sync is a stub.** The admin button calls an endpoint that returns `501` by design.
- **Checkout is a demonstration.** The modal shows provider-style marks and a card preview, but no card details are read or sent; the server marks every order `PAID` and mints a `DEMO-` reference. Rewards points have no cash value.
- **Sort is plumbed but unused.** The catalogue query accepts `sort=` end to end; no control sets it yet.
- **No automated tests yet.**
- **Avatars are presets, not uploads.** You pick from twelve code-drawn marks; there is no image upload, and none is planned until there is somewhere to store one.
