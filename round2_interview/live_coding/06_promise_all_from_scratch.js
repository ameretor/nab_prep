/**
 * LIVE CODING — Implement Promise.all from scratch
 *
 * TASK: Write your own implementation of Promise.all.
 *
 * Spec:
 *   - Takes an iterable of promises (or values)
 *   - Resolves with an array of resolved values IN ORDER when ALL resolve
 *   - Rejects immediately with the reason of the FIRST rejection
 *   - Empty array resolves immediately with []
 */

function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let remaining = promises.length;

    if (remaining === 0) return resolve([]);

    promises.forEach((promise, index) => {
      // Wrap in Promise.resolve to handle non-promise values too
      Promise.resolve(promise)
        .then(value => {
          results[index] = value; // preserve order, not insertion order
          remaining--;
          if (remaining === 0) resolve(results);
        })
        .catch(reject); // first rejection immediately rejects the whole thing
    });
  });
}

// ─── TESTS ───────────────────────────────────────────────────────────────────
async function runTests() {
  // All resolve
  const r1 = await promiseAll([
    Promise.resolve(1),
    Promise.resolve(2),
    Promise.resolve(3),
  ]);
  console.assert(JSON.stringify(r1) === JSON.stringify([1, 2, 3]), 'Test 1 failed');

  // Empty array
  const r2 = await promiseAll([]);
  console.assert(JSON.stringify(r2) === JSON.stringify([]), 'Test 2 failed');

  // Mixed values and promises
  const r3 = await promiseAll([1, Promise.resolve(2), 3]);
  console.assert(JSON.stringify(r3) === JSON.stringify([1, 2, 3]), 'Test 3 failed');

  // First rejection wins
  try {
    await promiseAll([Promise.resolve(1), Promise.reject('boom'), Promise.resolve(3)]);
    console.assert(false, 'Test 4 failed — should have rejected');
  } catch (e) {
    console.assert(e === 'boom', 'Test 4 rejection value wrong');
  }

  // Order preserved even with different resolution timing
  const r5 = await promiseAll([
    new Promise(r => setTimeout(() => r('slow'), 50)),
    Promise.resolve('fast'),
  ]);
  console.assert(JSON.stringify(r5) === JSON.stringify(['slow', 'fast']), 'Test 5 failed');

  console.log('06_promise_all: all tests passed');
}

runTests();
