/** script code **/
import { html } from '@mdjs/mdjs-preview';
import { ref, createRef } from 'lit/directives/ref.js';
import { Unparseable } from '@lion/ui/form-core.js';
import { localize } from '@lion/ui/localize.js';
import { loadDefaultFeedbackMessages } from '@lion/ui/validate-messages.js';
import { PhoneUtilManager } from '@lion/ui/input-tel.js';
import '@lion/ui/define/lion-input-tel.js';
import '/node_modules/_lion_docs/components/input-tel/src/h-region-code-table.js';
import '/node_modules/_lion_docs/fundamentals/systems/form/assets/h-output.js';

// TODO: make each example load/use the dependencies by default
// loadDefaultFeedbackMessages();
/** stories code **/
export const regionCodesTable = () => {
  loadDefaultFeedbackMessages();
  return html`<h-region-code-table></h-region-code-table>`;
};
export const heuristic = () => {
  loadDefaultFeedbackMessages();

  const initialAllowedRegions = ['CN', 'ES'];
  const [inputTelRef, outputRef, selectRef] = [createRef(), createRef(), createRef()];

  const setDerivedActiveRegionScenario = (
    scenarioToSet,
    inputTel = inputTelRef.value,
    output = outputRef.value,
  ) => {
    if (scenarioToSet === 'only-allowed-region') {
      // activeRegion will be the top allowed region, which is 'NL'
      inputTel.modelValue = undefined;
      inputTel.allowedRegions = ['NL']; // activeRegion will always be the only option
      output.innerText = '.activeRegion (NL) is only allowed region';
    } else if (scenarioToSet === 'user-input') {
      // activeRegion will be based on phone number => 'BE'
      inputTel.allowedRegions = ['NL', 'BE', 'DE'];
      inputTel.modelValue = '+3261234567'; // BE number
      output.innerText = '.activeRegion (BE) is derived (since within allowedRegions)';
    } else if (scenarioToSet === 'locale') {
      localize.locale = 'en-GB';
      // activeRegion will be `html[lang]`
      inputTel.modelValue = undefined;
      inputTel.allowedRegions = undefined;
      output.innerText = `.activeRegion (${inputTel._langIso}) set to locale when inside allowed or all regions`;
    } else {
      output.innerText = '';
    }
  };
  return html`
    <select
      aria-label="Set scenario"
      @change="${({ target }) => setDerivedActiveRegionScenario(target.value)}"
    >
      <option value="">--- select scenario ---</option>
      <option value="only-allowed-region">1. only allowed region</option>
      <option value="user-input">2. user input</option>
      <option value="locale">3. locale</option>
    </select>
    <output style="display:block; min-height: 1.5em;" id="myOutput" ${ref(outputRef)}></output>
    <lion-input-tel
      ${ref(inputTelRef)}
      @model-value-changed="${({ detail }) => {
        if (detail.isTriggeredByUser && selectRef.value) {
          selectRef.value.value = '';
        }
      }}"
      name="phoneNumber"
      label="Active region"
      .allowedRegions="${initialAllowedRegions}"
    ></lion-input-tel>
    <h-output
      .show="${[
        'activeRegion',
        {
          name: 'all or allowed regions',
          processor: el => JSON.stringify(el._allowedOrAllRegions),
        },
        'modelValue',
      ]}"
      .readyPromise="${PhoneUtilManager.loadComplete}"
    ></h-output>
  `;
};
export const allowedRegions = () => {
  loadDefaultFeedbackMessages();
  return html`
    <lion-input-tel
      label="Allowed regions 'NL', 'BE', 'DE'"
      help-text="Type '+31'(NL), '+32'(BE) or '+49'(DE) and see how activeRegion changes"
      .allowedRegions="${['NL', 'BE', 'DE']}"
      .modelValue="${'+31612345678'}"
      name="phoneNumber"
    ></lion-input-tel>
    <h-output
      .show="${['modelValue', 'activeRegion']}"
      .readyPromise="${PhoneUtilManager.loadComplete}"
    ></h-output>
  `;
};
export const oneAllowedRegion = () => {
  loadDefaultFeedbackMessages();
  return html`
    <lion-input-tel
      label="Only allowed region 'DE'"
      help-text="Restricts validation / formatting to one region"
      .allowedRegions="${['DE']}"
      .modelValue="${'+31612345678'}"
      name="phoneNumber"
    ></lion-input-tel>
    <h-output
      .show="${['modelValue', 'activeRegion', 'validationStates']}"
      .readyPromise="${PhoneUtilManager.loadComplete}"
    ></h-output>
  `;
};
export const formatStrategy = () => {
  loadDefaultFeedbackMessages();
  const inputTel = createRef();
  return html`
    <select @change="${({ target }) => (inputTel.value.formatStrategy = target.value)}">
      <option value="e164">e164</option>
      <option value="international">international</option>
      <option value="national">national</option>
      <option value="significant">significant</option>
      <option value="rfc3966">rfc3966</option>
    </select>
    <lion-input-tel
      ${ref(inputTel)}
      label="Format strategy"
      help-text="Choose a strategy above"
      .modelValue="${'+46707123456'}"
      format-strategy="national"
      name="phoneNumber"
    ></lion-input-tel>
    <h-output
      .show="${['modelValue', 'formatStrategy']}"
      .readyPromise="${PhoneUtilManager.loadComplete}"
    ></h-output>
  `;
};
export const formatCountryCodeStyle = () => {
  loadDefaultFeedbackMessages();
  const inputTel = createRef();
  return html`
    <select @change="${({ target }) => (inputTel.value.formatStrategy = target.value)}">
      <option value="e164">e164</option>
      <option value="international">international</option>
      <option value="rfc3966">rfc3966</option>
    </select>
    <lion-input-tel
      ${ref(inputTel)}
      label="Format strategy"
      help-text="Choose a strategy above"
      .modelValue="${'+46707123456'}"
      format-country-code-style="parentheses"
      name="phoneNumber"
    ></lion-input-tel>
    <h-output
      .show="${['modelValue', 'formatStrategy']}"
      .readyPromise="${PhoneUtilManager.loadComplete}"
    ></h-output>
  `;
};
export const liveFormat = () => {
  loadDefaultFeedbackMessages();
  return html`
    <lion-input-tel
      label="Realtime format on user input"
      help-text="Partial numbers are also formatted"
      .modelValue="${new Unparseable('+31')}"
      format-strategy="international"
      live-format
      name="phoneNumber"
    ></lion-input-tel>
  `;
};
export const activePhoneNumberType = () => {
  loadDefaultFeedbackMessages();
  return html`
    <lion-input-tel
      label="Active phone number type"
      .modelValue="${'+31612345678'}"
      format-strategy="international"
      name="phoneNumber"
    ></lion-input-tel>
    <h-output
      .show="${['activePhoneNumberType']}"
      .readyPromise="${PhoneUtilManager.loadComplete}"
    ></h-output>
  `;
};
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'regionCodesTable', story: regionCodesTable }, { key: 'heuristic', story: heuristic }, { key: 'allowedRegions', story: allowedRegions }, { key: 'oneAllowedRegion', story: oneAllowedRegion }, { key: 'formatStrategy', story: formatStrategy }, { key: 'formatCountryCodeStyle', story: formatCountryCodeStyle }, { key: 'liveFormat', story: liveFormat }, { key: 'activePhoneNumberType', story: activePhoneNumberType }];
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