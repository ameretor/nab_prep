# Why Do Senior Interviews Still Ask These "Basic" Questions?

---

## The Real Reason

These questions look basic on the surface, but they are **diagnostic tools**.
A senior engineer who truly understands closures, `this`, and the event loop
will write fundamentally different code than one who just knows the syntax.

Interviewers are not testing if you memorized the answer.
They are testing **how deep your mental model goes**.

---

## Why Closures Specifically

### 1. Bugs in production come from this

The `var` loop trap is not a trick question — it is a **real bug** that appears in:
- Event listeners attached inside loops
- setTimeout / setInterval in loops
- Dynamically generated callbacks (e.g. building a list of click handlers)

A senior who does not understand closures will ship this bug and spend hours debugging it.

### 2. It reveals how you think about memory and scope

Understanding closures means you understand:
- How long variables stay alive (garbage collection)
- Why detached DOM nodes cause memory leaks
- Why React's `useEffect` has a stale closure problem

### 3. It separates memorizers from understanders

Anyone can read "closures are functions that remember their scope."
But can you explain **why** `i = 3` in the loop example?
Can you fix it two different ways and explain the tradeoff?

That requires genuine understanding, not memorization.

---

## What NAB Is Actually Evaluating

When they ask about closures, they are checking:

| They ask | They want to know |
|----------|------------------|
| "What is a closure?" | Do you know the concept? |
| "Why does this print 3,3,3?" | Do you understand scope and deferred execution? |
| "How would you fix it?" | Can you apply the concept to a real problem? |
| "What's another way to fix it?" | Do you know multiple tools (IIFE vs let)? |
| "When would you use closures in React?" | Can you connect fundamentals to real work? |

The last question is what separates a middle from a senior answer.

---

## The Senior Answer They Want to Hear

Not just: *"A closure is a function that remembers its outer scope."*

But: *"Closures are why React hooks work. `useState` persists state between renders
because the setter function closes over the state value. It's also why stale closures
are a common bug in `useEffect` — if you forget to add a dependency, the effect
captures an old value and never sees the update."*

That answer shows you understand the concept **and** use it in your daily work.

---

## Summary

> These questions are still asked because JavaScript's behavior around scope,
> `this`, and async is **genuinely confusing** and **genuinely matters** in production.
> A senior who cannot explain them clearly will struggle to debug the subtle issues
> that come from not understanding them.
