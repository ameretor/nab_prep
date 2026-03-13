# What Is `this`?

`this` is a special keyword that refers to an **object** — but which object depends on
**how the function is called**, not where it is written.

This is the single most confusing thing about `this`. Location does not matter. Call site does.

---

## The simplest mental model

```javascript
// Think of `this` as an invisible argument passed to every function call.
// The value of that argument depends on how you call the function.

obj.method();   // `this` = obj      — you called it ON obj
method();       // `this` = global   — you called it alone
new Method();   // `this` = new obj  — you used new
method.call(x); // `this` = x       — you forced it
```

---

## Four rules, in priority order

### Rule 4 (lowest): Default binding — called alone

```javascript
function show() {
  console.log(this);
}

show(); // global object (window in browser, global in Node)
        // undefined in strict mode ('use strict')
```

### Rule 3: Implicit binding — called as a method

```javascript
const user = {
  name: 'Nam',
  greet() {
    console.log(this.name);
  }
};

user.greet(); // 'Nam' — this = user, because you called it ON user
```

**The trap — losing implicit binding:**

```javascript
const fn = user.greet; // just copying the function, not the object
fn();                  // this = global/undefined — no longer called ON user
```

The function is the same. But how it's called changed. So `this` changed.

```javascript
// Same trap in callbacks:
setTimeout(user.greet, 1000); // this = global — setTimeout calls it alone
```

### Rule 2: Explicit binding — call, apply, bind

You manually tell the function what `this` should be.

```javascript
function greet(greeting) {
  console.log(`${greeting}, ${this.name}`);
}

const user = { name: 'Nam' };

greet.call(user, 'Hello');      // Hello, Nam  — runs immediately, pass args one by one
greet.apply(user, ['Hello']);   // Hello, Nam  — runs immediately, pass args as array
const bound = greet.bind(user); // does NOT run — returns a new locked function
bound('Hi');                    // Hi, Nam
```

**When to use which:**
- `call`  — invoke now, you know the args
- `apply` — invoke now, args are already in an array
- `bind`  — save for later, or pass as a callback

### Rule 1 (highest): `new` binding — constructor call

```javascript
function Person(name) {
  // `this` here is a brand new empty object created by `new`
  this.name = name;
}

const p = new Person('Nam');
p.name; // 'Nam'
```

`new` does four things automatically:
1. Creates a new empty object
2. Sets `this` to that object
3. Runs the function body
4. Returns `this` (unless you return something else)

---

## Priority in action

```javascript
function identify() {
  return this.name;
}

const a = { name: 'A' };
const b = { name: 'B' };

identify.call(a);         // 'A' — explicit beats implicit
a.identify = identify;
a.identify();             // 'A' — implicit binding

const bound = identify.bind(a);
bound.call(b);            // 'A' — bind wins over call (explicit bind beats explicit call)
```
