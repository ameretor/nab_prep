# React Hooks — Theory Reference

For each hook: **what it is → when to use it → real-life example**

---

## useReducer

### What it is
An alternative to `useState` for managing state. Instead of calling a setter directly, you dispatch **actions** to a **reducer function** that decides how state should change.

```js
const [state, dispatch] = useReducer(reducer, initialState);
```

The reducer signature:
```js
function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT': return { count: state.count + 1 };
    default: return state;
  }
}
```

### When to use it
- State has **multiple sub-values** that change together
- **Next state depends on previous state** in non-trivial ways
- You have **many state transitions** that would need many `useState` setters
- You want to **co-locate** all state logic in one place (easier to test)

Rule of thumb: if you have 3+ `useState` calls that are related, consider `useReducer`.

### Real-life example — Shopping cart
```jsx
const initialState = { items: [], total: 0 };

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.payload.id);
      const items = existing
        ? state.items.map(i => i.id === action.payload.id
            ? { ...i, qty: i.qty + 1 }
            : i)
        : [...state.items, { ...action.payload, qty: 1 }];
      return { items, total: items.reduce((s, i) => s + i.price * i.qty, 0) };
    }
    case 'REMOVE_ITEM': {
      const items = state.items.filter(i => i.id !== action.payload.id);
      return { items, total: items.reduce((s, i) => s + i.price * i.qty, 0) };
    }
    case 'CLEAR_CART':
      return initialState;
    default:
      return state;
  }
}

function Cart() {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  return (
    <>
      <button onClick={() => dispatch({ type: 'ADD_ITEM', payload: { id: 1, name: 'Laptop', price: 999 } })}>
        Add Laptop
      </button>
      <button onClick={() => dispatch({ type: 'CLEAR_CART' })}>Clear</button>
      <p>Total: ${state.total}</p>
    </>
  );
}
```

**Why not `useState` here?** Adding an item requires updating both `items` and `total` in sync. With `useState` you'd need two setters and risk them going out of sync. The reducer handles both atomically.

---

## useContext

### What it is
Lets a component read a value from the nearest `Context.Provider` above it in the tree — without passing props through every intermediate component (prop drilling).

```jsx
// 1. Create context
const ThemeContext = createContext(null);

// 2. Provide it
<ThemeContext.Provider value={{ theme, toggleTheme }}>
  <App />
</ThemeContext.Provider>

// 3. Consume it — anywhere in the tree
const { theme } = useContext(ThemeContext);
```

### When to use it
- **Global, infrequently changing data**: theme, locale, auth user, feature flags
- When prop drilling goes through 3+ levels of components that don't use the data themselves
- For **shared state that many components need to read**

### When NOT to use it
- High-frequency updates (every keystroke, scroll position) — every consumer re-renders on every change
- When only a few nearby components need the data — just pass props

### Real-life example — Auth user
```jsx
const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = useCallback(async (credentials) => {
    const user = await api.login(credentials);
    setUser(user);
  }, []);

  const logout = useCallback(() => setUser(null), []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — throws a clear error if used outside provider
function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

// In any component, no matter how deep:
function UserAvatar() {
  const { user, logout } = useAuth();
  if (!user) return null;
  return <button onClick={logout}>{user.name}</button>;
}
```

---

## useMemo

### What it is
Memoizes the **result of a calculation**. React runs the function on the first render and caches the result. On re-renders, if the dependencies haven't changed, it returns the cached value without re-running the function.

```js
const result = useMemo(() => expensiveComputation(a, b), [a, b]);
//                      ↑ function to run          ↑ deps
```

### When to use it
- The calculation is **genuinely expensive** (e.g., filtering/sorting a large list, complex math)
- The result is passed as a prop to a `React.memo`-wrapped child (referential stability)
- You want to avoid re-creating an **object or array** on every render when used as a dependency elsewhere

### When NOT to use it
- For cheap calculations — the overhead of memoization (storing, comparing deps) can cost more than just recomputing
- Don't add it preemptively — profile first, optimize second

### Real-life example — Filtering a large product list
```jsx
function ProductList({ products, search, category }) {
  // Without useMemo: filters all 10,000 products on EVERY render
  // (including renders caused by unrelated state like a modal opening)

  const filtered = useMemo(() => {
    return products
      .filter(p => p.category === category)
      .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => a.price - b.price);
  }, [products, search, category]); // only re-runs when these change

  return filtered.map(p => <ProductCard key={p.id} product={p} />);
}
```

**Mental model:** `useMemo` is like a spreadsheet cell — it only recalculates when its inputs change.

---

## useCallback

### What it is
Memoizes a **function reference**. Returns the same function object between renders as long as dependencies haven't changed.

```js
const handleClick = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

`useCallback(fn, deps)` is exactly equivalent to `useMemo(() => fn, deps)` — it just reads more clearly when the value is a function.

### When to use it
- Passing a callback to a **`React.memo`-wrapped child** — without `useCallback`, a new function reference is created each render, defeating the memo
- When a function is a **dependency in another hook's dep array** (e.g., inside `useEffect`) — a new function reference each render would cause the effect to re-run every time

### When NOT to use it
- For event handlers on plain (non-memoized) elements — `<button onClick={fn}>` recreating `fn` is fine, React doesn't compare these
- When the component is cheap to re-render anyway

### Real-life example — Stable callback for a memoized child
```jsx
const ExpensiveList = React.memo(({ items, onDelete }) => {
  // Only re-renders when items or onDelete change
  return items.map(item => (
    <div key={item.id}>
      {item.name}
      <button onClick={() => onDelete(item.id)}>Delete</button>
    </div>
  ));
});

function Parent() {
  const [items, setItems] = useState([...]);
  const [filter, setFilter] = useState('');

  // Without useCallback: new function every render → ExpensiveList always re-renders
  // With useCallback: same function reference → ExpensiveList skips re-render
  const handleDelete = useCallback((id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []); // no deps needed — uses functional updater

  return (
    <>
      <input value={filter} onChange={e => setFilter(e.target.value)} />
      <ExpensiveList items={items} onDelete={handleDelete} />
    </>
  );
}
```

**Key insight:** Typing in the input changes `filter` → `Parent` re-renders → without `useCallback`, `handleDelete` is a new function → `ExpensiveList` re-renders despite its items not changing.

---

## useRef

### What it is
Returns a mutable object `{ current: value }` that:
- **Persists across renders** (same object every render)
- **Does NOT trigger a re-render when mutated**

```js
const ref = useRef(initialValue);
ref.current = anything; // mutate freely — no re-render
```

Two completely separate use cases share this one hook:

**Use case 1 — DOM access:**
```jsx
const inputRef = useRef(null);
<input ref={inputRef} />
// then: inputRef.current.focus()
```

**Use case 2 — Mutable value that shouldn't trigger re-renders:**
```js
const intervalId = useRef(null);
intervalId.current = setInterval(tick, 1000);
```

### When to use it
| Scenario | Why useRef |
|---|---|
| Focus/scroll/measure a DOM element | Need direct DOM access |
| Store interval / timeout ID | Changing it shouldn't re-render |
| Store previous value of a prop/state | For comparison, not for display |
| Fix stale closure in useEffect | Store latest value without being a dep |

### When NOT to use it
If the value needs to appear in the UI — use `useState`. Mutating `ref.current` does not cause a re-render, so the UI won't update.

### Real-life example — Auto-save with previous value comparison
```jsx
function AutoSaveForm() {
  const [content, setContent] = useState('');
  const lastSavedRef = useRef(''); // tracks what's been saved — no UI display needed

  useEffect(() => {
    const id = setTimeout(() => {
      if (content !== lastSavedRef.current) {
        api.save(content).then(() => {
          lastSavedRef.current = content; // update without re-render
        });
      }
    }, 1000);
    return () => clearTimeout(id);
  }, [content]);

  return <textarea value={content} onChange={e => setContent(e.target.value)} />;
}
```

**Why not `useState` for `lastSaved`?** Updating it would trigger a re-render, which would restart the effect, which would trigger another save attempt — an infinite loop.

---

## useLayoutEffect

### What it is
Identical API to `useEffect`, but fires **synchronously after React updates the DOM and before the browser paints**.

```
useEffect    timeline: render → DOM update → browser paint → effect runs
useLayoutEffect timeline: render → DOM update → effect runs → browser paint
```

### When to use it
Only when you need to **read a DOM measurement and immediately update something** based on it — before the user sees anything. If you use `useEffect` for this, the user sees a flicker (old position → new position).

Common cases:
- Measuring an element's size or position (`getBoundingClientRect`)
- Positioning a tooltip, popover, or dropdown relative to a trigger
- Synchronously updating a scroll position
- Animations that depend on layout measurements

### When NOT to use it
For everything else — use `useEffect`. `useLayoutEffect` blocks the browser from painting, which can make the app feel slow if you do expensive work in it.

### Real-life example — Tooltip that positions itself relative to a trigger
```jsx
function Tooltip({ triggerRef, children }) {
  const tooltipRef = useRef(null);

  useLayoutEffect(() => {
    // Measure the trigger's position in the DOM
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipEl = tooltipRef.current;

    // Position the tooltip above the trigger
    tooltipEl.style.top = `${triggerRect.top - tooltipEl.offsetHeight - 8}px`;
    tooltipEl.style.left = `${triggerRect.left + triggerRect.width / 2}px`;

    // With useEffect: tooltip briefly appears at 0,0 before jumping to correct position
    // With useLayoutEffect: measurement and positioning happen before paint — no flicker
  }, [triggerRef]);

  return (
    <div ref={tooltipRef} style={{ position: 'fixed' }}>
      {children}
    </div>
  );
}
```

---

## Quick Comparison Table

| Hook | Returns | Triggers re-render? | Timing |
|---|---|---|---|
| `useState` | `[value, setter]` | Yes, on setter call | After render |
| `useReducer` | `[state, dispatch]` | Yes, on dispatch | After render |
| `useContext` | context value | Yes, on context change | After render |
| `useMemo` | cached **value** | No | During render |
| `useCallback` | cached **function** | No | During render |
| `useRef` | `{ current }` object | **No** | Immediate (sync) |
| `useEffect` | — (side effects) | No | After paint |
| `useLayoutEffect` | — (DOM reads) | No | After DOM, before paint |

---

## Decision Flowchart

```
Need to store data?
├── Will it be shown in the UI?
│   ├── Simple value → useState
│   └── Complex / related values → useReducer
└── Is it just a mutable container (timer ID, DOM ref, previous value)?
    └── useRef

Need to share data across components?
└── useContext (for infrequent global data like theme/auth)

Need to optimise a re-render?
├── Expensive calculation → useMemo
└── Stable function reference → useCallback
    (only needed when passed to React.memo child or used in deps)

Need a side effect?
├── Need to measure the DOM before paint → useLayoutEffect
└── Everything else → useEffect
```
