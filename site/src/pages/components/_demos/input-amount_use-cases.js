/** script code **/
import { html } from '@mdjs/mdjs-preview';
import { MaxLength } from '@lion/ui/form-core.js';
import { loadDefaultFeedbackMessages } from '@lion/ui/validate-messages.js';

import { localize } from '@lion/ui/localize.js';

import '@lion/ui/define/lion-input-amount.js';
/** stories code **/
export const negativeNumber = () => html`
  <lion-input-amount label="Amount" .modelValue="${-123456.78}"></lion-input-amount>
`;
export const currencySuffix = () => html`
  <lion-input-amount label="Price" currency="USD" .modelValue="${123456.78}"></lion-input-amount>
`;
export const forceLocale = () => {
  return html`
    <lion-input-amount
      label="Price"
      currency="JOD"
      .locale="nl-NL"
      .modelValue="${123456.78}"
    ></lion-input-amount>
  `;
};
import { preprocessAmount } from '@lion/ui/input-amount.js';

export const forceDigits = () => html`
  <lion-input-amount label="Amount" .preprocessor="${preprocessAmount}"></lion-input-amount>
`;
export const faultyPrefilled = () => html`
  <lion-input-amount
    label="Amount"
    help-text="Faulty prefilled input will cause error feedback"
    .modelValue="${'foo'}"
  ></lion-input-amount>
`;
export const noDecimals = () => html`
  <lion-input-amount
    label="Amount"
    help-text="Prefilled and formatted"
    .formatOptions="${{
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }}"
    .modelValue="${20}"
  >
  </lion-input-amount>
`;
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'negativeNumber', story: negativeNumber }, { key: 'currencySuffix', story: currencySuffix }, { key: 'forceLocale', story: forceLocale }, { key: 'forceDigits', story: forceDigits }, { key: 'faultyPrefilled', story: faultyPrefilled }, { key: 'noDecimals', story: noDecimals }];
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