# Farm Equipment Sharing & Rental Platform 🚜

A simple marketplace for renting and sharing farm equipment. This repository contains a Vite + React frontend and an Express + PostgreSQL backend with real-time delivery tracking using Socket.IO.

---

## 🚀 Features

- Browse and rent farm equipment
- Secure authentication (JWT)
- Payments integration with **Razorpay**
- Real-time delivery tracking using **Socket.IO** + **Leaflet** maps
- Driver dashboard with GPS broadcasting

---

## 📁 Repository Structure

- `frontend/` — React + Vite app (UI, maps, client-side socket usage)
- `server/` — Express API, PostgreSQL (pg), Socket.IO server, payment handling

---

## 🧰 Tech Stack

- Frontend: React, Vite, Tailwind, react-leaflet, socket.io-client
- Backend: Node.js, Express, Socket.IO, PostgreSQL (pg), Razorpay

---

## 🔧 Local Setup

### Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL or a hosted DB (Neon, Heroku Postgres, etc.)
- Razorpay API keys (for payments)

### Environment Variables

Create a `.env` file in `server/` with (at minimum):

```
DATABASE_URL=postgres://user:password@host:5432/dbname
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
JWT_SECRET=some_secret_for_tokens
PORT=3000
```

> Note: the server uses `process.env.DATABASE_URL` and expects SSL config for hosted DBs.

### Run the Server

```bash
cd server
npm install
node index.js
# or install nodemon and use: npx nodemon index.js
```

The server listens on port `3000` by default (unless `PORT` is set).

### Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

Vite will start the frontend (default: `http://localhost:5173`).

---

## ♻️ Common Debugging Tips

- "No GPS updates" → Ensure driver device calls `POST /api/update-location` and has GPS permissions.
- "Map/markers not showing" → Leaflet needs its icon assets; a fix is already included in `TrackOrder.jsx`.
- "Socket events duplicated" → Likely due to multiple `io()` instantiations in different files.
- "CORS/socket connection refused" → Confirm the server port and origin, and that the client uses your machine IP when testing on other devices.

---