/** script code **/
import { LitElement, html } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-select-rich.js';
import '@lion/ui/define/lion-option.js';
/** stories code **/
export const HtmlStory34 = () => html`<lion-select-rich label="Favorite color" name="color">
  <lion-option .choiceValue="${'red'}">
    <p style="color: red;">I am red</p>
    <p>and multi Line</p>
  </lion-option>
  <lion-option .choiceValue="${'hotpink'}" checked>
    <p style="color: hotpink;">I am hotpink</p>
    <p>and multi Line</p>
  </lion-option>
  <lion-option .choiceValue="${'teal'}">
    <p style="color: teal;">I am teal</p>
    <p>and multi Line</p>
  </lion-option>
</lion-select-rich>`;
export const manyOptionsWithScrolling = () => {
  const modelValues = [
    { value: 'red', checked: false },
    { value: 'hotpink', checked: true },
    { value: 'teal', checked: false },
    { value: 'green', checked: false },
    { value: 'blue', checked: false },
  ];
  return html`
  <style>
    #scrollSelectRich lion-options {
      max-height: 200px;
      overflow-y: auto;
      display: block;
    }
  </style>
  <lion-select-rich id="scrollSelectRich" label="Favorite color" name="color">
    <lion-option .modelValue="${modelValues[0]}">
      <p style="color: red;">I am red</p>
    </lion-option>
    <lion-option .modelValue="${modelValues[1]}">
      <p style="color: hotpink;">I am hotpink</p>
    </lion-option>
    <lion-option .modelValue="${modelValues[2]}">
      <p style="color: teal;">I am teal</p>
    </lion-option>
    <lion-option .modelValue="${modelValues[3]}">
      <p style="color: green;">I am green</p>
    </lion-option>
    <lion-option .modelValue"="${modelValues[4]}"">
      <p style="color: blue;">I am blue</p>
    </lion-option>
  </lion-select-rich>
`;
};
export const HtmlStory35 = () => html`<lion-select-rich label="Read-only select" readonly name="color">
  <lion-option .choiceValue="${'red'}">Red</lion-option>
  <lion-option .choiceValue="${'hotpink'}" checked>Hotpink</lion-option>
  <lion-option .choiceValue="${'teal'}">Teal</lion-option>
</lion-select-rich>`;
export const HtmlStory36 = () => html`<lion-select-rich label="Disabled select" disabled name="color">
  <lion-option .choiceValue="${'red'}">Red</lion-option>
  <lion-option .choiceValue="${'hotpink'}" checked>Hotpink</lion-option>
  <lion-option .choiceValue="${'teal'}">Teal</lion-option>
</lion-select-rich>`;
export const HtmlStory37 = () => html`<lion-select-rich label="Disabled options" name="color">
  <lion-option .choiceValue="${'red'}" disabled>Red</lion-option>
  <lion-option .choiceValue="${'blue'}">Blue</lion-option>
  <lion-option .choiceValue="${'hotpink'}" disabled>Hotpink</lion-option>
  <lion-option .choiceValue="${'green'}">Green</lion-option>
  <lion-option .choiceValue="${'teal'}" disabled>Teal</lion-option>
</lion-select-rich>`;
export const renderOptions = ({ shadowRoot }) => {
  const objs = [
    { type: 'mastercard', label: 'Master Card', amount: 12000, active: true },
    { type: 'visacard', label: 'Visa Card', amount: 0, active: false },
  ];
  function showOutput(ev) {
    shadowRoot.querySelector('#demoRenderOutput').innerHTML = JSON.stringify(
      ev.target.modelValue,
      null,
      2,
    );
  }
  return html`
    <lion-select-rich label="Credit Card" name="color" @model-value-changed="${showOutput}">
      ${objs.map(obj => html` <lion-option .choiceValue="${obj}">${obj.label}</lion-option> `)}
    </lion-select-rich>
    <p>Full value:</p>
    <pre id="demoRenderOutput"></pre>
  `;
};
export const HtmlStory38 = () => html`<lion-select-rich label="Mac mode" name="color" interaction-mode="mac">
  <lion-option .choiceValue="${'red'}">Red</lion-option>
  <lion-option .choiceValue="${'hotpink'}" checked>Hotpink</lion-option>
  <lion-option .choiceValue="${'teal'}">Teal</lion-option>
</lion-select-rich>
<lion-select-rich label="Windows/Linux mode" name="color" interaction-mode="windows/linux">
  <lion-option .choiceValue="${'red'}">Red</lion-option>
  <lion-option .choiceValue="${'hotpink'}" checked>Hotpink</lion-option>
  <lion-option .choiceValue="${'teal'}">Teal</lion-option>
</lion-select-rich>`;
export const checkedIndexAndValue = ({ shadowRoot }) => html`
  <style>
    .log-button {
      margin: 10px 0;
    }
  </style>
  <div>
    <label id="label-richSelectCheckedInput" for="richSelectCheckedInput">
      Set the checkedIndex
    </label>
    <input
      id="richSelectCheckedInput"
      aria-labelledby="label-richSelectCheckedInput"
      type="number"
      @change=${e => {
        const selectEl = shadowRoot.querySelector('#checkedRichSelect');
        selectEl.checkedIndex = Number(e.target.value);
      }}
    />
  </div>
  <button
    class="log-button"
    @click=${() => {
      const selectEl = shadowRoot.querySelector('#checkedRichSelect');
      console.log(`checkedIndex: ${selectEl.checkedIndex}`);
      console.log(`modelValue: ${selectEl.modelValue}`);
    }}
  >
    Console log checked index and value
  </button>
  <lion-select-rich id="checkedRichSelect" name="favoriteColor" label="Favorite color">
    <lion-option .choiceValue="${'red'}">Red</lion-option>
    <lion-option .choiceValue="${'hotpink'}" checked>Hotpink</lion-option>
    <lion-option .choiceValue="${'teal'}">Teal</lion-option>
  </lion-select-rich>
`;
export const HtmlStory39 = () => html`<lion-select-rich name="favoriteColor" label="Favorite color" has-no-default-selected>
  <lion-option .choiceValue="${'red'}">Red</lion-option>
  <lion-option .choiceValue="${'hotpink'}">Hotpink</lion-option>
  <lion-option .choiceValue="${'teal'}">Teal</lion-option>
</lion-select-rich>`;
export const HtmlStory40 = () => html`<lion-select-rich label="Single Option" name="color">
  <lion-option .choiceValue="${'red'}">Red</lion-option>
</lion-select-rich>`;
class SingleOptionRemoveAdd extends LitElement {
  static get properties() {
    return {
      options: { type: Array },
    };
  }

  constructor() {
    super();
    this.options = ['Option 1', 'Option 2'];
  }

  render() {
    return html`
      <button @click="${this.addOption}">Add an option</button>
      <button @click="${this.removeOption}">Remove last option</button>
      <lion-select-rich name="favoriteColor" label="Favorite color">
        <lion-options slot="input">
          ${this.options.map(
            option => html` <lion-option .choiceValue="${option}">${option}</lion-option> `,
          )}
        </lion-options>
      </lion-select-rich>
    `;
  }

  addOption() {
    this.options.push(`Option ${this.options.length + 1} with a long title`);
    this.options = [...this.options];
    this.requestUpdate();
  }

  removeOption() {
    if (this.options.length >= 2) {
      this.options.pop();
      this.options = [...this.options];
      this.requestUpdate();
    }
  }
}

customElements.define('single-option-remove-add', SingleOptionRemoveAdd);

export const singleOptionRemoveAdd = () => {
  return html`<single-option-remove-add></single-option-remove-add>`;
};
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'HtmlStory34', story: HtmlStory34 }, { key: 'manyOptionsWithScrolling', story: manyOptionsWithScrolling }, { key: 'HtmlStory35', story: HtmlStory35 }, { key: 'HtmlStory36', story: HtmlStory36 }, { key: 'HtmlStory37', story: HtmlStory37 }, { key: 'renderOptions', story: renderOptions }, { key: 'HtmlStory38', story: HtmlStory38 }, { key: 'checkedIndexAndValue', story: checkedIndexAndValue }, { key: 'HtmlStory39', story: HtmlStory39 }, { key: 'HtmlStory40', story: HtmlStory40 }, { key: 'singleOptionRemoveAdd', story: singleOptionRemoveAdd }];
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