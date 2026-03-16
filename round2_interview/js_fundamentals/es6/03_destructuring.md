# Destructuring

Destructuring extracts values from arrays or objects into named variables in a single statement.

---

## Object Destructuring

### Basic

```javascript
const user = { name: 'Alice', age: 30, city: 'Hanoi' };

const { name, age } = user;
console.log(name); // 'Alice'
console.log(age);  // 30
// `city` is ignored — you only extract what you name
```

### Rename (alias)

```javascript
const { name: fullName, age: years } = user;
console.log(fullName); // 'Alice'
console.log(name);     // ReferenceError — `name` was renamed, not kept
```

### Default values

```javascript
const { name, role = 'user' } = user;
// role = 'user' only if user.role is undefined (NOT if it's null or '')
console.log(role); // 'user' — because user has no `role` property
```

### Rename + default

```javascript
const { name: fullName = 'Anonymous' } = user;
```

### Nested

```javascript
const user = {
  name: 'Alice',
  address: {
    city: 'Hanoi',
    zip: '10000'
  }
};

const { address: { city, zip } } = user;
console.log(city); // 'Hanoi'
console.log(address); // ReferenceError — `address` itself is not bound
```

### Rest

```javascript
const { id, ...rest } = { id: 1, name: 'Alice', role: 'admin' };
console.log(id);   // 1
console.log(rest); // { name: 'Alice', role: 'admin' }
```

---

## Array Destructuring

### Basic

```javascript
const [first, second, third] = [10, 20, 30];
console.log(first);  // 10
console.log(second); // 20
```

### Skip elements

```javascript
const [, second, , fourth] = [1, 2, 3, 4];
console.log(second); // 2
console.log(fourth); // 4
```

### Default values

```javascript
const [a = 0, b = 0] = [5];
console.log(a); // 5
console.log(b); // 0 — array[1] is undefined, default kicks in
```

### Rest

```javascript
const [head, ...tail] = [1, 2, 3, 4];
console.log(head); // 1
console.log(tail); // [2, 3, 4]
```

### Swap variables (classic trick)

```javascript
let x = 1, y = 2;
[x, y] = [y, x];
console.log(x, y); // 2 1 — no temp variable needed
```

---

## In Function Parameters

### Destructure object argument

```javascript
// Instead of: function greet(user) { console.log(user.name) }
function greet({ name, role = 'user' }) {
  console.log(`${name} is a ${role}`);
}
greet({ name: 'Alice', role: 'admin' }); // "Alice is a admin"
greet({ name: 'Bob' });                  // "Bob is a user"
```

### Destructure array argument

```javascript
function getFirst([first]) {
  return first;
}
getFirst([10, 20, 30]); // 10
```

### Combined with defaults for the whole parameter

```javascript
function setup({ port = 3000, host = 'localhost' } = {}) {
  console.log(`${host}:${port}`);
}
setup();               // "localhost:3000" — the `= {}` avoids crash if nothing passed
setup({ port: 8080 }); // "localhost:8080"
```

---

## Destructuring in Loops

```javascript
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];

for (const { id, name } of users) {
  console.log(id, name);
}
// 1 'Alice'
// 2 'Bob'
```

---

## Common Gotchas

### Gotcha 1: Destructuring `null` or `undefined` throws

```javascript
const { name } = null;      // TypeError: Cannot destructure property 'name' of null
const { name } = undefined; // TypeError

// Guard:
const { name } = user ?? {};
```

### Gotcha 2: Default only triggers on `undefined`, not `null`

```javascript
const { role = 'user' } = { role: null };
console.log(role); // null — null is NOT undefined, default does NOT apply
```

### Gotcha 3: Gotcha with object shorthand in statement position

```javascript
let a, b;
{ a, b } = obj; // SyntaxError — { } at statement start is a block, not destructuring

// Fix: wrap in parens
({ a, b } = obj);
```

---

## Interview Answer

> "Destructuring is syntactic sugar for extracting values from objects or arrays into variables. It supports renaming, defaults, nesting, and rest — and composes naturally with function parameters. The main gotchas are: it throws on `null`/`undefined`, defaults only trigger on `undefined` (not `null`), and bare `{}` at statement position is a block not destructuring."
