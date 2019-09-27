import { storiesOf, html } from '@open-wc/demoing-storybook';
import { css } from '@lion/core';
import { formatNumber, formatNumberToParts } from '../index.js';

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

storiesOf('Localize System|Number', module)
  .add(
    'formatNumber',
    () => html`
      <style>
        ${formatNumberDemoStyle}
      </style>
      <p>Formatted value is ${value}</p>
      <table class="demo-table">
        <thead>
          <tr>
            <th>Options</th>
            <th>Code</th>
            <th>Output</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Default</td>
            <td></td>
            <td>${formatNumber(value)}</td>
          </tr>
          <tr>
            <td>Currency symbol</td>
            <td>
              <code
                >formatNumber({ style: 'currency', currencyDisplay: 'symbol', currency: 'EUR'
                })</code
              >
            </td>
            <td>
              ${formatNumber(value, {
                style: 'currency',
                currencyDisplay: 'symbol',
                currency: 'EUR',
              })}
            </td>
          </tr>
          <tr>
            <td>Currency code</td>
            <td>
              <code
                >formatNumber({ style: 'currency', currencyDisplay: 'code', currency: 'EUR' })</code
              >
            </td>
            <td>
              ${formatNumber(value, {
                style: 'currency',
                currencyDisplay: 'code',
                currency: 'EUR',
              })}
            </td>
          </tr>
          <tr>
            <td>Locale</td>
            <td><code>formatNumber({ locale: 'nl-NL' })</code></td>
            <td>${formatNumber(value, { locale: 'nl-NL' })}</td>
          </tr>
          <tr>
            <td>No decimals</td>
            <td>
              <code>formatNumber({ minimumFractionDigits: 0, maximumFractionDigits: 0, })</code>
            </td>
            <td>
              ${formatNumber(value, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </td>
          </tr>
        </tbody>
      </table>
    `,
  )
  .add(
    'formatNumberToParts',
    () => html`
      <style>
        ${formatNumberDemoStyle}
      </style>
      <p>Formatted value is ${value}</p>
      <table class="demo-table">
        <thead>
          <tr>
            <th>Part</th>
            <th>Output</th>
          </tr>
        </thead>
        <tbody>
          ${formatNumberToParts(value, { style: 'currency', currency: 'EUR' }).map(
            part => html`
              <tr>
                <td>${part.type}</td>
                <td>${part.value}</td>
              </tr>
            `,
          )}
        </tbody>
      </table>
    `,
  )
  .add(
    'Common locales',
    () => html`
      <style>
        ${formatNumberDemoStyle}
      </style>
      <p>Formatted value is ${value}</p>
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
                <td>${formatNumber(value, { locale, style: 'currency', currency: 'EUR' })}</td>
                <td>${formatNumber(value, { locale, style: 'currency', currency: 'USD' })}</td>
              </tr>
            `,
          )}
        </tbody>
      </table>
    `,
  );
