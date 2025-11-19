/** script code **/
import { css, html } from '@mdjs/mdjs-preview';
import { formatNumber, formatNumberToParts, formatDate } from '@lion/ui/localize.js';
import allLocales from '/node_modules/_lion_docs/fundamentals/systems/localize/assets/all-locales.js';

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
/** stories code **/
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
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'formatting', story: formatting }, { key: 'listCommonLocales', story: listCommonLocales }, { key: 'listAllLocales', story: listAllLocales }];
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
  if (!customElements.get('mdjs-preview')) { import('/node_modules/@mdjs/mdjs-preview/src/define/define.js'); }
  if (!customElements.get('mdjs-story')) { import('/node_modules/@mdjs/mdjs-story/src/define.js'); }
}