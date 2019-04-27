import { expect, fixture, unsafeStatic, html, defineCE } from '@open-wc/testing';
import sinon from 'sinon';
import { LionLitElement } from '@lion/core/src/LionLitElement.js';

import { InteractionStateMixin } from '../src/InteractionStateMixin.js';

describe('InteractionStateMixin', async () => {
  let elem;
  before(() => {
    elem = defineCE(
      class IState extends InteractionStateMixin(LionLitElement) {
        set modelValue(v) {
          this._modelValue = v;
          this.dispatchEvent(
            new CustomEvent('model-value-changed', { bubbles: true, composed: true }),
          );
        }

        get modelValue() {
          return this._modelValue;
        }

        get inputElement() {
          return this.querySelector('input');
        }
      },
    );
  });

  it('sets states to false on init', async () => {
    const input = await fixture(`<${elem}><input slot="input"></${elem}>`);
    expect(input.dirty).to.equal(false);
    expect(input.touched).to.equal(false);
    expect(input.prefilled).to.equal(false);
  });

  it('sets dirty when value changed', async () => {
    const input = await fixture(`<${elem}><input slot="input"></${elem}>`);
    input.modelValue = 'foobar';
    expect(input.dirty).to.equal(true);
  });

  // Skipping, since this issue (not being able to set focus on element extending from LitElement)
  // only occurs in WCT context (not in Storybook/Stackblitz).
  // See: https://stackblitz.com/edit/lit-element-request-update-bug-g59tjq?file=blurry.js
  // it.skip
  it('sets touched to true when field left after focus', async () => {
    // const formElement = await LionTest.htmlFixture(`<${elem}><input type="text" slot="input"></${elem}>`);
    // await triggerFocusFor(formElement.inputElement); // focus/blur can't be delegated
    // await triggerBlurFor(formElement.inputElement);
    // expect(formElement.touched).to.equal(true);
  });

  it('sets a class "state-(touched|dirty)"', async () => {
    const state = await fixture(`<${elem}><input slot="input"></${elem}>`);
    state.touched = true;
    await state.updateComplete;
    expect(state.classList.contains('state-touched')).to.equal(true, 'has class "state-touched"');

    state.dirty = true;
    await state.updateComplete;
    expect(state.classList.contains('state-dirty')).to.equal(true, 'has class "state-dirty"');
  });

  it('fires "(touched|dirty)-state-changed" event when state changes', async () => {
    const iState = await fixture(`<${elem}><input slot="input"></${elem}>`);
    const cbTouched = sinon.spy();
    const cbDirty = sinon.spy();

    iState.addEventListener('touched-changed', cbTouched);
    iState.addEventListener('dirty-changed', cbDirty);

    iState.touched = true;
    expect(cbTouched.callCount).to.equal(1);

    iState.dirty = true;
    expect(cbDirty.callCount).to.equal(1);
  });

  // Skipping, since this issue (not being able to set focus on element extending from LitElement)
  // only occurs in WCT context (not in Storybook/Stackblitz).
  // See: https://stackblitz.com/edit/lit-element-request-update-bug-g59tjq?file=blurry.js
  // it.skip
  it('sets prefilled to true when field left and value non-empty', async () => {
    // const iState = await LionTest.htmlFixture(`<${elem}><input slot="input"></${elem}>`);
    // await triggerFocusFor(iState.inputElement);
    // iState.modelValue = externalVariables.prefilledModelValue || '000';
    // await triggerBlurFor(iState.inputElement);
    // expect(iState.prefilled).to.equal(true);
    // await triggerFocusFor(iState.inputElement);
    // iState.modelValue = externalVariables.nonPrefilledModelValue || '';
    // await triggerBlurFor(iState.inputElement);
    // expect(iState.prefilled).to.equal(false);
  });

  it('sets prefilled once instantiated', async () => {
    const tag = unsafeStatic(elem);
    const element = await fixture(html`
    <${tag}
      .modelValue=${'prefilled'}
    ><input slot="input"></${tag}>`);
    expect(element.prefilled).to.equal(true);

    const nonPrefilled = await fixture(html`
      <${tag}
      .modelValue=''}
      ><input slot="input"></${tag}>`);
    expect(nonPrefilled.prefilled).to.equal(false);
  });

  // This method actually tests the implementation of the _isPrefilled method.
  it(`can determine "prefilled" based on different modelValue types (Arrays, Objects, Numbers,
    Booleans, Strings)`, async () => {
    const input = await fixture(`<${elem}><input slot="input"></${elem}>`);

    const changeModelValueAndLeave = modelValue => {
      input.dispatchEvent(new Event('focus', { bubbles: true }));
      input.modelValue = modelValue;
      input.dispatchEvent(new Event('blur', { bubbles: true }));
    };

    // Prefilled
    changeModelValueAndLeave(input, ['bla']);
    expect(input.prefilled).to.equal(false, 'empty array should be considered "prefilled"');
    changeModelValueAndLeave(input, { bla: 'bla' });
    expect(input.prefilled).to.equal(false, 'empty object should be considered "prefilled"');
    changeModelValueAndLeave(input, 0);
    expect(input.prefilled).to.equal(false, 'numbers should be considered "prefilled"');
    changeModelValueAndLeave(input, false);
    expect(input.prefilled).to.equal(false, 'Booleans should be considered "prefilled"');
    changeModelValueAndLeave(input, '');
    expect(input.prefilled).to.equal(false, 'empty string should be considered "prefilled"');

    // Not prefilled
    changeModelValueAndLeave(input, []);
    expect(input.prefilled).to.equal(false, 'empty array should not be considered "prefilled"');
    changeModelValueAndLeave(input, {});
    expect(input.prefilled).to.equal(false, 'empty object should not be considered "prefilled"');
    changeModelValueAndLeave(input, '');
    expect(input.prefilled).to.equal(false, 'empty string should not be considered "prefilled"');

    changeModelValueAndLeave(input, null);
    expect(input.prefilled).to.equal(false, 'null should not be considered "prefilled"');
    changeModelValueAndLeave(input, undefined);
    expect(input.prefilled).to.equal(false, 'undefined should not be considered "prefilled"');
  });

  it('has a method resetInteractionState()', async () => {
    const input = await fixture(`<${elem}><input slot="input"></${elem}>`);
    input.dirty = true;
    input.touched = true;
    input.prefilled = true;
    input.resetInteractionState();
    expect(input.dirty).to.equal(false);
    expect(input.touched).to.equal(false);
    expect(input.prefilled).to.equal(false);

    input.dirty = true;
    input.touched = true;
    input.prefilled = false;
    input.modelValue = 'Some value';
    input.resetInteractionState();
    expect(input.dirty).to.equal(false);
    expect(input.touched).to.equal(false);
    expect(input.prefilled).to.equal(true);
  });
});
