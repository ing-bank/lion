import { LitElement } from 'lit';
import { expect, html, fixture as _fixture, unsafeStatic, defineCE } from '@open-wc/testing';
import { sendMouse, resetMouse } from '@web/test-runner-commands';
import sinon from 'sinon';
import { getDeepActiveElement } from '@lion/ui/overlays.js';
import { InteractiveListMixin } from '../src/InteractiveListMixin.js';

class InteractiveListClass extends InteractiveListMixin(LitElement) {}

/**
 * @typedef {import('../types/InteractiveListMixinTypes.js').InteractiveListItemRole} InteractiveListItemRole
 */

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

/**
 * @param {TestConfig} [customConfig]
 */
export function runMoreButtonMenuMixinSuite(customConfig) {
  const cfg = {
    tagString: customConfig?.tagString || defineCE(InteractiveListClass),
  };

  const { tagString } = cfg;
  const tag = unsafeStatic(tagString);

  describe('MoreButtonMenuMixin', () => {
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
  });
}
