import { storiesOf, html, action } from '@open-wc/storybook';

import { ajax } from '../src/ajax.js';
import { AjaxClass } from '../src/AjaxClass.js';

/* eslint-disable indent */
storiesOf('Ajax system|ajax', module)
  .addParameters({ options: { selectedPanel: 'storybook/actions/actions-panel' } })
  .add(
    'Get',
    () => html`
      <button
        @click=${() => {
          ajax
            .get('./dummy-jsons/peter.json')
            .then(response => {
              action('request-response')(response.data);
            })
            .catch(error => {
              action('request-error')(error);
            });
        }}
      >
        Log Get Request to Action Logger
      </button>
    `,
  )
  .add(
    'Cancelable',
    () => html`
      <button
        @click=${() => {
          const myAjax = AjaxClass.getNewInstance({ cancelable: true });
          requestAnimationFrame(() => {
            myAjax.cancel('too slow');
          });

          myAjax
            .get('./dummy-jsons/peter.json')
            .then(response => {
              action('request-response')(response.data);
            })
            .catch(error => {
              action('request-error')(error);
            });
        }}
      >
        Execute Request to Action Logger
      </button>
    `,
  )
  .add(
    'CancelPreviousOnNewRequest',
    () => html`
      <button
        @click=${() => {
          const myAjax = AjaxClass.getNewInstance({ cancelPreviousOnNewRequest: true });
          myAjax
            .get('./dummy-jsons/peter.json')
            .then(response => {
              action('Request 1:')(response.data);
            })
            .catch(error => {
              action('Request 1: I got cancelled:')(error.message);
            });

          myAjax
            .get('./dummy-jsons/max.json')
            .then(response => {
              action('Request 2:')(response.data);
            })
            .catch(error => {
              action('Request 2: I got cancelled:')(error.message);
            });
        }}
      >
        Execute 2 Request to Action Logger
      </button>
    `,
  );
