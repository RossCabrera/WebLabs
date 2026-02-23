# 03 — Schema Design: Tables, Constraints & Relationships

---

## 🔑 Data Types Cheatsheet

| Type | Use |
| :------ | :----- |
| `SERIAL` | Auto-increment integer PK (legacy) |
| `UUID` | Unique ID (recommended for APIs) |
| `INTEGER` / `INT` | Whole numbers |
| `NUMERIC(10,2)` | Money / precise decimals |
| `VARCHAR(n)` | String with max length |
| `TEXT` | Unlimited string |
| `BOOLEAN` | true/false |
| `TIMESTAMP` | Date + time |
| `TIMESTAMPTZ` | Timestamp with timezone |
| `DATE` | Date only |
| `JSONB` | Binary JSON (recommended) |
| `UUID[]` | Array of UUIDs |

> 💰 Always use `NUMERIC` for money, never `FLOAT` (floating point errors).

---

## 🆔 SERIAL vs UUID

### SERIAL (auto-increment)

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,  -- 1, 2, 3, 4...
  name VARCHAR(100)
);
```

- ✅ Simple, fast
- ❌ Predictable (security risk in public APIs)
- ❌ Hard to merge distributed databases

### UUID (recommended for APIs)

```sql
-- Enable extension (once per database)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100)
);
```

- ✅ Unpredictable → safe in URLs
- ✅ Works across distributed systems
- ✅ Industry standard for modern APIs

---

## 🛡 Constraints

Constraints enforce data integrity at the database level — even if your app has a bug.

```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  name VARCHAR(100)  NOT NULL,          -- required
  email VARCHAR(255) NOT NULL UNIQUE,   -- required + no duplicates
  age INTEGER        CHECK (age >= 18), -- business rule
  role VARCHAR(20)   DEFAULT 'user',    -- fallback value

  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ                -- NULL = not deleted (soft delete)
);
```

### Constraint Types

```sql
-- PRIMARY KEY (unique + not null)
id SERIAL PRIMARY KEY

-- NOT NULL
name VARCHAR(100) NOT NULL

-- UNIQUE
email VARCHAR(255) UNIQUE

-- CHECK (custom rule)
balance NUMERIC CHECK (balance >= 0)
age INTEGER CHECK (age BETWEEN 18 AND 120)

-- DEFAULT
status VARCHAR(20) DEFAULT 'pending'
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

-- FOREIGN KEY
user_id UUID REFERENCES users(id)
user_id UUID REFERENCES users(id) ON DELETE CASCADE    -- delete child if parent deleted
user_id UUID REFERENCES users(id) ON DELETE SET NULL   -- set null if parent deleted
user_id UUID REFERENCES users(id) ON DELETE RESTRICT   -- block parent delete (safe default)
```

---

## 🔗 Table Relationships

### One-to-One (1:1)

One user has one profile.

```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  -- UNIQUE enforces 1:1
  bio TEXT,
  avatar_url TEXT
);
```

---

### One-to-Many (1:N) — Most Common

One user has many posts.

```sql
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Many-to-Many (M:N)

Students enroll in many courses. Courses have many students.

```sql
CREATE TABLE students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100)
);

CREATE TABLE courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255)
);

-- Junction table
CREATE TABLE enrollments (
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  course_id  UUID REFERENCES courses(id)  ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (student_id, course_id) -- composite PK prevents duplicates
);
```

---

## 🏦 Real-World Schema Example (Fintech)

```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  balance NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  CONSTRAINT balance_non_negative CHECK (balance >= 0)
);

CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  from_account_id UUID REFERENCES accounts(id),
  to_account_id   UUID REFERENCES accounts(id),
  amount NUMERIC(15, 2) NOT NULL,
  type VARCHAR(20) NOT NULL, -- 'transfer', 'deposit', 'withdrawal'
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT positive_amount CHECK (amount > 0)
);
```

---

## 🔄 Soft Delete Pattern

Never hard-delete important data. Mark it as deleted instead.

```sql
-- Add deleted_at column
ALTER TABLE users ADD COLUMN deleted_at TIMESTAMPTZ;

-- "Delete" a user
UPDATE users SET deleted_at = NOW() WHERE id = $1;

-- Query only active users
SELECT * FROM users WHERE deleted_at IS NULL;

-- Create a partial index for performance
CREATE INDEX idx_active_users ON users(email)
WHERE deleted_at IS NULL;
```

---
