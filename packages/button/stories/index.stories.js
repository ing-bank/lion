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
    'Within a native form',
    () => html`
      <form
        @submit=${ev => {
          ev.preventDefault();
          console.log('submit handler');
        }}
      >
        <label for="firstNameId">First name</label>
        <input id="firstNameId" name="firstName" />
        <label for="lastNameId">Last name</label>
        <input id="lastNameId" name="lastName" />
        <lion-button @click=${() => console.log('click handler')}>Submit</lion-button>
      </form>
      <p>
        Supports the following use cases:
      </p>
      <ul>
        <li>
          Submit on button click
        </li>
        <li>
          Reset native form fields when using type="reset"
        </li>
        <li>
          Submit on button enter or space keypress
        </li>
        <li>
          Submit on enter keypress inside an input
        </li>
      </ul>
      <p>Important notes:</p>
      <ul>
        <li>
          A (lion)-button of type submit is mandatory for the last use case, if you have multiple
          inputs. This is native behavior.
        </li>
        <li>
          <span style="background-color: azure">
            <code>@click</code> on <code>lion-button</code>
          </span>
          and
          <span style="background-color: seashell">
            <code>@submit</code> on <code>form</code>
          </span>
          are triggered by these use cases. We strongly encourage you to listen to the submit
          handler if your goal is to do something on form-submit
        </li>
        <li>
          To prevent form submission full page reloads, add a <b>submit handler on the form</b>
          <code>@submit</code> with <code>event.preventDefault()</code>. Adding it on the
          <code>lion-button</code> is not enough.
        </li>
      </ul>
    `,
  );
