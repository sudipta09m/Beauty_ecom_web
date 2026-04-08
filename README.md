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
      routes/
      services/
      utils/
    public/
    seed/
  deploy/
    nginx/
    pm2/
  frontend/
    src/
      assets/
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

If you want to use the separate product seed file afterward:

```bash
mysql -u root -p < backend/src/seed/products.sql
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

EC2 helper configs are included here:

- [deploy/nginx/ur-beauty-api.conf](/home/sudip/My_Works/beauty_ecom/deploy/nginx/ur-beauty-api.conf)
- [deploy/pm2/ecosystem.config.cjs](/home/sudip/My_Works/beauty_ecom/deploy/pm2/ecosystem.config.cjs)

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
- `ASSET_BASE_URL` should point to the product-image base URL. For local dev that can stay `http://localhost:4000/product-images`. For S3 it should look like `https://your-bucket.s3.ap-south-1.amazonaws.com/product-images`.
- Product image fields in the database now store filenames or object keys, so the same rows work with either the local `backend/public/product-images` folder or an S3 bucket.
- Demo login in fallback mode:
  - `demo@lumeluxe.com`
  - `password123`

## EC2 + RDS + S3 Deployment

Recommended layout:

- Frontend: build the Vite app and host the static files from S3 or behind CloudFront
- Backend: run the Express app on EC2
- Database: use Amazon RDS for MySQL
- Product images: upload the files from [backend/public/product-images](/home/sudip/My_Works/beauty_ecom/backend/public/product-images) into your S3 bucket under the `product-images/` prefix

Frontend environment:

```env
VITE_API_URL=https://api.yourdomain.com/api
```

Backend environment:

```env
PORT=4000
CLIENT_URL=https://www.yourdomain.com
PUBLIC_BASE_URL=https://api.yourdomain.com
ASSET_BASE_URL=https://your-bucket.s3.ap-south-1.amazonaws.com/product-images
JWT_SECRET=replace-with-a-strong-secret
MYSQL_HOST=your-db.xxxxxx.ap-south-1.rds.amazonaws.com
MYSQL_PORT=3306
MYSQL_USER=your_db_user
MYSQL_PASSWORD=your_db_password
MYSQL_DATABASE=beauty_ecom
```

Deployment checklist:

1. Import [backend/src/seed/schema.sql](/home/sudip/My_Works/beauty_ecom/backend/src/seed/schema.sql) into the RDS database.
2. Upload the product images into S3 using the same filenames already referenced by the seeded products.
3. Set the frontend `VITE_API_URL` to your EC2-backed API domain.
4. Set the backend `CLIENT_URL`, `PUBLIC_BASE_URL`, `ASSET_BASE_URL`, and RDS credentials.
5. Open the EC2 security group for HTTP/HTTPS and allow the EC2 instance to reach the RDS instance on port `3306`.
