const e=`/** script code **/
import { html } from '@mdjs/mdjs-preview';
import { Required } from '@lion/ui/form-core.js';
import { loadDefaultFeedbackMessages } from '@lion/ui/validate-messages.js';
import '@lion/ui/define/lion-select.js';
loadDefaultFeedbackMessages();
/** stories code **/
export const HtmlStory36 = () => html\`<lion-select name="favoriteColor" label="Favorite color" .modelValue="\${'hotpink'}">
  <select slot="input">
    <option selected value>Please select</option>
    <option value="red">Red</option>
    <option value="hotpink">Hotpink</option>
    <option value="teal">Teal</option>
  </select>
</lion-select>\`;
export const HtmlStory37 = () => html\`<lion-select name="favoriteColor" label="Favorite color">
  <select slot="input">
    <option selected value>Please select</option>
    <option value="red">Red</option>
    <option value="hotpink" disabled>Hotpink</option>
    <option value="teal">Teal</option>
  </select>
</lion-select>\`;
export const HtmlStory38 = () => html\`<lion-select name="favoriteColor" label="Favorite color" disabled>
  <select slot="input">
    <option selected value>Please select</option>
    <option value="red">Red</option>
    <option value="hotpink">Hotpink</option>
    <option value="teal">Teal</option>
  </select>
</lion-select>\`;
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'HtmlStory36', story: HtmlStory36 }, { key: 'HtmlStory37', story: HtmlStory37 }, { key: 'HtmlStory38', story: HtmlStory38 }];
let needsMdjsElements = false;
for (const story of stories) {
  const storyEl = rootNode.querySelector(\`[mdjs-story-name="\${story.key}"]\`);
  if (storyEl) {
    storyEl.story = story.story;
    storyEl.key = story.key;
    needsMdjsElements = true;
    Object.assign(storyEl, {"simulatorUrl":"/next-preview/feat-lion-playground-rebased/simulator","languages":[{"key":"de-DE","name":"German"},{"key":"en-GB","name":"English (United Kingdom)"},{"key":"en-US","name":"English (United States)"},{"key":"nl-NL","name":"Dutch"}]});
  }
};
if (needsMdjsElements) {
  if (!customElements.get('mdjs-preview')) { import('/node_modules/@mdjs/mdjs-preview/src/define/define.js'); }
  if (!customElements.get('mdjs-story')) { import('/node_modules/@mdjs/mdjs-story/src/define.js'); }
}`;export{e as default};
