# JavaScript Foundation — Theory & Interview Prep

## 1. Event Loop

### The Model (know this cold)

JavaScript is **single-threaded** — one call stack. The event loop enables non-blocking I/O despite this.

```
┌─────────────────────────┐
│         Call Stack       │  ← synchronous code runs here
└─────────────────────────┘
         ↓ when empty
┌─────────────────────────┐
│    Microtask Queue       │  ← Promises (.then), queueMicrotask, MutationObserver
└─────────────────────────┘
         ↓ when empty
┌─────────────────────────┐
│    Macrotask Queue       │  ← setTimeout, setInterval, I/O, UI events
└─────────────────────────┘
```

**Order of execution:**
1. Run all synchronous code (clear the call stack)
2. Run ALL microtasks (microtask queue drains completely before the next macrotask)
3. Run ONE macrotask
4. Run ALL microtasks again
5. Repeat

**Classic interview question — what prints?**
```js
console.log('1');

setTimeout(() => console.log('2'), 0);

Promise.resolve().then(() => console.log('3'));

console.log('4');
```
Answer: `1, 4, 3, 2`
- 1, 4 → sync
- 3 → microtask (Promise.then)
- 2 → macrotask (setTimeout)

---

## 2. Closures

**Definition:** A closure is a function that "closes over" variables from its outer scope — the inner function retains a reference to those variables even after the outer function has returned.

```js
function makeCounter() {
  let count = 0;                    // outer variable
  return function increment() {
    count++;                        // closes over count
    return count;
  };
}

const counter = makeCounter();
counter(); // 1
counter(); // 2
```

### Stale Closure (the interview trap)

```js
// BUG — classic stale closure
function setup() {
  let count = 0;
  setInterval(function() {
    console.log(count);  // always prints 0 if count is captured at setup time
  }, 1000);
  count = 10;            // this update may not be seen
}
```

In React: `useEffect` with stale state — fix with `useRef` or functional updater.

```js
// Fix 1: useRef
const countRef = useRef(0);
setInterval(() => {
  console.log(countRef.current); // always fresh
}, 1000);

// Fix 2: functional updater (doesn't need the value, just transforms it)
setCount(prev => prev + 1);
```

---

## 3. `this` Binding

| Context | `this` value |
|---------|-------------|
| Global scope | `window` (browser) / `global` (Node) / `undefined` (strict mode) |
| Method call `obj.fn()` | `obj` |
| `new Foo()` | The newly created object |
| `fn.call(ctx)` / `.apply(ctx)` / `.bind(ctx)` | `ctx` |
| Arrow function | Lexically inherits `this` from enclosing scope — **never has its own** |

**Key rule: Arrow functions do not have their own `this`.**

```js
const obj = {
  name: 'NAB',
  greet: function() {
    setTimeout(function() {
      console.log(this.name); // undefined — `this` lost in callback
    }, 100);
    setTimeout(() => {
      console.log(this.name); // 'NAB' — arrow inherits `this` from greet
    }, 100);
  }
};
```

---

## 4. Prototypal Inheritance

- Every object has a `[[Prototype]]` link (accessible via `Object.getPrototypeOf()` or `__proto__`)
- Property lookup walks the prototype chain
- `class` syntax is sugar over prototype chains

```js
function Animal(name) { this.name = name; }
Animal.prototype.speak = function() { return `${this.name} makes a sound.`; };

function Dog(name) { Animal.call(this, name); }
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;
Dog.prototype.bark = function() { return 'Woof!'; };
```

---

## 5. Promises & Async/Await

### Promise combinators (know the differences)

| Method | Behavior | When to use |
|--------|---------|-------------|
| `Promise.all([...])` | Resolves when ALL resolve; rejects if ANY reject | Parallel fetches that all must succeed |
| `Promise.allSettled([...])` | Waits for ALL to settle (resolve or reject) | When you need all results regardless of failure |
| `Promise.race([...])` | Resolves/rejects with the FIRST to settle | Timeout pattern, fastest server |
| `Promise.any([...])` | Resolves with FIRST success; rejects if ALL fail | Fallback sources |

**Classic interview: implement a timeout wrapper**
```js
function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Timeout')), ms)
  );
  return Promise.race([promise, timeout]);
}
```

---

## 6. var vs let vs const

| | `var` | `let` | `const` |
|-|-------|-------|---------|
| Scope | Function-scoped | Block-scoped | Block-scoped |
| Hoisted | Yes (as `undefined`) | Yes (TDZ — uninitialized) | Yes (TDZ) |
| Re-declare | Yes | No | No |
| Re-assign | Yes | Yes | No |

**TDZ (Temporal Dead Zone):** accessing `let`/`const` before declaration throws `ReferenceError`.

---

## 7. Debounce vs Throttle

| | Debounce | Throttle |
|-|----------|----------|
| Behaviour | Runs AFTER inactivity (delays until N ms of silence) | Runs AT MOST once per N ms |
| Use case | Search input, form validation | Scroll handler, resize handler, game loop |

```js
// Debounce
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Throttle (timestamp approach — from your lc02 practice)
function throttle(fn, limit) {
  let lastRun = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastRun >= limit) {
      lastRun = now;
      fn.apply(this, args);
    }
  };
}
```

---

## 8. WeakMap / WeakSet

- Keys must be objects (not primitives)
- **Weakly held** — if the object key has no other references, it can be garbage collected
- Not iterable (no `.forEach`, no `for...of`)

**Use cases:**
- Storing metadata about DOM nodes without preventing GC
- Private data for class instances
- Memoization caches that auto-clean

```js
const cache = new WeakMap();
function getMetadata(element) {
  if (!cache.has(element)) {
    cache.set(element, computeExpensive(element));
  }
  return cache.get(element);
}
// When `element` is removed from the DOM and dereferenced, cache entry is GC'd automatically
```

---

## 9. == vs === (Type Coercion)

- `===` checks value AND type — no coercion
- `==` performs type coercion before comparison

```js
0 == false     // true (false → 0)
'' == false    // true
null == undefined  // true (special case)
null === undefined // false
NaN == NaN     // false (NaN is never equal to anything)
```

**NAB answer:** "Always use `===`. `==` produces subtle bugs — `null == undefined` being `true` surprises most people. The only place `==` is acceptable is `x == null` to check for both `null` and `undefined` at once."

---

## 10. ES6+ You Must Know

```js
// Destructuring
const { a, b: renamed, c = 'default' } = obj;
const [first, , third] = arr;

// Spread / Rest
const merged = { ...obj1, ...obj2 };
function sum(...nums) { return nums.reduce((a, b) => a + b, 0); }

// Optional chaining + nullish coalescing
const name = user?.profile?.name ?? 'Anonymous';

// Array methods
arr.flatMap(fn)   // map + flatten one level
arr.flat(depth)   // flatten nested arrays
Object.entries(obj).map(([k, v]) => ...)

// Generators (bonus — rarely tested but impressive)
function* range(start, end) {
  for (let i = start; i < end; i++) yield i;
}
```

---

## Key Interview Answer: Event Loop (model answer for NAB)

> "JavaScript is single-threaded — it has one call stack. The event loop is what allows it to handle async operations without blocking. When async work completes (a setTimeout fires, a fetch resolves), its callback is added to a task queue. The event loop picks it up only when the call stack is empty.
>
> There are two queues: the microtask queue (Promises, queueMicrotask) and the macrotask queue (setTimeout, setInterval). Microtasks always drain completely before the next macrotask runs. So if you have Promise.then and setTimeout both ready, the Promise callback runs first."
