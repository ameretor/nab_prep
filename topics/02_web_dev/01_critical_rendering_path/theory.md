# Critical Rendering Path (CRP) — Theory & Interview Prep

## The 6 Steps (know this cold)

```
HTML → DOM
CSS  → CSSOM
DOM + CSSOM → Render Tree → Layout → Paint → Composite
```

**Step by step:**

1. **Parse HTML → DOM tree**
   - Browser reads HTML bytes → characters → tokens → nodes → DOM tree
   - Incremental — browser parses and renders progressively

2. **Parse CSS → CSSOM tree**
   - CSS is render-blocking: browser must fully parse all CSS before rendering
   - Inline styles, `<style>` tags, external stylesheets all contribute

3. **DOM + CSSOM → Render Tree**
   - Combines visible DOM nodes with their computed styles
   - Excludes `display: none` elements (not in render tree at all)
   - `visibility: hidden` IS in the render tree (takes space but invisible)

4. **Layout (Reflow)**
   - Calculates geometry: position, size of every node
   - Triggered by: size changes, font changes, DOM additions/removals
   - **Expensive** — layout of a parent can trigger layout of all children

5. **Paint**
   - Fills in pixels for each visible element: colors, borders, shadows, text
   - Complex styles (shadows, gradients) take longer to paint

6. **Composite**
   - Browser combines painted layers into the final image
   - GPU-accelerated: `transform` and `opacity` changes only trigger composite (cheap)

---

## What Blocks Rendering

### Render-blocking CSS
- ALL external stylesheets are render-blocking by default
- Browser won't show anything until CSSOM is fully built
- Fix: inline critical CSS, load non-critical CSS asynchronously

```html
<!-- Blocks rendering -->
<link rel="stylesheet" href="styles.css">

<!-- Load non-critical CSS async -->
<link rel="preload" href="print.css" as="style" onload="this.rel='stylesheet'">
```

### Render-blocking JS
- `<script>` in `<head>` without async/defer blocks HTML parsing AND rendering
- Browser must download, parse, and execute JS before continuing

```html
<!-- Blocks parsing -->
<script src="app.js"></script>

<!-- async: downloads in parallel, executes as soon as downloaded (no order guarantee) -->
<script async src="analytics.js"></script>

<!-- defer: downloads in parallel, executes AFTER HTML parsed, IN ORDER -->
<script defer src="app.js"></script>
```

**Rule:** Use `defer` for scripts that need the DOM. Use `async` for independent scripts (analytics). Always put scripts at end of `<body>` or use `defer`.

---

## Resource Hints

```html
<!-- preconnect: establish TCP/TLS early for third-party domains -->
<link rel="preconnect" href="https://fonts.googleapis.com">

<!-- preload: tell browser to fetch a critical resource early (high priority) -->
<link rel="preload" href="/hero.jpg" as="image">
<link rel="preload" href="/font.woff2" as="font" crossorigin>

<!-- prefetch: low-priority fetch for next-page resources -->
<link rel="prefetch" href="/next-page.js">
```

**When to use each:**
- `preconnect` → third-party origins you'll definitely use (CDN, fonts, API)
- `preload` → critical resources for current page (hero image, primary font, above-fold CSS)
- `prefetch` → resources needed for the likely next navigation

---

## Core Web Vitals (LCP, FID/INP, CLS)

| Metric | Measures | Good | Poor |
|--------|---------|------|------|
| LCP (Largest Contentful Paint) | Load performance | < 2.5s | > 4.0s |
| INP (Interaction to Next Paint) | Responsiveness | < 200ms | > 500ms |
| CLS (Cumulative Layout Shift) | Visual stability | < 0.1 | > 0.25 |

**LCP optimization (most asked):**
1. Don't lazy-load the LCP image — it delays the metric
2. Add `fetchpriority="high"` to the LCP image
3. Use `<link rel="preload">` for it
4. Serve from CDN / optimize image format (WebP, AVIF)
5. Reduce TTFB: server response time matters

**CLS fix:**
- Always set width/height on images and videos (reserves space before load)
- Avoid inserting content above existing content
- Use `font-display: optional` or `swap` to prevent layout shifts from font loading

---

## Optimizing CRP — Full Checklist

### HTML
- Minimize HTML size
- Put `<link>` stylesheets in `<head>` (so browser discovers CSS early)
- Put `<script>` at end of `<body>` or use `defer`

### CSS
- Inline critical-above-fold CSS in `<head>`
- Defer non-critical CSS
- Remove unused CSS (PurgeCSS)
- Minify CSS

### JavaScript
- Use `defer` or `async` on external scripts
- Code split — only load what current page needs
- Tree shake — remove dead code
- Minify and compress (gzip/brotli)

### Images
- Use modern formats: WebP (30% smaller than JPEG), AVIF (50% smaller)
- Responsive images: `srcset` + `sizes`
- Lazy load below-fold images: `loading="lazy"`
- Never lazy-load the LCP image
- Set explicit `width` and `height` attributes

### Fonts
- `font-display: swap` — show fallback font immediately, swap when loaded
- Preload primary fonts: `<link rel="preload" href="..." as="font" crossorigin>`
- Subset fonts — only include characters you need

---

## Interview Model Answer

### "Walk me through the critical rendering path."
> "The browser starts by parsing HTML to build the DOM tree, and in parallel downloads and parses CSS to build the CSSOM. Both are needed to build the Render Tree — which combines visible DOM nodes with their computed styles. From the Render Tree, the browser runs Layout to calculate geometry, then Paint to fill in pixels, and finally Composite to assemble layers into what you see on screen.
>
> The most important optimization insight is that CSS is render-blocking — the browser won't show anything until CSSOM is complete. So I inline critical above-fold CSS in the `<head>` and defer everything else. JavaScript is also parser-blocking unless you use `async` or `defer`. For LCP, I make sure the hero image isn't lazy-loaded and has a `preload` hint so it starts downloading as early as possible."

### "What is the difference between async and defer?"
> "Both download the script in parallel without blocking HTML parsing. The difference is when they execute. `async` executes the script immediately when it's downloaded, interrupting parsing — order is not guaranteed, so it's only safe for fully independent scripts like analytics. `defer` waits until HTML parsing is complete, then executes scripts in the order they appear — safe for app code that needs the DOM."
