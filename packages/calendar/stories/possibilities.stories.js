import { storiesOf, html } from '@open-wc/demoing-storybook';

import './POCs/two-month.js';

storiesOf('Calendar|Extension Possibilities', module).add('2 Month POC', () => {
  return html`
    <style>
      .demo-calendar {
        border: 1px solid #adadad;
        box-shadow: 0 0 16px #ccc;
        max-width: 500px;
      }
    </style>

    <two-month class="demo-calendar"></two-month>
  `;
});
