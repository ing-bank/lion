import { html } from 'lit/static-html.js';
import { LionField, Required } from '@lion/ui/form-core.js';
import { LionFieldset } from '@lion/ui/fieldset.js';
import { LionCheckbox, LionCheckboxGroup } from '@lion/ui/checkbox-group.js';
import { LionRadio, LionRadioGroup } from '@lion/ui/radio-group.js';
import { LionListbox, LionOption } from '@lion/ui/listbox.js';
import { LionForm } from '@lion/ui/form.js';
import { spy } from 'sinon';
import {
  fixture as _fixture,
  unsafeStatic,
  aTimeout,
  defineCE,
  oneEvent,
  expect,
} from '@open-wc/testing';
import { resolveSuiteTag } from '../../core/test-helpers/resolveSuiteTag.js';
import { isActiveElement } from '../../core/test-helpers/isActiveElement.js';

/**
 * @typedef {import('@lion/ui/types/test-suites.js').SuiteElement} SuiteElement
 * Runs the `lion-form` behavioural suite, moved out of `test/lion-form.test.js` so a Subclasser can run
 * the same guarantees against its own element. Pass `tagString` to point it at your registered
 * tag; see docs/guides/principles/test-suites.md.
 * `tagString`, `klass` and the older role tag keys are deprecated: pass `classes` instead (Lion
 * itself uses `classes` everywhere).
 * @param {import('@lion/ui/types/test-suites.js').SuiteConfig<{'checkbox-group': SuiteElement; 'radio-group': SuiteElement; checkbox: SuiteElement; fieldset: SuiteElement; host: SuiteElement; listbox: SuiteElement; option: SuiteElement; radio: SuiteElement}, {checkboxGroupTagString?: any; checkboxTagString?: any; fieldsetTagString?: any; listboxTagString?: any; optionTagString?: any; radioGroupTagString?: any; radioTagString?: any}>} [customConfig]
 */
export function runFormSuite({
  classes: {
    host: hostEl = LionForm,
    'checkbox-group': roleCheckboxGroup = LionCheckboxGroup,
    'radio-group': roleRadioGroup = LionRadioGroup,
    fieldset: roleFieldset = LionFieldset,
    checkbox: roleCheckbox = LionCheckbox,
    listbox: roleListbox = LionListbox,
    option: roleOption = LionOption,
    radio: roleRadio = LionRadio,
  } = {},
  tagString: legacyTagString,
  checkboxGroupTagString: legacyCheckboxGroupTagString,
  radioGroupTagString: legacyRadioGroupTagString,
  fieldsetTagString: legacyFieldsetTagString,
  checkboxTagString: legacyCheckboxTagString,
  listboxTagString: legacyListboxTagString,
  optionTagString: legacyOptionTagString,
  radioTagString: legacyRadioTagString,
} = {}) {
  const tagNameCheckboxGroup = resolveSuiteTag(roleCheckboxGroup, legacyCheckboxGroupTagString);
  const tagNameRadioGroup = resolveSuiteTag(roleRadioGroup, legacyRadioGroupTagString);
  const tagNameFieldset = resolveSuiteTag(roleFieldset, legacyFieldsetTagString);
  const tagNameCheckbox = resolveSuiteTag(roleCheckbox, legacyCheckboxTagString);
  const tagNameListbox = resolveSuiteTag(roleListbox, legacyListboxTagString);
  const tagNameOption = resolveSuiteTag(roleOption, legacyOptionTagString);
  const tagNameRadio = resolveSuiteTag(roleRadio, legacyRadioTagString);
  const childTagString = defineCE(
    class extends LionField {
      get slots() {
        return {
          input: () => document.createElement('input'),
        };
      }
    },
  );
  const tags = {
    host: unsafeStatic(resolveSuiteTag(hostEl, legacyTagString)),
    'checkbox-group': unsafeStatic(tagNameCheckboxGroup),
    'radio-group': unsafeStatic(tagNameRadioGroup),
    fieldset: unsafeStatic(tagNameFieldset),
    checkbox: unsafeStatic(tagNameCheckbox),
    listbox: unsafeStatic(tagNameListbox),
    option: unsafeStatic(tagNameOption),
    radio: unsafeStatic(tagNameRadio),
    child: unsafeStatic(childTagString),
  };

  /**
   * @typedef {import('lit').TemplateResult} TemplateResult
   */
  const fixture = /** @type {(arg: TemplateResult) => Promise<LionForm>} */ (_fixture);

  describe('<lion-form>', () => {
    it('is an instance of LionFieldSet', async () => {
      const el = await fixture(html`
        <${tags.host}>
          <form></form>
        </${tags.host}>
      `);
      expect(el).to.be.instanceOf(LionFieldset);
    });

    it('relies on the native form for its accessible role', async () => {
      const el = await fixture(html`
        <${tags.host}>
          <form></form>
        </${tags.host}>
      `);
      expect(el.getAttribute('role')).to.be.null;
    });

    it('can be connected and disconnected without an inner <form>', async () => {
      const el = await fixture(html`<${tags.host}></${tags.host}>`);
      expect(el.isConnected).to.be.true;
      const parent = /** @type {HTMLElement} */ (el.parentElement);
      parent.removeChild(el);
      parent.appendChild(el);
      expect(el.isConnected).to.be.true;
    });

    it('throws a helpful error on submit() and reset() without an inner <form>', async () => {
      const el = await fixture(html`<${tags.host}></${tags.host}>`);
      const message =
        'No form node found. Did you put a <form> element inside your custom-form element?';
      expect(() => el.submit()).to.throw(message);
      expect(() => el.reset()).to.throw(message);
    });

    it('has a custom reset that gets triggered by native reset', async () => {
      const withDefaults = await fixture(html`
        <${tags.host}>
          <form>
            <${tags.child} name="firstName" .modelValue="${'Foo'}"></${tags.child}>
            <input type="reset" value="reset-button" />
          </form>
        </${tags.host}>
      `);
      const resetButton = /** @type {HTMLInputElement} */ (
        withDefaults.querySelector('input[type=reset]')
      );

      withDefaults.formElements.firstName.modelValue = 'updatedFoo';
      expect(withDefaults.modelValue).to.deep.equal({
        firstName: 'updatedFoo',
      });

      withDefaults.reset();
      expect(withDefaults.modelValue).to.deep.equal({
        firstName: 'Foo',
      });

      // use button
      withDefaults.formElements.firstName.modelValue = 'updatedFoo';
      expect(withDefaults.modelValue).to.deep.equal({
        firstName: 'updatedFoo',
      });

      resetButton.click();
      expect(withDefaults.modelValue).to.deep.equal({
        firstName: 'Foo',
      });
    });

    it('dispatches reset events', async () => {
      const el = await fixture(html`
        <${tags.host}>
          <form>
            <${tags.child} name="firstName" .modelValue="${'Foo'}"></${tags.child}>
          </form>
        </${tags.host}>
      `);

      setTimeout(() => el.reset());
      const resetEv = await oneEvent(el, 'reset');
      expect(resetEv).to.be.instanceOf(Event);
      expect(resetEv.type).to.equal('reset');
      expect(resetEv.target).to.equal(el);
      expect(resetEv.bubbles).to.be.true;
      expect(resetEv.composed).to.be.false;
    });

    it('works with the native submit event (triggered via a button)', async () => {
      const submitSpy = spy();
      const el = await fixture(html`
        <${tags.host} @submit=${submitSpy}>
          <form>
            <button type="submit">submit</button>
          </form>
        </${tags.host}>
      `);

      const button = /** @type {HTMLButtonElement} */ (el.querySelector('button'));
      button.click();
      expect(submitSpy.callCount).to.equal(1);
    });

    it('dispatches submit events', async () => {
      const el = await fixture(html`
        <${tags.host}>
          <form>
            <button type="submit">submit</button>
          </form>
        </${tags.host}>
      `);
      const button = /** @type {HTMLButtonElement} */ (el.querySelector('button'));
      setTimeout(() => button.click());
      const submitEv = await oneEvent(el, 'submit');
      expect(submitEv).to.be.instanceOf(Event);
      expect(submitEv.type).to.equal('submit');
      expect(submitEv.target).to.equal(el);
      expect(submitEv.bubbles).to.be.true;
      expect(submitEv.composed).to.be.false;
    });

    it('redispatches a submit event on the native form node when calling submit() imperatively', async () => {
      const nativeFormSubmitEventSpy = spy();
      const el = await fixture(html`
        <${tags.host}>
          <form @submit=${nativeFormSubmitEventSpy}>
            <button type="submit">submit</button>
          </form>
        </${tags.host}>
      `);
      const submitSpy = spy(el, 'submit');
      const submitGroupSpy = spy(el, 'submitGroup');
      el.submit();
      expect(submitSpy.calledOnce).to.be.true;
      expect(nativeFormSubmitEventSpy.calledOnce).to.be.true;
      expect(submitGroupSpy.calledOnce).to.be.true;
    });

    it('handles internal submit handler before dispatch', async () => {
      const el = await fixture(html`
        <${tags.host}>
          <form>
            <button type="submit">submit</button>
          </form>
        </${tags.host}>
      `);
      const button = /** @type {HTMLButtonElement} */ (el.querySelector('button'));
      const internalHandlerSpy = spy(el, 'submitGroup');
      const dispatchSpy = spy(el, 'dispatchEvent');
      await aTimeout(0);
      button.click();
      expect(internalHandlerSpy).to.be.calledBefore(dispatchSpy);
    });

    it('handles internal submit handler before dispatch', async () => {
      const el = await fixture(html`
        <${tags.host}>
          <form>
            <button type="submit">submit</button>
          </form>
        </${tags.host}>
      `);
      const button = /** @type {HTMLButtonElement} */ (el.querySelector('button'));
      const internalHandlerSpy = spy(el, 'submitGroup');
      const dispatchSpy = spy(el, 'dispatchEvent');
      button.click();
      expect(dispatchSpy.args[0][0].type).to.equal('submit');
      expect(internalHandlerSpy).to.be.calledBefore(dispatchSpy);
    });

    it('handles internal reset handler before dispatch', async () => {
      const el = await fixture(html`
        <${tags.host}>
          <form>
            <button type="reset">reset</button>
          </form>
        </${tags.host}>
      `);
      const button = /** @type {HTMLButtonElement} */ (el.querySelector('button'));
      const internalHandlerSpy = spy(el, 'resetGroup');
      const dispatchSpy = spy(el, 'dispatchEvent');
      button.click();
      expect(dispatchSpy.args[0][0].type).to.equal('reset');
      expect(internalHandlerSpy).to.be.calledBefore(dispatchSpy);
    });

    it('sets focus on submit to the first erroneous form element', async () => {
      const el = await fixture(html`
        <${tags.host}>
          <form>
            <${tags.child} name="firstName" .modelValue=${'Foo'} .validators=${[
              new Required(),
            ]}></${tags.child}>
            <${tags.child} name="lastName" .validators=${[new Required()]}></${tags.child}>
            <button type="submit">submit</button>
          </form>
        </${tags.host}>
      `);
      expect(el.getAttribute('aria-invalid')).to.equal('false');
      const button = /** @type {HTMLButtonElement} */ (el.querySelector('button'));
      const dispatchSpy = spy(el, 'dispatchEvent');
      button.click();
      expect(dispatchSpy.args.map(args => args[0].type)).to.contain('submit');
      // @ts-ignore [allow-protected] in test
      expect(isActiveElement(el.formElements[1]._inputNode)).to.be.true;
    });

    it('sets focus on submit to the first erroneous form element within a fieldset', async () => {
      const el = await fixture(html`
        <${tags.host}>
          <form>
            <${tags.fieldset} name="name">
              <${tags.child} name="firstName" .modelValue=${'Foo'} .validators=${[
                new Required(),
              ]}></${tags.child}>
              <${tags.child} name="lastName" .validators=${[new Required()]}></${tags.child}>
            </${tags.fieldset}>
            <button type="submit">submit</button>
          </form>
        </${tags.host}>
      `);
      const button = /** @type {HTMLButtonElement} */ (el.querySelector('button'));
      const dispatchSpy = spy(el, 'dispatchEvent');
      button.click();
      expect(dispatchSpy.args.map(args => args[0].type)).to.contain('submit');
      const fieldset = el.formElements[0];
      // @ts-ignore [allow-protected] in test
      expect(isActiveElement(fieldset.formElements[1]._inputNode)).to.be.true;
    });

    it('sets focus on submit to the first form element within a erroneous fieldset', async () => {
      const el = await fixture(html`
        <${tags.host}>
          <form>
            <${tags.fieldset} name="name" .validators=${[new Required()]}>
              <${tags.child} name="firstName"></${tags.child}>
              <${tags.child} name="lastName"></${tags.child}>
            </${tags.fieldset}>
            <button type="submit">submit</button>
          </form>
        </${tags.host}>
      `);
      const button = /** @type {HTMLButtonElement} */ (el.querySelector('button'));
      const dispatchSpy = spy(el, 'dispatchEvent');
      button.click();
      expect(dispatchSpy.args.map(args => args[0].type)).to.contain('submit');
      const fieldset = el.formElements[0];
      expect(isActiveElement(fieldset.formElements[0]._inputNode)).to.be.true;
    });

    it('sets focus on submit to the first form element within a erroneous fieldset within another fieldset', async () => {
      const el = await fixture(html`
        <${tags.host}>
          <form>
            <${tags.fieldset} name="parentFieldset">
              <${tags.fieldset} name="childFieldset" .validators="${[new Required()]}">
                <${tags.child} name="firstName"></${tags.child}>
              </${tags.fieldset}>
            </${tags.fieldset}>

            <button type="submit">submit</button>
          </form>
        </${tags.host}>
      `);
      const button = /** @type {HTMLButtonElement} */ (el.querySelector('button'));
      const parentFieldSetEl = el.formElements[0];
      const childFieldsetEl = parentFieldSetEl.formElements[0];
      const inputEl = childFieldsetEl.formElements[0];
      button.click();
      expect(isActiveElement(inputEl._focusableNode)).to.be.true;
    });

    it('sets focus on submit to the first form element within a erroneous listbox', async () => {
      const el = await fixture(html`
        <${tags.host}>
          <form>
            <${tags.listbox} name="name" .validators="${[new Required()]}">
              <${tags.option} value="a">a</${tags.option}>
              <${tags.option} value="b">b</${tags.option}>
            </${tags.listbox}>
            <button type="submit">submit</button>
          </form>
        </${tags.host}>
      `);
      const button = /** @type {HTMLButtonElement} */ (el.querySelector('button'));
      button.click();
      const listboxEl = el.formElements[0];
      expect(isActiveElement(listboxEl._inputNode)).to.be.true;
    });

    it('sets focus on submit to the first form element within a erroneous listbox within a fieldset', async () => {
      const el = await fixture(html`
        <${tags.host}>
          <form>
            <${tags.fieldset} name="fieldset">
              <${tags.listbox} name="name" .validators="${[new Required()]}">
                <${tags.option} value="a">a</${tags.option}>
                <${tags.option} value="b">b</${tags.option}>
              </${tags.listbox}>
            </${tags.fieldset}>
            <button type="submit">submit</button>
          </form>
        </${tags.host}>
      `);
      const button = /** @type {HTMLButtonElement} */ (el.querySelector('button'));
      button.click();
      const fieldsetEl = el.formElements[0];
      const listboxEl = fieldsetEl.formElements[0];
      expect(isActiveElement(listboxEl._inputNode)).to.be.true;
    });

    it('sets focus on submit to the first form element within a erroneous checkbox-group', async () => {
      const el = await fixture(html`
        <${tags.host}>
          <form>
            <${tags['checkbox-group']} name="name" .validators="${[new Required()]}">
              <${tags.checkbox} .choiceValue=${'a'} label="a"></${tags.checkbox}>
              <${tags.checkbox} .choiceValue=${'b'} label="b"></${tags.checkbox}>
            </${tags['checkbox-group']}>
            <button type="submit">submit</button>
          </form>
        </${tags.host}>
      `);
      const button = /** @type {HTMLButtonElement} */ (el.querySelector('button'));
      const checkboxGroupEl = el.formElements[0];
      const checkboxEl = checkboxGroupEl.formElements[0];
      button.click();
      expect(isActiveElement(checkboxEl._focusableNode)).to.be.true;
    });

    it('sets focus on submit to the first form element within a erroneous radio-group', async () => {
      const el = await fixture(html`
        <${tags.host}>
          <form>
              <${tags['radio-group']} name="name" .validators="${[new Required()]}">
                <${tags.radio} .choiceValue=${'a'} label="a"></${tags.radio}>
                <${tags.radio} .choiceValue=${'b'} label="b"></${tags.radio}>
              </${tags['radio-group']}>
            </${tags.fieldset}>

            <button type="submit">submit</button>
          </form>
        </${tags.host}>
      `);
      const button = /** @type {HTMLButtonElement} */ (el.querySelector('button'));

      const radioGroupEl = el.formElements[0];
      const radioEl = radioGroupEl.formElements[0];
      button.click();
      expect(isActiveElement(radioEl._focusableNode)).to.be.true;
    });
  });
}
