# Signature Verification API

A small Express + TypeScript service for verifying EVM signatures.

## Quickstart

1. Install dependencies:

```bash
cd backend
npm install
```

2. Configure environment variables:

Create a `.env` (or use defaults):

```bash
cp .env.example .env
```

3. Run in development:

```bash
npm run dev
```

4. Build and start in production:

```bash
npm run build
npm start
```

## Environment

- `PORT` (default: 4000)
- `CORS_ORIGIN` (comma-separated origins or omit for `*`)

## Endpoints

- `GET /health` – health check
- `POST /api/verify-signature` – body: `{ message: string, signature: string }`

## Project Structure

- `src/app.ts` – Express app setup
- `src/server.ts` – server bootstrap
- `src/config/` – env configuration/validation
- `src/routes/` – route modules
- `src/controllers/` – request handlers
- `src/services/` – business logic
- `src/middlewares/` – error/not-found handlers


