# Systems >> Localize >> Format Numbers || 30

## Features

- Small file size
- Uses `Intl.NumberFormat` but patches browser inconsistencies

## Formatting

With the `formatNumber` you can safely display a number for all languages.

The input value is `1234.56`.

```js script
import { html, css } from '@lion/core';
import { formatNumber, formatNumberToParts } from '@lion/localize';
import allLocales from './assets/all-locales.js';

const formatNumberDemoStyle = css`
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
const value = 1234.56;
```

```js preview-story
export const formatting = () => html`
  <style>
    ${formatNumberDemoStyle}
  </style>
  <table class="demo-table">
    <thead>
      <tr>
        <th>Options</th>
        <th>Output</th>
        <th>Code</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Default</td>
        <td>${formatNumber(value)}</td>
        <td></td>
      </tr>
      <tr>
        <td>Currency symbol</td>
        <td>
          ${formatNumber(value, {
            style: 'currency',
            currencyDisplay: 'symbol',
            currency: 'EUR',
          })}
        </td>
        <td>
          <code
            >formatNumber({ style: 'currency', currencyDisplay: 'symbol', currency: 'EUR' })</code
          >
        </td>
      </tr>
      <tr>
        <td>Currency code</td>
        <td>
          ${formatNumber(value, {
            style: 'currency',
            currencyDisplay: 'code',
            currency: 'EUR',
          })}
        </td>
        <td>
          <code>formatNumber({ style: 'currency', currencyDisplay: 'code', currency: 'EUR' })</code>
        </td>
      </tr>
      <tr>
        <td>Locale</td>
        <td>${formatNumber(value, { locale: 'nl-NL' })}</td>
        <td><code>formatNumber({ locale: 'nl-NL' })</code></td>
      </tr>
      <tr>
        <td>No decimals</td>
        <td>
          ${formatNumber(value, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
        </td>
        <td>
          <code>formatNumber({ minimumFractionDigits: 0, maximumFractionDigits: 0, })</code>
        </td>
      </tr>
    </tbody>
  </table>
`;
```

## Formatting parts

`formatNumberToParts` allows to get individual parts of a number on all browsers.

The input value `1234.56` gets formatted via

```js
formatNumberToParts(value, { style: 'currency', currency: 'EUR' });
```

```js preview-story
export const formattingParts = () => html`
  <style>
    ${formatNumberDemoStyle}
  </style>
  <table class="demo-table">
    <thead>
      <tr>
        <th>Part</th>
        <th>Output</th>
      </tr>
    </thead>
    <tbody>
      ${formatNumberToParts(1234.56, { style: 'currency', currency: 'EUR' }).map(
        part => html`
          <tr>
            <td>${part.type}</td>
            <td>${part.value}</td>
          </tr>
        `,
      )}
    </tbody>
  </table>
`;
```

## List common locales

The input value is `1234.56`.
Formatting happens via

```js
formatNumber(1234.56, { locale, style: 'currency', currency: 'EUR' });
formatNumber(1234.56, { locale, style: 'currency', currency: 'USD' });
```

```js preview-story
export const listCommonLocales = () => html`
  <style>
    ${formatNumberDemoStyle}
  </style>
  <table class="demo-table">
    <thead>
      <tr>
        <th>Locale</th>
        <th>Output Euro</th>
        <th>Output US Dollar</th>
      </tr>
    </thead>
    <tbody>
      ${['en-GB', 'en-US', 'nl-NL', 'nl-BE', 'fr-FR', 'de-DE'].map(
        locale => html`
          <tr>
            <td>${locale}</td>
            <td>${formatNumber(1234.56, { locale, style: 'currency', currency: 'EUR' })}</td>
            <td>${formatNumber(1234.56, { locale, style: 'currency', currency: 'USD' })}</td>
          </tr>
        `,
      )}
    </tbody>
  </table>
`;
```

## List all locales

The following list show number formatting for all known locales.

The input value is `1234.56`.
Formatting happens via

```js
formatNumber(1234.56, { locale, style: 'currency', currency: 'EUR' });
formatNumber(1234.56, { locale, style: 'currency', currency: 'USD' });
```

```js preview-story
export const listAllLocales = () => html`
  <style>
    ${formatNumberDemoStyle}
  </style>
  <table class="demo-table">
    <tr>
      <th>Locale</th>
      <th>Output Euro</th>
      <th>Output US Dollar</th>
    </tr>
    ${Object.keys(allLocales).map(
      locale => html`
        <tr>
          <td>${locale}</td>
          <td>${formatNumber(1234.56, { locale, style: 'currency', currency: 'EUR' })}</td>
          <td>${formatNumber(1234.56, { locale, style: 'currency', currency: 'USD' })}</td>
        </tr>
      `,
    )}
  </table>
`;
```
