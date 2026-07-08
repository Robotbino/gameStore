# GameStore

A game storefront web app with a customer-facing shop and a separate admin portal, built as the frontend for a Spring Boot + JWT backend.

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
