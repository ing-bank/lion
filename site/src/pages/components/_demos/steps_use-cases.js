/** script code **/
import { html } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-steps.js';
import '@lion/ui/define/lion-step.js';
/** stories code **/
export const main = () => html`
  <lion-steps>
    <lion-step initial-step>
      <p>Welcome</p>
      <button disabled>previous</button> &nbsp;
      <button type="button" @click="${ev => ev.target.parentElement.controller.next()}">
        Next
      </button>
    </lion-step>
    <lion-step>
      <p>Are you single?</p>
      <button
        type="button"
        @click=${ev => {
          ev.target.parentElement.controller.data.isSingle = true;
          ev.target.parentElement.controller.next();
        }}
      >
        Yes
      </button>
      &nbsp;
      <button
        type="button"
        @click=${ev => {
          ev.target.parentElement.controller.data.isSingle = false;
          ev.target.parentElement.controller.next();
        }}
      >
        No
      </button>
      <br /><br />
      <button type="button" @click="${ev => ev.target.parentElement.controller.previous()}">
        Previous
      </button>
    </lion-step>
    <lion-step id="is-single" .condition="${data => data.isSingle}">
      <p>You are single</p>
      <button type="button" @click="${ev => ev.target.parentElement.controller.previous()}">
        Previous
      </button>
      &nbsp;
      <button type="button" @click="${ev => ev.target.parentElement.controller.next()}">
        Next
      </button>
    </lion-step>
    <lion-step id="is-not-single" .condition="${data => data.isSingle}" invert-condition>
      <p>You are NOT single.</p>
      <button type="button" @click="${ev => ev.target.parentElement.controller.previous()}">
        Previous
      </button>
      &nbsp;
      <button type="button" @click="${ev => ev.target.parentElement.controller.next()}">
        Next
      </button>
    </lion-step>
    <lion-step>
      <p>Finish</p>
      <button type="button" @click="${ev => ev.target.parentElement.controller.previous()}">
        Previous
      </button>
    </lion-step>
  </lion-steps>
`;
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
  if (!customElements.get('mdjs-preview')) { import('/node_modules/@mdjs/mdjs-preview/src/define/define.js'); }
  if (!customElements.get('mdjs-story')) { import('/node_modules/@mdjs/mdjs-story/src/define.js'); }
}