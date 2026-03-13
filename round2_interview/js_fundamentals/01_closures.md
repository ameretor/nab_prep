# Closures

A closure is a function that **remembers its lexical scope** even when executed outside that scope.

## Basic Example

```javascript
function makeCounter() {
  let count = 0; // This variable is "closed over"
  return function() {
    count++;
    return count;
  };
}

const counter = makeCounter();
counter(); // 1
counter(); // 2
counter(); // 3
// `count` is private — nobody outside can access it directly
```

---

## The Classic `var` Trap

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // prints 3, 3, 3
}
```

**Why?** `var` is **function-scoped**, not block-scoped. There is only ONE `i` variable shared across all iterations. By the time setTimeout fires (100ms later), the loop has already finished and `i = 3`. All three arrow functions close over the **same** `i`.

### Fix 1: Use `let` (block scope)

```javascript
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 0, 1, 2
}
// Each iteration creates a NEW binding for `i`
```

### Fix 2: IIFE (immediately invoked function expression)

```javascript
for (var i = 0; i < 3; i++) {
  ((j) => {
    setTimeout(() => console.log(j), 100); // 0, 1, 2
  })(i); // captures current value of i as j
}
```

---

## Real Use Cases

- **Private variables** — module pattern, encapsulation
- **Memoization / caching** — remember expensive results
- **Event handlers** — remember context when callback fires
- **Partial application / currying** — lock in some arguments

---

## Interview Answer

> "A closure is a function bundled with its lexical environment. The inner function retains access to variables from its outer scope even after the outer function has returned. This is used for data privacy, memoization, and event handlers."
