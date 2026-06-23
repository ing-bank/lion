import { LitElement } from 'lit';
<<<<<<< HEAD
import { expect, html, fixture as _fixture, unsafeStatic, defineCE } from '@open-wc/testing';
import { sendMouse, resetMouse } from '@web/test-runner-commands';
import sinon from 'sinon';
import { getDeepActiveElement } from '@lion/ui/overlays.js';
import { InteractiveListMixin } from '../src/InteractiveListMixin.js';
import { mimicKeyPress } from '../test-helpers/mimicKeyPress.js';
=======
import { expect, html, fixture, unsafeStatic, defineCE } from '@open-wc/testing';
import { InteractiveListMixin } from '../src/InteractiveListMixin.js';
>>>>>>> 292a1c22b (wip)

class InteractiveListClass extends InteractiveListMixin(LitElement) {}

/**
 * @typedef {import('../types/InteractiveListMixinTypes.js').InteractiveListItemRole} InteractiveListItemRole
 */

<<<<<<< HEAD
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

const l1Config = {
  isBar: true,
  hasFullWidthFlyout: true,
  openableConfig: {
    // We want disclosure behavior
    placementMode: 'custom',
    // N.B. we don't have an invoker...
    isActivated: false,
    inheritsReferenceWidth: 'none',
    focusContentOnOpen: true,
  },
};

=======
// TODO, consider tab as well? See https://open-ui.org/components/scoped-focusgroup.explainer/#supported-behaviors

/** @type {InteractiveListItemRole[]} */
const supportedRoles = [
  'menuitemcheckbox',
  'menuitemradio',
  'menuitem',
  'treeitem',
  'checkbox',
  'option',
  'radio',
];

/**
 * @typedef {Object} TestConfig
 * @property {string} tagString
 */

>>>>>>> 292a1c22b (wip)
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

<<<<<<< HEAD
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
          <${tag}>
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
           <a href="${window.location.href}">Item 0</a>
           <a href="#bar">Item 1</a>
        </${tag}>
      `);
      const item0 = el.listItems[0];
      expect(item0.getAttribute('aria-current')).to.equal('page');
    });

=======
>>>>>>> 292a1c22b (wip)
    // Copy tests from ListboxMixin. Later, make this mixin a fundament of the ListboxMixin

    // orientation
    // multipleChoice
    // selectionFollowsFocus
    // rotateKeyboardNavigation
    // noPreselect
    // _scrollTargetNode

<<<<<<< HEAD
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

=======
>>>>>>> 292a1c22b (wip)
    describe('Widget extensions', () => {
      it('can be extended to [role=listbox]', async () => {});
      it('can be extended to [role=menu]', async () => {});
      it('can be extended to [role=menubar]', async () => {});
      it('can be extended to [role=toolbar]', async () => {});
      it('can be extended to [role=tree]', async () => {});
    });
<<<<<<< HEAD

    describe('Overflow handling', () => {
      /** @type {import('sinon').SinonFakeTimers | null} */
      let clock = null;

      /** @param {HTMLElement} el */
      const isMoreButtonShown = el => {
        const wrapper = /** @type {HTMLElement | null} */ (
          el.querySelector('[data-more-button-wrapper]')
        );
        return wrapper?.style.display !== 'none';
      };

      /** @param {HTMLElement} el */
      const isMoreButtonMenuShown = el => {
        const menu = el.querySelector('[data-more-button-menu]');
        return menu ? getComputedStyle(menu).width !== '0px' : false;
      };

      /** @param {HTMLElement} el */
      const getMoreButton = el =>
        /** @type {HTMLElement | null} */ (el.querySelector('[data-more-button]'));
      /** @param {HTMLElement} el */
      const getMoreButtonMenu = el => el.querySelector('[data-more-button-menu]');

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
      /** @param {HTMLElement} el */
      const clickOnMoreButton = async el => {
        const moreButton = getMoreButton(el);
        if (!moreButton) {
          return;
        }
        const { x, y } = getCoordinates(moreButton);
        await sendMouse({ type: 'click', position: [x, y] });
        clock?.tick(100);
      };

      /** @param {HTMLElement} el */
      const getDirectListItemsUnderMoreButtonMenu = el => [
        ...Array.from(
          el.querySelectorAll('[data-more-button-menu] > [role="listitem"]'),
          item => /** @type {HTMLElement} */ (item),
        ),
      ];

      /** @param {HTMLElement} el */
      const getDirectListItemsUnderMainMenu = el => [
        ...Array.from(
          el.querySelectorAll('[slot="list"] > [role="listitem"]'),
          item => /** @type {HTMLElement} */ (item),
        ),
      ];

      /** @param {HTMLElement & { updateComplete: Promise<unknown> }} el */
      const waitResizeEventDebounce = async el => {
        await el.updateComplete;
        // wait for resize event debouncer
        clock?.tick(55);
      };

      beforeEach(() => {
        clock = sinon.useFakeTimers({
          shouldAdvanceTime: true,
        });
      });
      afterEach(async () => {
        clock?.restore();
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
          <${tag} 
            .itemWrap="${true}"
            ?data-has-full-width-flyout="${l1Config.hasFullWidthFlyout}"
            .config="${l1Config.openableConfig}"
            .bar="${l1Config.isBar}"
            ._activeMode="${'tabbable-disclosure'}" 
            style="min-width: 170px; max-width: 170px;"            
          >
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
          <style>
            [orientation='horizontal'] ::slotted([slot='list']) {
              display: flex;
            }
          </style>
        `);

        await waitResizeEventDebounce(el);
        // 4 items is 200px. They don't fit into 170px parent. So More button should be shown
        expect(isMoreButtonShown(el)).to.equal(true);
      });

      it('should show 2 items when clicking on `More` button', async () => {
        const el = await fixture(html`
          <${tag} 
            .itemWrap="${true}"
            ?data-has-full-width-flyout="${l1Config.hasFullWidthFlyout}"
            .config="${l1Config.openableConfig}"
            .bar="${l1Config.isBar}"
            ._activeMode="${'tabbable-disclosure'}" 
            style="min-width: 170px; max-width: 170px;"            
          >          
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
        const labels = getDirectListItemsUnderMoreButtonMenu(el).map(
          item => item.textContent?.trim() ?? '',
        );
        expect(labels).to.deep.equal(['Item 3', 'Item 4']);
      });

      it('should focus more button menu container when clicking on `More` button', async () => {
        const el = await fixture(html`
          <${tag} 
            .itemWrap="${true}"
            ?data-has-full-width-flyout="${l1Config.hasFullWidthFlyout}"
            .config="${l1Config.openableConfig}"
            .bar="${l1Config.isBar}"
            ._activeMode="${'tabbable-disclosure'}" 
            style="min-width: 170px; max-width: 170px;"            
          >          
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
        expect(getDeepActiveElement() === getMoreButtonMenu(el)).to.equal(true);
      });

      it('should open and then close More button menu when clicking 2 times on the More button', async () => {
        const el = await fixture(html`
          <${tag} 
            .itemWrap="${true}"
            ?data-has-full-width-flyout="${l1Config.hasFullWidthFlyout}"
            .config="${l1Config.openableConfig}"
            .bar="${l1Config.isBar}"
            ._activeMode="${'tabbable-disclosure'}" 
            style="min-width: 170px; max-width: 170px;"            
          > 
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
          <${tag} 
            .itemWrap="${true}"
            ?data-has-full-width-flyout="${l1Config.hasFullWidthFlyout}"
            .config="${l1Config.openableConfig}"
            .bar="${l1Config.isBar}"
            ._activeMode="${'tabbable-disclosure'}" 
            style="min-width: 170px; max-width: 170px;"            
          > 
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
      });
    });
=======
>>>>>>> 292a1c22b (wip)
  });
}
