# 🌐 HTTP Requests in React + TypeScript

## Available Options

```text
fetch API    → native browser API, no dependencies
axios        → popular library, more features, better ergonomics
React Query  → complete server state management (cache, refetch, etc.)
```

---

## 1. Native Fetch

### Basic GET

```ts
// src/services/postsService.ts
export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export async function getPosts(): Promise<Post[]> {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts');

  if (!res.ok) {
    throw new Error(`Error ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

export async function getPostById(id: number): Promise<Post> {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  if (!res.ok) throw new Error(`Post ${id} not found`);
  return res.json();
}
```

### POST with body

```ts
export async function createPost(data: Omit<Post, 'id'>): Promise<Post> {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('Error creating post');
  return res.json();
}
```

---

## 2. Axios

```bash
npm install axios
```

### Centralized instance (recommended pattern)

```ts
// src/api/axiosInstance.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: automatically adds token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor: global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

```ts
// src/services/postsService.ts
import api from '../api/axiosInstance';
import type { Post } from '../types';

export const postsService = {
  getAll: ()                      => api.get<Post[]>('/posts'),
  getById: (id: number)           => api.get<Post>(`/posts/${id}`),
  create: (data: Omit<Post,'id'>) => api.post<Post>('/posts', data),
  update: (id: number, data: Partial<Post>) => api.put<Post>(`/posts/${id}`, data),
  delete: (id: number)            => api.delete(`/posts/${id}`),
};
```

---

## 3. Loading and Error States in Components

### Pattern with useState + useEffect

```tsx
// src/components/PostList.tsx
import { useState, useEffect } from 'react';
import { getPosts, type Post } from '../services/postsService';

type Status = 'idle' | 'loading' | 'success' | 'error';

function PostList() {
  const [posts, setPosts]   = useState<Post[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError]   = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setStatus('loading');
      try {
        const data = await getPosts();
        setPosts(data);
        setStatus('success');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setStatus('error');
      }
    };

    fetchPosts();
  }, []);

  if (status === 'loading') return <p>Loading posts...</p>;
  if (status === 'error')   return <p>Error: {error}</p>;
  if (status === 'idle')    return null;

  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>
          <strong>{post.title}</strong>
          <p>{post.body}</p>
        </li>
      ))}
    </ul>
  );
}

export default PostList;
```

---

## 4. Cancel Requests with AbortController

Avoids "state update on unmounted component" errors:

```tsx
useEffect(() => {
  const controller = new AbortController();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/data', {
        signal: controller.signal,   // ← pass the signal to fetch
      });
      const data = await res.json();
      setData(data);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return; // ignore
      setError('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  fetchData();

  return () => controller.abort(); // called when component unmounts
}, []);
```

---

## 5. Centralized Error Handling with Types

```ts
// src/types/api.ts
export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// src/utils/handleError.ts
import type { ApiError } from '../types/api';
import axios from 'axios';

export function parseError(err: unknown): ApiError {
  if (axios.isAxiosError(err)) {
    return {
      message: err.response?.data?.message ?? err.message,
      status: err.response?.status ?? 0,
      code: err.code,
    };
  }
  if (err instanceof Error) {
    return { message: err.message, status: 0 };
  }
  return { message: 'Unknown error', status: 0 };
}
```

---

## 6. React Query Pattern (TanStack Query)

```bash
npm install @tanstack/react-query
```

```tsx
// src/main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
```

```tsx
// src/components/PostList.tsx
import { useQuery } from '@tanstack/react-query';
import { getPosts } from '../services/postsService';

function PostList() {
  const { data: posts, isLoading, isError, error } = useQuery({
    queryKey: ['posts'],          // unique cache key
    queryFn: getPosts,
    staleTime: 5 * 60 * 1000,    // data is fresh for 5 min
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError)   return <p>Error: {(error as Error).message}</p>;

  return (
    <ul>
      {posts?.map(post => <li key={post.id}>{post.title}</li>)}
    </ul>
  );
}
```

```tsx
// Mutation (POST, PUT, DELETE)
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPost } from '../services/postsService';

function CreatePostForm() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] }); // refresh the list
    },
  });

  const handleSubmit = () => {
    mutation.mutate({ title: 'New post', body: '...', userId: 1 });
  };

  return (
    <button onClick={handleSubmit} disabled={mutation.isPending}>
      {mutation.isPending ? 'Saving...' : 'Create Post'}
    </button>
  );
}
```
