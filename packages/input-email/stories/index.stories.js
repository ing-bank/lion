import { Validator } from '@lion/validate';
import { html, storiesOf } from '@open-wc/demoing-storybook';
import '../../fieldset/lion-fieldset.js';
import '../lion-input-email.js';

storiesOf('Forms|Input Email')
  .add(
    'Default',
    () => html`
      <lion-input-email name="email" label="Label"></lion-input-email>
    `,
  )
  .add(
    'Faulty prefilled',
    () => html`
      <lion-input-email .modelValue=${'foo'} label="Email"></lion-input-email>
    `,
  )
  .add('Custom validator', () => {
    class GmailOnly extends Validator {
      constructor(...args) {
        super(...args);
        this.name = 'GmailOnly';
      }

      execute(value) {
        let hasError = false;
        if (!(value.indexOf('gmail.com') !== -1)) {
          hasError = true;
        }
        return hasError;
      }

      static async getMessage() {
        return 'You can only use gmail.com email addresses.';
      }
    }

    return html`
      <lion-input-email
        .modelValue=${'foo@bar.com'}
        .validators=${[new GmailOnly()]}
        label="Email"
      ></lion-input-email>
    `;
  });
