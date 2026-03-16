# Template Literals

## Basic Syntax

Backticks instead of quotes. Embed any expression with `${ }`.

```javascript
const name = 'Alice';
const age = 30;

// Old way
console.log('Hello, ' + name + '! You are ' + age + ' years old.');

// Template literal
console.log(`Hello, ${name}! You are ${age} years old.`);
```

### Any expression works inside `${ }`

```javascript
const a = 5, b = 10;

`Sum: ${a + b}`              // "Sum: 15"
`Is adult: ${age >= 18}`     // "Is adult: true"
`Role: ${isAdmin ? 'admin' : 'user'}`  // ternary
`Items: ${arr.join(', ')}`   // method call
`Result: ${doSomething()}`   // function call
```

---

## Multi-line Strings

```javascript
// Old way — \n and concatenation
const html = '<div>\n  <p>Hello</p>\n</div>';

// Template literal — actual newlines preserved
const html = `
  <div>
    <p>Hello, ${name}</p>
  </div>
`;
// Note: the first newline after the backtick IS included
```

---

## Nesting Template Literals

```javascript
const items = ['apple', 'banana', 'cherry'];

const list = `
  <ul>
    ${items.map(item => `<li>${item}</li>`).join('\n    ')}
  </ul>
`;
```

---

## Tagged Templates

A tag is a function called with the template's parts. Allows custom processing.

```javascript
function tag(strings, ...values) {
  // strings → array of literal string segments
  // values  → array of interpolated expression results
  console.log(strings); // ['Hello, ', '! You are ', ' years old.']
  console.log(values);  // ['Alice', 30]
}

const name = 'Alice', age = 30;
tag`Hello, ${name}! You are ${age} years old.`;
```

### Practical tagged template: HTML escaping

```javascript
function safeHtml(strings, ...values) {
  const escaped = values.map(v =>
    String(v)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
  );
  return strings.reduce((result, str, i) => result + str + (escaped[i] ?? ''), '');
}

const userInput = '<script>alert("xss")</script>';
const html = safeHtml`<p>User said: ${userInput}</p>`;
// <p>User said: &lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;</p>
```

This is why libraries like `styled-components` use tagged templates:

```javascript
// styled-components uses a tag called `css`
const Button = styled.button`
  color: ${props => props.primary ? 'white' : 'black'};
  background: ${props => props.primary ? 'blue' : 'grey'};
`;
```

---

## Raw Strings

`String.raw` is a built-in tag that ignores escape sequences:

```javascript
// Normal — \n is a newline
console.log(`line1\nline2`);
// line1
// line2

// Raw — \n is literally backslash-n
console.log(String.raw`line1\nline2`);
// line1\nline2

// Useful for: regex patterns, Windows file paths
const path = String.raw`C:\Users\Alice\Documents`;
```

---

## XSS Risk — Important

Template literals do NOT escape HTML by default. Inserting user input directly into the DOM via innerHTML is dangerous:

```javascript
// DANGEROUS
element.innerHTML = `<p>Hello, ${userInput}</p>`; // XSS if userInput = <script>...

// SAFE — use textContent for plain text
element.textContent = userInput;

// SAFE — use a sanitization library or tagged template (see safeHtml above)
```

---

## Interview Answer

> "Template literals use backticks and allow embedded expressions with `${}`, multi-line strings, and tagged templates. Tagged templates let a function process the literal — used in styled-components, SQL query builders, and HTML sanitizers. The main security concern is that template literals don't escape HTML, so concatenating user input into innerHTML creates XSS vulnerabilities."

---

## Quick Reference

```
`${expr}`      → any JS expression interpolated
multi-line     → actual newlines preserved inside backticks
tagged         → fn`template` → fn(strings, ...values) for custom processing
String.raw     → built-in tag that disables escape sequences
XSS risk       → template literals don't sanitize HTML
```
