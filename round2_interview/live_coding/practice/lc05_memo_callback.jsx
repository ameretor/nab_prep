/**
 * LIVE CODING — lc05: React.memo + useCallback + useMemo
 * Topic: Performance Optimization / Re-render Prevention
 *
 * ─── TASK ─────────────────────────────────────────────────────────────────────
 * You are given a <ProductList /> component that renders a list of products
 * and allows filtering by a search term.
 *
 * The component has a performance problem: <ProductItem /> re-renders on every
 * keystroke, even for products that didn't change.
 *
 * Your job:
 *   1. Memoize <ProductItem /> so it only re-renders when its own props change
 *   2. Memoize the filtered list computation with useMemo
 *   3. Memoize the onAddToCart callback with useCallback so it's stable
 *   4. Explain when each optimization is and isn't worth it
 *
 * ─── STARTER CODE (fix the performance problems) ──────────────────────────────
 *
 * const PRODUCTS = [
 *   { id: 1, name: 'Laptop', price: 999 },
 *   { id: 2, name: 'Mouse', price: 29 },
 *   { id: 3, name: 'Keyboard', price: 79 },
 *   { id: 4, name: 'Monitor', price: 399 },
 * ];
 *
 * // ❌ Not memoized — re-renders whenever parent re-renders
 * function ProductItem({ product, onAddToCart }) {
 *   console.log('render:', product.name);
 *   return (
 *     <div>
 *       <span>{product.name} — ${product.price}</span>
 *       <button onClick={() => onAddToCart(product.id)}>Add</button>
 *     </div>
 *   );
 * }
 *
 * function ProductList() {
 *   const [search, setSearch] = useState('');
 *   const [cart, setCart] = useState([]);
 *
 *   // ❌ Recomputed on every render
 *   const filtered = PRODUCTS.filter(p =>
 *     p.name.toLowerCase().includes(search.toLowerCase())
 *   );
 *
 *   // ❌ New function reference on every render
 *   const handleAddToCart = (id) => {
 *     setCart(prev => [...prev, id]);
 *   };
 *
 *   return (
 *     <div>
 *       <input value={search} onChange={e => setSearch(e.target.value)} />
 *       <p>Cart: {cart.length} items</p>
 *       {filtered.map(p => (
 *         <ProductItem key={p.id} product={p} onAddToCart={handleAddToCart} />
 *       ))}
 *     </div>
 *   );
 * }
 *
 * ─── REQUIREMENTS ─────────────────────────────────────────────────────────────
 * - ProductItem must NOT re-render when the search changes but the product list
 *   items haven't changed
 * - filtered list must only recompute when search changes
 * - onAddToCart must be a stable reference across renders
 *
 * ─── INTERVIEWER FOLLOW-UPS ───────────────────────────────────────────────────
 * Be ready to explain:
 *   1. React.memo does a shallow comparison — what does that mean?
 *      When does it still re-render despite being memoized?
 *   2. useMemo and useCallback both have a cost (memory + comparison on every render).
 *      When is it NOT worth using them?
 *   3. useCallback(fn, deps) is equivalent to useMemo(() => fn, deps) — why?
 *   4. If onAddToCart used `cart` from state directly (instead of the functional
 *      updater), would useCallback help? Why not?
 *   5. How would you measure whether your optimization actually helped?
 *      (React DevTools Profiler)
 *
 * ─── YOUR SOLUTION ────────────────────────────────────────────────────────────
 */

import { useState, useMemo, useCallback, memo } from 'react';

const PRODUCTS = [
  { id: 1, name: 'Laptop', price: 999 },
  { id: 2, name: 'Mouse', price: 29 },
  { id: 3, name: 'Keyboard', price: 79 },
  { id: 4, name: 'Monitor', price: 399 },
];

// ✓ Dumb presentational component — only re-renders when its own props change
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

  // ✓ Stable reference across renders — won't cause ProductItem to re-render
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

export default ProductList;
