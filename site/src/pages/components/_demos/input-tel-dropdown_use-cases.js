/** script code **/
import { html } from '@mdjs/mdjs-preview';
import { ref, createRef } from 'lit/directives/ref.js';
import { loadDefaultFeedbackMessages } from '@lion/ui/validate-messages.js';
import { PhoneUtilManager } from '@lion/ui/input-tel.js';
import '@lion/ui/define/lion-input-tel-dropdown.js';
import '/node_modules/_lion_docs/fundamentals/systems/form/assets/h-output.js';

// TODO: make each example load/use the dependencies by default
// loadDefaultFeedbackMessages();
/** stories code **/
export const InputTelDropdown = () => {
  loadDefaultFeedbackMessages();
  return html`
    <lion-input-tel-dropdown
      label="Select region via dropdown"
      help-text="Shows all regions by default"
      name="phoneNumber"
    ></lion-input-tel-dropdown>
    <h-output
      .show="${['modelValue', 'activeRegion']}"
      .readyPromise="${PhoneUtilManager.loadComplete}"
    ></h-output>
  `;
};
export const allowedRegions = () => {
  loadDefaultFeedbackMessages();
  return html`
    <lion-input-tel-dropdown
      label="Select region via dropdown"
      help-text="With region code 'NL'"
      .modelValue="${'+31612345678'}"
      name="phoneNumber"
      .allowedRegions="${['NL', 'DE', 'GB']}"
    ></lion-input-tel-dropdown>
    <h-output
      .show="${['modelValue', 'activeRegion']}"
      .readyPromise="${PhoneUtilManager.loadComplete}"
    ></h-output>
  `;
};
export const preferredRegionCodes = () => {
  loadDefaultFeedbackMessages();
  return html`
    <lion-input-tel-dropdown
      label="Select region via dropdown"
      help-text="Preferred regions show on top"
      .modelValue="${'+31612345678'}"
      name="phoneNumber"
      .allowedRegions="${['BE', 'CA', 'DE', 'GB', 'NL', 'US']}"
      .preferredRegions="${['DE', 'NL']}"
    ></lion-input-tel-dropdown>
    <h-output
      .show="${['modelValue', 'activeRegion']}"
      .readyPromise="${PhoneUtilManager.loadComplete}"
    ></h-output>
  `;
};
export const formatStrategy = () => {
  loadDefaultFeedbackMessages();
  const inputTel = createRef();
  return html`
    <select @change="${({ target }) => (inputTel.value.formatStrategy = target.value)}">
      <option value="e164">e164</option>
      <option value="international">international</option>
      <option value="rfc3966">rfc3966</option>
    </select>
    <lion-input-tel-dropdown
      ${ref(inputTel)}
      label="Format strategy"
      help-text="Choose a strategy above"
      format-strategy="e164"
      name="phoneNumber"
    ></lion-input-tel-dropdown>
    <h-output
      .show="${['modelValue', 'formatStrategy']}"
      .readyPromise="${PhoneUtilManager.loadComplete}"
    ></h-output>
  `;
};
export const formatCountryCodeStyle = () => {
  loadDefaultFeedbackMessages();
  const inputTel = createRef();
  return html`
    <select @change="${({ target }) => (inputTel.value.formatStrategy = target.value)}">
      <option value="e164">e164</option>
      <option value="international">international</option>
      <option value="rfc3966">rfc3966</option>
    </select>
    <lion-input-tel-dropdown
      ${ref(inputTel)}
      label="Format strategy"
      help-text="Choose a strategy above"
      format-country-code-style="parentheses"
      format-strategy="e164"
      name="phoneNumber"
    ></lion-input-tel-dropdown>
    <h-output
      .show="${['modelValue', 'formatStrategy']}"
      .readyPromise="${PhoneUtilManager.loadComplete}"
    ></h-output>
  `;
};
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'InputTelDropdown', story: InputTelDropdown }, { key: 'allowedRegions', story: allowedRegions }, { key: 'preferredRegionCodes', story: preferredRegionCodes }, { key: 'formatStrategy', story: formatStrategy }, { key: 'formatCountryCodeStyle', story: formatCountryCodeStyle }];
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