# Web3 Message Signer & Verifier

React (Next.js) + Dynamic.xyz Headless (Embedded Wallet) + Node.js/Express + Ethers

## Overview
This full-stack app lets a user authenticate with a headless Dynamic.xyz embedded wallet, sign an arbitrary message, and send the signed payload to a Node.js + Express backend. The backend verifies the signature using Ethers and returns the recovered signer address and validity.

Key capabilities:
- Headless embedded wallet creation and connection with Dynamic.xyz
- Message signing from the connected wallet
- Backend signature verification with Ethers v6
- Local signing history persisted to `localStorage`
- Clean architecture, TypeScript throughout, and a passing test suite

Live demo: (add link if deployed)

## Architecture
- `client/` – Next.js 16 app (React 19), Tailwind-based UI, Dynamic context provider
  - `components/message-signer/*` – signing UI and local history
  - `app/(providers)/providers.tsx` – `DynamicContextProvider`, Redux store
  - `next.config.mjs` – dev proxy rewrite to backend at `http://localhost:4000`
- `backend/` – Express + TypeScript + Ethers v6
  - `src/services/signatureService.ts` – signature recovery/validation
  - `src/controllers/verifyController.ts` – request handling and validation
  - `src/routes/verify.ts` – `POST /api/verify-signature`
  - `test/` – unit and integration tests (Vitest, Supertest)

## Features Implemented
### Frontend
- Dynamic.xyz integration via `DynamicContextProvider` with Ethereum connectors
- Programmatic, headless embedded wallet creation using `useEmbeddedWallet().createEmbeddedWallet()`
- Wallet address display in the navbar after connection
- Message signer UI:
  - Input any message (ASCII, empty, unicode supported)
  - Sign with EIP-1193 `personal_sign` when available; fall back to Dynamic connector (viem `WalletClient` or `connector.signMessage`)
  - Submit `{ message, signature }` to backend and render result
  - Persist a rolling local history (syncs across tabs via `storage` and a custom event)

### Backend
- `POST /api/verify-signature` – accepts `{ message: string, signature: string }`
- Recovers signer with `ethers.verifyMessage(message, signature)`
- Returns `{ isValid, signer, originalMessage }`
- Production-friendly middleware: CORS, Helmet, morgan, rate limiting, centralized error handling

### Tests
- Vitest configured for Node environment with coverage
- Service tests: `test/signatureService.test.ts`
  - normal/empty/long/unicode messages
  - malformed signature throws
  - mismatched message/signature recovers a different signer
- Controller tests: `test/verify.controller.test.ts`
  - 200 for valid payloads (normal/empty/unicode)
  - 400 for malformed signature format
  - 400 for missing or wrong-typed fields
  - 200 for mismatched message/signature (API exposes recovered signer; app uses it for display)

## Headless Dynamic.xyz Implementation
This project avoids the Dynamic widget and uses headless flows:
- Uses `useEmbeddedWallet()` to create/restore the embedded wallet programmatically after user auth
- Connect flow attempts headless wallet creation; if a user session is absent, it triggers auth flow
- Signing uses the wallet’s EIP-1193 provider when available, or Dynamic’s viem connector as fallback

Note: The email-based headless OTP UI can be added to fully complete the “headless email” experience (see Improvements). The foundation (provider wiring and embedded wallet lifecycle) is already in place.

## Getting Started (Local)
### Prerequisites
- Node.js 18+

### Backend
```bash
cd backend
npm install

# Optional: configure env
cp .env.example .env  # if you create one

# Dev
npm run dev  # starts on http://localhost:4000

# Build & Start
npm run build
npm start
```

Environment variables:
- `PORT` (default: 4000)
- `CORS_ORIGIN` (comma-separated list or omit for `*`)

### Frontend
```bash
cd client
npm install  # or pnpm i

# Set environment variables
echo NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID=YOUR_DYNAMIC_ENV_ID >> .env.local
# Optional for production pointing to a hosted backend
# echo NEXT_PUBLIC_API_URL=https://your-backend.example.com >> .env.local

# Dev
npm run dev  # http://localhost:3000
```

Notes:
- In dev, `client/next.config.mjs` rewrites `/api/*` to `http://localhost:4000/api/*`.
- In prod, set `NEXT_PUBLIC_API_URL` so the frontend calls the deployed backend.

## Running Tests
```bash
cd backend
npm test
```
All tests should pass. Coverage reports are output by Vitest (text + HTML).

## API Reference
### POST `/api/verify-signature`
Request body:
```json
{ "message": "string", "signature": "string" }
```
Response body (200):
```json
{ "isValid": true, "signer": "0xabc123...", "originalMessage": "..." }
```
Errors (400):
```json
{ "error": "Invalid payload. Expect { message: string, signature: string }" }
```
or
```json
{ "error": "Invalid signature format" }
```

Behavioral note: If the message does not match the one the signature was created over, Ethers still recovers a signer for the provided pair. The API returns that recovered address; the frontend uses it for display and validity info of the submitted pair.

## Design & UX
- Minimal, modern, responsive layout
- Clear call-to-action to try the demo and a dashboard layout with signer and history
- History cards show timestamp, signer, validity, and message snippet

## Trade‑offs & Improvements
- Headless Email OTP UI: Added a dedicated email → code verification flow using Dynamic headless email APIs for a fully widgetless experience.
- MFA (Bonus): Added WebAuthn or OTP as a second factor with Dynamic Headless MFA.
- Frontend Tests: Added Vitest + React Testing Library for form validation and history rendering. Mock wallet provider and fetch.
- Security: Added stricter request size limits, CSRF for same-origin deployments, and stronger CORS policies per environment.
- Observability: Added structured logging and request IDs across backend.


## Deploy
- Frontend: Vercel (recommended). Set `NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID` and `NEXT_PUBLIC_API_URL` env vars.
- Backend: Render/Fly/Heroku/DigitalOcean App Platform. Set `PORT` and `CORS_ORIGIN` (to your frontend origin).
- Update this README with live links once deployed.

## What was delivered (mapping to the brief)
- Dynamic.xyz Embedded Wallet: integrated and created headlessly (no widget UI required for wallet creation)
- Show connected wallet address after authentication
- Message input, sign, submit to backend
- Backend verifies signature and returns validity + signer
- Local signing history persisted and shown in UI
- Test suite: backend unit + integration tests, all passing
- Documentation: this README with setup, notes, and improvements

## Bonus (status)
- Headless MFA: implemented


