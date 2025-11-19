/** script code **/
import { html } from '@mdjs/mdjs-preview';
import { MinMaxDate, IsDateDisabled } from '@lion/ui/form-core.js';
import { loadDefaultFeedbackMessages } from '@lion/ui/validate-messages.js';
import { formatDate } from '@lion/ui/localize.js';
import '@lion/ui/define/lion-input-datepicker.js';
loadDefaultFeedbackMessages();
/** stories code **/
export const minimumAndMaximumDate = () => html`
  <lion-input-datepicker
    label="MinMaxDate"
    .modelValue="${new Date('2018/05/30')}"
    .validators="${[new MinMaxDate({ min: new Date('2018/05/24'), max: new Date('2018/06/24') })]}"
  >
    <div slot="help-text">
      Enter a date between ${formatDate(new Date('2018/05/24'))} and
      ${formatDate(new Date('2018/06/24'))}.
    </div>
  </lion-input-datepicker>
`;
export const disableSpecificDates = () => html`
  <lion-input-datepicker
    label="IsDateDisabled"
    help-text="You're not allowed to choose any 15th."
    .modelValue="${new Date('2023/06/15')}"
    .validators="${[new IsDateDisabled(d => d.getDate() === 15)]}"
  ></lion-input-datepicker>
`;
export const calendarHeading = () => html`
  <lion-input-datepicker
    label="Date"
    .calendarHeading="${'Custom heading'}"
    .modelValue="${new Date()}"
  ></lion-input-datepicker>
`;
export const disabled = () => html`
  <lion-input-datepicker label="Disabled" disabled></lion-input-datepicker>
`;
export const readOnly = () => html`
  <lion-input-datepicker label="Readonly" readonly .modelValue="${new Date()}">
  </lion-input-datepicker>
`;
export const faultyPrefilled = () => html`
  <lion-input-datepicker label="Faulty prefiiled" .modelValue="${new Date('30/01/2022')}">
  </lion-input-datepicker>
`;
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'minimumAndMaximumDate', story: minimumAndMaximumDate }, { key: 'disableSpecificDates', story: disableSpecificDates }, { key: 'calendarHeading', story: calendarHeading }, { key: 'disabled', story: disabled }, { key: 'readOnly', story: readOnly }, { key: 'faultyPrefilled', story: faultyPrefilled }];
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