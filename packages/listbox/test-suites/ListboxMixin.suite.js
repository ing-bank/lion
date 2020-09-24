import { Required } from '@lion/form-core';
import { expect, html, fixture, unsafeStatic } from '@open-wc/testing';
import { LionOptions } from '@lion/listbox';
import '@lion/listbox/lion-option.js';
import '@lion/listbox/lion-options.js';
import '../lion-listbox.js';
import '@lion/core/src/differentKeyEventNamesShimIE.js';

/**
 * @typedef {import('@lion/combobox/src/LionCombobox').LionCombobox} LionCombobox
 * @typedef {import('../src/LionListbox').LionListbox} LionListbox
 */

/**
 * @param {LionCombobox | LionListbox} el
 * @param {string} value
 */
function mimicUserTyping(el, value) {
  el._inputNode.dispatchEvent(new Event('focusin', { bubbles: true }));
  // eslint-disable-next-line no-param-reassign
  el._inputNode.value = value;
  el._inputNode.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
  el._overlayInvokerNode?.dispatchEvent(new Event('keyup'));
}

/**
 * @param { {tagString:string, optionTagString:string} } [customConfig]
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
    it('has a single modelValue representing the currently checked option', async () => {
      const el = await fixture(html`
        <${tag} name="foo">
          <${optionTag} .choiceValue=${10} checked>Item 1</${optionTag}>
          <${optionTag} .choiceValue=${20}>Item 2</${optionTag}>
        </${tag}>
      `);

      expect(el.modelValue).to.equal(10);
    });

    // TODO: run ChoiceGroupSuite instead?
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

    // TODO: run ChoiceGroupSuite instead?
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

    // TODO: run ChoiceGroupSuite instead?
    it('throws if a child element with a different name than the group tries to register', async () => {
      const el = await fixture(html`
        <${tag} name="gender">
          <${optionTag} .choiceValue=${'female'} checked></${optionTag}>
          <${optionTag} .choiceValue=${'other'}></${optionTag}>
        </${tag}>
      `);
      const invalidChild = await fixture(html`
        <${optionTag} name="foo" .choiceValue=${'male'}></${optionTag}>
      `);

      expect(() => {
        el.addFormElement(invalidChild);
      }).to.throw(
        `The ${cfg.tagString} name="gender" does not allow to register lion-option with custom names (name="foo" given)`,
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

    // TODO: run FormControlSuite instead?
    it(`has a fieldName based on the label`, async () => {
      const el1 = await fixture(html`
        <${tag} label="foo"></${tag}>
      `);
      expect(el1.fieldName).to.equal(el1._labelNode.textContent);

      const el2 = await fixture(html`
        <${tag}>
          <label slot="label">bar</label>
        </${tag}>
      `);
      expect(el2.fieldName).to.equal(el2._labelNode.textContent);
    });

    // TODO: run FormControlSuite instead?
    it(`has a fieldName based on the name if no label exists`, async () => {
      const el = await fixture(html`
        <${tag} name="foo"></${tag}>
      `);
      expect(el.fieldName).to.equal(el.name);
    });

    // TODO: run FormControlSuite instead?
    it(`can override fieldName`, async () => {
      const el = await fixture(html`
        <${tag} label="foo" .fieldName="${'bar'}"></${tag}>
      `);
      expect(el.__fieldName).to.equal(el.fieldName);
    });

    it('does not have a tabindex', async () => {
      const el = await fixture(html`<${tag}></${tag}>`);
      expect(el.hasAttribute('tabindex')).to.be.false;
    });

    // TODO: run ChoiceGroupSuite instead?
    // TODO: duplicate of "automatically sets the name attribute of child checkboxes to its own name"?
    it('delegates the name attribute to its children options', async () => {
      const el = await fixture(html`
        <${tag} name="foo">
          <${optionTag} .choiceValue=${10}>Item 1</${optionTag}>
          <${optionTag} .choiceValue=${20}>Item 2</${optionTag}>
        </${tag}>
      `);

      const optOne = el.querySelectorAll('lion-option')[0];
      const optTwo = el.querySelectorAll('lion-option')[1];

      expect(optOne.name).to.equal('foo');
      expect(optTwo.name).to.equal('foo');
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

      el._listboxNode.children[1].checked = true;
      await el.updateComplete;
      expect(el.hasFeedbackFor.includes('error')).to.be.false;
      expect(el.showsFeedbackFor.includes('error')).to.be.false;

      el._listboxNode.children[0].checked = true;
      await el.updateComplete;
      expect(el.hasFeedbackFor.includes('error')).to.be.true;
      expect(el.showsFeedbackFor.includes('error')).to.be.true;
    });

    it('supports having no default selection initially', async () => {
      const el = await fixture(html`
        <${tag} id="color" name="color" label="Favorite color" has-no-default-selected>
          <${optionTag} .choiceValue=${'red'}>Red</${optionTag}>
          <${optionTag} .choiceValue=${'hotpink'}>Hotpink</${optionTag}>
          <${optionTag} .choiceValue=${'teal'}>Teal</${optionTag}>
        </${tag}>
      `);

      expect(el.selectedElement).to.be.undefined;
      expect(el.modelValue).to.equal('');
    });

    // TODO: run ChoiceGroupSuite instead?
    it('supports changing the selection through serializedValue setter', async () => {
      const el = await fixture(html`
        <${tag} id="color" name="color" label="Favorite color">
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

    describe('Accessibility', () => {
      it('is accessible when closed', async () => {
        const el = await fixture(html`
          <${tag} label="age">
            <${optionTag} .choiceValue=${10}>Item 1</${optionTag}>
            <${optionTag} .choiceValue=${20}>Item 2</${optionTag}>
          </${tag}>
        `);
        await expect(el).to.be.accessible();
      });

      it('is accessible when opened', async () => {
        const el = await fixture(html`
          <${tag} label="age">
            <${optionTag} .choiceValue=${10}>Item 1</${optionTag}>
            <${optionTag} .choiceValue=${20}>Item 2</${optionTag}>
          </${tag}>
        `);
        el.opened = true;
        await el.updateComplete;
        await el.updateComplete; // need 2 awaits as overlay.show is an async function

        await expect(el).to.be.accessible();
      });
    });

    describe('Use cases', () => {
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

      // TODO: duplicate of "has a single modelValue representing the currently checked option" ?
      it('has a single modelValue representing the currently checked option', async () => {
        const el = await fixture(html`
          <${tag} name="foo">
            <${optionTag} .choiceValue=${10} checked>Item 1</${optionTag}>
            <${optionTag} .choiceValue=${20}>Item 2</${optionTag}>
          </${tag}>
        `);

        expect(el.modelValue).to.equal(10);
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

      it('can be instantiated without <lion-options>', async () => {
        const el = await fixture(html`
          <${tag} name="foo">
            <${optionTag} .choiceValue=${10} checked>Item 1</${optionTag}>
            <${optionTag} .choiceValue=${20}>Item 2</${optionTag}>
          </${tag}>
        `);

        expect(el._listboxNode).to.exist;
        expect(el._listboxNode).to.be.instanceOf(LionOptions);
        expect(el.querySelector('[role=listbox]')).to.equal(el._listboxNode);

        expect(el.formElements.length).to.equal(2);
        expect(el._listboxNode.children.length).to.equal(2);
        expect(el._listboxNode.children[0].tagName).to.equal(cfg.optionTagString.toUpperCase());
      });
    });
  });

  describe('lion-listbox interactions', () => {
    describe('values', () => {
      // TODO: ChoiceGroupSuite
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
        expect(el.modelValue).to.be.null;
      });

      // TODO: duplicate of "has a single modelValue representing the currently checked option" ?
      it('has the checked option as modelValue', async () => {
        const el = await fixture(html`
          <${tag}>
            <${optionTag} .choiceValue=${10}>Item 1</${optionTag}>
            <${optionTag} .choiceValue=${20} checked>Item 2</${optionTag}>
          </${tag}>
        `);
        expect(el.modelValue).to.equal(20);
      });

      // TODO: ChoiceGroupSuite
      it('has an activeIndex', async () => {
        const el = await fixture(html`
          <${tag}>
            <${optionTag} .choiceValue=${10}>Item 1</${optionTag}>
            <${optionTag} .choiceValue=${20}>Item 2</${optionTag}>
          </${tag}>
        `);
        expect(el.activeIndex).to.equal(-1);

        el.querySelectorAll('lion-option')[1].active = true;
        expect(el.querySelectorAll('lion-option')[0].active).to.be.false;
        expect(el.activeIndex).to.equal(1);
      });
    });

    describe('Keyboard navigation', () => {
      // TODO: add multiselect

      // TODO: add key combinations like shift+home/ctrl+A etc etc.

      describe('Arrow Keys', () => {
        // TODO: add test for regular navigation with and without selectionFollowsFocus

        describe('Rotate Keyboard Navigation', () => {
          it('does not allow to navigate above the first or below the last option', async () => {
            const el = await fixture(html`
            <${tag} opened>
              <${optionTag} .choiceValue=${10}>Item 1</${optionTag}>
            </${tag}>
          `);

            mimicUserTyping(el, '1');
            await el.updateComplete;
            expect(() => {
              el._listboxNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
              el._listboxNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
            }).to.not.throw();
            expect(el.checkedIndex).to.equal(-1);
            expect(el.activeIndex).to.equal(0);
          });

          // TODO: move test from Combobox here
        });
      });

      describe('Enter', () => {});

      describe('Space', () => {
        it('selects active option when listbox is focusable', async () => {
          // When listbox is not focusable (in case of a combobox), the user should be allowed
          // to enter a space in the focusable element (texbox)
        });
      });

      // TODO: nice to have. Get from menu impl.
      it.skip('selects a value with single [character] key', async () => {
        const el = await fixture(html`
          <${tag} opened>
            <${optionTag} .choiceValue=${'a'}>A</${optionTag}>
            <${optionTag} .choiceValue=${'b'}>B</${optionTag}>
            <${optionTag} .choiceValue=${'c'}>C</${optionTag}>
          </${tag}>
        `);
        expect(el.choiceValue).to.equal('a');
        el.dispatchEvent(new KeyboardEvent('keydown', { key: 'C' }));
        expect(el.choiceValue).to.equal('c');
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
        expect(el.choiceValue).to.equal('far');
        el.dispatchEvent(new KeyboardEvent('keydown', { key: 'O' }));
        expect(el.choiceValue).to.equal('foo');
      });
    });

    // TODO: rename to selectionFollowsFocus and test connection to interaction-mode in select-rich
    describe('Keyboard navigation Mac', () => {
      // TODO:
      it('navigates through open list with [ArrowDown] [ArrowUp] keys activates the option', async () => {
        const el = await fixture(html`
          <${tag} opened interaction-mode="mac">
            <${optionTag} .choiceValue=${10}>Item 1</${optionTag}>
            <${optionTag} .choiceValue=${20}>Item 2</${optionTag}>
            <${optionTag} .choiceValue=${30}>Item 3</${optionTag}>
          </${tag}>
        `);
        mimicUserTyping(el, '0');
        await el.updateComplete;
        expect(el.activeIndex).to.equal(-1);
        expect(el.checkedIndex).to.equal(-1);

        el._listboxNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
        expect(el.activeIndex).to.equal(0);
        expect(el.checkedIndex).to.equal(-1);

        el._listboxNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
        expect(el.activeIndex).to.equal(1);
        expect(el.checkedIndex).to.equal(-1);

        el._listboxNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
        expect(el.activeIndex).to.equal(0);
        expect(el.checkedIndex).to.equal(-1);
      });
    });

    describe('Disabled', () => {
      it('cannot be navigated with keyboard if disabled', async () => {
        const el = await fixture(html`
          <${tag} disabled>
            <${optionTag} .choiceValue=${10}>Item 1</${optionTag}>
            <${optionTag} checked .choiceValue=${20}>Item 2</${optionTag}>
          </${tag}>
        `);
        mimicUserTyping(el, '0');
        await el.updateComplete;
        el._listboxNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
        expect(el.modelValue).to.equal(20);
      });

      it('does not skip disabled options but prevents checking them', async () => {
        const el = await fixture(html`
          <${tag}>
            <${optionTag} .choiceValue=${10}>Item 1</${optionTag}>
            <${optionTag} .choiceValue=${20} disabled>Item 2</${optionTag}>
            <${optionTag} .choiceValue=${30}>Item 3</${optionTag}>
          </${tag}>
        `);
        mimicUserTyping(el, '0');
        await el.updateComplete;
        el._listboxNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
        expect(el.activeIndex).to.equal(0);

        el._listboxNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
        expect(el.activeIndex).to.equal(1);

        el._listboxNode.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        expect(el.checkedIndex).to.equal(-1);
      });

      it('sync its disabled state to all options', async () => {
        const el = await fixture(html`
          <${tag} opened>
            <${optionTag} .choiceValue=${10} disabled>Item 1</${optionTag}>
            <${optionTag} .choiceValue=${20}>Item 2</${optionTag}>
          </${tag}>
        `);
        const options = [...el.querySelectorAll('lion-option')];
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
        const options = [...el.querySelectorAll('lion-option')];
        expect(options[0].disabled).to.be.true;
        expect(options[1].disabled).to.be.true;

        el.disabled = false;
        await el.updateComplete;
        expect(options[0].disabled).to.be.true;
        expect(options[1].disabled).to.be.false;
      });
    });

    // TODO: ChoiceGroupMixin?
    describe('Programmatic interaction', () => {
      it('can set active state', async () => {
        const el = await fixture(html`
          <${tag}>
            <${optionTag} .choiceValue=${10}>Item 1</${optionTag}>
            <${optionTag} .choiceValue=${20} id="myId">Item 2</${optionTag}>
          </${tag}>
        `);
        const opt = el.querySelectorAll('lion-option')[1];
        opt.active = true;
        expect(el._activeDescendantOwnerNode.getAttribute('aria-activedescendant')).to.equal(
          'myId',
        );
      });

      it('can set checked state', async () => {
        const el = await fixture(html`
          <${tag}>
            <${optionTag} .choiceValue=${10}>Item 1</${optionTag}>
            <${optionTag} .choiceValue=${20}>Item 2</${optionTag}>
          </${tag}>
        `);
        const option = el.querySelectorAll('lion-option')[1];
        option.checked = true;
        expect(el.modelValue).to.equal(20);
      });

      it('does not allow to set checkedIndex or activeIndex to be out of bound', async () => {
        const el = await fixture(html`
          <${tag}>
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
            <${optionTag} checked .choiceValue=${10}>Item 1</${optionTag}>
            <${optionTag} .choiceValue=${20}>Item 2</${optionTag}>
          </${tag}>
        `);
        const options = el.querySelectorAll('lion-option');
        expect(options[0].checked).to.be.true;
        options[1].checked = true;
        expect(options[0].checked).to.be.false;
      });

      it('unsets active on other options when option becomes active', async () => {
        const el = await fixture(html`
          <${tag}>
            <${optionTag} active .choiceValue=${10}>Item 1</${optionTag}>
            <${optionTag} .choiceValue=${20}>Item 2</${optionTag}>
          </${tag}>
        `);
        const options = el.querySelectorAll('lion-option');
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
            <${optionTag} checked .choiceValue=${10}>Item 1</${optionTag}>
          </${tag}>
        `);
        expect(el.prefilled).to.be.true;

        const elEmpty = await fixture(html`
          <${tag}>
            <${optionTag} .choiceValue=${null}>Please select a value</${optionTag}>
            <${optionTag} .choiceValue=${10}>Item 1</${optionTag}>
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

    describe('Accessibility', () => {
      it('creates unique ids for all children', async () => {
        const el = await fixture(html`
          <${tag}>
            <${optionTag} .choiceValue=${10}>Item 1</${optionTag}>
            <${optionTag} .choiceValue=${20} selected>Item 2</${optionTag}>
            <${optionTag} .choiceValue=${30} id="predefined">Item 3</${optionTag}>
          </${tag}>
        `);
        expect(el.querySelectorAll('lion-option')[0].id).to.exist;
        expect(el.querySelectorAll('lion-option')[1].id).to.exist;
        expect(el.querySelectorAll('lion-option')[2].id).to.equal('predefined');
      });

      it('has a reference to the active option', async () => {
        const el = await fixture(html`
          <${tag}>
            <${optionTag} .choiceValue=${10} id="first">Item 1</${optionTag}>
            <${optionTag} .choiceValue=${20} checked id="second">Item 2</${optionTag}>
          </${tag}>
        `);
        expect(el._activeDescendantOwnerNode.getAttribute('aria-activedescendant')).to.be.null;
        el._activeDescendantOwnerNode.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'ArrowDown' }),
        );
        expect(el._activeDescendantOwnerNode.getAttribute('aria-activedescendant')).to.equal(
          'first',
        );
        el._activeDescendantOwnerNode.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'ArrowDown' }),
        );
        expect(el._activeDescendantOwnerNode.getAttribute('aria-activedescendant')).to.equal(
          'second',
        );
      });

      it('puts "aria-setsize" on all options to indicate the total amount of options', async () => {
        const el = await fixture(html`
          <${tag}>
            <${optionTag} .choiceValue=${10}>Item 1</${optionTag}>
            <${optionTag} .choiceValue=${20}>Item 2</${optionTag}>
            <${optionTag} .choiceValue=${30}>Item 3</${optionTag}>
          </${tag}>
        `);
        const optionEls = [].slice.call(el.querySelectorAll('lion-option'));
        optionEls.forEach(optionEl => {
          expect(optionEl.getAttribute('aria-setsize')).to.equal('3');
        });
      });

      it('puts "aria-posinset" on all options to indicate their position in the listbox', async () => {
        const el = await fixture(html`
          <${tag}>
            <${optionTag} .choiceValue=${10}>Item 1</${optionTag}>
            <${optionTag} .choiceValue=${20}>Item 2</${optionTag}>
            <${optionTag} .choiceValue=${30}>Item 3</${optionTag}>
          </${tag}>
        `);
        const optionEls = [].slice.call(el.querySelectorAll('lion-option'));
        optionEls.forEach((oEl, i) => {
          expect(oEl.getAttribute('aria-posinset')).to.equal(`${i + 1}`);
        });
      });
    });
  });
}
