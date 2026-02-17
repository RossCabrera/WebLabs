# ✏️ APIs Study Notes

## 📚 Table of Contents

- [🌐 What is an API?](#what-is-an-api)
- [🏗️ API Types & Architectural Styles](#api-types)
- [⚙️ REST API Fundamentals](#rest-fundamentals)
- [🔗 Endpoints, Parameters & URL Structure](#endpoints-and-params)
- [📖 API Documentation & Tooling](#docs-and-tooling)
- [📦 JSON](#json)
- [🚀 Making API Requests from Node/Express](#making-requests)
- [🔐 API Authentication & Authorization](#auth)

---

## <a name="what-is-an-api"></a>🌐 What is an API?

> **💡 Key Concept:** An API is a **bridge between software systems** — it defines how they communicate without either side knowing how the other is built internally.

### 🎯 Why APIs Exist

Modern software systems are everywhere — websites, apps, servers, devices. These systems need a standard way to exchange data. APIs let software collaborate without sharing internal logic or databases.

### 🧠 Mental Model

| API Concept | Real World Analogy |
| :--- | :--- |
| API | Restaurant menu |
| Endpoint | A dish on the menu |
| Request | Placing an order |
| Response | The food you receive |

### 🌍 Real-World Examples

| API | Input | Output | Method |
| :--- | :--- | :--- | :--- |
| OpenWeather | Latitude + Longitude | Temperature, description, icon | `GET` |
| Mailchimp | User email | Success / error confirmation | `POST` |
| ISS Tracker | Satellite ID | Latitude + Longitude | `GET` |
| IoT / Plant Watering | `/water` request | Amount of water, soil moisture | `GET` |

### 🧾 Quick Summary

All APIs share: an interface between systems, defined endpoints (URLs), request types, data format, and response format.

---

## <a name="api-types"></a>🏗️ API Types & Architectural Styles

> **💡 Key Concept:** APIs can be **private or public**, and can follow different architectural design styles.

### 🔒 Private vs 🌍 Public

| Feature | Private API | Public API |
| :--- | :--- | :--- |
| Access | Internal only | Open to external developers |
| Documentation | Not public | Fully documented |
| Example | Your Express server serving EJS pages | Bored API |

### 🏛️ Architectural Styles

REST, SOAP, GraphQL, and gRPC are all different ways to design APIs — they are **design philosophies, not programming languages**. REST dominates web development because it uses HTTP.

### 🧾 Quick Summary

- Use **Private APIs** between your own frontend/backend
- Use **Public APIs** to integrate external services
- **REST** is the most important style to learn for web development

---

## <a name="rest-fundamentals"></a>⚙️ REST API Fundamentals

> **💡 Key Concept:** REST APIs use **HTTP methods** to perform actions on resources identified by URLs.

### 📊 HTTP Methods

| Method | Purpose | Replaces Entire Resource? |
| :--- | :--- | :--- |
| `GET` | Retrieve data | ❌ |
| `POST` | Create new data | ❌ |
| `PUT` | Replace entire resource | ✅ |
| `PATCH` | Update part of a resource | ❌ |
| `DELETE` | Remove a resource | ❌ |

### ✨ Best Practices

```plaintext
// ✅ Correct — method matches intent
GET    /users/5        → retrieve user 5
POST   /users          → create a new user
PATCH  /users/5        → update part of user 5
DELETE /users/5        → remove user 5

// ❌ Avoid — using GET to delete or POST to retrieve
GET /deleteUser/5
POST /getUsers
```

### 📋 REST Rules

- Uses HTTP and URLs for resources
- **Stateless** — each request is fully independent
- HTTP methods define the *action*; the URL defines the *resource*

### 🧾 Quick Summary

Knowing HTTP already puts you halfway to understanding REST. The method tells the server *what to do*, the URL tells it *what to do it to*.

---

## <a name="endpoints-and-params"></a>🔗 Endpoints, Parameters & URL Structure

> **💡 Key Concept:** Endpoints define *what* you're requesting. Parameters let you **filter, identify, or customize** that request.

### 🏠 Base URL vs Endpoint

The **base URL** is the API's main address. An **endpoint** is a specific route on top of it.

```plaintext
Base URL:  https://bored-api.appbrewery.com
Endpoint:  /random
Full URL:  https://bored-api.appbrewery.com/random
```

### 🔍 Query Parameters

Used to filter, search, or sort results. Start with `?`, multiple params separated by `&`. Order doesn't matter.

```plaintext
/filter?type=social&participants=2
        ^key  ^val  ^separator
```

### 📌 Path Parameters

Dynamic values embedded in the URL path — used to identify a specific resource. Usually required.

```plaintext
/activity/5914292
          ^unique resource ID (path parameter)
```

### 📊 Query vs Path Parameters

| Feature | Query Parameters | Path Parameters |
| :--- | :--- | :--- |
| Purpose | Filter / search / sort | Identify a specific resource |
| Optional? | Usually yes | Usually required |
| Location | After `?` in the URL | Part of the URL path |
| Example | `?type=social` | `/activity/5914292` |

### 🧾 Quick Summary

```PL
GET /random                               → random result (no params)
GET /filter?type=social&participants=2    → filtered by query params
GET /activity/5914292                     → specific resource by path param
```

---

## <a name="docs-and-tooling"></a>📖 API Documentation & Tooling

> **💡 Key Concept:** API docs work like a menu — they tell you what's available and how to order it. **Always read them first.**

### 📋 What to Look For in Docs

- Available endpoints and their HTTP methods
- Required vs optional parameters
- Response format and example responses
- Rate limits (e.g., 100 requests per 15 minutes)

### ⚠️ Rate Limiting

Public APIs often limit requests to prevent abuse. Rate limiting is **not** the same as authentication — it's just abuse prevention.

```plaintext
// If you exceed the limit:
→ 429 Too Many Requests
→ Wait before retrying
→ Example: 100 requests per 15 minutes per IP
```

### 🧰 Postman

Postman lets you test API requests without a frontend or backend. Ideal for:

- Exploring a new API before building with it
- Debugging request/response issues
- Understanding what data an endpoint actually returns

### 🧾 Quick Summary

Good API docs answer: *What can I request? How do I request it? What will I get back?*

**📖 [Postman — API Testing Tool](https://www.postman.com/)**

---

## <a name="json"></a>📦 JSON

> **💡 Key Concept:** JSON is the **universal data format for APIs** — compact, human-readable, and easy to transfer between systems.

### 🔄 JSON vs JavaScript Objects

| Feature | JavaScript Object | JSON |
| :--- | :--- | :--- |
| Keys | Can be unquoted | Must be strings in `"double quotes"` |
| Usage | Directly usable by JS | Serialized string for data transfer |
| Analogy | Assembled wardrobe | IKEA flat-pack |

```js
// JavaScript Object
const user = { name: "Ross", age: 25 }

// JSON (all keys are quoted strings)
'{ "name": "Ross", "age": 25 }'
```

### ↔️ Serialization & Deserialization

| Direction | What it does | Method |
| :--- | :--- | :--- |
| Object → JSON | Serialization | `JSON.stringify(object)` |
| JSON → Object | Deserialization | `JSON.parse(jsonString)` |

### 🌲 JSON Supports Nesting

```json
{
  "name": "Ross",
  "hobbies": ["coding", "hiking"],
  "address": {
    "city": "New York",
    "zip": "10001"
  }
}
```

### 🧾 Quick Summary

JSON removes "extra air" from JS objects and keeps only the essential structure. Use `JSON.stringify` to send it, `JSON.parse` to use it.

**📖 [JSON Viewer Tool](https://jsonviewer.stack.hu)**

---

## <a name="making-requests"></a>🚀 Making API Requests from Node/Express

> **💡 Key Concept:** Your **server** — not the browser — fetches data from external APIs, then passes it to your frontend.

```plaintext
Your Server  →  External API  →  JSON Response  →  Your Frontend
```

### 🆚 Native HTTPS vs Axios

| Feature | HTTPS Module | Axios |
| :--- | :--- | :--- |
| Built-in to Node | ✅ | ❌ (install via npm) |
| Auto JSON parsing | ❌ | ✅ |
| Clean syntax | ❌ | ✅ |
| Error handling | Basic | Better |
| Lines of code | Many | Very few |

### 🔧 Native HTTPS (for reference)

```js
const https = require("https");

const options = { hostname: "api.example.com", path: "/data", method: "GET" };

const req = https.request(options, (res) => {
  let data = "";
  res.on("data", (chunk) => { data += chunk; }); // collect chunks
  res.on("end", () => { console.log(JSON.parse(data)); });
});

req.on("error", console.error);
req.end(); // ⚠️ Required — without this, the request stays open
```

### ✅ Axios (Recommended)

```bash
npm install axios
```

```js
import axios from "axios";

// JSON is parsed automatically
const response = await axios.get("https://api.example.com/data");
console.log(response.data);
```

### ⚙️ Axios Inside Express

```js
app.get("/", async (req, res) => {
  try {
    const response = await axios.get("https://api.example.com/activity");
    res.render("index.ejs", { activity: response.data });
  } catch (error) {
    res.send("Error fetching data");
  }
});
```

### 📋 Axios HTTP Methods Reference

```js
axios.get(url, config)            // no body
axios.post(url, data, config)     // data = request body
axios.put(url, data, config)      // replaces entire resource
axios.patch(url, data, config)    // updates part of resource
axios.delete(url, config)         // no body
```

### 🔄 .then() vs async/await

Both work — but **async/await is recommended** for readability and easier debugging.

```js
// .then() style
axios.get(url)
  .then(res => console.log(res.data))
  .catch(err => console.log(err))
  .finally(() => console.log("Done"));

// ✅ async/await style (preferred)
async function getData() {
  try {
    const res = await axios.get(url);
    console.log(res.data);
  } catch (err) {
    console.log(err);
  }
}
```

### 🧾 Quick Summary

Use Axios over the native module. Use async/await over `.then()`. Always wrap in `try/catch`.

**📖 [Axios Documentation](https://axios-http.com/es/docs/intro)**

---

## <a name="auth"></a>🔐 API Authentication & Authorization

> **💡 Key Concept:** Authentication asks *"Who are you?"* — Authorization asks *"What are you allowed to access?"*

### 🏦 The Vault Analogy

| Concept | Analogy |
| :--- | :--- |
| API data | Money in a vault |
| API endpoint | Bank counter |
| Authentication | Showing your ID |
| Authorization | Permission to withdraw |

### 🛡️ The 4 Levels of API Security

#### 1️⃣ No Authentication

Anyone can access the API. Abuse is limited by **rate limiting** per IP. Good for fully public data.

```plaintext
GET /random   → no credentials needed
```

#### 2️⃣ Basic Authentication

Sends `username:password` encoded in **Base64** in the request header.

> ⚠️ Base64 is *not* encryption — it can be decoded easily. Security depends entirely on HTTPS.

```js
axios.get(url, {
  auth: { username: "yourUsername", password: "yourPassword" }
});
```

#### 3️⃣ API Key Authorization

Provider gives you a unique key. Enables usage tracking, billing, and per-key rate limits. If stolen, the key can be revoked without affecting the account.

```js
axios.get(url, {
  params: { score: 7, apiKey: "YOUR_KEY" }
});
```

#### 4️⃣ Bearer Token — Most Secure 🔥

User logs in once → server generates a token → token is used for all future requests. The password is **never reused**. Tokens can expire, be revoked, and have limited scope. **OAuth 2.0** is the industry standard for this pattern.

```js
axios.get(url, {
  headers: { Authorization: `Bearer ${yourToken}` }
});
```

### 📊 Security Comparison

| Method | Security Level | Password Sent? | Example Endpoint |
| :--- | :--- | :--- | :--- |
| None | ❌ | No | `/random` |
| Basic Auth | ⚠️ | Yes (Base64) | `/all` |
| API Key | ✅ | No | `/filter?apiKey=KEY` |
| Bearer Token | 🔥🔥🔥 | No | `/secrets/:id` |

### ⚙️ Axios Auth Cheatsheet

```js
// Basic Auth
axios.get(url, { auth: { username, password } });

// API Key as query param
axios.get(url, { params: { apiKey: yourKey } });

// Bearer Token in header
axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
```

### 🧾 Quick Summary

- Rate limiting ≠ authentication
- Base64 ≠ encryption
- API keys are for tracking & billing per user
- Bearer tokens are the safest option for user-based access
- OAuth 2.0 is the industry standard

---

## 🔑 Summary

APIs connect software systems through a standard interface of endpoints, requests, and responses. REST APIs dominate the web by combining HTTP methods with meaningful URLs. JSON is the universal data format — compact, nestable, and easy to parse. Axios makes server-side requests clean and readable. Authentication ranges from open access to secure Bearer tokens, and knowing the difference is essential for building real applications.

**📖 [Axios Docs](https://axios-http.com/es/docs/intro) · [JSON Viewer](https://jsonviewer.stack.hu) · [Postman](https://www.postman.com/)**

---
