/** script code **/
import { html } from '@mdjs/mdjs-preview';
import { repeat } from 'lit/directives/repeat.js';
import '@lion/ui/define/lion-select-rich.js';
import '/node_modules/_lion_docs/components/select-rich/src/intl-select-rich.js';
import { regionMetaList } from '/node_modules/_lion_docs/components/select-rich/src/regionMetaList.js';
/** stories code **/
export const IntlSelectRich = () => html`
  <intl-select-rich label="Choose a region" name="regions">
    ${repeat(
      regionMetaList,
      regionMeta => regionMeta.regionCode,
      regionMeta =>
        html` <intl-option .choiceValue="${regionMeta.regionCode}" .regionMeta="${regionMeta}">
        </intl-option>`,
    )}
  </intl-select-rich>
`;
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'IntlSelectRich', story: IntlSelectRich }];
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