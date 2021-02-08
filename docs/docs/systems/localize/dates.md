# Systems >> Localize >> Format Dates || 40

## Features

- Small file size
- Uses `Intl.DateFormat` but patches browser inconsistencies

## Formatting

With the `formatDate` you can safely display dates for all languages.

The input value is `new Date('1987/05/12')`.

```js script
import { css, html } from '@lion/core';
import { formatNumber, formatNumberToParts, formatDate } from '@lion/localize';
import allLocales from './assets/all-locales.js';

const formatDateDemoStyle = css`
  .demo-table {
    border-collapse: collapse;
    text-align: right;
  }
  .demo-table thead > tr {
    border-bottom: 1px solid grey;
  }
  .demo-table thead > tr > :first-child,
  .demo-table tbody > tr > :first-child,
  .demo-table tfoot > tr > :first-child {
    text-align: left;
  }
  .demo-table th,
  .demo-table td {
    padding: 8px;
  }
`;
```

```js preview-story
export const formatting = () => html`
  <style>
    ${formatDateDemoStyle}
  </style>
  <table class="demo-table">
    <thead>
      <tr>
        <th>Output</th>
        <th>Options</th>
        <th>Code</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>${formatDate(new Date('1987/05/12'))}</td>
        <td>Default</td>
        <td><code>formatDate(new Date('1987/05/12'))</code></td>
      </tr>
      <tr>
        <td>
          ${formatDate(new Date('1987/05/12'), {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: '2-digit',
          })}
        </td>
        <td>Date display</td>
        <td>
          <code
            >formatDate(new Date(){weekday:'long',year:'numeric',month:'long',day:'2-digit'})</code
          >
        </td>
      </tr>
      <tr>
        <td>
          ${formatDate(new Date('1987/05/12'), {
            weekday: 'long',
            month: 'long',
            day: '2-digit',
          })}
        </td>
        <td>Date without year</td>
        <td>
          <code>
            formatDate(new Date('1987/05/12'), {weekday:'long',month:'long',day:'2-digit'})
          </code>
        </td>
      </tr>
      <tr>
        <td>
          ${formatDate(new Date('1987/05/12'), {
            weekday: 'long',
            year: 'numeric',
            day: '2-digit',
          })}
        </td>
        <td>Date without month</td>
        <td>
          <code>
            formatDate(new Date('1987/05/12'), {weekday:'long',year:'numeric',day:'2-digit'})
          </code>
        </td>
      </tr>
      <tr>
        <td>
          ${formatDate(new Date('1987/05/12'), {
            weekday: 'long',
            month: 'long',
            year: 'numeric',
          })}
        </td>
        <td>Date without day</td>
        <td>
          <code>
            formatDate(new Date('1987/05/12'), { weekday:'long',year:'numeric',month:'long' })
          </code>
        </td>
      </tr>
      <tr>
        <td>${formatDate(new Date('1987/05/12'), { locale: 'nl-NL' })}</td>
        <td>Locale</td>
        <td><code>formatDate(new Date('1987/05/12'){ locale:'nl-NL' })</code></td>
      </tr>
    </tbody>
  </table>
`;
```

## List common locales

The input value is `new Date('1987/05/12')`.
Formatting happens via

```js
formatDate(new Date('1987/05/12'), { locale });
```

```js preview-story
export const listCommonLocales = () => html`
  <style>
    ${formatDateDemoStyle}
  </style>
  <table class="demo-table">
    <thead>
      <tr>
        <th>Locale</th>
        <th>Output</th>
      </tr>
    </thead>
    <tbody>
      ${['en-GB', 'en-US', 'nl-NL', 'nl-BE', 'fr-FR', 'de-DE'].map(
        locale => html`
          <tr>
            <td>${locale}</td>
            <td>${formatDate(new Date('1987/05/12'), { locale })}</td>
          </tr>
        `,
      )}
    </tbody>
  </table>
`;
```

## List all locales

The following list shows date formatting for all known locales.

The input value is `new Date('1987/05/12')`.
Formatting happens via

```js
formatDate(new Date('1987/05/12'), { locale });
```

```js preview-story
export const listAllLocales = () => html`
  <style>
    ${formatDateDemoStyle}
  </style>
  <table class="demo-table">
    <tr>
      <th>Locale</th>
      <th>Output</th>
    </tr>
    ${Object.keys(allLocales).map(
      locale => html`
        <tr>
          <td>${locale}</td>
          <td>${formatDate(new Date('1987/05/12'), { locale })}</td>
        </tr>
      `,
    )}
  </table>
`;
```
