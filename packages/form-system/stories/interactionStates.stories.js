import { storiesOf, html } from '@open-wc/demoing-storybook';
import { render } from '@lion/core';
import { localize } from '@lion/localize';
import '@lion/checkbox/lion-checkbox.js';
import '@lion/checkbox-group/lion-checkbox-group.js';
import '@lion/form/lion-form.js';
import '@lion/input/lion-input.js';
import './helper-wc/h-output.js';

function renderOffline(litHtmlTemplate) {
  const offlineRenderContainer = document.createElement('div');
  render(litHtmlTemplate, offlineRenderContainer);
  return offlineRenderContainer.firstElementChild;
}

function addTranslations(ns, data) {
  if (!localize._isNamespaceInCache('en-GB', ns)) {
    localize.addData('en-GB', ns, data);
  }
}

storiesOf('Form Fundaments|Interaction States', module)
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
    const oddValidator = [modelValue => ({ odd: modelValue.length % 2 !== 0 })];

    addTranslations('lion-validate+odd', {
      error: {
        odd: '[ Error feedback ] : Add or remove one character',
      },
    });

    // 3. Create field overriding .showErrorCondition...
    // Here we will store a reference to the Field element that overrides the default condition
    // (function `showErrorCondition`) for triggering validation feedback of `.errorValidators`
    const fieldElement = renderOffline(html`
      <lion-input
        name="interactionField"
        label="Only an odd amount of characters allowed"
        help-text="Change feedback condition"
        .modelValue="${'notodd'}"
        .errorValidators="${[oddValidator]}"
        .showErrorCondition="${newStates =>
          newStates.error && conditions.every(p => fieldElement[p])}"
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

      <h-output .field="${fieldElement}" .show="${[...props, 'errorState']}"> </h-output>

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
