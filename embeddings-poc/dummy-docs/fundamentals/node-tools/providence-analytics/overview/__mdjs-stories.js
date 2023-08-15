/** script code **/
import { html } from '@mdjs/mdjs-preview';
import { providenceFlowSvg, providenceInternalFlowSvg } from '../assets/_mermaid.svg.js';
/** stories code **/
export const providenceFlow = () => providenceFlowSvg;
export const providenceInternalFlow = () => providenceInternalFlowSvg;
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'providenceFlow', story: providenceFlow }, { key: 'providenceInternalFlow', story: providenceInternalFlow }];
let needsMdjsElements = false;
for (const story of stories) {
  const storyEl = rootNode.querySelector(`[mdjs-story-name="${story.key}"]`);
  if (storyEl) {
    storyEl.story = story.story;
    storyEl.key = story.key;
    needsMdjsElements = true;
    Object.assign(storyEl, {"simulatorUrl":"/simulator/","languages":[{"key":"de-DE","name":"German"},{"key":"en-GB","name":"English (United Kingdom)"},{"key":"en-US","name":"English (United States)"},{"key":"nl-NL","name":"Dutch"}]});
  }
};
if (needsMdjsElements) {
  if (!customElements.get('mdjs-preview')) { import('@mdjs/mdjs-preview/define'); }
  if (!customElements.get('mdjs-story')) { import('@mdjs/mdjs-story/define'); }
}