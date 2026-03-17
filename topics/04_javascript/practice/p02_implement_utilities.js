// ─── JavaScript Foundation — Practice p02: Implement Core Utilities ──────────
//
// Implement each function from scratch. Tests at the bottom.
// Run: node p02_implement_utilities.js
//
// ─────────────────────────────────────────────────────────────────────────────

// ─── 1. debounce ─────────────────────────────────────────────────────────────
// Returns a function that delays invoking fn until after `delay` ms
// have elapsed since the last time it was called.

function debounce(fn, delay) {
  // YOUR CODE HERE
}

// ─── 2. throttle ─────────────────────────────────────────────────────────────
// Returns a function that invokes fn at most once per `limit` ms.

function throttle(fn, limit) {
  // YOUR CODE HERE
}

// ─── 3. deepClone ────────────────────────────────────────────────────────────
// Returns a deep copy of a plain JS object/array (no functions, no circular refs).
// Do NOT use JSON.parse(JSON.stringify()) — implement it recursively.

function deepClone(value) {
  // YOUR CODE HERE
}

// ─── 4. memoize ──────────────────────────────────────────────────────────────
// Returns a memoized version of fn (caches by first argument).

function memoize(fn) {
  // YOUR CODE HERE
}

// ─── 5. flatten ──────────────────────────────────────────────────────────────
// Flatten a nested array to the given depth (default: Infinity).
// Do NOT use Array.prototype.flat().

function flatten(arr, depth = Infinity) {
  // YOUR CODE HERE
}

// ─────────────────────────────────────────────────────────────────────────────
// TESTS — uncomment and run to verify
// ─────────────────────────────────────────────────────────────────────────────

// debounce test (manual — hard to unit test timing, use in browser)
// const log = debounce((msg) => console.log(msg), 100);
// log('a'); log('b'); log('c'); // only 'c' should log after 100ms

// throttle test
// const tlog = throttle((msg) => console.log(msg), 200);
// setInterval(() => tlog('tick'), 50); // should only log every ~200ms

// deepClone
const original = { a: 1, b: { c: [1, 2, 3] } };
const cloned = deepClone(original);
cloned.b.c.push(99);
console.assert(original.b.c.length === 3, 'deepClone: original should not be mutated');
console.assert(cloned.b.c.length === 4, 'deepClone: cloned should have 4 elements');

// memoize
let callCount = 0;
const expensive = memoize((n) => { callCount++; return n * n; });
console.assert(expensive(5) === 25, 'memoize: first call returns correct value');
console.assert(expensive(5) === 25, 'memoize: second call returns cached value');
console.assert(callCount === 1, 'memoize: fn should only be called once');

// flatten
console.assert(JSON.stringify(flatten([1, [2, [3, [4]]]]]) ) === '[1,2,3,4]', 'flatten: full depth');
console.assert(JSON.stringify(flatten([1, [2, [3]]], 1)) === '[1,2,[3]]', 'flatten: depth 1');
console.assert(JSON.stringify(flatten([1, 2, 3])) === '[1,2,3]', 'flatten: already flat');

console.log('All tests passed!');
