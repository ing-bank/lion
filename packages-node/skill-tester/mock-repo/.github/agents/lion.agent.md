---
description: Implement @lion/ui features
tools: ['execute/getTerminalOutput', 'execute/runInTerminal', 'read/readFile', 'read/terminalSelection', 'read/terminalLastCommand', 'edit/editFiles', 'search', 'web/fetch',]
---

Explore project first, then invoke skills as needed to implement the feature. Refer to the component docs for best practices and patterns when using ING Web components.

## Components

All ING Web components are documented with detailed skill files in [`.github/agents/docs`](.github/agents/docs/). Each doc includes:
- **Attributes & properties** - All configurable options
- **Events and methods** - What events to listen to, and what methods you can call
- **Examples** - Real-world usage patterns
- **Accessibility info** - ARIA attributes, keyboard interaction, screen reader support
- **Related components** - What works well together

When implementing a feature, refer to these docs to understand how to use the components effectively and follow best practices.


Input: {
  "aliases" [
    'lion-input', 'input, 'text input', 'email input', 'date input', 'file input', 'iban input'
  ],
  "tool": "read/readFile",
  "args": {
    "path": "/.github/agents/docs/input/input.md"
  },
}

---


## Code structure & standards

### Dependency policy (important)

- Never add, install, or import anything from `@lion/*` directly (no `npm i @lion/...`, no `import ... from '@lion/...';`).
- Prefer `@lion/ui/*` entrypoints that already wrap/re-export the underlying Lion/lit utilities (e.g. `@lion/ui/core.js`, `@lion/ui/localize.js`, `@lion/ui/form.js`, and any existing `@lion/ui/*` validators/helpers).
- If an example you find uses `@lion/*`, translate it to the `@lion/ui/*` equivalent (or ask the user what the approved replacement is) instead of pulling Lion from npm.

### Core imports

- **DO:** `import { LitElement, html, css } from '@lion/ui/core.js';`
- **DON'T:** `import { LitElement, html, css } from 'lit';`

Always import core Lit utilities from `@lion/ui/core.js`, not from `lit` directly. This ensures consistency and gives access to @lion/ui's wrapped implementations.

### Forms
- Always use `lion-form` for forms, never a native `<form>`.
- When you want to detect input changes, use the `@model-value-changed` event on the relevant form fields.
- When you want to detect a submit on a form, use the `@submit` event on `lion-form`, not a native submit event.

---

## Rules
1. When making a new component, always make these in /src/components/{component-name}/index.js with the same folder structure for any related files (e.g. validators, helpers, styles).
2. When using components, always import from `@lion/ui/*` entrypoints, never from `@lion/*` directly.
3. Follow the patterns and best practices outlined in the component docs in `.github/agents/docs/` for any components you use.
4. For any user-facing features, ensure proper accessibility practices are followed (semantic HTML, ARIA attributes, keyboard navigation, screen reader support).
5. When in doubt, refer to the component docs or ask for clarification on best practices for using a specific component or feature.

---

## Example: Creating a Login Form

```js
import { LionForm } from '@lion/ui/form.js';
import { LionInputEmail } from '@lion/ui/input-email.js';
import { LionCheckboxGroup } from '@lion/ui/checkbox-group.js';
import { LionButton } from '@lion/ui/button.js';
```

```html
<lion-form @submit=${handleSubmit}>
  <!-- Name field -->
  <lion-input 
    name="name" 
    required 
    label="Name">
  </lion-input>

  <!-- Email field -->
  <lion-input 
    name="email"
    label="Email">
  </lion-input>`

  <!-- Submit button -->
  <lion-button type="submit" variation="filled">
    Create Account
  </lion-button>
</lion-form>

<!-- Key Points -->
✅ handle submit event with JavaScript
✅ Semantic structure — Proper accessibility tree
✅ aria-label — Descriptive labels for screen readers
✅ Related components — Each input type optimized for its purpose
```


---