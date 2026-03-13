# ES6+ Essentials

## Destructuring, Spread, Rest

```javascript
// ── Object destructuring ──────────────────────────────
const { name, age } = user;
const { name: fullName = 'Anonymous', age = 0 } = user; // rename + default

// ── Array destructuring ───────────────────────────────
const [first, second, ...rest] = [1, 2, 3, 4]; // rest = [3, 4]

// Swap variables without temp
let [a, b] = [1, 2];
[a, b] = [b, a];

// ── Rest in object destructuring ─────────────────────
const { id, ...remainder } = obj; // remainder = everything except id

// ── Spread — merge/copy objects ───────────────────────
const merged = { ...defaults, ...overrides }; // last key wins
const copy = [...arr];                        // shallow array copy
```

---

## Optional Chaining `?.` and Nullish Coalescing `??`

```javascript
// ?. — short-circuits to undefined instead of throwing TypeError
const city = user?.address?.city;   // undefined if any part is null/undefined
const first = arr?.[0];             // safe array index access
const result = obj?.method?.();     // safe method call

// ?? — fallback ONLY for null/undefined (NOT for 0, '', false)
const count = value ?? 0;            // 0 only if value is null/undefined
const name  = value || 'default';    // fallback for ANY falsy value
```

### Critical gotcha — `??` vs `||`

```javascript
const score = 0;

score ?? 'no score';  // 0           ← correct: 0 is a valid score
score || 'no score';  // 'no score'  ← WRONG: 0 is falsy, gets replaced
```

**Rule of thumb:** Use `??` for "value not provided" checks. Use `||` for "falsy fallback" checks.

---

## Promise Methods — The Four

```javascript
const p1 = fetch('/api/users');
const p2 = fetch('/api/orders');
const p3 = Promise.reject(new Error('failed'));
```

| Method | Resolves when | Rejects when | Use case |
|--------|---------------|--------------|----------|
| `Promise.all([...])` | ALL fulfill | ANY rejects (immediately) | All-or-nothing (load all required data) |
| `Promise.allSettled([...])` | ALL settle (always resolves) | Never | Want every result, even failures |
| `Promise.race([...])` | First to settle (either way) | First to settle (either way) | Timeout pattern |
| `Promise.any([...])` | First to **fulfill** | ALL reject | Redundant sources, use fastest |

```javascript
// Promise.all — stops on first failure
try {
  const [users, orders] = await Promise.all([p1, p2]);
} catch (err) {
  // one failed — you don't know which one has a value
}

// Promise.allSettled — always get all results
const results = await Promise.allSettled([p1, p2, p3]);
results.forEach(r => {
  if (r.status === 'fulfilled') use(r.value);
  else                          log(r.reason);
});

// Promise.race — timeout pattern
const timeout = new Promise((_, reject) =>
  setTimeout(() => reject(new Error('Timeout')), 5000)
);
const data = await Promise.race([fetch('/api/data'), timeout]);

// Promise.any — try multiple sources, use first that works
const data = await Promise.any([
  fetch('https://cdn1.example.com/data'),
  fetch('https://cdn2.example.com/data'),
]);
```

---

## async/await Error Handling Patterns

```javascript
// ── Pattern 1: try/catch (most common) ──────────────────
async function fetchUser(id) {
  try {
    const res = await fetch(`/api/users/${id}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Failed:', err.message);
    return null; // graceful fallback
  }
}

// ── Pattern 2: .catch() on the awaited promise ──────────
const user = await fetchUser(1).catch(err => null);

// ── Pattern 3: Go-style tuple (clean for multiple awaits) ─
async function loadDashboard() {
  const [user,   err1] = await fetchUser().then(v => [v, null]).catch(e => [null, e]);
  const [orders, err2] = await fetchOrders().then(v => [v, null]).catch(e => [null, e]);

  if (err1) handleUserError(err1);
  if (err2) handleOrderError(err2);
  // both can fail independently
}

// ── Anti-pattern: unhandled rejection ───────────────────
async function bad() {
  const data = await fetch('/api').then(r => r.json()); // throws? crashes silently!
}
```

---

## Quick Reference Card

```
?? vs ||         → use ?? when 0 and '' are valid values
?.               → safe navigation, returns undefined instead of throwing
Promise.all      → fail-fast, all-or-nothing
Promise.allSettled → always resolves, inspect each result
Promise.race     → first to settle wins (good for timeouts)
Promise.any      → first to SUCCEED wins (good for fallbacks)
async/await      → always wrap in try/catch or .catch()
```
