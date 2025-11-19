/** script code **/
import { html } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-input.js';
import { Unparseable } from '@lion/ui/form-core.js';
import { liveFormatPhoneNumber } from '@lion/ui/input-tel.js';
import '@lion/demo-systems/form/assets/h-output.js';
/** stories code **/
export const parser = () => html`
  <lion-input
    label="Number Example"
    help-text="Uses .parser to create model values from view values"
    .parser="${viewValue => Number(viewValue)}"
    .modelValue="${1234567890}"
    @model-value-changed="${({ target }) => console.log(target)}"
  ></lion-input>
  <h-output .show="${['modelValue']}"></h-output>
`;
export const unparseable = () => html`
  <lion-input
    label="Number Example"
    help-text="Uses .parser and return undefined if Number() cannot parse"
    .parser="${viewValue => Number(viewValue) || undefined}"
    value="${'1234abc567890'}"
  ></lion-input>
  <h-output .show="${['modelValue']}"></h-output>
`;
export const formatters = () => {
  const formatDate = (modelValue, options) => {
    if (!(typeof modelValue === 'number')) {
      return options.formattedValue;
    }
    return new Intl.NumberFormat('en-GB').format(modelValue);
  };
  return html`
    <lion-input
      label="Number Example"
      help-text="Uses .formatter to create view value"
      .parser="${viewValue => Number(viewValue.replace(/[^0-9]/g, ''))}"
      .formatter="${formatDate}"
      .modelValue="${1234567890}"
    >
    </lion-input>
    <h-output .show="${['modelValue', 'formattedValue']}"></h-output>
  `;
};
export const deserializers = () => {
  const mySerializer = (modelValue, options) => {
    return parseInt(modelValue, 8);
  };
  const myDeserializer = (myValue, options) => {
    return new Number(myValue);
  };
  return html`
    <lion-input
      label="Date Example"
      help-text="Uses .(de)serializer to restore serialized modelValues"
      .parser="${viewValue => Number(viewValue.replace(/[^0-9]/g, ''))}"
      .serializer="${mySerializer}"
      .deserializer="${myDeserializer}"
      .modelValue="${1234567890}"
    ></lion-input>
    <h-output .show="${['modelValue', 'serializedValue']}"></h-output>
  `;
};
export const preprocessors = () => {
  const preprocess = value => {
    return value.replace(/[0-9]/g, '');
  };
  return html`
    <lion-input
      label="Date Example"
      help-text="Uses .preprocessor to prevent digits"
      .preprocessor="${preprocess}"
    ></lion-input>
    <h-output .show="${['modelValue']}"></h-output>
  `;
};
export const liveFormatters = () => {
  return html`
    <lion-input
      label="Live Format"
      .modelValue="${new Unparseable('+31')}"
      help-text="Uses .preprocessor to format during typing"
      .preprocessor="${(viewValue, { currentCaretIndex, prevViewValue }) => {
        return liveFormatPhoneNumber(viewValue, {
          regionCode: 'NL',
          formatStrategy: 'international',
          currentCaretIndex,
          prevViewValue,
        });
      }}"
    ></lion-input>
    <h-output .show="${['modelValue']}"></h-output>
  `;
};
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'parser', story: parser }, { key: 'unparseable', story: unparseable }, { key: 'formatters', story: formatters }, { key: 'deserializers', story: deserializers }, { key: 'preprocessors', story: preprocessors }, { key: 'liveFormatters', story: liveFormatters }];
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