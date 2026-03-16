# Spread & Rest

Same `...` syntax, opposite purposes:
- **Rest** — collects multiple values **into** an array/object
- **Spread** — expands an array/object **out** into individual values

---

## Rest — Collecting

### In function parameters

```javascript
function sum(...numbers) {
  return numbers.reduce((acc, n) => acc + n, 0);
}
sum(1, 2, 3, 4); // 10 — numbers = [1, 2, 3, 4]

// Rest must be LAST parameter
function first(a, b, ...rest) {
  console.log(a);    // 1
  console.log(b);    // 2
  console.log(rest); // [3, 4, 5]
}
first(1, 2, 3, 4, 5);
```

### In destructuring (object)

```javascript
const { id, ...details } = { id: 1, name: 'Alice', role: 'admin' };
console.log(id);      // 1
console.log(details); // { name: 'Alice', role: 'admin' }
```

### In destructuring (array)

```javascript
const [first, second, ...remaining] = [10, 20, 30, 40, 50];
console.log(first);     // 10
console.log(remaining); // [30, 40, 50]
```

---

## Spread — Expanding

### Spread array into function call

```javascript
const nums = [3, 1, 4, 1, 5];
Math.max(...nums);    // 5  (same as Math.max(3, 1, 4, 1, 5))
Math.max(nums);       // NaN — Math.max doesn't accept an array
```

### Spread to copy / merge arrays

```javascript
const a = [1, 2, 3];
const b = [4, 5, 6];

const copy  = [...a];         // [1, 2, 3] — shallow copy
const merged = [...a, ...b];  // [1, 2, 3, 4, 5, 6]
const prepend = [0, ...a];    // [0, 1, 2, 3]
```

### Spread to copy / merge objects

```javascript
const defaults = { theme: 'light', lang: 'en', debug: false };
const overrides = { lang: 'vi', debug: true };

const config = { ...defaults, ...overrides };
// { theme: 'light', lang: 'vi', debug: true }
// later keys WIN — overrides.lang replaces defaults.lang
```

### Spread to add/override a single key (immutable update pattern)

```javascript
const user = { id: 1, name: 'Alice', role: 'user' };

// "change" role without mutating
const promoted = { ...user, role: 'admin' };
// { id: 1, name: 'Alice', role: 'admin' }

console.log(user.role);     // 'user' — original unchanged
console.log(promoted.role); // 'admin'
```

This is the core pattern in React state updates.

---

## Shallow Copy — The Critical Gotcha

Spread only copies **one level deep**. Nested objects/arrays are still shared by reference.

```javascript
const original = {
  name: 'Alice',
  address: { city: 'Hanoi' }  // nested object
};

const copy = { ...original };

copy.name = 'Bob';             // fine — primitives are truly copied
copy.address.city = 'HCMC';   // MUTATES original.address.city too!

console.log(original.name);         // 'Alice' ✓
console.log(original.address.city); // 'HCMC' ✗ — shared reference
```

**Fix for deep copy:** `structuredClone(obj)` (modern), `JSON.parse(JSON.stringify(obj))` (no functions/dates), or lodash `_.cloneDeep`.

---

## Spread with Strings and Iterables

Spread works on any iterable, not just arrays:

```javascript
const chars = [..."hello"]; // ['h', 'e', 'l', 'l', 'o']

const set = new Set([1, 2, 2, 3]);
const arr = [...set]; // [1, 2, 3] — Set to array

const map = new Map([['a', 1], ['b', 2]]);
const entries = [...map]; // [['a', 1], ['b', 2]]
```

---

## Rest vs `arguments`

Rest parameters are preferred over the old `arguments` object:

```javascript
// Old way — `arguments` is array-like but NOT a real array
function oldSum() {
  return Array.from(arguments).reduce((a, b) => a + b, 0);
}

// New way — rest params ARE a real array
function newSum(...nums) {
  return nums.reduce((a, b) => a + b, 0); // reduce directly, no conversion
}

// Arrow functions have NO `arguments` at all — must use rest
const arrowSum = (...nums) => nums.reduce((a, b) => a + b, 0);
```

---

## Interview Answer

> "Rest and spread use the same `...` syntax but in opposite directions. Rest collects remaining values into an array — used in function parameters and destructuring. Spread expands iterables into individual values — used for copying arrays/objects, merging, and passing array elements as function arguments. The key gotcha with spread is that it's a shallow copy, so nested objects share the same reference."

---

## Quick Reference

```
Rest    → collects INTO array/object    → function f(...args) / const { a, ...rest }
Spread  → expands OUT of array/object   → f(...arr) / [...a, ...b] / { ...obj, key }
Shallow → spread copies 1 level only   → nested objects still shared
Order   → in objects, later keys win    → { ...defaults, ...overrides }
```
