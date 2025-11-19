/** script code **/
import { html } from '@mdjs/mdjs-preview';
import { Validator } from '@lion/ui/form-core.js';
import '@lion/ui/define/lion-input-email.js';
/** stories code **/
export const faultyPrefilled = () => html`
  <lion-input-email .modelValue="${'foo'}" label="Email"></lion-input-email>
`;
export const customValidator = () => {
  class GmailOnly extends Validator {
    static get validatorName() {
      return 'GmailOnly';
    }
    execute(value) {
      let hasError = false;
      if (!(value.indexOf('gmail.com') !== -1)) {
        hasError = true;
      }
      return hasError;
    }
    static async getMessage() {
      return 'You can only use gmail.com email addresses.';
    }
  }
  return html`
    <lion-input-email
      .modelValue="${'foo@bar.com'}"
      .validators="${[new GmailOnly()]}"
      label="Email"
    ></lion-input-email>
  `;
};
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'faultyPrefilled', story: faultyPrefilled }, { key: 'customValidator', story: customValidator }];
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