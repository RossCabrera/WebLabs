# ⚛️ Components and Props

## What is a Component?

A component is a **JavaScript/TypeScript function** that returns JSX (extended HTML).

```tsx
// Simplest possible component
function Greeting() {
  return <h1>Hello World!</h1>;
}

export default Greeting;
```

---

## Component Types

### 1. Function Component (the current standard)

```tsx
// Arrow function
const Greeting = () => {
  return <h1>Hello</h1>;
};

// Function declaration
function Greeting() {
  return <h1>Hello</h1>;
}
```

### 2. Typed with `React.FC` (optional, debated)

```tsx
import React from 'react';

// With React.FC
const Greeting: React.FC = () => {
  return <h1>Hello</h1>;
};

// Without React.FC (simpler and preferred today)
const Greeting = () => {
  return <h1>Hello</h1>;
};
```

> ⚠️ Today it is preferred **not to use `React.FC`** because it doesn't add much and can complicate prop types.

---

## Props

**Props** are the parameters a component receives from outside.

### Define and Type Props

```tsx
// 1. Define the props interface
interface GreetingProps {
  name: string;
  age: number;
  isAdmin?: boolean;   // ? makes it optional
}

// 2. Receive props in the component
function Greeting({ name, age, isAdmin = false }: GreetingProps) {
  return (
    <div>
      <h2>Hello, {name}!</h2>
      <p>You are {age} years old.</p>
      {isAdmin && <span>🔑 You are an admin</span>}
    </div>
  );
}

export default Greeting;
```

### Use the Component with Props

```tsx
// App.tsx
import Greeting from './components/Greeting';

function App() {
  return (
    <div>
      <Greeting name="Ana" age={25} isAdmin={true} />
      <Greeting name="Carlos" age={30} />  {/* isAdmin is optional */}
    </div>
  );
}
```

---

## Common Props and Their Types

```tsx
interface ExampleProps {
  // Primitives
  title: string;
  count: number;
  active: boolean;

  // Arrays
  items: string[];
  numbers: number[];

  // Object
  user: { id: number; name: string };

  // Function (callback)
  onClick: () => void;
  onChange: (value: string) => void;

  // JSX as a prop (children)
  children: React.ReactNode;

  // Union type
  variant: 'primary' | 'secondary' | 'danger';

  // Optional
  className?: string;
}
```

---

## Props: `children`

```tsx
interface CardProps {
  title: string;
  children: React.ReactNode;  // accepts any JSX
}

function Card({ title, children }: CardProps) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <div className="card-body">
        {children}
      </div>
    </div>
  );
}

// Usage:
<Card title="My card">
  <p>Any content here</p>
  <button>A button</button>
</Card>
```

---

## Passing Functions as Props (Callbacks)

```tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
}

function MyButton({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}

// In the parent:
function App() {
  const handleClick = () => {
    console.log('Button clicked!');
  };

  return <MyButton label="Click me" onClick={handleClick} />;
}
```

---

## Full Example: Product Card

```tsx
// types/Product.ts
export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
}

// components/ProductCard.tsx
import { Product } from '../types/Product';

interface ProductCardProps {
  product: Product;
  onAddToCart: (id: number) => void;
}

function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { id, name, price, imageUrl } = product;

  return (
    <div className="product-card">
      {imageUrl && <img src={imageUrl} alt={name} />}
      <h3>{name}</h3>
      <p>${price.toFixed(2)}</p>
      <button onClick={() => onAddToCart(id)}>
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;

// App.tsx
import ProductCard from './components/ProductCard';

const product = { id: 1, name: 'Laptop', price: 999.99 };

function App() {
  const handleAddToCart = (id: number) => {
    console.log(`Product ${id} added`);
  };

  return (
    <ProductCard
      product={product}
      onAddToCart={handleAddToCart}
    />
  );
}
```
