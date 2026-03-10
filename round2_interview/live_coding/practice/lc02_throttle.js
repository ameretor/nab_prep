/**
 * LIVE CODING — lc02: throttle
 * Topic: Closures + Timing + Higher-Order Functions
 *
 * ─── TASK ─────────────────────────────────────────────────────────────────────
 * Implement throttle(fn, limit) — returns a throttled version of fn that
 * executes AT MOST once per `limit` milliseconds, no matter how often it's called.
 *
 * The throttled function should:
 *   - Execute fn immediately on the FIRST call
 *   - Ignore subsequent calls until `limit` ms have passed
 *   - Execute with the correct `this` context and arguments
 *
 * ─── EXAMPLES ─────────────────────────────────────────────────────────────────
 * const log = throttle((x) => console.log(x), 1000);
 * log('a');  // logs 'a' immediately
 * log('b');  // ignored (within 1000ms)
 * log('c');  // ignored (within 1000ms)
 * // after 1000ms:
 * log('d');  // logs 'd'
 *
 * ─── CONSTRAINTS ──────────────────────────────────────────────────────────────
 * - Do NOT use a library — implement from scratch using closures
 * - Expected: O(1) per call, O(1) space (beyond the closure itself)
 *
 * ─── INTERVIEWER FOLLOW-UPS ───────────────────────────────────────────────────
 * Be ready to explain:
 *   1. What's the difference between throttle and debounce?
 *      - Throttle: fires at a FIXED rate regardless of call frequency
 *      - Debounce: fires ONLY after calls have STOPPED for `limit` ms
 *   2. When would you use throttle vs debounce?
 *      - Throttle: scroll events, resize, mousemove (you want regular updates)
 *      - Debounce: search input, form validation (you want to wait for the user to stop)
 *   3. How would you add a "trailing call" option (execute once more after the limit)?
 *
 * ─── YOUR SOLUTION ────────────────────────────────────────────────────────────
 */

function throttle(fn, limit) {
    let lastCall = 0;

    return function (...args) {
        const now = Date.now();
        if (now - lastCall >= limit) {
            lastCall = now;
            return fn.apply(this, args);
        }
    };
}

// ─── MANUAL TEST ──────────────────────────────────────────────────────────────
// const log = throttle((x) => console.log(Date.now(), x), 500);
// log('a');           // should log immediately
// log('b');           // should be ignored
// setTimeout(() => log('c'), 200);   // should be ignored (still within 500ms)
// setTimeout(() => log('d'), 600);   // should log (~600ms after start)

module.exports = throttle;
