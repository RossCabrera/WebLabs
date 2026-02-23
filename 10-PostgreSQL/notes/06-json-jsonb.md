# 06 — JSON & JSONB

---

## 🆚 JSON vs JSONB

| Feature | JSON | JSONB |
| :--------- | :------ | :------- |
| Storage | Plain text | Binary format |
| Insert speed | Faster | Slightly slower |
| Query speed | Slower | ✅ Much faster |
| Indexable | No | ✅ Yes (GIN) |
| Key order preserved | Yes | No |
| Duplicate keys | Keeps last | Removes duplicates |

> ✅ **Always use JSONB in production.** JSON is almost never the right choice.

---

## 🛠 Creating JSONB Columns

```sql
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  metadata JSONB,           -- flexible attributes
  tags TEXT[],              -- simple array
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## ✍️ Insert & Query

```sql
-- Insert
INSERT INTO products (name, metadata)
VALUES (
  'Laptop Pro',
  '{"brand": "Apple", "specs": {"ram": 16, "storage": 512}, "colors": ["silver", "space-gray"]}'
);

-- Query top-level key (returns TEXT)
SELECT metadata->>'brand' FROM products;

-- Query nested (returns TEXT)
SELECT metadata->'specs'->>'ram' FROM products;

-- Query nested (returns JSONB, not text)
SELECT metadata->'specs' FROM products;

-- Filter by JSON value
SELECT * FROM products
WHERE metadata->>'brand' = 'Apple';

-- Filter nested
SELECT * FROM products
WHERE (metadata->'specs'->>'ram')::INTEGER >= 16;

-- Check key exists
SELECT * FROM products
WHERE metadata ? 'brand';

-- Check any of these keys exist
SELECT * FROM products
WHERE metadata ?| ARRAY['brand', 'category'];

-- Check all keys exist
SELECT * FROM products
WHERE metadata ?& ARRAY['brand', 'specs'];
```

---

## 🔧 Operators Cheatsheet

| Operator | Returns | Example |
| --- | --- | --- |
| `->` | JSONB | `data->'key'` |
| `->>` | TEXT | `data->>'key'` |
| `#>` | JSONB at path | `data#>'{specs,ram}'` |
| `#>>` | TEXT at path | `data#>>'{specs,ram}'` |
| `?` | bool (key exists) | `data ? 'brand'` |
| `?\|` | bool (any key) | `data ?\| ARRAY['a','b']` |
| `?&` | bool (all keys) | `data ?& ARRAY['a','b']` |
| `@>` | bool (contains) | `data @> '{"brand":"Apple"}'` |
| `<@` | bool (contained by) | `'{"brand":"Apple"}' <@ data` |

---

## 📦 Containment Queries (@>)

Very powerful — check if JSON contains a subset:

```sql
-- All products where brand is Apple
SELECT * FROM products
WHERE metadata @> '{"brand": "Apple"}';

-- All products with silver color in array
SELECT * FROM products
WHERE metadata @> '{"colors": ["silver"]}';

-- Payments made with credit card
SELECT * FROM payments
WHERE data @> '{"method": "credit_card"}';
```

---

## ✏️ Update JSONB Data

```sql
-- Add/update a key
UPDATE products
SET metadata = metadata || '{"discount": 0.10}'
WHERE id = $1;

-- Remove a key
UPDATE products
SET metadata = metadata - 'discount'
WHERE id = $1;

-- Update nested key
UPDATE products
SET metadata = jsonb_set(metadata, '{specs,ram}', '32')
WHERE id = $1;
```

---

## 📊 Indexing JSONB

```sql
-- GIN index for all keys (best for ? and @> queries)
CREATE INDEX idx_products_metadata ON products USING GIN(metadata);

-- Index a specific path (more targeted, faster)
CREATE INDEX idx_products_brand
ON products ((metadata->>'brand'));

-- Index for containment queries
CREATE INDEX idx_payments_data ON payments USING GIN(data jsonb_path_ops);
```

---

## 🔎 Aggregate JSON Data

```sql
-- Build JSON object from row
SELECT row_to_json(users) FROM users;

-- Build JSON array
SELECT json_agg(row_to_json(products)) FROM products;

-- Return nested JSON in API-ready format
SELECT
  u.id,
  u.name,
  json_agg(
    json_build_object('id', o.id, 'total', o.total, 'status', o.status)
  ) AS orders
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name;
```

---

## 📌 Real-World JSONB Use Cases

```sql
-- Payment metadata (flexible methods)
data = '{"method": "credit_card", "last4": "4242", "brand": "Visa"}'
data = '{"method": "crypto", "coin": "BTC", "wallet": "..."}'

-- Product attributes (different per category)
metadata = '{"color": "red", "size": "XL"}'  -- clothing
metadata = '{"cpu": "M3", "ram": 16}'        -- electronics

-- User preferences
preferences = '{"theme": "dark", "notifications": {"email": true, "sms": false}}'

-- Audit logs / event data
event_data = '{"ip": "192.168.1.1", "device": "iPhone", "action": "login"}'
```

---
