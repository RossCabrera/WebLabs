# 02 — ACID, Transactions & Isolation Levels

---

## 🧱 ACID — What Makes Databases Reliable

ACID is a set of guarantees that ensure your data stays correct even when things go wrong.

---

### A — Atomicity

> All or nothing. Either every operation in a transaction succeeds, or none of them do.

```sql
BEGIN;

UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

COMMIT;  -- both succeed together
-- or
ROLLBACK; -- both are undone together
```

📌 Real use: bank transfer. You can't deduct money from one account without adding it to another.

---

### C — Consistency

> The database always moves from one valid state to another. Constraints are never violated.

```sql
-- This CHECK constraint enforces consistency
ALTER TABLE accounts
ADD CONSTRAINT no_negative_balance CHECK (balance >= 0);

-- This transaction will FAIL if balance would go negative
BEGIN;
UPDATE accounts SET balance = balance - 9999999 WHERE id = 1;
COMMIT; -- ❌ Rejected — constraint violation
```

---

### I — Isolation

> Concurrent transactions don't interfere with each other incorrectly.

PostgreSQL uses **MVCC (Multi-Version Concurrency Control)**:

- Each transaction sees a **snapshot** of the data
- Reads don't block writes
- Writes don't block reads

---

### D — Durability

> Once you COMMIT, the data is saved permanently — even if the server crashes immediately after.

PostgreSQL uses **WAL (Write-Ahead Logging)** to guarantee this.

---

## 🔁 Transactions

```sql
-- Basic structure
BEGIN;
  -- your SQL here
COMMIT;   -- save changes
-- or
ROLLBACK; -- undo everything
```

### Savepoints — Partial Rollback

```sql
BEGIN;

INSERT INTO orders (user_id, total) VALUES (1, 500);

SAVEPOINT before_payment;

INSERT INTO payments (order_id, amount) VALUES (1, 500);
-- something went wrong...

ROLLBACK TO before_payment;  -- undo only the payment insert

-- order still exists, we can retry payment
COMMIT;
```

📌 Real use: multi-step financial operations where partial failure is common.

---

## 🔒 Isolation Levels

Controls how much transactions are isolated from each other.

```sql
BEGIN;
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
-- your queries
COMMIT;
```

| Level | Description | Use When |
| :------- | :------------- | :---------- |
| `READ COMMITTED` | See only committed data at query time (default) | Most CRUD apps |
| `REPEATABLE READ` | Same snapshot for entire transaction | Reports, analytics |
| `SERIALIZABLE` | Fully sequential — safest, most expensive | Fintech, payments |

### READ COMMITTED (Default)

```sql
-- Each query sees the latest committed data
-- Two queries in the same transaction CAN see different data
-- Good enough for most applications
BEGIN;
SELECT balance FROM accounts WHERE id = 1; -- sees $500
-- another transaction commits a change here
SELECT balance FROM accounts WHERE id = 1; -- might now see $400
COMMIT;
```

### REPEATABLE READ

```sql
-- Entire transaction sees same snapshot
BEGIN;
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
SELECT balance FROM accounts WHERE id = 1; -- sees $500
-- another transaction commits here
SELECT balance FROM accounts WHERE id = 1; -- still sees $500
COMMIT;
```

### SERIALIZABLE

```sql
-- Transactions behave as if they ran one after another
-- Prevents ALL anomalies including phantom reads
BEGIN;
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
SELECT SUM(balance) FROM accounts WHERE user_id = 1;
-- ... complex business logic ...
UPDATE accounts SET balance = ... WHERE id = 1;
COMMIT;
-- If conflict detected, Postgres will rollback and you must retry
```

📌 For fintech apps: use **SERIALIZABLE** for critical operations, **REPEATABLE READ** for reports.

---

## 🔐 Row-Level Locking (Prevent Race Conditions)

```sql
BEGIN;

-- Lock the row so no other transaction can modify it
SELECT * FROM accounts
WHERE id = 1
FOR UPDATE;  -- ← this is the lock

UPDATE accounts SET balance = balance - 100 WHERE id = 1;

COMMIT;
```

> Without `FOR UPDATE`, two transactions could read the same balance and both subtract from it — causing a race condition.

---

## 🚨 Common Transaction Mistakes

```sql
-- ❌ Forgetting to COMMIT (changes hang, lock held)
BEGIN;
UPDATE users SET name = 'test' WHERE id = 1;
-- never committed → other queries wait forever

-- ✅ Always COMMIT or ROLLBACK
BEGIN;
UPDATE users SET name = 'test' WHERE id = 1;
COMMIT;
```

```sql
-- ❌ No error handling in app code (Node.js)
await db.query('BEGIN');
await db.query('UPDATE accounts ...');  -- if this throws, no rollback!

-- ✅ Proper pattern
await db.query('BEGIN');
try {
  await db.query('UPDATE accounts SET balance = balance - $1 WHERE id = $2', [100, 1]);
  await db.query('UPDATE accounts SET balance = balance + $1 WHERE id = $2', [100, 2]);
  await db.query('COMMIT');
} catch (err) {
  await db.query('ROLLBACK');
  throw err;
}
```

---
