# FocusForge — Web Dashboard (Frontend)

This repository is the **FocusForge** user dashboard: a Vite + React + TypeScript SPA with a Neo-Brutalist UI. It talks to the FocusForge REST API for auth, sessions, squads, blocklists, and rewards. A separate backend and optional browser extension complete the product; see [PROJECT_ARCHITECTURE.md](./PROJECT_ARCHITECTURE.md) for the full system picture.

## Key features

- **Gamified focus**: XP, levels, and streaks tied to focus sessions.
- **Neo-Brutalist UI**: High-contrast layout (mustard, teal/maroon accents, thick borders, pop shadows) built with Tailwind CSS.
- **Squad sync**: Leaderboards and squad analytics.
- **Blocklist**: Manage blocked domains from the dashboard.
- **Rewards store**: Redeem XP for rewards.
- **Parent portal**: Parent-facing dashboard for linked accounts and activity.
- **Analytics**: Charts (including Recharts) and a visited-sites **pie chart** that shows the **top 5 domains** plus an **Other** bucket for the rest.

## Tech stack

- React 18, TypeScript, Vite
- Tailwind CSS, Recharts, Lucide React
- Axios for HTTP

## Scripts

| Command            | Description                    |
| ------------------ | ------------------------------ |
| `npm run dev`      | Dev server (default port 5173, `--host`) |
| `npm run build`    | Production build to `dist/`    |
| `npm run preview`  | Serve the production build locally |
| `npm run lint`     | ESLint                         |
| `npm run typecheck`| TypeScript check (no emit)     |

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- Running FocusForge **backend** API (see backend repo) if you need live data

## Getting started

```bash
cd focusforge-frontend
npm install
npm run dev
```

Open the app at `http://localhost:5173` (or the URL Vite prints).

### API base URL

The client uses `API_BASE_URL` from [`src/config.ts`](./src/config.ts). By default it targets the deployed API; for local development, switch it to the local value commented in that file (typically `http://localhost:3000/api`) so it matches your backend.

### PWA

`public/manifest.json` and `public/service-worker.js` support installable / offline-friendly behavior; the service worker is registered in production builds (see `src/main.tsx`).

## Related repos

- **Backend**: Node/Express API, JWT auth, and persistence (not in this tree). Configure CORS and the same API path your `API_BASE_URL` uses.
- **Chrome extension (“Focus Guard”)**: If you maintain it separately, load that extension’s unpacked folder from its own repository; it is not bundled here.

## Design notes

Neo-Brutalist styling favors strong borders, flat color blocks, and offset shadows. Component-level tokens live in Tailwind theme extensions (`tailwind.config.js`) and shared CSS (`src/index.css`).

---

*FocusForge — build better habits, one session at a time.*
