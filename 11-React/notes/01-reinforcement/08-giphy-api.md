# 08 · Giphy API with TypeScript

> You need a free API Key at: <https://developers.giphy.com>

---

## Types / Interfaces for the Giphy Response

```typescript
// ─── types/giphy.ts ──────────────────────────────────────────────

export interface GiphyImage {
  url: string;
  width: string;
  height: string;
}

export interface GiphyImages {
  original: GiphyImage;
  fixed_height: GiphyImage;
  fixed_width: GiphyImage;
  downsized: GiphyImage;
}

export interface GifData {
  id: string;
  title: string;
  url: string;
  images: GiphyImages;
  rating: string;
  slug: string;
}

export interface GiphySearchResponse {
  data: GifData[];
  pagination: {
    total_count: number;
    count: number;
    offset: number;
  };
  meta: {
    status: number;
    msg: string;
    response_id: string;
  };
}

export interface GiphySingleResponse {
  data: GifData;
  meta: {
    status: number;
    msg: string;
    response_id: string;
  };
}
```

---

## Giphy Service

```typescript
// ─── services/giphy.service.ts ───────────────────────────────────

import type {
  GifData,
  GiphySearchResponse,
  GiphySingleResponse,
} from "../types/giphy";

const API_KEY = "YOUR_API_KEY_HERE"; // ⚠️ In production, use environment variables
const BASE_URL = "https://api.giphy.com/v1/gifs";

// Helper function to build URLs with query params
function buildURL(endpoint: string, params: Record<string, string | number>): string {
  const url = new URL(`${BASE_URL}/${endpoint}`);
  url.searchParams.set("api_key", API_KEY);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }

  return url.toString();
}

// Search GIFs by term
export async function searchGifs(
  query: string,
  limit: number = 10,
  offset: number = 0,
  rating: "g" | "pg" | "pg-13" | "r" = "g"
): Promise<GifData[]> {
  const url = buildURL("search", {
    q: query,
    limit,
    offset,
    rating,
    lang: "en",
  });

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Giphy error: ${res.status}`);

  const json: GiphySearchResponse = await res.json();
  return json.data;
}

// Trending GIFs
export async function getTrending(limit: number = 10): Promise<GifData[]> {
  const url = buildURL("trending", { limit, rating: "g" });

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Giphy error: ${res.status}`);

  const json: GiphySearchResponse = await res.json();
  return json.data;
}

// Get a GIF by ID
export async function getGifById(id: string): Promise<GifData> {
  const url = buildURL(id, {});

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Giphy error: ${res.status}`);

  const json: GiphySingleResponse = await res.json();
  return json.data;
}

// Random GIF by tag
export async function getRandomGif(tag: string = ""): Promise<GifData> {
  const url = buildURL("random", { tag, rating: "g" });

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Giphy error: ${res.status}`);

  const json: GiphySingleResponse = await res.json();
  return json.data;
}
```

---

## Using the Service

```typescript
// ─── main.ts ─────────────────────────────────────────────────────

import { searchGifs, getTrending, getRandomGif } from "./services/giphy.service";

async function main() {
  // 1. Search GIFs
  const cats = await searchGifs("cat programming", 5);

  cats.forEach(({ id, title, images }) => {
    console.log(`[${id}] ${title}`);
    console.log(`URL: ${images.fixed_height.url}`);
    console.log(`Size: ${images.fixed_height.width}x${images.fixed_height.height}`);
    console.log("---");
  });

  // 2. Trending
  const trending = await getTrending(3);
  console.log("Trending:", trending.map((g) => g.title));

  // 3. Random
  const surprise = await getRandomGif("programming");
  console.log(`Random GIF: ${surprise.title}`);
  console.log(`URL: ${surprise.images.original.url}`);
}

main().catch(console.error);
```

---

## Search Component with Pagination

```typescript
// ─── components/GifSearch.ts ─────────────────────────────────────

import { searchGifs } from "../services/giphy.service";
import type { GifData } from "../types/giphy";

interface SearchState {
  query: string;
  results: GifData[];
  page: number;
  perPage: number;
  loading: boolean;
  error: string | null;
}

class GifSearch {
  private state: SearchState = {
    query: "",
    results: [],
    page: 0,
    perPage: 10,
    loading: false,
    error: null,
  };

  async search(query: string): Promise<void> {
    this.state.query = query;
    this.state.page = 0;
    await this.loadPage();
  }

  async nextPage(): Promise<void> {
    this.state.page++;
    await this.loadPage();
  }

  async previousPage(): Promise<void> {
    if (this.state.page > 0) {
      this.state.page--;
      await this.loadPage();
    }
  }

  private async loadPage(): Promise<void> {
    const { query, page, perPage } = this.state;
    this.state.loading = true;
    this.state.error = null;

    try {
      const offset = page * perPage;
      this.state.results = await searchGifs(query, perPage, offset);
    } catch (e) {
      this.state.error = e instanceof Error ? e.message : "Unknown error";
    } finally {
      this.state.loading = false;
    }
  }

  getResults(): GifData[] {
    return this.state.results;
  }

  getURLs(): string[] {
    return this.state.results.map((g) => g.images.fixed_height.url);
  }
}

// Usage
const gifSearch = new GifSearch();
await gifSearch.search("typescript");
console.log(gifSearch.getURLs());
```

---

## Environment Variables (Best Practices)

```typescript
// ─── config/env.ts ───────────────────────────────────────────────

// In Node.js / Deno / Bun use process.env or Deno.env
// In Vite use import.meta.env

function getEnv(key: string): string {
  // Vite
  const value = (import.meta.env as Record<string, string>)[key];
  // const value = process.env[key]; // Node.js

  if (!value) throw new Error(`Environment variable "${key}" is not defined`);
  return value;
}

export const GIPHY_API_KEY = getEnv("VITE_GIPHY_API_KEY");
// In .env: VITE_GIPHY_API_KEY=your_key_here
```
