import { storiesOf, html } from '@open-wc/demoing-storybook';

import { ajax } from '../src/ajax.js';
import { AjaxClass } from '../src/AjaxClass.js';

storiesOf('Ajax system|Ajax', module)
  .addParameters({ options: { selectedPanel: 'storybook/actions/actions-panel' } })
  .add(
    'Get',
    () => html`
      <button
        @click=${() => {
          ajax
            .get('./dummy-jsons/peter.json')
            .then(response => {
              console.log(response.data);
            })
            .catch(error => {
              console.log(error);
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
              console.log(response.data);
            })
            .catch(error => {
              console.log(error);
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
              console.log(response.data);
            })
            .catch(error => {
              console.log(error.message);
            });

          myAjax
            .get('./dummy-jsons/max.json')
            .then(response => {
              console.log(response.data);
            })
            .catch(error => {
              console.log(error.message);
            });
        }}
      >
        Execute 2 Request to Action Logger
      </button>
    `,
  );
