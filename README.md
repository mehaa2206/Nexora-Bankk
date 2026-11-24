# Nexora Bank — Retail Banking UI, connected to the central bank

React 19 + Vite + Material UI v7 + lucide-react frontend for Nexora Bank (P642).
It is connected to the **central banking system** (the SharedBank switch, a Cloudflare Worker).

## Run locally

```bash
npm ci        # Node.js 22 or newer
npm run dev
```

Sign in with the bank's Firebase test login (a customer enabled for bank P642). No demo password exists any more.

## What is live

| Page | Source |
|---|---|
| Sign-in | `POST /api/v1/banks/P642/sign-in` |
| Overview, Accounts & activity | `GET /api/v1/banks/P642/dashboard` (refreshed every 12 s) |
| Transfers (interbank + same bank) | `POST /api/v1/banks/P642/transfers` with an `Idempotency-Key` |
| Destination bank list | `GET /api/v1/directory/banks` |
| Profile | Signed-in email / Firebase UID + bank config |

One shared session (`src/api/central.js`) serves all pages, so a customer signs in once. The token is kept in
`sessionStorage` (cleared when the tab closes); an expired session (HTTP 401) returns the user to sign-in.

## What is still a preview

The central bank has no endpoints yet for beneficiaries, scheduled transfers, deposits, loans, cards, service
requests, support tickets, notifications, registration/KYC or the Admin console. Those screens keep their sample
data and show a "Preview module" banner. The Admin console is reachable from the sign-in page as
"Preview admin console (demo data)". Mock data must never be treated as ledger data.

To point the portal at the Node/Express backend later, use `VITE_BANK_API_URL` and `VITE_USE_MOCK_API=false`
(see `src/api/api.js`). To use a different Worker, set `VITE_X42_API_URL` (see `.env.example`).

## Architecture

- `src/api/central.js` — shared session + dashboard polling + transfers + directory (`useCentralBank`)
- `src/live-api.js`, `src/amount.js`, `src/cloudflare-config.js` — unchanged from the central-bank template
- `src/pages/Transfers.jsx` — live transfer form and activity
- `src/api/api.js`, `src/api/mock-data.js` — mock API for the preview modules only
- `src/LiveBank.jsx` — original standalone template page, no longer used (it required a second, separate sign-in); kept for reference
- `src/App.jsx` — shell, auth page, live customer pages, preview pages, admin preview
