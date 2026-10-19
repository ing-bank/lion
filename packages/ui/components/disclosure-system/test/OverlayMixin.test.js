import { defineCE, unsafeStatic } from '@open-wc/testing';
import { LitElement, html } from 'lit';
import { OverlayMixin } from '@lion/ui/overlays.js';
import { runOverlayMixinSuite } from '../test-suites/OverlayMixin.suite.js';

const tagString = defineCE(
  class extends OverlayMixin(LitElement) {
    render() {
      return html`
        <slot name="invoker"></slot>
        <div id="overlay-content-node-wrapper">
          <slot name="content"></slot>
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
