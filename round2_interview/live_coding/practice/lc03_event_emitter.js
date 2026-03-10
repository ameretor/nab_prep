/**
 * LIVE CODING — lc03: EventEmitter
 * Topic: OOP + Pub/Sub Pattern + Data Structures
 *
 * ─── TASK ─────────────────────────────────────────────────────────────────────
 * Implement a class EventEmitter with the following methods:
 *
 *   on(event, listener)      — subscribe to an event
 *   off(event, listener)     — unsubscribe a specific listener
 *   emit(event, ...args)     — fire all listeners for the event with given args
 *   once(event, listener)    — subscribe but auto-unsubscribe after first call
 *
 * ─── EXAMPLES ─────────────────────────────────────────────────────────────────
 * const emitter = new EventEmitter();
 *
 * const greet = (name) => console.log(`Hello, ${name}`);
 * emitter.on('greet', greet);
 * emitter.emit('greet', 'Alice');   // logs "Hello, Alice"
 * emitter.emit('greet', 'Bob');     // logs "Hello, Bob"
 * emitter.off('greet', greet);
 * emitter.emit('greet', 'Carol');   // no output (unsubscribed)
 *
 * emitter.once('ping', () => console.log('pong'));
 * emitter.emit('ping');   // logs "pong"
 * emitter.emit('ping');   // no output (already fired once)
 *
 * ─── CONSTRAINTS ──────────────────────────────────────────────────────────────
 * - Multiple listeners per event must be supported
 * - off() should only remove ONE instance of the listener (not all)
 * - emit() on an event with no listeners should not throw
 * - once() listener should not appear in the listeners list after firing
 *
 * ─── INTERVIEWER FOLLOW-UPS ───────────────────────────────────────────────────
 * Be ready to explain:
 *   1. What data structure did you use to store listeners, and why?
 *   2. How does once() work internally? (wrap the listener, auto-call off)
 *   3. Where is the pub/sub pattern used in real frontend work?
 *      (Redux store, React context, WebSocket message handling, DOM events)
 *   4. How would you add a removeAllListeners(event) method?
 *
 * ─── YOUR SOLUTION ────────────────────────────────────────────────────────────
 */

class EventEmitter {
    // write your solution here
}

// ─── TESTS ────────────────────────────────────────────────────────────────────
// const e = new EventEmitter();
// const results = [];
//
// const handler = (x) => results.push(x);
// e.on('data', handler);
// e.emit('data', 1);
// e.emit('data', 2);
// e.off('data', handler);
// e.emit('data', 3);  // should not fire
// console.assert(JSON.stringify(results) === '[1,2]', 'on/off failed');
//
// const onceResults = [];
// e.once('ping', () => onceResults.push('pong'));
// e.emit('ping');
// e.emit('ping');  // should not fire again
// console.assert(JSON.stringify(onceResults) === '["pong"]', 'once failed');
//
// e.emit('nonexistent');  // should not throw
// console.log('event_emitter: all tests passed');

module.exports = EventEmitter;
