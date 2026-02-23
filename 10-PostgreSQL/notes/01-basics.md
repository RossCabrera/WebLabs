# 01 — PostgreSQL Basics: Setup, Connection & CRUD

---

## 🔌 Connecting with Node.js (`pg`)

```bash
npm install pg
```

```js
import pg from "pg";

// Single connection (dev/testing)
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "mydb",
  password: "yourpassword",
  port: 5432,
});

await db.connect();
```

> 🔥 **Production:** always use `Pool` instead of `Client` → see `10_NODE_EXPRESS.md`

---

## 📋 CRUD — The Four Core Operations

### CREATE — INSERT

```sql
INSERT INTO users (name, email)
VALUES ('Ana', 'ana@email.com');

-- Return the created row (very useful)
INSERT INTO users (name, email)
VALUES ('Ana', 'ana@email.com')
RETURNING *;
```

---

### READ — SELECT

```sql
-- All rows
SELECT * FROM users;

-- Specific columns
SELECT name, email FROM users;

-- With condition
SELECT * FROM users WHERE age > 18;

-- Multiple conditions
SELECT * FROM users
WHERE age > 18 AND country = 'USA';

-- Pattern matching
SELECT * FROM users WHERE name LIKE 'A%';   -- starts with A
SELECT * FROM users WHERE name LIKE '%son'; -- ends with son
SELECT * FROM users WHERE name LIKE '%an%'; -- contains "an"

-- Range
SELECT * FROM orders
WHERE created_at BETWEEN '2024-01-01' AND '2024-12-31';

-- Null check
SELECT * FROM users WHERE deleted_at IS NULL;

-- Sorting
SELECT * FROM users ORDER BY name ASC;
SELECT * FROM users ORDER BY created_at DESC;

-- Limit / Offset (pagination)
SELECT * FROM users ORDER BY id LIMIT 10 OFFSET 20;
```

---

### UPDATE

```sql
UPDATE users
SET name = 'Carlos'
WHERE id = 1;

-- Update multiple columns
UPDATE users
SET name = 'Carlos', email = 'carlos@email.com'
WHERE id = 1;

-- Return updated row
UPDATE users
SET name = 'Carlos'
WHERE id = 1
RETURNING *;
```

> ⚠️ **Always use WHERE** — without it you update every row.

---

### DELETE

```sql
DELETE FROM users WHERE id = 1;

-- Return deleted row
DELETE FROM users WHERE id = 1 RETURNING *;

-- Delete all (dangerous!)
DELETE FROM users;
```

---

## 🎯 WHERE Operators Cheatsheet

| Operator | Meaning |
| :---------- | :--------- |
| `=` | equals |
| `!=` or `<>` | not equal |
| `>`, `<`, `>=`, `<=` | comparison |
| `AND`, `OR` | logical |
| `IN (...)` | in list |
| `NOT IN (...)` | not in list |
| `BETWEEN a AND b` | range |
| `LIKE 'A%'` | pattern |
| `IS NULL` | null check |
| `IS NOT NULL` | not null |

```sql
SELECT * FROM products
WHERE category IN ('electronics', 'books')
AND price BETWEEN 10 AND 500;
```

---

## 🛠 Useful psql Commands

```bash
\l                 -- list all databases
\c mydb            -- connect to database
\dt                -- list tables
\d users           -- describe table structure
\du                -- list users/roles
\timing            -- toggle query timing
\q                 -- quit
```

---

## 📝 Create & Drop Tables

```sql
-- Create
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  age INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Drop
DROP TABLE users;

-- Drop if exists (safe)
DROP TABLE IF EXISTS users;

-- Add column
ALTER TABLE users ADD COLUMN phone VARCHAR(20);

-- Remove column
ALTER TABLE users DROP COLUMN phone;
```

---
