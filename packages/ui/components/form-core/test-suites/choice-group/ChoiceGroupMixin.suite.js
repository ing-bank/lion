import {
  ChoiceGroupMixin,
  ChoiceInputMixin,
  FormGroupMixin,
  Required,
} from '@lion/ui/form-core.js';
import { LionInput } from '@lion/ui/input.js';
import { LionFieldset } from '@lion/ui/fieldset.js';
import { expect, fixture, fixtureSync, html, unsafeStatic } from '@open-wc/testing';
import { LitElement } from 'lit';
import sinon from 'sinon';
import { resolveSuiteTag } from '../../../core/test-helpers/resolveSuiteTag.js';
class ChoiceInputFoo extends ChoiceInputMixin(LionInput) {}
class ChoiceInputBar extends ChoiceInputMixin(LionInput) {
  _syncNameToParentFormGroup() {
    // Always sync, without conditions
    this.name = this._parentFormGroup?.name || '';
  }
}
class ChoiceInput extends ChoiceInputMixin(LionInput) {}
class ChoiceInputGroup extends ChoiceGroupMixin(FormGroupMixin(LitElement)) {}

/**
 * @typedef {import('@lion/ui/types/test-suites.js').SuiteElement} SuiteElement
 * `tagString`, `klass` and the older role tag keys are deprecated: pass `classes` instead (Lion
 * itself uses `classes` everywhere).
 * @param {import('@lion/ui/types/test-suites.js').SuiteConfig<{child: SuiteElement; childBar: SuiteElement; childFoo: SuiteElement; fieldset: SuiteElement; host: SuiteElement}, {choiceType?: any; childTagString?: string; childTagStringBar?: string; childTagStringFoo?: string; parentTagString?: string}>} customConfig
 */
export function runChoiceGroupMixinSuite({
  classes: {
    host = ChoiceInputGroup,
    child = ChoiceInput,
    childFoo = ChoiceInputFoo,
    childBar = ChoiceInputBar,
    fieldset = LionFieldset,
  } = {},
  choiceType = 'single',
  parentTagString: legacyParentTagString,
  childTagString: legacyChildTagString,
  childTagStringFoo: legacyChildTagStringFoo,
  childTagStringBar: legacyChildTagStringBar,
} = {}) {
  const tagNames = {
    host: resolveSuiteTag(host, legacyParentTagString),
    child: resolveSuiteTag(child, legacyChildTagString),
    childFoo: resolveSuiteTag(childFoo, legacyChildTagStringFoo),
    childBar: resolveSuiteTag(childBar, legacyChildTagStringBar),
    fieldset: resolveSuiteTag(fieldset),
  };
  const tags = {
    host: unsafeStatic(tagNames.host),
    child: unsafeStatic(tagNames.child),
    childFoo: unsafeStatic(tagNames.childFoo),
    childBar: unsafeStatic(tagNames.childBar),
    fieldset: unsafeStatic(tagNames.fieldset),
  };
  const { host: parentTagString, child: childTagString } = tagNames;
  describe(`ChoiceGroupMixin: ${parentTagString}`, () => {
    if (choiceType === 'single') {
      it('has a single modelValue representing initial checked values', async () => {
        const el =
          /** @type {ChoiceInputGroup} */
          await fixture(html`
          <${tags.host} name="gender[]">
            <${tags.child} .choiceValue=${'male'}></${tags.child}>
            <${tags.child} .choiceValue=${'female'} checked></${tags.child}>
            <${tags.child} .choiceValue=${'other'}></${tags.child}>
          </${tags.host}>
        `);

        // @ts-ignore protected members allowed in test
        expect(el._initialModelValue).to.eql('female');
        expect(el.modelValue).to.eql('female');
        el.formElements[0].checked = true;

        // @ts-ignore protected members allowed in test
        expect(el._initialModelValue).to.eql('female');
        expect(el.modelValue).to.eql('male');
      });
      it('has a single modelValue representing the currently checked radio value', async () => {
        const el =
          /** @type {ChoiceInputGroup} */
          await fixture(html`
          <${tags.host} name="gender[]">
            <${tags.child} .choiceValue=${'male'}></${tags.child}>
            <${tags.child} .choiceValue=${'female'} checked></${tags.child}>
            <${tags.child} .choiceValue=${'other'}></${tags.child}>
          </${tags.host}>
        `);
        expect(el.modelValue).to.equal('female');
        el.formElements[0].checked = true;
        expect(el.modelValue).to.equal('male');
        el.formElements[2].checked = true;
        expect(el.modelValue).to.equal('other');
      });
      it('has a single formattedValue representing the currently checked radio value', async () => {
        const el =
          /** @type {ChoiceInputGroup} */
          await fixture(html`
          <${tags.host} name="gender">
            <${tags.child} .choiceValue=${'male'}></${tags.child}>
            <${tags.child} .choiceValue=${'female'} checked></${tags.child}>
            <${tags.child} .choiceValue=${'other'}></${tags.child}>
          </${tags.host}>
        `);
        expect(el.formattedValue).to.equal('female');
        el.formElements[0].checked = true;
        expect(el.formattedValue).to.equal('male');
        el.formElements[2].checked = true;
        expect(el.formattedValue).to.equal('other');
      });
    }
    it('throws if a child element without a modelValue like { value: "foo", checked: false } tries to register', async () => {
      const el =
        /** @type {ChoiceInputGroup} */
        await fixture(html`
        <${tags.host} name="gender[]">
          <${tags.child} .choiceValue=${'male'}></${tags.child}>
          <${tags.child} .choiceValue=${'female'} checked></${tags.child}>
          <${tags.child} .choiceValue=${'other'}></${tags.child}>
        </${tags.host}>
      `);
      const invalidChild =
        /** @type {ChoiceInputGroup} */
        await fixture(html`
        <${tags.child} .modelValue=${'Lara'}></${tags.child}>
      `);
      expect(() => {
        el.addFormElement(invalidChild);
      }).to.throw(
        `The ${parentTagString} name="gender[]" does not allow to register ${childTagString} with .modelValue="Lara" - The modelValue should represent an Object { value: "foo", checked: false }`,
      );
    });
    it('automatically sets the name property of child fields to its own name', async () => {
      const el =
        /** @type {ChoiceInputGroup} */
        await fixture(html`
        <${tags.host} name="gender[]">
          <${tags.child} .choiceValue=${'female'} checked></${tags.child}>
          <${tags.child} .choiceValue=${'other'}></${tags.child}>
        </${tags.host}>
      `);
      expect(el.formElements[0].name).to.equal('gender[]');
      expect(el.formElements[1].name).to.equal('gender[]');
      const validChild =
        /** @type {ChoiceInputGroup} */
        await fixture(html`
        <${tags.child} .choiceValue=${'male'}></${tags.child}>
      `);
      el.appendChild(validChild);
      expect(el.formElements[2].name).to.equal('gender[]');
    });
    it('automatically updates the name property of child fields to its own name', async () => {
      const el =
        /** @type {ChoiceInputGroup} */
        await fixture(html`
        <${tags.host} name="gender[]">
          <${tags.child}></${tags.child}>
          <${tags.child}></${tags.child}>
        </${tags.host}>
      `);
      expect(el.formElements[0].name).to.equal('gender[]');
      expect(el.formElements[1].name).to.equal('gender[]');
      el.name = 'gender2[]';
      await el.updateComplete;
      expect(el.formElements[0].name).to.equal('gender2[]');
      expect(el.formElements[1].name).to.equal('gender2[]');
    });
    it('prevents updating the name property of a child if it is different from its parent', async () => {
      const Parent = customElements.get(parentTagString);
      const Child = customElements.get(childTagString);
      if (!Parent || !Child) {
        throw new Error('The choice-group fixture requires resolved constructors.');
      }
      // This contract requires the parent tag to contain the child tag.
      const scopedChildName = `${childTagString}-scoped`;
      const scopedParentName = `${parentTagString}-${scopedChildName}-group`;
      const scopedChildTag = unsafeStatic(scopedChildName);
      const scopedParentTag = unsafeStatic(scopedParentName);
      const el =
        /** @type {ChoiceInputGroup} */
        await fixture(
          html`
            <${scopedParentTag} name="gender[]">
              <${scopedChildTag}></${scopedChildTag}>
              <${scopedChildTag}></${scopedChildTag}>
            </${scopedParentTag}>
          `,
          {
            scopedElements: {
              [scopedParentName]: class extends Parent {},
              [scopedChildName]: class extends Child {},
            },
          },
        );
      expect(el.formElements[0].name).to.equal('gender[]');
      expect(el.formElements[1].name).to.equal('gender[]');
      el.formElements[0].name = 'gender2[]';
      await el.formElements[0].updateComplete;
      expect(el.formElements[0].name).to.equal('gender[]');
    });
    it('allows updating the name property of a child if parent tagName does not include childTagname', async () => {
      const el =
        /** @type {ChoiceInputGroup} */
        await fixture(html`
        <${tags.host} name="gender[]">
          <${tags.childFoo}></${tags.childFoo}>
          <${tags.childFoo}></${tags.childFoo}>
        </${tags.host}>
      `);
      expect(el.formElements[0].name).to.equal('gender[]');
      expect(el.formElements[1].name).to.equal('gender[]');
      el.formElements[0].name = 'gender2[]';
      await el.formElements[0].updateComplete;
      expect(el.formElements[0].name).to.equal('gender2[]');
    });
    it('allows setting the condition for syncing the name property of a child to parent', async () => {
      const el =
        /** @type {ChoiceInputGroup} */
        await fixture(html`
        <${tags.host} name="gender[]">
          <${tags.childBar}></${tags.childBar}>
          <${tags.childBar}></${tags.childBar}>
        </${tags.host}>
      `);
      expect(el.formElements[0].name).to.equal('gender[]');
      expect(el.formElements[1].name).to.equal('gender[]');
      el.formElements[0].name = 'gender2[]';
      await el.formElements[0].updateComplete;
      expect(el.formElements[0].name).to.equal('gender[]');
    });
    it('adjusts the name of a child element if it has a different name than the group', async () => {
      const el =
        /** @type {ChoiceInputGroup} */
        await fixture(html`
        <${tags.host} name="gender[]">
          <${tags.child} .choiceValue=${'female'} checked></${tags.child}>
          <${tags.child} .choiceValue=${'other'}></${tags.child}>
        </${tags.host}>
      `);
      const invalidChild =
        /** @type {ChoiceInputGroup} */
        await fixture(html`
        <${tags.child} name="foo" .choiceValue=${'male'}></${tags.child}>
      `);
      el.addFormElement(invalidChild);
      await invalidChild.updateComplete;
      expect(invalidChild.name).to.equal('gender[]');
    });
    it('can set initial modelValue on creation', async () => {
      const el =
        /** @type {ChoiceInputGroup} */
        await fixture(html`
        <${tags.host} name="gender[]" .modelValue=${'other'}>
          <${tags.child} .choiceValue=${'male'}></${tags.child}>
          <${tags.child} .choiceValue=${'female'}></${tags.child}>
          <${tags.child} .choiceValue=${'other'}></${tags.child}>
        </${tags.host}>
      `);
      if (choiceType === 'single') {
        expect(el.modelValue).to.equal('other');
      } else {
        expect(el.modelValue).to.deep.equal(['other']);
      }
      expect(el.formElements[2].checked).to.be.true;
    });
    it('can set initial serializedValue on creation', async () => {
      const el =
        /** @type {ChoiceInputGroup} */
        await fixture(html`
        <${tags.host} name="gender[]" .serializedValue=${'other'}>
          <${tags.child} .choiceValue=${'male'}></${tags.child}>
          <${tags.child} .choiceValue=${'female'}></${tags.child}>
          <${tags.child} .choiceValue=${'other'}></${tags.child}>
        </${tags.host}>
      `);
      if (choiceType === 'single') {
        expect(el.serializedValue).to.equal('other');
      } else {
        expect(el.serializedValue).to.deep.equal(['other']);
      }
      expect(el.formElements[2].checked).to.be.true;
    });
    it('can set initial formattedValue on creation', async () => {
      const el =
        /** @type {ChoiceInputGroup} */
        await fixture(html`
        <${tags.host} name="gender[]" .formattedValue=${'other'}>
          <${tags.child} .choiceValue=${'male'}></${tags.child}>
          <${tags.child} .choiceValue=${'female'}></${tags.child}>
          <${tags.child} .choiceValue=${'other'}></${tags.child}>
        </${tags.host}>
      `);
      if (choiceType === 'single') {
        expect(el.formattedValue).to.equal('other');
      } else {
        expect(el.formattedValue).to.deep.equal(['other']);
      }
      expect(el.formElements[2].checked).to.be.true;
    });
    it('correctly handles modelValue being set before registrationComplete', async () => {
      const el =
        /** @type {ChoiceInputGroup} */
        fixtureSync(html`
        <${tags.host} name="gender[]" .modelValue=${null}>
          <${tags.child} .choiceValue=${'male'}></${tags.child}>
          <${tags.child} .choiceValue=${'female'}></${tags.child}>
          <${tags.child} .choiceValue=${'other'}></${tags.child}>
        </${tags.host}>
      `);
      if (choiceType === 'single') {
        el.modelValue = 'other';
        await el.registrationComplete;
        expect(el.modelValue).to.equal('other');
      } else {
        el.modelValue = ['other'];
        await el.registrationComplete;
        expect(el.modelValue).to.deep.equal(['other']);
      }
    });
    it('correctly handles serializedValue being set before registrationComplete', async () => {
      const el =
        /** @type {ChoiceInputGroup} */
        fixtureSync(html`
        <${tags.host} name="gender[]" .serializedValue=${null}>
          <${tags.child} .choiceValue=${'male'}></${tags.child}>
          <${tags.child} .choiceValue=${'female'}></${tags.child}>
          <${tags.child} .choiceValue=${'other'}></${tags.child}>
        </${tags.host}>
      `);
      if (choiceType === 'single') {
        // @ts-expect-error
        el.serializedValue = 'other';
        await el.registrationComplete;
        expect(el.serializedValue).to.equal('other');
      } else {
        // @ts-expect-error
        el.serializedValue = ['other'];
        await el.registrationComplete;
        expect(el.serializedValue).to.deep.equal(['other']);
      }
    });
    it('can handle null and undefined modelValues', async () => {
      const el =
        /** @type {ChoiceInputGroup} */
        await fixture(html`
        <${tags.host} name="gender[]" .modelValue=${null}>
          <${tags.child} .choiceValue=${'male'}></${tags.child}>
          <${tags.child} .choiceValue=${'female'}></${tags.child}>
          <${tags.child} .choiceValue=${'other'}></${tags.child}>
        </${tags.host}>
      `);
      if (choiceType === 'single') {
        expect(el.modelValue).to.equal('');
      } else {
        expect(el.modelValue).to.deep.equal([]);
      }
      el.modelValue = undefined;
      await el.updateComplete;
      if (choiceType === 'single') {
        expect(el.modelValue).to.equal('');
      } else {
        expect(el.modelValue).to.deep.equal([]);
      }
    });
    it('can handle complex data via choiceValue', async () => {
      const date = new Date(2018, 11, 24, 10, 33, 30, 0);
      const el =
        /** @type {ChoiceInputGroup} */
        await fixture(html`
        <${tags.host} name="data[]">
          <${tags.child} .choiceValue=${{
            some: 'data',
          }}></${tags.child}>
          <${tags.child} .choiceValue=${date} checked></${tags.child}>
        </${tags.host}>
      `);
      if (choiceType === 'single') {
        expect(el.modelValue).to.equal(date);
        el.formElements[0].checked = true;
        expect(el.modelValue).to.deep.equal({
          some: 'data',
        });
      } else {
        expect(el.modelValue).to.deep.equal([date]);
        el.formElements[0].checked = true;
        expect(el.modelValue).to.deep.equal([
          {
            some: 'data',
          },
          date,
        ]);
      }
    });
    it('can handle 0 and empty string as valid values', async () => {
      const el =
        /** @type {ChoiceInputGroup} */
        await fixture(html`
        <${tags.host} name="data[]">
          <${tags.child} .choiceValue=${0} checked></${tags.child}>
          <${tags.child} .choiceValue=${''}></${tags.child}>
        </${tags.host}>
      `);
      if (choiceType === 'single') {
        expect(el.modelValue).to.equal(0);
        el.formElements[1].checked = true;
        expect(el.modelValue).to.equal('');
      } else {
        expect(el.modelValue).to.deep.equal([0]);
        el.formElements[1].checked = true;
        expect(el.modelValue).to.deep.equal([0, '']);
      }
    });
    it('can check a choice by supplying an available modelValue', async () => {
      const el =
        /** @type {ChoiceInputGroup} */
        await fixture(html`
        <${tags.host} name="gender[]">
          <${tags.child}
            .modelValue="${{
              value: 'male',
              checked: false,
            }}"
          ></${tags.child}>
          <${tags.child}
            .modelValue="${{
              value: 'female',
              checked: true,
            }}"
          ></${tags.child}>
          <${tags.child}
            .modelValue="${{
              value: 'other',
              checked: false,
            }}"
          ></${tags.child}>
        </${tags.host}>
      `);
      if (choiceType === 'single') {
        expect(el.modelValue).to.equal('female');
      } else {
        expect(el.modelValue).to.deep.equal(['female']);
      }
      el.modelValue = 'other';
      expect(el.formElements[2].checked).to.be.true;
    });
    it('can check a choice by supplying an available modelValue even if this modelValue is an array or object', async () => {
      const el =
        /** @type {ChoiceInputGroup} */
        await fixture(html`
        <${tags.host} name="gender[]">
          <${tags.child}
            .modelValue="${{
              value: {
                v: 'male',
              },
              checked: false,
            }}"
          ></${tags.child}>
          <${tags.child}
            .modelValue="${{
              value: {
                v: 'female',
              },
              checked: true,
            }}"
          ></${tags.child}>
          <${tags.child}
            .modelValue="${{
              value: {
                v: 'other',
              },
              checked: false,
            }}"
          ></${tags.child}>
        </${tags.host}>
      `);
      if (choiceType === 'single') {
        expect(el.modelValue).to.eql({
          v: 'female',
        });
      } else {
        expect(el.modelValue).to.deep.equal([
          {
            v: 'female',
          },
        ]);
      }
      if (choiceType === 'single') {
        el.modelValue = {
          v: 'other',
        };
      } else {
        el.modelValue = [
          {
            v: 'other',
          },
        ];
      }
      expect(el.formElements[2].checked).to.be.true;
    });
    it('expect child nodes to only fire one model-value-changed event per instance', async () => {
      let counter = 0;
      const el =
        /** @type {ChoiceInputGroup} */
        await fixture(html`
        <${tags.host}
          name="gender[]"
          @model-value-changed=${() => {
            counter += 1;
          }}
        >
          <${tags.child} .choiceValue=${'male'}></${tags.child}>
          <${tags.child}
            .modelValue=${{
              value: 'female',
              checked: true,
            }}
          ></${tags.child}>
          <${tags.child} .choiceValue=${'other'}></${tags.child}>
        </${tags.host}>
      `);
      counter = 0; // reset after setup which may result in different results

      el.formElements[0].checked = true;
      expect(counter).to.equal(1); // male becomes checked

      // not changed values trigger no event
      el.formElements[0].checked = true;
      expect(counter).to.equal(1);
      el.formElements[2].checked = true;
      expect(counter).to.equal(2); // other becomes checked

      if (choiceType === 'single') {
        // not found values trigger no event
        el.modelValue = 'foo';
        expect(counter).to.equal(2);
        el.modelValue = 'male';
        expect(counter).to.equal(3); // male becomes checked, other becomes unchecked
      }
      if (choiceType === 'multiple') {
        // not found values trigger no event
        el.modelValue = ['foo', 'male', 'female', 'other'];
        expect(counter).to.equal(2);
        el.modelValue = ['female', 'other'];
        expect(counter).to.equal(3); // male becomes unchecked
      }
    });
    it('can be required', async () => {
      const el =
        /** @type {ChoiceInputGroup} */
        await fixture(html`
        <${tags.host} name="gender[]" .validators=${[new Required()]}>
          <${tags.child} .choiceValue=${'male'}></${tags.child}>
          <${tags.child}
            .choiceValue=${{
              subObject: 'satisfies required',
            }}
          ></${tags.child}>
        </${tags.host}>
      `);
      expect(el.hasFeedbackFor).to.include('error');
      expect(el.validationStates.error).to.exist;
      expect(el.validationStates.error.Required).to.exist;
      el.formElements[0].checked = true;
      expect(el.hasFeedbackFor).not.to.include('error');
      expect(el.validationStates.error).to.exist;
      expect(el.validationStates.error.Required).to.not.exist;
      el.formElements[1].checked = true;
      expect(el.hasFeedbackFor).not.to.include('error');
      expect(el.validationStates.error).to.exist;
      expect(el.validationStates.error.Required).to.not.exist;
    });
    it('returns serialized value', async () => {
      const el =
        /** @type {ChoiceInputGroup} */
        await fixture(html`
        <${tags.host} name="gender[]">
          <${tags.child} .choiceValue=${'male'}></${tags.child}>
          <${tags.child} .choiceValue=${'female'}></${tags.child}>
        </${tags.host}>
      `);
      el.formElements[0].checked = true;
      if (choiceType === 'single') {
        expect(el.serializedValue).to.deep.equal('male');
      } else {
        expect(el.serializedValue).to.deep.equal(['male']);
      }
    });
    it('returns serialized value on unchecked state', async () => {
      const el =
        /** @type {ChoiceInputGroup} */
        await fixture(html`
        <${tags.host} name="gender[]">
          <${tags.child} .choiceValue=${'male'}></${tags.child}>
          <${tags.child} .choiceValue=${'female'}></${tags.child}>
        </${tags.host}>
      `);
      if (choiceType === 'single') {
        expect(el.serializedValue).to.deep.equal('');
      } else {
        expect(el.serializedValue).to.deep.equal([]);
      }
    });
    it('can be cleared', async () => {
      const el =
        /** @type {ChoiceInputGroup} */
        await fixture(html`
        <${tags.host} name="gender[]">
          <${tags.child} .choiceValue=${'male'}></${tags.child}>
          <${tags.child} .choiceValue=${'female'}></${tags.child}>
        </${tags.host}>
      `);
      el.formElements[0].checked = true;
      el.clear();
      if (choiceType === 'single') {
        expect(el.serializedValue).to.deep.equal('');
      } else {
        expect(el.serializedValue).to.deep.equal([]);
      }
    });
    describe('multipleChoice', () => {
      it('has multiple _initialModelValue representing initial checked values', async () => {
        const el =
          /** @type {ChoiceInputGroup} */
          await fixture(html`
          <${tags.host} multiple-choice name="animals[]">
            <${tags.child} .choiceValue=${'dog'} checked></${tags.child}>
            <${tags.child} .choiceValue=${'cat'} checked></${tags.child}>
            <${tags.child} .choiceValue=${'lion'}></${tags.child}>
          </${tags.host}>
        `);

        // @ts-ignore protected members allowed in test
        expect(el._initialModelValue).to.eql(['dog', 'cat']);
        expect(el.modelValue).to.eql(['dog', 'cat']);
        el.formElements[2].checked = true;

        // @ts-ignore protected members allowed in test
        expect(el._initialModelValue).to.eql(['dog', 'cat']);
        expect(el.modelValue).to.eql(['dog', 'cat', 'lion']);
      });
      it('has a single modelValue representing all currently checked values', async () => {
        const el =
          /** @type {ChoiceInputGroup} */
          await fixture(html`
          <${tags.host} multiple-choice name="gender[]">
            <${tags.child} .choiceValue=${'male'}></${tags.child}>
            <${tags.child} .choiceValue=${'female'} checked></${tags.child}>
            <${tags.child} .choiceValue=${'other'}></${tags.child}>
          </${tags.host}>
        `);
        expect(el.modelValue).to.eql(['female']);
        el.formElements[0].checked = true;
        expect(el.modelValue).to.eql(['male', 'female']);
        el.formElements[2].checked = true;
        expect(el.modelValue).to.eql(['male', 'female', 'other']);
      });
      it('has a single serializedValue representing all currently checked values', async () => {
        const el =
          /** @type {ChoiceInputGroup} */
          await fixture(html`
          <${tags.host} multiple-choice name="gender[]">
            <${tags.child} .choiceValue=${'male'}></${tags.child}>
            <${tags.child} .choiceValue=${'female'} checked></${tags.child}>
            <${tags.child} .choiceValue=${'other'}></${tags.child}>
          </${tags.host}>
        `);
        expect(el.serializedValue).to.eql(['female']);
        el.formElements[0].checked = true;
        expect(el.serializedValue).to.eql(['male', 'female']);
        el.formElements[2].checked = true;
        expect(el.serializedValue).to.eql(['male', 'female', 'other']);
      });
      it('has a single formattedValue representing all currently checked values', async () => {
        const el =
          /** @type {ChoiceInputGroup} */
          await fixture(html`
          <${tags.host} multiple-choice name="gender[]">
            <${tags.child} .choiceValue=${'male'}></${tags.child}>
            <${tags.child} .choiceValue=${'female'} checked></${tags.child}>
            <${tags.child} .choiceValue=${'other'}></${tags.child}>
          </${tags.host}>
        `);
        expect(el.formattedValue).to.eql(['female']);
        el.formElements[0].checked = true;
        expect(el.formattedValue).to.eql(['male', 'female']);
        el.formElements[2].checked = true;
        expect(el.formattedValue).to.eql(['male', 'female', 'other']);
      });
      it('can check multiple checkboxes by setting the modelValue', async () => {
        const el =
          /** @type {ChoiceInputGroup} */
          await fixture(html`
          <${tags.host} multiple-choice name="gender[]">
            <${tags.child} .choiceValue=${'male'}></${tags.child}>
            <${tags.child} .choiceValue=${'female'}></${tags.child}>
            <${tags.child} .choiceValue=${'other'}></${tags.child}>
          </${tags.host}>
        `);
        el.modelValue = ['male', 'other'];
        expect(el.modelValue).to.eql(['male', 'other']);
        expect(el.formElements[0].checked).to.be.true;
        expect(el.formElements[2].checked).to.be.true;
      });
      it('unchecks non-matching checkboxes when setting the modelValue', async () => {
        const el =
          /** @type {ChoiceInputGroup} */
          await fixture(html`
          <${tags.host} multiple-choice name="gender[]">
            <${tags.child} .choiceValue=${'male'} checked></${tags.child}>
            <${tags.child} .choiceValue=${'female'}></${tags.child}>
            <${tags.child} .choiceValue=${'other'} checked></${tags.child}>
          </${tags.host}>
        `);
        expect(el.modelValue).to.eql(['male', 'other']);
        expect(el.formElements[0].checked).to.be.true;
        expect(el.formElements[2].checked).to.be.true;
        el.modelValue = ['female'];
        expect(el.formElements[0].checked).to.be.false;
        expect(el.formElements[1].checked).to.be.true;
        expect(el.formElements[2].checked).to.be.false;
      });
    });
    describe('Integration with a parent form/fieldset', () => {
      it('will serialize all children with their serializedValue', async () => {
        const el =
          /** @type {ChoiceInputGroup} */
          await fixture(html`
          <${tags.fieldset}>
            <${tags.host} name="gender[]">
              <${tags.child} .choiceValue=${'male'} checked disabled></${tags.child}>
              <${tags.child} .choiceValue=${'female'} checked></${tags.child}>
              <${tags.child} .choiceValue=${'other'}></${tags.child}>
            </${tags.host}>
          </${tags.fieldset}>
        `);
        if (choiceType === 'single') {
          expect(el.serializedValue).to.deep.equal({
            'gender[]': ['female'],
          });
        } else {
          expect(el.serializedValue).to.deep.equal({
            'gender[]': [['female']],
          });
        }
      });
    });
    describe('Modelvalue event propagation', () => {
      it('sends one event for single select choice-groups', async () => {
        const formSpy = sinon.spy();
        const choiceGroupSpy = sinon.spy();
        const formEl = await fixture(html`
        <${tags.fieldset} name="form">
          <${tags.host} name="choice-group">
            <${tags.child} id="option1" .choiceValue="${'1'}" checked></${tags.child}>
            <${tags.child} id="option2" .choiceValue="${'2'}"></${tags.child}>
          </${tags.host}>
        </${tags.fieldset}>
      `);
        const choiceGroupEl =
          /** @type {ChoiceInputGroup} */
          formEl.querySelector('[name=choice-group]');
        if (choiceGroupEl.multipleChoice) {
          return;
        }
        /** @typedef {{ checked: boolean }} checkedInterface */
        const option1El =
          /** @type {HTMLElement & checkedInterface} */
          formEl.querySelector('#option1');
        const option2El =
          /** @type {HTMLElement & checkedInterface} */
          formEl.querySelector('#option2');
        formEl.addEventListener('model-value-changed', formSpy);
        choiceGroupEl?.addEventListener('model-value-changed', choiceGroupSpy);

        // Simulate check
        option2El.checked = true;
        // option2El.dispatchEvent(new Event('model-value-changed', { bubbles: true }));
        option1El.checked = false;
        // option1El.dispatchEvent(new Event('model-value-changed', { bubbles: true }));

        expect(choiceGroupSpy.callCount).to.equal(1);
        const choiceGroupEv = choiceGroupSpy.firstCall.args[0];
        expect(choiceGroupEv.target).to.equal(choiceGroupEl);
        expect(choiceGroupEv.detail.formPath).to.eql([choiceGroupEl]);
        expect(choiceGroupEv.detail.isTriggeredByUser).to.be.false;
        expect(formSpy.callCount).to.equal(1);
        const formEv = formSpy.firstCall.args[0];
        expect(formEv.target).to.equal(formEl);
        expect(formEv.detail.formPath).to.eql([choiceGroupEl, formEl]);
        expect(formEv.detail.isTriggeredByUser).to.be.false;
      });
    });
  });
}
