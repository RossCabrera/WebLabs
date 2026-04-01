# 05 – File Uploads & Drag and Drop

> **Goal:** Implement file uploads (single and multiple) and a polished drag-and-drop zone using only native browser APIs — no external DnD libraries.

---

## Table of Contents

1. [File Upload Basics](#file-upload-basics)
2. [Drag & Drop — Native API](#drag--drop--native-api)
3. [File Preview (Images)](#file-preview-images)
4. [Upload Mutation with TanStack](#upload-mutation-with-tanstack)
5. [Complete DropzoneUploader Component](#complete-dropzoneuploader-component)
6. [Common Pitfalls](#common-pitfalls)

---

## File Upload Basics

### Standard `<input type="file">`

```tsx
// Minimal controlled file input
const FileInput: React.FC<{ onFiles: (files: File[]) => void }> = ({ onFiles }) => (
  <input
    type="file"
    accept="image/*"          // filter by type in the OS picker
    multiple                  // allow multiple files
    onChange={e => {
      const files = Array.from(e.target.files ?? []);
      onFiles(files);
      e.target.value = '';    // reset so the same file can be picked again
    }}
  />
);
```

### Sending Files — `FormData`

Files **cannot** be sent as JSON. Use `multipart/form-data` via `FormData`.

```ts
async function uploadImages(productId: string, files: File[]): Promise<string[]> {
  const formData = new FormData();

  // Append with the field name the server expects
  files.forEach(file => formData.append('images', file));

  const { data } = await api.post<{ images: string[] }>(
    `/products/${productId}/images`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  );

  return data.images;   // array of URLs returned by the server
}
```

### Validating Files on the Client

Always validate before sending to give instant feedback.

```ts
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_MB   = 5;

function validateFiles(files: File[]): string | null {
  for (const file of files) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `${file.name}: unsupported type. Allowed: JPG, PNG, WEBP`;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return `${file.name}: exceeds ${MAX_SIZE_MB}MB limit`;
    }
  }
  return null;    // null = valid
}
```

---

## Drag & Drop — Native API

The browser fires these events on the **drop target** element:

| Event | When fires |
| :--- | :--- |
| `dragenter` | A dragged item enters the element |
| `dragover` | Item is dragged over the element (must `preventDefault` to allow drop) |
| `dragleave` | Item leaves the element |
| `drop` | Item is released over the element |

```tsx
// Minimal DnD zone
const DropZone: React.FC<{ onDrop: (files: File[]) => void }> = ({ onDrop }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();           // required — without this, drop is cancelled
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    onDrop(files);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
        isDragging
          ? 'border-primary bg-primary/5'
          : 'border-muted-foreground/30 hover:border-muted-foreground/60',
      )}
    >
      <p>Drop images here</p>
    </div>
  );
};
```

### `dragenter` / `dragleave` Flicker Fix

When the cursor moves over a child element, `dragleave` fires on the parent, killing the `isDragging` style. Fix with a ref counter:

```tsx
const dragCounter = useRef(0);

const handleDragEnter = (e: React.DragEvent) => {
  e.preventDefault();
  dragCounter.current++;
  setIsDragging(true);
};

const handleDragLeave = (e: React.DragEvent) => {
  e.preventDefault();
  dragCounter.current--;
  if (dragCounter.current === 0) setIsDragging(false);  // only clear when truly left
};

const handleDrop = (e: React.DragEvent) => {
  e.preventDefault();
  dragCounter.current = 0;   // reset
  setIsDragging(false);
  const files = Array.from(e.dataTransfer.files);
  onDrop(files);
};
```

---

## File Preview (Images)

Use `URL.createObjectURL` to generate a temporary local URL for preview **before** uploading.

```tsx
interface FilePreview {
  file: File;
  url:  string;    // object URL for <img src>
}

function filesToPreviews(files: File[]): FilePreview[] {
  return files.map(file => ({
    file,
    url: URL.createObjectURL(file),
  }));
}
```

> ⚠️ **Always revoke object URLs** when the preview is no longer needed to avoid memory leaks.

```tsx
// In a component that shows previews
const [previews, setPreviews] = useState<FilePreview[]>([]);

const addFiles = (files: File[]) => {
  const newPreviews = filesToPreviews(files);
  setPreviews(prev => [...prev, ...newPreviews]);
};

const removePreview = (index: number) => {
  setPreviews(prev => {
    URL.revokeObjectURL(prev[index].url);  // free memory
    return prev.filter((_, i) => i !== index);
  });
};

// Cleanup all on unmount
useEffect(() => {
  return () => previews.forEach(p => URL.revokeObjectURL(p.url));
}, []);    // intentionally empty — runs only on unmount
```

### Preview Grid

```tsx
const ImagePreviewList: React.FC<{
  previews: FilePreview[];
  onRemove: (index: number) => void;
}> = ({ previews, onRemove }) => (
  <div className="grid grid-cols-3 gap-3 mt-4">
    {previews.map(({ url }, i) => (
      <div key={url} className="relative aspect-square rounded-md overflow-hidden group">
        <img
          src={url}
          alt={`Preview ${i + 1}`}
          className="h-full w-full object-cover"
        />
        <button
          type="button"
          onClick={() => onRemove(i)}
          className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white
                     opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    ))}
  </div>
);
```

---

## Upload Mutation with TanStack

```ts
// hooks/useUploadImages.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api }         from '@/lib/api';
import { productKeys } from '@/lib/queryKeys';

interface UploadPayload {
  productId: string;
  files:     File[];
}

export function useUploadImages() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, files }: UploadPayload) => {
      const formData = new FormData();
      files.forEach(f => formData.append('images', f));

      const { data } = await api.post<{ images: string[] }>(
        `/products/${productId}/images`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      return data.images;
    },

    onSuccess: (_, { productId }) => {
      // Refresh the product detail so the new images appear
      queryClient.invalidateQueries({ queryKey: productKeys.detail(productId) });
      toast.success('Images uploaded!');
    },

    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message ?? 'Upload failed');
    },
  });
}
```

### Upload Progress (Optional)

```ts
mutationFn: async ({ productId, files }: UploadPayload) => {
  const formData = new FormData();
  files.forEach(f => formData.append('images', f));

  const { data } = await api.post(`/products/${productId}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (event) => {
      const percent = Math.round((event.loaded / (event.total ?? 1)) * 100);
      setUploadProgress(percent);   // local state in the component
    },
  });

  return data.images;
},
```

---

## Complete DropzoneUploader Component

Combines all the pieces above into a single ready-to-use component.

```tsx
// components/admin/DropzoneUploader.tsx
import { useRef, useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface FilePreview { file: File; url: string; }

interface DropzoneUploaderProps {
  productId:  string;
  maxFiles?:  number;
  maxSizeMb?: number;
}

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];

export const DropzoneUploader: React.FC<DropzoneUploaderProps> = ({
  productId, maxFiles = 5, maxSizeMb = 5,
}) => {
  const [previews, setPreviews]       = useState<FilePreview[]>([]);
  const [isDragging, setIsDragging]   = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const dragCounter                   = useRef(0);
  const inputRef                      = useRef<HTMLInputElement>(null);

  const { mutate: upload, isPending } = useUploadImages();

  // Cleanup object URLs on unmount
  useEffect(() => () => previews.forEach(p => URL.revokeObjectURL(p.url)), []);

  const addFiles = useCallback((incoming: File[]) => {
    setError(null);

    // Validate
    for (const file of incoming) {
      if (!ALLOWED.includes(file.type)) {
        setError(`${file.name}: unsupported type`); return;
      }
      if (file.size > maxSizeMb * 1024 * 1024) {
        setError(`${file.name}: exceeds ${maxSizeMb}MB`); return;
      }
    }

    setPreviews(prev => {
      const available = maxFiles - prev.length;
      if (available <= 0) { setError(`Max ${maxFiles} files`); return prev; }
      const accepted = incoming.slice(0, available);
      return [...prev, ...accepted.map(f => ({ file: f, url: URL.createObjectURL(f) }))];
    });
  }, [maxFiles, maxSizeMb]);

  const removePreview = (index: number) => {
    setPreviews(prev => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  };

  // Drag handlers
  const onDragEnter  = (e: React.DragEvent) => { e.preventDefault(); dragCounter.current++; setIsDragging(true); };
  const onDragLeave  = (e: React.DragEvent) => { e.preventDefault(); if (--dragCounter.current === 0) setIsDragging(false); };
  const onDragOver   = (e: React.DragEvent) => { e.preventDefault(); };
  const onDrop       = (e: React.DragEvent) => {
    e.preventDefault(); dragCounter.current = 0; setIsDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  };

  const handleUpload = () => {
    if (!previews.length) return;
    upload(
      { productId, files: previews.map(p => p.file) },
      { onSuccess: () => setPreviews([]) },
    );
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition-all',
          isDragging
            ? 'border-primary bg-primary/5 scale-[1.01]'
            : 'border-muted-foreground/30 hover:border-primary/60',
        )}
      >
        <UploadCloud className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
        <p className="text-sm font-medium">
          {isDragging ? 'Drop to add' : 'Drag & drop or click to browse'}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          JPG, PNG, WEBP up to {maxSizeMb}MB · Max {maxFiles} images
        </p>
      </div>

      {/* Hidden input */}
      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED.join(',')}
        multiple
        className="hidden"
        onChange={e => { addFiles(Array.from(e.target.files ?? [])); e.target.value = ''; }}
      />

      {/* Error */}
      {error && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <AlertCircle className="h-4 w-4" /> {error}
        </p>
      )}

      {/* Previews */}
      {previews.length > 0 && (
        <>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {previews.map(({ url }, i) => (
              <div key={url} className="relative aspect-square rounded-md overflow-hidden group">
                <img src={url} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removePreview(i)}
                  className="absolute inset-0 flex items-center justify-center
                             bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>
            ))}
          </div>

          <Button onClick={handleUpload} disabled={isPending} className="w-full">
            {isPending
              ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading…</>
              : `Upload ${previews.length} image${previews.length > 1 ? 's' : ''}`
            }
          </Button>
        </>
      )}
    </div>
  );
};
```

---

## Common Pitfalls

| Pitfall | Fix |
| :--- | :--- |
| Forgetting `e.preventDefault()` on `dragover` | Without it the browser opens the file instead of triggering `drop` |
| `dragleave` fires when hovering child elements | Use a `dragCounter` ref to count enter/leave pairs |
| Object URLs not revoked | Call `URL.revokeObjectURL()` on remove and on unmount |
| Sending files as JSON | Use `FormData` with `Content-Type: multipart/form-data` |
| No client-side validation | Validate type + size before sending to give instant feedback |
| Showing stale images after upload | Invalidate the product's TanStack Query detail key on upload success |
