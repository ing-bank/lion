/** script code **/
import { html, css } from '@mdjs/mdjs-preview';
import { formatNumber, formatNumberToParts } from '@lion/ui/localize.js';
import allLocales from '@lion/demo-systems/localize/assets/all-locales.js';

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
/** stories code **/
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
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'formatting', story: formatting }, { key: 'formattingParts', story: formattingParts }, { key: 'listCommonLocales', story: listCommonLocales }, { key: 'listAllLocales', story: listAllLocales }];
let needsMdjsElements = false;
for (const story of stories) {
  const storyEl = rootNode.querySelector(`[mdjs-story-name="${story.key}"]`);
  if (storyEl) {
    storyEl.story = story.story;
    storyEl.key = story.key;
    needsMdjsElements = true;
    Object.assign(storyEl, {"simulatorUrl":"/next/simulator/","languages":[{"key":"de-DE","name":"German"},{"key":"en-GB","name":"English (United Kingdom)"},{"key":"en-US","name":"English (United States)"},{"key":"nl-NL","name":"Dutch"}]});
  }
};
if (needsMdjsElements) {
  if (!customElements.get('mdjs-preview')) { import('@mdjs/mdjs-preview/define'); }  if (!customElements.get('mdjs-story')) { import('@mdjs/mdjs-story/define'); }}