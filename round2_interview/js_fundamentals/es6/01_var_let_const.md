# var / let / const

## The Three Scopes

| | `var` | `let` | `const` |
|---|---|---|---|
| Scope | Function | Block | Block |
| Hoisted? | Yes (as `undefined`) | Yes (but TDZ) | Yes (but TDZ) |
| Re-declare same scope | Yes | No (error) | No (error) |
| Re-assign | Yes | Yes | No |
| Attached to `window`? | Yes (global) | No | No |

---

## Hoisting

JS moves **declarations** to the top of their scope before execution. Only the declaration is hoisted — not the assignment.

```javascript
console.log(x); // undefined  (not ReferenceError)
var x = 5;
console.log(x); // 5

// What JS actually does:
var x;           // hoisted declaration
console.log(x);  // undefined
x = 5;           // assignment stays in place
console.log(x);  // 5
```

### Functions are fully hoisted

```javascript
sayHi(); // "hi" — works because the whole function is hoisted

function sayHi() { console.log('hi'); }

// But function EXPRESSIONS are NOT:
greet(); // TypeError: greet is not a function
var greet = function() { console.log('hello'); };
// greet is hoisted as `undefined`, calling undefined() throws
```

---

## Temporal Dead Zone (TDZ)

`let` and `const` ARE hoisted, but they cannot be accessed before their declaration line. The period between the start of the scope and the declaration is called the **Temporal Dead Zone**.

```javascript
console.log(x); // ReferenceError: Cannot access 'x' before initialization
let x = 5;
```

```javascript
// Detailed example
{
  // TDZ for x starts here
  console.log(x); // ReferenceError ← x is in TDZ
  let x = 10;     // TDZ ends here — x is now initialized
  console.log(x); // 10
}
```

**Why TDZ exists:** Forces you to declare variables before using them. Makes code more predictable.

---

## Block Scope in Action

```javascript
// var — leaks out of blocks
if (true) {
  var a = 1;
}
console.log(a); // 1 — var escaped the if-block

// let/const — stay inside their block
if (true) {
  let b = 2;
  const c = 3;
}
console.log(b); // ReferenceError
console.log(c); // ReferenceError
```

### The loop problem (see also closures.md)

```javascript
// var: ONE shared i
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // 3, 3, 3
}

// let: fresh i per iteration
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // 0, 1, 2
}
```

---

## const — Immutable Binding, NOT Immutable Value

`const` prevents **re-assignment** of the variable binding. It does NOT freeze the value.

```javascript
const x = 5;
x = 10; // TypeError: Assignment to constant variable

const obj = { name: 'Alice' };
obj.name = 'Bob';  // Fine — mutating the object, not rebinding the variable
obj = {};          // TypeError — can't rebind

const arr = [1, 2];
arr.push(3);  // Fine — [1, 2, 3]
arr = [];     // TypeError
```

To truly freeze an object: `Object.freeze(obj)` — but only shallow.

---

## Global Scope Pollution

```javascript
var globalVar = 'I am on window';
console.log(window.globalVar); // 'I am on window'

let notGlobal = 'I am NOT on window';
console.log(window.notGlobal); // undefined
```

This matters for third-party script conflicts — `var` at top level pollutes `window`.

---

## Interview Answer

> "`var` is function-scoped and hoisted as `undefined`, which leads to bugs like the loop closure trap and accidental globals. `let` and `const` are block-scoped with TDZ — you get a ReferenceError instead of silent `undefined` if you access them too early. Use `const` by default, `let` when you need to reassign, and never use `var` in modern code."

---

## Quick Reference

```
var   → function scope, hoisted as undefined, re-declarable, attaches to window
let   → block scope, TDZ, re-assignable
const → block scope, TDZ, no re-assignment (but value is mutable)
TDZ   → let/const exist but throw if accessed before declaration line
```
