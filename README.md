# AgriSphere

AgriSphere is a beginner-friendly, full-stack agriculture marketplace built with React, Express, MongoDB and Mongoose. Customers can discover farm supplies, manage a cart and track orders. Farmers can list products and look after orders. Admins can oversee the marketplace.

## Prerequisites

- Node.js 18 or newer and npm
- MongoDB running locally, or a MongoDB Atlas connection string

The application uses two folders: `frontend` and `backend`. Run the commands below in two terminals from the project root.

## Configure the environment

Copy the example environment files and set the values for your machine.

**PowerShell (from the project root):**

```powershell
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
```

Edit `backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/agrisphere
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URL=http://localhost:5173
ADMIN_PASSWORD=
FARMER_PASSWORD=
STORE_PASSWORD=
```

Use a long, private random value for `JWT_SECRET` and set each account password above to a unique value of at least 8 characters before seeding. For Atlas, replace `MONGODB_URI` with your database connection string. `frontend/.env` can keep its default `VITE_API_URL=http://localhost:5000/api` unless the API uses another URL. Never commit `.env` files.

## Install and seed

```powershell
cd backend
npm install
npm run seed
```

In a second terminal, from the project root:

```powershell
cd frontend
npm install
```

Seeding creates a small catalogue of 12 realistic listings across the eight product categories, two demo farmer accounts and one admin account. Their emails and password environment variables are:

| Role | Email | Password environment variable |
| --- | --- | --- |
| Admin | `admin@agrisphere.demo` | `ADMIN_PASSWORD` |
| Farmer | `farmer@agrisphere.demo` | `FARMER_PASSWORD` |
| Farmer | `store@agrisphere.demo` | `STORE_PASSWORD` |

Keep those values private and use a private database before sharing a deployment. Shoppers can register from the app.

## Run the application

Terminal 1, from `backend`:

```powershell
npm run dev
```

Terminal 2, from `frontend`:

```powershell
npm run dev
```

Open the Vite URL shown in the frontend terminal (normally `http://localhost:5173`). The API health endpoint is `http://localhost:5000/api/health`. To run the API without auto-reload, use `npm start` in `backend`.

## Deploy the backend to Render

Create a **Web Service** from this repository with these settings:

| Render setting | Value |
| --- | --- |
| Root Directory | `backend` |
| Runtime | Node |
| Branch | `main` |
| Build Command | `npm ci` |
| Start Command | `npm start` |
| Health Check Path | `/api/health` |

Set these service environment variables in Render:

| Variable | Value |
| --- | --- |
| `NODE_ENV` | `production` |
| `MONGODB_URI` | Your Atlas connection string, including the `agrisphere` database name |
| `JWT_SECRET` | A private random string of at least 32 characters |
| `CLIENT_URL` | `https://frontend-sable-one-73.vercel.app` (the deployed frontend origin) |

Render supplies `PORT` automatically; the server binds to `0.0.0.0` and uses that value. In MongoDB Atlas, create a database user and allow the outbound IP ranges shown for the Render service under **Connect → Outbound**. Atlas only accepts client connections from addresses on the project's IP access list. Use a dedicated Render outbound IP when you need an exclusive static address; otherwise add the ranges Render lists for the service's region. Keep the database user password URL-encoded in the Atlas URI if it contains reserved characters. Do not add seed account passwords to Render unless you plan to run `npm run seed` against the production database.

## Deploy the frontend to Vercel

Import the repository into Vercel and configure the project as follows:

| Vercel setting | Value |
| --- | --- |
| Framework Preset | Vite |
| Root Directory | `frontend` |
| Install Command | `npm ci` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

Set `VITE_API_URL` in the Vercel Production environment to `https://agreesphere-1.onrender.com/api`. This is a public frontend build setting, not a secret. Also set it for Preview deployments if you use them. In Render, set `CLIENT_URL` to `https://frontend-sable-one-73.vercel.app`. The backend accepts multiple comma-separated origins if you have additional approved frontend domains and removes trailing slashes. Redeploy the Vercel frontend after changing `VITE_API_URL`. The `frontend/vercel.json` rewrite sends direct page visits and browser refreshes through `index.html` so React Router can handle them.

## API overview

All endpoints use JSON. Protected endpoints accept `Authorization: Bearer <token>`.

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/api/health` | Public | API health check |
| POST | `/api/auth/register` | Public | Create customer or seller account |
| POST | `/api/auth/login` | Public | Sign in and receive JWT |
| GET | `/api/auth/me` | Signed in | Current account |
| GET | `/api/products?search=&category=&featured=` | Public | Browse/search/filter products |
| GET | `/api/products/:id` | Public | Product details |
| POST | `/api/products` | Seller/admin | Create a product |
| PUT, DELETE | `/api/products/:id` | Owner/admin | Update or remove a product |
| GET, POST | `/api/cart` | Signed in | Read cart or add `{ "productId", "quantity" }` |
| PATCH, DELETE | `/api/cart/:productId` | Signed in | Update quantity or remove item |
| GET | `/api/orders` | Signed in | Customer history, seller's orders or all admin orders |
| POST | `/api/orders` | Customer | Place order with `{ "shippingAddress", "paymentMethod" }` |
| PATCH | `/api/orders/:id/status` | Seller/admin | Update order status |
| PATCH | `/api/users/profile` | Signed in | Update profile |
| GET | `/api/users` | Admin | List users |
| PATCH | `/api/users/:id/role` | Admin | Change user role |
| DELETE | `/api/users/:id` | Admin | Remove user |
| GET | `/api/users/admin/stats` | Admin | Marketplace statistics |

Order status values: `placed`, `confirmed`, `processing`, `shipped`, `delivered`, `cancelled`. Payment is demo cash on delivery; no payment processor is connected.

## Structure

```text
AgriSphere/
├── backend/
│   ├── config/       # MongoDB connection
│   ├── controllers/  # API logic
│   ├── middleware/   # JWT, roles and error handling
│   ├── models/       # User, Product, Cart and Order
│   ├── routes/       # REST endpoint definitions
│   ├── seed/         # Demo data
│   └── server.js
├── frontend/
│   └── src/
│       ├── components/
│       ├── context/
│       └── pages/
└── README.md
```
