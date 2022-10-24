import { defineCE, unsafeStatic } from '@open-wc/testing';
import { LitElement, html } from 'lit';
import { OverlayMixin } from '@lion/components/overlays.js';
import { runOverlayMixinSuite } from '../test-suites/OverlayMixin.suite.js';

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
