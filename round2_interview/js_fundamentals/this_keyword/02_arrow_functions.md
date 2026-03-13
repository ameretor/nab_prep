# `this` in Arrow Functions

Arrow functions do **not** have their own `this`.
Instead they **inherit** `this` from the surrounding code where they were **defined**.

This is called **lexical `this`** — it follows the same rule as closures (lexical scope).

---

## Side by side comparison

```javascript
const obj = {
  name: 'NAB',

  regular: function() {
    console.log(this.name); // 'NAB' — this = obj (called as method)
  },

  arrow: () => {
    console.log(this.name); // undefined — arrow captures outer this = global/window
  }
};

obj.regular(); // 'NAB'
obj.arrow();   // undefined
```

**Why is `arrow`'s `this` the global object?**

The arrow function is defined inside the object literal. But object literals do not create
a new scope — only functions do. So the "surrounding scope" is the module/global scope,
where `this` is `window` (or `undefined` in strict mode).

---

## Where arrow functions shine — callbacks inside methods

```javascript
// Problem with regular function in a callback:
const timer = {
  seconds: 0,
  start() {
    setInterval(function() {
      this.seconds++; // BUG — `this` is global here, not timer
    }, 1000);
  }
};

// Fix with arrow function:
const timer = {
  seconds: 0,
  start() {
    setInterval(() => {
      this.seconds++; // WORKS — arrow captures `this` from start(), which is timer
    }, 1000);
  }
};
```

`start()` is called as `timer.start()`, so inside `start`, `this = timer`.
The arrow function inherits that — so `this` is still `timer` inside `setInterval`.

---

## The classic React class component pattern

Before hooks, this was one of the most common bugs:

```javascript
class Button extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  // Regular method — `this` depends on how it's called
  handleClick() {
    this.setState({ count: this.state.count + 1 }); // crashes if `this` is lost
  }

  render() {
    return (
      // When React calls onClick, it calls the function alone — `this` is lost!
      <button onClick={this.handleClick}>Click</button>
    );
  }
}
```

**Fix 1: bind in constructor**
```javascript
constructor(props) {
  super(props);
  this.handleClick = this.handleClick.bind(this); // lock `this` permanently
}
```

**Fix 2: class field arrow function (modern)**
```javascript
// Arrow function as class field — `this` is always the instance
handleClick = () => {
  this.setState({ count: this.state.count + 1 }); // always works
};
```

---

## When NOT to use arrow functions

```javascript
// Don't use arrow as an object method — `this` won't be the object
const obj = {
  name: 'NAB',
  greet: () => {
    console.log(this.name); // undefined — wrong!
  }
};

// Don't use arrow as a prototype method
Person.prototype.greet = () => {
  console.log(this.name); // undefined — wrong!
};

// Don't use arrow as a constructor
const Foo = () => {};
new Foo(); // TypeError: Foo is not a constructor
```

---

## Summary

| | Regular function | Arrow function |
|--|-----------------|----------------|
| Has own `this`? | Yes | No |
| `this` determined by | Call site | Where it was defined |
| Good for | Methods, constructors | Callbacks, inner functions |
| Can use as constructor? | Yes | No |
