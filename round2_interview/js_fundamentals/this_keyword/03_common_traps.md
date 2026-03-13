# Common `this` Traps

These are the situations where `this` silently breaks and produces undefined or crashes.

---

## Trap 1 — Detaching a method from its object

```javascript
const user = {
  name: 'Nam',
  greet() {
    console.log(this.name);
  }
};

user.greet();          // 'Nam'   ✓

const fn = user.greet; // detached — just a function reference, no object attached
fn();                  // undefined ✗ — this = global
```

**Why:** `user.greet()` passes `user` as `this` implicitly. `fn()` has no object — default binding applies.

**Fix:**
```javascript
const fn = user.greet.bind(user); // lock `this` to user permanently
fn(); // 'Nam' ✓
```

---

## Trap 2 — Passing a method as a callback

```javascript
const user = {
  name: 'Nam',
  greet() {
    console.log(this.name);
  }
};

setTimeout(user.greet, 1000);       // undefined ✗ — setTimeout calls it alone
[1, 2, 3].forEach(user.greet);      // undefined ✗ — forEach calls it alone
button.addEventListener('click', user.greet); // undefined ✗
```

All three cases extract the function from the object. The object is left behind.

**Fix:**
```javascript
setTimeout(() => user.greet(), 1000);       // arrow wrapper — calls it ON user
setTimeout(user.greet.bind(user), 1000);    // bind — lock this permanently
```

---

## Trap 3 — Nested regular function inside a method

```javascript
const obj = {
  name: 'NAB',
  outer() {
    console.log(this.name); // 'NAB' ✓

    function inner() {
      console.log(this.name); // undefined ✗ — inner() called alone, default binding
    }
    inner();
  }
};

obj.outer();
```

**Fix:**
```javascript
outer() {
  const self = this;           // old pattern — save reference
  function inner() {
    console.log(self.name);    // 'NAB' ✓
  }

  // OR — modern pattern:
  const inner = () => {
    console.log(this.name);    // 'NAB' ✓ — arrow inherits outer's this
  };
}
```

---

## Trap 4 — Destructuring a method

```javascript
const { gree`t } = user; // same as: const greet = user.greet
greet();                 // undefined ✗ — detached from user
```

Same as Trap 1, just a different syntax. The result is the same — `this` is lost.

---

## Trap 5 — `this` in a class method used as event handler (React)

```javascript
class Counter extends React.Component {
  state = { count: 0 };

  increment() {
    // When React calls this as onClick handler, it calls it alone
    // `this` is undefined in strict mode (React classes run in strict mode)
    this.setState({ count: this.state.count + 1 }); // TypeError: Cannot read properties of undefined
  }

  render() {
    return <button onClick={this.increment}>+</button>; // passes the function alone
  }
}
```

**Fix: class field arrow function**
```javascript
increment = () => {
  this.setState({ count: this.state.count + 1 }); // ✓ always bound to instance
};
```

---

## Quick diagnosis checklist

When `this` is wrong, ask:

```
1. Is it called as obj.method()?   → this = obj          ✓
2. Is it called alone as fn()?     → this = global/undef  ✗ fix with bind or arrow
3. Is it passed as a callback?     → this = global/undef  ✗ fix with bind or arrow wrapper
4. Is it an arrow function?        → this = outer scope   check what outer scope is
5. Is it called with new?          → this = new object    ✓
```
