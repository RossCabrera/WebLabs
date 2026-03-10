# 🔴🟡🟢 Triple AAA — Describe and Test

## The AAA Pattern (Arrange, Act, Assert)

This is the standard structure for writing clear, readable tests.

```text
Arrange  →  Set up the scenario (data, mocks, instances)
Act      →  Execute the action being tested
Assert   →  Verify the result matches expectations
```

### Basic example

```ts
// src/utils/cart.ts
export function calculateTotal(items: { price: number; qty: number }[]): number {
  return items.reduce((total, item) => total + item.price * item.qty, 0);
}
```

```ts
// src/utils/cart.test.ts
import { calculateTotal } from './cart';

test('calculateTotal should correctly sum the cart total', () => {
  // 🔵 ARRANGE — set up the data
  const items = [
    { price: 10, qty: 2 },  // 20
    { price: 5,  qty: 3 },  // 15
  ];

  // 🟡 ACT — call the function
  const result = calculateTotal(items);

  // 🟢 ASSERT — verify the result
  expect(result).toBe(35);
});
```

### Another example: function with multiple cases

```ts
// src/utils/validators.ts
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

```ts
// src/utils/validators.test.ts
import { isValidEmail } from './validators';

describe('isValidEmail', () => {
  test('returns true for a valid email', () => {
    // Arrange
    const email = 'user@example.com';

    // Act
    const result = isValidEmail(email);

    // Assert
    expect(result).toBe(true);
  });

  test('returns false if @ is missing', () => {
    // Arrange
    const email = 'userexample.com';

    // Act
    const result = isValidEmail(email);

    // Assert
    expect(result).toBe(false);
  });

  test('returns false for an empty string', () => {
    expect(isValidEmail('')).toBe(false);
  });
});
```

---

## `describe` — Grouping Related Tests

`describe` creates a **container block** that groups related tests. It provides organization and context.

```ts
describe('group name', () => {
  test('case 1', () => { ... });
  test('case 2', () => { ... });
});
```

### Nested describes

```ts
describe('ShoppingCart', () => {

  describe('calculateTotal', () => {
    test('returns 0 for an empty cart', () => {
      expect(calculateTotal([])).toBe(0);
    });

    test('calculates correctly with discount', () => {
      const items = [{ price: 100, qty: 1 }];
      expect(calculateTotal(items, 0.1)).toBe(90);  // 10% discount
    });
  });

  describe('addItem', () => {
    test('adds an item to the cart', () => {
      const cart = [];
      const result = addItem(cart, { id: 1, name: 'Laptop', price: 999 });
      expect(result).toHaveLength(1);
    });

    test('does not add duplicate items', () => {
      const item = { id: 1, name: 'Laptop', price: 999 };
      const cart = [item];
      const result = addItem(cart, item);
      expect(result).toHaveLength(1);  // still 1
    });
  });
});
```

### Terminal output with nested describes

```text
✓ ShoppingCart
  ✓ calculateTotal
    ✓ returns 0 for an empty cart
    ✓ calculates correctly with discount
  ✓ addItem
    ✓ adds an item to the cart
    ✓ does not add duplicate items
```

---

## `test` vs `it` — They're the same

```ts
// These two lines are identical:
test('does something', () => { ... });
it('does something', () => { ... });

// 'it' reads more naturally: "it should..."
it('should return 0 for empty cart', () => { ... });
```

---

## Lifecycle Hooks

```ts
describe('UserService', () => {

  beforeAll(() => {
    // Runs ONCE before all tests in the describe
    // Useful for: connecting to DB, initializing mock servers
    console.log('Starting test suite');
  });

  afterAll(() => {
    // Runs ONCE after all tests
    // Useful for: closing connections, cleaning up resources
    console.log('Finishing test suite');
  });

  beforeEach(() => {
    // Runs BEFORE EACH test
    // Useful for: resetting state, clearing mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Runs AFTER EACH test
    // Useful for: cleaning up DOM, restoring mocks
  });

  test('test 1', () => { ... });
  test('test 2', () => { ... });
});
```

---

## Skipping and Focusing Tests

```ts
// Skip a test (marks it as "skipped")
test.skip('this test is under construction', () => { ... });
it.skip('...', () => { ... });

// Run ONLY this test (useful for debugging)
test.only('only run this test', () => { ... });

// Also works with describe
describe.skip('disabled group', () => { ... });
describe.only('only this group', () => { ... });
```

> ⚠️ Never commit `.only` to the repo. Use `-t` flag to filter:
>
> ```bash
> npx vitest -t "calculateTotal"    # only runs matching tests
> ```

---

## Full Example: Module with AAA

```ts
// src/utils/password.ts
export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8)       errors.push('Minimum 8 characters');
  if (!/[A-Z]/.test(password))   errors.push('Must contain at least one uppercase letter');
  if (!/[0-9]/.test(password))   errors.push('Must contain at least one number');

  return { valid: errors.length === 0, errors };
}
```

```ts
// src/utils/password.test.ts
import { validatePassword } from './password';

describe('validatePassword', () => {
  describe('valid passwords', () => {
    test('accepts password with uppercase, number, and 8+ characters', () => {
      // Arrange
      const password = 'Secure123';

      // Act
      const result = validatePassword(password);

      // Assert
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('invalid passwords', () => {
    test('rejects a too-short password', () => {
      const result = validatePassword('Ab1');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Minimum 8 characters');
    });

    test('rejects a password without uppercase letters', () => {
      const result = validatePassword('password123');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Must contain at least one uppercase letter');
    });

    test('rejects a password without numbers', () => {
      const result = validatePassword('Password');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Must contain at least one number');
    });

    test('accumulates multiple errors', () => {
      const result = validatePassword('abc');
      expect(result.errors).toHaveLength(3);
    });
  });
});
```
