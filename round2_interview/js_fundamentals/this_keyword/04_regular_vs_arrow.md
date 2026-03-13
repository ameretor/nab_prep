# Regular Function vs Arrow Function — Full Comparison

---

## 1. `this` binding (covered in previous files)

| | Regular | Arrow |
|--|---------|-------|
| Has own `this`? | Yes — determined by call site | No — inherited from outer scope |

---

## 2. `arguments` object

Regular functions have a built-in `arguments` object containing all passed arguments.
Arrow functions do not.

```javascript
function regular() {
  console.log(arguments); // Arguments [1, 2, 3]
}
regular(1, 2, 3);

const arrow = () => {
  console.log(arguments); // ReferenceError: arguments is not defined
};
arrow(1, 2, 3);
```

**Arrow function alternative — use rest params:**
```javascript
const arrow = (...args) => {
  console.log(args); // [1, 2, 3]
};
```

---

## 3. Can be used as a constructor

Regular functions can be called with `new`. Arrow functions cannot.

```javascript
function Person(name) {
  this.name = name;
}
const p = new Person('Nam'); // ✓

const PersonArrow = (name) => {
  this.name = name;
};
const p2 = new PersonArrow('Nam'); // TypeError: PersonArrow is not a constructor ✗
```

**Why?** `new` needs to create an object and assign it to `this`. Arrow functions have no `this`, so `new` has nothing to work with.

---

## 4. `prototype` property

Regular functions have a `prototype` property (used by `new` to set up the chain).
Arrow functions do not.

```javascript
function Foo() {}
console.log(Foo.prototype); // { constructor: Foo }

const Bar = () => {};
console.log(Bar.prototype); // undefined
```

---

## 5. Hoisting behavior

**Function declarations** are fully hoisted — you can call them before they are defined.

```javascript
greet(); // 'Hello' ✓ — works before the definition

function greet() {
  console.log('Hello');
}
```

**Arrow functions** are assigned to variables — only the variable is hoisted, not the value.

```javascript
greet(); // TypeError: greet is not a function ✗

const greet = () => {
  console.log('Hello');
};
```

`const greet` is in the temporal dead zone until the line runs — calling it before that crashes.

---

## 6. Implicit return (syntax difference)

Arrow functions can return a value without the `return` keyword if the body is a single expression.

```javascript
// Regular — always needs return
function double(x) {
  return x * 2;
}

// Arrow — implicit return (no braces, no return keyword)
const double = x => x * 2;

// Arrow — returning an object needs extra parentheses
const makeUser = name => ({ name, active: true });
//                        ↑ parens needed — otherwise {} looks like a function body
```

---

## 7. `new.target`

Inside a regular function called with `new`, `new.target` refers to the constructor.
Arrow functions do not have `new.target`.

```javascript
function Foo() {
  console.log(new.target); // Foo (when called with new)
}

const Bar = () => {
  console.log(new.target); // always undefined
};
```

Rarely used directly, but relevant in meta-programming and abstract class patterns.

---

## Full summary table

| Feature | Regular function | Arrow function |
|---------|-----------------|----------------|
| `this` | Own — determined by call site | Inherited from outer scope |
| `arguments` object | Yes | No — use `...rest` instead |
| Use as constructor (`new`) | Yes | No — TypeError |
| `prototype` property | Yes | No |
| Hoisting | Full (function declaration) | No (variable only) |
| Implicit return | No | Yes (single expression) |
| `new.target` | Yes | No |

---

## When to use which

```
Regular function:
  - Object methods (needs its own `this`)
  - Constructors
  - When you need `arguments`
  - When you need hoisting

Arrow function:
  - Callbacks and array methods (.map, .filter, .reduce)
  - Inner functions inside methods (to inherit `this`)
  - Short one-liner transformations
  - React functional components and hooks
```
