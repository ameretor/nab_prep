# Round 2 — Theory Questions

NAB's technical interview is **theory-heavy**. Two senior engineers, ~2 hours, ~50% English.
Study these deeply — not just the what, but the **why**.

---

## React Core

### Q: What is React Fiber and how does reconciliation work?
React uses a Virtual DOM diff algorithm to minimize real DOM mutations.
**React Fiber** (v16+) is a complete rewrite of the reconciler:
- Breaks rendering into small **units of work** (fibers — JS objects per component)
- Enables **incremental rendering**: pause, resume, reuse, or abort work mid-render
- Enables **priority scheduling**: urgent updates (typing, clicks) interrupt low-priority ones
- Powers Concurrent Mode features: `Suspense`, `useTransition`, `useDeferredValue`

### Q: Controlled vs Uncontrolled components?
- **Controlled**: React state drives the input value (`value` + `onChange`). Enables real-time validation, conditional UI.
- **Uncontrolled**: DOM holds its own state. Access via `ref` + `defaultValue`. Good for file inputs or legacy integrations.

### Q: Explain ALL React hooks and when to use each.
| Hook | Purpose |
|------|---------|
| `useState` | Local component state |
| `useEffect` | Side effects: data fetch, subscriptions, DOM mutations after paint |
| `useContext` | Consume context without prop drilling |
| `useReducer` | Complex state logic / multiple related state fields |
| `useMemo` | Cache expensive computed values — recalculate only when deps change |
| `useCallback` | Cache function references — prevent unnecessary child re-renders |
| `useRef` | Mutable ref to DOM node or any value that persists without triggering re-render |
| `useLayoutEffect` | Like useEffect but fires sync after DOM update, before paint — use for DOM measurements |
| `useId` | Generate unique accessible IDs |
| `useTransition` | Mark state update as non-urgent (Concurrent) |
| `useDeferredValue` | Defer expensive re-renders |
| `useImperativeHandle` | Customize what a parent sees via `forwardRef` |

### Q: When does a component re-render?
1. Its own **state changes** (`useState`, `useReducer`)
2. Its **parent re-renders** (unless wrapped in `React.memo`)
3. Its **context value changes** (all `useContext` consumers re-render)
4. Its **props change** — referential equality matters: objects/arrays/functions are new references each render unless memoized

### Q: `useMemo` vs `useCallback` — what's the difference?
```js
// useMemo → caches the RESULT of calling the function
const filtered = useMemo(() => items.filter(x => x.active), [items]);

// useCallback → caches the FUNCTION ITSELF (its reference)
const handleClick = useCallback(() => doSomething(id), [id]);
```
Both prevent unnecessary work, but for different things.
`useCallback(fn, deps)` === `useMemo(() => fn, deps)` conceptually.

### Q: Why is `useEffect` cleanup important?
```js
useEffect(() => {
  const sub = api.subscribe(handler);
  return () => sub.unsubscribe(); // runs before next effect OR on unmount
}, [dep]);
```
Without cleanup: memory leaks — subscriptions, event listeners, and timers keep firing after the component is gone.

### Q: What are React Portals?
Render children into a DOM node **outside** the parent's DOM hierarchy, while keeping them in the React component tree (events still bubble up, context still works).
```js
ReactDOM.createPortal(child, document.getElementById('modal-root'))
```
Use case: modals, tooltips, dropdowns that must escape `overflow: hidden`.

### Q: What does `React.StrictMode` do?
Development-only. It:
- **Double-invokes** render and effects to surface side-effect bugs
- Warns on deprecated lifecycle usage
- Does **nothing** in production builds

### Q: Context API vs Redux — when to use which?
- **Context**: theme, locale, current user — infrequent updates, simple structure
- **Redux/Zustand**: complex update logic, many consumers, devtools / time-travel needed, or very frequent updates (Context re-renders all consumers on change)
- Context with frequent updates → split into multiple contexts or use `use-context-selector`

---

## Performance Optimization

### Q: How do you optimize a React app?
1. `React.memo` — skip re-render if props unchanged (referential equality)
2. `useMemo` / `useCallback` — stabilize values and function references
3. **Code splitting** — `React.lazy` + `Suspense` + dynamic `import()`
4. **Virtualization** — `react-window` for long lists (render only visible rows)
5. **Avoid inline objects/functions in JSX** — they create new references every render
6. **Stable keys** — never use array index as key for dynamic lists
7. **React DevTools Profiler** — find which components render too often and why
8. **Batching** — React 18 auto-batches all updates (even in async callbacks)

### Q: `useEffect` vs `useLayoutEffect`?
| | `useEffect` | `useLayoutEffect` |
|-|-------------|-------------------|
| Fires | After paint | After DOM update, before paint |
| Blocks paint? | No | Yes |
| Use for | Fetch, subscriptions | DOM measurements, scroll position, animations |

---

## JavaScript Fundamentals

### Q: Explain the Event Loop — microtasks vs macrotasks.
- **Macrotask queue**: `setTimeout`, `setInterval`, `setImmediate`, I/O
- **Microtask queue**: `Promise.then/catch`, `queueMicrotask`, `MutationObserver`
- **Order**: Call stack drains → ALL microtasks → ONE macrotask → ALL microtasks → repeat

```js
console.log('1');
setTimeout(() => console.log('4'), 0);
Promise.resolve().then(() => console.log('2')).then(() => console.log('3'));
// Output: 1, 2, 3, 4
```

### Q: Explain closures.
A function that **retains access to variables from its enclosing scope** even after that scope has returned.
```js
function makeCounter() {
  let count = 0;
  return () => ++count; // closes over `count`
}
const c = makeCounter();
c(); // 1
c(); // 2
```

### Q: `Promise.all` vs `allSettled` vs `race` vs `any`?
```js
Promise.all([...])        // resolves when ALL resolve; rejects on FIRST rejection
Promise.allSettled([...]) // waits for ALL; gives {status, value/reason} for each
Promise.race([...])       // resolves/rejects with FIRST settled (either way)
Promise.any([...])        // resolves with FIRST fulfilled; rejects only if ALL reject
```

### Q: Explain `this` in JavaScript.
- Regular function: `this` = whoever called it (or `undefined` in strict mode)
- Arrow function: `this` = **lexical** — inherited from where it was defined
- Class method: `this` = instance (unless detached from object)
- Explicit binding: `fn.call(ctx)`, `fn.apply(ctx)`, `fn.bind(ctx)`

### Q: What is `WeakMap` and when would you use it?
`WeakMap` keys must be objects and are **weakly held** — the GC can collect them if no other reference exists. No memory leaks.
Use case: storing metadata about DOM nodes or objects without preventing cleanup.
```js
const cache = new WeakMap();
function process(node) {
  if (cache.has(node)) return cache.get(node);
  const result = expensiveOp(node);
  cache.set(node, result);
  return result;
}
```

---

## CSS & Browser

### Q: Explain the Critical Rendering Path.
1. Parse HTML → **DOM**
2. Parse CSS → **CSSOM**
3. Combine → **Render Tree**
4. **Layout** (reflow) — compute positions and sizes
5. **Paint** — fill pixels
6. **Composite** — layer stacking

Optimizations: minimize render-blocking CSS/JS, use `async`/`defer` for scripts, avoid forced reflows in JS.

### Q: CSS Specificity order?
Inline styles (1000) > ID (100) > Class/pseudo-class/attribute (10) > Element/pseudo-element (1)

### Q: Browser storage comparison?
| | localStorage | sessionStorage | Cookies | IndexedDB |
|-|-------------|---------------|---------|-----------|
| Capacity | ~5MB | ~5MB | ~4KB | Unlimited |
| Persists past tab close? | Yes | No | Configurable | Yes |
| Sent to server? | No | No | Yes (auto) | No |
| Async? | No | No | No | Yes |

### Q: What is CORS and how does it work?
Browser security mechanism preventing cross-origin requests unless the server allows them.
- Browser adds `Origin` header to cross-origin requests
- Server must respond with `Access-Control-Allow-Origin`
- **Preflight**: non-simple requests (PUT, DELETE, custom headers) trigger an OPTIONS request first
- Fix: configure CORS on the **server** side, not the client

---

## Architecture & System Design

### Q: [CONFIRMED NAB QUESTION] Why don't microservices share a single database?
- **Tight coupling**: schema change in one service breaks others
- **Single point of failure**: shared DB becomes bottleneck and SPOF
- **Can't scale independently**: services needing different DB characteristics are forced into one
- **Team autonomy**: teams can choose best storage per domain (PostgreSQL vs MongoDB vs Redis)
- **Domain ownership**: each service owns its data, enforcing bounded context
- **Tradeoffs**: introduces eventual consistency, distributed transactions (saga pattern), and API calls between services — complexity you must acknowledge

### Q: How would you architect a large React application?
1. **State**: local → Context → Zustand/Redux (match complexity)
2. **Routing**: React Router v6 with lazy-loaded routes per feature
3. **Data fetching**: React Query or SWR (cache, dedup, background refetch, optimistic updates)
4. **Code splitting**: route-level + component-level lazy loading
5. **Folder structure**: feature-based (not layer-based)
6. **Design system**: shared component library + Storybook
7. **Testing**: Vitest (unit), React Testing Library (integration), Playwright (E2E)

### Q: What is micro-frontend architecture?
Split a frontend into independently deployable apps, one per team or domain.
Integration options: iframes, Web Components, **Module Federation** (Webpack 5 / Vite).
Tradeoffs: independent deployments vs shared state complexity, bundle duplication, and consistency challenges.

---

## React Hooks — Deep Dives (Gap Topics)

### Q: What is a stale closure in useEffect, and how do you fix it?

A stale closure occurs when a function in `useEffect` captures a variable from its outer scope at creation time, and that variable later changes — but the function still holds the old value.

**Classic example:**
```js
// ❌ BUG — count is always 0 inside the interval
useEffect(() => {
  const id = setInterval(() => {
    console.log(count); // always 0 — stale closure
    setCount(count + 1);
  }, 1000);
  return () => clearInterval(id);
}, []); // empty deps → callback created once, captures count=0 forever
```

**Fix 1 — Functional updater** (for state that only needs its own previous value):
```js
setCount(c => c + 1); // doesn't read count from closure
```

**Fix 2 — useRef** (general fix for any value, not just state):
```js
const countRef = useRef(count);
useEffect(() => { countRef.current = count; }, [count]); // keep ref in sync

useEffect(() => {
  const id = setInterval(() => {
    console.log(countRef.current); // always fresh
  }, 1000);
  return () => clearInterval(id);
}, []); // safe — reads from ref, not closure
```

---

### Q: Why can't useEffect take an async function directly?

```js
// ❌ WRONG
useEffect(async () => {
  const data = await fetch('/api');
}, []);
```

`useEffect` expects its callback to return either `undefined` or a cleanup function. An `async` function always returns a `Promise` — React sees a Promise where it expects a function (or nothing) and the cleanup is silently ignored, potentially causing memory leaks.

**Correct pattern:**
```js
useEffect(() => {
  let cancelled = false;

  async function fetchData() {
    const res = await fetch('/api/data');
    const json = await res.json();
    if (!cancelled) setData(json); // guard against unmounted component
  }

  fetchData();
  return () => { cancelled = true; }; // cleanup
}, []);
```

Or use AbortController (cleaner for fetch specifically — see lc01).

---

### Q: Why does useEffect run twice in development?

In `React.StrictMode`, React deliberately mounts → unmounts → remounts every component in development to help you catch side effects that aren't properly cleaned up.

This means `useEffect` runs twice in dev but **only once in production**. If your code breaks on the double run (e.g., a subscription registered twice), it means your cleanup function is missing or incomplete.

**What to look for:** if the second run causes different behaviour than the first, your effect has a bug.

---

### Q: What is useRef and when do you use it instead of useState?

`useRef` returns a mutable object `{ current: value }` that **persists across renders** but **does not trigger a re-render when changed**.

**Use useRef when:**
- Accessing a DOM node (`<input ref={myRef} />`)
- Storing the previous value of a prop/state for comparison
- Storing interval IDs, timers, or subscription handles (re-rendering would kill them)
- Fixing stale closures (store the latest version of a callback)

**Use useState when:** the UI needs to reflect the value — a change should cause a re-render.

```js
// useRef — interval ID doesn't need to be displayed
const intervalRef = useRef(null);
intervalRef.current = setInterval(tick, 1000);

// vs useState — would cause a re-render on every setIntervalId() call (wasteful)
const [intervalId, setIntervalId] = useState(null); // don't do this for IDs
```

---

### Q: What is useImperativeHandle and when would you use it?

Used with `forwardRef`. Instead of exposing the entire DOM node to the parent via a ref, you expose a **controlled, limited API**.

```jsx
const TextInput = forwardRef((props, ref) => {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus(),
    clear: () => { inputRef.current.value = ''; },
    getValue: () => inputRef.current.value,
    // parent cannot access .style, .setAttribute, etc. — encapsulated
  }));

  return <input ref={inputRef} {...props} />;
});
```

**When to use:** in design system components (inputs, modals, sliders) where the parent needs programmatic control but shouldn't reach into the DOM directly.

---

### Q: What do useTransition and useDeferredValue do? (React 18 Concurrent)

Both allow React to prioritize urgent updates over expensive ones.

**useTransition:** marks a state update as non-urgent. React keeps the old UI visible while the new state is computing.
```js
const [isPending, startTransition] = useTransition();

startTransition(() => {
  setSearchResults(compute(bigDataset)); // expensive — not urgent
});
// isPending = true while computing → show spinner
```

**useDeferredValue:** defers re-rendering a specific value. Useful when you don't control the state update (e.g., props from a parent).
```js
const deferredQuery = useDeferredValue(query); // query updates immediately; deferredQuery lags behind
const results = useMemo(() => filter(data, deferredQuery), [deferredQuery]);
```

**Key difference:**
- `useTransition` wraps the setter call (you own the state update)
- `useDeferredValue` wraps the value (you receive it from outside)

---

### Q: What do Error Boundaries catch and NOT catch?

**Catches (during React's render lifecycle):**
- Errors thrown during render (`throw new Error(...)` inside JSX)
- Errors in lifecycle methods (`componentDidMount`, `getDerivedStateFromProps`)
- Errors in constructors of child components

**Does NOT catch:**
- Async errors (`setTimeout`, `fetch`, Promises)
- Errors in event handlers (use try/catch + setState manually)
- Errors in the Error Boundary component itself
- Server-side rendering errors

**Must be a class component** — no hooks equivalent exists (React 19 adds `use()` but class boundaries remain the standard pattern).

```jsx
class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true }; // triggers fallback render
  }

  componentDidCatch(error, info) {
    logToService(error, info.componentStack); // side effects here
  }

  render() {
    if (this.state.hasError) return this.props.fallback ?? <h2>Something went wrong.</h2>;
    return this.props.children;
  }
}
```

---

### Q: What are the Rules of Hooks and why do they exist?

**Rule 1: Only call hooks at the top level** — never inside conditionals, loops, or nested functions.
**Rule 2: Only call hooks from React functions** — function components or custom hooks. Not regular JS functions.

**Why:** React tracks hooks by call order. On every render, React expects the same hooks to be called in the same order, so it can match each hook to its stored state. A conditional hook would shift the order, corrupting the state map.

```js
// ❌ Breaks the rules
if (condition) {
  const [x, setX] = useState(0); // hook count changes between renders
}

// ✅ Correct — condition inside the hook
const [x, setX] = useState(0);
if (condition) { setX(1); }
```

---

### Q: Custom hooks — does each call share state or have its own?

**Each call to a custom hook gets completely isolated state.** Custom hooks share logic, not state.

```js
function useCounter() {
  const [count, setCount] = useState(0);
  return { count, increment: () => setCount(c => c + 1) };
}

function App() {
  const a = useCounter(); // a.count = 0, independent
  const b = useCounter(); // b.count = 0, independent — NOT shared with a
}
```

To share state across components, you need a shared store (Context, Zustand, Redux) or lift state up to a common ancestor.

---

### Q: React.memo — what does it compare and when does it still re-render?

`React.memo` wraps a function component and does a **shallow comparison** of props between renders. If all props are referentially equal, it skips re-rendering.

**Shallow comparison means:** for primitives (string, number, bool), it compares values. For objects and arrays, it compares **references**, not content.

```js
const Child = React.memo(({ user, onClick }) => { ... });

// Parent:
<Child user={{ id: 1 }} onClick={() => handleClick()} />
// ❌ STILL re-renders every time — new {} object and new () => {} arrow fn each render

<Child user={stableUser} onClick={memoizedClick} />
// ✅ Skips re-render — same references
```

**Still re-renders if:**
- Any prop is a new object/array/function reference (even with the same content)
- The component uses `useContext` — context bypasses memo
- You call `forceUpdate()`

**Custom comparator:** `React.memo(Component, (prevProps, nextProps) => prevProps.id === nextProps.id)` — return `true` to skip re-render.

---

### Q: Code splitting with React.lazy + Suspense

```jsx
// Without code splitting — everything bundled upfront
import HeavyChart from './HeavyChart';

// With code splitting — HeavyChart loaded only when rendered
const HeavyChart = React.lazy(() => import('./HeavyChart'));

function Dashboard() {
  return (
    <Suspense fallback={<Spinner />}>
      <HeavyChart /> {/* downloaded only now */}
    </Suspense>
  );
}
```

**How it works:** `React.lazy` takes a function returning a dynamic `import()`. When React renders the lazy component for the first time, it triggers the import, suspends (shows the fallback), and resumes when the chunk loads.

**Best practice:** lazy-load at the **route level** first (biggest wins), then at the component level for heavy things (charts, editors, modals not shown on first paint).

