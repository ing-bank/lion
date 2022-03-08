# Navigation >> Breadcrumb >> Overview ||20

A breadcrumb trail consists of a list of links to the parent pages of the current page in hierarchical order. It helps users find their place within a website or web application. Breadcrumbs are often placed horizontally before a page's main content.

```js script
import { html } from '@mdjs/mdjs-preview';
import '@lion/breadcrumb/define';
```

```js preview-story
export const main = () => html`
  <lion-breadcrumb>
    <a href="../../../../">Home</a>
    <a href="../../../">Components</a>
    <a href="../../">Navigation</a>
    <a href="../">Breadcrumb</a>
    <span>Overview</span>
  </lion-breadcrumb>
`;
```

## Features

- Handles accessibility
- Custom separators via CSS

## Installation

```bash
npm i --save @lion/breadcrumb
```

```js
import { LionBreadcrumb } from '@lion/breadcrumb';
// or
import '@lion/breadcrumb';
```
