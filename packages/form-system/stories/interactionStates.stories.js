import '@lion/checkbox-group/lion-checkbox-group.js';
import '@lion/checkbox/lion-checkbox.js';
import { render } from '@lion/core';
import '@lion/form/lion-form.js';
import '@lion/input/lion-input.js';
import { Validator } from '@lion/validate';
import { html, storiesOf } from '@open-wc/demoing-storybook';
import './helper-wc/h-output.js';

function renderOffline(litHtmlTemplate) {
  const offlineRenderContainer = document.createElement('div');
  render(litHtmlTemplate, offlineRenderContainer);
  return offlineRenderContainer.firstElementChild;
}

storiesOf('Form Fundaments|Interaction States')
  .add(
    'States',
    () => html`
      <lion-input
        label="Interaction States"
        help-text="Interact with this field to see how dirty, touched and prefilled change"
        .modelValue="${'myValue'}"
      >
        <input slot="input" />
      </lion-input>

      <h-output .show="${['touched', 'dirty', 'prefilled', 'focused', 'filled', 'submitted']}">
      </h-output>
    `,
  )
  .add('Feedback condition', () => {
    // 1. Initialize variables...
    // properties on InteractionStateMixin we want to check conditions for
    const props = ['touched', 'dirty', 'prefilled', 'focused', 'filled', 'submitted'];

    // Here we will store the conditions (trigger for validation feedback)
    // provided via the UI of the demo
    let conditions = [];

    // 2. Create a validator...
    // Define a demo validator that should only be visible on an odd amount of characters
    // const OddValidator = [modelValue => ({ odd: modelValue.length % 2 !== 0 })];
    class OddValidator extends Validator {
      constructor(...args) {
        super(...args);
        this.name = 'OddValidator';
      }

      // eslint-disable-next-line class-methods-use-this
      execute(value) {
        let hasError = false;
        if (!(value.length % 2 !== 0)) {
          hasError = true;
        }
        return hasError;
      }

      _getMessage() {
        return 'Add or remove one character';
      }
    }

    // 3. Create field overriding .showErrorCondition...
    // Here we will store a reference to the Field element that overrides the default condition
    // (function `showErrorCondition`) for triggering validation feedback of `.validators`
    const fieldElement = renderOffline(html`
      <lion-input
        name="interactionField"
        label="Only an odd amount of characters allowed"
        help-text="Change feedback condition"
        .modelValue="${'notodd'}"
        .validators="${[new OddValidator()]}"
        .showErrorCondition="${newStates =>
          newStates.errorStates && conditions.every(p => fieldElement[p])}"
      >
        <input slot="input" />
      </lion-input>
    `);

    function fetchConditionsAndReevaluate({ currentTarget: { modelValue } }) {
      if (!modelValue['props[]']) {
        return;
      }
      // Create props list like: ['touched', 'submitted']
      conditions = modelValue['props[]'].filter(p => p.checked).map(p => p.value);
      // Reevaluate
      fieldElement.validate();
    }

    return html`
      <lion-form>
        <form>
          ${fieldElement}
          <button>Submit</button>
        </form>
      </lion-form>

      <h-output .field="${fieldElement}" .show="${[...props, 'hasFeedbackFor']}"> </h-output>

      <h3>
        Set conditions for validation feedback visibility
      </h3>

      <lion-checkbox-group name="props" @model-value-changed="${fetchConditionsAndReevaluate}">
        ${props.map(
          p => html`
            <lion-checkbox name="props[]" .label="${p}" .choiceValue="${p}"> </lion-checkbox>
          `,
        )}
      </lion-checkbox-group>
    `;
  });
