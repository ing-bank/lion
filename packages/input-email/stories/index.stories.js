import { storiesOf, html } from '@open-wc/demoing-storybook';

import { localize } from '@lion/localize';

import '../lion-input-email.js';

storiesOf('Forms|Input Email', module)
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
    const gmailOnly = modelValue => ({ gmailOnly: modelValue.indexOf('gmail.com') !== -1 });
    localize.locale = 'en-GB';

    try {
      localize.addData('en', 'lion-validate+gmailOnly', {
        error: {
          gmailOnly: 'You can only use gmail.com email addresses.',
        },
      });
      localize.addData('nl', 'lion-validate+gmailOnly', {
        error: {
          gmailOnly: 'Je mag hier alleen gmail.com e-mailadressen gebruiken.',
        },
      });
    } catch (error) {
      // expected as it's a demo
    }

    return html`
      <lion-input-email
        .modelValue=${'foo@bar.com'}
        .errorValidators=${[[gmailOnly]]}
      ></lion-input-email>
    `;
  });
