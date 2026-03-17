// ─── JavaScript Foundation — Practice p01: Event Loop Quiz ───────────────────
//
// For each snippet, predict the console output BEFORE running it.
// Write your answers below each snippet, then verify with: node p01_event_loop_quiz.js
//
// ─────────────────────────────────────────────────────────────────────────────

// ─── QUIZ 1 ───
console.log('=== QUIZ 1 ===');
console.log('a');
setTimeout(() => console.log('b'), 0);
Promise.resolve().then(() => console.log('c'));
console.log('d');
// Your prediction: ?, ?, ?, ?
// Answer: a, d, c, b

// ─── QUIZ 2 ───
console.log('\n=== QUIZ 2 ===');
setTimeout(() => console.log('timeout 1'), 0);
setTimeout(() => {
  console.log('timeout 2');
  Promise.resolve().then(() => console.log('microtask inside timeout'));
}, 0);
Promise.resolve().then(() => console.log('microtask 1'));
Promise.resolve().then(() => {
  console.log('microtask 2');
  setTimeout(() => console.log('timeout from microtask'), 0);
});
// Your prediction: ?
// Answer: microtask 1, microtask 2, timeout 1, timeout 2, microtask inside timeout, timeout from microtask

// ─── QUIZ 3 — Stale Closure ───
console.log('\n=== QUIZ 3: Stale Closure ===');
function makeAdder(x) {
  return function(y) {
    return x + y;  // x is closed over
  };
}
const add5 = makeAdder(5);
const add10 = makeAdder(10);
console.log(add5(3));   // ?
console.log(add10(3));  // ?
// Answer: 8, 13

// ─── QUIZ 4 — Classic var in loop bug ───
console.log('\n=== QUIZ 4: var in loop ===');
// What does this print?
const fns = [];
for (var i = 0; i < 3; i++) {
  fns.push(() => console.log(i));
}
fns.forEach(fn => fn());
// Your prediction: ?
// Answer: 3, 3, 3 — because `var` is function-scoped; all closures share the same `i`

// Fix with let:
console.log('\n=== QUIZ 4 fixed with let ===');
const fnsFixed = [];
for (let j = 0; j < 3; j++) {
  fnsFixed.push(() => console.log(j));
}
fnsFixed.forEach(fn => fn());
// Answer: 0, 1, 2

// ─── QUIZ 5 — this binding ───
console.log('\n=== QUIZ 5: this binding ===');
const obj = {
  name: 'NAB',
  regular: function() { return this?.name; },
  arrow: () => { return this?.name; },
};
console.log(obj.regular()); // ?
console.log(obj.arrow());   // ?
// Answer: 'NAB', undefined (arrow has no own `this`, captures outer — global/undefined in strict)

// ─── EXERCISE: Implement once() ───
// Write a function `once(fn)` that returns a wrapper which calls `fn` at most once.
// Subsequent calls return the result of the first call.

function once(fn) {
  // YOUR CODE HERE
}

// Tests (uncomment to run after implementing)
// const init = once(() => { console.log('initialised'); return 42; });
// console.log(init()); // logs 'initialised', returns 42
// console.log(init()); // silent, returns 42
// console.log(init()); // silent, returns 42

// ─── EXERCISE: Implement pipe() ───
// pipe(fn1, fn2, fn3)(value) → fn3(fn2(fn1(value)))
// Left to right function composition

function pipe(...fns) {
  // YOUR CODE HERE
}

// Tests
// const process = pipe(x => x * 2, x => x + 1, x => x ** 2);
// console.log(process(3)); // ((3 * 2) + 1)^2 = 49
