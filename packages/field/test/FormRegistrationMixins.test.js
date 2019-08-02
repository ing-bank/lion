import { html } from '@open-wc/testing';
import { UpdatingElement, LitElement } from '@lion/core';
import { runRegistrationSuite } from './FormRegistrationMixins.suite.js';
import { LitPatchShadyMixin } from '../src/registration/LitPatchShadyMixin.js';

runRegistrationSuite({
  suffix: 'with HTMLElement',
  baseElement: HTMLElement ,
});

runRegistrationSuite({
  suffix: 'with UpdatingElement',
  baseElement: UpdatingElement,
});

runRegistrationSuite({
  suffix: 'with shadow dom',
  baseElement: class ShadowElement extends LitPatchShadyMixin(LitElement) {
    render() {
      return html`<slot></slot>`;
    }
  },
});

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
