import { storiesOf, html } from '@open-wc/demoing-storybook';
import { Required } from '@lion/validate';

import '../lion-select.js';

storiesOf('Forms|Select', module)
  .add(
    'Default',
    () => html`
      <lion-select>
        <div slot="label">Favorite color</div>
        <select slot="input">
          <option selected hidden value>Please select</option>
          <option value="red">Red</option>
          <option value="hotpink">Hotpink</option>
          <option value="teal">Teal</option>
        </select>
      </lion-select>
    `,
  )
  .add(
    'Disabled',
    () => html`
      <lion-select disabled>
        <div slot="label">Favorite color</div>
        <select slot="input">
          <option selected hidden value>Please select</option>
          <option value="red">Red</option>
          <option value="hotpink">Hotpink</option>
          <option value="teal">Teal</option>
        </select>
      </lion-select>
    `,
  )
  .add(
    'Pre selected',
    () => html`
      <lion-select .modelValue=${'teal'}>
        <div slot="label">Favorite color</div>
        <select slot="input">
          <option selected hidden value>Please select</option>
          <option value="red">Red</option>
          <option value="hotpink">Hotpink</option>
          <option value="teal">Teal</option>
        </select>
      </lion-select>
    `,
  )
  .add('Validation', () => {
    const validate = () => {
      const select = document.querySelector('#color');
      select.submitted = !select.submitted;
    };
    return html`
      <lion-select id="color" name="color" .validators="${[new Required()]}">
        <label slot="label">Favorite color</label>
        <select slot="input">
          <option selected hidden value>Please select</option>
          <option value="red">Red</option>
          <option value="hotpink">Hotpink</option>
          <option value="teal">Teal</option>
        </select>
      </lion-select>
      <button @click="${() => validate()}">Validate</button>
    `;
  });
