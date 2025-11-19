/** script code **/
import { html } from '@mdjs/mdjs-preview';
import { MinDate, MinMaxDate, MaxDate } from '@lion/ui/form-core.js';
import { loadDefaultFeedbackMessages } from '@lion/ui/validate-messages.js';
import { formatDate } from '@lion/ui/localize.js';
import '@lion/ui/define/lion-input-date.js';
/** stories code **/
export const isADate = () => html`
  <lion-input-date label="IsDate" .modelValue="${new Date('foo')}"> </lion-input-date>
`;
export const withMinimumDate = () => {
  loadDefaultFeedbackMessages();
  return html`
    <lion-input-date
      label="MinDate"
      help-text="Enter a date greater than or equal to today."
      .modelValue="${new Date('2018/05/30')}"
      .validators="${[new MinDate(new Date())]}"
    >
    </lion-input-date>
  `;
};
export const withMaximumDate = () => {
  loadDefaultFeedbackMessages();
  return html`
    <lion-input-date
      label="MaxDate"
      help-text="Enter a date smaller than or equal to today."
      .modelValue="${new Date('2100/05/30')}"
      .validators="${[new MaxDate(new Date())]}"
    ></lion-input-date>
  `;
};
export const withMinimumAndMaximumDate = () => {
  loadDefaultFeedbackMessages();
  return html`
    <lion-input-date
      label="MinMaxDate"
      .modelValue="${new Date('2018/05/30')}"
      .validators="${[
        new MinMaxDate({ min: new Date('2018/05/24'), max: new Date('2018/06/24') }),
      ]}"
    >
      <div slot="help-text">
        Enter a date between ${formatDate(new Date('2018/05/24'))} and
        ${formatDate(new Date('2018/06/24'))}.
      </div>
    </lion-input-date>
  `;
};
export const faultyPrefilled = () => html`
  <lion-input-date
    label="Date"
    help-text="Faulty prefilled input will be cleared"
    .modelValue="${'foo'}"
  ></lion-input-date>
`;
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'isADate', story: isADate }, { key: 'withMinimumDate', story: withMinimumDate }, { key: 'withMaximumDate', story: withMaximumDate }, { key: 'withMinimumAndMaximumDate', story: withMinimumAndMaximumDate }, { key: 'faultyPrefilled', story: faultyPrefilled }];
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