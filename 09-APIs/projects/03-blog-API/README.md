# 03 — Blog API

A full-stack blog application split into two servers: an Express REST API backend and an EJS frontend. Demonstrates how to separate concerns between an API and a consumer application.

---

## What This Covers

- Decoupled architecture: API server + frontend server
- Express REST API with in-memory storage
- EJS frontend consuming an internal API via Axios
- Environment-based configuration for ports

---

## Getting Started

Create a `.env` file at the project root:

```bash
API_PORT=4000
FRONTEND_PORT=3000
```

Install dependencies (one install covers both servers):

```bash
bun install
```

Then run both servers in separate terminals:

**Terminal 1 — API:**
```bash
cd api
bun server.js
```

**Terminal 2 — Frontend:**
```bash
cd frontend
bun server.js
```

Visit `http://localhost:3000` to use the blog. Posts are stored in memory and reset on server restart.
