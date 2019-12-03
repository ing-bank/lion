import { expect, fixture, html, nextFrame, unsafeStatic } from '@open-wc/testing';
import { runOverlayMixinSuite } from '@lion/overlays/test-suites/OverlayMixin.suite.js';

import '../lion-tooltip.js';

describe('lion-tooltip', () => {
  describe('Integration tests', () => {
    const tagString = 'lion-tooltip';
    const tag = unsafeStatic(tagString);

    runOverlayMixinSuite({
      tagString,
      tag,
      suffix: ' for lion-tooltip',
    });
  });

  describe('Basic', () => {
    it('should show content on mouseenter and hide on mouseleave', async () => {
      const el = await fixture(html`
        <lion-tooltip>
          <div slot="content">Hey there</div>
          <button slot="invoker">Tooltip button</button>
        </lion-tooltip>
      `);
      const eventMouseEnter = new Event('mouseenter');
      el.dispatchEvent(eventMouseEnter);
      await el.updateComplete;
      expect(el._overlayCtrl.isShown).to.equal(true);
      const eventMouseLeave = new Event('mouseleave');
      el.dispatchEvent(eventMouseLeave);
      await el.updateComplete;
      expect(el._overlayCtrl.isShown).to.equal(false);
    });

    it('should show content on mouseenter and remain shown on focusout', async () => {
      const el = await fixture(html`
        <lion-tooltip>
          <div slot="content">Hey there</div>
          <button slot="invoker">Tooltip button</button>
        </lion-tooltip>
      `);
      const eventMouseEnter = new Event('mouseenter');
      el.dispatchEvent(eventMouseEnter);
      await el.updateComplete;
      expect(el._overlayCtrl.isShown).to.equal(true);
      const eventFocusOut = new Event('focusout');
      el.dispatchEvent(eventFocusOut);
      await el.updateComplete;
      expect(el._overlayCtrl.isShown).to.equal(true);
    });

    it('should show content on focusin and hide on focusout', async () => {
      const el = await fixture(html`
        <lion-tooltip>
          <div slot="content">Hey there</div>
          <button slot="invoker">Tooltip button</button>
        </lion-tooltip>
      `);
      const invoker = Array.from(el.children).find(child => child.slot === 'invoker');
      const eventFocusIn = new Event('focusin');
      invoker.dispatchEvent(eventFocusIn);
      await el.updateComplete;
      expect(el._overlayCtrl.isShown).to.equal(true);
      const eventFocusOut = new Event('focusout');
      invoker.dispatchEvent(eventFocusOut);
      await el.updateComplete;
      expect(el._overlayCtrl.isShown).to.equal(false);
    });

    it('should show content on focusin and remain shown on mouseleave', async () => {
      const el = await fixture(html`
        <lion-tooltip>
          <div slot="content">Hey there</div>
          <button slot="invoker">Tooltip button</button>
        </lion-tooltip>
      `);
      const invoker = Array.from(el.children).find(child => child.slot === 'invoker');
      const eventFocusIn = new Event('focusin');
      invoker.dispatchEvent(eventFocusIn);
      await el.updateComplete;
      expect(el._overlayCtrl.isShown).to.equal(true);
      const eventMouseLeave = new Event('mouseleave');
      invoker.dispatchEvent(eventMouseLeave);
      await el.updateComplete;
      expect(el._overlayCtrl.isShown).to.equal(true);
    });

    it('should tooltip contains html when specified in tooltip content body', async () => {
      const el = await fixture(html`
        <lion-tooltip>
          <div slot="content">
            This is Tooltip using <strong id="click_overlay">overlay</strong>
          </div>
          <button slot="invoker">Tooltip button</button>
        </lion-tooltip>
      `);
      const invoker = Array.from(el.children).find(child => child.slot === 'invoker');
      const event = new Event('mouseenter');
      invoker.dispatchEvent(event);
      await el.updateComplete;
      expect(el.querySelector('strong')).to.not.be.undefined;
    });
  });

  describe.only('Arrow', () => {
    it('has a slot="arrow" that you can pass an arrow node to', async () => {
      const el = await fixture(html`
        <lion-tooltip>
          <div slot="content">
            Hey there
          </div>
          <div slot="arrow" style="width: 10px; height: 10px; background-color: black;"></div>
          <lion-button slot="invoker">Tooltip button</lion-button>
        </lion-tooltip>
      `);

      expect(Array.from(el.children).find(child => child.slot === 'arrow')).to.be.undefined; // since it's moved to inside contentNode
      expect(el._overlayContentNode.querySelector('[slot="arrow"]')).dom.to.equal(
        `<div slot="arrow" style="width: 10px; height: 10px; background-color: black;" x-arrow="true"></div>`,
      );
    });

    it('updates the arrow if a new slottable is passed on slotchange', async () => {
      const el = await fixture(html`
        <lion-tooltip>
          <div slot="content">
            Hey there
          </div>
          <div slot="arrow" style="width: 10px; height: 10px; background-color: black;"></div>
          <lion-button slot="invoker">Tooltip button</lion-button>
        </lion-tooltip>
      `);

      expect(el._overlayContentNode.querySelector('[slot="arrow"]')).dom.to.equal(
        `<div slot="arrow" style="width: 10px; height: 10px; background-color: black;" x-arrow="true"></div>`,
      );

      const newSlot = document.createElement('div');
      newSlot.setAttribute('slot', 'arrow');
      newSlot.setAttribute('style', 'width: 20px;');
      el.appendChild(newSlot);
      await nextFrame();

      expect(Array.from(el.children).find(child => child.slot === 'arrow')).to.be.undefined; // since it's moved to inside contentNode
      expect(
        Array.from(el._overlayContentNode.children).find(child => child.slot === 'arrow'),
      ).dom.to.equal(`<div slot="arrow" style="width: 20px;" x-arrow="true"></div>`);
    });

    it('rotates the arrow automatically based on popperConfig placement param', async () => {
      const el = await fixture(html`
        <lion-tooltip
          .config=${{
            popperConfig: {
              placement: 'right',
              modifiers: {
                arrow: { enabled: true },
              },
            },
          }}
        >
          <div slot="content">
            Hey there
          </div>
          <div slot="arrow" style="width: 10px; height: 10px; background-color: black;"></div>
          <lion-button slot="invoker">Tooltip button</lion-button>
        </lion-tooltip>
      `);

      expect(el._overlayContentNode.querySelector('[slot="arrow"]').style.rotation).to.equal(
        'deg(90)',
      );
    });

    // Check that this succeeds in the browser.
    // It does not succeed in headless, same reason for popper positioning tests....
    it.skip('makes sure positioning of the arrow is properly updated when updating the arrow slottable', async () => {
      const el = await fixture(html`
        <lion-tooltip
          .config=${{
            popperConfig: {
              placement: 'right',
              modifiers: {
                keepTogether: { enabled: true },
                arrow: { enabled: true },
              },
            },
          }}
        >
          <div slot="content" style="height: 30px">
            Hey there
          </div>
          <div
            slot="arrow"
            style="width: 10px; height: 10px; background-color: black; position: absolute;"
          ></div>
          <lion-button slot="invoker">Tooltip button</lion-button>
        </lion-tooltip>
      `);
      el.opened = true;

      await nextFrame();
      expect(
        window
          .getComputedStyle(el._overlayContentNode.querySelector('[slot="arrow"]'))
          .getPropertyValue('top'),
      ).to.equal(
        '10px',
        '30px content height - 10 arrow width = 20px, divided by 2 = 10px offset --> arrow is in the middle',
      );

      const newSlot = document.createElement('div');
      newSlot.setAttribute('slot', 'arrow');
      newSlot.setAttribute(
        'style',
        'width: 10px; height: 10px; background-color: black; position: absolute;',
      );
      el.appendChild(newSlot);

      await nextFrame();
      expect(
        window
          .getComputedStyle(el._overlayContentNode.querySelector('[slot="arrow"]'))
          .getPropertyValue('top'),
      ).to.equal(
        '10px', // FIXME: This should be 5px , change it after rotation based on x-placement is done correctly
        '30px content height - 20 arrow width = 10px, divided by 2 = 5px offset --> arrow is in the middle',
      );
    });
  });

  describe('Accessibility', () => {
    it('should have a tooltip role set on the tooltip', async () => {
      const el = await fixture(html`
        <lion-tooltip>
          <div slot="content">Hey there</div>
          <button slot="invoker">Tooltip button</button>
        </lion-tooltip>
      `);

      // FIXME: This should be refactored to Array.from(this.children).find(child => child.slot === 'content')
      // When this issue is fixed https://github.com/ing-bank/lion/issues/382
      const content = el.querySelector('[slot=content]');
      expect(content.getAttribute('role')).to.be.equal('tooltip');
    });
  });
});
