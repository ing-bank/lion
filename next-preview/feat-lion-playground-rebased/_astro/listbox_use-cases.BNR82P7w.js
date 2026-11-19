const o=`/** script code **/
import { html } from '@mdjs/mdjs-preview';
import { listboxData } from '/node_modules/_lion_docs/components/listbox/src/listboxData.js';
import { Required } from '@lion/ui/form-core.js';
import { loadDefaultFeedbackMessages } from '@lion/ui/validate-messages.js';
import '@lion/ui/define/lion-listbox.js';
import '@lion/ui/define/lion-option.js';
loadDefaultFeedbackMessages();
/** stories code **/
export const HtmlStory28 = () => html\`<lion-listbox name="combo" label="Multiple" multiple-choice>
  <lion-option .choiceValue="\${'Apple'}">Apple</lion-option>
  <lion-option .choiceValue="\${'Artichoke'}">Artichoke</lion-option>
  <lion-option .choiceValue="\${'Asparagus'}">Asparagus</lion-option>
  <lion-option .choiceValue="\${'Banana'}">Banana</lion-option>
  <lion-option .choiceValue="\${'Beets'}">Beets</lion-option>
  <lion-option .choiceValue="\${'Bell pepper'}">Bell pepper</lion-option>
  <lion-option .choiceValue="\${'Broccoli'}">Broccoli</lion-option>
  <lion-option .choiceValue="\${'Brussels sprout'}">Brussels sprout</lion-option>
  <lion-option .choiceValue="\${'Cabbage'}">Cabbage</lion-option>
  <lion-option .choiceValue="\${'Carrot'}">Carrot</lion-option>
</lion-listbox>\`;
export const HtmlStory29 = () => html\`<lion-listbox name="combo" label="Orientation horizontal" orientation="horizontal">
  <lion-option .choiceValue="\${'Apple'}">Apple</lion-option>
  <lion-option .choiceValue="\${'Artichoke'}">Artichoke</lion-option>
  <lion-option .choiceValue="\${'Asparagus'}">Asparagus</lion-option>
  <lion-option .choiceValue="\${'Banana'}">Banana</lion-option>
  <lion-option .choiceValue="\${'Beets'}">Beets</lion-option>
  <lion-option .choiceValue="\${'Bell pepper'}">Bell pepper</lion-option>
  <lion-option .choiceValue="\${'Broccoli'}">Broccoli</lion-option>
  <lion-option .choiceValue="\${'Brussels sprout'}">Brussels sprout</lion-option>
  <lion-option .choiceValue="\${'Cabbage'}">Cabbage</lion-option>
  <lion-option .choiceValue="\${'Carrot'}">Carrot</lion-option>
</lion-listbox>\`;
export const HtmlStory30 = () => html\`<lion-listbox
  name="combo"
  label="Orientation horizontal multiple"
  orientation="horizontal"
  multiple-choice
>
  <lion-option .choiceValue="\${'Apple'}">Apple</lion-option>
  <lion-option .choiceValue="\${'Artichoke'}">Artichoke</lion-option>
  <lion-option .choiceValue="\${'Asparagus'}">Asparagus</lion-option>
  <lion-option .choiceValue="\${'Banana'}">Banana</lion-option>
  <lion-option .choiceValue="\${'Beets'}">Beets</lion-option>
  <lion-option .choiceValue="\${'Bell pepper'}">Bell pepper</lion-option>
  <lion-option .choiceValue="\${'Broccoli'}">Broccoli</lion-option>
  <lion-option .choiceValue="\${'Brussels sprout'}">Brussels sprout</lion-option>
  <lion-option .choiceValue="\${'Cabbage'}">Cabbage</lion-option>
  <lion-option .choiceValue="\${'Carrot'}">Carrot</lion-option>
</lion-listbox>\`;
export const HtmlStory31 = () => html\`<lion-listbox name="combo" label="Selection follows focus" selection-follows-focus>
  <lion-option .choiceValue="\${'Apple'}">Apple</lion-option>
  <lion-option .choiceValue="\${'Artichoke'}" disabled>Artichoke</lion-option>
  <lion-option .choiceValue="\${'Asparagus'}">Asparagus</lion-option>
  <lion-option .choiceValue="\${'Banana'}">Banana</lion-option>
  <lion-option .choiceValue="\${'Beets'}">Beets</lion-option>
  <lion-option .choiceValue="\${'Bell pepper'}">Bell pepper</lion-option>
  <lion-option .choiceValue="\${'Broccoli'}">Broccoli</lion-option>
  <lion-option .choiceValue="\${'Brussels sprout'}">Brussels sprout</lion-option>
  <lion-option .choiceValue="\${'Cabbage'}">Cabbage</lion-option>
  <lion-option .choiceValue="\${'Carrot'}">Carrot</lion-option>
</lion-listbox>\`;
export const HtmlStory32 = () => html\`<lion-listbox name="combo" label="Rotate keyboard navigation" rotate-keyboard-navigation>
  <lion-option .choiceValue="\${'Apple'}">Apple</lion-option>
  <lion-option .choiceValue="\${'Artichoke'}">Artichoke</lion-option>
  <lion-option .choiceValue="\${'Asparagus'}">Asparagus</lion-option>
  <lion-option .choiceValue="\${'Banana'}">Banana</lion-option>
  <lion-option .choiceValue="\${'Beets'}">Beets</lion-option>
  <lion-option .choiceValue="\${'Bell pepper'}">Bell pepper</lion-option>
  <lion-option .choiceValue="\${'Broccoli'}">Broccoli</lion-option>
  <lion-option .choiceValue="\${'Brussels sprout'}">Brussels sprout</lion-option>
  <lion-option .choiceValue="\${'Cabbage'}">Cabbage</lion-option>
  <lion-option .choiceValue="\${'Carrot'}">Carrot</lion-option>
</lion-listbox>\`;
export const HtmlStory33 = () => html\`<lion-listbox name="combo" label="Rotate with disabled options" rotate-keyboard-navigation>
  <lion-option .choiceValue="\${'Apple'}">Apple</lion-option>
  <lion-option .choiceValue="\${'Artichoke'}" disabled>Artichoke</lion-option>
  <lion-option .choiceValue="\${'Asparagus'}">Asparagus</lion-option>
  <lion-option .choiceValue="\${'Banana'}">Banana</lion-option>
  <lion-option .choiceValue="\${'Beets'}">Beets</lion-option>
  <lion-option .choiceValue="\${'Bell pepper'}">Bell pepper</lion-option>
  <lion-option .choiceValue="\${'Broccoli'}">Broccoli</lion-option>
  <lion-option .choiceValue="\${'Brussels sprout'}" disabled>Brussels sprout</lion-option>
  <lion-option .choiceValue="\${'Cabbage'}">Cabbage</lion-option>
  <lion-option .choiceValue="\${'Carrot'}">Carrot</lion-option>
</lion-listbox>\`;
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'HtmlStory28', story: HtmlStory28 }, { key: 'HtmlStory29', story: HtmlStory29 }, { key: 'HtmlStory30', story: HtmlStory30 }, { key: 'HtmlStory31', story: HtmlStory31 }, { key: 'HtmlStory32', story: HtmlStory32 }, { key: 'HtmlStory33', story: HtmlStory33 }];
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
}`;export{o as default};
