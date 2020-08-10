[//]: # 'AUTO INSERT HEADER PREPUBLISH'

# Features Overview

This is a meta package to show interaction between various form elements.
For usage and installation please see the appropriate packages.

```js script
import { html } from 'lit-html';
import '@lion/checkbox-group/lion-checkbox-group.js';
import '@lion/checkbox-group/lion-checkbox.js';
import '@lion/fieldset/lion-fieldset.js';
import '@lion/form/lion-form.js';
import '@lion/input-amount/lion-input-amount.js';
import '@lion/input-date/lion-input-date.js';
import '@lion/input-datepicker/lion-input-datepicker.js';
import '@lion/input-email/lion-input-email.js';
import '@lion/input-iban/lion-input-iban.js';
import '@lion/input-range/lion-input-range.js';
import '@lion/input/lion-input.js';
import '@lion/radio-group/lion-radio-group.js';
import '@lion/radio-group/lion-radio.js';
import '@lion/select/lion-select.js';
import '@lion/select-rich/lion-option.js';
import '@lion/select-rich/lion-options.js';
import '@lion/select-rich/lion-select-rich.js';
import '@lion/textarea/lion-textarea.js';
import { MinLength, Required } from '@lion/form-core';
import { loadDefaultFeedbackMessages } from '@lion/validate-messages';

import { model } from './directives/model.js';

export default {
  title: 'Forms/Best Practices',
};
```

## Model directive

```js preview-story
export const main = () => {
  const myModel = {
    full_name: {
      first_name: 'John',
      last_name: 'Doe',
    },
    date: new Date('2000-12-12'),
    datepicker: new Date('2000-12-12'),
    // non prefilled will be syncde back
  };

  const outputNode = document.createElement('pre');
  Object.assign(outputNode.style, {
    position: 'fixed',
    right: '16px',
    top: '16px',
    background: 'white',
    padding: '16px',
    outline: '1px solid #eee',
    width: '400px',
    boxShadow: '5px 5px 10px #ddd',
  });

  function updateModelDisplay() {
    outputNode.innerHTML = JSON.stringify(myModel, null, 2);
  }

  function onFormModelValueChanged(ev) {
    updateModelDisplay();
    setLocalStorage(ev.currentTarget);
  }

  function setLocalStorage(el) {
    localStorage.setItem('lion.form-best-practices.model', JSON.stringify(el.serializedValue));
  }

  function getLocalStorage() {
    return JSON.parse(localStorage.getItem('lion.form-best-practices.model') || '{}');
  }

  function updateForm() {
    // Note that in a lit element, a render would be triggered by updating myModel object
    const lionFormNode = document.getElementById('lionFormBestPracticesModel');
    lionFormNode.modelValue = myModel;
  }

  function checkAllSiblingGroup({ target }) {
    if (target.modelValue[0] === 'all') {
      // TODO: why not make a function checkAll() and uncheckAll(?)
      myModel.checkers = ['foo', 'bar', 'baz'];
    } else {
      myModel.checkers = [];
    }
    // Timeout needed, else we write back old 'all' value
    // This also aligns with async nature of a regular render
    setTimeout(updateForm);
  }

  loadDefaultFeedbackMessages();
  Required.getMessage = () => 'Please enter a value';
  return html`
    ${outputNode}

    <lion-form
      id="lionFormBestPracticesModel"
      :="${model(myModel)}"
      @model-value-changed="${onFormModelValueChanged}}"
      .serializedValue="${getLocalStorage()}"
    >
      <form>
        <lion-fieldset name="full_name">
          <lion-input
            name="first_name"
            label="First Name"
            .validators="${[new Required()]}"
          ></lion-input>
          <lion-input
            name="last_name"
            label="Last Name"
            .validators="${[new Required()]}"
          ></lion-input>
        </lion-fieldset>
        <lion-input-date
          name="date"
          label="Date of application"
          .validators="${[new Required()]}"
        ></lion-input-date>
        <lion-input-datepicker
          name="datepicker"
          label="Date to be picked"
          .validators="${[new Required()]}"
        ></lion-input-datepicker>
        <lion-textarea
          name="bio"
          label="Biography"
          .validators="${[new Required(), new MinLength(10)]}"
          help-text="Please enter at least 10 characters"
        ></lion-textarea>
        <lion-input-amount name="money" label="Money"></lion-input-amount>
        <lion-input-iban name="iban" label="Iban"></lion-input-iban>
        <lion-input-email name="email" label="Email"></lion-input-email>
        <lion-checkbox-group name="select_all" @model-value-changed=${checkAllSiblingGroup}>
          <lion-checkbox label="All" .choiceValue=${'all'}></lion-checkbox>
        </lion-checkbox-group>
        <lion-checkbox-group
          label="What do you like?"
          name="checkers"
          .validators="${[new Required()]}"
        >
          <lion-checkbox .choiceValue=${'foo'} label="I like foo"></lion-checkbox>
          <lion-checkbox .choiceValue=${'bar'} label="I like bar"></lion-checkbox>
          <lion-checkbox .choiceValue=${'baz'} label="I like baz"></lion-checkbox>
        </lion-checkbox-group>
        <lion-radio-group
          name="dinosaurs"
          label="Favorite dinosaur"
          .validators="${[new Required()]}"
        >
          <lion-radio .choiceValue=${'allosaurus'} label="allosaurus"></lion-radio>
          <lion-radio .choiceValue=${'brontosaurus'} label="brontosaurus"></lion-radio>
          <lion-radio .choiceValue=${'diplodocus'} label="diplodocus"></lion-radio>
        </lion-radio-group>
        <lion-select-rich name="favoriteColor" label="Favorite color">
          <lion-options slot="input">
            <lion-option .choiceValue=${'red'}>Red</lion-option>
            <lion-option .choiceValue=${'hotpink'} checked>Hotpink</lion-option>
            <lion-option .choiceValue=${'teal'}>Teal</lion-option>
          </lion-options>
        </lion-select-rich>
        <lion-select label="Lyrics" name="lyrics" .validators="${[new Required()]}">
          <select slot="input">
            <option value="1">Fire up that loud</option>
            <option value="2">Another round of shots...</option>
            <option value="3">Drop down for what?</option>
          </select>
        </lion-select>
        <lion-input-range
          name="range"
          min="1"
          max="5"
          .modelValue="${2.3}"
          unit="%"
          step="0.1"
          label="Input range"
        ></lion-input-range>
        <lion-checkbox-group
          .mulipleChoice="${false}"
          name="terms"
          .validators="${[new Required()]}"
        >
          <lion-checkbox label="I blindly accept all terms and conditions"></lion-checkbox>
        </lion-checkbox-group>
        <lion-textarea name="comments" label="Comments"></lion-textarea>
        <div class="buttons">
          <lion-button raised>Submit</lion-button>
          <lion-button
            type="button"
            raised
            @click=${ev => ev.currentTarget.parentElement.parentElement.parentElement.resetGroup()}
            >Reset</lion-button
          >
        </div>
      </form>
    </lion-form>
  `;
};
```
