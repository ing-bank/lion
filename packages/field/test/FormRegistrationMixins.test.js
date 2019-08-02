import { expect, fixture, html, defineCE, unsafeStatic } from '@open-wc/testing';
import { LitElement, UpdatingElement, dedupeMixin } from '@lion/core';

import { FormRegisteringMixin } from '../src/FormRegisteringMixin.js';
import { FormRegistrarMixin } from '../src/FormRegistrarMixin.js';


const SDPolyfillFixin = dedupeMixin(superclass =>
  class SDPolyfillFixin extends superclass {

    /**
     * @override
     */
    initialize() {
      // we must make sure we bypass initialize of LitElement, but call the one of UpdatingElement
      const superInitialize = UpdatingElement.prototype.initialize.bind(this);
      superInitialize();

      // Before, we created the shadowRoot here, but this causes bugs until
      // https://github.com/webcomponents/polyfills/issues/95 is solved.
      // Also see: https://github.com/Polymer/lit-element/issues/658
      // As a temp workaround, we adopt the suggested change of sorvell:
      // delay the creation of the shadowRoot (see __createRenderRootAndAdoptStyles())
    }

    __createRenderRootAndAdoptStyles() {
      this.renderRoot = this.createRenderRoot();

      // Note, if renderRoot is not a shadowRoot, styles would/could apply to the
      // element's getRootNode(). While this could be done, we're choosing not to
      // support this now since it would require different logic around de-duping.
      if (window.ShadowRoot && this.renderRoot instanceof window.ShadowRoot) {
        this.adoptStyles();
      }

      this.__hasCreatedRenderRoot = true;
    }

    /**
     * @override
     */
    update(changedProperties) {
      if(!this.__hasCreatedRenderRoot) {
        this.__createRenderRootAndAdoptStyles();
      }
      super.update(changedProperties);
    }
  }
);
// eslint-disable-next-line no-shadow
const RegistrationParentMixin = dedupeMixin(superclass =>
  class RegistrationParentMixin extends superclass {
    constructor() {
      super();
      this.formElements = [];
      this.addEventListener('form-element-register', ({ target }) => this._addChild(target));
      this.registrationReady = new Promise(resolve => {
        this.__resolveRegistrationReady = resolve;
      });
    }

    _addChild(addEl) {
      this.formElements.push(addEl);
      addEl.__parentFormGroup = this; // eslint-disable-line no-param-reassign
    }

    _removeChild(removeEl) {
      const index = this.formElements.indexOf(removeEl);
      if (index > -1) {
        this.formElements.splice(index, 1);
      }
    }

    connectedCallback() {
      if(super.connectedCallback) {
        super.connectedCallback();
      }
      setTimeout(() => {
        this.__resolveRegistrationReady();
      });
    }
  }
);

// eslint-disable-next-line no-shadow
const RegistrationChildMixin = dedupeMixin(superclass =>
  class RegistrationChildMixin extends superclass {
    connectedCallback() {
      if (super.connectedCallback) {
        super.connectedCallback();
      }
      console.log('connected child');

      this.dispatchEvent(new CustomEvent('form-element-register', { bubbles: true, composed: true }));
    }

    disconnectedCallback() {
      if (super.disconnectedCallback) {
        super.disconnectedCallback();
      }
      if (this.__parentFormGroup) {
        this.__parentFormGroup._removeChild(this);
      }
    }
  }
);

function printSuffix(suffix) {
  return suffix ? ` (${suffix})` : '';
}

export const runRegistrationSuite = customConfig => {
  const cfg = {
    baseElement: HTMLElement,
    suffix: null,
    parentTagString: null,
    childTagString: null,
    parentMixin: RegistrationParentMixin,
    childMixin: RegistrationChildMixin,
    ...customConfig,
  };

  let parentTag;
  let childTag;

  describe.only(`FormRegistrationMixins${printSuffix(cfg.suffix)}`, () => {
    before(async () => {
      if (!cfg.parentTagString) {
        cfg.parentTagString = defineCE(class extends cfg.parentMixin(cfg.baseElement) {});
      }
      if (!cfg.childTagString) {
        cfg.childTagString = defineCE(class extends cfg.childMixin(cfg.baseElement) {});
      }

      parentTag = unsafeStatic(cfg.parentTagString);
      childTag = unsafeStatic(cfg.childTagString);
    });

    it('can register a formElement', async () => {
      const el = await fixture(html`
        <${parentTag}>
          <${childTag}></${childTag}>
        </${parentTag}>
      `);
      await el.registrationReady;
      expect(el.formElements.length).to.equal(1);
    });

    it('supports nested registrar', async () => {
      const el = await fixture(html`
        <${parentTag}>
          <${parentTag}>
            <${childTag}></${childTag}>
          </${parentTag}>
        </${parentTag}>
      `);
      await el.registrationReady;
      expect(el.formElements.length).to.equal(1);
      expect(el.querySelector(cfg.parentTagString).formElements.length).to.equal(1);
    });

    it('works for component that have a delayed render', async () => {
      const tagWrapperString = defineCE(
        class extends cfg.parentMixin(SDPolyfillFixin(LitElement)) {
          async performUpdate() {
            await new Promise(resolve => setTimeout(() => resolve(), 10));
            await super.performUpdate();
          }

          render() {
            return html`
              <slot></slot>
            `;
          }
        },
      );
      const tagWrapper = unsafeStatic(tagWrapperString);
      // const registerSpy = sinon.spy();
      const el = await fixture(html`
        <${tagWrapper}>
          <${childTag}></${childTag}>
        </${tagWrapper}>
      `);
      await el.registrationReady;
      expect(el.formElements.length).to.equal(1);
    });

    // TODO: create registration hooks so this logic can be put along reset logic
    it.skip('requests update of the resetModelValue function of its parent formGroup', async () => {
      const ParentFormGroupClass = class extends RegistrationParentMixin(LitElement) {
        _updateResetModelValue() {
          this.resetModelValue = 'foo';
        }
      };
      const ChildFormGroupClass = class extends RegistrationChildMixin(LitElement) {
        constructor() {
          super();
          this.__parentFormGroup = this.parentNode;
        }
      };

      const parentClass = defineCE(ParentFormGroupClass);
      const formGroup = unsafeStatic(parentClass);
      const childClass = defineCE(ChildFormGroupClass);
      const childFormGroup = unsafeStatic(childClass);
      const parentFormEl = await fixture(html`
        <${formGroup}><${childFormGroup} id="child" name="child[]"></${childFormGroup}></${formGroup}>
      `);
      expect(parentFormEl.resetModelValue).to.equal('foo');
    });

    it('can dynamically add/remove elements', async () => {
      const el = await fixture(html`
        <${parentTag}>
          <${childTag}></${childTag}>
        </${parentTag}>
      `);
      const newField = await fixture(html`
        <${childTag}></${childTag}>
      `);

      expect(el.formElements.length).to.equal(1);

      el.appendChild(newField);
      expect(el.formElements.length).to.equal(2);

      el.removeChild(newField);
      expect(el.formElements.length).to.equal(1);
    });
  });
};

runRegistrationSuite({ baseElement: HTMLElement });

runRegistrationSuite({ suffix: 'with UpdatingElement',  baseElement: UpdatingElement });

runRegistrationSuite({ suffix: 'with shadow dom', baseElement: class ShadowElement extends SDPolyfillFixin(LitElement) {
  render() {
    return html`<slot></slot>`;
  }
}});

// runRegistrationSuite({
//   suffix: 'with Registrar and UpdatingElement',
//   baseElement: UpdatingElement,
//   parentMixin: FormRegistrarMixin,
//   childMixin: FormRegisteringMixin,
// });

// runRegistrationSuite({
//   suffix: 'with Registrar and shadow dom',
//   baseElement: class ShadowElement extends LitElement {
//     render() {
//       return html`<slot></slot>`;
//     }
//   },
//   parentMixin: FormRegistrarMixin,
//   childMixin: FormRegisteringMixin,
// });
