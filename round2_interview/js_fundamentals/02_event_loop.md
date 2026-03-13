# Event Loop & Asynchronous JS

## The Three-Layer Execution Model

```
┌──────────────────┐
│   Call Stack     │  ← synchronous code runs here
└──────────────────┘
         ↑ drained first
┌──────────────────┐
│  Microtask Queue │  ← Promises (.then), queueMicrotask, MutationObserver
└──────────────────┘
         ↑ then one task picked
┌──────────────────┐
│  Macrotask Queue │  ← setTimeout, setInterval, I/O, setImmediate
└──────────────────┘
```

**Rule:** After each call stack task completes, **drain the entire microtask queue first**, then pick ONE macrotask, then drain microtasks again, repeat.

---

## Classic Question

```javascript
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');

// Output: 1, 4, 3, 2
```

**Step by step:**
1. `console.log('1')` → call stack → prints `1`
2. `setTimeout(...)` → schedules callback in **macrotask queue**
3. `Promise.resolve().then(...)` → schedules callback in **microtask queue**
4. `console.log('4')` → call stack → prints `4`
5. Call stack empty → drain microtasks → prints `3`
6. Pick next macrotask → prints `2`

---

## Harder Example (Senior Level)

```javascript
console.log('start');

setTimeout(() => console.log('timeout 1'), 0);

Promise.resolve()
  .then(() => {
    console.log('promise 1');
    setTimeout(() => console.log('timeout 2'), 0); // scheduled here!
  })
  .then(() => console.log('promise 2'));

console.log('end');

// Output: start, end, promise 1, promise 2, timeout 1, timeout 2
```

**Why does `timeout 2` come after `timeout 1`?**
`timeout 2` is only scheduled when `promise 1` runs — which is after `timeout 1` was already in the queue. So `timeout 1` gets picked up first.

---

## Interview Answer

> "Promises go to the microtask queue, setTimeout goes to the macrotask queue. After each synchronous task, the engine drains **all** microtasks before picking the next macrotask. So Promises always resolve before setTimeout, even if both are already queued."
