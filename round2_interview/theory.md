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
