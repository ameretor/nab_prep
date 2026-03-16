# Arrow Functions

## Syntax

```javascript
// Regular function
function add(a, b) { return a + b; }

// Arrow function — full form
const add = (a, b) => { return a + b; };

// Arrow function — implicit return (no braces, expression only)
const add = (a, b) => a + b;

// Single parameter — parens optional
const double = x => x * 2;

// No parameters — parens required
const greet = () => 'hello';

// Returning an object literal — wrap in parens (else { } looks like a block)
const makeUser = (name) => ({ name, active: true });
```

---

## The Core Difference: Lexical `this`

Regular functions define their own `this` based on **how they are called**.
Arrow functions have **no own `this`** — they inherit `this` from their enclosing lexical scope.

```javascript
// ── Regular function: `this` is dynamic ──────────────────
const obj = {
  name: 'Alice',
  greet: function() {
    console.log(this.name); // 'Alice' — `this` = obj (called as method)
  }
};
obj.greet(); // 'Alice'

// ── Arrow function: `this` is lexical ────────────────────
const obj = {
  name: 'Alice',
  greet: () => {
    console.log(this.name); // undefined — `this` = outer scope (window/global), NOT obj
  }
};
obj.greet(); // undefined (or throws in strict mode)
```

### Where arrows HELP: callbacks inside methods

```javascript
function Timer() {
  this.seconds = 0;

  // Problem with regular function:
  setInterval(function() {
    this.seconds++; // `this` is window/undefined here — BROKEN
  }, 1000);

  // Fixed with arrow function:
  setInterval(() => {
    this.seconds++; // `this` is inherited from Timer — CORRECT
  }, 1000);
}
```

### The `this` inheritance chain

```javascript
const obj = {
  name: 'Alice',
  outer: function() {        // regular: this = obj ✓
    const inner = () => {    // arrow: inherits this from outer → obj ✓
      console.log(this.name); // 'Alice'
    };
    inner();
  }
};
obj.outer();
```

---

## When NOT to Use Arrow Functions

### 1. Object methods (if you need `this`)

```javascript
// Bad
const counter = {
  count: 0,
  increment: () => { this.count++; } // `this` is NOT the counter object
};

// Good
const counter = {
  count: 0,
  increment() { this.count++; } // shorthand method — `this` = counter
};
```

### 2. Constructor functions

```javascript
// Arrow functions cannot be used with `new`
const Person = (name) => { this.name = name; };
new Person('Alice'); // TypeError: Person is not a constructor
```

### 3. Event handlers (when you need `this` = the element)

```javascript
// Bad — `this` inside arrow is NOT the button element
button.addEventListener('click', () => {
  console.log(this); // window, not the button
});

// Good
button.addEventListener('click', function() {
  console.log(this); // the button element
});
```

### 4. `arguments` object

Arrow functions don't have their own `arguments` object.

```javascript
function regular() {
  console.log(arguments); // Arguments [1, 2, 3]
}
regular(1, 2, 3);

const arrow = () => {
  console.log(arguments); // ReferenceError (or outer scope's arguments)
};
arrow(1, 2, 3);

// Use rest params instead:
const arrow = (...args) => {
  console.log(args); // [1, 2, 3]
};
```

### 5. Prototype methods

```javascript
function Person(name) { this.name = name; }

// Bad — `this` in arrow doesn't bind to the instance
Person.prototype.greet = () => console.log(this.name); // undefined

// Good
Person.prototype.greet = function() { console.log(this.name); };
```

---

## Summary Table

| Feature | Regular function | Arrow function |
|---------|-----------------|----------------|
| Own `this` | Yes (dynamic) | No (inherits lexically) |
| `arguments` object | Yes | No |
| Can use `new` | Yes | No |
| Best for | Methods, constructors, event handlers | Callbacks, short expressions |

---

## Interview Answer

> "Arrow functions are syntactically shorter and have lexical `this` — they don't create their own `this` binding, instead inheriting it from the enclosing scope. This makes them ideal for callbacks inside methods. But you shouldn't use them as object methods, constructors, or event handlers where you need `this` to refer to the calling context."
