# Classes

ES6 classes are **syntactic sugar** over JavaScript's prototype-based inheritance. No new object model — just cleaner syntax.

---

## Basic Class

```javascript
class Animal {
  // constructor runs when you do `new Animal(...)`
  constructor(name, sound) {
    this.name = name;   // instance property
    this.sound = sound;
  }

  // Method — lives on Animal.prototype, shared across all instances
  speak() {
    return `${this.name} says ${this.sound}`;
  }

  // Getter
  get description() {
    return `I am ${this.name}`;
  }

  // Setter
  set nickname(value) {
    this.name = value.trim();
  }
}

const dog = new Animal('Rex', 'woof');
dog.speak();          // "Rex says woof"
dog.description;      // "I am Rex" — called without ()
dog.nickname = '  Buddy  '; // setter trims it
```

---

## Static Methods and Properties

Static members belong to the **class itself**, not instances.

```javascript
class MathUtils {
  static PI = 3.14159;

  static add(a, b) { return a + b; }
  static multiply(a, b) { return a * b; }
}

MathUtils.add(2, 3);    // 5 — called on the class
MathUtils.PI;           // 3.14159

const m = new MathUtils();
m.add(2, 3);    // TypeError — add is not on the instance
```

Use statics for: utility functions, factory methods, constants.

---

## Inheritance with `extends` and `super`

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return `${this.name} makes a noise.`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);        // MUST call super() before using `this`
    this.breed = breed; // can add new properties after super
  }

  speak() {            // override parent method
    return `${this.name} barks.`;
  }

  fullInfo() {
    return `${super.speak()} Breed: ${this.breed}`; // call parent method
  }
}

const dog = new Dog('Rex', 'Labrador');
dog.speak();    // "Rex barks."
dog.fullInfo(); // "Rex makes a noise. Breed: Labrador"

dog instanceof Dog;    // true
dog instanceof Animal; // true — inherits prototype chain
```

### Why `super()` must be first

Before `super()` is called, `this` doesn't exist in the subclass constructor. If you try to use `this` before `super()`, you get a ReferenceError.

```javascript
class Child extends Parent {
  constructor() {
    this.x = 1; // ReferenceError: Must call super constructor before accessing 'this'
    super();
  }
}
```

---

## Private Fields (ES2022)

Prefix with `#` to make a field truly private — not accessible outside the class.

```javascript
class BankAccount {
  #balance = 0;       // private field — only accessible inside the class
  #owner;

  constructor(owner, initial) {
    this.#owner = owner;
    this.#balance = initial;
  }

  deposit(amount) {
    if (amount <= 0) throw new Error('Invalid amount');
    this.#balance += amount;
  }

  get balance() {
    return this.#balance; // expose read-only via getter
  }
}

const account = new BankAccount('Alice', 100);
account.deposit(50);
account.balance;    // 150
account.#balance;   // SyntaxError — truly private, not just convention
```

Before private fields, the convention was `_balance` (underscore) — but that's just a naming hint, not enforced.

---

## Class Fields (Instance Properties Without Constructor)

```javascript
class User {
  // Defined at class level, initialized per instance
  role = 'user';
  isActive = true;

  constructor(name) {
    this.name = name;
    // role and isActive are already set — no need to assign here
  }
}

const u = new User('Alice');
u.role;     // 'user'
u.isActive; // true
```

---

## Classes vs Prototype — Under the Hood

```javascript
class Animal {
  constructor(name) { this.name = name; }
  speak() { return `${this.name} speaks`; }
}

// Equivalent old-style code:
function Animal(name) { this.name = name; }
Animal.prototype.speak = function() { return `${this.name} speaks`; };

// Both produce the same prototype chain:
const a = new Animal('Rex');
Object.getPrototypeOf(a) === Animal.prototype; // true
```

Key difference: class methods are **non-enumerable** by default (won't show in `for...in`). Old prototype methods are enumerable.

---

## Common Gotchas

### Methods lose `this` when extracted

```javascript
class Greeter {
  constructor(name) { this.name = name; }
  greet() { return `Hello, ${this.name}`; }
}

const g = new Greeter('Alice');
g.greet();           // "Hello, Alice" ✓

const fn = g.greet;  // extract the method
fn();                // "Hello, undefined" ✗ — `this` is lost (window/undefined)

// Fix 1: bind
const fn = g.greet.bind(g);

// Fix 2: arrow class field (binds at instantiation)
class Greeter {
  constructor(name) { this.name = name; }
  greet = () => `Hello, ${this.name}`; // arrow, lexically bound
}
```

---

## Interview Answer

> "ES6 classes are syntactic sugar over prototype-based inheritance — under the hood it's the same prototype chain. `extends` sets up inheritance, `super()` must be called first in a subclass constructor before using `this`. Private fields with `#` are truly encapsulated. The main gotcha is that methods lose their `this` binding when passed as callbacks — fix with `.bind()` or arrow class fields."

---

## Quick Reference

```
class Foo {}              → defines class
constructor()             → runs on `new Foo()`
method()                  → lives on Foo.prototype (shared)
static method()           → lives on Foo (not instances)
extends                   → inherit from parent class
super()                   → call parent constructor (must be first in child constructor)
super.method()            → call parent method from override
#field                    → private, only accessible within the class
field = value             → class field, initialized per instance
get/set                   → getters and setters
```
