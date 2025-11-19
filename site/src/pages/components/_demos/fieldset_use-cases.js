/** script code **/
import { html } from '@mdjs/mdjs-preview';
import { localize } from '@lion/ui/localize.js';
import { MinLength, Validator, Required } from '@lion/ui/form-core.js';

import '@lion/ui/define/lion-input.js';
import '@lion/ui/define/lion-fieldset.js';
/** stories code **/
export const data = () => html`
  <lion-fieldset name="nameGroup" label="Name">
    <lion-input name="firstName" label="First Name" .modelValue="${'Foo'}"></lion-input>
    <lion-input name="lastName" label="Last Name" .modelValue="${'Bar'}"></lion-input>
    <button @click="${ev => console.log(ev.target.parentElement.modelValue)}">
      Log to Action Logger
    </button>
  </lion-fieldset>
`;
export const disabled = () => {
  function toggleDisabled(e) {
    const fieldset = e.target.parentElement.querySelector('#fieldset');
    fieldset.disabled = !fieldset.disabled;
  }
  return html`
    <lion-fieldset name="nameGroup" label="Name" id="fieldset" disabled>
      <lion-input name="FirstName" label="First Name" .modelValue="${'Foo'}"></lion-input>
      <lion-input name="LastName" label="Last Name" .modelValue="${'Bar'}"></lion-input>
      <lion-fieldset name="nameGroup2" label="Name">
        <lion-input
          name="FirstName2"
          label="First Name"
          .modelValue="${'Foo'}"
          disabled
        ></lion-input>
        <lion-input name="LastName2" label="Last Name" .modelValue="${'Bar'}"></lion-input>
      </lion-fieldset>
    </lion-fieldset>
    <button @click="${toggleDisabled}">Toggle disabled</button>
  `;
};
export const nestingFieldsets = () => html`
  <lion-fieldset>
    <div slot="label">Personal data</div>
    <lion-fieldset name="nameGroup" label="Name">
      <lion-input name="FirstName" label="First Name" .modelValue="${'Foo'}"></lion-input>
      <lion-input name="LastName" label="Last Name" .modelValue="${'Bar'}"></lion-input>
    </lion-fieldset>
    <lion-fieldset name="location" label="Location">
      <lion-input name="country" label="Country" .modelValue="${'Netherlands'}"></lion-input>
    </lion-fieldset>
    <lion-input name="age" label="Age" .modelValue="${21}"></lion-input>
    <button @click="${ev => console.log(ev.target.parentElement.modelValue)}">
      Log everything to Action Logger
    </button>
    <br />
    <button
      @click="${ev => console.log(ev.target.parentElement.formElements.nameGroup.modelValue)}"
    >
      Log only Name fieldset to Action Logger
    </button>
  </lion-fieldset>
`;
export const validation = () => {
  const DemoValidator = class extends Validator {
    static get validatorName() {
      return 'DemoValidator';
    }
    execute(value) {
      if (value && value.input1) {
        return false; // el.hasError = true
      }
      return true;
    }
    static async getMessage() {
      return '[Fieldset Error] Demo error message';
    }
  };
  return html`
    <lion-fieldset id="someId" .validators="${[new DemoValidator()]}">
      <lion-input name="input1" label="Label"></lion-input>
    </lion-fieldset>
  `;
};
export const validatingMultipleFields = () => {
  const IsCatsAndDogs = class extends Validator {
    static get validatorName() {
      return 'IsCatsAndDogs';
    }
    execute(value) {
      return !(value.input1 === 'cats' && value.input2 === 'dogs');
    }
    static async getMessage() {
      return '[Fieldset Error] Input 1 needs to be "cats" and Input 2 needs to be "dogs"';
    }
  };
  return html`
    <lion-fieldset .validators="${[new IsCatsAndDogs()]}">
      <lion-input label="An all time YouTube favorite" name="input1" help-text="cats"> </lion-input>
      <lion-input label="Another all time YouTube favorite" name="input2" help-text="dogs">
      </lion-input>
    </lion-fieldset>
  `;
};
export const validatingMultipleFieldsets = () => {
  const IsCatsDogs = class extends Validator {
    static get validatorName() {
      return 'IsCatsAndDogs';
    }
    execute(value) {
      if (
        value.inner1 &&
        value.inner1.input1 === 'cats' &&
        value.inner2 &&
        value.inner2.input1 === 'dogs'
      ) {
        return false;
      }
      return true;
    }
    static async getMessage() {
      return 'There is a problem with one of your fieldsets';
    }
  };
  return html`
    <lion-fieldset name="outer" .validators="${[new IsCatsDogs()]}">
      <lion-fieldset name="inner1">
        <label slot="label">Fieldset no. 1</label>
        <lion-input label="Write 'cats' here" name="input1"> </lion-input>
      </lion-fieldset>
      <hr />
      <lion-fieldset name="inner2">
        <label slot="label">Fieldset no. 2</label>
        <lion-input label="Write 'dogs' here" name="input1"> </lion-input>
      </lion-fieldset>
    </lion-fieldset>
  `;
};
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'data', story: data }, { key: 'disabled', story: disabled }, { key: 'nestingFieldsets', story: nestingFieldsets }, { key: 'validation', story: validation }, { key: 'validatingMultipleFields', story: validatingMultipleFields }, { key: 'validatingMultipleFieldsets', story: validatingMultipleFieldsets }];
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
  if (!customElements.get('mdjs-preview')) { import('@mdjs/mdjs-preview/define'); }  if (!customElements.get('mdjs-story')) { import('@mdjs/mdjs-story/define'); }}