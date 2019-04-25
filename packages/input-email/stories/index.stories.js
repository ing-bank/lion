import { storiesOf, html } from '@open-wc/storybook';

import { localize } from '@lion/localize';

import '../lion-input-email.js';

storiesOf('Forms|<lion-input-email>', module)
  .add(
    'Default',
    () => html`
      <lion-input-email></lion-input-email>
    `,
  )
  .add(
    'Faulty prefilled',
    () => html`
      <lion-input-email .modelValue=${'foo'}></lion-input-email>
    `,
  )
  .add('Use own validator', () => {
    const ingOnly = modelValue => ({ ingOnly: modelValue.indexOf('ing.com') !== -1 });
    localize.locale = 'en';

    try {
      localize.addData('en', 'lion-validate+ingOnly', {
        error: {
          ingOnly: 'You can only use ing.com email addresses.',
        },
      });
      localize.addData('nl', 'lion-validate+ingOnly', {
        error: {
          ingOnly: 'Je mag hier alleen ing.com e-mailadressen gebruiken.',
        },
      });
    } catch (error) {
      // expected as it's a demo
    }

    return html`
      <lion-input-email
        .modelValue=${'foo@bar.com'}
        .errorValidators=${[[ingOnly]]}
      ></lion-input-email>
    `;
  });
