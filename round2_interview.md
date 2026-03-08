# Round 2: Technical Interview + Live Coding

## What to Expect
- 2 Senior Engineers, ~2+ hours
- Theory-heavy: deep knowledge over breadth
- Live coding + architecture/design questions
- ~50% in English — prepare to answer in both Vietnamese and English
- Microservices/system design questions likely

---

# PART A: THEORY QUESTIONS

## 1. React Core

### Q: Explain the React reconciliation algorithm and React Fiber.
**A**: React uses a Virtual DOM diff algorithm to minimize real DOM mutations. React Fiber (v16+) is a complete rewrite of the reconciler:
- Breaks rendering into small **units of work** (fibers)
- Enables **incremental rendering**: pause, resume, reuse, or abort work
- Enables **priority-based scheduling**: urgent updates (user input) interrupt less urgent ones
- Enables Concurrent Mode features (Suspense, transitions)
- Each fiber node is a JS object representing a component instance + work to do

### Q: What is the difference between controlled and uncontrolled components?
**A**:
- **Controlled**: React state is the single source of truth. Input value driven by `value` prop + `onChange` handler. Enables real-time validation, conditional rendering.
- **Uncontrolled**: DOM is the source of truth. Use `ref` + `defaultValue`. Useful for file inputs or integrating with non-React code.

### Q: Explain all React hooks and when to use each.
| Hook | Purpose |
|------|---------|
| `useState` | Local component state |
| `useEffect` | Side effects (data fetch, subscriptions, DOM mutations) |
| `useContext` | Consume React context without prop drilling |
| `useReducer` | Complex state logic, alternative to useState |
| `useMemo` | Memoize expensive computed values |
| `useCallback` | Memoize function references to prevent child re-renders |
| `useRef` | Mutable ref to DOM node or any mutable value (persists across renders, no re-render) |
| `useLayoutEffect` | Like useEffect but fires synchronously after DOM mutations (before paint) |
| `useId` | Generate unique IDs for accessibility |
| `useTransition` | Mark state update as non-urgent (Concurrent) |
| `useDeferredValue` | Defer re-render of expensive component |
| `useImperativeHandle` | Customize what parent sees via ref |

### Q: When does a React component re-render?
**A**: A component re-renders when:
1. Its own **state changes** (`useState`, `useReducer`)
2. Its **parent re-renders** (unless wrapped in `React.memo`)
3. Its **context value changes** (`useContext`)
4. Its **props change** (referential equality for objects/arrays/functions)

### Q: How does `useMemo` differ from `useCallback`?
**A**:
```js
// useMemo: caches the RESULT of a function
const expensiveValue = useMemo(() => computeExpensive(a, b), [a, b]);

// useCallback: caches the FUNCTION ITSELF
const handleClick = useCallback(() => doSomething(id), [id]);
```
Both help avoid unnecessary work, but `useCallback` prevents child components from receiving a new function reference each render.

### Q: Explain `useEffect` cleanup. Why is it important?
```js
useEffect(() => {
  const sub = someService.subscribe(handleData);
  return () => sub.unsubscribe(); // cleanup on unmount or before next effect
}, [dependency]);
```
Without cleanup: memory leaks (subscriptions, event listeners, timers still fire after unmount).

### Q: What are React Portals?
**A**: Portals render children into a DOM node outside the parent component's DOM hierarchy, while still preserving the React component tree (context, events still work).
```js
ReactDOM.createPortal(child, document.getElementById('modal-root'))
```
Use case: modals, tooltips, dropdowns that need to escape CSS overflow:hidden.

### Q: What is `React.StrictMode` and what does it do?
**A**: A development-only tool that:
- Double-invokes render + lifecycle methods to detect side effects
- Warns about deprecated APIs
- Detects unexpected side effects in effects (runs effects twice in dev)
- Does NOT affect production builds

### Q: Explain the Context API. When would you use Redux instead?
**A**:
- Context is good for: theme, locale, auth state — data that changes infrequently
- Redux is better when: complex state logic, many state slices, devtools/time-travel debugging needed, frequent updates affecting many components
- Context with frequent updates causes all consumers to re-render (can be solved with context splitting or `use-context-selector`)

---

## 2. Performance Optimization

### Q: How do you optimize React app performance?
**Key techniques**:
1. **`React.memo`** — prevent re-renders of pure functional components
2. **`useMemo` / `useCallback`** — memoize values and callbacks
3. **Code splitting** — `React.lazy` + `Suspense` + dynamic `import()`
4. **Virtualization** — `react-window` or `react-virtualized` for long lists
5. **Avoid inline objects/functions in JSX** — they create new references each render
6. **Batch state updates** — React 18 auto-batches by default
7. **Profiler** — use React DevTools Profiler to find expensive renders
8. **Key stability** — use stable IDs as keys, never index for dynamic lists

### Q: What is the difference between `useLayoutEffect` and `useEffect`?
| | `useEffect` | `useLayoutEffect` |
|-|-------------|-------------------|
| Timing | After paint | After DOM update, before paint |
| Use for | Data fetching, subscriptions | DOM measurements, animations |
| Blocks paint? | No | Yes (use sparingly) |

---

## 3. JavaScript Fundamentals (Senior Level)

### Q: Explain the Event Loop, microtasks, and macrotasks.
**A**:
- **Call Stack**: executes synchronous code
- **Macrotask queue**: `setTimeout`, `setInterval`, I/O, `setImmediate`
- **Microtask queue**: `Promise.then`, `queueMicrotask`, `MutationObserver`
- **Order**: Call stack clears → ALL microtasks drain → ONE macrotask → ALL microtasks → repeat

```js
console.log('1');
setTimeout(() => console.log('4'), 0);
Promise.resolve().then(() => console.log('2')).then(() => console.log('3'));
// Output: 1, 2, 3, 4
```

### Q: Explain closures with a practical example.
```js
function createCounter(initial = 0) {
  let count = initial; // enclosed variable
  return {
    increment: () => ++count,
    decrement: () => --count,
    value: () => count,
  };
}
const c = createCounter(10);
c.increment(); // 11
```

### Q: What is the difference between `==` and `===`?
- `===` strict equality: no type coercion
- `==` loose equality: coerces types (`null == undefined` is true, `0 == ''` is true)
- **Always use `===` in production code**

### Q: Explain `this` in JavaScript.
- In a regular function: `this` = caller (can be undefined in strict mode)
- In an arrow function: `this` = lexical (inherited from enclosing scope)
- In class methods: `this` = instance (unless detached)
- `bind`/`call`/`apply` explicitly set `this`

### Q: Explain `Promise.all` vs `Promise.allSettled` vs `Promise.race`.
```js
// all: resolves when ALL resolve, rejects if ANY rejects
const [a, b] = await Promise.all([fetchA(), fetchB()]);

// allSettled: waits for ALL, gives status + value/reason for each
const results = await Promise.allSettled([...]);

// race: resolves/rejects with FIRST settled promise
const first = await Promise.race([...]);

// any (ES2021): resolves with first FULFILLED (ignores rejections)
const first = await Promise.any([...]);
```

### Q: What are generators and where would you use them?
```js
function* range(start, end) {
  for (let i = start; i < end; i++) yield i;
}
[...range(0, 5)] // [0, 1, 2, 3, 4]
```
Use cases: lazy sequences, custom iterators, async flow control (redux-saga).

### Q: Explain `WeakMap` and `WeakRef` — when to use them?
- `WeakMap`: keys must be objects, does not prevent GC — ideal for metadata about objects without memory leaks (e.g., caching DOM node data)
- `WeakRef`: hold weak reference to object — use sparingly for caching

---

## 4. CSS & Browser Fundamentals

### Q: Explain CSS Box Model. What is `box-sizing: border-box`?
- Content → Padding → Border → Margin
- `content-box` (default): width = content only
- `border-box`: width includes padding + border (predictable layouts)

### Q: Explain CSS specificity.
- Inline styles: 1000
- ID selectors: 100
- Class/pseudo-class/attribute: 10
- Element/pseudo-element: 1

### Q: What is Critical Rendering Path?
1. Parse HTML → DOM
2. Parse CSS → CSSOM
3. Combine → Render Tree
4. Layout (reflow) → Paint → Composite
- JS blocks parsing (unless `async`/`defer`)
- Large CSS blocks rendering

### Q: Explain browser storage options.
| | localStorage | sessionStorage | Cookies | IndexedDB |
|-|-------------|---------------|---------|-----------|
| Capacity | ~5MB | ~5MB | ~4KB | Unlimited |
| Persists | Yes | Tab session | Configurable | Yes |
| Server sent? | No | No | Yes (auto) | No |
| Async? | No | No | No | Yes |

### Q: What is CORS and how does it work?
- Cross-Origin Resource Sharing: browser security mechanism
- Simple requests: browser adds `Origin` header, server responds with `Access-Control-Allow-Origin`
- Preflight: for non-simple requests (PUT, DELETE, custom headers) — browser sends OPTIONS first
- Fix on server side, not client side

---

## 5. Architecture & System Design

### Q: How would you architect a large-scale React application?
Key decisions:
1. **State**: Local state → Context → Zustand/Redux (based on complexity)
2. **Routing**: React Router v6 with lazy-loaded routes
3. **Data fetching**: React Query or SWR (cache, dedup, background refresh)
4. **Code splitting**: route-level + component-level lazy loading
5. **Folder structure**: feature-based (not layer-based)
6. **Design system**: shared component library with Storybook
7. **Testing**: unit (Vitest), integration (React Testing Library), E2E (Playwright)

### Q: [NAB-specific] Why don't microservices share a single database?
**A** (this question was confirmed asked at NAB):
- **Tight coupling**: schema changes in one service break others
- **Single point of failure**: database becomes bottleneck + SPOF
- **Scalability**: can't scale services independently if they share a DB
- **Autonomy**: teams can choose best DB per service (SQL vs NoSQL)
- **Data isolation**: services can own their domain, enforce boundaries
- **Tradeoffs**: adds complexity (eventual consistency, distributed transactions, saga pattern)

### Q: Explain micro-frontend architecture.
- Split frontend into independently deployable apps per team
- Integration: iframes, Web Components, Module Federation (Webpack 5)
- Tradeoffs: independent deployments vs shared state complexity, bundle duplication

---

# PART B: LIVE CODING PREP

## Common Live Coding Tasks for Senior Frontend

### Task 1: Build a custom React Hook
```js
// useDebounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

// useLocalStorage hook
function useLocalStorage(key, initialValue) {
  const [stored, setStored] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });
  const setValue = (value) => {
    const valueToStore = value instanceof Function ? value(stored) : value;
    setStored(valueToStore);
    localStorage.setItem(key, JSON.stringify(valueToStore));
  };
  return [stored, setValue];
}
```

### Task 2: Implement infinite scroll / pagination
```jsx
function useInfiniteScroll(loadMore) {
  const observerRef = useRef();
  const lastElementRef = useCallback((node) => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) loadMore();
    });
    if (node) observerRef.current.observe(node);
  }, [loadMore]);
  return lastElementRef;
}
```

### Task 3: Build a search with debounce + API call
```jsx
function SearchComponent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery) { setResults([]); return; }
    let cancelled = false;
    fetch(`/api/search?q=${debouncedQuery}`)
      .then(r => r.json())
      .then(data => { if (!cancelled) setResults(data); });
    return () => { cancelled = true; }; // avoid race conditions
  }, [debouncedQuery]);

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <ul>{results.map(r => <li key={r.id}>{r.name}</li>)}</ul>
    </div>
  );
}
```

### Task 4: Implement a generic Modal/Dialog
```jsx
function Modal({ isOpen, onClose, children }) {
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  return ReactDOM.createPortal(
    <div className="overlay" onClick={onClose}>
      <div className="modal" role="dialog" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  );
}
```

### Task 5: Implement a compound component (Tabs)
```jsx
const TabsContext = createContext();

function Tabs({ children, defaultTab }) {
  const [active, setActive] = useState(defaultTab);
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

function TabList({ children }) {
  return <div role="tablist">{children}</div>;
}

function Tab({ id, children }) {
  const { active, setActive } = useContext(TabsContext);
  return (
    <button role="tab" aria-selected={active === id} onClick={() => setActive(id)}>
      {children}
    </button>
  );
}

function TabPanel({ id, children }) {
  const { active } = useContext(TabsContext);
  return active === id ? <div role="tabpanel">{children}</div> : null;
}

// Usage:
<Tabs defaultTab="a">
  <TabList>
    <Tab id="a">First</Tab>
    <Tab id="b">Second</Tab>
  </TabList>
  <TabPanel id="a">Content A</TabPanel>
  <TabPanel id="b">Content B</TabPanel>
</Tabs>
```

### Task 6: Flatten nested array (no Array.flat)
```js
function flatten(arr) {
  return arr.reduce((acc, item) =>
    Array.isArray(item) ? [...acc, ...flatten(item)] : [...acc, item], []);
}
// Or iteratively:
function flattenIterative(arr) {
  const stack = [...arr];
  const result = [];
  while (stack.length) {
    const item = stack.pop();
    if (Array.isArray(item)) stack.push(...item);
    else result.unshift(item);
  }
  return result;
}
```

### Task 7: Implement `Promise.all` from scratch
```js
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let count = 0;
    if (promises.length === 0) return resolve([]);
    promises.forEach((promise, i) => {
      Promise.resolve(promise).then(value => {
        results[i] = value;
        if (++count === promises.length) resolve(results);
      }).catch(reject);
    });
  });
}
```

### Task 8: Deep clone an object
```js
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(deepClone);
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, deepClone(v)])
  );
}
// Modern: structuredClone(obj) — handles Date, Map, Set, circular refs
```

---

## Tips for the Live Coding Session

1. **Think out loud** — narrate your approach before coding
2. **Start with a simple solution**, then optimize if asked
3. **Ask clarifying questions**: edge cases? input constraints? browser support?
4. **Write clean variable names** — interviewers read your code
5. **Mention Big O** when relevant
6. **Add comments** for non-obvious logic
7. **Test with examples** after writing

---

## Questions to Ask Interviewers (End of Interview)
- What does the team's tech stack look like currently?
- How does the team handle code reviews and deployment?
- What are the biggest technical challenges the team is facing?
- How is knowledge sharing done across teams?
- What does career growth look like for a senior engineer here?
