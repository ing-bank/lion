import { LitElement } from 'lit';
import { expect, html, fixture, unsafeStatic, defineCE } from '@open-wc/testing';
import { InteractiveListMixin } from '../src/InteractiveListMixin.js';

class InteractiveListClass extends InteractiveListMixin(LitElement) {}

/**
 * @typedef {import('../types/InteractiveListMixinTypes').InteractiveListItemRole} InteractiveListItemRole
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
 * @param { {tagString:string} } [customConfig]
 */
export function runInteractiveListMixinSuite(customConfig = {}) {
  const cfg = {
    tagString: '',
    ...customConfig,
  };

  const tagString = cfg.tagString || defineCE(InteractiveListClass);
  const tag = unsafeStatic(tagString);

  describe('InteractiveListMixin', () => {
    it(`supports items with role="${supportedRoles.join('|')}"`, async () => {
      const el = await fixture(html`
        <${tag} name="foo">
          ${supportedRoles.map(role => html` <div role="${role}"></div> `)}
        </${tag}>
      `);
      expect(el.listItems.length).to.equal(supportedRoles.length);
      supportedRoles.forEach((role, i) => {
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

      const listSlotNode = Array.from(el.children).find(c => c.slot === 'list');
      const listItemEls = Array.from(listSlotNode.children);
      expect(listItemEls.includes(el.listItems[0])).to.be.true;
      expect(listItemEls.includes(el.listItems[1])).to.be.true;
    });

    it('inherits from DisclosureMixin', async () => {});

    describe('Active mode', async () => {
      it('supports "activedescendant" pattern', async () => {
        const el = await fixture(html`
        <${tag} name="foo" ._activeMode="${'activedescendant'}">
          <div role="menuitem" id="item1">Item 1</div>
          <div role="menuitem" id="item2">Item 2</div>
        </${tag}>
      `);
        el.checkedIndex = 0;
        const listSlotNode = Array.from(el.children).find(c => c.slot === 'list');

        expect(el.listItems[0].hasAttribute('id')).to.be.true;
        expect(el.listItems[1].hasAttribute('id')).to.be.true;
        expect(listSlotNode.hasAttribute('aria-activedescendant')).to.be.false;
        el.activeIndex = 1;
        expect(listSlotNode.hasAttribute('aria-activedescendant')).to.be.true;
      });

      it('supports "roving-tabindex" pattern', async () => {
        const el = await fixture(html`
          <${tag} name="foo" ._activeMode="${'roving-tabindex'}">
            <div role="menuitem" id="item1">Item 1</div>
            <div role="menuitem" id="item2">Item 2</div>
          </${tag}>
        `);

        el.activeIndex = 0;
        expect(el.listItems[0].getAttribute('tabindex')).to.equal('0');
        expect(el.listItems[1].getAttribute('tabindex')).to.equal('-1');

        el.activeIndex = 1;
        expect(el.listItems[0].getAttribute('tabindex')).to.equal('-1');
        expect(el.listItems[1].getAttribute('tabindex')).to.equal('0');

        el.activeIndex = 1;
        expect(document.activeElement).to.equal(el.listItems[1]);
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
    });
  });
}
