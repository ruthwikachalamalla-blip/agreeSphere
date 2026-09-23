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
