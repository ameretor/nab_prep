# ReactJS — Theory & Interview Prep

## 1. Reconciliation & Virtual DOM

**How React updates the UI:**
1. State/props change → React calls the component function (re-render)
2. A new Virtual DOM tree is produced (cheap JS objects)
3. React **diffs** the new tree against the previous one (reconciliation)
4. Only the actual DOM nodes that changed are updated (commit phase)

**Diffing algorithm rules (O(n) heuristics):**
- Different element type → tear down old subtree, mount new one from scratch
- Same element type → update attributes, recurse into children
- Lists → use `key` prop to track identity across renders

**Why keys matter in lists:**
```jsx
// Bad — React can't track items across reorders
items.map((item, i) => <Item key={i} data={item} />)

// Good — stable identity
items.map(item => <Item key={item.id} data={item} />)
```
Without stable keys: wrong items update, animations break, input focus is lost.

---

## 2. What Triggers a Re-render?

1. `setState` / `useState` setter called (even with same value for objects/arrays)
2. Parent re-renders → child re-renders by default
3. `useContext` consumer re-renders whenever context value changes
4. `useReducer` dispatch called

**React bails out if:**
- `useState` setter called with exact same primitive value (Object.is comparison)
- Component is wrapped in `React.memo` and props didn't change

---

## 3. React.memo

```jsx
const MyComponent = React.memo(function MyComponent({ value, onClick }) {
  // only re-renders if value or onClick reference changes
});
```

**When it does NOT help:**
- Props include new object/array literals created inline: `<Comp style={{color: 'red'}} />` → new reference every render
- Props include inline callbacks: `<Comp onClick={() => doSomething()} />` → new reference every render
- Solution: `useMemo` for objects, `useCallback` for functions

---

## 4. useMemo vs useCallback

```jsx
// useMemo — memoizes a VALUE (result of computation)
const sortedList = useMemo(() => {
  return [...items].sort((a, b) => a.name.localeCompare(b.name));
}, [items]);

// useCallback — memoizes a FUNCTION REFERENCE
const handleClick = useCallback((id) => {
  dispatch({ type: 'SELECT', id });
}, [dispatch]);
```

**The rule of thumb:**
- `useMemo` → expensive computation whose result you want to cache
- `useCallback` → function you pass as prop to a memoized child (prevents breaking memo)

**Don't over-use them.** Memoization has a cost (cache comparison on every render). Only use when:
- `useMemo`: measurably expensive computation (profile first)
- `useCallback`: the function is a dependency of another hook, OR passed to a `React.memo` child

---

## 5. useRef — Two Use Cases

```jsx
// Use case 1: Access DOM node
const inputRef = useRef(null);
<input ref={inputRef} />
inputRef.current.focus(); // imperative DOM access

// Use case 2: Mutable value that doesn't trigger re-render
const timerRef = useRef(null);
timerRef.current = setInterval(tick, 1000); // stored without re-render
```

**Stale closure fix with useRef:**
```jsx
// Without useRef — stale closure
useEffect(() => {
  const id = setInterval(() => {
    console.log(count); // always reads initial value of count
  }, 1000);
  return () => clearInterval(id);
}, []); // empty deps = stale forever

// With useRef — always fresh
const countRef = useRef(count);
useEffect(() => { countRef.current = count; }); // sync on every render
useEffect(() => {
  const id = setInterval(() => {
    console.log(countRef.current); // always fresh
  }, 1000);
  return () => clearInterval(id);
}, []);
```

---

## 6. useEffect & Cleanup

```jsx
useEffect(() => {
  const subscription = eventBus.subscribe(handler);

  return () => {
    subscription.unsubscribe(); // cleanup runs before next effect + on unmount
  };
}, [dependency]);
```

**Dependency array rules:**
- `[]` → runs once after mount (like componentDidMount)
- `[dep1, dep2]` → runs when any dep changes
- omitted → runs after every render (dangerous, usually a bug)

**React 18 StrictMode** calls effects twice in dev to detect side effects. Your cleanup must be correct.

---

## 7. Context API — Performance Trap

```jsx
const ThemeContext = React.createContext();

function App() {
  const [theme, setTheme] = useState('light');
  // BUG: new object on every render → all consumers re-render
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      ...
    </ThemeContext.Provider>
  );
}
```

**Fix 1: Memoize the context value**
```jsx
const value = useMemo(() => ({ theme, setTheme }), [theme]);
<ThemeContext.Provider value={value}>
```

**Fix 2: Split contexts** — separate the read context from the write context so components that only call setTheme don't re-render on theme changes.

**Fix 3: Use a state management library** (Zustand, Jotai) for global state that many components subscribe to at different granularities.

---

## 8. React 18 Concurrent Features

### useTransition
Marks a state update as non-urgent — React can interrupt it to handle more urgent updates (e.g. user input).
```jsx
const [isPending, startTransition] = useTransition();

function handleSearch(query) {
  setQuery(query); // urgent — updates the input immediately
  startTransition(() => {
    setSearchResults(search(query)); // non-urgent — can be deferred
  });
}
```

### useDeferredValue
Defers updating a value until the browser is free — like debouncing at React's scheduler level.
```jsx
const deferredQuery = useDeferredValue(query);
// Use deferredQuery for expensive filtered list rendering
```

### Automatic Batching
React 18 batches ALL state updates (even inside setTimeout, Promises) — previously only batched inside event handlers.

---

## 9. Code Splitting & Lazy Loading

```jsx
const LazyPage = React.lazy(() => import('./pages/HeavyPage'));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <LazyPage />
    </Suspense>
  );
}
```

With React Router:
```jsx
const Dashboard = lazy(() => import('./Dashboard'));
<Route path="/dashboard" element={
  <Suspense fallback={<Loading />}><Dashboard /></Suspense>
} />
```

---

## 10. How to Profile a Slow React App

**Step 1: Measure first** — don't guess
- React DevTools Profiler → Flamegraph → find components with high render time
- Chrome Performance tab → Long Tasks

**Step 2: Diagnose category**
- Unnecessary re-renders → add `React.memo` + `useCallback`/`useMemo`
- Expensive computations → `useMemo`
- Large list rendering → virtualize with `react-window` or `react-virtual`
- Context causing cascade re-renders → split context, use selector pattern

**Step 3: Verify the fix** — re-profile, measure p75 metrics

---

## 11. Custom Hooks Pattern

Rules:
1. Name starts with `use`
2. Can call other hooks
3. Encapsulates stateful logic, not UI

```jsx
// Good custom hook
function useWindowSize() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handler = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return size;
}
```

---

## Key Interview Answers (model answers for NAB)

### "How does React reconciliation work?"
> "When state or props change, React calls the component function and produces a new Virtual DOM tree. It then diffs the new tree against the previous one — this is reconciliation. React's diff algorithm uses heuristics to run in O(n): it assumes elements of different types produce completely different trees, and uses `key` props to track list items across renders. Only the real DOM nodes that actually changed get updated in the commit phase."

### "When would you NOT use useMemo?"
> "When the computation is cheap — say, filtering a 10-item array. Memoization isn't free: React still runs the comparison on every render. I only reach for useMemo when I've profiled and confirmed the computation is measurably expensive, typically something O(n²) or involving heavy DOM calculations. Premature memoization adds complexity with no benefit."

### "How does Context cause performance issues?"
> "Context re-renders every consumer whenever the context value reference changes. If you put a large object in a single context and update any part of it, every component that reads that context re-renders — even ones that only care about an unrelated field. The fix is to split contexts by concern, memoize context values, or switch to a library like Zustand that supports fine-grained subscriptions."
