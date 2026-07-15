# 02 — DIY API

A jokes REST API built with Express. Demonstrates how to build your own API with full CRUD operations, in-memory storage, and a protected delete-all endpoint.

---

## What This Covers

- Building a REST API from scratch with Express
- MVC structure: routes, controllers, data layer
- Full CRUD: GET, POST, PUT, PATCH, DELETE
- Query parameter filtering
- Protecting an endpoint with an API key via `.env`

---

## Getting Started

Create a `.env` file at the project root:

```bash
MASTER_KEY=supersecret
```

Then install and run:

```bash
bun install
bun server.js
```

---

## Endpoints

| Method | URL | Description |
| :----- | :-- | :---------- |
| GET | `/jokes` | List all jokes |
| GET | `/jokes/random` | Get a random joke |
| GET | `/jokes/:id` | Get joke by ID |
| GET | `/jokes?type=pun` | Filter by type |
| POST | `/jokes` | Create a joke |
| PUT | `/jokes/:id` | Replace a joke |
| PATCH | `/jokes/:id` | Partially update a joke |
| DELETE | `/jokes/:id` | Delete a joke |
| DELETE | `/jokes?apiKey=yourkey` | Delete all jokes (protected) |

---

## Example Requests

```bash
# Get all jokes
curl http://localhost:3000/jokes

# Get a random joke
curl http://localhost:3000/jokes/random

# Create a joke
curl -X POST http://localhost:3000/jokes \
  -H "Content-Type: application/json" \
  -d '{"jokeText": "Why do cows wear bells?", "jokeType": "pun"}'

# Delete all jokes
curl -X DELETE "http://localhost:3000/jokes?apiKey=supersecret"
```
