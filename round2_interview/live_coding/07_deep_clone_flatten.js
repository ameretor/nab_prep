/**
 * LIVE CODING — Deep Clone & Flatten Nested Array
 *
 * Two classic JS fundamentals questions often asked in live coding.
 */

// ─── PART 1: DEEP CLONE ───────────────────────────────────────────────────────
/**
 * TASK: Implement deep clone WITHOUT using JSON.parse/JSON.stringify
 * (that approach fails for undefined, Date, Map, Set, circular refs, functions)
 *
 * Handle: primitives, arrays, plain objects.
 * Mention in interview: `structuredClone()` is the modern native solution.
 */

function deepClone(value) {
  // Primitives and null — return as-is
  if (value === null || typeof value !== 'object') return value;

  // Array
  if (Array.isArray(value)) return value.map(deepClone);

  // Plain object
  return Object.fromEntries(
    Object.entries(value).map(([key, val]) => [key, deepClone(val)])
  );
}

// Tests
const original = { a: 1, b: { c: [2, 3, { d: 4 }] } };
const cloned = deepClone(original);
cloned.b.c[2].d = 99;
console.assert(original.b.c[2].d === 4, 'deepClone: mutation leaked to original');
console.assert(cloned.b.c[2].d === 99,  'deepClone: clone not updated');
console.assert(deepClone(null) === null, 'deepClone: null failed');
console.assert(deepClone(42) === 42,     'deepClone: primitive failed');
console.log('deepClone: all tests passed');


// ─── PART 2: FLATTEN NESTED ARRAY ────────────────────────────────────────────
/**
 * TASK: Flatten an arbitrarily nested array without using Array.prototype.flat()
 *
 * e.g. [1, [2, [3, [4]], 5]] → [1, 2, 3, 4, 5]
 */

// Recursive approach — clean and readable
function flatten(arr) {
  return arr.reduce((acc, item) =>
    Array.isArray(item) ? acc.concat(flatten(item)) : acc.concat(item),
  []);
}

// Iterative approach (avoids call stack overflow for very deep nesting)
function flattenIterative(arr) {
  const stack = [...arr];
  const result = [];
  while (stack.length) {
    const item = stack.pop();
    if (Array.isArray(item)) {
      stack.push(...item); // push back expanded items
    } else {
      result.unshift(item); // build result in correct order
    }
  }
  return result;
}

// Tests
const nested = [1, [2, [3, [4]], 5]];
console.assert(JSON.stringify(flatten(nested))          === JSON.stringify([1,2,3,4,5]), 'flatten recursive failed');
console.assert(JSON.stringify(flattenIterative(nested)) === JSON.stringify([1,2,3,4,5]), 'flatten iterative failed');
console.assert(JSON.stringify(flatten([]))              === JSON.stringify([]),           'flatten empty failed');
console.assert(JSON.stringify(flatten([1,2,3]))         === JSON.stringify([1,2,3]),     'flatten flat array failed');
console.log('flatten: all tests passed');
