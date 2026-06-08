import { LitElement } from 'lit';
import { expect, html, fixture as _fixture, unsafeStatic, defineCE } from '@open-wc/testing';
import { sendMouse, resetMouse } from '@web/test-runner-commands';
import { useFakeTimers } from 'sinon';
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
        console.debug('listItems', el.listItems);
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
          <${tag}>
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
          <${tag}>
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
          <${tag} has-no-default-selected autocomplete="list">
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

    describe('Overflow handling', () => {
      let clock = null;

      const isMoreButtonShown = el =>
        el.querySelector('[data-more-button-wrapper]')?.style.display !== 'none';

      const isMoreButtonMenuShown = el =>
        getComputedStyle(el.querySelector('[data-more-button-menu]')).width !== '1px';

      const getMoreButton = el => el.querySelector('[data-more-button]');

      /**
       * @param {HTMLElement} element
       */
      function getCoordinates(element) {
        const { x, y, height } = element.getBoundingClientRect();

        return {
          x: Math.floor(x + window.pageXOffset),
          y: Math.floor(y + window.pageYOffset + height / 2),
        };
      }
      const clickOnMoreButton = async el => {
        const { x, y } = getCoordinates(getMoreButton(el));
        await sendMouse({ type: 'click', position: [x, y] });
        clock.tick(100);
      };

      const getDirectListItemsUnderMoreButtonMenu = el => [
        ...el.querySelectorAll('[data-more-button-menu] > [role="listitem"]'),
      ];

      const getDirectListItemsUnderMainMenu = el => [
        ...el.querySelectorAll('[slot="list"] > [role="listitem"]'),
      ];

      const waitResizeEventDebounce = async el => {
        await el.updateComplete;
        // wait for resize event debouncer
        clock.tick(55);
      };

      beforeEach(() => {
        clock = useFakeTimers({
          shouldAdvanceTime: true,
        });
      });
      afterEach(async () => {
        clock.restore();
        await resetMouse();
      });

      it('should show no More button when all items fit', async () => {
        const el = await fixture(html`
          <${tag} name="foo" ._activeMode="${'tabbable-disclosure'}" .itemWrap="${true}" 
            data-has-full-width-flyout orientation="horizontal" style="min-width: 170px; max-width: 170px;">
            <div role="listitem" id="item1" style="min-width: 50px; max-width: 50px;">
              <a href="#">Item 1</a>
            </div>
            <div role="listitem" id="item2" style="min-width: 50px; max-width: 50px;">
              <a href="#">Item 2</a>
            </div>
            <div role="listitem" id="item3" style="min-width: 50px; max-width: 50px;">
              <a href="#">Item 3</a>
            </div>
            <div slot="more-button" style="min-width: 50px; max-width: 50px;">
              <button>More</button>
            </div>
          </${tag}>
        `);
        await waitResizeEventDebounce(el);
        // 3 items is 150px. They fit into 170px parent
        expect(isMoreButtonShown(el)).to.equal(false);
      });

      it('should show  More button when not all items fit', async () => {
        const el = await fixture(html`
          <${tag} name="foo" ._activeMode="${'tabbable-disclosure'}" .itemWrap="${true}" 
            data-has-full-width-flyout orientation="horizontal" style="min-width: 170px; max-width: 170px;">
            <div role="listitem" id="item1" style="min-width: 50px; max-width: 50px;">
              <a href="#">Item 1</a>
            </div>
            <div role="listitem" id="item2" style="min-width: 50px; max-width: 50px;">
              <a href="#">Item 2</a>
            </div>
            <div role="listitem" id="item3" style="min-width: 50px; max-width: 50px;">
              <a href="#">Item 3</a>
            </div>
            <div role="listitem" id="item4" style="min-width: 50px; max-width: 50px;">
              <a href="#">Item 4</a>
            </div>
            <div slot="more-button" style="min-width: 50px; max-width: 50px;">
              <button>More</button>
            </div>
          </${tag}>
        `);

        await waitResizeEventDebounce(el);
        // 4 items is 200px. They don't fit into 170px parent. So More button should be shown
        expect(isMoreButtonShown(el)).to.equal(true);
      });

      it('should show 2 items when clicking on `More` button', async () => {
        const el = await fixture(html`
          <${tag} name="foo" ._activeMode="${'tabbable-disclosure'}" .itemWrap="${true}" 
            data-has-full-width-flyout orientation="horizontal" style="min-width: 170px; max-width: 170px; position:relative">
            <div role="listitem" id="item1" style="min-width: 50px; max-width: 50px;">
              <a href="#">Item 1</a>
            </div>
            <div role="listitem" id="item2" style="min-width: 50px; max-width: 50px;">
              <a href="#">Item 2</a>
            </div>
            <div role="listitem" id="item3" style="min-width: 50px; max-width: 50px;">
              <a href="#">Item 3</a>
            </div>
            <div role="listitem" id="item4" style="min-width: 50px; max-width: 50px;">
              <a href="#">Item 4</a>
            </div>
            <div slot="more-button" style="min-width: 50px; max-width: 50px;">
              <button>More</button>
            </div>
          </${tag}>
        `);

        await waitResizeEventDebounce(el);
        await clickOnMoreButton(el);

        expect(isMoreButtonMenuShown(el)).to.equal(true);
        const labels = getDirectListItemsUnderMoreButtonMenu(el).map(item =>
          item.textContent.trim(),
        );
        expect(labels).to.deep.equal(['Item 3', 'Item 4']);
      });

      it('should open and then close More button menu when clicking 2 times on the More button', async () => {
        const el = await fixture(html`
          <${tag} name="foo" ._activeMode="${'tabbable-disclosure'}" .itemWrap="${true}" 
            data-has-full-width-flyout orientation="horizontal" style="min-width: 170px; max-width: 170px; position:relative">
            <div role="listitem" id="item1" style="min-width: 50px; max-width: 50px;">
              <a href="#">Item 1</a>
            </div>
            <div role="listitem" id="item2" style="min-width: 50px; max-width: 50px;">
              <a href="#">Item 2</a>
            </div>
            <div role="listitem" id="item3" style="min-width: 50px; max-width: 50px;">
              <a href="#">Item 3</a>
            </div>
            <div role="listitem" id="item4" style="min-width: 50px; max-width: 50px;">
              <a href="#">Item 4</a>
            </div>
            <div slot="more-button" style="min-width: 50px; max-width: 50px;">
              <button>More</button>
            </div>
          </${tag}>
        `);

        await waitResizeEventDebounce(el);
        expect(isMoreButtonMenuShown(el)).to.equal(false);
        await clickOnMoreButton(el);
        expect(isMoreButtonMenuShown(el)).to.equal(true);
        await clickOnMoreButton(el);
        expect(isMoreButtonMenuShown(el)).to.equal(false);
      });

      it('should remove `More` button when making font smaller', async () => {
        const el = await fixture(html`
          <${tag} name="foo" ._activeMode="${'tabbable-disclosure'}" .itemWrap="${true}" 
            data-has-full-width-flyout orientation="horizontal" style="min-width: 170px; max-width: 170px;">
            <div role="listitem" id="item1" style="min-width: 50px; max-width: 50px;">
              <a href="#">Item 1</a>
            </div>
            <div role="listitem" id="item2" style="min-width: 50px; max-width: 50px;">
              <a href="#">Item 2</a>
            </div>
            <div role="listitem" id="item3" style="min-width: 50px; max-width: 50px;">
              <a href="#">Item 3</a>
            </div>
            <div slot="more-button" style="min-width: 50px; max-width: 50px;">
              <button>More</button>
            </div>
          </${tag}>
        `);
        await waitResizeEventDebounce(el);

        /**
         * Make font smaller for first level items to force
         * the menu render all 4 items and no `More` button
         */
        getDirectListItemsUnderMainMenu(el).forEach(item => {
          // eslint-disable-next-line no-param-reassign
          item.style.fontSize = '12px';
        });
        el?.dispatchEvent(new CustomEvent('resize', { composed: true, bubbles: true }));
        await waitResizeEventDebounce(el);
        expect(isMoreButtonShown(el)).to.equal(false);
      });

      it('should add `More` button when making font larger', async () => {
        const el = await fixture(html`
          <${tag} name="foo" ._activeMode="${'tabbable-disclosure'}" .itemWrap="${true}" 
            data-has-full-width-flyout orientation="horizontal" style="min-width: 170px; max-width: 170px;">
            <div role="listitem" id="item1" style="min-width: 50px; max-width: 50px;">
              <a href="#">Item 1</a>
            </div>
            <div role="listitem" id="item2" style="min-width: 50px; max-width: 50px;">
              <a href="#">Item 2</a>
            </div>
            <div role="listitem" id="item3" style="min-width: 50px; max-width: 50px;">
              <a href="#">Item 3</a>
            </div>
            <div slot="more-button" style="min-width: 50px; max-width: 50px;">
              <button>More</button>
            </div>
          </${tag}>
        `);
        await waitResizeEventDebounce(el);

        expect(getDirectListItemsUnderMainMenu(el).length).to.equal(3);
        /**
         * Make font larger for first level items to force
         * the More button to appear
         */
        getDirectListItemsUnderMainMenu(el).forEach(item => {
          // eslint-disable-next-line no-param-reassign
          item.style.fontSize = '40px';
        });
        el?.dispatchEvent(new CustomEvent('resize', { composed: true, bubbles: true }));
        await waitResizeEventDebounce(el);
        expect(isMoreButtonShown(el)).to.equal(true);
        expect(getDirectListItemsUnderMainMenu(el).length).to.equal(2);
      });
    });
  });
}
