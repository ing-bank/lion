import '@lion/core/differentKeyEventNamesShimIE';
import { repeat, LitElement } from '@lion/core';
import { Required } from '@lion/form-core';
import { LionOptions } from '@lion/listbox';
import '@lion/listbox/define';
import { expect, fixture as _fixture, defineCE } from '@open-wc/testing';
import { html, unsafeStatic } from 'lit/static-html.js';

import sinon from 'sinon';
import { getListboxMembers } from '../test-helpers/index.js';

/**
 * @typedef {import('../src/LionListbox').LionListbox} LionListbox
 * @typedef {import('../src/LionOption').LionOption} LionOption
 * @typedef {import('@lion/select-rich').LionSelectInvoker} LionSelectInvoker
 * @typedef {import('@lion/core').TemplateResult} TemplateResult
 */

const fixture = /** @type {(arg: TemplateResult) => Promise<LionListbox>} */ (_fixture);

/**
 * @param {HTMLElement} el
 * @param {string} key
 */
function mimicKeyPress(el, key) {
  el.dispatchEvent(new KeyboardEvent('keydown', { key }));
  el.dispatchEvent(new KeyboardEvent('keyup', { key }));
}

/**
 * @param { {tagString?:string, optionTagString?:string} } [customConfig]
 */
export function runListboxMixinSuite(customConfig = {}) {
  const cfg = {
    tagString: 'lion-listbox',
    optionTagString: 'lion-option',
    ...customConfig,
  };

  const tag = unsafeStatic(cfg.tagString);
  const optionTag = unsafeStatic(cfg.optionTagString);

  describe('ListboxMixin', () => {
    // TODO: See if it is possible to get functionality from ChoiceGroup and/or Field suite(s)
    describe('FormControl (Field / ChoiceGroup) functionality', () => {
      it('has a single modelValue representing the currently checked option', async () => {
        const el = await fixture(html`
        <${tag} name="foo">
          <${optionTag} .choiceValue=${'10'} checked>Item 1</${optionTag}>
          <${optionTag} .choiceValue=${'20'}>Item 2</${optionTag}>
        </${tag}>
      `);
        expect(el.modelValue).to.equal('10');
      });

      it('should dispatch model-value-changed 1 time on first paint', async () => {
        const spy = sinon.spy();
        await fixture(html`
          <${tag} @model-value-changed="${spy}">
            <${optionTag} .choiceValue="${'10'}">Item 1</${optionTag}>
            <${optionTag} .choiceValue="${'20'}">Item 2</${optionTag}>
            <${optionTag} .choiceValue="${'30'}">Item 3</${optionTag}>
          </${tag}>
        `);
        expect(spy.callCount).to.equal(1);
      });

      it('should dispatch model-value-changed 1 time on interaction', async () => {
        const spy = sinon.spy();
        const el = await fixture(html`
          <${tag}>
            <${optionTag} .choiceValue="${'10'}">Item 1</${optionTag}>
            <${optionTag} .choiceValue="${'20'}">Item 2</${optionTag}>
            <${optionTag} .choiceValue="${'30'}">Item 3</${optionTag}>
          </${tag}>
        `);

        el.addEventListener('model-value-changed', spy);
        el.formElements[1].checked = true;
        expect(spy.callCount).to.equal(1);

        spy.resetHistory();

        el.formElements[2].checked = true;
        expect(spy.callCount).to.equal(1);
      });

      it('should not dispatch model-value-changed on reappend checked child', async () => {
        const spy = sinon.spy();
        const el = await fixture(html`
          <${tag}>
            <${optionTag} .choiceValue="${'10'}">Item 1</${optionTag}>
            <${optionTag} .choiceValue="${'20'}">Item 2</${optionTag}>
            <${optionTag} .choiceValue="${'30'}">Item 3</${optionTag}>
          </${tag}>
        `);

        el.addEventListener('model-value-changed', spy);
        el.formElements[1].checked = true;
        expect(spy.callCount).to.equal(1);

        el.appendChild(el.formElements[1]);
        expect(spy.callCount).to.equal(1);
      });

      it('automatically sets the name attribute of child checkboxes to its own name', async () => {
        const el = await fixture(html`
        <${tag} name="foo">
          <${optionTag} .choiceValue=${10} checked>Item 1</${optionTag}>
          <${optionTag} .choiceValue=${20}>Item 2</${optionTag}>
        </${tag}>
      `);

        expect(el.formElements[0].name).to.equal('foo');
        expect(el.formElements[1].name).to.equal('foo');

        const validChild = await fixture(
          html` <${optionTag} .choiceValue=${30}>Item 3</${optionTag}> `,
        );
        el.appendChild(validChild);

        expect(el.formElements[2].name).to.equal('foo');
      });

      it('throws if a child element without a modelValue like { value: "foo", checked: false } tries to register', async () => {
        const el = await fixture(html`
        <${tag} name="foo">
          <${optionTag} .choiceValue=${10} checked>Item 1</${optionTag}>
          <${optionTag} .choiceValue=${20}>Item 2</${optionTag}>
        </${tag}>
      `);
        const invalidChild = await fixture(
          html` <${optionTag} .modelValue=${'Lara'}></${optionTag}> `,
        );

        expect(() => {
          el.addFormElement(invalidChild);
        }).to.throw(
          `The ${cfg.tagString} name="foo" does not allow to register lion-option with .modelValue="Lara" - The modelValue should represent an Object { value: "foo", checked: false }`,
        );
      });

      it('can set initial modelValue on creation', async () => {
        const el = await fixture(html`
        <${tag} name="gender" .modelValue=${'other'}>
          <${optionTag} .choiceValue=${'male'}></${optionTag}>
          <${optionTag} .choiceValue=${'female'}></${optionTag}>
          <${optionTag} .choiceValue=${'other'}></${optionTag}>
        </${tag}>
      `);

        expect(el.modelValue).to.equal('other');
        expect(el.formElements[2].checked).to.be.true;
      });

      it('requests update for modelValue when checkedIndex changes', async () => {
        const el = await fixture(html`
          <${tag} name="gender" .modelValue=${'other'}>
            <${optionTag} .choiceValue=${'male'}></${optionTag}>
            <${optionTag} .choiceValue=${'female'}></${optionTag}>
            <${optionTag} .choiceValue=${'other'}></${optionTag}>
          </${tag}>
        `);
        expect(el.checkedIndex).to.equal(2);
        const requestSpy = sinon.spy(el, 'requestUpdate');
        const updatedSpy = sinon.spy(el, 'updated');
        el.setCheckedIndex(1);
        await el.updateComplete;
        expect(requestSpy).to.have.been.calledWith('modelValue', 'other');
        expect(updatedSpy).to.have.been.calledWith(
          sinon.match.map.contains(new Map([['modelValue', 'other']])),
        );
      });

      it('requests update for modelValue after click', async () => {
        const el = await fixture(html`
          <${tag} name="gender" .modelValue=${'other'}>
            <${optionTag} .choiceValue=${'male'}></${optionTag}>
            <${optionTag} .choiceValue=${'female'}></${optionTag}>
            <${optionTag} .choiceValue=${'other'}></${optionTag}>
          </${tag}>
        `);
        expect(el.checkedIndex).to.equal(2);
        const requestSpy = sinon.spy(el, 'requestUpdate');
        const updatedSpy = sinon.spy(el, 'updated');
        el.formElements[0].click();
        await el.updateComplete;
        expect(requestSpy).to.have.been.calledWith('modelValue', 'other');
        expect(updatedSpy).to.have.been.calledWith(
          sinon.match.map.contains(new Map([['modelValue', 'other']])),
        );
      });

      it('requests update for modelValue when checkedIndex changes for multiple choice', async () => {
        const el = await fixture(html`
          <${tag} name="gender" multiple-choice .modelValue=${['other']}>
            <${optionTag} .choiceValue=${'male'}></${optionTag}>
            <${optionTag} .choiceValue=${'female'}></${optionTag}>
            <${optionTag} .choiceValue=${'other'}></${optionTag}>
          </${tag}>
        `);
        expect(el.checkedIndex).to.eql([2]);
        const requestSpy = sinon.spy(el, 'requestUpdate');
        const updatedSpy = sinon.spy(el, 'updated');
        el.setCheckedIndex(1);
        await el.updateComplete;
        expect(requestSpy).to.have.been.calledWith(
          'modelValue',
          sinon.match.array.deepEquals(['other']),
        );
        expect(updatedSpy).to.have.been.calledOnce;
        // reference values vs real values suck :( had to do it like this, sinon matchers did not match because 'other' is inside an array so it's not a "real" match
        expect([...updatedSpy.args[0][0].entries()]).to.deep.include(['modelValue', ['other']]);
      });

      it('requests update for modelValue after click for multiple choice', async () => {
        const el = await fixture(html`
          <${tag} name="gender" multiple-choice .modelValue=${['other']}>
            <${optionTag} .choiceValue=${'male'}></${optionTag}>
            <${optionTag} .choiceValue=${'female'}></${optionTag}>
            <${optionTag} .choiceValue=${'other'}></${optionTag}>
          </${tag}>
        `);
        expect(el.checkedIndex).to.eql([2]);
        const requestSpy = sinon.spy(el, 'requestUpdate');
        const updatedSpy = sinon.spy(el, 'updated');
        el.formElements[0].click();
        await el.updateComplete;
        expect(requestSpy).to.have.been.calledWith(
          'modelValue',
          sinon.match.array.deepEquals(['other']),
        );
        expect(updatedSpy).to.have.been.calledOnce;
        // reference values vs real values suck :( had to do it like this, sinon matchers did not match because 'other' is inside an array so it's not a "real" match
        expect([...updatedSpy.args[0][0].entries()]).to.deep.include(['modelValue', ['other']]);
      });

      it(`has a fieldName based on the label`, async () => {
        const el1 = await fixture(html`
        <${tag} label="foo"></${tag}>
      `);
        const { _labelNode: _labelNode1 } = getListboxMembers(el1);
        expect(el1.fieldName).to.equal(_labelNode1.textContent);

        const el2 = await fixture(html`
        <${tag}>
          <label slot="label">bar</label>
        </${tag}>
      `);
        const { _labelNode: _labelNode2 } = getListboxMembers(el2);
        expect(el2.fieldName).to.equal(_labelNode2.textContent);
      });

      it(`has a fieldName based on the name if no label exists`, async () => {
        const el = await fixture(html`
        <${tag} name="foo"></${tag}>
      `);
        expect(el.fieldName).to.equal(el.name);
      });

      it(`can override fieldName`, async () => {
        const el = await fixture(html`
        <${tag} label="foo" .fieldName="${'bar'}"></${tag}>
      `);
        // @ts-ignore [allow-protected] in test
        expect(el.__fieldName).to.equal(el.fieldName);
      });

      it('supports validation', async () => {
        const el = await fixture(html`
        <${tag}
          id="color"
          name="color"
          label="Favorite color"
          .validators="${[new Required()]}"
        >
          <${optionTag} .choiceValue=${null}>select a color</${optionTag}>
          <${optionTag} .choiceValue=${'red'}>Red</${optionTag}>
          <${optionTag} .choiceValue=${'hotpink'} disabled>Hotpink</${optionTag}>
          <${optionTag} .choiceValue=${'teal'}>Teal</${optionTag}>
        </${tag}>
      `);

        expect(el.hasFeedbackFor.includes('error')).to.be.true;
        expect(el.showsFeedbackFor.includes('error')).to.be.false;

        // test submitted prop explicitly, since we dont extend field, we add the prop manually
        el.submitted = true;
        await el.updateComplete;
        expect(el.showsFeedbackFor.includes('error')).to.be.true;

        el.formElements[1].checked = true;
        await el.updateComplete;
        expect(el.hasFeedbackFor.includes('error')).to.be.false;
        expect(el.showsFeedbackFor.includes('error')).to.be.false;

        el.formElements[0].checked = true;
        await el.updateComplete;
        expect(el.hasFeedbackFor.includes('error')).to.be.true;
        expect(el.showsFeedbackFor.includes('error')).to.be.true;
      });
    });

    describe('Selection', () => {
      it('supports changing the selection through serializedValue setter', async () => {
        const el = await fixture(html`
        <${tag} id="color" name="color" label="Favorite color" has-no-default-selected>
          <${optionTag} .choiceValue=${'red'}>Red</${optionTag}>
          <${optionTag} .choiceValue=${'hotpink'}>Hotpink</${optionTag}>
          <${optionTag} .choiceValue=${'teal'}>Teal</${optionTag}>
        </${tag}>
      `);

        expect(el.checkedIndex).to.equal(-1);
        expect(el.serializedValue).to.equal('');

        el.serializedValue = 'hotpink';

        expect(el.checkedIndex).to.equal(1);
        expect(el.serializedValue).to.equal('hotpink');
      });
    });

    describe('Accessibility', () => {
      // TODO: enable when native button is not a child anymore
      it.skip('[axe]: is accessible when opened', async () => {
        const el = await fixture(html`
          <${tag} label="age" opened>
            <${optionTag} .choiceValue=${10}>Item 1</${optionTag}>
            <${optionTag} .choiceValue=${20}>Item 2</${optionTag}>
          </${tag}>
        `);
        await el.updateComplete;
        await el.updateComplete; // need 2 awaits as overlay.show is an async function

        await expect(el).to.be.accessible();
      });

      // NB: regular listbox is always 'opened', but needed for combobox and select-rich
      // TODO: enable when native button is not a child anymore
      it.skip('[axe]: is accessible when closed', async () => {
        const el = await fixture(html`
                <${tag} label="age">
                  <${optionTag} .choiceValue=${10}>Item 1</${optionTag}>
                  <${optionTag} .choiceValue=${20}>Item 2</${optionTag}>
                </${tag}>
              `);
        await expect(el).to.be.accessible();
      });

      it('does not have a tabindex', async () => {
        const el = await fixture(html`<${tag}></${tag}>`);
        expect(el.hasAttribute('tabindex')).to.be.false;
      });

      it('creates unique ids for all children', async () => {
        const el = await fixture(html`
          <${tag}>
            <${optionTag} .choiceValue=${10}>Item 1</${optionTag}>
            <${optionTag} .choiceValue=${20} selected>Item 2</${optionTag}>
            <${optionTag} .choiceValue=${30} id="predefined">Item 3</${optionTag}>
          </${tag}>
        `);
        expect(el.querySelectorAll(cfg.optionTagString)[0].id).to.exist;
        expect(el.querySelectorAll(cfg.optionTagString)[1].id).to.exist;
        expect(el.querySelectorAll(cfg.optionTagString)[2].id).to.equal('predefined');
      });

      it('has a reference to the active option', async () => {
        const el = await fixture(html`
          <${tag} opened has-no-default-selected autocomplete="none" show-all-on-empty>
            <${optionTag} .choiceValue=${'10'} id="first">Item 1</${optionTag}>
            <${optionTag} .choiceValue=${'20'} checked id="second">Item 2</${optionTag}>
          </${tag}>
        `);
        const { _activeDescendantOwnerNode } = getListboxMembers(el);

        expect(_activeDescendantOwnerNode.getAttribute('aria-activedescendant')).to.be.null;
        await el.updateComplete;

        // Normalize
        el.activeIndex = 0;
        await el.updateComplete;
        expect(_activeDescendantOwnerNode.getAttribute('aria-activedescendant')).to.equal('first');
        mimicKeyPress(_activeDescendantOwnerNode, 'ArrowDown');
        // _activeDescendantOwnerNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
        await el.updateComplete;
        expect(_activeDescendantOwnerNode.getAttribute('aria-activedescendant')).to.equal('second');
      });

      it('puts "aria-setsize" on all options to indicate the total amount of options', async () => {
        const el = /** @type {LionListbox} */ (
          await fixture(html`
          <${tag} autocomplete="none" show-all-on-empty>
            <${optionTag} .choiceValue=${10}>Item 1</${optionTag}>
            <${optionTag} .choiceValue=${20}>Item 2</${optionTag}>
            <${optionTag} .choiceValue=${30}>Item 3</${optionTag}>
          </${tag}>
        `)
        );
        el.formElements.forEach(optionEl => {
          expect(optionEl.getAttribute('aria-setsize')).to.equal('3');
        });
      });

      it('puts "aria-posinset" on all options to indicate their position in the listbox', async () => {
        const el = await fixture(html`
          <${tag} autocomplete="none" show-all-on-empty>
            <${optionTag} .choiceValue=${10}>Item 1</${optionTag}>
            <${optionTag} .choiceValue=${20}>Item 2</${optionTag}>
            <${optionTag} .choiceValue=${30}>Item 3</${optionTag}>
          </${tag}>
        `);
        el.formElements.forEach((oEl, i) => {
          expect(oEl.getAttribute('aria-posinset')).to.equal(`${i + 1}`);
        });
      });
    });

    describe('Values', () => {
      // TODO: ChoiceGroup suite?
      it('registers options', async () => {
        const el = await fixture(html`
          <${tag}>
            <${optionTag} .choiceValue=${10}>Item 1</${optionTag}>
            <${optionTag} .choiceValue=${20}>Item 2</${optionTag}>
          </${tag}>
        `);
        expect(el.formElements.length).to.equal(2);
        expect(el.formElements).to.eql([
          el.querySelectorAll('lion-option')[0],
          el.querySelectorAll('lion-option')[1],
        ]);
      });

      it('allows null choiceValue', async () => {
        const el = await fixture(html`
          <${tag}>
            <${optionTag} checked .choiceValue=${null}>Please select value</${optionTag}>
            <${optionTag} .choiceValue=${20}>Item 2</${optionTag}>
          </${tag}>
        `);

        // @ts-ignore feature detect LionCombobox
        if (el._comboboxNode) {
          // note that the modelValue can only be supplied as string if we have a textbox
          // (parsers not supported atm)
          expect(el.modelValue).to.equal('');
          return;
        }
        expect(el.modelValue).to.be.null;
      });

      it('should reset selected value to initial value', async () => {
        const el = await fixture(html`
          <${tag}>
            <${optionTag} .choiceValue=${'10'}>Item 1</${optionTag}>
            <${optionTag} .choiceValue=${'20'} checked>Item 2</${optionTag}>
          </${tag}>
        `);
        expect(el.modelValue).to.equal('20');
        el.setCheckedIndex(0);
        expect(el.modelValue).to.equal('10');
        el.reset();
        expect(el.modelValue).to.equal('20');
      });

      it('should reset selected value to "Please select account" with has-no-default-selected attribute', async () => {
        const el = await fixture(html`
          <${tag} has-no-default-selected>
            <${optionTag} .choiceValue=${'10'}>Item 1</${optionTag}>
            <${optionTag} .choiceValue=${'20'}>Item 2</${optionTag}>
          </${tag}>
        `);
        el.setCheckedIndex(1);
        expect(el.modelValue).to.equal('20');
        el.reset();
        expect(el.modelValue).to.equal('');
      });

      it('should reset selected value to initial values when multiple-choice', async () => {
        const el = await fixture(html`
          <${tag} multiple-choice has-no-default-selected>
            <${optionTag} .choiceValue=${'10'}>Item 1</${optionTag}>
            <${optionTag} .choiceValue=${'20'} checked>Item 2</${optionTag}>
            <${optionTag} .choiceValue=${'30'} checked>Item 3</${optionTag}>
          </${tag}>
        `);
        el.setCheckedIndex(0);
        expect(el.modelValue).to.deep.equal(['10', '20', '30']);
        el.reset();
        expect(el.modelValue).to.deep.equal(['20', '30']);
      });

      it('has an activeIndex', async () => {
        const el = await fixture(html`
          <${tag} has-no-default-selected autocomplete="list">
            <${optionTag} .choiceValue=${10}>Item 1</${optionTag}>
            <${optionTag} .choiceValue=${20}>Item 2</${optionTag}>
          </${tag}>
        `);
        const options = el.formElements;

        expect(el.activeIndex).to.equal(-1);
        options[1].active = true;
        expect(options[0].active).to.be.false;
        expect(el.activeIndex).to.equal(1);
      });

      it('should reset activeIndex value', async () => {
        const el = await fixture(html`
          <${tag} has-no-default-selected>
            <${optionTag} .choiceValue=${'10'}>Item 1</${optionTag}>
            <${optionTag} .choiceValue=${'20'}>Item 2</${optionTag}>
          </${tag}>
        `);
        const options = el.formElements;

        expect(el.activeIndex).to.equal(-1);
        options[1].active = true;
        expect(el.activeIndex).to.equal(1);
        el.reset();
        expect(el.activeIndex).to.equal(-1);
      });
    });

    describe('Interactions', () => {
      describe('Keyboard navigation', () => {
        describe('Rotate Keyboard Navigation', () => {
          it('stops navigation by default at end of option list', async () => {
            const el = /** @type {LionListbox} */ (
              await fixture(html`
                <${tag} opened name="foo" .rotateKeyboardNavigation="${false}">
                  <${optionTag} .choiceValue="${'Artichoke'}">Artichoke</${optionTag}>
                  <${optionTag} .choiceValue="${'Bla'}">Bla</${optionTag}>
                  <${optionTag} .choiceValue="${'Chard'}">Chard</${optionTag}>
                </${tag}>
              `)
            );
            const { _listboxNode } = getListboxMembers(el);

            // Normalize
            el.activeIndex = 0;
            const options = el.formElements;
            // mimicKeyPress(listbox, 'ArrowUp');

            mimicKeyPress(_listboxNode, 'ArrowUp');

            expect(options[0].active).to.be.true;
            expect(options[1].active).to.be.false;
            expect(options[2].active).to.be.false;
            el.activeIndex = 2;
            // mimicKeyPress(listbox, 'ArrowDown');
            mimicKeyPress(_listboxNode, 'ArrowDown');

            expect(options[0].active).to.be.false;
            expect(options[1].active).to.be.false;
            expect(options[2].active).to.be.true;
          });

          it('when "rotate-navigation" provided, selects first option after navigated to next from last and vice versa', async () => {
            const el = /** @type {LionListbox} */ (
              await fixture(html`
                <${tag} opened name="foo" rotate-keyboard-navigation autocomplete="inline">
                  <${optionTag} checked .choiceValue="${'Artichoke'}">Artichoke</${optionTag}>
                  <${optionTag} .choiceValue="${'Bla'}">Bla</${optionTag}>
                  <${optionTag} .choiceValue="${'Chard'}">Chard</${optionTag}>
                </${tag}>
              `)
            );
            const { _inputNode } = getListboxMembers(el);

            _inputNode.dispatchEvent(new Event('focusin', { bubbles: true, composed: true }));
            await el.updateComplete;
            // Normalize
            el.activeIndex = 0;
            expect(el.activeIndex).to.equal(0);

            // el._inputNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
            mimicKeyPress(_inputNode, 'ArrowUp');

            await el.updateComplete;
            expect(el.activeIndex).to.equal(2);

            // el._inputNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
            mimicKeyPress(_inputNode, 'ArrowDown');

            expect(el.activeIndex).to.equal(0);
            // Extra check: regular navigation
            // el._inputNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
            mimicKeyPress(_inputNode, 'ArrowDown');

            expect(el.activeIndex).to.equal(1);
          });
        });

        describe('Enter', () => {
          it('[Enter] selects active option', async () => {
            const el = /** @type {LionListbox} */ (
              await fixture(html`
              <${tag} opened name="foo" autocomplete="none" show-all-on-empty>
                <${optionTag} .choiceValue="${'Artichoke'}">Artichoke</${optionTag}>
                <${optionTag} .choiceValue="${'Bla'}">Bla</${optionTag}>
                <${optionTag} .choiceValue="${'Chard'}">Chard</${optionTag}>
              </${tag}>
            `)
            );
            const { _listboxNode } = getListboxMembers(el);

            // Normalize suite
            el.activeIndex = 0;
            const options = el.formElements;
            el.checkedIndex = 0;
            mimicKeyPress(_listboxNode, 'ArrowDown');
            mimicKeyPress(_listboxNode, 'Enter');
            expect(options[1].checked).to.be.true;
          });
        });

        describe('Space', () => {
          it('selects active option when "_listboxReceivesNoFocus" is true', async () => {
            // When listbox is not focusable (in case of a combobox), the user should be allowed
            // to enter a space in the focusable element (texbox)
            const el = /** @type {LionListbox} */ (
              await fixture(html`
                <${tag} opened name="foo" ._listboxReceivesNoFocus="${false}" autocomplete="none" show-all-on-empty>
                  <${optionTag} .choiceValue="${'Artichoke'}">Artichoke</${optionTag}>
                  <${optionTag} .choiceValue="${'Bla'}">Bla</${optionTag}>
                  <${optionTag} .choiceValue="${'Chard'}">Chard</${optionTag}>
                </${tag}>
              `)
            );
            const { _listboxNode } = getListboxMembers(el);

            // Normalize suite
            el.activeIndex = 0;
            const options = el.formElements;
            el.checkedIndex = 0;
            mimicKeyPress(_listboxNode, 'ArrowDown');
            mimicKeyPress(_listboxNode, 'Enter');

            expect(options[1].checked).to.be.true;
            el.checkedIndex = 0;
            // @ts-ignore allow protected member access in test
            el._listboxReceivesNoFocus = true;
            mimicKeyPress(_listboxNode, 'ArrowDown');
            mimicKeyPress(_listboxNode, 'Enter');

            expect(options[1].checked).to.be.false;
          });
        });
        // TODO: add key combinations like shift+home/ctrl+A etc etc.
        // TODO: nice to have. Get from menu impl.
        it.skip('selects a value with single [character] key', async () => {
          const el = await fixture(html`
              <${tag} opened>
                <${optionTag} .choiceValue=${'a'}>A</${optionTag}>
                <${optionTag} .choiceValue=${'b'}>B</${optionTag}>
                <${optionTag} .choiceValue=${'c'}>C</${optionTag}>
              </${tag}>
            `);
          expect(el.modelValue).to.equal('a');
          el.dispatchEvent(new KeyboardEvent('keydown', { key: 'C' }));
          expect(el.modelValue).to.equal('c');
        });
        it.skip('selects a value with multiple [character] keys', async () => {
          const el = await fixture(html`
              <${tag} opened>
                <${optionTag} .choiceValue=${'bar'}>Bar</${optionTag}>
                <${optionTag} .choiceValue=${'far'}>Far</${optionTag}>
                <${optionTag} .choiceValue=${'foo'}>Foo</${optionTag}>
              </${tag}>
            `);
          el.dispatchEvent(new KeyboardEvent('keydown', { key: 'F' }));
          expect(el.modelValue).to.equal('far');
          el.dispatchEvent(new KeyboardEvent('keydown', { key: 'O' }));
          expect(el.modelValue).to.equal('foo');
        });
        it('navigates to first and last option with [Home] and [End] keys', async () => {
          const el = await fixture(html`
              <${tag} opened>
                <${optionTag} .choiceValue=${'10'}>Item 1</${optionTag}>
                <${optionTag} .choiceValue=${'20'}>Item 2</${optionTag}>
                <${optionTag} .choiceValue=${'30'} checked>Item 3</${optionTag}>
                <${optionTag} .choiceValue=${'40'}>Item 4</${optionTag}>
              </${tag}>
            `);
          const { _listboxNode } = getListboxMembers(el);

          // @ts-ignore allow protected members in tests
          if (el._listboxReceivesNoFocus) {
            return;
          }

          el.activeIndex = 2;
          mimicKeyPress(_listboxNode, 'Home');
          expect(el.activeIndex).to.equal(0);
          mimicKeyPress(_listboxNode, 'End');
          expect(el.activeIndex).to.equal(3);
        });
        it('navigates through open lists with [ArrowDown] [ArrowUp] keys activates the option', async () => {
          const el = /** @type {LionListbox} */ (
            await fixture(html`
              <${tag} opened has-no-default-selected autocomplete="none" show-all-on-empty>
                <${optionTag} .choiceValue=${'Item 1'}>Item 1</${optionTag}>
                <${optionTag} .choiceValue=${'Item 2'}>Item 2</${optionTag}>
                <${optionTag} .choiceValue=${'Item 3'}>Item 3</${optionTag}>
              </${tag}>
            `)
          );
          const { _listboxNode } = getListboxMembers(el);

          // Normalize across listbox/select-rich/combobox
          el.activeIndex = 0;
          // selectionFollowsFocus will be true by default on combobox (running this suite),
          // but should still be able to work with selectionFollowsFocus=false
          el.selectionFollowsFocus = false;
          expect(el.activeIndex).to.equal(0);
          expect(el.checkedIndex).to.equal(-1);
          mimicKeyPress(_listboxNode, 'ArrowDown');
          expect(el.activeIndex).to.equal(1);
          expect(el.checkedIndex).to.equal(-1);
          mimicKeyPress(_listboxNode, 'ArrowUp');

          expect(el.activeIndex).to.equal(0);
          expect(el.checkedIndex).to.equal(-1);
        });
      });

      describe('Orientation', () => {
        it('has a default value of "vertical"', async () => {
          const el = /** @type {LionListbox} */ (
            await fixture(html`
            <${tag} opened name="foo" autocomplete="none" show-all-on-empty>
              <${optionTag} .choiceValue="${'Artichoke'}">Artichoke</${optionTag}>
              <${optionTag} .choiceValue="${'Chard'}">Chard</${optionTag}>
            </${tag}>
          `)
          );
          const { _listboxNode } = getListboxMembers(el);

          expect(el.orientation).to.equal('vertical');
          const options = el.formElements;
          // Normalize for suite tests
          el.activeIndex = 0;

          await el.updateComplete;
          expect(options[0].active).to.be.true;
          expect(options[1].active).to.be.false;

          mimicKeyPress(_listboxNode, 'ArrowDown');
          expect(options[0].active).to.be.false;
          expect(options[1].active).to.be.true;

          mimicKeyPress(_listboxNode, 'ArrowUp');

          expect(options[0].active).to.be.true;
          expect(options[1].active).to.be.false;

          // No response to horizontal arrows...
          mimicKeyPress(_listboxNode, 'ArrowRight');

          expect(options[0].active).to.be.true;
          expect(options[1].active).to.be.false;

          el.activeIndex = 1;
          mimicKeyPress(_listboxNode, 'ArrowLeft');

          expect(options[0].active).to.be.false;
          expect(options[1].active).to.be.true;
        });

        it('uses [ArrowLeft] and [ArrowRight] keys when "horizontal"', async () => {
          const el = /** @type {LionListbox} */ (
            await fixture(html`
            <${tag} opened name="foo" orientation="horizontal" autocomplete="none" show-all-on-empty>
              <${optionTag} .choiceValue="${'Artichoke'}">Artichoke</${optionTag}>
              <${optionTag} .choiceValue="${'Chard'}">Chard</${optionTag}>
            </${tag}>
          `)
          );
          const { _listboxNode } = getListboxMembers(el);

          expect(el.orientation).to.equal('horizontal');

          // Normalize for suite tests
          el.activeIndex = 0;

          await el.updateComplete;

          mimicKeyPress(_listboxNode, 'ArrowRight');

          expect(el.activeIndex).to.equal(1);

          mimicKeyPress(_listboxNode, 'ArrowLeft');

          expect(el.activeIndex).to.equal(0);

          // No response to vertical arrows...
          mimicKeyPress(_listboxNode, 'ArrowDown');
          expect(el.activeIndex).to.equal(0);

          el.activeIndex = 1;
          mimicKeyPress(_listboxNode, 'ArrowUp');

          expect(el.activeIndex).to.equal(1);
        });

        describe('Accessibility', () => {
          it('adds aria-orientation attribute to listbox node', async () => {
            const el = await fixture(html`
              <${tag} name="foo" orientation="horizontal">
                <${optionTag} checked .choiceValue="${'Artichoke'}">Artichoke</${optionTag}>
                <${optionTag} .choiceValue="${'Chard'}">Chard</${optionTag}>
              </${tag}>
            `);
            const { _listboxNode } = getListboxMembers(el);
            expect(_listboxNode.getAttribute('aria-orientation')).to.equal('horizontal');
          });
        });
      });

      describe('Multiple Choice', () => {
        it('does not uncheck siblings', async () => {
          const el = await fixture(html`
            <${tag} name="foo" multiple-choice>
              <${optionTag} .choiceValue="${'Artichoke'}">Artichoke</${optionTag}>
              <${optionTag} .choiceValue="${'Chard'}">Chard</${optionTag}>
              <${optionTag} .choiceValue="${'Chicory'}">Chicory</${optionTag}>
              <${optionTag} .choiceValue="${'Victoria Plum'}">Victoria Plum</${optionTag}>
            </${tag}>
          `);
          const options = el.formElements;
          options[0].checked = true;
          options[1].checked = true;
          expect(options[0].checked).to.equal(true);
          expect(el.modelValue).to.eql(['Artichoke', 'Chard']);
        });

        it('works via different interaction mechanisms (click, enter, spaces)', async () => {
          const el = await fixture(html`
            <${tag} name="foo" multiple-choice>
              <${optionTag} .choiceValue="${'Artichoke'}">Artichoke</${optionTag}>
              <${optionTag} .choiceValue="${'Chard'}">Chard</${optionTag}>
              <${optionTag} .choiceValue="${'Chicory'}">Chicory</${optionTag}>
              <${optionTag} .choiceValue="${'Victoria Plum'}">Victoria Plum</${optionTag}>
            </${tag}>
          `);
          const { _listboxNode } = getListboxMembers(el);
          const options = el.formElements;

          // @ts-ignore feature detection select-rich
          if (el.navigateWithinInvoker !== undefined) {
            // Note we don't have multipleChoice in the select-rich yet.
            // TODO: implement in future when requested
            return;
          }

          // click
          options[0].click();
          options[1].click();
          expect(options[0].checked).to.equal(true);
          expect(el.modelValue).to.eql(['Artichoke', 'Chard']);
          // also deselect
          options[1].click();
          expect(options[0].checked).to.equal(true);
          expect(el.modelValue).to.eql(['Artichoke']);

          // Reset
          // @ts-ignore allow protected members in tests
          el._uncheckChildren();

          // Enter
          el.activeIndex = 0;
          mimicKeyPress(_listboxNode, 'Enter');
          el.activeIndex = 1;
          mimicKeyPress(_listboxNode, 'Enter');
          expect(options[0].checked).to.equal(true);
          expect(el.modelValue).to.eql(['Artichoke', 'Chard']);
          // also deselect
          mimicKeyPress(_listboxNode, 'Enter');
          expect(options[0].checked).to.equal(true);
          expect(el.modelValue).to.eql(['Artichoke']);

          // @ts-ignore allow protected
          if (el._listboxReceivesNoFocus) {
            return; // if suite is run for combobox, we don't respond to [Space]
          }

          // Reset
          // @ts-ignore allow protected members in tests
          el._uncheckChildren();

          // Space
          // @ts-ignore allow protected members in tests
          el._spaceShouldSelect = true;
          el.activeIndex = 0;
          mimicKeyPress(_listboxNode, ' ');

          el.activeIndex = 1;
          mimicKeyPress(_listboxNode, ' ');

          expect(options[0].checked).to.equal(true);
          expect(el.modelValue).to.eql(['Artichoke', 'Chard']);
          // also deselect
          mimicKeyPress(_listboxNode, ' ');

          expect(options[0].checked).to.equal(true);
          expect(el.modelValue).to.eql(['Artichoke']);
        });

        it('by default, does not select on space key', async () => {
          const el = await fixture(html`
            <${tag} name="foo" multiple-choice>
              <${optionTag} .choiceValue="${'Artichoke'}">Artichoke</${optionTag}>
              <${optionTag} .choiceValue="${'Chard'}">Chard</${optionTag}>
              <${optionTag} .choiceValue="${'Chicory'}">Chicory</${optionTag}>
              <${optionTag} .choiceValue="${'Victoria Plum'}">Victoria Plum</${optionTag}>
            </${tag}>
          `);
          const { _listboxNode } = getListboxMembers(el);
          const options = el.formElements;

          // @ts-ignore feature detection select-rich || combobox
          if (el.navigateWithinInvoker !== undefined || el._listboxReceivesNoFocus) {
            // Note we don't have multipleChoice in the select-rich yet.
            // TODO: implement in future when requested
            // if suite is run for combobox, we don't respond to [Space]
            return;
          }

          el.activeIndex = 0;
          mimicKeyPress(_listboxNode, ' ');
          expect(options[0].checked).to.equal(false);
          expect(el.modelValue).to.eql([]);

          // @ts-ignore allow protected members in tests
          el._spaceShouldSelect = true;
          el.activeIndex = 0;
          mimicKeyPress(_listboxNode, ' ');

          expect(options[0].checked).to.equal(true);
          expect(el.modelValue).to.eql(['Artichoke']);
        });

        describe('Accessibility', () => {
          it('adds aria-multiselectable="true" to listbox node', async () => {
            const el = await fixture(html`
              <${tag} name="foo" multiple-choice>
                <${optionTag} .choiceValue="${'Artichoke'}">Artichoke</${optionTag}>
                <${optionTag} .choiceValue="${'Chard'}">Chard</${optionTag}>
              </${tag}>
            `);
            const { _listboxNode } = getListboxMembers(el);
            expect(_listboxNode.getAttribute('aria-multiselectable')).to.equal('true');
          });

          it('does not allow "selectionFollowsFocus"', async () => {
            const el = await fixture(html`
              <${tag} name="foo" multiple-choice>
                <${optionTag} checked .choiceValue="${'Artichoke'}">Artichoke</${optionTag}>
                <${optionTag} .choiceValue="${'Chard'}">Chard</${optionTag}>
              </${tag}>
            `);
            const { _listboxNode, _inputNode } = getListboxMembers(el);

            _inputNode.focus();
            _listboxNode.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowDown' }));
            expect(_listboxNode.getAttribute('aria-multiselectable')).to.equal('true');
          });
        });
      });

      describe('Selection Follows Focus', () => {
        it('navigates through list with [ArrowDown] [ArrowUp] keys: activates and checks the option', async () => {
          /**
           * @param {LionOption[]} options
           * @param {number} selectedIndex
           */
          function expectOnlyGivenOneOptionToBeChecked(options, selectedIndex) {
            options.forEach((option, i) => {
              if (i === selectedIndex) {
                expect(option.checked).to.be.true;
              } else {
                expect(option.checked).to.be.false;
              }
            });
          }
          const el = /** @type {LionListbox} */ (
            await fixture(html`
              <${tag} opened selection-follows-focus autocomplete="none" show-all-on-empty>
                  <${optionTag} .choiceValue=${10}>Item 1</${optionTag}>
                  <${optionTag} .choiceValue=${20}>Item 2</${optionTag}>
                  <${optionTag} .choiceValue=${30}>Item 3</${optionTag}>
              </${tag}>
            `)
          );

          const { _listboxNode } = getListboxMembers(el);
          const options = el.formElements;
          // Normalize start values between listbox, slect and combobox and test interaction below
          el.activeIndex = 0;
          el.checkedIndex = 0;
          expect(el.activeIndex).to.equal(0);
          expect(el.checkedIndex).to.equal(0);
          expectOnlyGivenOneOptionToBeChecked(options, 0);
          mimicKeyPress(_listboxNode, 'ArrowDown');
          expect(el.activeIndex).to.equal(1);
          expect(el.checkedIndex).to.equal(1);
          expectOnlyGivenOneOptionToBeChecked(options, 1);
          mimicKeyPress(_listboxNode, 'ArrowUp');

          expect(el.activeIndex).to.equal(0);
          expect(el.checkedIndex).to.equal(0);
          expectOnlyGivenOneOptionToBeChecked(options, 0);
        });
        it('navigates through list with [ArrowLeft] [ArrowRight] keys when horizontal: activates and checks the option', async () => {
          /**
           * @param {LionOption[]} options
           * @param {number} selectedIndex
           */
          function expectOnlyGivenOneOptionToBeChecked(options, selectedIndex) {
            options.forEach((option, i) => {
              if (i === selectedIndex) {
                expect(option.checked).to.be.true;
              } else {
                expect(option.checked).to.be.false;
              }
            });
          }
          const el = /** @type {LionListbox} */ (
            await fixture(html`
              <${tag} opened selection-follows-focus orientation="horizontal" autocomplete="none" show-all-on-empty>
                  <${optionTag} .choiceValue=${10}>Item 1</${optionTag}>
                  <${optionTag} .choiceValue=${20}>Item 2</${optionTag}>
                  <${optionTag} .choiceValue=${30}>Item 3</${optionTag}>
              </${tag}>
            `)
          );

          const { _listboxNode } = getListboxMembers(el);
          const options = el.formElements;
          // Normalize start values between listbox, slect and combobox and test interaction below
          el.activeIndex = 0;
          el.checkedIndex = 0;
          expect(el.activeIndex).to.equal(0);
          expect(el.checkedIndex).to.equal(0);
          expectOnlyGivenOneOptionToBeChecked(options, 0);
          mimicKeyPress(_listboxNode, 'ArrowRight');

          expect(el.activeIndex).to.equal(1);
          expect(el.checkedIndex).to.equal(1);
          expectOnlyGivenOneOptionToBeChecked(options, 1);
          mimicKeyPress(_listboxNode, 'ArrowLeft');

          expect(el.activeIndex).to.equal(0);
          expect(el.checkedIndex).to.equal(0);
          expectOnlyGivenOneOptionToBeChecked(options, 0);
        });
        it('checks first and last option with [Home] and [End] keys', async () => {
          const el = await fixture(html`
              <${tag} opened selection-follows-focus>
                <${optionTag} .choiceValue=${'10'}>Item 1</${optionTag}>
                <${optionTag} .choiceValue=${'20'}>Item 2</${optionTag}>
                <${optionTag} .choiceValue=${'30'} checked>Item 3</${optionTag}>
                <${optionTag} .choiceValue=${'40'}>Item 4</${optionTag}>
              </${tag}>
            `);
          const { _listboxNode } = getListboxMembers(el);

          // @ts-ignore allow protected
          if (el._listboxReceivesNoFocus) {
            return;
          }

          expect(el.modelValue).to.equal('30');
          mimicKeyPress(_listboxNode, 'Home');
          expect(el.modelValue).to.equal('10');
          mimicKeyPress(_listboxNode, 'End');
          expect(el.modelValue).to.equal('40');
        });
      });

      describe('Disabled Host', () => {
        it('cannot be navigated with keyboard if disabled', async () => {
          const el = await fixture(html`
            <${tag} disabled>
              <${optionTag} .choiceValue=${'10'}>Item 1</${optionTag}>
              <${optionTag} checked .choiceValue=${'20'}>Item 2</${optionTag}>
            </${tag}>
          `);
          const { _listboxNode } = getListboxMembers(el);

          await el.updateComplete;
          const { checkedIndex } = el;
          mimicKeyPress(_listboxNode, 'ArrowDown');
          expect(el.checkedIndex).to.equal(checkedIndex);
        });

        it('sync its disabled state to all options', async () => {
          const el = await fixture(html`
            <${tag} opened>
              <${optionTag} .choiceValue=${10} disabled>Item 1</${optionTag}>
              <${optionTag} .choiceValue=${20}>Item 2</${optionTag}>
            </${tag}>
          `);
          const options = el.formElements;
          el.disabled = true;
          await el.updateComplete;
          expect(options[0].disabled).to.be.true;
          expect(options[1].disabled).to.be.true;

          el.disabled = false;
          await el.updateComplete;
          expect(options[0].disabled).to.be.true;
          expect(options[1].disabled).to.be.false;
        });

        it('can be enabled (incl. its options) even if it starts as disabled', async () => {
          const el = await fixture(html`
            <${tag} disabled>
              <${optionTag} .choiceValue=${10} disabled>Item 1</${optionTag}>
              <${optionTag} .choiceValue=${20}>Item 2</${optionTag}>
            </${tag}>
          `);
          const options = el.formElements;
          expect(options[0].disabled).to.be.true;
          expect(options[1].disabled).to.be.true;

          el.disabled = false;
          await el.updateComplete;
          expect(options[0].disabled).to.be.true;
          expect(options[1].disabled).to.be.false;
        });
      });

      describe('Disabled Options', () => {
        it('does not skip disabled options but prevents checking them', async () => {
          const el = await fixture(html`
            <${tag} opened autocomplete="inline" .selectionFollowsFocus="${false}">
              <${optionTag} .choiceValue=${'Item 1'} checked>Item 1</${optionTag}>
              <${optionTag} .choiceValue=${'Item 2'} disabled>Item 2</${optionTag}>
              <${optionTag} .choiceValue=${'Item 3'}>Item 3</${optionTag}>
            </${tag}>
          `);

          const { _listboxNode } = getListboxMembers(el);

          // Normalize activeIndex across multiple implementers of ListboxMixinSuite
          el.activeIndex = 0;

          mimicKeyPress(_listboxNode, 'ArrowDown');
          expect(el.activeIndex).to.equal(1);

          expect(el.checkedIndex).to.equal(0);
          mimicKeyPress(_listboxNode, 'Enter');
          // Checked index stays where it was
          expect(el.checkedIndex).to.equal(0);
        });
        it('does not check disabled options when selection-follow-focus is enabled', async () => {
          const el = await fixture(html`
            <${tag} opened autocomplete="inline" .selectionFollowsFocus="${true}">
              <${optionTag} .choiceValue=${'Item 1'} checked>Item 1</${optionTag}>
              <${optionTag} .choiceValue=${'Item 2'} disabled>Item 2</${optionTag}>
              <${optionTag} .choiceValue=${'Item 3'}>Item 3</${optionTag}>
            </${tag}>
          `);

          const { _listboxNode } = getListboxMembers(el);

          // Normalize activeIndex across multiple implementers of ListboxMixinSuite
          el.activeIndex = 0;

          mimicKeyPress(_listboxNode, 'ArrowDown');
          expect(el.activeIndex).to.equal(1);
          expect(el.checkedIndex).to.equal(-1);

          mimicKeyPress(_listboxNode, 'ArrowDown');
          expect(el.activeIndex).to.equal(2);
          expect(el.checkedIndex).to.equal(2);
        });
      });

      describe('Programmatic interaction', () => {
        it('can set active state', async () => {
          const el = await fixture(html`
            <${tag}>
              <${optionTag} .choiceValue=${10}>Item 1</${optionTag}>
              <${optionTag} .choiceValue=${20} id="myId">Item 2</${optionTag}>
            </${tag}>
          `);
          const { _activeDescendantOwnerNode } = getListboxMembers(el);

          const opt = el.formElements[1];
          opt.active = true;
          expect(_activeDescendantOwnerNode.getAttribute('aria-activedescendant')).to.equal('myId');
        });

        it('can set checked state', async () => {
          const el = await fixture(html`
            <${tag}>
              <${optionTag} .choiceValue=${10}>Item 1</${optionTag}>
              <${optionTag} .choiceValue=${20}>Item 2</${optionTag}>
            </${tag}>
          `);
          const option = el.formElements[1];
          option.checked = true;
          expect(el.modelValue).to.equal(20);
        });

        it('does not allow to set checkedIndex or activeIndex to be out of bound', async () => {
          const el = await fixture(html`
            <${tag} has-no-default-selected autocomplete="list">
              <${optionTag} .choiceValue=${10}>Item 1</${optionTag}>
            </${tag}>
          `);
          expect(() => {
            el.activeIndex = -1;
            el.activeIndex = 1;
            el.checkedIndex = -1;
            el.checkedIndex = 1;
          }).to.not.throw();
          expect(el.checkedIndex).to.equal(-1);
          expect(el.activeIndex).to.equal(-1);
        });

        it('unsets checked on other options when option becomes checked', async () => {
          const el = await fixture(html`
            <${tag}>
              <${optionTag} .choiceValue=${10}>Item 1</${optionTag}>
              <${optionTag} .choiceValue=${20}>Item 2</${optionTag}>
            </${tag}>
          `);
          const options = el.formElements;
          options[0].checked = true;
          expect(options[0].checked).to.be.true;
          expect(options[1].checked).to.be.false;
          options[1].checked = true;
          expect(options[0].checked).to.be.false;
          expect(options[1].checked).to.be.true;
        });

        it('unsets active on other options when option becomes active', async () => {
          const el = await fixture(html`
            <${tag}>
              <${optionTag} active .choiceValue=${10}>Item 1</${optionTag}>
              <${optionTag} .choiceValue=${20}>Item 2</${optionTag}>
            </${tag}>
          `);
          const options = el.formElements;
          expect(options[0].active).to.be.true;
          options[1].active = true;
          expect(options[0].active).to.be.false;
        });
      });

      // TODO: ChoiceGroup suite?
      describe('Interaction states', () => {
        it('becomes dirty if value changed once', async () => {
          const el = await fixture(html`
            <${tag}>
              <${optionTag} .choiceValue=${10}>Item 1</${optionTag}>
              <${optionTag} .choiceValue=${20}>Item 2</${optionTag}>
            </${tag}>
          `);

          expect(el.dirty).to.be.false;
          el.modelValue = 20;
          expect(el.dirty).to.be.true;
        });

        it('is prefilled if there is a value on init', async () => {
          const el = await fixture(html`
            <${tag}>
              <${optionTag} checked .choiceValue=${'10'}>Item 1</${optionTag}>
            </${tag}>
          `);
          expect(el.prefilled).to.be.true;

          const elEmpty = await fixture(html`
            <${tag}>
              <${optionTag} .choiceValue=${null}>Please select a value</${optionTag}>
              <${optionTag} .choiceValue=${'10'}>Item 1</${optionTag}>
            </${tag}>
          `);
          expect(elEmpty.prefilled).to.be.false;
        });
      });

      // TODO: ChoiceGroup suite?
      describe('Validation', () => {
        it('can be required', async () => {
          const el = await fixture(html`
            <${tag} .validators=${[new Required()]}>
              <${optionTag} .choiceValue=${null}>Please select a value</${optionTag}>
              <${optionTag} .choiceValue=${20}>Item 2</${optionTag}>
            </${tag}>
          `);

          expect(el.hasFeedbackFor).to.include('error');
          expect(el.validationStates).to.have.a.property('error');
          expect(el.validationStates.error).to.have.a.property('Required');

          el.modelValue = 20;
          expect(el.hasFeedbackFor).not.to.include('error');
          expect(el.validationStates).to.have.a.property('error');
          expect(el.validationStates.error).not.to.have.a.property('Required');
        });
      });
    });

    describe('Complex Data', () => {
      it('works for complex array data', async () => {
        const objs = [
          { type: 'mastercard', label: 'Master Card', amount: 12000, active: true },
          { type: 'visacard', label: 'Visa Card', amount: 0, active: false },
        ];
        const el = await fixture(html`
          <${tag} label="Favorite color" name="color">
            ${objs.map(
              obj => html`
                <${optionTag} .modelValue=${{ value: obj, checked: false }}
                  >${obj.label}</${optionTag}
                >
              `,
            )}
          </${tag}>
        `);
        el.checkedIndex = 0;
        expect(el.modelValue).to.deep.equal({
          type: 'mastercard',
          label: 'Master Card',
          amount: 12000,
          active: true,
        });

        el.checkedIndex = 1;
        expect(el.modelValue).to.deep.equal({
          type: 'visacard',
          label: 'Visa Card',
          amount: 0,
          active: false,
        });
      });
    });

    describe('Instantiation methods', () => {
      it('can be instantiated via "document.createElement"', async () => {
        let properlyInstantiated = false;

        try {
          const el = document.createElement(cfg.tagString);
          const optionsEl = document.createElement('lion-options');
          optionsEl.slot = 'input';
          const optionEl = document.createElement(cfg.optionTagString);
          optionsEl.appendChild(optionEl);
          el.appendChild(optionsEl);
          properlyInstantiated = true;
        } catch (e) {
          throw Error(e);
        }

        expect(properlyInstantiated).to.be.true;
      });

      it('can be instantiated without options', async () => {
        const el = await fixture(html`
          <${tag} name="foo">
            <${optionTag} .choiceValue=${10} checked>Item 1</${optionTag}>
            <${optionTag} .choiceValue=${20}>Item 2</${optionTag}>
          </${tag}>
        `);
        const { _listboxNode } = getListboxMembers(el);

        expect(_listboxNode).to.exist;
        expect(_listboxNode).to.be.instanceOf(LionOptions);
        expect(el.querySelector('[role=listbox]')).to.equal(_listboxNode);

        expect(el.formElements.length).to.equal(2);
        expect(_listboxNode.children.length).to.equal(2);
        expect(_listboxNode.children[0].tagName).to.equal(cfg.optionTagString.toUpperCase());
      });
    });

    describe('Href Options', () => {
      it('allows anchors to be clicked when a [href] attribute is present', async () => {
        const el = await fixture(html`
          <${tag}>
            <${optionTag}>Google</${optionTag}>
            <${optionTag} .href=${'https://duckduckgo.com'}>DuckDuck Go</${optionTag}>
          </${tag}>
        `);

        const { _listboxNode } = getListboxMembers(el);

        el.activeIndex = 1;

        // Allow options that behave like anchors (think of Google Search) to trigger the anchor behavior
        const activeOption = el.formElements[1];
        const clickSpy = sinon.spy(activeOption, 'click');
        mimicKeyPress(_listboxNode, 'Enter');

        expect(clickSpy).to.have.been.calledOnce;
      });

      it('does not allow anchors to be clicked when a [href] attribute is not present', async () => {
        const el = await fixture(html`
          <${tag}>
            <${optionTag}>Google</${optionTag}>
            <${optionTag} .href=${'https://duckduckgo.com'}>DuckDuck Go</${optionTag}>
          </${tag}>
        `);

        const { _listboxNode } = getListboxMembers(el);

        el.activeIndex = 0;

        const activeOption = el.formElements[0];
        const clickSpy = sinon.spy(activeOption, 'click');

        mimicKeyPress(_listboxNode, 'Enter');

        expect(clickSpy).to.not.have.been.called;
      });
    });

    describe('Dynamically adding options', () => {
      class MyEl extends LitElement {
        constructor() {
          super();
          /** @type {string[]} */
          this.options = ['option 1', 'option 2'];
        }

        clearOptions() {
          /** @type {string[]} */
          this.options = [];
          this.requestUpdate();
        }

        addOption() {
          this.options.push(`option ${this.options.length + 1}`);
          this.requestUpdate();
        }

        get withMap() {
          return /** @type {LionListbox} */ (this.shadowRoot?.querySelector('#withMap'));
        }

        get withRepeat() {
          return /** @type {LionListbox} */ (this.shadowRoot?.querySelector('#withRepeat'));
        }

        get registrationComplete() {
          return Promise.all([
            this.withMap.registrationComplete,
            this.withRepeat.registrationComplete,
          ]);
        }

        render() {
          return html`
            <${tag} id="withMap">
              ${this.options.map(
                option => html` <lion-option .choiceValue="${option}">${option}</lion-option> `,
              )}
            </${tag}>
            <${tag} id="withRepeat">
              ${repeat(
                this.options,
                (/** @type {string} */ option) => option,
                (/** @type {string} */ option) =>
                  html` <lion-option .choiceValue="${option}">${option}</lion-option> `,
              )}
            </${tag}>
          `;
        }
      }
      const tagName = defineCE(MyEl);
      const wrappingTag = unsafeStatic(tagName);

      it('works with array map and repeat directive', async () => {
        const choiceVals = (/** @type {LionListbox} */ elm) =>
          elm.formElements.map(fel => fel.choiceValue);
        const insideListboxNode = (/** @type {LionListbox} */ elm) =>
          // @ts-ignore [allow-protected] in test
          elm.formElements.filter(fel => elm._listboxNode.contains(fel)).length ===
          elm.formElements.length;

        const el = /** @type {MyEl} */ (await _fixture(html`<${wrappingTag}></${wrappingTag}>`));

        expect(choiceVals(el.withMap)).to.eql(el.options);
        expect(el.withMap.formElements.length).to.equal(2);
        expect(insideListboxNode(el.withMap)).to.be.true;
        expect(choiceVals(el.withRepeat)).to.eql(el.options);
        expect(el.withRepeat.formElements.length).to.equal(2);
        expect(insideListboxNode(el.withRepeat)).to.be.true;

        el.addOption();
        await el.updateComplete;
        expect(choiceVals(el.withMap)).to.eql(el.options);
        expect(el.withMap.formElements.length).to.equal(3);
        expect(insideListboxNode(el.withMap)).to.be.true;
        expect(choiceVals(el.withRepeat)).to.eql(el.options);
        expect(el.withRepeat.formElements.length).to.equal(3);
        expect(insideListboxNode(el.withRepeat)).to.be.true;

        el.clearOptions();
        await el.updateComplete;
        expect(choiceVals(el.withMap)).to.eql(el.options);
        expect(el.withMap.formElements.length).to.equal(0);
        expect(insideListboxNode(el.withMap)).to.be.true;
        expect(choiceVals(el.withRepeat)).to.eql(el.options);
        expect(el.withRepeat.formElements.length).to.equal(0);
        expect(insideListboxNode(el.withRepeat)).to.be.true;
      });
    });

    describe('Subclassers', () => {
      class MyEl extends LitElement {
        constructor() {
          super();
          /** @type {string[]} */
          this.options = ['option 1', 'option 2'];
        }

        clearOptions() {
          /** @type {string[]} */
          this.options = [];
          this.requestUpdate();
        }

        addOption() {
          this.options.push(`option ${this.options.length + 1}`);
          this.requestUpdate();
        }

        get listbox() {
          return /** @type {LionListbox} */ (this.shadowRoot?.querySelector('#listbox'));
        }

        render() {
          return html`
            <${tag} id="listbox">
              ${this.options.map(
                option => html` <lion-option .choiceValue="${option}">${option}</lion-option> `,
              )}
            </${tag}>
          `;
        }
      }
      const tagName = defineCE(MyEl);
      const wrappingTag = unsafeStatic(tagName);

      it('calls "_onListboxContentChanged" after externally changing options', async () => {
        const el = /** @type {MyEl} */ (await _fixture(html`<${wrappingTag}></${wrappingTag}>`));
        await el.listbox.registrationComplete;
        // @ts-ignore [allow-protected] in test
        const spy = sinon.spy(el.listbox, '_onListboxContentChanged');
        el.addOption();
        await el.updateComplete;
        expect(spy).to.have.been.calledOnce;
        el.clearOptions();
        await el.updateComplete;
        expect(spy).to.have.been.calledTwice;
      });
    });
  });
}
