# lc05 — React.memo + useCallback + useMemo
**Topic:** Performance Optimization / Re-render Prevention
**Final Score: 25 / 100**

---

## Core Problem: Architecture Is Inverted

The entire solution is structured backwards. The task has two components with clear roles:

| Component | Role |
|---|---|
| `ProductList` | Parent — owns `search` and `cart` state, renders the list |
| `ProductItem` | Child — dumb presentational component, receives props only |

You put `search`, `cart`, `useMemo`, and `useCallback` **inside `ProductItem`** — the child.
`ProductList` was never written at all.

The export `export default ProductList` crashes immediately because `ProductList` is undefined.

---

## Issue-by-Issue Breakdown

### 1. `ProductList` is missing entirely
The entire parent component was not written. This is the component that should own state and
pass stable props down.

### 2. State (`search`, `cart`) belongs in `ProductList`, not `ProductItem`
```jsx
// ❌ Inside ProductItem — wrong
const [search, setSearch] = useState('');
const [cart, setCart] = useState([]);
```
Each `ProductItem` instance having its own search and cart makes no sense — you'd have 4
independent search boxes, one per product.

### 3. `useMemo` result is thrown away
```jsx
// ❌ Return value not captured — computed and immediately discarded
useMemo(() => {
  return PRODUCTS.filter(...);
}, [search])

// ✓ Correct
const filtered = useMemo(() => {
  return PRODUCTS.filter(...);
}, [search]);
```
Also, this belongs in `ProductList`, not `ProductItem`.

### 4. `useCallback` is in the wrong component
`useCallback` on `handleAddToCart` belongs in `ProductList`. The point is to give `ProductItem`
a **stable function reference** so `React.memo` can skip re-rendering child items when the
parent re-renders. Putting `useCallback` inside the memoized child defeats the purpose.

### 5. `useEffect` calling `onAddToCart` on cart change is a misuse
```jsx
// ❌ This fires onAddToCart with the entire cart array every time cart changes
useEffect(() => {
  onAddToCart(cart)
}, [cart])
```
`onAddToCart` is meant to be called directly on button click with a product ID, not as a
side effect of internal state changes.

### 6. `<input>` JSX syntax is invalid
`<input>` is a void element — it cannot have children.
```jsx
// ❌ Invalid — input cannot have children
<input value={search} onChange={...}>Search</input>

// ✓ Use placeholder or a separate label
<input value={search} onChange={...} placeholder="Search..." />
```

### 7. `useEffect` import is unnecessary
Nothing in the correct solution for this task requires `useEffect`.

---

## What a Correct Solution Looks Like (structure only)

```jsx
// ✓ Memoized child — only re-renders when its own props change
const ProductItem = memo(function ProductItem({ product, onAddToCart }) {
  console.log('render:', product.name);
  return (
    <div>
      <span>{product.name} — ${product.price}</span>
      <button onClick={() => onAddToCart(product.id)}>Add</button>
    </div>
  );
});

function ProductList() {
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);

  // ✓ Only recomputes when search changes
  const filtered = useMemo(() =>
    PRODUCTS.filter(p => p.name.toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  // ✓ Stable reference — won't cause ProductItem to re-render
  const handleAddToCart = useCallback((id) => {
    setCart(prev => [...prev, id]);
  }, []);

  return (
    <div>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." />
      <p>Cart: {cart.length} items</p>
      {filtered.map(p => (
        <ProductItem key={p.id} product={p} onAddToCart={handleAddToCart} />
      ))}
    </div>
  );
}
```

---

## What You Got Right

- `memo()` wrapping syntax is correct
- `useCallback` with `[]` deps and functional updater is correct *in isolation*
- `React.memo` in the right place (wrapping ProductItem)

---

## How the Three APIs Work Together

### `React.memo` — protects the child from the parent

```jsx
const ProductItem = memo(function ProductItem({ product, onAddToCart }) { ... });
```

- Wraps a component so React skips re-rendering it if its props haven't changed
- Uses **shallow `===` comparison** on every prop
- Primitive props (strings, numbers, booleans) always pass — their value is compared directly
- Function/object/array props **always fail** unless the reference is stable across renders
- **Alone, it's not enough** — if the parent passes a new function on every render, `memo` is bypassed

```
// Every render of ProductList creates a new function object at a new memory address
const handleAddToCart = (id) => { ... }  // @0x001 on render 1, @0x002 on render 2...

// memo sees: prev.onAddToCart (0x001) !== next.onAddToCart (0x002) → re-renders anyway
```

---

### `useCallback` — makes function references stable (used in the parent)

```jsx
const handleAddToCart = useCallback((id) => {
  setCart(prev => [...prev, id]);
}, []); // [] = no deps → same reference for the component's lifetime
```

- Returns the **same function reference** across renders as long as deps don't change
- `[]` deps means: create once, reuse forever — correct here because the callback uses a
  functional updater (`prev => ...`) and doesn't close over any state directly
- Passed as `onAddToCart={handleAddToCart}` to `ProductItem`
- Now `memo`'s check passes: `prev.onAddToCart (0x001) === next.onAddToCart (0x001)` → skip ✓

**Rule:** `useCallback` lives in the **parent**. Its job is to hand a stable prop to the child
so `memo` can do its job.

---

### `useMemo` — memoizes an expensive computed value (used in the parent)

```jsx
const filtered = useMemo(() =>
  PRODUCTS.filter(p => p.name.toLowerCase().includes(search.toLowerCase())),
  [search]
);
```

- Caches the return value of a function between renders
- Only re-runs the function when `search` changes — skips recomputation on every other re-render
- Here the computation is simple, but in real apps (large datasets, complex transforms) this matters
- **Always assign the result** — `useMemo(() => ..., [deps])` with no variable is a no-op

---

### How All Three Work as a System

```
User types in search input
       ↓
ProductList re-renders (search state changed)
       ↓
┌─────────────────────────────────────────────────┐
│  useMemo:        filtered recomputes (search changed) ✓  │
│  useCallback:    handleAddToCart — same reference  ✓     │
└─────────────────────────────────────────────────┘
       ↓
ProductItem receives same product + same onAddToCart reference
       ↓
memo: props unchanged → SKIP re-render ✓
```

Without `useCallback`, `handleAddToCart` is a new reference every render →
`memo` sees a changed prop → re-renders all `ProductItem`s on every keystroke.

**`memo` + `useCallback` are a pair. Neither works without the other.**

---

## Follow-up Questions to Nail

1. **React.memo does shallow comparison — what does that mean?**
   It compares each prop by reference (`===`). Objects/arrays/functions created inline always
   fail the check because they're new references every render — that's why `useCallback` is needed.

2. **When is it NOT worth using useMemo/useCallback?**
   - When the computation is trivially cheap (< 1ms)
   - When the component rarely re-renders anyway
   - When the deps array changes on every render (the memoization never hits)
   - The overhead of comparison + memory can cost more than the re-render itself

3. **`useCallback(fn, deps)` is equivalent to `useMemo(() => fn, deps)` — why?**
   `useMemo` memoizes a *value*. A function is a value. So memoizing `() => fn` returns the
   function itself — which is exactly what `useCallback` does.

4. **If `handleAddToCart` used `cart` directly instead of the functional updater, would `useCallback` help?**
   No — you'd need `cart` in the deps array, so the callback would get a new reference every time
   `cart` changes, which is every add. `useCallback` with a stale dep is worse than useless.

5. **How would you measure whether the optimization helped?**
   React DevTools Profiler — record an interaction, look at which components re-rendered and why,
   compare flame graphs before and after.
