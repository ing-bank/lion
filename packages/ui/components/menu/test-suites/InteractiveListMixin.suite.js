import { LitElement } from 'lit';
import { expect, html, fixture as _fixture, unsafeStatic, defineCE } from '@open-wc/testing';
import { InteractiveListMixin } from '../src/InteractiveListMixin.js';
import { mimicKeyPress } from '../test-helpers/mimicKeyPress.js';

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
 * @typedef {import('../src/LionMenu.js').LionMenu} LionMenu
 * @typedef {import('lit').TemplateResult} TemplateResult
 *
 * * @typedef {Object} TestConfig
 * @property {string} tagString
 */

const fixture = /** @type {(arg: TemplateResult) => Promise<LionMenu>} */ (_fixture);

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

    it('inherits from DisclosureMixin', async () => {});

    describe('Active mode', async () => {
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
    });

    describe('preselect', () => {
      it('sets the checkedIndex to 0 by default when noPreselect is false', async () => {
        const el = await fixture(html`
          <${tag}>
            <div role="menuitem" id="item1">Item 1</div>
          </${tag}>
        `);
        if (!el.noPreselect) {
          expect(el.checkedIndex).to.equal(0);
        }
      });

      it('sets the checkedIndex to -1 when noPreselect is true', async () => {
        const el = await fixture(html`
          <${tag} no-preselect>
            <div role="menuitem" id="item1">Item 1</div>
          </${tag}>
        `);
        expect(el.checkedIndex).to.equal(-1);
      });
    });

    describe('Programmatic interaction', () => {
      // If we have the item line directly in the fixture the linting rule lit-a11y/role-has-required-aria-attrs
      // will fail. Inside our code we set the required aria attributes, but the linter doesn't know that.
      const item = /** @param {number} i, @param {string} role */ (i, role) => html`
        <div role="${role}" id="item${i}">Item ${i}</div>
      `;

      it('set checked state sets aria-current attribute with role="listitem"', async () => {
        const el = await fixture(html`
          <${tag}>
            ${item(1, 'listitem')}
            ${item(2, 'listitem')}
          </${tag}>
        `);
        el.setCheckedIndex(1);
        const item1 = el.listItems[1];
        expect(item1.getAttribute('aria-current')).to.equal('true');
        el.setCheckedIndex(0);
        expect(item1.getAttribute('aria-current')).to.equal('false');
      });

      it('set checked state sets aria-selected attribute with role="option"', async () => {
        const el = await fixture(html`
          <${tag}>
            ${item(1, 'option')}
            ${item(2, 'option')}
          </${tag}>
        `);
        const item1 = el.listItems[1];
        expect(item1.getAttribute('aria-selected')).to.equal('false');

        el.setCheckedIndex(1);
        expect(item1.getAttribute('aria-selected')).to.equal('true');

        el.setCheckedIndex(0);
        expect(item1.getAttribute('aria-selected')).to.equal('false');
      });

      it('set checked state sets aria-selected attribute with role="treeitem"', async () => {
        const el = await fixture(html`
          <${tag}>
            ${item(1, 'treeitem')}
            ${item(2, 'treeitem')}
          </${tag}>
        `);
        el.setCheckedIndex(1);
        // @ts-ignore - test element with InteractiveListMixin properties
        const item1 = el.listItems[1];
        expect(item1.getAttribute('aria-selected')).to.equal('true');
        el.setCheckedIndex(0);
        expect(item1.getAttribute('aria-selected')).to.equal('false');
      });

      it('set checked state sets aria-current attribute with role="menuitem"', async () => {
        const el = await fixture(html`
          <${tag}>
            ${item(1, 'menuitem')}
            ${item(2, 'menuitem')}
          </${tag}>
        `);
        el.setCheckedIndex(1);
        const item1 = el.listItems[1];
        expect(item1.getAttribute('aria-current')).to.equal('true');
        el.setCheckedIndex(0);
        expect(item1.getAttribute('aria-current')).to.equal('false');
      });

      it('set checked state sets aria-checked attribute with role="menuitemradio"', async () => {
        const el = await fixture(html`
          <${tag}>
            ${item(1, 'menuitemradio')}
            ${item(2, 'menuitemradio')}
          </${tag}>
        `);
        el.setCheckedIndex(1);
        const item1 = el.listItems[1];
        expect(item1.getAttribute('aria-checked')).to.equal('true');
        el.setCheckedIndex(0);
        expect(item1.getAttribute('aria-checked')).to.equal('false');
      });

      it('set checked state sets aria-checked attribute with role="menuitemcheckbox"', async () => {
        const el = await fixture(html`
          <${tag} multiple-choice>
            ${item(1, 'menuitemcheckbox')}
            ${item(2, 'menuitemcheckbox')}
          </${tag}>
        `);
        el.setCheckedIndex(1);
        const item1 = el.listItems[1];
        expect(item1.getAttribute('aria-checked')).to.equal('true');
        el.setCheckedIndex(0);
        // As this is multiple choice it doesn't unset the checked state
        expect(item1.getAttribute('aria-checked')).to.equal('true');
      });

      it('can set checked state to "page" for role="listitem"', async () => {
        const el = await fixture(html`
          <${tag}>
            <a role="listitem" id="item1" href="#">Item 1</a>
            <a role="listitem" id="item2" href="#">Item 2</a>
          </${tag}>
        `);
        el.setCheckedIndex(1);
        const item1 = el.listItems[1];
        expect(item1.getAttribute('aria-current')).to.equal('page');
        el.setCheckedIndex(0);
        expect(item1.getAttribute('aria-current')).to.equal('false');
      });

      it('can set checked state to "mixed" for role="menuitemcheckbox"', async () => {
        const el = await fixture(html`
          <${tag} multiple-choice>
            ${item(1, 'menuitemcheckbox')}
            ${item(2, 'menuitemcheckbox')}
          </${tag}>
        `);
        const item1 = el.listItems[1];
        // @ts-ignore - not yet supported property
        item1.mixedState = true;
        el.setCheckedIndex(1);
        expect(item1.getAttribute('aria-checked')).to.equal('mixed');
        el.setCheckedIndex(0);
        expect(item1.getAttribute('aria-checked')).to.equal('mixed');
      });

      it('does not allow to set checkedIndex or activeIndex to be out of bound', async () => {
        const el = await fixture(html`
          <${tag} no-preselect>
            <div role="menuitem" id="item1">Item 1</div>
          </${tag}>
        `);
        expect(() => {
          el.checkedIndex = -1;
          el.checkedIndex = 1;
        }).to.not.throw();
        expect(el.checkedIndex).to.equal(-1);
      });

      it('unsets checked on other options when option becomes checked', async () => {
        const el = await fixture(html`
          <${tag}>
            <div role="menuitem" id="item1">Item 1</div>
            <div role="menuitem" id="item2">Item 2</div>
          </${tag}>
        `);
        const { listItems } = el;
        el.setCheckedIndex(0);
        expect(listItems[0].hasAttribute('checked')).to.be.true;
        expect(listItems[1].hasAttribute('checked')).to.be.false;
        el.setCheckedIndex(1);
        expect(listItems[0].hasAttribute('checked')).to.be.false;
        expect(listItems[1].hasAttribute('checked')).to.be.true;
      });
    });

    it('sets aria-current="page" when the location href matches the item href', async () => {
      const el = await fixture(html`
        <${tag}>
          <div role="menuitem" id="item0">
            <a href="${window.location.href}">Item 0</a>
          </div>
            <div role="menuitem" id="item1">
              <a href="#bar">Item 1</a>
          </div>
        </${tag}>
      `);
      const item0 = el.listItems[0];
      expect(item0.getAttribute('aria-current')).to.equal('page');
    });

    // Copy tests from ListboxMixin. Later, make this mixin a fundament of the ListboxMixin

    // orientation
    // multipleChoice
    // selectionFollowsFocus
    // rotateKeyboardNavigation
    // _scrollTargetNode

    describe('Interactions', () => {
      describe('Keyboard navigation', () => {
        it('navigates between items on [ArrowDown] [ArrowUp] keys', async () => {
          const el = await fixture(html`
            <${tag}>
              <div role="listitem" id="item-0">
                <button data-invoker>Item 0</button>
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

        it('navigates between items on [ArrowRight] [ArrowLeft] keys when orientation is "horizontal" and _activeMode="tabbable-disclosure"', async () => {
          const el = await fixture(html`
            <${tag} orientation="horizontal">
              <div role="listitem" id="item-0">
                <button data-invoker>Item 0</button>
              </div>
              <div role="listitem" id="item-1">
                <a href="#baz">Item 1</a>
              </div>
              <div role="listitem" id="item-2">
                <a href="#foobar">Item 2</a>
              </div>
            </${tag}>
          `);
          el._activeMode = 'tabbable-disclosure';
          const { _listNode } = el;

          // Normalize
          el.activeIndex = 0;

          mimicKeyPress(_listNode, 'ArrowRight');
          expect(el.activeIndex).to.be.equal(1);
          mimicKeyPress(_listNode, 'ArrowRight');
          expect(el.activeIndex).to.be.equal(2);
          mimicKeyPress(_listNode, 'ArrowLeft');
          expect(el.activeIndex).to.be.equal(1);
        });

        it('stops navigation by default at end of option list', async () => {
          const el = await fixture(html`
            <${tag}>
              <div role="listitem" id="item-0">
                <button data-invoker>Item 0</button>
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

        it('navigates to first and last option with [Home] and [End] keys', async () => {
          const el = await fixture(html`
            <${tag} orientation="horizontal">
              <div role="listitem" id="item-0">
                <button data-invoker>Item 0</button>
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
          el.activeIndex = 2;

          mimicKeyPress(_listNode, 'Home');
          expect(el.activeIndex).to.equal(0);
          mimicKeyPress(_listNode, 'End');
          expect(el.activeIndex).to.equal(2);
        });
      });
    });

    describe('Widget extensions', () => {
      it('can be extended to [role=listbox]', async () => {});
      it('can be extended to [role=menu]', async () => {});
      it('can be extended to [role=menubar]', async () => {});
      it('can be extended to [role=toolbar]', async () => {});
      it('can be extended to [role=tree]', async () => {});
    });
  });
}
