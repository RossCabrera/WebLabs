# 07 — Functions, Triggers & Cursors

---

## ⚙️ PL/pgSQL Functions

Functions let you encapsulate reusable logic inside the database.

### Basic Function

```sql
CREATE OR REPLACE FUNCTION add_numbers(a INTEGER, b INTEGER)
RETURNS INTEGER AS $$
BEGIN
  RETURN a + b;
END;
$$ LANGUAGE plpgsql;

-- Call it
SELECT add_numbers(5, 3); -- returns 8
```

### Function with Variables

```sql
CREATE OR REPLACE FUNCTION calculate_tax(price NUMERIC, rate NUMERIC)
RETURNS NUMERIC AS $$
DECLARE
  tax_amount NUMERIC;
  total      NUMERIC;
BEGIN
  tax_amount := price * rate;
  total := price + tax_amount;
  RETURN total;
END;
$$ LANGUAGE plpgsql;
```

### Function with IF/ELSE

```sql
CREATE OR REPLACE FUNCTION get_discount(total NUMERIC)
RETURNS NUMERIC AS $$
BEGIN
  IF total >= 1000 THEN
    RETURN total * 0.10;  -- 10% discount
  ELSIF total >= 500 THEN
    RETURN total * 0.05;  -- 5% discount
  ELSE
    RETURN 0;
  END IF;
END;
$$ LANGUAGE plpgsql;
```

### Function Returning a Table

```sql
CREATE OR REPLACE FUNCTION get_user_orders(p_user_id UUID)
RETURNS TABLE(order_id UUID, total NUMERIC, status VARCHAR) AS $$
BEGIN
  RETURN QUERY
    SELECT o.id, o.total, o.status
    FROM orders o
    WHERE o.user_id = p_user_id
    ORDER BY o.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Call it
SELECT * FROM get_user_orders('some-uuid-here');
```

### Transfer Function (Fintech)

```sql
CREATE OR REPLACE FUNCTION transfer_funds(
  p_from_id UUID,
  p_to_id   UUID,
  p_amount  NUMERIC
)
RETURNS VOID AS $$
BEGIN
  -- Check sufficient funds
  IF (SELECT balance FROM accounts WHERE id = p_from_id) < p_amount THEN
    RAISE EXCEPTION 'Insufficient funds';
  END IF;

  UPDATE accounts SET balance = balance - p_amount WHERE id = p_from_id;
  UPDATE accounts SET balance = balance + p_amount WHERE id = p_to_id;

  INSERT INTO transactions (from_account_id, to_account_id, amount, type)
  VALUES (p_from_id, p_to_id, p_amount, 'transfer');
END;
$$ LANGUAGE plpgsql;

-- Call it (wrap in transaction for full safety)
BEGIN;
SELECT transfer_funds('uuid-a', 'uuid-b', 100.00);
COMMIT;
```

---

## 🚨 Error Handling in Functions

```sql
CREATE OR REPLACE FUNCTION safe_divide(a NUMERIC, b NUMERIC)
RETURNS NUMERIC AS $$
BEGIN
  RETURN a / b;

EXCEPTION
  WHEN division_by_zero THEN
    RAISE NOTICE 'Division by zero attempted';
    RETURN NULL;

  WHEN others THEN
    RAISE NOTICE 'Unexpected error: %', SQLERRM;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;
```

### Common Exception Types

| Exception | When |
| :----------- | :------ |
| `division_by_zero` | Dividing by 0 |
| `unique_violation` | Duplicate key insert |
| `foreign_key_violation` | FK constraint broken |
| `not_null_violation` | Inserting NULL in NOT NULL column |
| `check_violation` | CHECK constraint failed |
| `others` | Catch-all |

---

## 🔔 Triggers

Triggers automatically execute a function when specific events happen on a table.

### Syntax

```plaintext
BEFORE / AFTER   ← when to run
INSERT / UPDATE / DELETE / TRUNCATE  ← what event
FOR EACH ROW / FOR EACH STATEMENT    ← per row or once
```

### Auto-update `updated_at` Timestamp

```sql
-- Step 1: Create trigger function
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 2: Attach to table
CREATE TRIGGER trigger_set_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
```

### Audit Log Trigger

```sql
CREATE TABLE account_audit (
  id SERIAL PRIMARY KEY,
  account_id UUID,
  action VARCHAR(10),      -- 'INSERT', 'UPDATE', 'DELETE'
  old_balance NUMERIC,
  new_balance NUMERIC,
  changed_by TEXT DEFAULT current_user,
  changed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION audit_account_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    INSERT INTO account_audit(account_id, action, old_balance, new_balance)
    VALUES (OLD.id, 'UPDATE', OLD.balance, NEW.balance);
    RETURN NEW;

  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO account_audit(account_id, action, old_balance, new_balance)
    VALUES (OLD.id, 'DELETE', OLD.balance, NULL);
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_audit_accounts
AFTER UPDATE OR DELETE ON accounts
FOR EACH ROW
EXECUTE FUNCTION audit_account_changes();
```

### Prevent Negative Balance Trigger

```sql
CREATE OR REPLACE FUNCTION prevent_negative_balance()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.balance < 0 THEN
    RAISE EXCEPTION 'Balance cannot be negative. Current: %, Attempted: %',
      OLD.balance, NEW.balance;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_balance
BEFORE UPDATE ON accounts
FOR EACH ROW
WHEN (OLD.balance IS DISTINCT FROM NEW.balance)
EXECUTE FUNCTION prevent_negative_balance();
```

### Managing Triggers

```sql
-- Drop trigger
DROP TRIGGER trigger_set_updated_at ON users;

-- Disable trigger (useful for bulk imports)
ALTER TABLE users DISABLE TRIGGER trigger_set_updated_at;
ALTER TABLE users ENABLE TRIGGER trigger_set_updated_at;

-- List triggers on a table
SELECT trigger_name, event_manipulation, action_timing
FROM information_schema.triggers
WHERE event_object_table = 'users';
```

---

## 📖 Cursors

Cursors let you process rows one at a time — useful for large datasets where loading everything at once would use too much memory.

```sql
DO $$
DECLARE
  user_cursor CURSOR FOR SELECT * FROM users WHERE active = true;
  user_row users%ROWTYPE;
BEGIN
  OPEN user_cursor;

  LOOP
    FETCH NEXT FROM user_cursor INTO user_row;
    EXIT WHEN NOT FOUND;

    -- Process each row
    RAISE NOTICE 'Processing user: %', user_row.email;
  END LOOP;

  CLOSE user_cursor;
END;
$$;
```

> 📌 In modern Postgres, cursors are rarely needed for simple processing. Prefer set-based operations. Use cursors for row-by-row logic with side effects (e.g., calling external APIs, complex conditional updates).

---

## 🛠 Drop Functions

```sql
DROP FUNCTION IF EXISTS add_numbers(integer, integer);
DROP FUNCTION IF EXISTS transfer_funds(uuid, uuid, numeric);
```

---
