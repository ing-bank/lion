import { LitElement, UpdatingElement } from '@lion/core';
import { html } from '@open-wc/testing';
import { runRegistrationSuite } from '../test-suites/FormRegistrationMixins.suite.js';

runRegistrationSuite({
  suffix: 'with UpdatingElement',
  baseElement: UpdatingElement,
});

runRegistrationSuite({
  suffix: 'with LitElement, using shadow dom',
  baseElement: class ShadowElement extends LitElement {
    render() {
      return html`<slot></slot>`;
    }
  },
});
