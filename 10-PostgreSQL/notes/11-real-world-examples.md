# 11 — 20 Real-World PostgreSQL Examples

---

## 1. Bank Transfer (ACID + SERIALIZABLE + Row Lock)

```sql
BEGIN;
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

SELECT * FROM accounts WHERE id = 'A' FOR UPDATE;
SELECT * FROM accounts WHERE id = 'B' FOR UPDATE;

UPDATE accounts SET balance = balance - 100 WHERE id = 'A';
UPDATE accounts SET balance = balance + 100 WHERE id = 'B';

INSERT INTO transactions (from_account_id, to_account_id, amount, type)
VALUES ('A', 'B', 100, 'transfer');

COMMIT;
```

📌 Prevents double spending, race conditions, and partial transfers.

---

## 2. Prevent Negative Balance (CHECK Constraint)

```sql
ALTER TABLE accounts
ADD CONSTRAINT balance_non_negative CHECK (balance >= 0);
```

📌 Database-level guarantee — even if your app has a bug, balances can't go negative.

---

## 3. Auto Audit Log (Trigger)

```sql
CREATE OR REPLACE FUNCTION log_balance_change()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO account_audit(account_id, old_balance, new_balance, changed_at)
  VALUES (OLD.id, OLD.balance, NEW.balance, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_balance_audit
AFTER UPDATE ON accounts
FOR EACH ROW
WHEN (OLD.balance IS DISTINCT FROM NEW.balance)
EXECUTE FUNCTION log_balance_change();
```

📌 Full financial traceability — who changed what and when.

---

## 4. Running Total per User (Window Function)

```sql
SELECT
  user_id,
  created_at,
  amount,
  SUM(amount) OVER (
    PARTITION BY user_id
    ORDER BY created_at
    ROWS UNBOUNDED PRECEDING
  ) AS running_balance
FROM transactions
ORDER BY user_id, created_at;
```

📌 Account statement / transaction history with running balance.

---

## 5. Top Customers by Revenue (Window + CTE)

```sql
WITH customer_totals AS (
  SELECT
    user_id,
    SUM(amount) AS total_spent
  FROM orders
  WHERE status = 'completed'
  GROUP BY user_id
)
SELECT
  u.name,
  ct.total_spent,
  RANK() OVER (ORDER BY ct.total_spent DESC) AS rank
FROM customer_totals ct
JOIN users u ON u.id = ct.user_id
LIMIT 10;
```

📌 Top 10 VIP customers for loyalty programs.

---

## 6. Month-over-Month Revenue Change (LAG)

```sql
WITH monthly AS (
  SELECT
    date_trunc('month', created_at) AS month,
    SUM(amount) AS revenue
  FROM transactions
  GROUP BY month
)
SELECT
  month,
  revenue,
  LAG(revenue) OVER (ORDER BY month) AS prev_month,
  ROUND(
    (revenue - LAG(revenue) OVER (ORDER BY month))
    / NULLIF(LAG(revenue) OVER (ORDER BY month), 0) * 100, 2
  ) AS pct_change
FROM monthly
ORDER BY month;
```

📌 Financial reporting: growth metrics.

---

## 7. Fraud Detection — Multiple Transactions in 1 Minute

```sql
SELECT
  user_id,
  COUNT(*) AS tx_count,
  SUM(amount) AS total_amount
FROM transactions
WHERE created_at > NOW() - INTERVAL '1 minute'
GROUP BY user_id
HAVING COUNT(*) > 5
ORDER BY tx_count DESC;
```

📌 Real-time fraud alert system.

---

## 8. Flexible Payment Methods (JSONB)

```sql
CREATE TABLE payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  amount NUMERIC(15,2) NOT NULL,
  data JSONB NOT NULL,  -- payment method details
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert different payment types
INSERT INTO payments (user_id, amount, data) VALUES
  ('user-1', 50.00, '{"method":"credit_card","last4":"4242","brand":"Visa"}'),
  ('user-2', 30.00, '{"method":"crypto","coin":"BTC","wallet":"1A2b..."}'),
  ('user-3', 20.00, '{"method":"bank_transfer","iban":"ES91..."}');

-- Query by method
SELECT * FROM payments WHERE data->>'method' = 'credit_card';

-- Query nested
SELECT * FROM payments WHERE data @> '{"method": "crypto", "coin": "BTC"}';
```

📌 Single table handles multiple payment types without schema changes.

---

## 9. Monthly Active Users

```sql
SELECT
  date_trunc('month', created_at) AS month,
  COUNT(DISTINCT user_id) AS active_users
FROM sessions
WHERE created_at > NOW() - INTERVAL '12 months'
GROUP BY month
ORDER BY month;
```

📌 Core SaaS/product analytics metric.

---

## 10. Category Tree (Recursive CTE)

```sql
WITH RECURSIVE tree AS (
  -- Root categories
  SELECT id, name, parent_id, name::TEXT AS path, 1 AS depth
  FROM categories WHERE parent_id IS NULL

  UNION ALL

  -- Children
  SELECT c.id, c.name, c.parent_id,
         tree.path || ' > ' || c.name, tree.depth + 1
  FROM categories c
  JOIN tree ON c.parent_id = tree.id
)
SELECT * FROM tree ORDER BY path;
```

📌 E-commerce categories, org charts, file systems.

---

## 11. Soft Delete with Active-Only View

```sql
ALTER TABLE users ADD COLUMN deleted_at TIMESTAMPTZ;

-- "Delete" — never actually removes data
UPDATE users SET deleted_at = NOW() WHERE id = $1;

-- View for active users
CREATE VIEW active_users AS
SELECT * FROM users WHERE deleted_at IS NULL;

-- Partial index makes queries fast
CREATE INDEX idx_active_users ON users(email) WHERE deleted_at IS NULL;
```

📌 Recoverable deletes, audit compliance, GDPR.

---

## 12. Materialized View for Dashboard

```sql
CREATE MATERIALIZED VIEW sales_dashboard AS
SELECT
  date_trunc('day', o.created_at) AS day,
  COUNT(o.id) AS orders,
  SUM(o.total) AS revenue,
  COUNT(DISTINCT o.user_id) AS unique_buyers,
  AVG(o.total) AS avg_order_value
FROM orders o
WHERE o.status = 'completed'
GROUP BY day
ORDER BY day;

CREATE UNIQUE INDEX ON sales_dashboard(day);

-- Refresh nightly (or via cron)
REFRESH MATERIALIZED VIEW CONCURRENTLY sales_dashboard;
```

📌 Dashboard loads instantly instead of computing on every request.

---

## 13. Full-Text Search on Products

```sql
-- Add search vector
ALTER TABLE products ADD COLUMN search_vector TSVECTOR
GENERATED ALWAYS AS (
  to_tsvector('english', coalesce(name,'') || ' ' || coalesce(description,''))
) STORED;

CREATE INDEX idx_products_fts ON products USING GIN(search_vector);

-- Search
SELECT id, name, price
FROM products
WHERE search_vector @@ to_tsquery('english', 'wireless & headphone')
ORDER BY ts_rank(search_vector, to_tsquery('english', 'wireless & headphone')) DESC;
```

📌 E-commerce search without Elasticsearch.

---

## 14. User Retention Cohort Analysis

```sql
WITH cohorts AS (
  SELECT
    user_id,
    date_trunc('month', MIN(created_at)) AS cohort_month
  FROM orders
  GROUP BY user_id
),
activity AS (
  SELECT
    o.user_id,
    c.cohort_month,
    date_trunc('month', o.created_at) AS activity_month
  FROM orders o
  JOIN cohorts c ON o.user_id = c.user_id
)
SELECT
  cohort_month,
  COUNT(DISTINCT CASE WHEN cohort_month = activity_month THEN user_id END) AS month_0,
  COUNT(DISTINCT CASE WHEN activity_month = cohort_month + INTERVAL '1 month' THEN user_id END) AS month_1,
  COUNT(DISTINCT CASE WHEN activity_month = cohort_month + INTERVAL '2 months' THEN user_id END) AS month_2
FROM activity
GROUP BY cohort_month
ORDER BY cohort_month;
```

📌 Understand customer retention over time.

---

## 15. Upsert (Insert or Update)

```sql
-- Insert user preferences, update if already exists
INSERT INTO user_preferences (user_id, key, value)
VALUES ($1, $2, $3)
ON CONFLICT (user_id, key)
DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = NOW();
```

📌 Settings, preferences, counters — avoid duplicates elegantly.

---

## 16. Count Metrics in One Query (FILTER)

```sql
SELECT
  COUNT(*)                                     AS total,
  COUNT(*) FILTER (WHERE status = 'success')   AS successful,
  COUNT(*) FILTER (WHERE status = 'failed')    AS failed,
  COUNT(*) FILTER (WHERE status = 'pending')   AS pending,
  SUM(amount) FILTER (WHERE status = 'success') AS revenue
FROM payments
WHERE created_at > NOW() - INTERVAL '24 hours';
```

📌 Admin dashboard stats in a single query.

---

## 17. Percentile / Distribution Analysis

```sql
SELECT
  PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY amount) AS median,
  PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY amount) AS p75,
  PERCENTILE_CONT(0.90) WITHIN GROUP (ORDER BY amount) AS p90,
  PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY amount) AS p99,
  AVG(amount) AS average,
  MAX(amount) AS maximum
FROM transactions
WHERE created_at > NOW() - INTERVAL '30 days';
```

📌 Transaction value distribution for product/risk analysis.

---

## 18. Rate Limiting Check

```sql
-- Check if user exceeded rate limit (100 requests/hour)
SELECT COUNT(*) AS requests
FROM api_requests
WHERE user_id = $1
  AND created_at > NOW() - INTERVAL '1 hour';

-- If result > 100, reject request
```

📌 API rate limiting backed by database.

---

## 19. Find Duplicate Records

```sql
-- Find duplicate emails
SELECT email, COUNT(*) AS count
FROM users
GROUP BY email
HAVING COUNT(*) > 1
ORDER BY count DESC;

-- Delete duplicates, keep lowest id
DELETE FROM users
WHERE id NOT IN (
  SELECT MIN(id)
  FROM users
  GROUP BY email
);
```

📌 Data cleaning, deduplication.

---

## 20. Real-Time Leaderboard (Window + JSONB)

```sql
SELECT
  u.name,
  s.score,
  s.metadata->>'game' AS game,
  RANK() OVER (
    PARTITION BY s.metadata->>'game'
    ORDER BY s.score DESC
  ) AS rank
FROM scores s
JOIN users u ON u.id = s.user_id
WHERE s.created_at > NOW() - INTERVAL '7 days';
```

📌 Gaming leaderboard with per-game rankings and JSONB flexibility.

---
