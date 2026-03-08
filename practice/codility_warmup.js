/**
 * CODILITY WARMUP PROBLEMS — Practice these until fast
 * Run: node codility_warmup.js
 */

// ─── EASY ────────────────────────────────────────────────────────────────────

// 1. Find missing element in array [1..N+1]
function missingElement(arr) {
  const n = arr.length + 1;
  const expected = (n * (n + 1)) / 2;
  return expected - arr.reduce((a, b) => a + b, 0);
}
console.assert(missingElement([2, 3, 1, 5]) === 4, 'missingElement failed');

// 2. Find odd-occurring number (XOR)
function oddOccurrence(arr) {
  return arr.reduce((acc, n) => acc ^ n, 0);
}
console.assert(oddOccurrence([9, 3, 9, 3, 9, 7, 9]) === 7, 'oddOccurrence failed');

// 3. Cyclic rotation (rotate right by K)
function cyclicRotation(arr, K) {
  if (!arr.length) return arr;
  const k = K % arr.length;
  return [...arr.slice(-k), ...arr.slice(0, -k || undefined)];
}
console.assert(JSON.stringify(cyclicRotation([3,8,9,7,6], 3)) === JSON.stringify([9,7,6,3,8]), 'cyclic failed');

// 4. TapeEquilibrium — min difference of two-part split
function tapeEquilibrium(arr) {
  let leftSum = 0;
  const totalSum = arr.reduce((a, b) => a + b, 0);
  let minDiff = Infinity;
  for (let i = 0; i < arr.length - 1; i++) {
    leftSum += arr[i];
    minDiff = Math.min(minDiff, Math.abs(totalSum - 2 * leftSum));
  }
  return minDiff;
}
console.assert(tapeEquilibrium([3, 1, 2, 4, 3]) === 1, 'tapeEquilibrium failed');

// ─── MEDIUM ──────────────────────────────────────────────────────────────────

// 5. MaxCounters
function maxCounters(N, ops) {
  const counters = new Array(N).fill(0);
  let maxVal = 0, lastMax = 0;
  for (const op of ops) {
    if (op >= 1 && op <= N) {
      counters[op - 1] = Math.max(counters[op - 1], lastMax) + 1;
      maxVal = Math.max(maxVal, counters[op - 1]);
    } else {
      lastMax = maxVal; // max counter op
    }
  }
  return counters.map(c => Math.max(c, lastMax));
}
console.assert(JSON.stringify(maxCounters(5, [3,4,4,6,1,4,4])) === JSON.stringify([3,2,2,4,2]), 'maxCounters failed');

// 6. MissingInteger — smallest positive integer not in array
function missingInteger(arr) {
  const set = new Set(arr);
  let i = 1;
  while (set.has(i)) i++;
  return i;
}
console.assert(missingInteger([1, 3, 6, 4, 1, 2]) === 5, 'missingInteger failed');

// 7. PassingCars — count pairs going opposite directions
function passingCars(arr) {
  let east = 0, count = 0;
  for (const car of arr) {
    if (car === 0) east++;
    else count += east;
    if (count > 1_000_000_000) return -1;
  }
  return count;
}
console.assert(passingCars([0,1,0,1,1]) === 5, 'passingCars failed');

// 8. Brackets — validate nesting
function brackets(s) {
  const stack = [];
  const map = { ')': '(', ']': '[', '}': '{' };
  for (const c of s) {
    if ('([{'.includes(c)) stack.push(c);
    else if (stack.pop() !== map[c]) return false;
  }
  return stack.length === 0;
}
console.assert(brackets('{[()()]}') === true, 'brackets failed');
console.assert(brackets('([)()]') === false, 'brackets failed');

// 9. Fish — simulate fish survival with stack
function fish(fish, direction) {
  const stack = []; // downstream fish
  let survived = 0;
  for (let i = 0; i < fish.length; i++) {
    if (direction[i] === 1) {
      stack.push(fish[i]);
    } else {
      while (stack.length && stack[stack.length - 1] < fish[i]) {
        stack.pop(); // upstream fish eats downstream
      }
      if (!stack.length) survived++;
    }
  }
  return survived + stack.length;
}
console.assert(fish([4,3,2,1,5], [0,1,0,0,0]) === 2, 'fish failed');

// 10. Distinct — count distinct values
function distinct(arr) {
  return new Set(arr).size;
}
console.assert(distinct([2,1,1,2,3,1]) === 3, 'distinct failed');

console.log('All tests passed!');
