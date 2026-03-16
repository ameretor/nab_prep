# Map and Set

---

## Set — Unique Values

A `Set` holds **unique values**. Duplicates are automatically removed.

### Basic usage

```javascript
const set = new Set([1, 2, 3, 2, 1]);
console.log(set); // Set {1, 2, 3} — duplicates removed

set.add(4);       // Set {1, 2, 3, 4}
set.add(2);       // no change — 2 already in set
set.delete(1);    // removes 1
set.has(3);       // true
set.size;         // 3 (not .length)
set.clear();      // removes all
```

### Iteration

```javascript
const set = new Set(['a', 'b', 'c']);

for (const val of set) { console.log(val); } // a, b, c (insertion order)

set.forEach(val => console.log(val));

// Spread to array
const arr = [...set]; // ['a', 'b', 'c']
Array.from(set);      // same thing
```

### Primary use case: Deduplicate an array

```javascript
const arr = [1, 2, 2, 3, 3, 3];
const unique = [...new Set(arr)]; // [1, 2, 3]
```

### Set operations (no built-in methods, use spread)

```javascript
const a = new Set([1, 2, 3]);
const b = new Set([2, 3, 4]);

// Union
const union        = new Set([...a, ...b]);     // {1, 2, 3, 4}

// Intersection
const intersection = new Set([...a].filter(x => b.has(x))); // {2, 3}

// Difference (a - b)
const difference   = new Set([...a].filter(x => !b.has(x))); // {1}
```

### Set vs Array

| | Set | Array |
|---|---|---|
| Values | Unique | Can repeat |
| `has()` | O(1) | O(n) — use includes() |
| Ordered | Insertion order | Index order |
| Use when | Membership check, deduplication | Ordered collection, index access |

---

## Map — Key-Value Pairs with Any Key Type

A `Map` stores key-value pairs like a plain object, but with important differences.

### Basic usage

```javascript
const map = new Map();

map.set('name', 'Alice');
map.set(42, 'the answer');
map.set(true, 'yes');
map.set({ id: 1 }, 'user object as key'); // objects CAN be keys

map.get('name');  // 'Alice'
map.get(42);      // 'the answer'
map.has('name');  // true
map.delete('name');
map.size;         // number of entries (not .length)
map.clear();
```

### Initialize from array of pairs

```javascript
const map = new Map([
  ['a', 1],
  ['b', 2],
  ['c', 3],
]);
map.get('b'); // 2
```

### Iteration

```javascript
const map = new Map([['x', 10], ['y', 20]]);

for (const [key, value] of map) {
  console.log(key, value); // x 10 / y 20
}

map.forEach((value, key) => console.log(key, value));
// Note: forEach callback is (value, key) — reversed from for...of!

[...map.keys()];    // ['x', 'y']
[...map.values()];  // [10, 20]
[...map.entries()]; // [['x', 10], ['y', 20]]
```

---

## Map vs Object — The Critical Differences

This is a common interview question.

| | Map | Object |
|---|---|---|
| Key types | **Any type** (objects, functions, primitives) | Strings and Symbols only |
| Key order | **Insertion order guaranteed** | Mostly insertion order (but tricky with integer keys) |
| Size | `map.size` | `Object.keys(obj).length` |
| Default keys | None | Has prototype keys (`toString`, `hasOwnProperty`...) |
| JSON support | No native `JSON.stringify` | Yes |
| Iteration | Directly iterable with `for...of` | Need `Object.keys/values/entries()` |
| Performance | Faster for frequent add/delete | Faster for known static structure |

### The key type gotcha with objects

```javascript
const obj = {};
obj[{a: 1}] = 'value1';
obj[{b: 2}] = 'value2';

console.log(obj); // { '[object Object]': 'value2' }
// Both object keys stringify to '[object Object]' — second overwrites first!

// Map doesn't have this problem:
const map = new Map();
const key1 = {a: 1};
const key2 = {b: 2};
map.set(key1, 'value1');
map.set(key2, 'value2');
map.size; // 2 — different objects, different keys
```

### When to use Map vs Object

```javascript
// Use Object when:
const config = { port: 3000, host: 'localhost' }; // static known structure, JSON

// Use Map when:
// — keys are computed at runtime
const wordCount = new Map();
words.forEach(w => wordCount.set(w, (wordCount.get(w) ?? 0) + 1));

// — keys are not strings
const elementData = new Map(); // use DOM elements as keys
elementData.set(buttonEl, { clicks: 0 });

// — you need insertion-order iteration
// — you need to frequently add/remove keys
```

---

## WeakMap and WeakSet (Brief)

- **WeakMap** — keys must be objects; held weakly (no GC prevention)
- **WeakSet** — values must be objects; held weakly
- Not iterable — no `.forEach`, no spread, no `.size`
- Use case: attaching private data to DOM nodes without memory leaks

```javascript
const cache = new WeakMap();

function process(element) {
  if (cache.has(element)) return cache.get(element);
  const result = expensiveOperation(element);
  cache.set(element, result);
  return result;
}
// When `element` is removed from DOM and GC'd, cache entry is automatically removed
```

---

## Interview Answer

> "Set stores unique values and is ideal for deduplication and O(1) membership checks. Map is like an object but with any key type, guaranteed insertion order, and a `.size` property. The main Map vs Object distinction: Map supports non-string keys (objects, functions), while plain object keys are always coerced to strings — which silently overwrites when using objects as keys. Use Map when keys are dynamic or non-string."

---

## Quick Reference

```
Set
  new Set([...])        → create with initial values
  .add(v) .delete(v)    → mutate
  .has(v)               → O(1) check
  .size                 → count
  [...new Set(arr)]     → deduplicate array

Map
  new Map([[k,v], ...]) → create with initial pairs
  .set(k, v) .get(k)    → mutate and read
  .has(k) .delete(k)    → membership and removal
  .size                 → count
  for (const [k,v] of map) → iterate in insertion order
  any type as key       → including objects, no stringification
```
