# 🐘 PostgreSQL Complete Guide

> A compact, project-ready reference. Everything you need to build real apps.

---

## 📁 Files in This Guide

| File | Topic |
| :------ | :------- |
| `01_BASICS.md` | Setup, connection, CRUD |
| `02_ACID_TRANSACTIONS.md` | ACID, transactions, isolation levels |
| `03_SCHEMA_DESIGN.md` | Tables, constraints, relationships, UUID vs SERIAL |
| `04_INDEXES.md` | B-Tree, GIN, GiST, partial indexes |
| `05_ADVANCED_QUERIES.md` | JOINs, CTEs, window functions, aggregations |
| `06_JSON_JSONB.md` | JSON vs JSONB, querying, indexing |
| `07_FUNCTIONS_TRIGGERS.md` | PL/pgSQL functions, triggers, cursors |
| `08_SEARCH.md` | Full-text search, fuzzy search |
| `09_PERFORMANCE.md` | EXPLAIN ANALYZE, materialized views, tips |
| `10_NODE_EXPRESS.md` | pg, Pool, parameterized queries, patterns |
| `11_REAL_WORLD_EXAMPLES.md` | 20 advanced real-world examples |
| `12_DJANGO.md` | Django ORM, migrations, transactions, JSONB, FTS |

---

## 🧠 Mental Model

```plaintext
Frontend (React/HTML)
       ↓
Express/Node (API layer — routing, validation, business logic)
       ↓
pg / Pool (Node.js PostgreSQL client)
       ↓
PostgreSQL (data storage, constraints, relationships, queries)
```

---

## ⚡ Quick Reference

```sql
-- Connect info defaults
host:     localhost
port:     5432
user:     postgres
database: your_db_name

-- Essential commands
\l          -- list databases
\c mydb     -- connect to db
\dt         -- list tables
\d users    -- describe table
\q          -- quit
```

---

## 🏆 When to Use PostgreSQL

✅ Fintech / financial apps  
✅ Complex queries & analytics  
✅ Django projects  
✅ APIs with relational data  
✅ Data science pipelines  
✅ Any serious production backend

---
