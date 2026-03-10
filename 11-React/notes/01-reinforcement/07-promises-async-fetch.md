# 07 · Promises, Async/Await, and Fetch API

## Promises (`Promise`)

A promise represents a value that will be available in the future (or will fail).

```typescript
// Create a promise manually
const myPromise = new Promise<string>((resolve, reject) => {
  const success = true;

  if (success) {
    resolve("Operation successful!");
  } else {
    reject(new Error("Something went wrong"));
  }
});

// Consume with .then() / .catch() / .finally()
myPromise
  .then((result) => console.log(result))
  .catch((error) => console.error(error.message))
  .finally(() => console.log("Always runs"));
```

---

## Chaining Promises

```typescript
function getUserId(): Promise<number> {
  return Promise.resolve(42);
}

function getProfile(id: number): Promise<{ name: string }> {
  return Promise.resolve({ name: "Ana" });
}

function getPosts(name: string): Promise<string[]> {
  return Promise.resolve([`Post by ${name} #1`, `Post by ${name} #2`]);
}

// Chaining
getUserId()
  .then((id) => getProfile(id))
  .then(({ name }) => getPosts(name))
  .then((posts) => console.log(posts))
  .catch((err) => console.error(err));
```

---

## `Promise.all`, `race`, `allSettled`, `any`

```typescript
const p1 = fetch("https://jsonplaceholder.typicode.com/users/1").then(r => r.json());
const p2 = fetch("https://jsonplaceholder.typicode.com/users/2").then(r => r.json());
const p3 = fetch("https://jsonplaceholder.typicode.com/users/3").then(r => r.json());

// Promise.all: waits for all, fails if any one fails
const [u1, u2, u3] = await Promise.all([p1, p2, p3]);

// Promise.allSettled: waits for all regardless of result
const results = await Promise.allSettled([p1, p2, p3]);
results.forEach((r) => {
  if (r.status === "fulfilled") console.log(r.value);
  else console.error(r.reason);
});

// Promise.race: resolves/rejects with the first one to finish
const first = await Promise.race([p1, p2, p3]);

// Promise.any: resolves with the first successful one (ignores rejections)
const success = await Promise.any([p1, p2, p3]);
```

---

## Async / Await

`async/await` is syntactic sugar over promises. It makes asynchronous code more readable.

```typescript
// An async function always returns a Promise
async function getData(): Promise<string> {
  return "data"; // equivalent to Promise.resolve("data")
}

// await pauses execution until the promise resolves
async function main() {
  const data = await getData();
  console.log(data); // "data"
}
```

---

## Error Handling with async/await

```typescript
// try/catch replaces .catch()
async function loadUser(id: number) {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const user = await response.json();
    return user;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
    }
    throw error; // re-throw if the caller needs to handle it
  } finally {
    console.log("Attempt completed");
  }
}
```

---

## Fetch API

`fetch` makes HTTP requests and returns a `Promise<Response>`.

```typescript
interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

// GET
async function getPost(id: number): Promise<Post> {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json() as Promise<Post>;
}

// POST
async function createPost(post: Omit<Post, "id">): Promise<Post> {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json() as Promise<Post>;
}

// PUT
async function updatePost(id: number, data: Partial<Post>): Promise<Post> {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json() as Promise<Post>;
}

// DELETE
async function deletePost(id: number): Promise<void> {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
}
```

---

## Reusable HTTP Service

```typescript
async function http<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const message = await res.text();
    throw new Error(`HTTP ${res.status}: ${message}`);
  }
  return res.json() as Promise<T>;
}

// GET
const post = await http<Post>("https://jsonplaceholder.typicode.com/posts/1");

// POST
const newPost = await http<Post>("https://jsonplaceholder.typicode.com/posts", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title: "New", body: "Content", userId: 1 }),
});
```

---

## Controlled Concurrency

```typescript
// Run N requests in parallel with a limit
async function runInBatches<T>(
  items: T[],
  size: number,
  task: (item: T) => Promise<void>
): Promise<void> {
  for (let i = 0; i < items.length; i += size) {
    const batch = items.slice(i, i + size);
    await Promise.all(batch.map(task));
  }
}

const ids = [1, 2, 3, 4, 5, 6, 7, 8];
await runInBatches(ids, 3, async (id) => {
  const post = await getPost(id);
  console.log(post.title);
});
```
