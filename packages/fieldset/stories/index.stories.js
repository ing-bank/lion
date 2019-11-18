import { storiesOf, html } from '@open-wc/demoing-storybook';

import '../lion-fieldset.js';
import '@lion/input/lion-input.js';
import { localize } from '@lion/localize';

import { Validator, MinLength, loadDefaultFeedbackMessages } from '@lion/validate';

import '../../form-system/stories/helper-wc/h-output.js';

localize.locale = 'en-GB';
loadDefaultFeedbackMessages();

storiesOf('Forms|Fieldset', module)
  .add(
    'Default',
    () => html`
      <p>
        A native fieldset element should always have a legend-element for a11y purposes. Our
        fieldset element is not native and should not have a legend-element. Our fieldset instead
        has a label attribute or you can add a label with a div- or heading-element using the
        slot="label". Please don't use the the label-element because that is reserved for
        input-elements.
      </p>
      <lion-fieldset name="nameGroup" label="Name">
        <lion-input name="FirstName" label="First Name"></lion-input>
        <lion-input name="LastName" label="Last Name"></lion-input>
      </lion-fieldset>
    `,
  )
  .add(
    'Data',
    () => html`
      <lion-fieldset name="nameGroup" label="Name">
        <lion-input name="FirstName" label="First Name" .modelValue=${'Foo'}></lion-input>
        <lion-input name="LastName" label="Last Name" .modelValue=${'Bar'}></lion-input>
        <button @click=${ev => console.log(ev.target.parentElement.modelValue)}>
          Log to Action Logger
        </button>
      </lion-fieldset>
    `,
  )
  .add('Disabled', () => {
    function toggleDisabled() {
      const fieldset = document.querySelector('#fieldset');
      fieldset.disabled = !fieldset.disabled;
    }
    return html`
      <lion-fieldset name="nameGroup" label="Name" id="fieldset" disabled>
        <lion-input name="FirstName" label="First Name" .modelValue=${'Foo'}></lion-input>
        <lion-input name="LastName" label="Last Name" .modelValue=${'Bar'}></lion-input>
        <lion-fieldset name="nameGroup2" label="Name">
          <lion-input
            name="FirstName2"
            label="First Name"
            .modelValue=${'Foo'}
            disabled
          ></lion-input>
          <lion-input name="LastName2" label="Last Name" .modelValue=${'Bar'}></lion-input>
        </lion-fieldset>
      </lion-fieldset>
      <button @click=${toggleDisabled}>
        Toggle disabled
      </button>
    `;
  })
  .add(
    'Sub Fieldsets Data',
    () => html`
      <lion-fieldset>
        <div slot="label">Personal data</div>
        <lion-fieldset name="nameGroup" label="Name">
          <lion-input name="FirstName" label="First Name" .modelValue=${'Foo'}></lion-input>
          <lion-input name="LastName" label="Last Name" .modelValue=${'Bar'}></lion-input>
        </lion-fieldset>
        <lion-fieldset name="location" label="Location">
          <lion-input name="country" label="Country" .modelValue=${'Netherlands'}></lion-input>
        </lion-fieldset>
        <lion-input name="age" label="Age" .modelValue=${21}></lion-input>
        <button @click=${ev => console.log(ev.target.parentElement.modelValue)}>
          Log to Action Logger
        </button>
        <br />
        <button
          @click=${ev => console.log(ev.target.parentElement.formElements.nameGroup.modelValue)}
        >
          Log nameGroup to Action Logger
        </button>
      </lion-fieldset>
    `,
  )
  .add('Validation', () => {
    const DemoValidator = class extends Validator {
      constructor() {
        super();
        this.name = 'DemoValidator';
      }

      execute(value) {
        if (value && value.input1) {
          return true; // el.hasError = true
        }
        return false;
      }

      static async getMessage() {
        return '[Fieldset Error] Demo error message';
      }
    };
    return html`
      <lion-fieldset id="someId" .validators="${[new DemoValidator()]}">
        <lion-input name="input1" label="Label"> </lion-input>
      </lion-fieldset>
    `;
  })
  .add('Validation 2 inputs', () => {
    const IsCatsAndDogs = class extends Validator {
      constructor() {
        super();
        this.name = 'IsCatsAndDogs';
      }

      execute(value) {
        if (!(value && value.input1 && value.input2)) {
          return false;
        }
        return !(value.input1 === 'cats' && value.input2 === 'dogs');
      }

      static async getMessage() {
        return '[Fieldset Error] Input 1 needs to be "cats" and Input 2 needs to be "dogs"';
      }
    };
    return html`
      <lion-fieldset .validators="${[new IsCatsAndDogs()]}">
        <lion-input
          label="An all time YouTube favorite"
          name="input1"
          help-text="longer than 2 characters"
          .validators="${[new MinLength(3)]}"
        >
        </lion-input>
        <lion-input
          label="Another all time YouTube favorite"
          name="input2"
          help-text="longer than 2 characters"
          .validators="${[new MinLength(3)]}"
        >
        </lion-input>
      </lion-fieldset>
    `;
  })
  .add('Validation 2 fields', () => {
    const IsCats = class extends Validator {
      constructor() {
        super();
        this.name = 'IsCats';
      }

      execute(value) {
        return value.input1 !== 'cats';
      }

      static async getMessage() {
        return '[Fieldset Nr. 1 Error] Input 1 needs to be "cats"';
      }
    };

    const IsDogs = class extends Validator {
      constructor() {
        super();
        this.name = 'IsDogs';
      }

      execute(value) {
        return value.input1 !== 'dogs';
      }

      static async getMessage() {
        return '[Fieldset Nr. 2 Error] Input 1 needs to be "dogs"';
      }
    };
    return html`
      <lion-fieldset .validators="${[new IsCats()]}">
        <label slot="label">Fieldset no. 1</label>
        <lion-input
          label="An all time YouTube favorite"
          name="input1"
          help-text="longer than 2 characters"
          .validators="${[new MinLength(3)]}"
        >
        </lion-input>
      </lion-fieldset>

      <hr />

      <lion-fieldset .validators="${[new IsDogs()]}">
        <label slot="label">Fieldset no. 2</label>
        <lion-input
          label="An all time YouTube favorite"
          name="input1"
          help-text="longer than 2 characters"
          .validators="${[new MinLength(3)]}"
        >
        </lion-input>
      </lion-fieldset>
    `;
  });
