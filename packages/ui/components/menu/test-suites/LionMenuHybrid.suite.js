/* eslint-disable lit-a11y/click-events-have-key-events */
import { defineCE, expect, fixture, html, unsafeStatic, aTimeout } from '@open-wc/testing';
import { sendMouse, resetMouse } from '@web/test-runner-commands';
import { useFakeTimers } from 'sinon';
import { css } from 'lit';
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

    const isL2MenuShown = el => el.querySelector('#l2')?.hasAttribute('opened');

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
              <a href="#">Item 1</a>
            </div>
            <div role="listitem" id="item2" style="min-width: 50px; max-width: 50px;">
              <a href="#">Item 2</a>
            </div>
            <div role="listitem" id="item3" style="min-width: 50px; max-width: 50px;">
              <a href="#">Item 3</a>
            </div>
            <div role="listitem" id="item4" style="min-width: 50px; max-width: 50px;">
              <style>
                ${l2Style}
              </style>
              <button data-invoker>
                Item 4
              </button>
              <${tag} 
                .config="${config.l2.openableConfig}"
                .bar="${config.l2.isBar}"
                ._activeMode="${'tabbable-disclosure'}" 
                id="l2"
              >
                <div role="listitem" id="item1.1">
                  <a href="#">Item 1.1</a>
                </div>
              </${tag}>
            </div>
            <div slot="more-button" style="min-width: 50px; max-width: 50px;">
              <button>More</button>
            </div>
          </${tag}>
        `);

      await waitResizeEventDebounce(el);
      expect(isL2MenuShown(el)).to.be.false;
      await clickOnMoreButton(el);
      el.querySelector('#item4 > button')?.click();
      await waitAfterMoreButtonMenuHides();
      expect(isMoreButtonMenuShown(el)).to.equal(false);
      expect(isL2MenuShown(el)).to.be.true;
      await clickOnMoreButton(el);
      expect(isL2MenuShown(el)).to.be.false;
      expect(isMoreButtonMenuShown(el)).to.equal(true);
    });
  });
}
