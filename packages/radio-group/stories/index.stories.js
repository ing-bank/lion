import { storiesOf, html } from '@open-wc/demoing-storybook';
// just a POC
// eslint-disable-next-line
import { overlays, LocalOverlayController } from '@lion/overlays';
import { LitElement } from '@lion/core';

import '../lion-radio-group.js';
import '@lion/radio/lion-radio.js';
import '@lion/form/lion-form.js';
import { LionRadioGroup } from '../src/LionRadioGroup.js';

export class LionSelectRich extends LitElement {
  get modelValue() {
    return this.contentNode.modelValue;
  }

  connectedCallback() {
    super.connectedCallback();
    this.contentNode = this.querySelector('[slotpoc="content"]');
    this.invokerNode = this.querySelector('[slotpoc="invoker"]');

    this._popup = overlays.add(
      new LocalOverlayController({
        hidesOnEsc: true,
        hidesOnOutsideClick: false,
        placement: this.position,
        contentNode: this.contentNode,
        invokerNode: this.invokerNode,
      }),
    );
    this._show = () => this._popup.show();
    this._hide = () => {
      this._popup.hide();
    };

    this._toggle = () => {
      this._popup.toggle();
    };

    this.invokerNode.addEventListener('click', this._toggle);
    this.contentNode.addEventListener('checked-value-changed', ev => {
      this.invokerNode.innerText = ev.target.checkedValue;
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.invokerNode.removeEventListener('click', this._toggle);
  }

  render() {
    return html`
      <slot></slot>
    `;
  }
}

customElements.define('lion-select-rich', LionSelectRich);

export class LionListbox extends LionRadioGroup {}

customElements.define('lion-listbox', LionListbox);

storiesOf('Forms|Radio Group', module)
  .add(
    'SELECT',
    () => html`
      <lion-form>
        <form>
          <lion-select-rich name="dinosGroup" label="What are your favourite dinosaurs?">
            <button slotpoc="invoker">click</button>
            <lion-listbox slotpoc="content" name="foo">
              <lion-radio
                name="dinos[]"
                label="allosaurus"
                .choiceValue=${'allosaurus'}
              ></lion-radio>
              <lion-radio
                name="dinos[]"
                label="brontosaurus"
                .choiceValue=${'brontosaurus'}
              ></lion-radio>
              <lion-radio
                name="dinos[]"
                label="diplodocus"
                .modelValue=${{ value: 'diplodocus', checked: true }}
              ></lion-radio>
            </lion-listbox>
          </lion-select-rich>
        </form>
      </lion-form>
    `,
  )
  .add(
    'Default',
    () => html`
      <lion-form>
        <form>
          <lion-radio-group name="dinosGroup" label="What are your favourite dinosaurs?">
            <lion-radio name="dinos[]" label="allosaurus" .choiceValue=${'allosaurus'}></lion-radio>
            <lion-radio
              name="dinos[]"
              label="brontosaurus"
              .choiceValue=${'brontosaurus'}
            ></lion-radio>
            <lion-radio name="dinos[]" label="diplodocus" .choiceValue=${'diplodocus'}></lion-radio>
          </lion-radio-group>
        </form>
      </lion-form>
    `,
  )
  .add(
    'Pre Select',
    () => html`
      <lion-form>
        <form>
          <lion-radio-group name="dinosGroup" label="What are your favourite dinosaurs?">
            <lion-radio name="dinos[]" label="allosaurus" .choiceValue=${'allosaurus'}></lion-radio>
            <lion-radio
              name="dinos[]"
              label="brontosaurus"
              .choiceValue=${'brontosaurus'}
            ></lion-radio>
            <lion-radio
              name="dinos[]"
              label="diplodocus"
              .modelValue=${{ value: 'diplodocus', checked: true }}
            ></lion-radio>
          </lion-radio-group>
        </form>
      </lion-form>
    `,
  )
  .add(
    'Disabled',
    () => html`
      <lion-form>
        <form>
          <lion-radio-group name="dinosGroup" label="What are your favourite dinosaurs?" disabled>
            <lion-radio name="dinos[]" label="allosaurus" .choiceValue=${'allosaurus'}></lion-radio>
            <lion-radio
              name="dinos[]"
              label="brontosaurus"
              .choiceValue=${'brontosaurus'}
            ></lion-radio>
            <lion-radio
              name="dinos[]"
              label="diplodocus"
              .modelValue=${{ value: 'diplodocus', checked: true }}
            ></lion-radio>
          </lion-radio-group>
        </form>
      </lion-form>
    `,
  )
  .add('Validation', () => {
    const submit = () => {
      const form = document.querySelector('#form');
      if (form.errorState === false) {
        console.log(form.serializeGroup());
      }
    };
    return html`
      <lion-form id="form" @submit="${submit}"
        ><form>
          <lion-radio-group
            name="dinosGroup"
            label="What are your favourite dinosaurs?"
            .errorValidators=${[['required']]}
          >
            <lion-radio name="dinos[]" label="allosaurus" .choiceValue=${'allosaurus'}></lion-radio>
            <lion-radio
              name="dinos[]"
              label="brontosaurus"
              .choiceValue=${'brontosaurus'}
            ></lion-radio>
            <lion-radio
              name="dinos[]"
              label="diplodocus"
              .choiceValue="${'diplodocus'}}"
            ></lion-radio>
          </lion-radio-group>
          <button type="submit">Submit</button>
        </form></lion-form
      >
    `;
  });
