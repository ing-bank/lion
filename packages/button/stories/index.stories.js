// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf, html, action } from '@open-wc/storybook';
import { bug12 } from '@lion/icon/stories/icons/bugs-collection';
import '@lion/icon/lion-icon.js';
import '@lion/form/lion-form.js';
import '@lion/input/lion-input.js';

import '../lion-button.js';

storiesOf('Buttons|<lion-button>', module)
  .add(
    'Used on its own',
    () => html`
      <style>
        .demo-box {
          display: flex;
          padding: 8px;
        }

        lion-button {
          margin: 8px;
        }
      </style>
      <div class="demo-box">
        <lion-button>Default</lion-button>
        <lion-button><lion-icon .svg="${bug12}"></lion-icon>Debug</lion-button>
        <lion-button type="submit">Submit</lion-button>
        <lion-button aria-label="Debug"><lion-icon .svg="${bug12}"></lion-icon></lion-button>
        <lion-button onclick="alert('clicked/spaced/entered')">click/space/enter me</lion-button>
        <lion-button disabled>Disabled</lion-button>
      </div>
    `,
  )
  .add(
    'Within a form',
    () => html`
      <lion-form id="form"
        ><form>
          <lion-input name="foo" label="Foo" .modelValue=${'bar'}></lion-input>
          <lion-button
            type="submit"
            @click=${() =>
              action('serializeGroup')(document.querySelector('#form').serializeGroup())}
            >Submit</lion-button
          >
        </form></lion-form
      >
    `,
  );
