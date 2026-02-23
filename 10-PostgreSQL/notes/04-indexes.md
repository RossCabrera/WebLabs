# 04 — Indexes: Speed Up Your Queries

---

## 🧠 What is an Index?

An index is like a book's table of contents — it lets PostgreSQL find rows fast without scanning the entire table.

Without index: `O(n)` — reads every row  
With index: `O(log n)` — jumps straight to the data

> ⚠️ Indexes speed up **reads** but slow down **writes** slightly (index must be updated). Don't over-index.

---

## 📊 Index Types

### B-Tree (Default) — Use for most things

Best for: `=`, `<`, `>`, `<=`, `>=`, `BETWEEN`, `ORDER BY`, `LIKE 'abc%'`

```sql
-- Basic index
CREATE INDEX idx_users_email ON users(email);

-- Composite index (column order matters!)
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at);
-- ✅ Fast: WHERE user_id = ? ORDER BY created_at
-- ❌ Slow: WHERE created_at = ? (leading column not used)
```

---

### GIN (Generalized Inverted Index) — For JSONB, Arrays, Full-Text

Best for: JSONB, arrays, full-text search

```sql
-- Index JSONB column
CREATE INDEX idx_payments_data ON payments USING GIN(data);

-- Index array column
CREATE INDEX idx_tags ON posts USING GIN(tags);

-- Full text search index
CREATE INDEX idx_articles_search
ON articles USING GIN(to_tsvector('english', content));
```

---

### GiST — For Ranges, Geometry, Fuzzy Search

Best for: geometric data, range types, PostGIS

```sql
-- Range type index
CREATE INDEX idx_reservations_period
ON reservations USING GiST(daterange(start_date, end_date));
```

---

### Partial Index — Index Only a Subset of Rows

Most powerful for filtering queries on large tables.

```sql
-- Only index active users
CREATE INDEX idx_active_users_email
ON users(email)
WHERE deleted_at IS NULL;

-- Only index pending orders
CREATE INDEX idx_pending_orders
ON orders(created_at)
WHERE status = 'pending';

-- Only index failed payments (for fraud/alerting)
CREATE INDEX idx_failed_payments
ON payments(user_id, created_at)
WHERE status = 'failed';
```

📌 Real use: if 95% of your queries filter by `status = 'active'`, a partial index is much smaller and faster than a full index.

---

### Unique Index

```sql
-- Enforces uniqueness AND creates an index
CREATE UNIQUE INDEX idx_users_email ON users(email);

-- Partial unique (e.g., only one active record per user)
CREATE UNIQUE INDEX idx_one_active_subscription
ON subscriptions(user_id)
WHERE status = 'active';
```

---

## 🛠 Managing Indexes

```sql
-- List all indexes on a table
\d users

-- Or query system catalog
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'users';

-- Drop an index
DROP INDEX idx_users_email;

-- Rebuild (for bloated indexes)
REINDEX INDEX idx_users_email;
REINDEX TABLE users;
```

---

## 🎯 Indexing Strategy — What to Index

| Index this | Reason |
| :------------ | :-------- |
| Primary keys | Auto-indexed |
| Foreign keys | JOINs are slow without them |
| `WHERE` columns | Filters |
| `ORDER BY` columns | Sorting |
| `UNIQUE` columns | Data integrity |
| JSONB columns used in filters | `->>`  queries |

```sql
-- Foreign key example (Postgres doesn't auto-index FKs!)
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_transactions_account_id ON transactions(account_id);
```

---

## 🔍 Check if Index is Being Used

```sql
EXPLAIN ANALYZE
SELECT * FROM users WHERE email = 'test@mail.com';

-- Look for: "Index Scan" = using index ✅
-- "Seq Scan" = full table scan ❌ (might need an index)
```

---

## ⚡ Quick Rules

- Index columns used in `WHERE`, `JOIN`, `ORDER BY`
- Use **partial indexes** for filtered queries
- Use **GIN** for JSONB and full-text
- Don't index low-cardinality columns (e.g., `boolean`, `status` with 2-3 values)
- Always index foreign keys manually in Postgres

---
