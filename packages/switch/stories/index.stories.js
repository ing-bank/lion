import { Validator } from '@lion/validate';
import { html, storiesOf } from '@open-wc/demoing-storybook';
import '../lion-switch-button.js';
import '../lion-switch.js';

storiesOf('Buttons|Switch')
  .add(
    'Default',
    () => html`
      <lion-switch label="Label" help-text="Help text"></lion-switch>
    `,
  )
  .add(
    'Disabeld',
    () => html`
      <lion-switch label="Label" disabled></lion-switch>
    `,
  )
  .add('Validation', () => {
    class IsTrue extends Validator {
      constructor(...args) {
        super(...args);
        this.name = 'IsTrue';
      }

      execute(value) {
        return !value.checked;
      }

      static async getMessage() {
        return "You won't get the latest news!";
      }
    }
    return html`
      <lion-switch
        id="newsletterCheck"
        name="newsletterCheck"
        label="Subscribe to newsletter"
        .validators="${[new IsTrue()]}"
      ></lion-switch>
    `;
  })
  .add(
    'Button',
    () => html`
      <lion-switch-button aria-label="Toggle button"></lion-switch-button>
    `,
  );
