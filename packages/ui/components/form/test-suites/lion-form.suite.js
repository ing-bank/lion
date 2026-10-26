import { html } from 'lit/static-html.js';
import { LionField, Required } from '@lion/ui/form-core.js';
import '@lion/ui/define/lion-validation-feedback.js';
import { LionFieldset } from '@lion/ui/fieldset.js';
import '@lion/ui/define/lion-checkbox-group.js';
import '@lion/ui/define/lion-radio-group.js';
import '@lion/ui/define/lion-fieldset.js';
import '@lion/ui/define/lion-checkbox.js';
import '@lion/ui/define/lion-listbox.js';
import '@lion/ui/define/lion-option.js';
import '@lion/ui/define/lion-field.js';
import '@lion/ui/define/lion-radio.js';
import '@lion/ui/define/lion-form.js';
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
 * Runs the `lion-form` behavioural suite, moved out of `test/lion-form.test.js` so a Subclasser can run
 * the same guarantees against its own element. Pass `tagString` to point it at your registered
 * tag; see docs/guides/principles/test-suites.md.
 * `tagString`, `klass` and the older role tag keys are deprecated: pass `classes` instead (Lion
 * itself uses `classes` everywhere).
 * @param {{ classes?: Record<string, CustomElementConstructor>, checkboxGroupTagString?: string, checkboxTagString?: string, fieldsetTagString?: string, listboxTagString?: string, optionTagString?: string, radioGroupTagString?: string, radioTagString?: string, tagString?: string }} [customConfig]
 */
export function runFormSuite(customConfig = {}) {
  const cfg = {
    classes: /** @type {Record<string, CustomElementConstructor>} */ ({}),
    tagString: 'lion-form',
    ...customConfig,
  };
  cfg.tagString = resolveSuiteTag(cfg.classes.host, cfg.tagString, 'lion-form');
  const tag = unsafeStatic(cfg.tagString);
  const tagNameCheckboxGroup = resolveSuiteTag(
    cfg.classes['checkbox-group'],
    cfg.checkboxGroupTagString,
    'lion-checkbox-group',
  );
  const tagCheckboxGroup = unsafeStatic(tagNameCheckboxGroup);
  const tagNameRadioGroup = resolveSuiteTag(
    cfg.classes['radio-group'],
    cfg.radioGroupTagString,
    'lion-radio-group',
  );
  const tagRadioGroup = unsafeStatic(tagNameRadioGroup);
  const tagNameFieldset = resolveSuiteTag(
    cfg.classes.fieldset,
    cfg.fieldsetTagString,
    'lion-fieldset',
  );
  const tagFieldset = unsafeStatic(tagNameFieldset);
  const tagNameCheckbox = resolveSuiteTag(
    cfg.classes.checkbox,
    cfg.checkboxTagString,
    'lion-checkbox',
  );
  const tagCheckbox = unsafeStatic(tagNameCheckbox);
  const tagNameListbox = resolveSuiteTag(cfg.classes.listbox, cfg.listboxTagString, 'lion-listbox');
  const tagListbox = unsafeStatic(tagNameListbox);
  const tagNameOption = resolveSuiteTag(cfg.classes.option, cfg.optionTagString, 'lion-option');
  const tagOption = unsafeStatic(tagNameOption);
  const tagNameRadio = resolveSuiteTag(cfg.classes.radio, cfg.radioTagString, 'lion-radio');
  const tagRadio = unsafeStatic(tagNameRadio);

  /**
   * @typedef {import('../src/LionForm.js').LionForm} LionForm
   * @typedef {import('lit').TemplateResult} TemplateResult
   */
  const fixture = /** @type {(arg: TemplateResult) => Promise<LionForm>} */ (_fixture);

  const childTagString = defineCE(
    class extends LionField {
      get slots() {
        return {
          input: () => document.createElement('input'),
        };
      }
    },
  );
  const childTag = unsafeStatic(childTagString);

  describe('<lion-form>', () => {
    it('is an instance of LionFieldSet', async () => {
      const el = await fixture(html`
        <${tag}>
          <form></form>
        </${tag}>
      `);
      expect(el).to.be.instanceOf(LionFieldset);
    });

    it('relies on the native form for its accessible role', async () => {
      const el = await fixture(html`
        <${tag}>
          <form></form>
        </${tag}>
      `);
      expect(el.getAttribute('role')).to.be.null;
    });

    it('has a custom reset that gets triggered by native reset', async () => {
      const withDefaults = await fixture(html`
        <${tag}>
          <form>
            <${childTag} name="firstName" .modelValue="${'Foo'}"></${childTag}>
            <input type="reset" value="reset-button" />
          </form>
        </${tag}>
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
        <${tag}>
          <form>
            <${childTag} name="firstName" .modelValue="${'Foo'}"></${childTag}>
          </form>
        </${tag}>
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
        <${tag} @submit=${submitSpy}>
          <form>
            <button type="submit">submit</button>
          </form>
        </${tag}>
      `);

      const button = /** @type {HTMLButtonElement} */ (el.querySelector('button'));
      button.click();
      expect(submitSpy.callCount).to.equal(1);
    });

    it('dispatches submit events', async () => {
      const el = await fixture(html`
        <${tag}>
          <form>
            <button type="submit">submit</button>
          </form>
        </${tag}>
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
        <${tag}>
          <form @submit=${nativeFormSubmitEventSpy}>
            <button type="submit">submit</button>
          </form>
        </${tag}>
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
        <${tag}>
          <form>
            <button type="submit">submit</button>
          </form>
        </${tag}>
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
        <${tag}>
          <form>
            <button type="submit">submit</button>
          </form>
        </${tag}>
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
        <${tag}>
          <form>
            <button type="reset">reset</button>
          </form>
        </${tag}>
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
        <${tag}>
          <form>
            <${childTag} name="firstName" .modelValue=${'Foo'} .validators=${[
              new Required(),
            ]}></${childTag}>
            <${childTag} name="lastName" .validators=${[new Required()]}></${childTag}>
            <button type="submit">submit</button>
          </form>
        </${tag}>
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
        <${tag}>
          <form>
            <${tagFieldset} name="name">
              <${childTag} name="firstName" .modelValue=${'Foo'} .validators=${[
                new Required(),
              ]}></${childTag}>
              <${childTag} name="lastName" .validators=${[new Required()]}></${childTag}>
            </${tagFieldset}>
            <button type="submit">submit</button>
          </form>
        </${tag}>
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
        <${tag}>
          <form>
            <${tagFieldset} name="name" .validators=${[new Required()]}>
              <${childTag} name="firstName"></${childTag}>
              <${childTag} name="lastName"></${childTag}>
            </${tagFieldset}>
            <button type="submit">submit</button>
          </form>
        </${tag}>
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
        <${tag}>
          <form>
            <${tagFieldset} name="parentFieldset">
              <${tagFieldset} name="childFieldset" .validators="${[new Required()]}">
                <${childTag} name="firstName"></${childTag}>
              </${tagFieldset}>
            </${tagFieldset}>

            <button type="submit">submit</button>
          </form>
        </${tag}>
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
        <${tag}>
          <form>
            <${tagListbox} name="name" .validators="${[new Required()]}">
              <${tagOption} value="a">a</${tagOption}>
              <${tagOption} value="b">b</${tagOption}>
            </${tagListbox}>
            <button type="submit">submit</button>
          </form>
        </${tag}>
      `);
      const button = /** @type {HTMLButtonElement} */ (el.querySelector('button'));
      button.click();
      const listboxEl = el.formElements[0];
      expect(isActiveElement(listboxEl._inputNode)).to.be.true;
    });

    it('sets focus on submit to the first form element within a erroneous listbox within a fieldset', async () => {
      const el = await fixture(html`
        <${tag}>
          <form>
            <${tagFieldset} name="fieldset">
              <${tagListbox} name="name" .validators="${[new Required()]}">
                <${tagOption} value="a">a</${tagOption}>
                <${tagOption} value="b">b</${tagOption}>
              </${tagListbox}>
            </${tagFieldset}>
            <button type="submit">submit</button>
          </form>
        </${tag}>
      `);
      const button = /** @type {HTMLButtonElement} */ (el.querySelector('button'));
      button.click();
      const fieldsetEl = el.formElements[0];
      const listboxEl = fieldsetEl.formElements[0];
      expect(isActiveElement(listboxEl._inputNode)).to.be.true;
    });

    it('sets focus on submit to the first form element within a erroneous checkbox-group', async () => {
      const el = await fixture(html`
        <${tag}>
          <form>
            <${tagCheckboxGroup} name="name" .validators="${[new Required()]}">
              <${tagCheckbox} .choiceValue=${'a'} label="a"></${tagCheckbox}>
              <${tagCheckbox} .choiceValue=${'b'} label="b"></${tagCheckbox}>
            </${tagCheckboxGroup}>
            <button type="submit">submit</button>
          </form>
        </${tag}>
      `);
      const button = /** @type {HTMLButtonElement} */ (el.querySelector('button'));
      const checkboxGroupEl = el.formElements[0];
      const checkboxEl = checkboxGroupEl.formElements[0];
      button.click();
      expect(isActiveElement(checkboxEl._focusableNode)).to.be.true;
    });

    it('sets focus on submit to the first form element within a erroneous radio-group', async () => {
      const el = await fixture(html`
        <${tag}>
          <form>
              <${tagRadioGroup} name="name" .validators="${[new Required()]}">
                <${tagRadio} .choiceValue=${'a'} label="a"></${tagRadio}>
                <${tagRadio} .choiceValue=${'b'} label="b"></${tagRadio}>
              </${tagRadioGroup}>
            </${tagFieldset}>

            <button type="submit">submit</button>
          </form>
        </${tag}>
      `);
      const button = /** @type {HTMLButtonElement} */ (el.querySelector('button'));

      const radioGroupEl = el.formElements[0];
      const radioEl = radioGroupEl.formElements[0];
      button.click();
      expect(isActiveElement(radioEl._focusableNode)).to.be.true;
    });
  });
}
