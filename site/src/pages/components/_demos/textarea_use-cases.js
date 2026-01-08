/** script code **/
import { html } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-textarea.js';
/** stories code **/
export const prefilled = () => html`
  <lion-textarea
    label="Prefilled"
    .modelValue="${['batman', 'and', 'robin'].join('\n')}"
  ></lion-textarea>
`;
export const disabled = () => html` <lion-textarea label="Disabled" disabled></lion-textarea> `;
export const readonly = () => html`
  <lion-textarea
    label="Readonly"
    readonly
    .modelValue="${['batman', 'and', 'robin'].join('\n')}"
  ></lion-textarea>
`;
export const stopGrowing = () => html`
  <lion-textarea
    label="Stop growing"
    max-rows="4"
    .modelValue="${['batman', 'and', 'robin'].join('\n')}"
  ></lion-textarea>
`;
export const nonGrowing = () => html`
  <lion-textarea label="Non Growing" rows="3" max-rows="3"></lion-textarea>
`;
export const hidden = () => html`
  <div style="display: none">
    <lion-textarea
      .modelValue="${'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'}"
      label="Stops growing after 4 rows"
      max-rows="4"
    ></lion-textarea>
  </div>
  <button
    @click=${e =>
      (e.target.previousElementSibling.style.display =
        e.target.previousElementSibling.style.display === 'block' ? 'none' : 'block')}
  >
    Toggle display
  </button>
`;
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'prefilled', story: prefilled }, { key: 'disabled', story: disabled }, { key: 'readonly', story: readonly }, { key: 'stopGrowing', story: stopGrowing }, { key: 'nonGrowing', story: nonGrowing }, { key: 'hidden', story: hidden }];
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