import { expect, fixture, defineCE } from '@open-wc/testing';
import { html, unsafeStatic } from 'lit/static-html.js';
import { LionField } from '@lion/form-core';
import { getFormControlMembers } from '@lion/form-core/test-helpers';
import { Required } from '../../src/validate/validators/Required.js';

/**
 * @typedef {import('../../types/FormControlMixinTypes.js').FormControlHost} FormControlHost
 * @typedef {import('../../types/FormControlMixinTypes.js').HTMLElementWithValue} HTMLElementWithValue
 */

/** @type {HTMLElementWithValue} */
let inputNodeTag;
class RequiredElement extends LionField {
  connectedCallback() {
    const inputNode = document.createElement('input');
    inputNode.slot = 'input';
    this.appendChild(inputNode);
    super.connectedCallback();
  }

  /** @protected */
  get _inputNode() {
    return inputNodeTag || super._inputNode;
  }
}

const tagString = defineCE(RequiredElement);
const tag = unsafeStatic(tagString);

describe('Required validation', async () => {
  const validator = new Required();

  it('get aria-required attribute if element is part of the right tag names', async () => {
    const el = /** @type {FormControlHost & HTMLElement} */ (
      await fixture(html`<${tag}></${tag}>`)
    );

    Required._compatibleTags.forEach(tagName => {
      inputNodeTag = /** @type {HTMLElementWithValue} */ (document.createElement(tagName));

      validator.onFormControlConnect(el);
      const { _inputNode } = getFormControlMembers(el);
      expect(_inputNode).to.have.attribute('aria-required', 'true');
    });

    // When incompatible tags are used, aria-required will not be added

    // @ts-ignore
    inputNodeTag = /** @type {HTMLDivElementWithValue} */ (document.createElement('div'));

    validator.onFormControlConnect(el);
    const { _inputNode } = getFormControlMembers(el);
    expect(_inputNode).to.not.have.attribute('aria-required');
  });
  it('get aria-required attribute if element is part of the right roles', async () => {
    const el = /** @type {FormControlHost & HTMLElement} */ (
      await fixture(html`<${tag}></${tag}>`)
    );

    Required._compatibleRoles.forEach(role => {
      // @ts-ignore
      inputNodeTag = /** @type {HTMLElementWithValue} */ (document.createElement('div'));
      inputNodeTag.setAttribute('role', role);

      validator.onFormControlConnect(el);
      const { _inputNode } = getFormControlMembers(el);
      expect(_inputNode).to.have.attribute('aria-required', 'true');
    });

    // When incompatible roles are used, aria-required will not be added

    // @ts-ignore
    inputNodeTag = /** @type {HTMLElementWithValue} */ (document.createElement('div'));
    inputNodeTag.setAttribute('role', 'group');

    validator.onFormControlConnect(el);
    const { _inputNode } = getFormControlMembers(el);
    expect(_inputNode).to.not.have.attribute('aria-required');
  });
});
