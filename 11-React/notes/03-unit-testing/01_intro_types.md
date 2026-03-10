# 🧪 Introduction to Testing — Types and Characteristics

## Why Write Automated Tests?

- Catch bugs **before** they reach production
- Allow refactoring with **confidence**
- Serve as **living documentation** of the code
- Reduce long-term manual QA time
- Make teamwork easier

---

## Types of Tests

```text
         /\
        /  \         ← Fewer tests, slower, more expensive
       / E2E\
      /------\
     /Integra-\
    / tion     \
   /------------\
  /  Unit Tests  \   ← More tests, faster, cheaper
 /________________\
```

### 1. 🔬 Unit Tests

Test **a single unit** of code in isolation: a function, a component, a hook.

```text
✅ Fast
✅ Easy to write
✅ Easy to debug
❌ Don't test integration between parts
```

**Examples:**

- A `calculateDiscount(price, percentage)` function returns the correct value
- A `Button` component renders the correct text
- A `useCounter` hook increments the value

```ts
// Example: unit test of a pure function
function add(a: number, b: number): number {
  return a + b;
}

test('add 2 + 3 should be 5', () => {
  expect(add(2, 3)).toBe(5);
});
```

---

### 2. 🔗 Integration Tests

Test that **multiple units work correctly together**.

```text
✅ Test real flows
✅ Detect problems between components
❌ Slower than unit tests
❌ Harder to debug
```

**Examples:**

- A form that calls an API on submit and shows the result
- A parent component that passes data to a child and both behave correctly
- A hook that uses an external service

```tsx
// Example: integration test
// Verifies that clicking "Add" shows the item in the list
test('adds an item to the list on click', async () => {
  render(<TodoApp />);
  await userEvent.type(screen.getByPlaceholderText('New task'), 'Learn Vitest');
  await userEvent.click(screen.getByRole('button', { name: /add/i }));
  expect(screen.getByText('Learn Vitest')).toBeInTheDocument();
});
```

---

### 3. 🌐 End-to-End Tests (E2E)

Test **the entire application** as a real user would, from the browser.

```text
✅ Test the complete system (frontend + backend)
✅ Catch real user-facing bugs
❌ Very slow (minutes)
❌ Brittle (break with UI changes)
❌ Require additional tools (Cypress, Playwright)
```

**Tools:** Cypress, Playwright, Selenium

```ts
// Example with Playwright (E2E)
test('user can log in', async ({ page }) => {
  await page.goto('https://my-app.com/login');
  await page.fill('[name=email]', 'ana@example.com');
  await page.fill('[name=password]', '12345');
  await page.click('button[type=submit]');
  await expect(page).toHaveURL('/dashboard');
});
```

---

## Characteristics of Good Automated Tests

A good test should be **F.I.R.S.T.**:

| Letter | Characteristic | Description |
| :------- | :---------------- | :------------- |
| **F** | Fast | Should run in milliseconds |
| **I** | Independent | Doesn't depend on order or other tests |
| **R** | Repeatable | Same result always, in any environment |
| **S** | Self-validating | Pass or Fail without manual inspection |
| **T** | Timely | Written close to the code it tests |

### Other important characteristics

```text
✅ One test = one responsibility
✅ Descriptive names: "what it does" and "under what condition"
✅ Don't depend on external data (DBs, real APIs)
✅ Easy to read as documentation
✅ Test behavior, not implementation details
```

### Writing good test names

```ts
// ❌ Vague name
test('test button', () => { ... });

// ✅ Descriptive name: [what] + [condition] + [expected result]
test('submit button should be disabled when the form is empty', () => { ... });
test('calculateDiscount should return 0 when price is 0', () => { ... });
test('UserCard shows the "Admin" role when the user has admin permissions', () => { ... });
```

---

## Quick Summary

```text
Unit Tests        → isolated function/component  → Vitest
Integration Tests → multiple modules together    → Vitest + Testing Library
E2E Tests         → full app in browser          → Playwright / Cypress
```
