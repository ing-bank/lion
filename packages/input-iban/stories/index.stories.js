import { html, storiesOf } from '@open-wc/demoing-storybook';
import { IsCountryIBAN } from '../index.js';
import '../lion-input-iban.js';

storiesOf('Forms|Input IBAN')
  .add(
    'Default',
    () => html`
      <lion-input-iban name="iban" label="IBAN"></lion-input-iban>
    `,
  )
  .add(
    'Prefilled',
    () => html`
      <lion-input-iban
        .modelValue=${'NL20INGB0001234567'}
        name="iban"
        label="IBAN"
      ></lion-input-iban>
    `,
  )
  .add(
    'Faulty prefilled',
    () => html`
      <lion-input-iban
        .modelValue=${'NL20INGB0001234567XXXX'}
        name="iban"
        label="IBAN"
      ></lion-input-iban>
    `,
  )
  .add(
    'Country restrictions',
    () => html`
      <lion-input-iban
        .modelValue=${'DE89370400440532013000'}
        .validators=${[new IsCountryIBAN('NL')]}
        name="iban"
        label="IBAN"
      ></lion-input-iban>
    `,
  );
