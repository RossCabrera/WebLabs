# 🚀 Fetch API & Async/Await Complete Guide

## 🧠 The Mental Model (Remember This First!)

```plaintext
Async Flow: Request → Wait → Receive → Process → Display
```

**Key Concept:** Async/await makes asynchronous code look synchronous, making it easier to read and debug!

---

## 📖 Introduction to Fetch & Async/Await

### What is Fetch?

Fetch is the modern way to make HTTP requests in JavaScript. It replaced the old `XMLHttpRequest` (XHR) method and returns **Promises**, making it perfect for async/await.

### What is Async/Await?

Async/await is syntactic sugar over Promises that makes asynchronous code look and behave like synchronous code, without blocking execution.

**Think of it like:**

- **Async** = "This function will wait for something"
- **Await** = "Wait here until this Promise resolves"

---

## 🎯 Why Use Fetch + Async/Await?

| **Old Way (XHR)**              | **Fetch + Promises**               | **Fetch + Async/Await** ✨    |
|--------------------------------|------------------------------------|-------------------------------|
| Verbose, callback hell         | Better, but still `.then()` chains | Clean, readable, modern       |
| Hard to debug                  | Easier debugging                   | Easiest debugging             |
| Error handling messy           | `.catch()` chains                  | Try/catch blocks              |
| Not Promise-based              | Promise-based                      | Promise-based + clean syntax  |

---

## 📋 Quick Reference Table

| I Want To...              | Fetch + Async/Await                                    | Old XHR Way                          |
|---------------------------|--------------------------------------------------------|--------------------------------------|
| GET data                  | `await fetch(url)`                                     | `xhr.open('GET', url)`               |
| POST data                 | `await fetch(url, {method: 'POST'})`                   | `xhr.open('POST', url)`              |
| Get JSON                  | `await response.json()`                                | `JSON.parse(xhr.responseText)`       |
| Handle errors             | `try/catch`                                            | `xhr.onerror`                        |
| Set headers               | `{headers: {'Content-Type': 'application/json'}}`      | `xhr.setRequestHeader()`             |
| Wait for response         | `await`                                                | Callback functions                   |
| Multiple requests         | `await Promise.all([...])`                             | Nested callbacks (callback hell)     |

---

## 🔥 The Basic Syntax

### Simple Fetch (Promise style)

```javascript
// Promise style - OK but can get messy
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

### Fetch with Async/Await (Modern & Clean!)

```javascript
// Async/Await - MUCH BETTER! ✨
async function getData() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
}

getData();
```

---

## 💡 Understanding Async/Await

### The Rules

1. **`async`** keyword goes before the function declaration
2. **`await`** can only be used inside an `async` function
3. **`await`** pauses execution until the Promise resolves
4. Always use **`try/catch`** for error handling
5. An `async` function always returns a Promise

### Visual Flow

```javascript
async function example() {
  console.log('1. Start');
  
  const result = await someAsyncOperation();  // ⏸️ WAIT HERE
  
  console.log('2. Continue after wait');
  console.log(result);
}

// Other code keeps running while waiting!
console.log('3. I run immediately!');
```

**Output:**

```plaintext
1. Start
3. I run immediately!
2. Continue after wait
[result data]
```

---

## 🎯 20 Essential Patterns

### 1️⃣ Basic GET Request

**Use for:** Fetching data from an API

```javascript
// Async/Await
async function getUsers() {
  try {
    const response = await fetch('https://api.example.com/users');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const users = await response.json();
    console.log(users);
  } catch (error) {
    console.error('Failed to fetch users:', error);
  }
}

// Promise style (old way)
fetch('https://api.example.com/users')
  .then(response => {
    if (!response.ok) throw new Error('HTTP error!');
    return response.json();
  })
  .then(users => console.log(users))
  .catch(error => console.error(error));
```

### 2️⃣ POST Request (Send Data)

**Use for:** Creating new resources, sending form data

```javascript
// Async/Await
async function createUser(userData) {
  try {
    const response = await fetch('https://api.example.com/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });
    
    const newUser = await response.json();
    console.log('User created:', newUser);
    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
  }
}

// Usage
createUser({ name: 'John', email: 'john@example.com' });
```

### 3️⃣ PUT Request (Update Data)

**Use for:** Updating existing resources

```javascript
async function updateUser(userId, updates) {
  try {
    const response = await fetch(`https://api.example.com/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates)
    });
    
    const updatedUser = await response.json();
    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
  }
}

// Usage
updateUser(123, { name: 'Jane Doe' });
```

### 4️⃣ DELETE Request

**Use for:** Deleting resources

```javascript
async function deleteUser(userId) {
  try {
    const response = await fetch(`https://api.example.com/users/${userId}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      console.log('User deleted successfully');
    }
  } catch (error) {
    console.error('Error deleting user:', error);
  }
}
```

### 5️⃣ Multiple Requests in Parallel

**Use for:** Fetching multiple resources simultaneously

```javascript
// Async/Await with Promise.all - FAST! ⚡
async function getAllData() {
  try {
    const [users, posts, comments] = await Promise.all([
      fetch('https://api.example.com/users').then(r => r.json()),
      fetch('https://api.example.com/posts').then(r => r.json()),
      fetch('https://api.example.com/comments').then(r => r.json())
    ]);
    
    console.log({ users, posts, comments });
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Sequential (SLOW - don't do this!) 🐌
async function getAllDataSlow() {
  const users = await fetch('/users').then(r => r.json());     // Wait
  const posts = await fetch('/posts').then(r => r.json());     // Then wait
  const comments = await fetch('/comments').then(r => r.json()); // Then wait again
  // This takes 3x longer!
}
```

### 6️⃣ Search with Debouncing

**Use for:** Search bars, autocomplete

```javascript
let timeoutId;

async function searchUsers(query) {
  clearTimeout(timeoutId);
  
  timeoutId = setTimeout(async () => {
    try {
      const response = await fetch(`https://api.example.com/search?q=${query}`);
      const results = await response.json();
      displayResults(results);
    } catch (error) {
      console.error('Search failed:', error);
    }
  }, 300); // Wait 300ms after user stops typing
}

// Usage with input
document.querySelector('#search').addEventListener('input', (e) => {
  searchUsers(e.target.value);
});
```

### 7️⃣ Pagination

**Use for:** Loading data in chunks

```javascript
async function fetchPage(pageNumber) {
  try {
    const response = await fetch(
      `https://api.example.com/items?page=${pageNumber}&limit=10`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching page:', error);
  }
}

// Load more button
document.querySelector('#loadMore').addEventListener('click', async () => {
  const nextPage = await fetchPage(currentPage + 1);
  appendItems(nextPage);
  currentPage++;
});
```

### 8️⃣ File Upload

**Use for:** Uploading images, documents

```javascript
async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await fetch('https://api.example.com/upload', {
      method: 'POST',
      body: formData // Don't set Content-Type, browser does it automatically
    });
    
    const result = await response.json();
    console.log('File uploaded:', result);
  } catch (error) {
    console.error('Upload failed:', error);
  }
}

// Usage with file input
document.querySelector('#fileInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) uploadFile(file);
});
```

### 9️⃣ Authentication with Token

**Use for:** Protected API endpoints

```javascript
async function fetchProtectedData(token) {
  try {
    const response = await fetch('https://api.example.com/protected', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.status === 401) {
      throw new Error('Unauthorized - please login');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Auth error:', error);
  }
}
```

### 🔟 Retry Logic

**Use for:** Handling network failures gracefully

```javascript
async function fetchWithRetry(url, options = {}, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error; // Last attempt failed
      
      console.log(`Retry ${i + 1}/${retries}...`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Wait before retry
    }
  }
}

// Usage
const data = await fetchWithRetry('https://api.example.com/data', {}, 3);
```

### 1️⃣1️⃣ Timeout Handling

**Use for:** Preventing requests from hanging forever

```javascript
async function fetchWithTimeout(url, timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Request timed out!');
    }
    throw error;
  }
}

// Usage
try {
  const data = await fetchWithTimeout('https://slow-api.com/data', 3000);
} catch (error) {
  console.error('Failed:', error);
}
```

### 1️⃣2️⃣ Loading State Management

**Use for:** Showing spinners/loaders

```javascript
async function loadUserData(userId) {
  const loader = document.querySelector('#loader');
  const content = document.querySelector('#content');
  
  try {
    loader.style.display = 'block';
    content.style.display = 'none';
    
    const response = await fetch(`https://api.example.com/users/${userId}`);
    const user = await response.json();
    
    displayUser(user);
  } catch (error) {
    showError(error.message);
  } finally {
    loader.style.display = 'none';
    content.style.display = 'block';
  }
}
```

### 1️⃣3️⃣ Form Submission

**Use for:** Contact forms, login forms

```javascript
async function handleFormSubmit(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData);
  
  try {
    const response = await fetch('https://api.example.com/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    if (response.ok) {
      alert('Form submitted successfully!');
      event.target.reset();
    }
  } catch (error) {
    alert('Submission failed: ' + error.message);
  }
}

// Usage
document.querySelector('#myForm').addEventListener('submit', handleFormSubmit);
```

### 1️⃣4️⃣ Cache with LocalStorage

**Use for:** Reducing API calls, offline support

```javascript
async function getCachedData(url, cacheTime = 60000) { // 1 minute default
  const cacheKey = `cache_${url}`;
  const cached = localStorage.getItem(cacheKey);
  
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    
    if (Date.now() - timestamp < cacheTime) {
      console.log('Using cached data');
      return data;
    }
  }
  
  // Fetch fresh data
  const response = await fetch(url);
  const data = await response.json();
  
  // Cache it
  localStorage.setItem(cacheKey, JSON.stringify({
    data,
    timestamp: Date.now()
  }));
  
  return data;
}
```

### 1️⃣5️⃣ Infinite Scroll

**Use for:** Social media feeds, image galleries

```javascript
let page = 1;
let loading = false;

async function loadMoreItems() {
  if (loading) return;
  
  loading = true;
  
  try {
    const response = await fetch(`https://api.example.com/items?page=${page}`);
    const items = await response.json();
    
    appendItems(items);
    page++;
  } catch (error) {
    console.error('Error loading items:', error);
  } finally {
    loading = false;
  }
}

// Detect when user scrolls near bottom
window.addEventListener('scroll', () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
    loadMoreItems();
  }
});
```

### 1️⃣6️⃣ Real-time Validation

**Use for:** Email validation, username availability

```javascript
async function checkUsernameAvailable(username) {
  try {
    const response = await fetch(
      `https://api.example.com/check-username?username=${username}`
    );
    const { available } = await response.json();
    
    const feedback = document.querySelector('#usernameFeedback');
    feedback.textContent = available 
      ? '✓ Username available' 
      : '✗ Username taken';
    feedback.className = available ? 'success' : 'error';
  } catch (error) {
    console.error('Validation error:', error);
  }
}

// Debounced usage
let debounceTimer;
document.querySelector('#username').addEventListener('input', (e) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    checkUsernameAvailable(e.target.value);
  }, 500);
});
```

### 1️⃣7️⃣ Dependent Requests

**Use for:** Fetching related data (user → user's posts)

```javascript
async function getUserWithPosts(userId) {
  try {
    // First, get the user
    const userResponse = await fetch(`https://api.example.com/users/${userId}`);
    const user = await userResponse.json();
    
    // Then, get their posts
    const postsResponse = await fetch(`https://api.example.com/users/${userId}/posts`);
    const posts = await postsResponse.json();
    
    return { ...user, posts };
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### 1️⃣8️⃣ GraphQL Query

**Use for:** Flexible data fetching with GraphQL

```javascript
async function fetchGraphQL(query, variables = {}) {
  try {
    const response = await fetch('https://api.example.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables })
    });
    
    const { data, errors } = await response.json();
    
    if (errors) {
      throw new Error(errors[0].message);
    }
    
    return data;
  } catch (error) {
    console.error('GraphQL error:', error);
  }
}

// Usage
const query = `
  query GetUser($id: ID!) {
    user(id: $id) {
      name
      email
      posts {
        title
      }
    }
  }
`;

const data = await fetchGraphQL(query, { id: '123' });
```

### 1️⃣9️⃣ Download Progress

**Use for:** Large file downloads

```javascript
async function downloadWithProgress(url) {
  const response = await fetch(url);
  const reader = response.body.getReader();
  const contentLength = +response.headers.get('Content-Length');
  
  let receivedLength = 0;
  const chunks = [];
  
  while (true) {
    const { done, value } = await reader.read();
    
    if (done) break;
    
    chunks.push(value);
    receivedLength += value.length;
    
    const progress = (receivedLength / contentLength) * 100;
    console.log(`Downloaded: ${progress.toFixed(2)}%`);
    updateProgressBar(progress);
  }
  
  const blob = new Blob(chunks);
  return blob;
}
```

### 2️⃣0️⃣ Batch Requests

**Use for:** Processing multiple items efficiently

```javascript
async function processBatch(items, batchSize = 5) {
  const results = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    
    const batchResults = await Promise.all(
      batch.map(item => fetch(`https://api.example.com/process/${item}`))
    );
    
    const data = await Promise.all(
      batchResults.map(response => response.json())
    );
    
    results.push(...data);
    
    console.log(`Processed batch ${i / batchSize + 1}`);
  }
  
  return results;
}

// Usage
const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const processed = await processBatch(items, 3); // Process 3 at a time
```

---

## ⚡ Error Handling Patterns

### Basic Try/Catch

```javascript
async function fetchData() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}
```

### Detailed Error Handling

```javascript
async function fetchDataDetailed() {
  try {
    const response = await fetch(url);
    
    // Check HTTP status
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    if (error.name === 'TypeError') {
      console.error('Network error:', error);
    } else if (error.name === 'SyntaxError') {
      console.error('Invalid JSON:', error);
    } else {
      console.error('Unknown error:', error);
    }
    throw error; // Re-throw if needed
  }
}
```

### Global Error Handler

```javascript
async function safeRequest(url, options) {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Request failed');
    }
    
    return await response.json();
  } catch (error) {
    // Log to error tracking service
    logError(error);
    
    // Show user-friendly message
    showNotification('Something went wrong. Please try again.');
    
    return null;
  }
}
```

---

## 🎯 Response Types

```javascript
// JSON (most common)
const data = await response.json();

// Text
const text = await response.text();

// Blob (for files, images)
const blob = await response.blob();

// ArrayBuffer (for binary data)
const buffer = await response.arrayBuffer();

// FormData
const formData = await response.formData();
```

---

## 📊 HTTP Status Codes Quick Reference

```javascript
// Success
200 - OK
201 - Created
204 - No Content

// Client Errors
400 - Bad Request
401 - Unauthorized
403 - Forbidden
404 - Not Found
422 - Unprocessable Entity

// Server Errors
500 - Internal Server Error
502 - Bad Gateway
503 - Service Unavailable
```

---

## 🔧 Fetch Options Reference

```javascript
await fetch(url, {
  method: 'POST',           // GET, POST, PUT, DELETE, PATCH
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token',
    'Custom-Header': 'value'
  },
  body: JSON.stringify(data), // Data to send
  mode: 'cors',              // cors, no-cors, same-origin
  credentials: 'include',    // include, same-origin, omit
  cache: 'no-cache',         // default, no-cache, reload, force-cache
  redirect: 'follow',        // follow, manual, error
  signal: abortController.signal // For cancellation
});
```

---

## 💡 Best Practices

### ✅ DO

```javascript
// ✅ Use async/await for readability
async function getUser() {
  const response = await fetch('/user');
  return await response.json();
}

// ✅ Check response.ok
if (!response.ok) {
  throw new Error('Request failed');
}

// ✅ Use try/catch
try {
  const data = await fetch(url);
} catch (error) {
  handleError(error);
}

// ✅ Use Promise.all for parallel requests
const [users, posts] = await Promise.all([
  fetch('/users').then(r => r.json()),
  fetch('/posts').then(r => r.json())
]);

// ✅ Set proper headers
headers: {
  'Content-Type': 'application/json'
}
```

### ❌ DON'T

```javascript
// ❌ Don't forget to await
const data = fetch(url); // Returns Promise, not data!

// ❌ Don't ignore errors
async function bad() {
  const response = await fetch(url); // What if this fails?
  const data = await response.json(); // Or this?
}

// ❌ Don't use sequential when parallel is better
const users = await fetch('/users');
const posts = await fetch('/posts'); // Slow! Use Promise.all

// ❌ Don't forget to check response.ok
const data = await response.json(); // May fail with 404!

// ❌ Don't stringify when sending FormData
body: JSON.stringify(formData) // Wrong! Send formData directly
```

---

## 🧠 Mental Model Checklist

When writing fetch code, ask yourself:

1. **What am I requesting?** → URL + Method (GET/POST/etc)
2. **What am I sending?** → Body + Headers
3. **What am I expecting back?** → .json()/.text()/.blob()
4. **What could go wrong?** → try/catch + response.ok check
5. **Do I need to wait?** → await + async function
6. **Multiple requests?** → Sequential or Promise.all?

---

## 🎯 Common Patterns Cheat Sheet

| **Pattern**                | **Code**                                                 |
|----------------------------|----------------------------------------------------------|
| Simple GET                 | `await fetch(url).then(r => r.json())`                   |
| POST JSON                  | `fetch(url, {method:'POST', body:JSON.stringify(data)})` |
| With auth                  | `headers: {'Authorization': 'Bearer '+token}`            |
| Multiple parallel          | `await Promise.all([fetch1, fetch2])`                    |
| With timeout               | Use `AbortController` + `setTimeout`                     |
| Check status               | `if (!response.ok) throw Error()`                        |
| Handle errors              | `try/catch` block                                        |
| Loading state              | `try/finally` to hide loader                             |

---

## 🔄 Comparison: Old vs New

### XMLHttpRequest (Old) 😰

```javascript
const xhr = new XMLHttpRequest();
xhr.open('GET', 'https://api.example.com/data');

xhr.onload = function() {
  if (xhr.status === 200) {
    const data = JSON.parse(xhr.responseText);
    console.log(data);
  } else {
    console.error('Error:', xhr.status);
  }
};

xhr.onerror = function() {
  console.error('Network error');
};

xhr.send();
```

### Fetch + Promises (Better) 😊

```javascript
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

### Fetch + Async/Await (Best!) 🎉

```javascript
async function getData() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

---

## 🏆 Real-World Complete Example

```javascript
// Complete API wrapper with all best practices
class API {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.token = null;
  }
  
  setToken(token) {
    this.token = token;
  }
  
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      }
    };
    
    if (this.token) {
      config.headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Request failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
  
  async get(endpoint) {
    return this.request(endpoint);
  }
  
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
  
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }
  
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE'
    });
  }
}

// Usage
const api = new API('https://api.example.com');
api.setToken('your-token-here');

// Clean, simple calls
const users = await api.get('/users');
const newUser = await api.post('/users', { name: 'John' });
const updated = await api.put('/users/123', { name: 'Jane' });
await api.delete('/users/123');
```

---

## 🎓 Practice Challenges

Try building these to master fetch + async/await:

1. **Todo App** - GET/POST/PUT/DELETE todos
2. **Weather App** - Fetch and display weather data
3. **User Directory** - Search, filter, and display users
4. **Image Gallery** - Infinite scroll with pagination
5. **Chat App** - Send/receive messages with loading states

---

## 💬 Key Takeaways

1. **Async/await makes async code look sync** - easier to read and debug
2. **Always use try/catch** - handle errors gracefully
3. **Check response.ok** - don't assume requests succeed
4. **Use Promise.all for parallel requests** - much faster
5. **Await goes before promises** - marks the waiting point
6. **Async functions return promises** - can be chained or awaited

---

## 🔥 Pro Tips

- Use **async/await in event handlers**: `button.addEventListener('click', async () => {})`
- **Cache frequently accessed data** in memory or localStorage
- **Debounce search/autocomplete** to reduce API calls
- **Show loading states** during requests (spinners, disabled buttons)
- **Use AbortController** to cancel requests when needed
- **Batch requests** when possible to reduce server load

---

**Remember:** Fetch + Async/Await is the modern standard. It's cleaner, more readable, and easier to maintain than old callback-based approaches. Once you get the mental model, it becomes second nature! 🚀

---
