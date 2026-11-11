import { defineCE, expect, unsafeStatic } from '@open-wc/testing';
import { LitElement, html } from 'lit';
import { OverlayMixin } from '@lion/ui/overlays.js';
import { _addOverlayMixinPostProcessor } from '../src/OverlayMixin.js';
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

describe('_addOverlayMixinPostProcessor', () => {
  it('runs registered post processors on every class the mixin creates afterwards', () => {
    /** @type {any[]} */
    const processed = [];
    let active = true;
    _addOverlayMixinPostProcessor(mixedClass => {
      // processors cannot be unregistered: make this one inert after the test
      if (active) processed.push(mixedClass);
    });
    class Base extends LitElement {}
    const Mixed = OverlayMixin(Base);
    active = false;
    expect(processed.length).to.equal(1);
    expect(processed[0]).to.equal(Mixed);
  });
});
