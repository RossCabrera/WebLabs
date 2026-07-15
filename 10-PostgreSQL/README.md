# 🐘 PostgreSQL

This section covers everything from PostgreSQL fundamentals to advanced production-level database design and performance optimization.

You’ll move from basic CRUD operations to indexing strategies, full-text search, performance tuning, and real-world backend integration with Node.js and Django.

---

## 📚 What is PostgreSQL?

PostgreSQL is an advanced open-source relational database management system (RDBMS). It is known for:

- ACID compliance  
- Strong data integrity  
- Powerful indexing  
- JSON/JSONB support  
- Advanced querying capabilities  
- Extensibility and performance  

It is widely used in production systems ranging from startups to enterprise-scale applications.

---

## 🧠 Learning Stages

### 01 — Basics

**File:** `01-basics.md`  

---

### 02 — ACID & Transactions  

**File:** `02-acid-transactions.md`  

- Atomicity  
- Consistency  
- Isolation levels  
- Durability  
- Transaction control (`BEGIN`, `COMMIT`, `ROLLBACK`)  

---

### 03 — Schema Design  

**File:** `03-schema-design.md`  

- Tables & data types  
- Constraints (PRIMARY KEY, UNIQUE, CHECK, FK)  
- Relationships (1–1, 1–N, N–N)  
- UUID vs SERIAL  
- Normalization basics  

---

### 04 — Indexes  

**File:** `04-indexes.md`  

- B-Tree indexes  
- GIN indexes  
- GiST indexes  
- Partial indexes  
- When and why to index  

---

### 05 — Advanced Queries  

**File:** `05-advanced-queries.md`  

- Complex JOINs  
- Subqueries  
- CTEs (WITH)  
- Window functions  
- Aggregations  

---

### 06 — JSON & JSONB  

**File:** `06-json-jsonb.md`  

- JSON vs JSONB differences  
- Querying nested data  
- Indexing JSONB  
- Hybrid relational + document patterns  

---

### 07 — Functions & Triggers  

**File:** `07-functions-triggers.md`  

- PL/pgSQL functions  
- Triggers  
- Cursors  
- Stored procedures  

---

### 08 — Search  

**File:** `08-search.md`  

- Full-text search (FTS)  
- `tsvector` & `tsquery`  
- Ranking results  
- Fuzzy search  

---

### 09 — Performance  

**File:** `09-performance.md`  

- `EXPLAIN ANALYZE`  
- Query optimization  
- Materialized views  
- Index optimization strategies  
- Real-world performance tips  

---

### 10 — Node.js & Express Integration  

**File:** `10-node-express.md`  

- Using `pg`  
- Connection pooling  
- Parameterized queries  
- Query patterns  
- Production structure  

---

### 11 — Real-World Examples  

**File:** `11-real-world-examples.md`  

20 advanced examples including:

- Role-based systems  
- Soft deletes  
- Audit logs  
- Complex filtering  
- Analytics queries  
- Transaction-safe updates  

---

### 12 — Django Integration  

**File:** `12-django.md`  

- Django ORM  
- Migrations  
- Transactions  
- JSONB usage  
- Full-text search in Django  

---

## 🧩 Folder Structure

```10-PostgreSQL/
├── notes/  
│   ├── 00-index.md
│   ├── 01-basics.md
│   ├── 02-acid-transactions.md
│   ├── 03-schema-design.md
│   ├── 04-indexes.md
│   ├── 05-advanced-queries.md
│   ├── 06-json-jsonb.md
│   ├── 07-functions-triggers.md
│   ├── 08-search.md
│   ├── 09-performance.md
│   ├── 10-node-express.md
│   ├── 11-real-world-examples.md
│   └── 12-django.md
├── README.md
└── projects/
    ├── 01-flag-quiz/
    └── 02-bucket-list/
```

---

## 🚀 Getting Started

Both projects require Docker to run a local PostgreSQL database. Each project has its own container on a different port so they don't conflict.

```bash
cd projects/01-flag-quiz
docker compose -f docker-compose.dev.yml up -d
bun install
bun app.js
```

See each project's `README.md` for full setup instructions, credentials, and Docker commands.

---

## 🗂️ Projects

### 🎯 01 — Flag Quiz

A quiz game application that:

- Stores country and flag data in PostgreSQL  
- Tracks user scores  
- Uses dynamic routing  
- Demonstrates database queries in a game context  

**Concepts Applied:**

- CRUD operations  
- Database-driven rendering  
- Environment configuration  

---

### 📝 02 — Bucket List App

A more advanced full-stack CRUD application that includes:

- User management  
- Relational database modeling  
- Controllers & models separation  
- Structured routing  
- Frontend interaction with backend  

**Concepts Applied:**

- Relationships  
- Modular architecture  
- Connection pooling  
- Parameterized queries  
- Scalable project structure  

---

## 🎯 Goal

By the end of this module, you will:

- Understand how relational databases work  
- Design scalable database schemas  
- Write efficient production-ready queries  
- Optimize performance using indexes and analysis tools  
- Integrate PostgreSQL into real backend systems  
- Work confidently with JSONB and full-text search  
- Build real-world applications backed by a relational database.

---
