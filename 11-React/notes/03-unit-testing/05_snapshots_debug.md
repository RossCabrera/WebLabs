# 📸 Snapshots and Console Debugging

---

## Snapshots

Snapshots save a "photo" of the output of a function or component. On the next run, Vitest compares the current output to the saved photo. If they differ, the test **fails**.

```text
First run       → creates the snapshot (.snap file)
Subsequent runs → compares against the saved snapshot
```

### Basic value snapshot

```ts
// src/utils/format.ts
export function formatUser(user: { name: string; role: string }) {
  return `${user.name} [${user.role.toUpperCase()}]`;
}
```

```ts
// src/utils/format.test.ts
import { formatUser } from './format';

test('formatUser generates the correct string', () => {
  const result = formatUser({ name: 'Ana Garcia', role: 'admin' });

  // On the first run, this CREATES the snapshot
  expect(result).toMatchSnapshot();
});
```

This generates the file `__snapshots__/format.test.ts.snap`:

```text
// Vitest Snapshot v1

exports[`formatUser generates the correct string 1`] = `"Ana Garcia [ADMIN]"`;
```

### Inline snapshot (in the same file)

```ts
test('formatUser generates the correct string', () => {
  const result = formatUser({ name: 'Ana Garcia', role: 'admin' });

  // The snapshot is written directly in the test (more visible)
  expect(result).toMatchInlineSnapshot(`"Ana Garcia [ADMIN]"`);
});
```

---

## React Component Snapshots

The most common case: capture the rendered HTML of a component.

```tsx
// src/components/Badge.tsx
interface BadgeProps {
  label: string;
  variant: 'success' | 'error' | 'warning';
}

function Badge({ label, variant }: BadgeProps) {
  return (
    <span className={`badge badge-${variant}`}>
      {label}
    </span>
  );
}

export default Badge;
```

```tsx
// src/components/Badge.test.tsx
import { render } from '@testing-library/react';
import Badge from './Badge';

test('Badge renders correctly (snapshot)', () => {
  const { container } = render(<Badge label="Active" variant="success" />);
  expect(container).toMatchSnapshot();
});
```

Generated snapshot:

```bash
exports[`Badge renders correctly (snapshot) 1`] = `
<div>
  <span
    class="badge badge-success"
  >
    Active
  </span>
</div>
`;
```

---

## Updating Snapshots

When you intentionally change a component, previous snapshots will fail. To update them:

```bash
# Update all snapshots
npx vitest run --update-snapshots
npx vitest run -u

# In the UI, there's an "Update Snapshots" button
```

> ⚠️ **Always review** changes in `.snap` files before committing. An unreviewed snapshot update can hide regressions.

---

## When to Use Snapshots

```text
✅ Stable UI components that don't change frequently
✅ Functions that generate complex strings/objects
✅ Verifying a refactor doesn't change the output
❌ Components that change frequently (too many false positives)
❌ Data with timestamps or random IDs (will always differ)
```

### Handling dynamic values in snapshots

```tsx
test('snapshot with dynamic date', () => {
  const result = {
    user: 'Ana',
    createdAt: new Date().toISOString(),  // changes every time
    id: Math.random(),                    // changes every time
  };

  expect(result).toMatchSnapshot({
    createdAt: expect.any(String),  // accepts any string
    id: expect.any(Number),         // accepts any number
  });
});
```

---

## Console Debugging

### `console.log` in tests

You can use `console.log` freely in tests. Vitest shows them in the output:

```ts
test('debug the result', () => {
  const result = calculateTotal([{ price: 10, qty: 3 }]);

  console.log('Result:', result);                    // appears in terminal
  console.log(JSON.stringify(result, null, 2));      // formatted objects

  expect(result).toBe(30);
});
```

### `debug()` from Testing Library

```tsx
import { render, screen } from '@testing-library/react';

test('debug the DOM', () => {
  render(<MyComponent />);

  // Prints the full HTML of the rendered component
  screen.debug();

  // Debug a specific element
  screen.debug(screen.getByRole('button'));
});
```

Terminal output:

```html
<body>
  <div>
    <button class="btn btn-primary">
      Submit
    </button>
  </div>
</body>
```

### `prettyDOM` for manual inspection

```tsx
import { render } from '@testing-library/react';
import { prettyDOM } from '@testing-library/dom';

test('manually inspect the DOM', () => {
  const { container } = render(<UserCard name="Ana" />);

  console.log(prettyDOM(container));        // formatted HTML
  console.log(prettyDOM(container, 500));   // limit to 500 chars
});
```

---

## Suppressing Logs in Tests

Sometimes components emit `console.error` in tests (propTypes warnings, etc.). You can suppress them:

```ts
// In an individual test
test('no console warnings', () => {
  const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  render(<ComponentWithWarnings />);

  expect(consoleSpy).not.toHaveBeenCalled(); // or simply ignore it
  consoleSpy.mockRestore();
});

// Globally in setupTests.ts (to suppress across all tests)
beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});
```

---

## Verbose Mode for More Detail

```bash
# See all tests with their full names
npx vitest run --reporter=verbose

# In vite.config.ts
test: {
  reporter: 'verbose',
}
```

---

## Debugging Tips

```ts
// 1. Use test.only to isolate the failing test
test.only('only run this one', () => { ... });

// 2. Pause with await (in async tests)
test('debug async', async () => {
  const result = await fetchData();
  console.log('result:', result);  // inspect before the expect
  expect(result).toBeDefined();
});

// 3. Test the expect before the logic
test('verify data structure', () => {
  const data = getData();
  console.log(JSON.stringify(data, null, 2));  // see full structure
  // then write the expect
});

// 4. Use getByRole with { hidden: true } if you can't find the element
screen.getByRole('button', { hidden: true });

// 5. logRoles — shows all available accessible roles
import { logRoles } from '@testing-library/dom';
const { container } = render(<App />);
logRoles(container);
```
