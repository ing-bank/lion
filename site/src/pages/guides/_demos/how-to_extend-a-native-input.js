/** script code **/
import { html } from '@mdjs/mdjs-preview';
import { LionInput } from '@lion/ui/input.js';
import { LionInputDate } from '@lion/ui/input-date.js';
import { loadDefaultFeedbackMessages } from '@lion/ui/validate-messages.js';
import '@lion/ui/define/lion-input.js';
import '@lion/demo-systems/form/assets/h-output.js';

loadDefaultFeedbackMessages();
/** stories code **/
export const extendLionInput = () => {
  class LionInputDatetime extends LionInput {
    constructor() {
      super();
      this.type = 'datetime-local';
    }
  }
  customElements.define('lion-input-datetime', LionInputDatetime);

  return html`<lion-input-datetime label="With Date string"></lion-input-datetime>
    <h-output .show="${['modelValue', 'touched', 'dirty', 'focused']}"></h-output>`;
};
export const extendLionInputDate = () => {
  function toIsoDatetime(d) {
    return d && new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('.')[0];
  }
  function fromIsoDatetime(value) {
    return new Date(value);
  }

  class LionInputDatetimeWithObject extends LionInputDate {
    constructor() {
      super();
      this.type = 'datetime-local';
      this.parser = fromIsoDatetime;
      this.deserializer = fromIsoDatetime;
      this.serializer = toIsoDatetime;
      this.formatter = toIsoDatetime;
    }
  }
  customElements.define('lion-input-datetime-with-object', LionInputDatetimeWithObject);

  return html`<lion-input-datetime-with-object
      label="With Date object"
    ></lion-input-datetime-with-object>
    <h-output .show="${['modelValue', 'touched', 'dirty', 'focused']}"></h-output>`;
};
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'extendLionInput', story: extendLionInput }, { key: 'extendLionInputDate', story: extendLionInputDate }];
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