import { storiesOf, html } from '@open-wc/demoing-storybook';
import { bug12 } from '@lion/icon/stories/icons/bugs-collection.js';
import '@lion/icon/lion-icon.js';
import '@lion/form/lion-form.js';
import '@lion/input/lion-input.js';

import '../lion-button.js';

storiesOf('Buttons|Button', module)
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
        <lion-button @click="${e => console.log('clicked/spaced/entered', e)}">
          click/space/enter me and see log
        </lion-button>
        <lion-button disabled>Disabled</lion-button>
      </div>
    `,
  )
  .add(
    'Within a form',
    () => html`
      <form @submit=${() => console.log('native form submitted')}>
        <input name="foo" label="Foo" .modelValue=${'bar'} />
        <input name="foo2" label="Foo2" .modelValue=${'bar'} />
        <lion-button
          type="submit"
          @click=${() => console.log(document.querySelector('#form').serializeGroup())}
          >Submit</lion-button
        >
      </form>
    `,
  );
