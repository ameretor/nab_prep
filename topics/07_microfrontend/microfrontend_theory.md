# Microfrontend Architecture — Theory & Interview Prep

## What Problem Does It Solve?

As frontend codebases grow, a single monolithic SPA becomes a bottleneck:
- Multiple teams committing to one repo → merge conflicts, deployment coupling
- One team's bug can block all other teams' releases
- Large bundle — every feature adds to everyone's load time
- Tech debt is contagious — hard to upgrade or experiment in a shared codebase

**Microfrontend = microservices thinking applied to the frontend.**

Each team owns:
- Their slice of the UI (a route, a feature domain)
- Their own codebase, CI/CD pipeline
- Their own deployment cadence

---

## Integration Strategies

### 1. Compile-time Integration (npm packages)
```
Team A publishes: npm publish @nab/account-summary
Shell app imports: import AccountSummary from '@nab/account-summary'
```
- **Pros:** Simple, works with all build tools, good TypeScript support
- **Cons:** Tight coupling — shell must be rebuilt to get updates; version conflicts possible
- **Best for:** Shared component libraries, design systems (NOT full microfrontends)

### 2. Runtime Integration via Module Federation (Webpack 5)
```js
// webpack.config.js — Remote (Team A's app)
new ModuleFederationPlugin({
  name: 'accountMFE',
  filename: 'remoteEntry.js',
  exposes: {
    './AccountSummary': './src/AccountSummary',
  },
  shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
});

// webpack.config.js — Shell (Host)
new ModuleFederationPlugin({
  name: 'shell',
  remotes: {
    accountMFE: 'accountMFE@https://account.nab.com/remoteEntry.js',
  },
  shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
});

// Usage in shell
const AccountSummary = React.lazy(() => import('accountMFE/AccountSummary'));
```
- **Pros:** True runtime integration — remote updates without shell rebuild; lazy loading
- **Cons:** Complex webpack config; runtime errors if remote is down; version management needed
- **Best for:** Large orgs with independent teams, different deployment cadences

### 3. iframe Integration
```html
<iframe src="https://account.nab.com/widget" title="Account Summary"></iframe>
```
- **Pros:** Perfect isolation — separate JS execution context, styles can't bleed
- **Cons:** Poor UX (scroll issues, sizing problems), hard to share auth, poor accessibility, poor SEO
- **Best for:** Embedding third-party untrusted content, legacy system integration

### 4. Web Components
```js
class AccountSummary extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<div>Account Summary</div>`;
  }
}
customElements.define('account-summary', AccountSummary);

// Usage (framework-agnostic)
<account-summary></account-summary>
```
- **Pros:** Native browser API, framework-agnostic, strong encapsulation (Shadow DOM)
- **Cons:** Limited React integration, testing complexity, Shadow DOM styling constraints
- **Best for:** Cross-framework scenarios, publishing framework-agnostic components

---

## Module Federation — Deep Dive

### Shared Dependencies
```js
// The 'singleton: true' flag ensures only ONE copy of React runs
// Even if both host and remote bundle React
shared: {
  react: { singleton: true, requiredVersion: '^18.0.0' },
  'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
}
```

Without `singleton: true`, you'd have two React instances → hooks won't work correctly.

### Dynamic Remotes (load URL at runtime)
```js
// Load remote URL from config/API — allows environment-specific deployments
async function loadRemote(scope, module) {
  await __webpack_init_sharing__('default');
  const container = window[scope];
  await container.init(__webpack_share_scopes__.default);
  const factory = await container.get(module);
  return factory();
}
```

---

## Cross-MFE Communication

### 1. Custom Events (loosely coupled)
```js
// Emitter MFE
window.dispatchEvent(new CustomEvent('user:logout', { detail: { userId: 123 } }));

// Listener MFE
window.addEventListener('user:logout', (e) => clearUserData(e.detail.userId));
```

### 2. Shared State via Window (simple but fragile)
```js
window.__NAB_SHARED_STATE__ = { userId, theme };
```

### 3. URL / Query Params (for routing-based state)

### 4. Pub/Sub via Event Bus (structured)
```js
// Shared package: @nab/event-bus
class EventBus {
  constructor() { this.listeners = new Map(); }
  on(event, handler) { ... }
  emit(event, data) { ... }
  off(event, handler) { ... }
}
export const eventBus = new EventBus();
```

---

## Trade-offs (Honest Assessment)

| Pro | Con |
|-----|-----|
| Independent deployments | Operational complexity (multiple repos, pipelines) |
| Team autonomy | Bundle duplication (each MFE may include React) |
| Technology freedom | Shared state/auth is harder |
| Fault isolation | Consistent UX across MFEs is a challenge |
| Scales teams well | Performance can suffer without careful shared dep management |
| Smaller individual bundles | Testing across MFE boundaries is harder |

---

## When Should You Use Microfrontends?

**Use it when:**
- Multiple independent teams working on the same product
- Different parts of the app need independent deployment cadences
- You want to incrementally migrate a legacy app
- Teams want technology freedom

**Don't use it when:**
- Small team (2–5 engineers) — overhead outweighs benefit
- All features are tightly coupled (shared state everywhere)
- You're building an MVP — premature architecture

---

## Interview Model Answers

### "What are the main integration strategies for microfrontends?"
> "There are four main approaches. Compile-time integration via npm packages — teams publish components as packages; simple but requires a rebuild to get updates. Runtime integration via Module Federation — Webpack 5 loads remote entry files at runtime, so teams can deploy independently without the shell app rebuilding; this is the most common enterprise approach. Iframe integration provides perfect isolation but poor UX for shared auth and responsive design. Web Components offer a native, framework-agnostic approach using Custom Elements and Shadow DOM.
>
> For NAB-scale banking, I'd lean toward Module Federation for product features — it gives independent deployments, lazy loading, and shared dependency management. The key concern to manage is that React must be a singleton across all remotes, otherwise hooks break."

### "How do microfrontends handle shared state like auth?"
> "Auth state is usually handled at the shell level — the shell app authenticates the user and passes a token or user object down via custom events, URL state, or a shared event bus. Each MFE reads auth info but doesn't own it. For cross-MFE communication in general, I prefer custom events on `window` for simple cases (they're decoupled), or a shared event bus package for more structured pub/sub. The important rule: MFEs should communicate through interfaces, not by importing each other's internal modules — same principle as microservices communicating over HTTP, not shared databases."
