# 10 — PostgreSQL with Node.js & Express

---

## 📦 Setup

```bash
npm install pg
npm install dotenv  # for env vars
```

```env
# .env
DATABASE_URL=postgresql://postgres:password@localhost:5432/mydb
```

---

## 🔌 Connection: Pool (Production Standard)

```js
// db.js
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // OR use individual fields:
  // user: process.env.DB_USER,
  // host: process.env.DB_HOST,
  // database: process.env.DB_NAME,
  // password: process.env.DB_PASSWORD,
  // port: 5432,

  max: 20,                    // max simultaneous connections
  idleTimeoutMillis: 30000,   // close idle connections after 30s
  connectionTimeoutMillis: 2000, // error if can't connect in 2s
});

// Test connection
pool.connect((err) => {
  if (err) console.error('DB connection failed:', err);
  else console.log('✅ Connected to PostgreSQL');
});

export default pool;
```

> ✅ Always use `Pool` over `Client` in production. Pool manages multiple connections automatically.

---

## 🔎 SELECT

```js
// GET /users
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email FROM users WHERE deleted_at IS NULL');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /users/:id
app.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT id, name, email FROM users WHERE id = $1 AND deleted_at IS NULL',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

---

## ➕ INSERT

```js
// POST /users
app.post('/users', async (req, res) => {
  const { name, email, password_hash } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at`,
      [name, email, password_hash]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {  // unique_violation
      return res.status(409).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

---

## ✏️ UPDATE

```js
// PUT /users/:id
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users
       SET name = $1, email = $2
       WHERE id = $3 AND deleted_at IS NULL
       RETURNING id, name, email`,
      [name, email, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

---

## ❌ DELETE (Soft Delete)

```js
// DELETE /users/:id
app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `UPDATE users
       SET deleted_at = NOW()
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted', id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

---

## 💸 Transactions in Node.js

```js
app.post('/transfer', async (req, res) => {
  const { from_id, to_id, amount } = req.body;
  const client = await pool.connect();  // get dedicated client for transaction

  try {
    await client.query('BEGIN');
    await client.query(
      'SET TRANSACTION ISOLATION LEVEL SERIALIZABLE'
    );

    // Lock both accounts
    const fromResult = await client.query(
      'SELECT balance FROM accounts WHERE id = $1 FOR UPDATE',
      [from_id]
    );

    if (fromResult.rows[0].balance < amount) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Insufficient funds' });
    }

    await client.query(
      'UPDATE accounts SET balance = balance - $1 WHERE id = $2',
      [amount, from_id]
    );

    await client.query(
      'UPDATE accounts SET balance = balance + $1 WHERE id = $2',
      [amount, to_id]
    );

    await client.query(
      `INSERT INTO transactions (from_account_id, to_account_id, amount, type)
       VALUES ($1, $2, $3, 'transfer')`,
      [from_id, to_id, amount]
    );

    await client.query('COMMIT');
    res.json({ message: 'Transfer successful' });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Transfer failed' });
  } finally {
    client.release();  // ← always release back to pool
  }
});
```

---

## 🛡 Parameterized Queries (Security)

```js
// ❌ NEVER do this — SQL injection vulnerability
const result = await pool.query(
  `SELECT * FROM users WHERE email = '${email}'`
);

// ✅ Always use $1, $2, $3... parameters
const result = await pool.query(
  'SELECT * FROM users WHERE email = $1',
  [email]
);
```

**Why?** User input `' OR '1'='1` can delete your database. Parameterized queries prevent this entirely.

---

## 🔢 Postgres Error Codes

```js
switch (err.code) {
  case '23505': // unique_violation
    return res.status(409).json({ error: 'Already exists' });
  case '23503': // foreign_key_violation
    return res.status(400).json({ error: 'Referenced record not found' });
  case '23502': // not_null_violation
    return res.status(400).json({ error: 'Missing required field' });
  case '23514': // check_violation
    return res.status(400).json({ error: 'Value violates constraints' });
  default:
    return res.status(500).json({ error: 'Database error' });
}
```

---

## 📋 Pagination Pattern

```js
app.get('/products', async (req, res) => {
  const page  = parseInt(req.query.page)  || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  try {
    const [data, count] = await Promise.all([
      pool.query(
        'SELECT * FROM products ORDER BY created_at DESC LIMIT $1 OFFSET $2',
        [limit, offset]
      ),
      pool.query('SELECT COUNT(*) FROM products')
    ]);

    res.json({
      data: data.rows,
      total: parseInt(count.rows[0].count),
      page,
      pages: Math.ceil(count.rows[0].count / limit)
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

---
