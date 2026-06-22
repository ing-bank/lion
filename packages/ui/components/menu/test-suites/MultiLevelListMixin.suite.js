import { LitElement } from 'lit';
import { expect, html, fixture as _fixture, unsafeStatic, defineCE } from '@open-wc/testing';
import sinon from 'sinon';
import { MultiLevelListMixin } from '../src/MultiLevelListMixin.js';
import { InteractiveListMixin } from '../src/InteractiveListMixin.js';
import { mimicKeyPress } from '../test-helpers/mimicKeyPress.js';

class MultiLevelListClass extends MultiLevelListMixin(LitElement) {}
class InteractiveListClass extends InteractiveListMixin(LitElement) {}

/**
 * @typedef {import('../src/LionMenu.js').LionMenu} LionMenu
 * @typedef {import('lit').TemplateResult} TemplateResult
 *
 * @typedef {Object} TestConfig
 * @property {string} tagString
 * @property {string} tagChildString
 */

const fixture = /** @type {(arg: TemplateResult) => Promise<LionMenu>} */ (_fixture);

/**
 * @param {TestConfig} [customConfig]
 */
export function runMultiLevelListMixinSuite(customConfig) {
  const cfg = {
    tagString: customConfig?.tagString || defineCE(MultiLevelListClass),
    tagChildString: customConfig?.tagChildString || defineCE(InteractiveListClass),
  };

  const { tagString, tagChildString } = cfg;
  const tag = unsafeStatic(tagString);
  const tagChild = unsafeStatic(tagChildString);

  describe('MultiLevelListMixin', () => {
    it('has sublists', async () => {
      const el = await fixture(html`
        <${tag}>
          <div role="listitem" id="item-0">
            <button data-invoker>Item 0</button>
            <${tagChild}>
              <div role="listitem" id="item-0-0">
                <a href="#foo">Sub item 0</a>
              </div>
              <div role="listitem" id="item-0-1">
                <a href="#bar">Sub item 1</a>
              </div>
            </${tagChild}>
          </div>
          <div role="listitem" id="item-1">
            <a href="#baz">Item 1</a>
          </div>
        </${tag}>
      `);
      const subList = /** @type {MultiLevelListClass} */ (el.querySelector(tagChildString));
      expect(subList).to.exist;
      expect(subList.level).to.equal(2);
    });

    it('inherits checked state from children', async () => {
      const el = await fixture(html`
        <${tag}>
          <div role="listitem" id="item-0">
            <button data-invoker>Item 0</button>
            <${tagChild}>
              <div role="listitem" id="item-0-0">
                <a href="${window.location.href}">Sub item 0</a>
              </div>
              <div role="listitem" id="item-0-1">
                <a href="#bar">Sub item 1</a>
              </div>
            </${tagChild}>
          </div>
          <div role="listitem" id="item-1">
            <a href="#baz">Item 1</a>
          </div>
        </${tag}>
      `);
      const item0 = el.listItems[0];
      expect(item0.getAttribute('aria-current')).to.equal('true');
    });

    describe('Interactions', () => {
      describe('Keyboard navigation', () => {
        it('navigates between L1 items on [ArrowDown] [ArrowUp] keys', async () => {
          const el = await fixture(html`
            <${tag}>
              <div role="listitem" id="item-0">
                <button data-invoker>Item 0</button>
                <${tagChild}>
                  <div role="listitem" id="item-0-0">
                    <a href="${window.location.href}">Sub item 0</a>
                  </div>
                  <div role="listitem" id="item-0-1">
                    <a href="#bar">Sub item 1</a>
                  </div>
                </${tagChild}>
              </div>
              <div role="listitem" id="item-1">
                <a href="#baz">Item 1</a>
              </div>
              <div role="listitem" id="item-2">
                <a href="#foobar">Item 2</a>
              </div>
            </${tag}>
          `);

          const { _listNode } = el;

          // Normalize
          el.activeIndex = 0;

          mimicKeyPress(_listNode, 'ArrowDown');
          expect(el.activeIndex).to.be.equal(1);
          mimicKeyPress(_listNode, 'ArrowDown');
          expect(el.activeIndex).to.be.equal(2);
          mimicKeyPress(_listNode, 'ArrowUp');
          expect(el.activeIndex).to.be.equal(1);
        });

        it('stops navigation by default at end of option list', async () => {
          const el = await fixture(html`
            <${tag}>
              <div role="listitem" id="item-0">
                <button data-invoker>Item 0</button>
                <${tagChild}>
                  <div role="listitem" id="item-0-0">
                    <a href="${window.location.href}">Sub item 0</a>
                  </div>
                  <div role="listitem" id="item-0-1">
                    <a href="#bar">Sub item 1</a>
                  </div>
                </${tagChild}>
              </div>
              <div role="listitem" id="item-1">
                <a href="#baz">Item 1</a>
              </div>
              <div role="listitem" id="item-2">
                <a href="#foobar">Item 2</a>
              </div>
            </${tag}>
          `);

          const { _listNode } = el;

          // Normalize
          el.activeIndex = 0;

          mimicKeyPress(_listNode, 'ArrowUp');
          expect(el.activeIndex).to.be.equal(0);

          el.activeIndex = 2;
          mimicKeyPress(_listNode, 'ArrowDown');
          expect(el.activeIndex).to.be.equal(2);
        });

        it('opens subList on [Enter] key press', async () => {
          const el = await fixture(html`
            <${tag}>
              <div role="listitem" id="item-0">
                <button data-invoker>Item 0</button>
                <${tagChild}>
                  <div role="listitem" id="item-0-0">
                    <a href="${window.location.href}">Sub item 0</a>
                  </div>
                  <div role="listitem" id="item-0-1">
                    <a href="#bar">Sub item 1</a>
                  </div>
                </${tagChild}>
              </div>
              <div role="listitem" id="item-1">
                <a href="#baz">Item 1</a>
              </div>
            </${tag}>
          `);

          const { _listNode } = el;

          // Normalize
          el.activeIndex = 0;

          expect(el.listItems[0].getAttribute('aria-expanded')).to.be.equal('false');
          mimicKeyPress(_listNode, 'Enter');
          expect(el.listItems[0].getAttribute('aria-expanded')).to.be.equal('true');
          // setting "opened" state on subList is done in OverlayMixin
        });

        it('navigates between L2 items on [ArrowDown] [ArrowUp] keys', async () => {
          const el = await fixture(html`
            <${tag} orientation="horizontal">
              <div role="listitem" id="item-0">
                <button data-invoker>Item 0</button>
                <${tagChild}>
                  <div role="listitem" id="item-0-0">
                    <a href="#foo">Sub item 0</a>
                  </div>
                  <div role="listitem" id="item-0-1">
                    <a href="#bar">Sub item 1</a>
                  </div>
                  <div role="listitem" id="item-0-2">
                    <a href="#baz">Sub item 2</a>
                  </div>
                </${tagChild}>
              </div>
              <div role="listitem" id="item-1">
                <a href="#foobar">Item 1</a>
              </div>
            </${tag}>
          `);

          const subList = /** @type {MultiLevelListClass} */ (el.querySelector(tagChildString));
          const { _listNode } = subList;

          // Normalize
          subList.activeIndex = 0;

          mimicKeyPress(_listNode, 'ArrowDown');
          expect(subList.activeIndex).to.be.equal(1);
          mimicKeyPress(_listNode, 'ArrowDown');
          expect(subList.activeIndex).to.be.equal(2);
          mimicKeyPress(_listNode, 'ArrowUp');
          expect(subList.activeIndex).to.be.equal(1);
        });

        it('close method gets called on [ArrowUp] key when in L2 and horizontal', async () => {
          const el = await fixture(html`
            <${tag}>
              <div role="listitem" id="item-0">
                <button data-invoker>Item 0</button>
                <${tagChild} bar>
                  <div role="listitem" id="item-0-0">
                    <a href="#foo">Sub item 0</a>
                  </div>
                  <div role="listitem" id="item-0-1">
                    <a href="#bar">Sub item 1</a>
                  </div>
                  <div role="listitem" id="item-0-2">
                    <a href="#baz">Sub item 2</a>
                  </div>
                </${tagChild}>
              </div>
              <div role="listitem" id="item-1">
                <a href="#foobar">Item 1</a>
              </div>
            </${tag}>
          `);
          const subList = /** @type {MultiLevelListClass} */ (el.querySelector(tagChildString));
          const closeSpy = sinon.spy(subList, 'close');
          const { _listNode } = subList;

          // Normalize
          subList.activeIndex = 0;

          mimicKeyPress(_listNode, 'ArrowUp');

          expect(closeSpy).to.have.been.calledOnce;
        });

        it('close method gets called on [ArrowLeft] key when in L2 and vertical', async () => {
          const el = await fixture(html`
            <${tag}>
              <div role="listitem" id="item-0">
                <button data-invoker>Item 0</button>
                <${tagChild} orientation="vertical">
                  <div role="listitem" id="item-0-0">
                    <a href="#foo">Sub item 0</a>
                  </div>
                  <div role="listitem" id="item-0-1">
                    <a href="#bar">Sub item 1</a>
                  </div>
                  <div role="listitem" id="item-0-2">
                    <a href="#baz">Sub item 2</a>
                  </div>
                </${tagChild}>
              </div>
              <div role="listitem" id="item-1">
                <a href="#foobar">Item 1</a>
              </div>
            </${tag}>
          `);
          const subList = /** @type {MultiLevelListClass} */ (el.querySelector(tagChildString));
          const closeSpy = sinon.spy(subList, 'close');
          const { _listNode } = subList;

          // Normalize
          subList.activeIndex = 0;

          mimicKeyPress(_listNode, 'ArrowLeft');
          expect(closeSpy).to.have.been.calledOnce;
        });
      });
    });
  });
}
