import { LitElement } from '@lion/core';
import { localizeTearDown } from '@lion/localize/test-helpers.js';
import { defineCE, expect, html, unsafeStatic, fixture } from '@open-wc/testing';
import { LionInput } from '@lion/input';
import '@lion/form-core/lion-field.js';
import { FormGroupMixin } from '../../src/form-group/FormGroupMixin.js';

/**
 * @param {{ tagString?: string, childTagString?:string }} [cfg]
 */
export function runFormGroupMixinInputSuite(cfg = {}) {
  const FormChild = class extends LionInput {
    get slots() {
      return {
        ...super.slots,
        input: () => document.createElement('input'),
      };
    }
  };

  const childTagString = cfg.childTagString || defineCE(FormChild);

  // @ts-expect-error
  const FormGroup = class extends FormGroupMixin(LitElement) {
    constructor() {
      super();
      /** @override from FormRegistrarMixin */
      this._isFormOrFieldset = true;
      this._repropagationRole = 'fieldset'; // configures FormControlMixin
    }
  };

  const tagString = cfg.tagString || defineCE(FormGroup);
  const tag = unsafeStatic(tagString);
  const childTag = unsafeStatic(childTagString);

  beforeEach(() => {
    localizeTearDown();
  });

  describe('FormGroupMixin with LionInput', () => {
    it('serializes undefined values as "" (nb radios/checkboxes are always serialized)', async () => {
      const fieldset = /**  @type {FormGroup} */ (await fixture(html`
        <${tag}>
          <${childTag} name="custom[]"></${childTag}>
          <${childTag} name="custom[]"></${childTag}>
        </${tag}>
      `));
      fieldset.formElements['custom[]'][0].modelValue = 'custom 1';
      fieldset.formElements['custom[]'][1].modelValue = undefined;

      expect(fieldset.serializedValue).to.deep.equal({
        'custom[]': ['custom 1', ''],
      });
    });
  });

  describe('Screen reader relations (aria-describedby) for child inputs and fieldsets', () => {
    /** @type {Function} */
    let childAriaFixture;
    /** @type {Function} */
    let childAriaTest;

    before(() => {
      // Legend:
      // - l1 means level 1 (outer) fieldset
      // - l2 means level 2 (inner) fieldset
      // - g means group: the help-text or feedback belongs to group
      // - f means field(lion-input in fixture below): the help-text or feedback belongs to field
      // - 'a' or 'b' behind 'f' indicate which field in a fieldset is meant (a: first, b: second)

      childAriaFixture = async (
        msgSlotType = 'feedback', // eslint-disable-line no-shadow
      ) => {
        const dom = /**  @type {FormGroup} */ (await fixture(html`
        <${tag} name="l1_g">
          <${childTag} name="l1_fa">
            <div slot="${msgSlotType}" id="msg_l1_fa"></div>
            <!-- field referred by: #msg_l1_fa (local), #msg_l1_g (parent/group) -->
          </${childTag}>

          <${childTag} name="l1_fb">
            <div slot="${msgSlotType}" id="msg_l1_fb"></div>
            <!-- field referred by: #msg_l1_fb (local), #msg_l1_g (parent/group) -->
          </${childTag}>

          <!-- [ INNER FIELDSET ] -->

          <${tag} name="l2_g">
            <${childTag} name="l2_fa">
              <div slot="${msgSlotType}" id="msg_l2_fa"></div>
              <!-- field referred by: #msg_l2_fa (local), #msg_l2_g (parent/group), #msg_l1_g (grandparent/group.group) -->
            </${childTag}>

            <${childTag} name="l2_fb">
              <div slot="${msgSlotType}" id="msg_l2_fb"></div>
              <!-- field referred by: #msg_l2_fb (local), #msg_l2_g (parent/group), #msg_l1_g (grandparent/group.group) -->
            </${childTag}>

            <div slot="${msgSlotType}" id="msg_l2_g"></div>
            <!-- group referred by: #msg_l2_g (local), #msg_l1_g (parent/group)  -->
          </${tag}>

          <!-- [ / INNER FIELDSET ] -->

          <div slot="${msgSlotType}" id="msg_l1_g"></div>
          <!-- group referred by: #msg_l1_g (local) -->
        </${tag}>
      `));
        return dom;
      };

      // eslint-disable-next-line no-shadow
      childAriaTest = (/** @type {FormGroup} */ childAriaFixture) => {
        /* eslint-disable camelcase */
        // Message elements: all elements pointed at by inputs
        const msg_l1_g = /** @type {FormGroup} */ (childAriaFixture.querySelector('#msg_l1_g'));
        const msg_l1_fa = /** @type {FormChild} */ (childAriaFixture.querySelector('#msg_l1_fa'));
        const msg_l1_fb = /** @type {FormChild} */ (childAriaFixture.querySelector('#msg_l1_fb'));
        const msg_l2_g = /** @type {FormGroup} */ (childAriaFixture.querySelector('#msg_l2_g'));
        const msg_l2_fa = /** @type {FormChild} */ (childAriaFixture.querySelector('#msg_l2_fa'));
        const msg_l2_fb = /** @type {FormChild} */ (childAriaFixture.querySelector('#msg_l2_fb'));

        // Field elements: all inputs pointing to message elements
        const input_l1_fa = /** @type {FormChild} */ (childAriaFixture.querySelector(
          'input[name=l1_fa]',
        ));
        const input_l1_fb = /** @type {FormChild} */ (childAriaFixture.querySelector(
          'input[name=l1_fb]',
        ));
        const input_l2_fa = /** @type {FormChild} */ (childAriaFixture.querySelector(
          'input[name=l2_fa]',
        ));
        const input_l2_fb = /** @type {FormChild} */ (childAriaFixture.querySelector(
          'input[name=l2_fb]',
        ));

        /* eslint-enable camelcase */

        // 'L1' fields (inside lion-fieldset[name="l1_g"]) should point to l1(group) msg
        expect(input_l1_fa.getAttribute('aria-describedby')).to.contain(
          msg_l1_g.id,
          'l1 input(a) refers parent/group',
        );
        expect(input_l1_fb.getAttribute('aria-describedby')).to.contain(
          msg_l1_g.id,
          'l1 input(b) refers parent/group',
        );

        // Also check that aria-describedby of the inputs are not overridden (this relation was
        // put there in lion-input(using lion-field)).
        expect(input_l1_fa.getAttribute('aria-describedby')).to.contain(
          msg_l1_fa.id,
          'l1 input(a) refers local field',
        );
        expect(input_l1_fb.getAttribute('aria-describedby')).to.contain(
          msg_l1_fb.id,
          'l1 input(b) refers local field',
        );

        // Also make feedback element point to nested fieldset inputs
        expect(input_l2_fa.getAttribute('aria-describedby')).to.contain(
          msg_l1_g.id,
          'l2 input(a) refers grandparent/group.group',
        );
        expect(input_l2_fb.getAttribute('aria-describedby')).to.contain(
          msg_l1_g.id,
          'l2 input(b) refers grandparent/group.group',
        );

        // Check order: the nearest ('dom wise': so 1. local, 2. parent, 3. grandparent) message
        // should be read first by screen reader
        const dA = /** @type {string} */ (input_l2_fa.getAttribute('aria-describedby'));
        expect(
          // @ts-expect-error
          dA.indexOf(msg_l2_fa.id) < dA.indexOf(msg_l2_g.id) < dA.indexOf(msg_l1_g.id),
        ).to.equal(true, 'order of ids');
        const dB = input_l2_fb.getAttribute('aria-describedby');
        expect(
          // @ts-expect-error
          dB.indexOf(msg_l2_fb.id) < dB.indexOf(msg_l2_g.id) < dB.indexOf(msg_l1_g.id),
        ).to.equal(true, 'order of ids');
      };

      it(`reads feedback message belonging to fieldset when child input is focused
        (via aria-describedby)`, async () => {
        childAriaTest(await childAriaFixture('feedback'));
      });

      it(`reads help-text message belonging to fieldset when child input is focused
        (via aria-describedby)`, async () => {
        childAriaTest(await childAriaFixture('help-text'));
      });
    });
  });
}
