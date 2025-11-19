/** script code **/
import { html } from '@mdjs/mdjs-preview';
import { loadDefaultFeedbackMessages } from '@lion/ui/validate-messages.js';
import { IsCountryIBAN, IsNotCountryIBAN } from '@lion/ui/input-iban.js';
import '@lion/ui/define/lion-input-iban.js';
/** stories code **/
export const prefilled = () => html`
  <lion-input-iban .modelValue="${'NL20INGB0001234567'}" name="iban" label="IBAN"></lion-input-iban>
`;
export const faultyPrefilled = () => html`
  <lion-input-iban
    .modelValue="${'NL20INGB0001234567XXXX'}"
    name="iban"
    label="IBAN"
  ></lion-input-iban>
`;
export const countryRestrictions = () => {
  loadDefaultFeedbackMessages();
  return html`
    <lion-input-iban
      .modelValue="${'DE89370400440532013000'}"
      .validators="${[new IsCountryIBAN('NL')]}"
      name="iban"
      label="IBAN"
    ></lion-input-iban>
    <br />
    <small>Demo instructions: you can use NL20 INGB 0001 2345 67</small>
  `;
};
export const countryRestrictionsMultiple = () => {
  loadDefaultFeedbackMessages();
  return html`
    <lion-input-iban
      .modelValue="${'DE89370400440532013000'}"
      .validators="${[new IsCountryIBAN(['BE', 'NL', 'LU'])]}"
      name="iban"
      label="IBAN"
    ></lion-input-iban>
    <br />
    <small>Demo instructions: you can use:</small>
    <ul>
      <li><small>BE68 5390 0754 7034</small></li>
      <li><small>NL20 INGB 0001 2345 67</small></li>
      <li><small>LU28 0019 4006 4475 0000</small></li>
    </ul>
  `;
};
export const blacklistedCountry = () => {
  loadDefaultFeedbackMessages();
  return html`
    <lion-input-iban
      .modelValue="${'DE89370400440532013000'}"
      .validators="${[new IsNotCountryIBAN(['RO', 'NL'])]}"
      name="iban"
      label="IBAN"
    ></lion-input-iban>
    <br />
    <small>
      Demo instructions: Try <code>RO 89 RZBR 6997 3728 4864 5577</code> and watch it fail
    </small>
  `;
};
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'prefilled', story: prefilled }, { key: 'faultyPrefilled', story: faultyPrefilled }, { key: 'countryRestrictions', story: countryRestrictions }, { key: 'countryRestrictionsMultiple', story: countryRestrictionsMultiple }, { key: 'blacklistedCountry', story: blacklistedCountry }];
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