import { storiesOf, html } from '@open-wc/demoing-storybook';

import '../lion-select.js';

storiesOf('Forms|Select', module)
  .add(
    'Default',
    () => html`
      <lion-debug-viewer></lion-debug-viewer>
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
    const submit = () => {
      const form = document.querySelector('#form');
      if (form.errorState === false) {
        console.log(form.serializeGroup());
      }
    };
    return html`
      <lion-form id="form" @submit="${submit}"
        ><form>
          <lion-select id="color" name="color" .errorValidators="${[['required']]}">
            <label slot="label">Favorite color</label>
            <select slot="input">
              <option selected hidden value>Please select</option>
              <option value="red">Red</option>
              <option value="hotpink">Hotpink</option>
              <option value="teal">Teal</option>
            </select>
          </lion-select>
          <button type="submit">Submit</button>
        </form></lion-form
      >
    `;
  });
