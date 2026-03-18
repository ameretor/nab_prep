# Accessibility (a11y) — Theory & Interview Prep

## Core Principle: The Accessibility Tree

The browser builds an **Accessibility Tree** in parallel with the DOM. Screen readers and assistive technologies read this tree, NOT the DOM.

```
DOM node → (if accessible) → Accessibility node
                              - role (button, link, heading, etc.)
                              - name (label)
                              - state (checked, expanded, disabled)
                              - value
```

`display: none` → **excluded** from accessibility tree (invisible to screen readers)
`visibility: hidden` → **excluded** from accessibility tree
`aria-hidden="true"` → **excluded** from accessibility tree explicitly

---

## WCAG Guidelines

**WCAG** = Web Content Accessibility Guidelines (by W3C)

### 4 Principles (POUR)
- **P**erceivable — content can be seen or heard
- **O**perable — UI can be navigated (keyboard, switch access)
- **U**nderstandable — content is clear and predictable
- **R**obust — works across assistive technologies

### Conformance Levels
| Level | What it means |
|-------|--------------|
| A | Minimum — essential issues only |
| AA | Standard target — required by most legal frameworks (ADA, WCAG 2.1 AA) |
| AAA | Highest — aspirational, not required for general content |

**NAB target:** WCAG 2.1 AA (banking is regulated — a11y is a legal requirement)

---

## Semantic HTML First

**The golden rule:** Use native HTML elements — they come with free ARIA roles and keyboard behavior.

```html
<!-- Bad — div doesn't have role, keyboard support, or activation -->
<div onclick="submit()">Submit</div>

<!-- Good — button is keyboard-accessible, activatable by Enter/Space, has role="button" -->
<button type="button" onclick="submit()">Submit</button>
```

**Semantic elements and their implicit ARIA roles:**
| Element | Implicit Role |
|---------|--------------|
| `<button>` | button |
| `<a href="...">` | link |
| `<input type="checkbox">` | checkbox |
| `<nav>` | navigation |
| `<main>` | main |
| `<header>` (in body) | banner |
| `<footer>` (in body) | contentinfo |
| `<aside>` | complementary |
| `<form>` | form |
| `<h1>`–`<h6>` | heading (level 1–6) |

---

## ARIA — When and How

**Rule #1: No ARIA is better than bad ARIA.**
ARIA can break accessibility if misused. Start with semantic HTML; add ARIA only when HTML can't express the pattern.

### The 5 Rules of ARIA (W3C)
1. Don't use ARIA if a native HTML element or attribute can do the same thing
2. Don't change native semantics unless absolutely necessary
3. All interactive ARIA controls must be keyboard accessible
4. Don't suppress focusable elements from the accessibility tree (`aria-hidden="true"` on focusable elements is wrong)
5. All interactive elements must have an accessible name

### Common ARIA Patterns

```html
<!-- Button with icon only — needs accessible name -->
<button aria-label="Close dialog">
  <svg aria-hidden="true">...</svg>
</button>

<!-- Expandable section -->
<button aria-expanded="false" aria-controls="section1">
  Toggle Section
</button>
<div id="section1" hidden>Content</div>

<!-- Live region — announces dynamic content to screen readers -->
<div aria-live="polite" aria-atomic="true">
  <!-- Status messages go here — screen reader announces changes -->
</div>

<!-- Error state on form field -->
<input type="email" aria-describedby="email-error" aria-invalid="true">
<span id="email-error" role="alert">Please enter a valid email</span>
```

---

## Keyboard Navigation

**The basics screen readers test:**
- `Tab` / `Shift+Tab` — move focus forward/backward through interactive elements
- `Enter` / `Space` — activate buttons; `Enter` for links
- `Escape` — close dialogs/overlays
- Arrow keys — navigate within components (menu, listbox, radio group)

**When to manage focus manually:**
1. Opening a modal → move focus to the first focusable element inside
2. Closing a modal → return focus to the trigger button
3. SPA navigation → move focus to the main heading of the new page
4. Dynamic content insertion above current focus → announce via live region

**Focus trap in a modal:**
```js
function trapFocus(element) {
  const focusable = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  element.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === first) { last.focus(); e.preventDefault(); }
    } else {
      if (document.activeElement === last) { first.focus(); e.preventDefault(); }
    }
  });
}
```

---

## Color & Contrast

**WCAG AA requirements:**
- Normal text (< 18pt / < 14pt bold): **4.5:1** contrast ratio
- Large text (≥ 18pt / ≥ 14pt bold): **3:1** contrast ratio
- UI components & graphics: **3:1**

**Never convey information with color alone** — also use icons, labels, or patterns.
```html
<!-- Bad — colorblind users can't distinguish -->
<span style="color: red">Error</span>

<!-- Good — color + icon + text -->
<span class="error"><span aria-hidden="true">⚠</span> Error: invalid email</span>
```

---

## How to Test Accessibility

**Three-layer approach:**

1. **Automated (CI-level)** — axe-core, @axe-core/react, Lighthouse
   - Catches ~30–35% of issues
   - Integrate in CI to fail on regressions

2. **Manual keyboard testing** — unplug the mouse
   - Tab through the entire UI
   - Check: can you reach everything? Is focus visible? Does every action work?

3. **Screen reader testing** — NVDA (Windows, free), VoiceOver (Mac, built-in)
   - Test critical flows: login, main navigation, form submission
   - Don't test every page — test the flows that matter

---

## Interview Model Answers

### "What is the accessibility tree?"
> "The accessibility tree is a parallel representation of the DOM that browsers expose to assistive technologies like screen readers. While the DOM has every element, the accessibility tree only contains nodes that have accessibility-relevant information — their role, name, state, and value. This is what screen readers navigate. When you add ARIA attributes, you're modifying this tree, not the DOM. That's why `aria-hidden='true'` removes an element from the screen reader even though it's still visible in the DOM."

### "When should you NOT use ARIA?"
> "When a native HTML element already does the job. The first rule of ARIA is: don't use it if a native element can do the same thing. A `<button>` already has role='button', keyboard activation with Enter and Space, and focus management built in. If you create a `<div role='button'>`, you have to manually add all of that via JavaScript. Bad ARIA is worse than no ARIA because it can mislead assistive technologies. I use ARIA only for custom widget patterns — like comboboxes, trees, or tab panels — where HTML has no native equivalent."

### "How do you handle focus in a single-page app (SPA)?"
> "In a traditional multi-page app, navigation moves focus to the top of the new page automatically. SPAs don't do that — the page doesn't reload, so focus stays wherever it was. I handle this by: after a route change, programmatically focusing the `<main>` landmark or the page's `<h1>`, using `tabIndex='-1'` to make it focusable without making it part of the tab order. I also update the page `<title>` on each route change so screen reader users hear what page they're on."
