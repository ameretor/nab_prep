# Web Optimization — Theory & Interview Prep

## Performance Metrics (the language interviewers use)

| Metric | What it measures | Tool |
|--------|----------------|------|
| TTFB (Time to First Byte) | Server response time | Chrome DevTools, WebPageTest |
| FCP (First Contentful Paint) | First text/image rendered | Lighthouse |
| LCP (Largest Contentful Paint) | Main content loaded | Core Web Vitals |
| TTI (Time to Interactive) | Page is reliably interactive | Lighthouse |
| TBT (Total Blocking Time) | Main thread blocked by JS | Lighthouse |
| INP (Interaction to Next Paint) | Response to user interactions | CrUX, PageSpeed |
| CLS (Cumulative Layout Shift) | Visual stability | Core Web Vitals |

**Good thresholds (p75 of real users):**
- LCP < 2.5s, INP < 200ms, CLS < 0.1

---

## JavaScript Performance

### Bundle Optimization
```js
// Code splitting by route (React)
const Dashboard = React.lazy(() => import('./pages/Dashboard'));

// Code splitting a heavy library (only load when needed)
async function generateReport() {
  const { default: jsPDF } = await import('jspdf');
  // use jsPDF
}
```

**Tree shaking:** Webpack/Rollup remove unused exports. Requires:
- ES modules (`import`/`export`) — not CommonJS (`require`)
- `sideEffects: false` in package.json (or per-file marking)

**Bundle analysis:**
```bash
# webpack-bundle-analyzer — visualize what's in your bundle
npx webpack-bundle-analyzer stats.json
```

### Main Thread Optimization
- **Long Tasks** (> 50ms) block the main thread — degrade INP
- Move expensive computations to Web Workers
- Use `scheduler.postTask()` or `requestIdleCallback` for non-urgent work

```js
// Web Worker for heavy computation
const worker = new Worker('/heavy-computation.js');
worker.postMessage({ data: largeDataSet });
worker.onmessage = (e) => setResult(e.data);
```

---

## Network Optimization

### HTTP Caching Strategy
| Resource type | Cache-Control strategy |
|--------------|----------------------|
| HTML | `no-cache` (always revalidate) |
| CSS/JS with hash in filename | `max-age=31536000, immutable` (1 year — hash changes on update) |
| Images | `max-age=86400` (1 day) or CDN |
| API responses | `no-store` or short `max-age` |

### HTTP/2 and HTTP/3
- HTTP/2: multiplexing (multiple requests over one connection), header compression
- HTTP/3: QUIC protocol, better on unreliable networks (mobile)
- **No longer need domain sharding** with HTTP/2 (it was a HTTP/1.1 workaround)

### Compression
- **gzip**: 60–70% reduction in text file size (CSS, JS, HTML)
- **brotli**: 15–20% better than gzip for text — use where supported
- Always compress: JS, CSS, HTML, SVG, JSON, XML

---

## Image Optimization

```html
<!-- Responsive images -->
<img
  src="hero-800.jpg"
  srcset="hero-400.jpg 400w, hero-800.jpg 800w, hero-1600.jpg 1600w"
  sizes="(max-width: 600px) 100vw, 50vw"
  alt="Team photo"
  width="800"
  height="600"
  loading="lazy"
  decoding="async"
>

<!-- Modern formats via <picture> -->
<picture>
  <source srcset="hero.avif" type="image/avif">
  <source srcset="hero.webp" type="image/webp">
  <img src="hero.jpg" alt="Team photo" width="800" height="600">
</picture>
```

**Format guide:**
- AVIF: best compression (50% smaller than JPEG), slower encoding
- WebP: 30% smaller than JPEG, wide browser support
- JPEG: photos, wide compatibility fallback
- PNG: transparency, lossless
- SVG: icons, illustrations, resolution-independent

**Never lazy-load the LCP image.** The image above-the-fold that is LCP should have `fetchpriority="high"` and a `<link rel="preload">`.

---

## Rendering Strategy (important for NAB — they build financial products)

### Client-Side Rendering (CSR)
- React renders entirely in browser
- Pros: rich interactivity, fast subsequent navigation
- Cons: poor initial load (blank screen until JS runs), bad for SEO without workarounds

### Server-Side Rendering (SSR)
- Server sends fully rendered HTML
- Pros: fast FCP/LCP, SEO-friendly
- Cons: TTFB can be higher, more server load

### Static Site Generation (SSG)
- HTML generated at build time
- Pros: fastest possible serving (CDN), best Lighthouse scores
- Cons: content is stale until rebuild

### Incremental Static Regeneration (ISR — Next.js)
- SSG + revalidation — serve cached HTML, regenerate in background
- Best for content that changes occasionally (product pages, news)

**NAB Senior answer:** "For a banking dashboard, I'd use SSR for the authenticated pages (personalised data, security) and SSG for public pages (rates, FAQs). I'd optimize LCP with server-side data fetching so the hero content is in the initial HTML, not loaded after hydration."

---

## Rendering Performance (Avoiding Jank)

**Browser rendering budget:** 16ms per frame for 60fps

**Causes of jank:**
1. Forced synchronous layouts (layout thrashing)
2. Long-running JS on main thread
3. Too many layers (too many `will-change` or `transform` properties)

### Layout Thrashing — Example
```js
// Bad — forces layout for each element (reads then writes in a loop)
elements.forEach(el => {
  const height = el.offsetHeight; // read (forces layout flush)
  el.style.height = height * 2 + 'px'; // write (invalidates layout)
});

// Good — batch reads first, then writes
const heights = elements.map(el => el.offsetHeight); // batch reads
elements.forEach((el, i) => { el.style.height = heights[i] * 2 + 'px'; }); // batch writes
```

### CSS Properties by Cost
| Property | What it triggers |
|----------|----------------|
| `transform`, `opacity` | Composite only (GPU layer — cheapest) |
| `color`, `background-color` | Paint only |
| `width`, `height`, `margin`, `padding`, `top/left` | Layout + Paint + Composite (most expensive) |

Use `transform: translateX()` instead of `left:` for animations — stays on GPU.

---

## Caching and Memoization

### Service Workers (for PWA-level caching)
```js
// Cache-first strategy for static assets
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(response => {
        caches.open('v1').then(cache => cache.put(event.request, response.clone()));
        return response;
      });
    })
  );
});
```

---

## Interview Model Answer

### "How would you approach optimizing a slow React app at NAB?"

> "I'd start by measuring, not guessing. I'd run Lighthouse to get a baseline and identify which Core Web Vitals are failing. Then I'd open the React DevTools Profiler to find components with high render time.
>
> For React-specific issues: if I see unnecessary re-renders, I'd add `React.memo` and ensure callback props are stable with `useCallback`. If Context is causing cascade re-renders, I'd split it. For heavy computations, `useMemo`. For large lists, I'd virtualize with `react-window`.
>
> At the network level: code split by route so users don't download the whole app upfront, optimize the LCP image with a `preload` hint, and ensure CSS/JS are compressed and cached immutably with hash-based filenames.
>
> For a financial app like NAB's, I'd also measure real user monitoring metrics, not just synthetic Lighthouse scores — p75 LCP and INP from real user browsers are what count for Core Web Vitals assessment."
