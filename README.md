# Socks Shop

A small Angular (SSR) website. No database: everything lives in the project.
Orders are placed by direct message on X (Twitter).

## Run locally

Requires Node.js 22.

```bash
npm --prefix frontend install   # first time only
npm run dev
```

Open http://localhost:4200

## Editing the shop

- Products and settings: `frontend/src/app/data/shop-data.ts` (`name`, `description`, `price` in SAR, `isAvailable: false` hides a product)
- Interface texts: `frontend/src/app/core/i18n/ar.ts`
- Product photos: `frontend/public/products/` (referenced as `/products/<file>.jpg`)
- Logo: `frontend/public/logo.jpg`

## Production

```bash
cd frontend
npm run build
node dist/frontend/server/server.mjs   # serves on PORT (default 4000)
```
