import { defineCE } from '@open-wc/testing';
import { unsafeStatic } from 'lit/static-html.js';
import { LitElement, html } from '@lion/core';
import { runOverlayMixinSuite } from '../test-suites/OverlayMixin.suite.js';
import { OverlayMixin } from '../src/OverlayMixin.js';

const tagString = defineCE(
  class extends OverlayMixin(LitElement) {
    render() {
      return html`
        <button slot="invoker">invoker button</button>
        <div id="overlay-content-node-wrapper">
          <div slot="content">content of the overlay</div>
        </div>
      `;
    }
  },
);
const tag = unsafeStatic(tagString);

describe('OverlayMixin integrations', () => {
  runOverlayMixinSuite({
    tagString,
    tag,
  });
});
