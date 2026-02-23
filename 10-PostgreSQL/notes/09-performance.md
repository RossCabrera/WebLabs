# 09 — Performance: EXPLAIN, Materialized Views & Tips

---

## 🔍 EXPLAIN ANALYZE

The most important performance tool. Shows what Postgres actually does to execute a query.

```sql
EXPLAIN ANALYZE
SELECT * FROM users WHERE email = 'test@example.com';
```

### Reading the Output

```sql
Index Scan using idx_users_email on users  (cost=0.29..8.31 rows=1 width=264)
                                            (actual time=0.042..0.044 rows=1 loops=1)
```

| Term | Meaning |
| :------ | :--------- |
| `Seq Scan` | ❌ Full table scan — might need index |
| `Index Scan` | ✅ Using an index |
| `Index Only Scan` | ✅✅ Fastest — data from index only |
| `cost=X..Y` | Estimated: startup cost..total cost |
| `actual time=X..Y` | Real time in ms |
| `rows=N` | Estimated rows (compare to actual) |
| `loops=N` | How many times this node ran |

### Useful EXPLAIN Options

```sql
-- Basic plan (no execution)
EXPLAIN SELECT * FROM orders WHERE status = 'pending';

-- Run + show actual times
EXPLAIN ANALYZE SELECT * FROM orders WHERE status = 'pending';

-- Show memory usage too
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT * FROM orders WHERE status = 'pending';
```

---

## 📊 Materialized Views

A materialized view stores the **result** of a query physically. Great for expensive reports run frequently.

```sql
-- Create
CREATE MATERIALIZED VIEW monthly_revenue AS
SELECT
  date_trunc('month', created_at) AS month,
  SUM(amount) AS revenue,
  COUNT(*) AS transaction_count
FROM transactions
GROUP BY month
ORDER BY month;

-- Query (instant — reads cached data)
SELECT * FROM monthly_revenue;

-- Refresh (update with latest data)
REFRESH MATERIALIZED VIEW monthly_revenue;

-- Refresh without locking (reads still work during refresh)
REFRESH MATERIALIZED VIEW CONCURRENTLY monthly_revenue;
-- Note: requires a unique index on the view
CREATE UNIQUE INDEX ON monthly_revenue(month);

-- Drop
DROP MATERIALIZED VIEW monthly_revenue;
```

📌 Use for: dashboards, reports, analytics queries that are slow but don't need real-time data.

---

## 🏗 Regular Views (Non-Materialized)

A view is a saved query — no data stored, always fresh.

```sql
CREATE VIEW active_users AS
SELECT * FROM users WHERE deleted_at IS NULL;

-- Use like a table
SELECT * FROM active_users WHERE email = 'test@example.com';

-- Drop
DROP VIEW active_users;
```

---

## ⚡ Performance Tips

### 1. Avoid SELECT *

```sql
-- ❌ Fetches all columns including large ones
SELECT * FROM products;

-- ✅ Fetch only what you need
SELECT id, name, price FROM products;
```

### 2. Always Filter with Indexed Columns

```sql
-- ❌ Function on column destroys index usage
SELECT * FROM orders WHERE EXTRACT(YEAR FROM created_at) = 2024;

-- ✅ Range condition uses index
SELECT * FROM orders
WHERE created_at >= '2024-01-01' AND created_at < '2025-01-01';
```

### 3. Use LIMIT

```sql
-- ❌ Fetches everything
SELECT * FROM logs ORDER BY created_at DESC;

-- ✅ Paginated
SELECT * FROM logs ORDER BY created_at DESC LIMIT 50 OFFSET 0;
```

### 4. Count Rows Efficiently

```sql
-- ❌ Slow on large tables
SELECT COUNT(*) FROM users;

-- ✅ Approximate count (nearly instant)
SELECT reltuples::BIGINT AS estimated_count
FROM pg_class WHERE relname = 'users';
```

### 5. Batch Inserts

```sql
-- ❌ Many round trips
INSERT INTO items (name) VALUES ('a');
INSERT INTO items (name) VALUES ('b');
INSERT INTO items (name) VALUES ('c');

-- ✅ One statement
INSERT INTO items (name) VALUES ('a'), ('b'), ('c');
```

### 6. Use Connection Pooling

```js
// Always use Pool in production, not Client
const pool = new pg.Pool({
  max: 20,               // max connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

### 7. Vacuum & Analyze

```sql
-- Reclaim space from dead rows (runs automatically, but can do manually)
VACUUM users;

-- Update statistics used by query planner
ANALYZE users;

-- Both at once
VACUUM ANALYZE users;
```

---

## 🧮 Query Planner Stats

```sql
-- Table statistics
SELECT
  relname AS table,
  n_live_tup AS live_rows,
  n_dead_tup AS dead_rows,
  last_vacuum,
  last_analyze
FROM pg_stat_user_tables
ORDER BY n_live_tup DESC;

-- Index usage
SELECT
  indexrelname AS index,
  idx_scan AS times_used,
  idx_tup_read AS rows_read
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;

-- Slow queries (requires pg_stat_statements extension)
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

---

## 🚩 Common Performance Red Flags

| Red Flag | Fix |
| :---------- | :----- |
| `Seq Scan` on large table | Add index |
| `rows=1000` but `actual rows=1` | Run `ANALYZE` |
| High `dead_rows` | Run `VACUUM` |
| Many connections refused | Use connection pooling |
| Slow `LIKE '%text%'` | Use Full-Text Search or pg_trgm |
| Slow GROUP BY/aggregation | Create Materialized View |

---
