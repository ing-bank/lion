import { LitElement } from 'lit';
import { expect, html, fixture, unsafeStatic, defineCE } from '@open-wc/testing';
import { InteractiveListMixin } from '../src/InteractiveListMixin.js';

class InteractiveListClass extends InteractiveListMixin(LitElement) {}

/**
 * @typedef {import('../types/InteractiveListMixinTypes.js').InteractiveListItemRole} InteractiveListItemRole
 */

/** @type {InteractiveListItemRole[]} */
const supportedRoles = [
  'menuitem',
  'menuitemcheckbox',
  'menuitemradio',
  'option',
  'treeitem',
  'radio',
  'checkbox',
];

/**
 * @typedef {Object} TestConfig
 * @property {string} tagString
 */

/**
 * @param {TestConfig} [customConfig]
 */
export function runInteractiveListMixinSuite(customConfig) {
  const cfg = {
    tagString: customConfig?.tagString || defineCE(InteractiveListClass),
  };

  const { tagString } = cfg;
  const tag = unsafeStatic(tagString);

  describe('InteractiveListMixin', () => {
    it(`supports items with role="${supportedRoles.join('|')}"`, async () => {
      const el = await fixture(html`
        <${tag} name="foo">
          ${supportedRoles.map(role => html` <div role="${role}"></div> `)}
        </${tag}>
      `);
      // @ts-ignore - test element with InteractiveListMixin properties
      expect(el.listItems.length).to.equal(supportedRoles.length);
      supportedRoles.forEach((role, i) => {
        // @ts-ignore - test element with InteractiveListMixin properties
        expect(el.listItems[i].getAttribute('role')).to.equal(role);
      });
    });

    it('moves elements to a private [slot=list] for optimal DX and a11y', async () => {
      const el = await fixture(html`
        <${tag} name="foo">
          <div role="menuitem" id="item1">Item 1</div>
          <div role="menuitem" id="item2">Item 2</div>
        </${tag}>
      `);
      // @ts-ignore - test element with InteractiveListMixin properties
      const listSlotNode = Array.from(el.children).find(c => c.slot === 'list');
      // @ts-ignore - accessing children property
      const listItemEls = Array.from(listSlotNode.children);
      // @ts-ignore - test element with InteractiveListMixin properties
      expect(listItemEls.includes(el.listItems[0])).to.be.true;
      // @ts-ignore - test element with InteractiveListMixin properties
      expect(listItemEls.includes(el.listItems[1])).to.be.true;
    });

    describe('Active mode', async () => {
      // TODO: make public prop?
      it('supports "activedescendant" pattern', async () => {
        const el = await fixture(html`
        <${tag} name="foo" ._activeMode="${'activedescendant'}">
          <div role="menuitem" id="item1">Item 1</div>
          <div role="menuitem" id="item2">Item 2</div>
        </${tag}>
      `);
        // @ts-ignore - test element with InteractiveListMixin properties
        el.checkedIndex = 0;
        // @ts-ignore - test element with InteractiveListMixin properties
        const listSlotNode = Array.from(el.children).find(c => c.slot === 'list');

        // @ts-ignore - test element with InteractiveListMixin properties
        expect(el.listItems[0].hasAttribute('id')).to.be.true;
        // @ts-ignore - test element with InteractiveListMixin properties
        expect(el.listItems[1].hasAttribute('id')).to.be.true;
        expect(listSlotNode?.hasAttribute('aria-activedescendant')).to.be.false;
        // @ts-ignore - test element with InteractiveListMixin properties
        el.activeIndex = 1;
        expect(listSlotNode?.hasAttribute('aria-activedescendant')).to.be.true;
      });

      it('supports "roving-tabindex" pattern', async () => {
        const el = await fixture(html`
          <${tag} name="foo" ._activeMode="${'roving-tabindex'}">
            <div role="menuitem" id="item1">Item 1</div>
            <div role="menuitem" id="item2">Item 2</div>
          </${tag}>
        `);

        // @ts-ignore - test element with InteractiveListMixin properties
        el.activeIndex = 0;
        // @ts-ignore - test element with InteractiveListMixin properties
        expect(el.listItems[0].getAttribute('tabindex')).to.equal('0');
        // @ts-ignore - test element with InteractiveListMixin properties
        expect(el.listItems[1].getAttribute('tabindex')).to.equal('-1');

        // @ts-ignore - test element with InteractiveListMixin properties
        el.activeIndex = 1;
        // @ts-ignore - test element with InteractiveListMixin properties
        expect(el.listItems[0].getAttribute('tabindex')).to.equal('-1');
        // @ts-ignore - test element with InteractiveListMixin properties
        expect(el.listItems[1].getAttribute('tabindex')).to.equal('0');

        // @ts-ignore - test element with InteractiveListMixin properties
        el.activeIndex = 1;
        // @ts-ignore - test element with InteractiveListMixin properties
        expect(document.activeElement).to.equal(el.listItems[1]);
      });

      it('supports "tabbable-disclosure" pattern', async () => {
        const el = await fixture(html`
        <${tag} name="foo" ._activeMode="${'tabbable-disclosure'}">
          <div role="menuitem" id="item1">Item 1</div>
          <div role="menuitem" id="item2">Item 2</div>
        </${tag}>
      `);
      });
    });

    // Copy tests from ListboxMixin. Later, make this mixin a fundament of the ListboxMixin

    // orientation
    // multipleChoice
    // selectionFollowsFocus
    // rotateKeyboardNavigation
    // noPreselect
    // _scrollTargetNode

    describe('Widget extensions', () => {
      it('can be extended to [role=listbox]', async () => {});
      it('can be extended to [role=menu]', async () => {});
      it('can be extended to [role=menubar]', async () => {});
      it('can be extended to [role=toolbar]', async () => {});
      it('can be extended to [role=tree]', async () => {});
      // TODO: add tablist as well, what about grid and treegrid?
    });

    describe('Overflow handling', () => {
      function getItems(el) {
        const moreButtonList = el.getMoreButtonMenu();
        // TODO: rename _listItems to _interactiveItems
        // N.B. In a generic list, we do not always have role="listitem", so we cannot rely on that.
        // Find a generic marker
        const itemsAfterMore = moreButtonList.querySelectorAll(':scope > [role="listitem"]');
        const itemsBeforeMore = el._listNode.querySelectorAll(':scope > [role="listitem"]');
      }

      function getItemsBeforeMoreButton(el) {
        const moreButtonList = el.getMoreButtonMenu();
        const moreButtonRect = moreButton.getBoundingClientRect();
      }

      // TODO: rename itemWrap to overflowMode ('scroll','more-button','scroll-buttons')?
      it('supports overflow handling via the "overflow-mode" property', async () => {
        const el = await fixture(html`
        <${tag} name="foo" ._activeMode="${'tabbable-disclosure'}" .itemWrap="${true}" style="width: 100px;">
          <div role="listitem" id="item1"><a style="width: 10px;">Item 1</a></div>
          <div role="listitem" id="item2"><a style="width: 10px;">Item 2</a></div>
          <div role="listitem" id="item3"><a style="width: 10px;">Item 3</a></div>
          <div role="listitem" id="item4"><a style="width: 10px;">Item 4</a></div>
          <div role="listitem" id="item1"><a style="width: 10px;">Item 5</a></div>
          <div role="listitem" id="item2"><a style="width: 10px;">Item 6</a></div>
          <div role="listitem" id="item3"><a style="width: 10px;">Item 7</a></div>
          <div role="listitem" id="item4"><a style="width: 10px;">Item 8</a></div>
          <button style="width: 5px;" slot="more-button">More</button>
        </${tag}>
      `);
        // Initially, our parent is 100px wide, so we have room for all items.
        // expect
        // Now we shrink to 50px, leaving room for 4 items and the more button.
        el.style.width = '50px';
      });

      it('creates a wrapping structure around more button', async () => {});

      describe('Rerendering items', () => {
        it('rerenders items when the "overflow-mode" property changes', async () => {});
      });
    });
  });
}
