/** script code **/
import { html, render } from '@mdjs/mdjs-preview';
import { renderLitAsNode } from '@lion/ui/helpers.js';
import '@lion/ui/define/lion-input.js';
import '@lion/ui/define/lion-input-date.js';
import { Validator, Unparseable, MinDate, Required } from '@lion/ui/form-core.js';
import '/node_modules/_lion_docs/fundamentals/systems/form/assets/h-output.js';
/** stories code **/
export const interactionStates = () => html`
  <lion-input
    label="Interaction States"
    help-text="Interact with this field to see how dirty, touched and prefilled change"
    .modelValue="${'myValue'}"
  ></lion-input>
  <h-output .show="${['touched', 'dirty', 'prefilled', 'focused', 'submitted']}"></h-output>
`;
export const feedbackCondition = () => {
  // 1. Initialize variables
  // properties we want to check conditions for
  const props = ['touched', 'dirty', 'prefilled', 'focused', 'filled', 'submitted'];

  // 2. Create a validator
  class OddValidator extends Validator {
    static get validatorName() {
      return 'OddValidator';
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
  // 3. Create field that applies the validator and store the node reference
  const fieldElement = renderLitAsNode(html`
    <lion-input
      name="interactionField"
      label="Only an odd amount of characters allowed"
      help-text="Change feedback condition"
      .modelValue="${'notodd'}"
      .validators="${[new OddValidator()]}"
    ></lion-input>
  `);

  // 4. When checkboxes change, set the feedbackCondition method to a new method that checks
  // whether every condition that is checked, is true on the field. Otherwise, don't show the feedback.
  const fetchConditionsAndReevaluate = ({ currentTarget: { modelValue } }) => {
    fieldElement._showFeedbackConditionFor = type => {
      return modelValue.every(condition => fieldElement[condition]);
    };
    fieldElement.validate();
  };

  return html`
    <lion-form>
      <form>
        ${fieldElement}
        <button>Submit</button>
      </form>
    </lion-form>
    <h-output .field="${fieldElement}" .show="${[...props, 'hasFeedbackFor']}"> </h-output>
    <h3>Set conditions for validation feedback visibility</h3>
    <lion-checkbox-group name="props[]" @model-value-changed="${fetchConditionsAndReevaluate}">
      ${props.map(p => html` <lion-checkbox .label="${p}" .choiceValue="${p}"> </lion-checkbox> `)}
    </lion-checkbox-group>
  `;
};
export const feedbackVisibility = () => html`
  <lion-input-date
    .validators="${[
      new Required(),
      new MinDate(new Date('2000/10/10'), {
        getMessage: () => `You provided a correctly formatted date, but it's below MinData`,
      }),
    ]}"
    .feedbackCondition="${(type, meta, originalCondition) => {
      if (meta.modelValue && !(meta.modelValue instanceof Unparseable)) {
        return true;
      }
      return originalCondition(type, meta);
    }}"
    help-text="Error appears as soon as a Parseable date before 10/10/2000 is typed"
    label="Custom feedback visibility"
  ></lion-input-date>
`;
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'interactionStates', story: interactionStates }, { key: 'feedbackCondition', story: feedbackCondition }, { key: 'feedbackVisibility', story: feedbackVisibility }];
let needsMdjsElements = false;
for (const story of stories) {
  const storyEl = rootNode.querySelector(`[mdjs-story-name="${story.key}"]`);
  if (storyEl) {
    storyEl.story = story.story;
    storyEl.key = story.key;
    needsMdjsElements = true;
    Object.assign(storyEl, {"simulatorUrl":"/next/simulator/","languages":[{"key":"de-DE","name":"German"},{"key":"en-GB","name":"English (United Kingdom)"},{"key":"en-US","name":"English (United States)"},{"key":"nl-NL","name":"Dutch"}]});
  }
};
if (needsMdjsElements) {
  if (!customElements.get('mdjs-preview')) { import('/node_modules/@mdjs/mdjs-preview/src/define/define.js'); }
  if (!customElements.get('mdjs-story')) { import('/node_modules/@mdjs/mdjs-story/src/define.js'); }
}