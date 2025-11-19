/** script code **/
import { html } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-input.js';
/** stories code **/
export const label = () => html` <lion-input label="Input" name="input"></lion-input> `;
export const labelSrOnly = () => html`
  <lion-input label-sr-only label="Input" name="input"></lion-input>
`;
export const helpText = () => html`
  <lion-input>
    <label slot="label">Label</label>
    <div slot="help-text">
      Help text using <a href="https://example.com/" target="_blank">html</a>
    </div>
  </lion-input>
`;
export const prefilled = () => html`
  <lion-input .modelValue="${'Prefilled value'}" label="Prefilled"></lion-input>
`;
export const readOnly = () => html`
  <lion-input readonly .modelValue="${'This is read only'}" label="Read only"></lion-input>
`;
export const disabled = () => html`
  <lion-input disabled .modelValue="${'This is disabled'}" label="Disabled"></lion-input>
`;
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'label', story: label }, { key: 'labelSrOnly', story: labelSrOnly }, { key: 'helpText', story: helpText }, { key: 'prefilled', story: prefilled }, { key: 'readOnly', story: readOnly }, { key: 'disabled', story: disabled }];
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