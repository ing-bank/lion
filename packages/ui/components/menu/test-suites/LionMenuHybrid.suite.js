/* eslint-disable lit-a11y/click-events-have-key-events */
import { defineCE, expect, fixture, html, unsafeStatic, aTimeout } from '@open-wc/testing';
import { sendMouse, resetMouse, sendKeys } from '@web/test-runner-commands';
import { useFakeTimers } from 'sinon';
import { css } from 'lit';
import { getDeepActiveElement } from '@lion/ui/overlays.js';
import { LionMenuHybrid } from '../src/LionMenuHybrid.js';

const l2Style = css`
  [level='2'] > [slot='list'] {
    position: absolute;
    width: 100%;
    left: 0;
    right: 0;
    padding: 1em;
    background-color: white;
    border: 1px solid gray;
    box-sizing: border-box;
  }
`;

const config = {
  l1: {
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
  },
  l2: {
    openableConfig: {
      // We want disclosure behavior
      placementMode: 'custom',
      hidesOnOutsideClick: true,
      hidesOnEscape: true,
      inheritsReferenceWidth: 'none',
      focusContentOnOpen: true,
    },
  },
  l3: {
    openableConfig: {
      // We want disclosure behavior
      placementMode: 'custom',
      inheritsReferenceWidth: 'none',
      focusContentOnOpen: true,
      // TODO: implement in OverlayController
      hideVisually: true,
    },
  },
};

export function runLionMenuHybridSuite({ klass = LionMenuHybrid } = {}) {
  const tagString = defineCE(class extends klass {});
  const tag = unsafeStatic(tagString);

  describe('LionMenuHybrid', () => {
    let clock = null;

    const isMoreButtonMenuShown = el =>
      getComputedStyle(el.querySelector('[data-more-button-menu]')).width !== '1px';

    const getMoreButton = el => el.querySelector('[data-more-button]');

    const isAnyL2MenuShown = el =>
      [...el.querySelectorAll('[level="2"]')].some(menu => menu.hasAttribute('opened'));

    const focusLastVisibleItemInMainMenu = async el => {
      el.querySelector('[data-more-button]')
        .parentNode.previousElementSibling.querySelector('a')
        .focus();
      await aTimeout(0);
    };

    const hitShiftTab = async () => {
      await sendKeys({
        down: 'Shift',
      });
      await sendKeys({
        press: 'Tab',
      });
      await sendKeys({
        up: 'Shift',
      });
    };

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

    /**
     *
     * We use native click in many of the tests here because
     * the source code uses the `mousedown`, `focusin`, `focusout`, `click`
     * events and otherwise we need to emit those events programmatically
     */
    const clickOnMoreButton = async el => {
      const { x, y } = getCoordinates(getMoreButton(el));
      await sendMouse({ type: 'click', position: [x, y] });
      clock.tick(100);
      await aTimeout(0);
    };

    const waitResizeEventDebounce = async el => {
      await el.updateComplete;
      // wait for resize event debouncer
      clock.tick(55);
    };

    /**
     * We need actual 100 ms timeout when More button menu is getting hidden,
     * `useFakeTimers` is not an option. Othewise Safari fails.
     * See more info in the description of `_createMoreButtonWrapper` method in `MoreButtonMenuMixin`
     * @param {HTMLElement} el
     */
    const waitAfterMoreButtonMenuHides = async () => {
      await aTimeout(120);
    };

    const getDirectListItemsUnderMoreButtonMenu = el => [
      ...el.querySelectorAll('[data-more-button-menu] > [role="listitem"]'),
    ];

    const getFixture = async () => {
      const el = await fixture(html`        
        <${tag} 
          .itemWrap="${true}"
          ?data-has-full-width-flyout="${config.l1.hasFullWidthFlyout}"
          .config="${config.l1.openableConfig}"
          .bar="${config.l1.isBar}"
          ._activeMode="${'tabbable-disclosure'}" 
          style="min-width: 170px; max-width: 170px; position:relative"            
        >
          <div role="listitem" id="item1" style="min-width: 50px; max-width: 50px;">
             <button data-invoker>
              Item 1
            </button>
            <${tag} 
              .config="${config.l2.openableConfig}"
              .bar="${config.l2.isBar}"
              ._activeMode="${'tabbable-disclosure'}"               
            >
              <div role="listitem" id="item1.1">
                <a href="#">Item 1.1</a>
              </div>
            </${tag}>
          </div>
          <div role="listitem" id="item2" style="min-width: 50px; max-width: 50px;">
            <a href="#">Item 2</a>
          </div>
          <div role="listitem" id="item3" style="min-width: 50px; max-width: 50px;">
            <a href="#">Item 3</a>
          </div>
          <div role="listitem" id="item4" style="min-width: 50px; max-width: 50px;">            
            <button data-invoker>
              Item 4
            </button>
            <${tag} 
              .config="${config.l2.openableConfig}"
              .bar="${config.l2.isBar}"
              ._activeMode="${'tabbable-disclosure'}" 
            >
              <div role="listitem" id="item4.1">
                <a href="#">Item 4.1</a>
              </div>
            </${tag}>
          </div>
          <div slot="more-button" style="min-width: 50px; max-width: 50px;">
            <button>More</button>
          </div>
        </${tag}>
        <style>
          ${l2Style}
        </style>    
      `);

      await waitResizeEventDebounce(el);
      return el;
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

    it(`[
          {
            action: 'Click on More button',
            expectation: 'more button menu is shown, l2 menu is hidden'
          },
          {
            action: 'Inside more button menu, click on L1 item that has L2',
            expectation: 'more button menu is hidden, l2 menu is shown'
          },
          {
            action: 'Click on More button',
            expectation: 'more button menu is shown, l2 menu is hidden'
          },
      ]`, async () => {
      const el = await getFixture();
      expect(isAnyL2MenuShown(el)).to.be.false;
      await clickOnMoreButton(el);
      el.querySelector('#item4 > button')?.click();
      await waitAfterMoreButtonMenuHides();
      expect(isMoreButtonMenuShown(el)).to.equal(false);
      expect(isAnyL2MenuShown(el)).to.be.true;
      await clickOnMoreButton(el);
      expect(isAnyL2MenuShown(el)).to.be.false;
      expect(isMoreButtonMenuShown(el)).to.equal(true);
    });

    it(`[
      {
        action: 'Focus last visible L1 item in the main menu',
      },
      {
        action: 'Hit Tab',
        expectation: '
          more button menu is shown,
          the first L1 item in the more button menu is focused,
        '
      },
    ]`, async () => {
      const el = await getFixture();
      await focusLastVisibleItemInMainMenu(el);

      // Hitting Tab should open the More button menu and focus the first L1 item in it
      await sendKeys({
        press: 'Tab',
      });

      expect(isMoreButtonMenuShown(el)).to.equal(true);

      // make sure the first L1 inside More button menu is focused
      const firstItemInMoreMenu = getDirectListItemsUnderMoreButtonMenu(el)[0];
      expect(firstItemInMoreMenu.contains(getDeepActiveElement())).to.equal(true);
    });

    it(`[
      {
        action: 'Click on the L1 item that has children in the *main* menu',
        expectation: '
          L2 menu is shown,
        '
      },
      {
        action: 'Click on More button',        
        expectation: '
          L2 menu gets closed,
          More button menu is shown,
        '
      }
    ]`, async () => {
      const el = await getFixture();
      expect(isAnyL2MenuShown(el)).to.be.false;

      // click on the first L1 item that has L2 children
      el.querySelector('#item1 > button')?.click();
      await aTimeout(0);

      expect(isMoreButtonMenuShown(el)).to.be.false;
      expect(isAnyL2MenuShown(el)).to.be.true;

      await clickOnMoreButton(el);
      expect(isMoreButtonMenuShown(el)).to.be.true;
      expect(isAnyL2MenuShown(el)).to.be.false;
    });

    it(`[
      {
        action: 'Click on the L1 item that has children in the *main* menu',
        expectation: '
          L2 menu is shown,
        '
      },
      {
        action: 'Hit Tab many times so that the focus goes through all L2 items,
        then focus moves to the next L1 item in the *main* menu and finally reaches 
        the last visible L1 item in the main menu just before the More button',
        expectation: '
          L2 menu stays open,
        '
      },
      {
        action: 'When the Tab stays on the last L1 item before More button
          and then we hit Tab again to get into More button menu',
        expectation: '
          L2 menu from L1 that we clicked at the very first step is closed,
          More button menu is shown
        '
      },
    ]`, async () => {
      const el = await getFixture();
      expect(isAnyL2MenuShown(el)).to.be.false;
      // click on the first L1 item that has L2 children
      el.querySelector('#item1 > button')?.click();

      // focus #item1.1
      await sendKeys({
        press: 'Tab',
      });

      // focus #item2
      await sendKeys({
        press: 'Tab',
      });
      expect(isAnyL2MenuShown(el)).to.be.true;

      // focus first L1 item inside More button menu
      await sendKeys({
        press: 'Tab',
      });

      expect(isMoreButtonMenuShown(el)).to.equal(true);
      expect(isAnyL2MenuShown(el)).to.be.false;
    });

    it(`[
      {
        action: 'Focus last visible L1 item in the main menu',
      },
      {
        action: 'Hit Tab',
        expectation: '
          more button menu is shown,
          the first L1 item in the more button menu is focused,
        '
      },
      {
        action: 'Click on More button',
        expectation: '
          more button menu is hidden
        '
      }
    ]`, async () => {
      const el = await getFixture();
      await focusLastVisibleItemInMainMenu(el);

      // focus first L1 item inside More button menu
      await sendKeys({
        press: 'Tab',
      });

      expect(isMoreButtonMenuShown(el)).to.be.true;
      expect(isAnyL2MenuShown(el)).to.be.false;
      await clickOnMoreButton(el);
      expect(isMoreButtonMenuShown(el)).to.be.false;
      expect(isAnyL2MenuShown(el)).to.be.false;
    });

    it(`[
      {
        action: 'Focus last visible L1 item in the main menu',
      },
      {
        action: 'Hit Tab',
        expectation: '
          more button menu is shown,
          the first L1 item in the more button menu is focused,
        '
      },
      {
        action: 'Hit Shift + Tab',
        expectation: '
          more button menu is hidden,
          the last visible L1 item in the main menu is focused,
        '
      },
    ]`, async () => {
      const el = await getFixture();
      await focusLastVisibleItemInMainMenu(el);

      // focus first L1 item inside More button menu
      await sendKeys({
        press: 'Tab',
      });

      expect(isMoreButtonMenuShown(el)).to.be.true;
      expect(isAnyL2MenuShown(el)).to.be.false;

      // hit Shift + Tab
      await hitShiftTab();
      await waitAfterMoreButtonMenuHides();

      expect(isMoreButtonMenuShown(el)).to.be.false;
      expect(isAnyL2MenuShown(el)).to.be.false;
    });

    it(`[
      {
        action: 'Focus last visible L1 item in the main menu',
      },
      {
        action: 'Hit Tab',
        expectation: '
          more button menu is shown,
          the first L1 item in the more button menu is focused,
        '
      },
      {
        action: 'Focus the L1 item in "More" menu that has children and Hit Enter',
        expectation: '
          more button menu is hidden,
          l2 menu is show,
        '
      },
    ]`, async () => {
      const el = await getFixture();
      await focusLastVisibleItemInMainMenu(el);

      // focus first L1 item inside More button menu
      await sendKeys({
        press: 'Tab',
      });

      // focus #item4 . It has childrent
      await sendKeys({
        press: 'Tab',
      });

      expect(isMoreButtonMenuShown(el)).to.be.true;
      expect(isAnyL2MenuShown(el)).to.be.false;

      // hit Enter
      await sendKeys({
        press: 'Enter',
      });
      await waitAfterMoreButtonMenuHides();

      expect(isMoreButtonMenuShown(el)).to.be.false;
      expect(isAnyL2MenuShown(el)).to.be.true;
    });

    it(`[
      {
        action: 'Focus last visible L1 item in the main menu',
      },
      {
        action: 'Hit Tab',
        expectation: '
          more button menu is shown,
          the first L1 item in the more button menu is focused,
        '
      },
      {
        action: 'Focus the L1 item in "More" menu that has children and Hit Enter',
        expectation: '
          more button menu is hidden,
          l2 menu is show,
          the PARENT L1 item under the More button is focused, not the first one
        '
      },
      {
        action: 'Hit Shitft + Tab',
        expectation: '
          more button menu is show,
          l2 menu is hidden,
        '
      },
      {
        action: 'Hit Shitft + Tab until we reach the first item in the More button menu',
      },
      {
        action: 'Hit Shift + Tab',
        expectation: '
          more button menu is hidden,
          the last visible L1 item in the main menu is focused,
        '
      },
    ]`, async () => {
      const el = await getFixture();
      await focusLastVisibleItemInMainMenu(el);

      // focus first L1 item inside More button menu
      await sendKeys({
        press: 'Tab',
      });

      // focus #item4 . It has childrent
      await sendKeys({
        press: 'Tab',
      });

      expect(isMoreButtonMenuShown(el)).to.be.true;
      expect(isAnyL2MenuShown(el)).to.be.false;

      // hit Enter
      await sendKeys({
        press: 'Enter',
      });
      await waitAfterMoreButtonMenuHides();

      expect(isMoreButtonMenuShown(el)).to.be.false;
      expect(isAnyL2MenuShown(el)).to.be.true;

      // Focus #item4. It is the second item in the More button menu
      await hitShiftTab();
      expect(isMoreButtonMenuShown(el)).to.be.true;
      expect(isAnyL2MenuShown(el)).to.be.false;
      const focusedElement = getDeepActiveElement();

      // the PARENT L1 item under the More button is focused, not the first one
      expect(
        el?.querySelector('#item4')?.contains(focusedElement) &&
          el.listItems.includes(focusedElement),
      ).to.be.true;
      // Focus #item3. It is the first item in the More button menu
      await hitShiftTab();
      // Focus #item2. It is the last visible item in the main menu
      await hitShiftTab();
      await waitAfterMoreButtonMenuHides();

      expect(isMoreButtonMenuShown(el)).to.be.false;
      expect(isAnyL2MenuShown(el)).to.be.false;
    });
  });
}
