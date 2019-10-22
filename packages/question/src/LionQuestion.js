import { html } from '@lion/core';
import { LionFieldset } from '@lion/fieldset';
import  '@lion/radio-group';
import  '@lion/radio';

export class LionQuestion extends LionFieldset {
  _dispatchRegistration() {
    let group = this.$id('question-group');
    group.addEventListener('validation-done', ev => {
      this.__validate(ev);
    });
    group.errorValidators = [['required']];
    this.dispatchEvent(
      new CustomEvent('form-element-register', {
        detail: {element: group},
        bubbles: true
      })
    );

    super._dispatchRegistration();
  }
  _unregisterFormElement() {
    super._unregisterFormElement();
    this.removeFormElement(this.$id('question-group'));
  }

  inputGroupTemplate() {
    return html`
      <div class="input-group">
        <lion-radio-group
          name="question-group"
          label="Question"
          id="question-group"
          .errorValidators=${[`required`]}
          ><lion-radio
            name="question[]"
            label="Yes"
            .choiceValue="${'yes'}"
          ></lion-radio>
          <lion-radio
            name="question[]"
            label="No"
            .choiceValue="${'no'}"
          ></lion-radio>
        </lion-radio-group>
      </div>
    `;
  }
}
