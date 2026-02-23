# 05 — Advanced Queries: JOINs, CTEs & Window Functions

---

## 🔗 JOINs

### INNER JOIN — Only matching rows

```sql
SELECT users.name, posts.title
FROM users
INNER JOIN posts ON users.id = posts.user_id;
```

### LEFT JOIN — All left rows + matches (nulls if no match)

```sql
-- All users, even those with no posts
SELECT users.name, posts.title
FROM users
LEFT JOIN posts ON users.id = posts.user_id;
```

### RIGHT JOIN — All right rows + matches

```sql
-- All posts, even orphaned ones
SELECT users.name, posts.title
FROM users
RIGHT JOIN posts ON users.id = posts.user_id;
```

### Multiple JOINs

```sql
SELECT
  u.name AS user_name,
  o.id AS order_id,
  p.name AS product_name,
  oi.quantity
FROM users u
INNER JOIN orders o ON u.id = o.user_id
INNER JOIN order_items oi ON o.id = oi.order_id
INNER JOIN products p ON oi.product_id = p.id
WHERE o.status = 'completed';
```

---

## 🧩 CTEs (Common Table Expressions)

CTEs make complex queries readable. Think of them as named temporary result sets.

### Basic CTE

```sql
WITH active_users AS (
  SELECT * FROM users WHERE deleted_at IS NULL
)
SELECT * FROM active_users WHERE created_at > NOW() - INTERVAL '30 days';
```

### Multiple CTEs

```sql
WITH
  recent_orders AS (
    SELECT * FROM orders
    WHERE created_at > NOW() - INTERVAL '7 days'
  ),
  high_value AS (
    SELECT * FROM recent_orders WHERE total > 500
  )
SELECT u.name, h.total
FROM users u
JOIN high_value h ON u.id = h.user_id;
```

### CTE + Aggregation (VIP customers this month)

```sql
WITH monthly_spend AS (
  SELECT
    user_id,
    SUM(amount) AS total
  FROM transactions
  WHERE date_trunc('month', created_at) = date_trunc('month', NOW())
  GROUP BY user_id
)
SELECT u.name, ms.total
FROM users u
JOIN monthly_spend ms ON u.id = ms.user_id
WHERE ms.total > 1000
ORDER BY ms.total DESC;
```

### Recursive CTE (Hierarchical data)

```sql
-- Category tree (parent → child → grandchild)
WITH RECURSIVE category_tree AS (
  -- Base case: root categories
  SELECT id, name, parent_id, 1 AS depth
  FROM categories
  WHERE parent_id IS NULL

  UNION ALL

  -- Recursive: find children
  SELECT c.id, c.name, c.parent_id, ct.depth + 1
  FROM categories c
  JOIN category_tree ct ON c.parent_id = ct.id
)
SELECT * FROM category_tree ORDER BY depth;
```

📌 Use for: org charts, file trees, category hierarchies.

---

## 🪟 Window Functions

Window functions perform calculations across related rows **without collapsing them** like GROUP BY does.

```sql
-- Syntax
function() OVER (PARTITION BY col ORDER BY col)
```

### Running Total

```sql
SELECT
  user_id,
  created_at,
  amount,
  SUM(amount) OVER (
    PARTITION BY user_id
    ORDER BY created_at
  ) AS running_total
FROM transactions;
```

### Ranking

```sql
-- RANK: ties get same rank, next rank skips (1,2,2,4)
-- DENSE_RANK: ties get same rank, no skip (1,2,2,3)
-- ROW_NUMBER: always unique (1,2,3,4)

SELECT
  name,
  salary,
  RANK()        OVER (ORDER BY salary DESC) AS rank,
  DENSE_RANK()  OVER (ORDER BY salary DESC) AS dense_rank,
  ROW_NUMBER()  OVER (ORDER BY salary DESC) AS row_num
FROM employees;
```

### Rank Within Groups

```sql
-- Top spending user per country
SELECT name, country, total_spent,
  RANK() OVER (PARTITION BY country ORDER BY total_spent DESC) AS rank_in_country
FROM user_stats;
```

### Moving Average (analytics)

```sql
SELECT
  created_at::DATE AS day,
  revenue,
  AVG(revenue) OVER (
    ORDER BY created_at::DATE
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) AS moving_avg_7d
FROM daily_revenue;
```

### LAG / LEAD (Previous / Next row)

```sql
SELECT
  created_at,
  amount,
  LAG(amount) OVER (ORDER BY created_at)  AS previous_amount,
  LEAD(amount) OVER (ORDER BY created_at) AS next_amount,
  amount - LAG(amount) OVER (ORDER BY created_at) AS change
FROM transactions
WHERE account_id = '...';
```

### NTILE (Divide into buckets)

```sql
-- Split customers into 4 quartiles by spend
SELECT
  user_id,
  total_spend,
  NTILE(4) OVER (ORDER BY total_spend) AS quartile
FROM customer_stats;
```

---

## 📊 Aggregation with FILTER

More expressive than CASE WHEN inside aggregations.

```sql
SELECT
  COUNT(*)                           AS total_payments,
  COUNT(*) FILTER (WHERE status = 'success')  AS successful,
  COUNT(*) FILTER (WHERE status = 'failed')   AS failed,
  SUM(amount) FILTER (WHERE status = 'success') AS total_revenue
FROM payments;
```

---

## 📅 Date/Time Tricks

```sql
-- Truncate to month (group by month)
SELECT date_trunc('month', created_at) AS month, COUNT(*)
FROM orders
GROUP BY month
ORDER BY month;

-- Last 30 days
WHERE created_at > NOW() - INTERVAL '30 days'

-- Last 7 days
WHERE created_at > NOW() - INTERVAL '7 days'

-- Same month last year
WHERE date_trunc('month', created_at) = date_trunc('month', NOW() - INTERVAL '1 year')

-- Day of week (0=Sunday, 6=Saturday)
EXTRACT(DOW FROM created_at)
```

---

## 🔢 Useful Aggregate Functions

```sql
COUNT(*)              -- count all rows
COUNT(col)            -- count non-null values
SUM(col)              -- total
AVG(col)              -- average
MIN(col)              -- minimum
MAX(col)              -- maximum
STRING_AGG(col, ', ') -- concatenate strings
ARRAY_AGG(col)        -- collect into array
```

---
