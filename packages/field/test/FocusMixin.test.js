import { expect, fixture, html, defineCE, unsafeStatic, oneEvent } from '@open-wc/testing';

import { LitElement } from '@lion/core';
import { FocusMixin } from '../src/FocusMixin.js';

describe('FocusMixin', () => {
  let tag;

  before(async () => {
    const tagString = defineCE(
      class extends FocusMixin(LitElement) {
        render() {
          return html`
            <slot name="input"></slot>
          `;
        }

        get _inputNode() {
          return this.querySelector('input');
        }
      },
    );

    tag = unsafeStatic(tagString);
  });

  it('focuses/blurs the underlaying native element on .focus()/.blur()', async () => {
    const el = await fixture(html`
      <${tag}><input slot="input"></${tag}>
    `);
    el.focus();
    expect(document.activeElement === el._inputNode).to.be.true;
    el.blur();
    expect(document.activeElement === el._inputNode).to.be.false;
  });

  it('has an attribute focused when focused', async () => {
    const el = await fixture(html`
      <${tag}><input slot="input"></${tag}>
    `);
    el.focus();
    await el.updateComplete;
    expect(el.hasAttribute('focused')).to.be.true;

    el.blur();
    await el.updateComplete;
    expect(el.hasAttribute('focused')).to.be.false;
  });

  it('becomes focused/blurred if the native element gets focused/blurred', async () => {
    const el = await fixture(html`
      <${tag}><input slot="input"></${tag}>
    `);
    expect(el.focused).to.be.false;
    el._inputNode.focus();
    expect(el.focused).to.be.true;
    el._inputNode.blur();
    expect(el.focused).to.be.false;
  });

  it('dispatches [focus, blur] events', async () => {
    const el = await fixture(html`
      <${tag}><input slot="input"></${tag}>
    `);
    setTimeout(() => el.focus());
    const focusEv = await oneEvent(el, 'focus');
    expect(focusEv).to.be.instanceOf(Event);
    expect(focusEv.target).to.equal(el);
    expect(focusEv.bubbles).to.be.false;
    expect(focusEv.composed).to.be.false;

    setTimeout(() => {
      el.focus();
      el.blur();
    });
    const blurEv = await oneEvent(el, 'blur');
    expect(blurEv).to.be.instanceOf(Event);
    expect(blurEv.target).to.equal(el);
    expect(blurEv.bubbles).to.be.false;
    expect(blurEv.composed).to.be.false;
  });

  it('dispatches [focusin, focusout] events with { bubbles: true, composed: true }', async () => {
    const el = await fixture(html`
      <${tag}><input slot="input"></${tag}>
    `);
    setTimeout(() => el.focus());
    const focusinEv = await oneEvent(el, 'focusin');
    expect(focusinEv).to.be.instanceOf(Event);
    expect(focusinEv.target).to.equal(el);
    expect(focusinEv.bubbles).to.be.true;
    expect(focusinEv.composed).to.be.true;

    setTimeout(() => {
      el.focus();
      el.blur();
    });
    const focusoutEv = await oneEvent(el, 'focusout');
    expect(focusoutEv).to.be.instanceOf(Event);
    expect(focusoutEv.target).to.equal(el);
    expect(focusoutEv.bubbles).to.be.true;
    expect(focusoutEv.composed).to.be.true;
  });
});
