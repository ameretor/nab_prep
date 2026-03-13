# Prototype & Inheritance

## How the Prototype Chain Works

Every object in JS has a hidden `[[Prototype]]` link. When you access a property, JS walks up the chain until it finds it or hits `null`.

```
d (Dog instance)
  └── __proto__ → Dog.prototype
        └── __proto__ → Animal.prototype
              └── __proto__ → Object.prototype
                    └── __proto__ → null
```

---

## Prototypal Inheritance (Old Style)

```javascript
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function() {
  return `${this.name} makes a sound`;
};

function Dog(name) {
  Animal.call(this, name); // call parent constructor
}
Dog.prototype = Object.create(Animal.prototype); // set up chain
Dog.prototype.constructor = Dog;                 // fix constructor reference

Dog.prototype.speak = function() {
  return `${this.name} barks`;
};

const d = new Dog('Rex');
d.speak();           // 'Rex barks'  ← own method found first
d instanceof Dog;    // true
d instanceof Animal; // true         ← walks up chain
```

---

## Class Syntax (ES6) — Same thing, cleaner

```javascript
class Animal {
  constructor(name) { this.name = name; }
  speak() { return `${this.name} makes a sound`; }
}

class Dog extends Animal {
  speak() { return `${this.name} barks`; }
}

const d = new Dog('Rex');
d.speak(); // 'Rex barks'
```

> `class` is **syntactic sugar** — the prototype chain under the hood is identical.

---

## `__proto__` vs `prototype`

| | `prototype` | `__proto__` |
|--|-------------|-------------|
| Exists on | **Functions** only | **All objects** |
| Purpose | Template for instances created with `new` | Actual link to the prototype object |
| Example | `Dog.prototype.speak = ...` | `d.__proto__ === Dog.prototype` |

```javascript
function Foo() {}
const f = new Foo();

Foo.prototype === f.__proto__; // true
Object.getPrototypeOf(f) === Foo.prototype; // true (preferred over __proto__)
```

---

## `Object.create()`

Creates a new object with a specified prototype — without calling a constructor.

```javascript
const animal = {
  speak() { return `${this.name} makes a sound`; }
};

const dog = Object.create(animal);
dog.name = 'Rex';
dog.speak(); // 'Rex makes a sound' — found on prototype
```

---

## Interview Answer

> "Every JS object has a prototype chain. Property lookups walk the chain until found or reaching null. `prototype` is a property on constructor functions used as the template for instances. `__proto__` is the actual link on an instance pointing to that template. ES6 `class`/`extends` is syntactic sugar over the same mechanism — it's still prototype-based, not class-based like Java."
