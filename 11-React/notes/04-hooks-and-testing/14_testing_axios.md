# 🌐 Testing with Axios

## Strategies for Mocking Axios

```text
1. vi.mock('axios')              → full mock of the axios module
2. vi.spyOn(axios, 'get')        → spy on a specific method
3. axios-mock-adapter            → specialized library for axios
4. msw (Mock Service Worker)     → intercepts at the network level (more realistic)
```

---

## 1. `vi.mock('axios')` — Most Common and Simple

```ts
// src/services/gifsService.ts
import axios from 'axios';

export interface Gif { id: string; title: string; url: string; }

export async function getGifs(query: string): Promise<Gif[]> {
  const { data } = await axios.get('https://api.giphy.com/v1/gifs/search', {
    params: {
      api_key: import.meta.env.VITE_GIPHY_API_KEY,
      q: query,
      limit: 10,
    },
  });

  return data.data.map((item: any) => ({
    id:    item.id,
    title: item.title,
    url:   item.images.downsized_medium.url,
  }));
}
```

```ts
// src/services/gifsService.test.ts
import axios from 'axios';
import { getGifs } from './gifsService';

// Full mock of axios — all its functions become vi.fn()
vi.mock('axios');

// Helper: build the Giphy response structure
const buildGiphyResponse = (items: { id: string; title: string; url: string }[]) => ({
  data: {
    data: items.map(item => ({
      id: item.id,
      title: item.title,
      images: { downsized_medium: { url: item.url } },
    })),
  },
});

describe('getGifs', () => {

  beforeEach(() => { vi.clearAllMocks(); });

  // ─── Successful case ───────────────────────────────────────────

  test('returns correctly mapped array of GIFs', async () => {
    // Arrange
    const rawItems = [
      { id: 'abc', title: 'Cat GIF', url: 'https://giphy.com/cat.gif' },
      { id: 'def', title: 'Dog GIF', url: 'https://giphy.com/dog.gif' },
    ];
    vi.mocked(axios.get).mockResolvedValue(buildGiphyResponse(rawItems));

    // Act
    const result = await getGifs('cats');

    // Assert
    expect(result).toEqual([
      { id: 'abc', title: 'Cat GIF', url: 'https://giphy.com/cat.gif' },
      { id: 'def', title: 'Dog GIF', url: 'https://giphy.com/dog.gif' },
    ]);
  });

  test('returns empty array if the API returns no results', async () => {
    vi.mocked(axios.get).mockResolvedValue(buildGiphyResponse([]));

    const result = await getGifs('xyzabc');
    expect(result).toEqual([]);
  });

  // ─── Parameters ────────────────────────────────────────────────

  test('calls the correct API URL', async () => {
    vi.mocked(axios.get).mockResolvedValue(buildGiphyResponse([]));

    await getGifs('react');

    expect(axios.get).toHaveBeenCalledWith(
      'https://api.giphy.com/v1/gifs/search',
      expect.any(Object)
    );
  });

  test('sends the query as a parameter', async () => {
    vi.mocked(axios.get).mockResolvedValue(buildGiphyResponse([]));

    await getGifs('one piece');

    expect(axios.get).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        params: expect.objectContaining({ q: 'one piece' }),
      })
    );
  });

  test('sends the result limit', async () => {
    vi.mocked(axios.get).mockResolvedValue(buildGiphyResponse([]));

    await getGifs('cats');

    expect(axios.get).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        params: expect.objectContaining({ limit: 10 }),
      })
    );
  });

  // ─── Errors ────────────────────────────────────────────────────

  test('throws error if the request fails', async () => {
    vi.mocked(axios.get).mockRejectedValue(new Error('Network Error'));

    await expect(getGifs('cats')).rejects.toThrow('Network Error');
  });

  test('throws 401 error if the API key is invalid', async () => {
    const error = Object.assign(new Error('Unauthorized'), {
      response: { status: 401, data: { message: 'Invalid API key' } },
      isAxiosError: true,
    });
    vi.mocked(axios.get).mockRejectedValue(error);

    await expect(getGifs('cats')).rejects.toThrow('Unauthorized');
  });
});
```

---

## 2. Mocked Axios Instance

When using a custom instance (`axios.create`):

```ts
// src/api/axiosInstance.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10_000,
});

export default api;
```

```ts
// src/services/usersService.ts
import api from '../api/axiosInstance';

export async function getUsers() {
  const { data } = await api.get('/users');
  return data;
}
```

```ts
// src/services/usersService.test.ts
import { getUsers } from './usersService';
import api from '../api/axiosInstance';

// Mock the instance module
vi.mock('../api/axiosInstance', () => ({
  default: {
    get:    vi.fn(),
    post:   vi.fn(),
    put:    vi.fn(),
    delete: vi.fn(),
  },
}));

test('getUsers returns users', async () => {
  const mockUsers = [{ id: 1, name: 'Ana' }, { id: 2, name: 'Carlos' }];

  vi.mocked(api.get).mockResolvedValue({ data: mockUsers });

  const result = await getUsers();

  expect(result).toEqual(mockUsers);
  expect(api.get).toHaveBeenCalledWith('/users');
});
```

---

## 3. `vi.spyOn` — Spy Without Full Mock

```ts
import axios from 'axios';
import { getGifs } from './gifsService';

test('uses axios.get for the request', async () => {
  const spy = vi.spyOn(axios, 'get').mockResolvedValue({
    data: { data: [] },
  });

  await getGifs('cats');

  expect(spy).toHaveBeenCalled();
  spy.mockRestore(); // restore the original method
});
```

---

## 4. Mocking Axios Interceptors

```ts
// src/api/axiosInstance.test.ts
import axios from 'axios';
import api from './axiosInstance';

vi.mock('axios', async (importOriginal) => {
  const actual = await importOriginal<typeof import('axios')>();
  return {
    ...actual,
    create: vi.fn(() => ({
      get:    vi.fn(),
      post:   vi.fn(),
      interceptors: {
        request:  { use: vi.fn() },
        response: { use: vi.fn() },
      },
    })),
  };
});

test('the axios instance uses the baseURL from env variables', () => {
  expect(axios.create).toHaveBeenCalledWith(
    expect.objectContaining({
      baseURL: expect.any(String),
    })
  );
});
```

---

## 5. Axios Errors with `axios.isAxiosError`

```ts
// src/utils/handleAxiosError.ts
import axios from 'axios';

export interface ApiError {
  message: string;
  status: number;
}

export function handleAxiosError(err: unknown): ApiError {
  if (axios.isAxiosError(err)) {
    return {
      message: err.response?.data?.message ?? err.message,
      status:  err.response?.status ?? 0,
    };
  }
  if (err instanceof Error) {
    return { message: err.message, status: 0 };
  }
  return { message: 'Unknown error', status: 0 };
}
```

```ts
// src/utils/handleAxiosError.test.ts
import axios from 'axios';
import { handleAxiosError } from './handleAxiosError';

// Helper to create a fake AxiosError
function createAxiosError(status: number, message: string) {
  const error = new axios.AxiosError(
    message,
    String(status),
    undefined,
    undefined,
    { status, data: { message }, headers: {}, config: {} as any, statusText: '' }
  );
  return error;
}

describe('handleAxiosError', () => {

  test('extracts message and status from an AxiosError', () => {
    const axiosErr = createAxiosError(404, 'Resource not found');

    const result = handleAxiosError(axiosErr);

    expect(result.message).toBe('Resource not found');
    expect(result.status).toBe(404);
  });

  test('handles a standard Error', () => {
    const result = handleAxiosError(new Error('Network error'));
    expect(result.message).toBe('Network error');
    expect(result.status).toBe(0);
  });

  test('handles unknown errors (non-Error)', () => {
    const result = handleAxiosError('something unexpected');
    expect(result.message).toBe('Unknown error');
    expect(result.status).toBe(0);
  });
});
```

---

## 6. `axios-mock-adapter` — Alternative for Complex Mocks

```bash
npm install -D axios-mock-adapter
```

```ts
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { getGifs } from './gifsService';

const mock = new MockAdapter(axios);

describe('getGifs with MockAdapter', () => {

  afterEach(() => { mock.reset(); });

  test('successful GET returns gifs', async () => {
    mock.onGet('https://api.giphy.com/v1/gifs/search').reply(200, {
      data: [
        { id: '1', title: 'Cat', images: { downsized_medium: { url: 'url1' } } },
      ],
    });

    const result = await getGifs('cats');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Cat');
  });

  test('handles 401 Unauthorized', async () => {
    mock.onGet('https://api.giphy.com/v1/gifs/search').reply(401, {
      message: 'Invalid API key',
    });

    await expect(getGifs('cats')).rejects.toThrow();
  });

  test('handles network error', async () => {
    mock.onGet('https://api.giphy.com/v1/gifs/search').networkError();

    await expect(getGifs('cats')).rejects.toThrow();
  });
});
```
