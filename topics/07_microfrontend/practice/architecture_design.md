# Microfrontend Architecture Design Exercise

## Scenario (NAB-style)

NAB is building a new digital banking platform. The product has these main features:
- **Dashboard** — account summary, recent transactions, balance overview
- **Payments** — transfer money, pay bills, BPAY
- **Cards** — manage credit/debit cards, set limits, freeze
- **Profile** — personal info, notifications, preferences

Three separate product teams work on these features. Each team deploys independently. The company uses React 18 and Webpack 5.

---

## Exercise 1: Design the Architecture

Answer these questions (write your answers below each):

**Q1: What integration strategy would you choose and why?**

Your answer:

---

**Q2: How would you structure the shell (host) application?**

What does the shell own?
- [ ] Routing?
- [ ] Auth?
- [ ] Global navigation?
- [ ] Design system?

Your answer:

---

**Q3: How do the MFEs share auth state?**

The user logs in once via the shell. Payments MFE and Cards MFE also need to know who the user is. What's your approach?

Your answer:

---

**Q4: The Dashboard team wants to show a "Latest Transactions" component built by the Payments team. How do you handle this cross-MFE component sharing?**

Your answer:

---

**Q5: Cards MFE is built by a different team. During a deployment, their `remoteEntry.js` is temporarily unavailable. What happens to the shell? How do you handle it?**

Your answer:

---

## Exercise 2: Module Federation Config

Complete the Webpack Module Federation config for:

**Payments MFE (remote)** — exposes `./PaymentForm` and `./TransactionList`

```js
// payments/webpack.config.js
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      // YOUR CONFIG HERE
    }),
  ],
};
```

**Shell (host)** — consumes from Payments MFE at https://payments.nab.com/remoteEntry.js

```js
// shell/webpack.config.js
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      // YOUR CONFIG HERE
    }),
  ],
};
```

**Shell usage** — lazy-load PaymentForm in a route:

```jsx
// shell/src/App.jsx
// YOUR CODE HERE — lazy import from the remote + Suspense wrapper
```

---

## Exercise 3: Event Bus

Implement the shared event bus that MFEs use to communicate:

```js
// packages/event-bus/index.js

class EventBus {
  // YOUR IMPLEMENTATION
  // Methods: on(event, handler), off(event, handler), emit(event, data), once(event, handler)
}

export const eventBus = new EventBus();
```

Usage contract:
```js
// Shell emits after login
eventBus.emit('auth:login', { userId: '123', token: 'abc' });

// Payments MFE listens
eventBus.on('auth:login', ({ userId }) => loadUserPayments(userId));

// Cards MFE listens
eventBus.on('auth:login', ({ userId }) => loadUserCards(userId));
```

---

## Model Answers (read after attempting)

### Q1 Model Answer
Module Federation (Webpack 5). Three independent teams + independent deployment cadences = runtime integration. Compile-time (npm packages) would require the shell to rebuild every time any team deploys, defeating the purpose. Iframes have poor UX for a banking app. Module Federation allows lazy loading each MFE route, with shared React as a singleton.

### Q2 Model Answer
Shell owns: routing, authentication (login flow, token storage), global navigation (header/sidebar), design system (shared component library via npm). Shell does NOT own feature logic — that's each MFE's responsibility.

### Q3 Model Answer
Shell authenticates and emits `auth:login` event with user context via the shared EventBus. Each MFE subscribes to this event. For synchronous needs (MFE initializes after user is already logged in), expose auth context on `window.__NAB_AUTH__` or via a shared module that both shell and MFEs import.

### Q4 Model Answer
Payments MFE exposes `TransactionList` as a Module Federation remote. Dashboard MFE imports it at runtime: `import('paymentsMFE/TransactionList')`. The Payments team owns it, deploys it, the Dashboard team consumes it. Clear interface contract (props API) is documented.

### Q5 Model Answer
Use React's error boundary + Suspense fallback to handle failed remote loads gracefully. If `remoteEntry.js` fails to load, the shell shows a fallback UI for that section rather than crashing. Circuit breaker pattern at the MFE boundary. Alert/monitoring should fire when a remote is unavailable.
