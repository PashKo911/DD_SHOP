# DD Shop

[Live Demo](https://dd-shop.netlify.app)

Demo admin credentials:

- Email: admin@admin.com
- Password: Admin123

---

## 🧾 Overview

DD Shop is a fullstack fashion e-commerce platform built with a Vue 3 SPA and a Node.js (Express) API.

It features a production-grade architecture with authentication (JWT + refresh rotation), role-based access control, server-side localization, currency conversion, and a fully functional admin dashboard.

The project simulates a real-world e-commerce system with a complete shopping flow: browsing, filtering, cart management, authentication, and admin product management.

---

## 🧰 Tech Stack

### Frontend

- Vue 3 (Composition API)
- Vite
- Pinia
- Vue Router
- Tailwind CSS v4
- PrimeVue
- Vue I18n
- Axios
- Swiper
- VueUse
- Yup (validation)

### Backend

- Node.js
- Express 5
- MongoDB + Mongoose
- JWT authentication
- bcryptjs
- Multer (file uploads)
- node-cron (background jobs)
- express-rate-limit
- helmet
- cors
- compression

### Infrastructure

- Docker (backend)
- Netlify (frontend deployment)
- Render (backend deployment)
- GitHub Actions (CI/CD)

---

## 🔥 Key Features

- Full e-commerce flow (catalog → product → cart → auth)
- Role-based access control (user / manager / admin)
- Secure auth system:
  - Access token in memory
  - Refresh token in httpOnly cookies (rotation enabled)
- Google OAuth login
- Advanced catalog filtering (category, size, color, price, sorting)
- Server-side localization (language + currency-aware responses)
- MongoDB Atlas Search for fast autocomplete search
- Guest cart with localStorage → merged after login
- Admin dashboard for product & user management
- Image upload system for product variants
- Newsletter subscription system
- Background jobs for currency rate caching (cron)

---

## 🏗 Architecture

```text
Client (Vue SPA)
  → Axios API layer
  → /api/v1

Server (Express API)
  → Controllers
  → Services
  → Models
  → MongoDB
```

### Key design principles

- Server is the source of truth for currency & localization
- Stateless access tokens + secure refresh rotation
- Modular service-based backend architecture
- Domain-based Pinia stores on frontend
- Aggregation pipelines for cart + search logic

---

## 📁 Project Structure

```text
client/ → Vue 3 SPA
server/ → Express API
db/ → seed / data snapshots
```

## 🧠 Notable Engineering Decisions

- JWT access tokens stored only in memory (no localStorage)
- Refresh tokens stored securely in httpOnly cookies with rotation
- Server-side currency + localization to ensure consistency across clients
- MongoDB Atlas Search instead of regex for scalable search
- Guest cart synchronization after authentication
- Background job system for exchange rate caching (node-cron)

## 🔐 Roles & Permissions

- **User**: shop, cart, orders
- **Manager**: product & catalog management
- **Admin**: full system control (users + roles + products)

## ⚙️ Installation

```bash
git clone https://github.com/PashKo911/DD_SHOP.git

cd dd_shop

## Client

cd client
npm install
npm run dev

## Server

cd server
npm install
npm start
```

## 🌍 Environment Variables

Both client and server require `.env` files.

See `.env.example` in each folder.

## 🚀 Deployment

- Frontend: Netlify
- Backend: Render
- CI/CD: GitHub Actions

## 📌 Notes

- Backend dev script and Docker dev entrypoint require alignment (uses `bin/www.mjs` currently)
- MongoDB Atlas Search index is required for autocomplete functionality
- Project is production-structured but optimized for portfolio demonstration

## 📄 License

This project is created for portfolio purposes.
