# Input Tel >> Use Cases ||20

```js script
import { html } from '@mdjs/mdjs-preview';
import { ref, createRef } from '@lion/core';
import { Unparseable } from '@lion/form-core';
import { localize } from '@lion/localize';
import { loadDefaultFeedbackMessages } from '@lion/validate-messages';
import { PhoneUtilManager } from '@lion/input-tel';
import '@lion/input-tel/define';
import './src/h-region-code-table.js';
import '../../../docs/fundamentals/systems/form/assets/h-output.js';

// TODO: make each example load/use the dependencies by default
// loadDefaultFeedbackMessages();
```

## Regions: some context

Say we have the following telephone number from Madrid, Spain: `+34919930432`.

It contains a [country code](https://en.wikipedia.org/wiki/Country_code) (34), an [area code](https://en.wikipedia.org/wiki/Telephone_numbering_plan#Area_code) (91) and a [dial code](https://en.wikipedia.org/wiki/Mobile_dial_code) (+34 91).
Input Tel interprets phone numbers based on their [region code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2): a two character long region representation('ES' in the telephone number above).

The table below lists all possible regions worldwide. When [allowed regions](#allowed-regions) are not configured,
all of them will be supported as values of Input Tel.

```js story
export const regionCodesTable = () => {
  loadDefaultFeedbackMessages();
  return html`<h-region-code-table></h-region-code-table>`;
};
```

### Active region

The active region (accessible via readonly accessor `.activeRegion`) determines how validation and formatting
should be applied. It is dependent on the following factors:

- [allowed regions](#allowed-regions): a list that determines what is allowed to become .activeRegion. If
  [.allowedRegions has only one entry](#restrict-to-one-region), .activeRegion will always be this value.
- the modelValue or viewValue: once it contains sufficient info to derive its region code (and
  the derived code is inside [allowed regions](#allowed-regions) if configured)
- active locale (and the derived locale is inside [allowed regions](#allowed-regions) if configured)

What follows from the list above is that .activeRegion can change dynamically, after a value
change in the text box by the user (or when locales or allowed regions would be changed by the
Application Developer).

### How active region is computed

The following heuristic will be applied:

1. check for **allowed regions**: if one region defined in .allowedRegions, use it.
2. check for **user input**: try to derive active region from user input
3. check for **locale**: try to get the region from locale (`html[lang]` attribute)

```js preview-story
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
```

## Allowed regions

`.allowedRegions` is an array of one or more region codes.
Once it is configured, validation and formatting will be restricted to those
values that are present in this list.

> Note that for [InputTelDropdown](../input-tel-dropdown/index.md), only allowed regions will
> be shown in the dropdown list.

```js preview-story
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
```

### Restrict to one region

When one allowed region is configured, validation and formatting will be restricted to just that
region (that means that changes of the region via viewValue won't have effect).

```js preview-story
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
```

## Format strategy

Determines what the formatter output should look like.
Formatting strategies as provided by awesome-phonenumber / google-libphonenumber.

Possible values:

| strategy      |                 output |
| :------------ | ---------------------: |
| e164          |         `+46707123456` |
| international |     `+46 70 712 34 56` |
| national      |        `070-712 34 56` |
| significant   |            `707123456` |
| rfc3966       | `tel:+46-70-712-34-56` |

Also see:

- [awesome-phonenumber documentation](https://www.npmjs.com/package/awesome-phonenumber)

```js preview-story
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
      .modelValue=${'+46707123456'}
      format-strategy="national"
      name="phoneNumber"
    ></lion-input-tel>
    <h-output
      .show="${['modelValue', 'formatStrategy']}"
      .readyPromise="${PhoneUtilManager.loadComplete}"
    ></h-output>
  `;
};
```

## Live format

Type '6' in the example below to see how the phone number is formatted during typing.

See [awesome-phonenumber documentation](https://www.npmjs.com/package/awesome-phonenumber)

```js preview-story
export const liveFormat = () => {
  loadDefaultFeedbackMessages();
  return html`
    <lion-input-tel
      label="Realtime format on user input"
      help-text="Partial numbers are also formatted"
      .modelValue=${new Unparseable('+31')}
      format-strategy="international"
      live-format
      name="phoneNumber"
    ></lion-input-tel>
  `;
};
```

## Active phone number type

The readonly acessor `.activePhoneNumberType` outputs the current phone number type, based on
the textbox value.

Possible types: `fixed-line`, `fixed-line-or-mobile`, `mobile`, `pager`, `personal-number`, `premium-rate`, `shared-cost`, `toll-free`, `uan`, `voip`, `unknown`

Also see:

- [awesome-phonenumber documentation](https://www.npmjs.com/package/awesome-phonenumber)

```js preview-story
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
```
