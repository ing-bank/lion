/** script code **/
import { html } from '@mdjs/mdjs-preview';
import { Validator } from '@lion/ui/form-core.js';
import { LionSwitch } from '@lion/ui/switch.js';
import '@lion/ui/define/lion-switch.js';
import '@lion/ui/define-helpers/sb-action-logger.js';
/** stories code **/
export const HtmlStory41 = () => html`<lion-switch label="Label" disabled></lion-switch>`;
class IsTrue extends Validator {
  static get validatorName() {
    return 'IsTrue';
  }
  execute(value) {
    return !value.checked;
  }
  static async getMessage() {
    return "You won't get the latest news!";
  }
}

class CustomSwitch extends LionSwitch {
  static get validationTypes() {
    return [...super.validationTypes, 'info'];
  }

  _showFeedbackConditionFor(type, meta) {
    if (type === 'info') {
      return true;
    }
    return super._showFeedbackConditionFor(type, meta);
  }
}
customElements.define('custom-switch', CustomSwitch);

export const validation = () => html`
  <custom-switch
    name="newsletterCheck"
    label="Subscribe to newsletter"
    .validators="${[new IsTrue(null, { type: 'info' })]}"
  ></custom-switch>
`;
export const handler = ({ shadowRoot }) => {
  return html`
    <lion-switch
      label="Label"
      @checked-changed="${ev => {
        shadowRoot.querySelector('sb-action-logger').log(`Current value: ${ev.target.checked}`);
      }}"
    >
    </lion-switch>
    <sb-action-logger></sb-action-logger>
  `;
};
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'HtmlStory41', story: HtmlStory41 }, { key: 'validation', story: validation }, { key: 'handler', story: handler }];
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