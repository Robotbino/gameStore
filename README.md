# GameStore

A game storefront web app with a customer-facing shop and a separate admin portal, built as the frontend for a Spring Boot + JWT backend.

> **Live demo:** _coming soon_ &nbsp;·&nbsp; **Backend repo:** [`GameStoreBackEnd`](../GameStoreBackEnd/Bino) &nbsp;·&nbsp; **Architecture docs:** [Frontend](docs/architecture.html) · [Catalog pivot](docs/catalog-architecture.html)

## Documentation

This project ships an interactive engineering handbook — open the HTML files in any browser (no build needed):

| Doc | What it covers |
|-----|----------------|
| [`docs/architecture.html`](docs/architecture.html) | Full-stack architecture, data flows, plus the **maturity ladder, roadmap board, scorecard, and recruiter checklist** (§10–§13) |
| [`docs/catalog-architecture.html`](docs/catalog-architecture.html) | Proposed RAWG external-catalog pivot with a tiered cache (target architecture, not yet built) |
| [`GameStoreBackEnd`](../GameStoreBackEnd/Bino/docs/architecture.html) | Backend architecture, **caching strategy, persistence, $0 deployment, Docker topology, and hardening** (§11–§16) |

The two repos' docs cross-link via a switcher strip at the top of each page.

## Features

- **Authentication** — register, sign in, and JWT session handling with automatic redirect on expiry
- **Store** — home page with featured hero, browse with live search, and game detail pages
- **Library** — a personal library view for signed-in users
- **Admin portal** — separate admin login (`/admin/login`) with a dashboard and full CRUD management for games and users

## Tech Stack

- React 19 + TypeScript
- Vite (rolldown)
- React Router 7
- Axios with request/response interceptors for JWT handling
- Custom CSS design system (dark theme)

## Getting Started

```bash
npm install
npm run dev
```

The app expects the GameStore Spring Boot API running at `http://localhost:8181`.

Other scripts:

```bash
npm run build     # typecheck + production build
npm run lint      # eslint
npm run preview   # preview the production build
```

## Project Structure

```
src/
├── components/     # shared UI (navbar, sidebar, game cards, ...)
├── context/        # AuthContext (token, role, session state)
├── hooks/          # useAuth
├── pages/          # auth, user (store), and admin pages
├── routes/         # AppRoutes + ProtectedRoute/AdminRoute guards
├── services/       # axios API layer (auth, games, users)
└── types/          # shared TypeScript models
```
