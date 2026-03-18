# HTML5 & Browser Storage — Theory & Interview Prep

## HTML5 Semantic Elements

### Why Semantic HTML Matters
1. **Accessibility** — native ARIA roles, correct screen reader behavior
2. **SEO** — search engines weight semantic structure
3. **Maintainability** — self-documenting structure
4. **Default styles** — browsers apply sensible defaults

### Key Elements & Their Meanings

```html
<header>    <!-- Introductory content: logo, nav, site title (NOT just for <body> — can be inside <article>) -->
<nav>       <!-- Navigation links — primary, secondary, breadcrumb -->
<main>      <!-- Dominant content of the page — only ONE per page -->
<article>   <!-- Self-contained piece of content that makes sense standalone: blog post, news item, comment -->
<section>   <!-- Thematic grouping of content — requires a heading to be appropriate -->
<aside>     <!-- Content tangentially related to the main: sidebar, call-out box, related articles -->
<footer>    <!-- Footer: author info, copyright, related links (NOT just for <body>) -->
<figure>    <!-- Self-contained media: image, diagram, code block (with optional <figcaption>) -->
<time>      <!-- Machine-readable date/time: <time datetime="2024-03-15">March 15</time> -->
<mark>      <!-- Highlighted/relevant text (search results) -->
<details> / <summary>  <!-- Native expandable disclosure -->
```

### `<section>` vs `<article>` vs `<div>`
- `<article>` — self-contained, could be syndicated on its own
- `<section>` — thematic grouping within a document, always with a heading
- `<div>` — no semantic meaning, pure layout/styling hook

---

## HTML5 APIs

### Web Workers
```js
// main.js
const worker = new Worker('/worker.js');
worker.postMessage({ type: 'COMPUTE', data: largeArray });
worker.onmessage = (e) => {
  console.log('Result:', e.data);
};

// worker.js (runs on separate thread — NO access to DOM, window, document)
self.onmessage = (e) => {
  const result = heavyComputation(e.data.data);
  self.postMessage(result);
};
```

**Use cases:** Image processing, heavy sorting/filtering, WASM execution, crypto

### WebSockets
```js
const ws = new WebSocket('wss://api.example.com/stream');
ws.onopen = () => ws.send(JSON.stringify({ type: 'subscribe' }));
ws.onmessage = (e) => handleUpdate(JSON.parse(e.data));
ws.onerror = (err) => console.error(err);
ws.onclose = () => reconnect();
```

**Use case:** Real-time data — stock prices, notifications, live dashboards (NAB-relevant)

### Intersection Observer (lazy loading, infinite scroll)
```js
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      loadImage(entry.target);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
```

### data-* Attributes
```html
<!-- Store custom data on elements — accessible via JS -->
<button data-product-id="42" data-action="add-to-cart">Add</button>
```
```js
const btn = document.querySelector('button');
console.log(btn.dataset.productId); // "42"
console.log(btn.dataset.action);    // "add-to-cart"
```

---

## Browser Storage — Full Comparison

| | Cookie | localStorage | sessionStorage | IndexedDB |
|-|--------|-------------|----------------|-----------|
| **Capacity** | ~4KB | ~5–10MB | ~5MB | Hundreds of MB |
| **Scope** | Origin + path, sent with HTTP requests | Origin | Origin + tab | Origin |
| **Persistence** | Until `expires` / `Max-Age`, or session end | Until explicitly cleared | Until tab closes | Until explicitly cleared |
| **Sent with requests** | Yes (automatic) | No | No | No |
| **API** | Synchronous, string | Synchronous, string | Synchronous, string | Asynchronous, typed |
| **Accessible from JS** | Yes (unless HttpOnly) | Yes | Yes | Yes |
| **Structured data** | No | JSON.stringify/parse | JSON.stringify/parse | Yes, natively |

### When to Use Which

**Cookies:**
- Auth tokens (use `HttpOnly` to prevent XSS access, `Secure` for HTTPS-only, `SameSite=Strict` for CSRF)
- Server-side session management
- Cross-subdomain sharing

```js
// Set a secure auth cookie (done server-side, not client-side, for HttpOnly)
// document.cookie can set non-HttpOnly cookies:
document.cookie = "prefs=dark; SameSite=Strict; Secure; max-age=86400";
```

**localStorage:**
- User preferences (theme, language)
- Non-sensitive UI state
- Feature flags

**sessionStorage:**
- Multi-step form state (wizard steps)
- Temporary filters/sort state within a session

**IndexedDB:**
- Offline-capable apps (PWAs)
- Large datasets (product catalogues, transaction history cache)
- Structured/relational data that needs querying

### Security Consideration (Senior Answer)

> "For auth tokens at NAB, I'd always use HttpOnly cookies — not localStorage. HttpOnly cookies can't be read by JavaScript at all, so they're immune to XSS attacks. If an attacker injects a script, it can't steal the cookie. localStorage tokens ARE readable by JS, so any XSS vulnerability exposes the token. For CSRF protection I'd use SameSite=Strict and a CSRF token header check."

---

## HTML5 Form Features

```html
<!-- Native validation -->
<input type="email" required>
<input type="url" required>
<input type="number" min="0" max="100" step="5">
<input type="date">
<input type="tel" pattern="[0-9]{10}">

<!-- Datalist — autocomplete suggestions -->
<input list="cities" name="city">
<datalist id="cities">
  <option value="Ho Chi Minh City">
  <option value="Hanoi">
  <option value="Da Nang">
</datalist>

<!-- Output element — calculated result -->
<form oninput="result.value = parseInt(a.value) + parseInt(b.value)">
  <input type="number" id="a"> + <input type="number" id="b">
  = <output name="result"></output>
</form>
```

---

## Interview Model Answers

### "What is the difference between localStorage and sessionStorage?"
> "Both have the same API and ~5MB storage, but their lifecycle differs. localStorage persists indefinitely — until the user clears it or you call removeItem(). sessionStorage is scoped to a single browser tab and is cleared when the tab closes. A key nuance: if the user opens a new tab to the same origin, sessionStorage is NOT shared — each tab has its own copy. I use sessionStorage for state that should survive page refreshes within a session but reset when the user closes and reopens, like wizard step progress."

### "Why use IndexedDB over localStorage?"
> "Two main reasons. First, capacity — localStorage is limited to about 5MB; IndexedDB can store hundreds of megabytes. Second, IndexedDB is asynchronous — it doesn't block the main thread. localStorage is synchronous, and on a slow device with large data, the reads/writes can cause noticeable jank. For an offline-capable banking app, I'd use IndexedDB to cache transaction history or account data with a service worker, and fall back to the cache when the network is unavailable."

### "What are the security concerns with localStorage?"
> "localStorage is accessible by any JavaScript running on the same origin. That means if your app has an XSS vulnerability — even in a third-party script — an attacker can read everything in localStorage, including auth tokens. This is why I avoid storing sensitive tokens in localStorage. The better alternative is HttpOnly cookies, which the browser sends automatically but JavaScript can never read, making XSS token theft impossible."
