# Beauty E-commerce Website

Mobile-first beauty storefront built from the instructions in `plan.txt`.

## Stack

- Frontend: React + Vite + plain CSS
- Backend: Node.js + Express
- MySQL: users, orders, products, reviews, feedback, wholesale leads
- Fallback mode: in-memory demo data when databases are not configured

## Folder Structure

```text
beauty_ecom/
  backend/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      services/
      utils/
  frontend/
    src/
      components/
      data/
      lib/
      pages/
```

## Setup

1. Install root workspace dependencies:

```bash
npm install
```

2. Copy environment examples:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

3. Optional: seed MySQL product catalog:

```bash
mysql -u root -p < backend/src/seed/schema.sql
```

4. Start both frontend and backend:

```bash
npm run dev
```

5. Or run services independently:

```bash
npm --prefix backend run dev
npm --prefix frontend run dev
```

## API Overview

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/products`
- `GET /api/products/trending`
- `GET /api/products/offers`
- `GET /api/products/:id`
- `GET /api/orders`
- `POST /api/orders`
- `GET /api/reviews/:productId`
- `POST /api/reviews/:productId`
- `POST /api/feedback`
- `POST /api/feedback/wholesale`

## Notes

- The backend attempts a MySQL connection first.
- If MySQL is unavailable, the app still works with sample in-memory data.
- `PUBLIC_BASE_URL` should be the public backend URL in deployment.
- `ASSET_BASE_URL` can point to the same backend host or a separate CDN/static host for product images.
- Demo login in fallback mode:
  - `demo@lumeluxe.com`
  - `password123`
