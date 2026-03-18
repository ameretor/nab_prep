# ARIA — Accessible Rich Internet Applications

## What is ARIA?

ARIA is a set of HTML attributes defined by the W3C that **add semantic meaning to elements** so assistive technologies (screen readers, braille displays, voice control software) can understand and announce them correctly.

Without ARIA, a `<div>` that behaves like a button is invisible to a screen reader — it's just a box. ARIA bridges that gap.

```html
<!-- Screen reader sees: "div" — no role, no context -->
<div onclick="openMenu()">Menu</div>

<!-- Screen reader sees: "Menu, button" — role + label -->
<div role="button" aria-label="Menu" onclick="openMenu()">Menu</div>
```

> **Golden rule**: Use native HTML elements first. ARIA is a fallback for when native semantics aren't enough.
> `<button>` is always better than `<div role="button">`.

---

## The 3 Types of ARIA Attributes

### 1. `role` — What is this element?

Overrides or adds semantic meaning to an element.

```html
<div role="button">Click me</div>
<ul role="tablist">...</ul>
<div role="dialog" aria-modal="true">...</div>
```

**Role categories:**

| Category | Examples | Purpose |
|---|---|---|
| **Landmark** | `banner`, `main`, `navigation`, `complementary`, `contentinfo`, `search` | Page regions — let users jump around the page |
| **Widget** | `button`, `checkbox`, `slider`, `tab`, `menuitem`, `tooltip`, `dialog` | Interactive controls |
| **Document structure** | `list`, `listitem`, `table`, `row`, `heading`, `img` | Content structure |
| **Live region** | `alert`, `log`, `status`, `timer` | Dynamically updated content |
| **Abstract** | `command`, `input`, `range`, `widget` | Base types — never used directly |

---

### 2. `aria-*` properties — What describes this element?

Static descriptive information that rarely changes.

| Attribute | Purpose | Example |
|---|---|---|
| `aria-label` | Invisible name for the element | `<button aria-label="Close dialog">X</button>` |
| `aria-labelledby` | Points to another element that names this one | `<input aria-labelledby="email-label">` |
| `aria-describedby` | Points to an element with longer description | `<input aria-describedby="password-hint">` |
| `aria-required` | Field must be filled | `<input aria-required="true">` |
| `aria-controls` | This element controls another | `<button aria-controls="panel-1">` |
| `aria-owns` | Declares a parent-child relationship not in DOM | `<ul role="tree" aria-owns="child-list">` |
| `aria-haspopup` | Element opens a popup/menu | `<button aria-haspopup="menu">` |
| `aria-roledescription` | Custom human-readable role name | `<div aria-roledescription="slide">` |
| `aria-keyshortcuts` | Keyboard shortcut associated | `aria-keyshortcuts="Alt+Shift+P"` |

---

### 3. `aria-*` states — What is the current condition?

Dynamic values that change as the user interacts.

| Attribute | Values | Use case |
|---|---|---|
| `aria-expanded` | `true` / `false` | Accordion, dropdown open/closed |
| `aria-checked` | `true` / `false` / `mixed` | Checkbox, toggle state |
| `aria-selected` | `true` / `false` | Tab, listbox item selected |
| `aria-pressed` | `true` / `false` / `mixed` | Toggle button |
| `aria-disabled` | `true` / `false` | Grayed-out/inactive element |
| `aria-hidden` | `true` / `false` | Hide from screen readers (still visible) |
| `aria-invalid` | `true` / `false` / `grammar` / `spelling` | Form validation error |
| `aria-busy` | `true` / `false` | Content is loading/updating |
| `aria-current` | `page` / `step` / `date` / `true` | Current item in a set (e.g., active nav link) |
| `aria-live` | `off` / `polite` / `assertive` | How urgently to announce dynamic updates |
| `aria-atomic` | `true` / `false` | Announce the whole region or just changed part |
| `aria-relevant` | `additions` / `removals` / `text` / `all` | What changes trigger announcement |

---

## Common ARIA Patterns

### Accordion
```html
<button aria-expanded="false" aria-controls="section-1">Section 1</button>
<div id="section-1" aria-hidden="true">Content here</div>
```

### Modal Dialog
```html
<div role="dialog" aria-modal="true" aria-labelledby="dialog-title">
  <h2 id="dialog-title">Confirm Delete</h2>
  <p>Are you sure?</p>
  <button>Yes</button>
  <button>No</button>
</div>
```

### Tab Panel
```html
<div role="tablist" aria-label="Settings">
  <button role="tab" aria-selected="true" aria-controls="panel-profile">Profile</button>
  <button role="tab" aria-selected="false" aria-controls="panel-security">Security</button>
</div>
<div role="tabpanel" id="panel-profile">...</div>
<div role="tabpanel" id="panel-security" hidden>...</div>
```

### Live Region (notifications/toasts)
```html
<!-- polite: waits until user is idle to announce -->
<div aria-live="polite" aria-atomic="true" id="status-message"></div>

<!-- assertive: interrupts immediately — use sparingly -->
<div role="alert">Your session is about to expire.</div>
```

### Form Validation
```html
<label for="email">Email</label>
<input id="email" type="email" aria-required="true" aria-invalid="true" aria-describedby="email-error">
<span id="email-error" role="alert">Please enter a valid email.</span>
```

---

## Landmark Roles — Page Navigation

Screen reader users can jump between landmarks with a single keystroke.

```html
<header role="banner">          <!-- top of page, site-wide -->
  <nav role="navigation">...</nav>
</header>

<main role="main">              <!-- primary content -->
  <section aria-labelledby="section-heading">
    <h2 id="section-heading">News</h2>
  </section>
</main>

<aside role="complementary">   <!-- sidebar, related content -->
<form role="search">           <!-- search widget -->
<footer role="contentinfo">    <!-- copyright, links at bottom -->
```

> In HTML5, semantic elements (`<header>`, `<main>`, `<nav>`, etc.) have these roles implicitly — you don't need to add `role` to them. Only add `role` when using non-semantic elements.

---

## Why ARIA Matters

1. **Legal compliance** — WCAG 2.1 AA is required by law in many countries (ADA in the US, EN 301 549 in the EU). NAB as a bank must meet this.
2. **Screen readers** — 7+ million people in the US alone use screen readers (NVDA, JAWS, VoiceOver).
3. **Keyboard navigation** — Users who can't use a mouse rely on focus management that ARIA enables.
4. **SEO** — Search engines partially use semantic meaning; accessible sites tend to rank better.
5. **Senior engineer signal** — Mentioning ARIA unprompted in a frontend interview shows depth.

---

## Interview Talking Points

- "ARIA doesn't change visual presentation or behavior — it only adds semantic metadata for assistive tech."
- "First rule of ARIA: don't use ARIA if a native HTML element does the job."
- `aria-hidden="true"` removes an element from the accessibility tree but it stays visible — opposite of `display: none` which removes from both.
- `aria-label` vs `aria-labelledby`: label is inline text, labelledby references another element's text.
- `role="alert"` is implicitly `aria-live="assertive"` — screen readers announce it immediately.
