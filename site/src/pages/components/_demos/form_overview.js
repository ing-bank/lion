/** script code **/
import { html } from '@mdjs/mdjs-preview';

import '@lion/ui/define/lion-input.js';
import '@lion/ui/define/lion-form.js';
/** stories code **/
export const main = () => {
  const submitHandler = ev => {
    const formData = ev.target.serializedValue;
    console.log('formData', formData);
    fetch('/api/foo/', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  };
  return html`
    <lion-form @submit="${submitHandler}">
      <form @submit="${ev => ev.preventDefault()}">
        <lion-input name="firstName" label="First Name" .modelValue="${'Foo'}"></lion-input>
        <lion-input name="lastName" label="Last Name" .modelValue="${'Bar'}"></lion-input>
        <button>Submit</button>
      </form>
    </lion-form>
  `;
};
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'main', story: main }];
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