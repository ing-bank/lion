import { storiesOf, html } from '@open-wc/demoing-storybook';
import { css } from '@lion/core';
import { formatDate } from '../index.js';

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

storiesOf('Localize System|Date', module).add(
  'formatDate',
  () => html`
    <style>
      ${formatDateDemoStyle}
    </style>
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
          <td><code>formatDate(new Date())</code></td>
          <td>${formatDate(new Date())}</td>
        </tr>
        <tr>
          <td>Date display</td>
          <td>
            <code
              >formatDate(new
              Date(){weekday:'long',year:'numeric',month:'long',day:'2-digit'})</code
            >
          </td>
          <td>
            ${formatDate(new Date(), {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: '2-digit',
            })}
          </td>
        </tr>
        <tr>
          <td>Date without year</td>
          <td>
            <code>
              formatDate(new Date(), {weekday:'long',month:'long',day:'2-digit'})
            </code>
          </td>
          <td>
            ${formatDate(new Date(), {
              weekday: 'long',
              month: 'long',
              day: '2-digit',
            })}
          </td>
        </tr>
        <tr>
          <td>Date without month</td>
          <td>
            <code>
              formatDate(new Date(), {weekday:'long',year:'numeric',day:'2-digit'})
            </code>
          </td>
          <td>
            ${formatDate(new Date(), {
              weekday: 'long',
              year: 'numeric',
              day: '2-digit',
            })}
          </td>
        </tr>
        <tr>
          <td>Date without day</td>
          <td>
            <code>
              formatDate(new Date(), {weekday:'long',year:'numeric',month:'long'})
            </code>
          </td>
          <td>
            ${formatDate(new Date(), {
              weekday: 'long',
              month: 'long',
              year: 'numeric',
            })}
          </td>
        </tr>
        <tr>
          <td>Locale</td>
          <td><code>formatDate(new Date(){locale:'nl-NL'})</code></td>
          <td>${formatDate(new Date(), { locale: 'nl-NL' })}</td>
        </tr>
      </tbody>
    </table>
  `,
);
