/* eslint-env mocha */
/* eslint-disable no-underscore-dangle, no-unused-expressions  */
import { expect, fixture } from '@open-wc/testing';

import { LionLitElement } from '../src/LionLitElement.js';

import { CssClassMixin } from '../src/CssClassMixin.js';

describe('CssClassMixin', () => {
  it('reflects non empty values to given class name', async () => {
    let toClassInstance;

    async function checkProp(newValue, bool) {
      toClassInstance.foo = newValue;
      await toClassInstance.updateComplete;
      expect(toClassInstance.classList.contains('state-foo')).to.equal(bool);
    }

    class ToClassElement extends CssClassMixin(LionLitElement) {
      static get properties() {
        return {
          foo: {
            nonEmptyToClass: 'state-foo',
          },
        };
      }
    }
    customElements.define('to-class-element', ToClassElement);
    toClassInstance = await fixture(`<to-class-element><to-class-element/>`);

    // Init
    expect(toClassInstance.classList.contains('state-foo')).to.equal(false);

    // Boolean
    await checkProp(true, true);
    await checkProp(false, false);

    // Falsy
    await checkProp('foo', true);
    await checkProp('', false);

    // Non empty object
    await checkProp({ foo: 'bar' }, true);
    await checkProp({}, false);

    // Non empty array
    await checkProp(['foo'], true);
    await checkProp([], false);
  });
});
