# 08 — Search: Full-Text & Fuzzy Search

---

## 🔤 LIKE — Simple Pattern Matching

```sql
-- Starts with
SELECT * FROM users WHERE name LIKE 'An%';

-- Ends with
SELECT * FROM users WHERE name LIKE '%son';

-- Contains
SELECT * FROM users WHERE name LIKE '%ana%';

-- Case-insensitive
SELECT * FROM users WHERE name ILIKE '%ana%';
```

> ⚠️ `LIKE` with a leading `%` (e.g. `'%ana%'`) can't use a regular B-Tree index — it does a full scan.

---

## 📝 Full-Text Search (FTS)

Built-in, powerful, and fast. Beats `LIKE` for searching text content.

### Core Concepts

- `tsvector` — a processed document (words, normalized)
- `tsquery` — a search query
- `@@` — the match operator

```sql
-- Basic search
SELECT *
FROM articles
WHERE to_tsvector('english', content)
   @@ to_tsquery('english', 'database');

-- Multi-word (AND)
WHERE to_tsvector('english', content) @@ to_tsquery('english', 'database & performance');

-- OR
WHERE to_tsvector('english', content) @@ to_tsquery('english', 'postgres | mysql');

-- NOT
WHERE to_tsvector('english', content) @@ to_tsquery('english', 'database & !mysql');

-- Phrase (words next to each other)
WHERE to_tsvector('english', content) @@ phraseto_tsquery('english', 'open source database');

-- Prefix (autocomplete)
WHERE to_tsvector('english', content) @@ to_tsquery('english', 'datab:*');
```

### Search Multiple Columns

```sql
SELECT *
FROM articles
WHERE to_tsvector('english', title || ' ' || content)
   @@ to_tsquery('english', 'postgres');
```

### Ranking Results

```sql
SELECT
  title,
  ts_rank(to_tsvector('english', content), query) AS rank
FROM articles,
     to_tsquery('english', 'database') query
WHERE to_tsvector('english', content) @@ query
ORDER BY rank DESC;
```

---

## ⚡ FTS with Generated Column + Index (Best Practice)

For production, pre-compute the tsvector and index it:

```sql
-- Add a generated tsvector column
ALTER TABLE articles
ADD COLUMN search_vector TSVECTOR
GENERATED ALWAYS AS (
  to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content, ''))
) STORED;

-- Create GIN index on it
CREATE INDEX idx_articles_fts ON articles USING GIN(search_vector);

-- Now queries are fast
SELECT * FROM articles
WHERE search_vector @@ to_tsquery('english', 'database');
```

---

## 🔍 Fuzzy Search (pg_trgm)

Finds approximate matches — tolerates typos and misspellings.

```sql
-- Enable extension (once per database)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Similar name (%) — similarity threshold default 0.3
SELECT * FROM users WHERE name % 'Jhon';         -- finds "John"
SELECT * FROM users WHERE name % 'Anastasha';    -- finds "Anastasia"

-- Custom threshold
SELECT * FROM users
WHERE similarity(name, 'Jhon') > 0.4
ORDER BY similarity(name, 'Jhon') DESC;

-- Show similarity score
SELECT name, similarity(name, 'Jhon') AS score
FROM users
ORDER BY score DESC
LIMIT 10;
```

### Index for Fuzzy Search

```sql
CREATE INDEX idx_users_name_trgm ON users USING GIN(name gin_trgm_ops);
```

---

## 🔎 Combining FTS + Fuzzy

```sql
-- Full text for keywords, fuzzy for names
SELECT *
FROM products
WHERE
  search_vector @@ to_tsquery('english', 'laptop')  -- full text
  OR name % 'Labtop';                               -- typo tolerance
```

---

## 📌 Which Search to Use?

| Situation | Use |
| :----------- | :----- |
| Exact match on known field | `=` |
| Simple prefix search | `LIKE 'abc%'` |
| Case-insensitive contains | `ILIKE '%abc%'` |
| Articles, blog posts, documents | **Full-Text Search** |
| User names, product names (typos) | **pg_trgm fuzzy** |
| Both | Combine FTS + trgm |

---
