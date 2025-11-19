/** script code **/
import { LitElement, html, repeat } from '@mdjs/mdjs-preview';
import { listboxData, listboxComplexData } from '@lion/demo-components/listbox/src/listboxData.js';
import { LionCombobox } from '@lion/ui/combobox.js';
import { Required } from '@lion/ui/form-core.js';
import '@lion/ui/define/lion-button.js';
import '@lion/ui/define/lion-combobox.js';
import '@lion/ui/define/lion-option.js';
import '@lion/demo-components/combobox/src/demo-selection-display.js';
import { lazyRender } from '@lion/demo-components/combobox/src/lazyRender.js';
import levenshtein from '@lion/demo-components/combobox/src/levenshtein.js';
import { loadDefaultFeedbackMessages } from '@lion/ui/validate-messages.js';
loadDefaultFeedbackMessages();
/** stories code **/
export const optionMatch = () => html`
  <lion-combobox name="search" label="Search" .requireOptionMatch="${false}">
    ${lazyRender(
      listboxData.map(entry => html` <lion-option .choiceValue="${entry}">${entry}</lion-option> `),
    )}
  </lion-combobox>
`;
export const autocompleteNone = () => html`
  <lion-combobox name="combo" label="Autocomplete 'none'" autocomplete="none">
    ${lazyRender(
      listboxData.map(entry => html` <lion-option .choiceValue="${entry}">${entry}</lion-option> `),
    )}
  </lion-combobox>
`;
export const autocompleteList = () => html`
  <lion-combobox name="combo" label="Autocomplete 'list'" autocomplete="list">
    ${lazyRender(
      listboxData.map(entry => html` <lion-option .choiceValue="${entry}">${entry}</lion-option> `),
    )}
  </lion-combobox>
`;
export const autocompleteInline = () => html`
  <lion-combobox name="combo" label="Autocomplete 'inline'" autocomplete="inline">
    ${lazyRender(
      listboxData.map(entry => html` <lion-option .choiceValue="${entry}">${entry}</lion-option> `),
    )}
  </lion-combobox>
`;
export const autocompleteBoth = () => html`
  <lion-combobox name="combo" label="Autocomplete 'both'" autocomplete="both">
    ${lazyRender(
      listboxData.map(entry => html` <lion-option .choiceValue="${entry}">${entry}</lion-option> `),
    )}
  </lion-combobox>
`;
export const matchModeBegin = () => html`
  <lion-combobox name="combo" label="Match Mode 'begin'" match-mode="begin">
    ${lazyRender(
      listboxData.map(entry => html` <lion-option .choiceValue="${entry}">${entry}</lion-option> `),
    )}
  </lion-combobox>
`;
export const matchModeAll = () => html`
  <lion-combobox name="combo" label="Match Mode 'all'" match-mode="all">
    ${lazyRender(
      listboxData.map(entry => html` <lion-option .choiceValue="${entry}">${entry}</lion-option> `),
    )}
  </lion-combobox>
`;
export const customMatchCondition = () => html`
  <lion-combobox
    name="combo"
    label="Custom Match Mode 'levenshtein'"
    help-text="Spelling mistakes will be forgiven. Try typing 'Aple' instead of 'Apple'"
    .matchCondition="${({ choiceValue }, textboxValue) => {
      const oVal = choiceValue.toLowerCase();
      const tVal = textboxValue.toLowerCase();
      const t = 1; // treshold
      return oVal.slice(0, t) === tVal.slice(0, t) && levenshtein(oVal, tVal) < 3;
    }}"
  >
    ${lazyRender(
      listboxData.map(entry => html` <lion-option .choiceValue="${entry}">${entry}</lion-option> `),
    )}
  </lion-combobox>
`;
class DemoDisabledState extends LitElement {
  static get properties() {
    return { disabled: { type: Boolean } };
  }

  constructor() {
    super();
    /** @type {string[]} */
    this.disabled = true;
  }

  get combobox() {
    return /** @type {LionCombobox} */ (this.shadowRoot?.querySelector('#combobox'));
  }

  /**
   * @param {InputEvent & {target: HTMLInputElement}} e
   */
  toggleDisabled(e) {
    this.disabled = !this.disabled;
    this.requestUpdate();
  }

  render() {
    return html`
      <lion-button @click=${this.toggleDisabled}>Toggle disabled</lion-button> Disabled state:
      ${this.disabled}
      <lion-combobox name="search" label="Search" ?disabled=${this.disabled}>
        ${lazyRender(
          listboxData.map(
            entry => html` <lion-option .choiceValue="${entry}">${entry}</lion-option> `,
          ),
        )}
      </lion-combobox>
    `;
  }
}
customElements.define('demo-disabled-state', DemoDisabledState);
export const disabledState = () => html`<demo-disabled-state></demo-disabled-state>`;
class DemoReadonlyState extends LitElement {
  static get properties() {
    return { readOnly: { type: Boolean } };
  }

  constructor() {
    super();
    /** @type {string[]} */
    this.readOnly = true;
  }

  get combobox() {
    return /** @type {LionCombobox} */ (this.shadowRoot?.querySelector('#combobox'));
  }

  /**
   * @param {InputEvent & {target: HTMLInputElement}} e
   */
  toggleReadonly(e) {
    this.readOnly = !this.readOnly;
    this.requestUpdate();
  }

  render() {
    return html`
      <lion-button @click=${this.toggleReadonly}>Toggle readonly</lion-button> ReadOnly state:
      ${this.readOnly}
      <lion-combobox name="search" label="Search" ?readOnly=${this.readOnly}>
        ${lazyRender(
          listboxData.map(
            entry => html` <lion-option .choiceValue="${entry}">${entry}</lion-option> `,
          ),
        )}
      </lion-combobox>
    `;
  }
}
customElements.define('demo-readonly-state', DemoReadonlyState);
export const readonlyState = () => html`<demo-readonly-state></demo-readonly-state>`;
export const showAllOnEmpty = () => html`
  <lion-combobox
    name="combo"
    label="Show all on empty"
    help-text="Shows all (options) on empty (textbox has no value)"
    show-all-on-empty
  >
    ${lazyRender(
      listboxData.map(entry => html` <lion-option .choiceValue="${entry}">${entry}</lion-option> `),
    )}
  </lion-combobox>
`;
export const noSelectionFollowsFocus = () => html`
  <lion-combobox name="combo" label="No Selection Follows focus" .selectionFollowsFocus="${false}">
    ${lazyRender(
      listboxData.map(entry => html` <lion-option .choiceValue="${entry}">${entry}</lion-option> `),
    )}
  </lion-combobox>
`;
export const noRotateKeyboardNavigation = () => html`
  <lion-combobox
    name="combo"
    label="No Rotate Keyboard Navigation"
    .rotateKeyboardNavigation="${false}"
  >
    ${lazyRender(
      listboxData.map(entry => html` <lion-option .choiceValue="${entry}">${entry}</lion-option> `),
    )}
  </lion-combobox>
`;
export const multipleChoice = () => html`
  <lion-combobox name="combo" label="Multiple" multiple-choice>
    <demo-selection-display
      slot="selection-display"
      style="display: contents;"
    ></demo-selection-display>
    ${lazyRender(
      listboxData.map(
        (entry, i) => html`
          <lion-option .choiceValue="${entry}" ?checked="${i === 0}">${entry}</lion-option>
        `,
      ),
    )}
  </lion-combobox>
`;
export const multipleCustomizableChoice = () => html`
  <lion-combobox name="combo" label="Multiple" .requireOptionMatch="${false}" multiple-choice>
    <demo-selection-display
      slot="selection-display"
      style="display: contents;"
    ></demo-selection-display>
    ${lazyRender(
      listboxData.map(
        (entry, i) => html`
          <lion-option .choiceValue="${entry}" ?checked="${i === 0}">${entry}</lion-option>
        `,
      ),
    )}
  </lion-combobox>
`;
export const validation = () => html`
  <lion-combobox name="combo" label="Validation" .validators="${[new Required()]}">
    ${lazyRender(
      listboxData.map(entry => html` <lion-option .choiceValue="${entry}">${entry}</lion-option> `),
    )}
  </lion-combobox>
`;
export const invokerButton = () => html`
  <lion-combobox
    .modelValue="${listboxData[1]}"
    autocomplete="none"
    name="combo"
    label="Invoker Button"
    @click="${({ currentTarget: el }) => {
      el.opened = !el.opened;
    }}"
  >
    <button slot="suffix" type="button" tabindex="-1">▼</button>
    ${lazyRender(
      listboxData.map(entry => html` <lion-option .choiceValue="${entry}">${entry}</lion-option> `),
    )}
  </lion-combobox>
`;
const comboboxData = ['lorem', 'ipsum', 'dolor', 'sit', 'amet'];
let rejectPrev;
/**
 * @param {string} val
 */
function fetchMyData(val) {
  if (rejectPrev) {
    rejectPrev();
  }
  const results = listboxData.filter(item => item.toLowerCase().includes(val.toLowerCase()));
  return new Promise((resolve, reject) => {
    rejectPrev = reject;
    setTimeout(() => {
      resolve(results);
    }, 1000);
  });
}
class DemoServerSide extends LitElement {
  static get properties() {
    return { options: { type: Array } };
  }

  constructor() {
    super();
    /** @type {string[]} */
    this.options = [];
  }

  get combobox() {
    return /** @type {LionCombobox} */ (this.shadowRoot?.querySelector('#combobox'));
  }

  /**
   * @param {InputEvent & {target: HTMLInputElement}} e
   */
  async fetchMyDataAndRender(e) {
    this.loading = true;
    this.requestUpdate();
    try {
      this.options = await fetchMyData(e.target.value);
      this.loading = false;
      this.requestUpdate();
    } catch (_) {}
  }

  render() {
    return html`
      <lion-combobox
        .showAllOnEmpty="${true}"
        id="combobox"
        @input="${this.fetchMyDataAndRender}"
        .helpText="Returned from server: [${this.options.join(', ')}]"
      >
        <label slot="label" aria-live="polite"
          >Server side completion
          ${this.loading ? html`<span style="font-style: italic;">(loading...)</span>` : ''}</label
        >
        ${repeat(
          this.options,
          entry => entry,
          entry => html` <lion-option .choiceValue="${entry}">${entry}</lion-option> `,
        )}
      </lion-combobox>
    `;
  }
}
customElements.define('demo-server-side', DemoServerSide);
export const serverSideCompletion = () => html`<demo-server-side></demo-server-side>`;
class ComplexObjectCombobox extends LionCombobox {
  /**
   * @overridable
   * @param {LionOption & {__originalInnerHTML?:string}} option
   * @param {string} matchingString
   * @protected
   */
  _onFilterMatch(option, matchingString) {
    Array.from(option.children).forEach(child => {
      if (child.hasAttribute('data-key')) {
        this._highlightMatchedOption(child, matchingString);
      }
    });
    // Alternatively, an extension can add an animation here
    option.style.display = '';
  }

  /**
   * @overridable
   * @param {LionOption & {__originalInnerHTML?:string}} option
   * @param {string} [curValue]
   * @param {string} [prevValue]
   * @protected
   */
  _onFilterUnmatch(option, curValue, prevValue) {
    Array.from(option.children).forEach(child => {
      if (child.hasAttribute('data-key')) {
        this._unhighlightMatchedOption(child);
      }
    });
    // Alternatively, an extension can add an animation here
    option.style.display = 'none';
  }
}

customElements.define('complex-object-combobox', ComplexObjectCombobox);

const onModelValueChanged = event => {
  console.log(`event.target.modelValue: ${JSON.stringify(event.target.modelValue)}`);
};

export const complexObjectChoiceValue = () =>
  html` <complex-object-combobox
    name="combo"
    label="Display only the label once selected"
    @model-value-changed="${onModelValueChanged}"
  >
    ${lazyRender(
      listboxComplexData.map(
        entry => html`
          <lion-option .choiceValue="${entry.label}">
            <div data-key>${entry.label}</div>
            <small>${entry.description}</small>
          </lion-option>
        `,
      ),
    )}
  </complex-object-combobox>`;
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'optionMatch', story: optionMatch }, { key: 'autocompleteNone', story: autocompleteNone }, { key: 'autocompleteList', story: autocompleteList }, { key: 'autocompleteInline', story: autocompleteInline }, { key: 'autocompleteBoth', story: autocompleteBoth }, { key: 'matchModeBegin', story: matchModeBegin }, { key: 'matchModeAll', story: matchModeAll }, { key: 'customMatchCondition', story: customMatchCondition }, { key: 'disabledState', story: disabledState }, { key: 'readonlyState', story: readonlyState }, { key: 'showAllOnEmpty', story: showAllOnEmpty }, { key: 'noSelectionFollowsFocus', story: noSelectionFollowsFocus }, { key: 'noRotateKeyboardNavigation', story: noRotateKeyboardNavigation }, { key: 'multipleChoice', story: multipleChoice }, { key: 'multipleCustomizableChoice', story: multipleCustomizableChoice }, { key: 'validation', story: validation }, { key: 'invokerButton', story: invokerButton }, { key: 'serverSideCompletion', story: serverSideCompletion }, { key: 'complexObjectChoiceValue', story: complexObjectChoiceValue }];
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