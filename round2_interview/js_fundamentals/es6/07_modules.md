# Modules (import / export)

Modules let you split code into files and explicitly control what each file exposes. Each module has its own scope — nothing leaks to global.

---

## Named Exports

```javascript
// math.js — multiple named exports
export const PI = 3.14159;

export function add(a, b) { return a + b; }

export function multiply(a, b) { return a * b; }

// OR: export all at once at the bottom (preferred for readability)
const PI = 3.14159;
function add(a, b) { return a + b; }
function multiply(a, b) { return a * b; }

export { PI, add, multiply };
```

```javascript
// main.js — named imports must match exact export names
import { PI, add } from './math.js';
import { multiply } from './math.js';

// Rename on import
import { add as sum } from './math.js';
sum(2, 3); // 5
```

---

## Default Export

One per file. Represents the "main thing" the module exports.

```javascript
// user.js
export default class User {
  constructor(name) { this.name = name; }
}

// OR function
export default function formatDate(date) { ... }

// OR expression
const config = { port: 3000 };
export default config;
```

```javascript
// main.js — default import: you choose the name
import User from './user.js';           // name can be anything
import MyUser from './user.js';         // same thing, different local name
import formatDate from './user.js';     // confusing but valid
```

---

## Named + Default Together

```javascript
// api.js
export default function fetchUser(id) { ... }  // default
export const BASE_URL = 'https://api.example.com'; // named
export function handleError(err) { ... }           // named
```

```javascript
// main.js
import fetchUser, { BASE_URL, handleError } from './api.js';
//     ^default    ^named exports
```

---

## Import Everything (`* as`)

```javascript
import * as MathUtils from './math.js';

MathUtils.add(1, 2);      // 3
MathUtils.PI;             // 3.14159
MathUtils.default;        // the default export if any
```

---

## Re-exporting (Barrel Files)

A barrel file (`index.js`) re-exports from multiple files so consumers import from one place.

```javascript
// components/Button.js
export default function Button() { ... }

// components/Modal.js
export default function Modal() { ... }
export function ModalHeader() { ... }

// components/index.js — barrel
export { default as Button } from './Button.js';
export { default as Modal, ModalHeader } from './Modal.js';
```

```javascript
// Consumer — one clean import instead of multiple paths
import { Button, Modal, ModalHeader } from './components';
```

---

## Dynamic Import (`import()`)

Load modules on demand — returns a Promise. Essential for code splitting.

```javascript
// Static import — always loaded at startup
import HeavyChart from './HeavyChart.js';

// Dynamic import — loaded only when needed
async function showChart() {
  const { default: HeavyChart } = await import('./HeavyChart.js');
  HeavyChart.render();
}

// In React — lazy loading
const HeavyChart = React.lazy(() => import('./HeavyChart'));
```

---

## Named vs Default — Which to Use?

| | Named | Default |
|---|---|---|
| Multiple per file | Yes | No (one per file) |
| Import name | Must match (or alias) | Anything you want |
| Refactor-friendly | Yes — IDE can track | Less — name is free-form |
| Tree-shaking | Easier — bundlers can see what's used | Harder for some bundlers |

**Rule of thumb:**
- Use **named** for utilities, constants, multiple things from one file
- Use **default** for the primary export of a file (a component, a class, a config)

---

## Module Scope

```javascript
// a.js
const secret = 'hidden'; // NOT global — only in a.js
export const visible = 'exported';

// b.js
import { visible } from './a.js';
console.log(secret);  // ReferenceError — not accessible
```

Modules are **singletons** — the same module imported by multiple files shares one instance:

```javascript
// counter.js
export let count = 0;
export function increment() { count++; }

// a.js
import { count, increment } from './counter.js';
increment();
console.log(count); // 1

// b.js — imports the SAME module instance
import { count } from './counter.js';
console.log(count); // 1 — sees the updated value from a.js
```

---

## ES Modules vs CommonJS

| | ESM (import/export) | CJS (require) |
|---|---|---|
| Syntax | `import`/`export` | `require()`/`module.exports` |
| Loading | Static (analyzed at parse time) | Dynamic (runs at runtime) |
| Tree-shaking | Yes | No |
| Works in browser | Yes (natively) | No (needs bundler) |
| Top-level await | Yes | No |
| Default in | Modern JS, Node ESM | Node.js (legacy) |

---

## Interview Answer

> "ES modules use `import`/`export` for static, file-level imports. Named exports are explicitly named and multiple per file; default exports are the primary export of a file. The key advantage over CommonJS is that imports are static — bundlers can tree-shake unused exports. Dynamic `import()` enables code splitting — loading modules on demand."

---

## Quick Reference

```
export const x = 1          → named export
export default fn            → default export (one per file)
import { x } from './f'      → named import (name must match)
import fn from './f'         → default import (any name)
import * as ns from './f'    → namespace import
import('./f').then(...)       → dynamic import (returns Promise)
export { x } from './f'      → re-export (barrel pattern)
```
