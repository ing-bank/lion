import { LitElement } from 'lit';
import { expect, html, fixture as _fixture, unsafeStatic } from '@open-wc/testing';
import sinon from 'sinon';
import { MultiLevelListMixin } from '../src/MultiLevelListMixin.js';
import { InteractiveListMixin } from '../src/InteractiveListMixin.js';
import { mimicKeyPress } from '../test-helpers/mimicKeyPress.js';
import { resolveSuiteTag } from '../../core/test-helpers/resolveSuiteTag.js';

/**
 * MultiLevelListMixin expects an openable host (DisclosureMixin or OverlayMixin): it calls
 * `close()` when a sub level is left via the keyboard. This plain host provides a no-op.
 */
class MultiLevelListClass extends MultiLevelListMixin(LitElement) {
  // eslint-disable-next-line class-methods-use-this
  close() {}
}
class InteractiveListClass extends InteractiveListMixin(LitElement) {}

/**
 * @typedef {import('../src/LionMenu.js').LionMenu} LionMenu
 * @typedef {import('lit').TemplateResult} TemplateResult
 *
 */

const fixture = /** @type {(arg: TemplateResult) => Promise<LionMenu>} */ (_fixture);

/**
 * @typedef {import('@lion/ui/types/test-suites.js').SuiteElement} SuiteElement
 * @param {import('@lion/ui/types/test-suites.js').SuiteConfig<{host: SuiteElement; 'interactive-list': SuiteElement}>} [customConfig]
 */
export function runMultiLevelListMixinSuite({
  classes = {},
  tagString: legacyTagString,
  tagChildString: legacyChildTagString,
} = {}) {
  const tagString = resolveSuiteTag(classes?.host, legacyTagString, MultiLevelListClass);
  const tagChildString = resolveSuiteTag(
    classes?.['interactive-list'],
    legacyChildTagString,
    InteractiveListClass,
  );
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

    it('inherits checked state from children when checked via href match', async () => {
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
      if (el.role === 'list') {
        const item0 = el.listItems[0];
        expect(item0.getAttribute('aria-current')).to.equal('true');
      }
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

          // @ts-expect-error [allow-protected-in-tests]
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

          // @ts-expect-error [allow-protected-in-tests]
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
                    <div>Sub item 0</div>
                  </div>
                  <div role="listitem" id="item-0-1">
                    <div>Sub item 1</div>
                  </div>
                </${tagChild}>
              </div>
              <div role="listitem" id="item-1">
                <div>Item 1</div>
              </div>
            </${tag}>
          `);

          // @ts-expect-error [allow-protected-in-tests]
          const { _listNode } = el;

          // Normalize
          el.activeIndex = 0;
          const clickSpy = sinon.spy(el.activeItem, 'click');

          mimicKeyPress(_listNode, 'Enter');
          expect(clickSpy).to.have.been.calledOnce;
        });

        it('navigates between L2 items on [ArrowDown] [ArrowUp] keys', async () => {
          const el = await fixture(html`
            <${tag} axis="inline">
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
          // @ts-expect-error [allow-protected-in-tests]
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

        /**
         * @param {{ axis?: 'block'|'inline', subAxis?: 'block'|'inline' }} [options]
         */
        const twoLevelFixture = ({ axis = 'block', subAxis = 'block' } = {}) =>
          fixture(html`
            <${tag} axis="${axis}">
              <div role="listitem" id="item-0">
                <button data-invoker>Item 0</button>
                <${tag} axis="${subAxis}">
                  <div role="listitem" id="item-0-0">
                    <div>Sub item 0</div>
                  </div>
                  <div role="listitem" id="item-0-1">
                    <div>Sub item 1</div>
                  </div>
                </${tag}>
              </div>
              <div role="listitem" id="item-1">
                <div>Item 1</div>
              </div>
            </${tag}>
          `);

        /** @param {LionMenu} el */
        const getSubList = el => /** @type {LionMenu} */ (el.querySelector(tagString));

        it('opens the subList of the active item on [ArrowRight] when axis is "block"', async () => {
          const el = await twoLevelFixture();
          // @ts-expect-error [allow-protected-in-tests]
          const { _listNode } = el;
          // @ts-ignore - parentList is set by MultiLevelListMixin
          expect(getSubList(el).parentList).to.equal(el);

          el.activeIndex = 0;
          const clickSpy = sinon.spy(el.activeItem, 'click');
          mimicKeyPress(_listNode, 'ArrowRight');
          expect(clickSpy).to.have.been.calledOnce;

          // An item without subList is not invoked
          el.activeIndex = 1;
          const clickSpyNoSubList = sinon.spy(el.activeItem, 'click');
          mimicKeyPress(_listNode, 'ArrowRight');
          expect(clickSpyNoSubList).to.not.have.been.called;
        });

        it('opens the subList of the active item on [ArrowDown] when axis is "inline"', async () => {
          const el = await twoLevelFixture({ axis: 'inline' });
          // @ts-expect-error [allow-protected-in-tests]
          const { _listNode } = el;
          el.activeIndex = 0;
          const clickSpy = sinon.spy(el.activeItem, 'click');
          mimicKeyPress(_listNode, 'ArrowDown');
          expect(clickSpy).to.have.been.calledOnce;
        });

        it('closes L2 and returns to its parent on [ArrowLeft] when L2 axis is "block"', async () => {
          const el = await twoLevelFixture();
          const subList = getSubList(el);
          // @ts-expect-error [allow-protected-in-tests]
          const { _listNode } = subList;
          subList.activeIndex = 0;
          const closeSpy = sinon.spy(subList, 'close');
          const parentCloseSpy = sinon.spy(el, 'close');

          mimicKeyPress(_listNode, 'ArrowLeft');
          expect(closeSpy).to.have.been.calledOnce;
          expect(parentCloseSpy).to.not.have.been.called;

          // L1 has no parent to return to
          el.activeIndex = 0;
          // @ts-expect-error [allow-protected-in-tests]
          mimicKeyPress(el._listNode, 'ArrowLeft');
          expect(parentCloseSpy).to.not.have.been.called;
        });

        it('closes L2 and returns to its parent on [ArrowUp] when L2 axis is "inline"', async () => {
          const el = await twoLevelFixture({ subAxis: 'inline' });
          const subList = getSubList(el);
          // @ts-expect-error [allow-protected-in-tests]
          const { _listNode } = subList;
          subList.activeIndex = 0;
          const closeSpy = sinon.spy(subList, 'close');

          mimicKeyPress(_listNode, 'ArrowUp');
          expect(closeSpy).to.have.been.calledOnce;
        });

        it('stops propagation of [Escape] in L2, so the parent level stays open', async () => {
          const el = await twoLevelFixture();
          const subList = getSubList(el);
          subList.activeIndex = 0;
          const escInL2 = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
          const stopSpyL2 = sinon.spy(escInL2, 'stopPropagation');
          // @ts-expect-error [allow-protected-in-tests]
          subList._listNode.dispatchEvent(escInL2);
          expect(stopSpyL2).to.have.been.called;

          // In L1, Escape is left to the host (for instance to close an overlay)
          el.activeIndex = 1;
          const escInL1 = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
          const stopSpyL1 = sinon.spy(escInL1, 'stopPropagation');
          // @ts-expect-error [allow-protected-in-tests]
          el._listNode.dispatchEvent(escInL1);
          expect(stopSpyL1).to.not.have.been.called;
        });
      });
    });
  });
}
