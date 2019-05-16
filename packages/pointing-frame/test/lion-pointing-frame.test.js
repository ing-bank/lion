/* eslint-disable no-unused-expressions */
/* eslint-env mocha */
import { expect, fixture, html, nextFrame, aTimeout } from '@open-wc/testing';
import { unsafeHTML } from '@lion/core';
import '../../popup/lion-popup.js';
import '../lion-pointing-frame.js';
import customPointerSvg from './custom-pointer.svg.js';
import pointerSvg from '../../../assets/icons/pointer.svg.js';

const updateSpacing = async (
  spacingCSSProperty,
  mainEl,
  elementToReceiveSpacing,
  awaitUpdate = true,
) => {
  if (awaitUpdate) {
    await mainEl.updateComplete;
  }
  const spacing = window
    .getComputedStyle(elementToReceiveSpacing)
    .getPropertyValue(spacingCSSProperty);

  return spacing;
};
const getPosition = el => el.querySelector('[slot="content"]').position.trim();

describe('lion-pointing-frame', () => {
  describe('Positions of pointing frame', () => {
    describe('Top and Bottom', () => {
      let el;
      beforeEach(async () => {
        el = await fixture(html`
          <lion-popup .position="${'right-of-top'}">
            <lion-pointing-frame slot="content">
              <div>
                <div>Hello, Planet!</div>
              </div>
            </lion-pointing-frame>
            <button slot="invoker">Button</button>
          </lion-popup>
        `);
      });

      it('should adjust its position when space available on top of the container', async () => {
        el.style = 'position: absolute; margin: 240px;';
        el.position = 'right-of-top';
        await el.updateComplete;
        el._show();
        expect(getPosition(el)).to.be.equal('right-of-top');

        el.position = 'left-of-top';
        await el.updateComplete;
        expect(getPosition(el)).to.be.equal('left-of-top');

        el.position = 'center-of-top';
        await el.updateComplete;
        expect(getPosition(el)).to.be.equal('center-of-top');
      });

      it('should adjust its position when no space on top of the container', async () => {
        el.position = 'right-of-top';
        el.style = 'position: absolute; top: 0;';
        await el.updateComplete;
        el._show();
        expect(getPosition(el)).to.be.equal('right-of-bottom');

        el.style = 'position: absolute; top: 0; margin-left:240px';
        el.position = 'left-of-top';
        await el.updateComplete;
        expect(getPosition(el)).to.be.equal('left-of-bottom');

        el.position = 'center-of-top';
        await el.updateComplete;
        expect(getPosition(el)).to.be.equal('center-of-bottom');
      });

      it('should adjust its position when space available on bottom of the container', async () => {
        el.position = 'right-of-bottom';
        el.style = 'position: absolute; margin: 240px;';
        await el.updateComplete;
        el._show();
        expect(getPosition(el)).to.be.equal('right-of-bottom');

        el.position = 'left-of-bottom';
        await el.updateComplete;
        expect(getPosition(el)).to.be.equal('left-of-bottom');

        el.position = 'center-of-bottom';
        await el.updateComplete;
        expect(getPosition(el)).to.be.equal('center-of-bottom');
      });

      it('should adjust its position when no space on bottom of the container', async () => {
        el.position = 'right-of-bottom';
        el.style = 'position: absolute; bottom: 0;';
        await el.updateComplete;
        el._show();
        expect(getPosition(el)).to.be.equal('right-of-top');

        el.position = 'left-of-bottom';

        el.style = 'position: absolute; bottom: 0; margin-left:240px;';
        await el.updateComplete;
        expect(getPosition(el)).to.be.equal('left-of-top');

        el.position = 'center-of-bottom';
        await el.updateComplete;
        expect(getPosition(el)).to.be.equal('center-of-top');
      });
    });

    describe('Right and Left', () => {
      let el;
      beforeEach(async () => {
        el = await fixture(html`
          <lion-popup .position="${'right-of-top'}">
            <lion-pointing-frame slot="content">
              <div>
                <div>Hello, Planet!</div>
              </div>
            </lion-pointing-frame>
            <button slot="invoker">Button</button>
          </lion-popup>
        `);
      });

      it('should adjust its position when space available on right of the container', async () => {
        el.position = 'top-of-right';
        el.style = 'position: absolute; margin: 240px;';
        await el.updateComplete;
        el._show();
        expect(await getPosition(el)).to.be.equal('top-of-right');

        el.position = 'bottom-of-right';
        await el.updateComplete;
        expect(getPosition(el)).to.be.equal('bottom-of-right');

        el.position = 'center-of-right';
        await el.updateComplete;
        expect(getPosition(el)).to.be.equal('center-of-right');
      });

      it('should adjust its position when no space on right of the container', async () => {
        el.position = 'top-of-right';
        el.style = 'position: absolute; right: 0; margin-top: 240px;';
        await el.updateComplete;
        el._show();
        expect(getPosition(el)).to.be.equal('top-of-left');

        el.position = 'bottom-of-right';
        await el.updateComplete;

        expect(getPosition(el)).to.be.equal('bottom-of-left');

        el.position = 'center-of-right';
        await el.updateComplete;
        expect(getPosition(el)).to.be.equal('center-of-left');
      });

      it('should adjust its position when space available on left of the container', async () => {
        el.position = 'top-of-left';
        el.style = 'position: absolute; right: 0; margin: 240px;';
        await el.updateComplete;
        el._show();
        expect(await getPosition(el)).to.be.equal('top-of-left');

        el.position = 'bottom-of-left';
        await el.updateComplete;
        el._show();
        expect(getPosition(el)).to.be.equal('bottom-of-left');

        el.position = 'center-of-left';
        await el.updateComplete;
        expect(getPosition(el)).to.be.equal('center-of-left');
      });

      it('should adjust its position when no space on left of the container', async () => {
        el.position = 'top-of-left';
        el.style = 'position: absolute; left: 0; margin-top:240px;';
        await el.updateComplete;
        el._show();
        expect(getPosition(el)).to.be.equal('top-of-right');

        el.position = 'bottom-of-left';
        await el.updateComplete;
        expect(getPosition(el)).to.be.equal('bottom-of-right');

        el.position = 'center-of-left';
        expect(getPosition(el)).to.be.equal('bottom-of-right');
      });
    });
  });

  describe('Spacing of pointy frame', () => {
    /**
     * invoker-width = 100px, then at half it is 50px.
     * pointer-width = 16px, then at half it is 8px.
     * distance-from-edge = 16px.
     * padding should therefore be 50px - 16px - 8px = 26px
     */
    it('should adjust pointing-frame padding based on the position and invoker-width', async () => {
      const el = await fixture(html`
        <lion-popup position="right-of-top" style="position: absolute; margin: 240px;">
          <lion-pointing-frame slot="content">
            <div>
              <div>Hello, Planet!</div>
            </div>
          </lion-pointing-frame>
          <button style="width: 100px; height: 50px;" slot="invoker">Click me!</button>
        </lion-popup>
      `);
      // To trigger first render and managePosition
      el._show();
      await nextFrame();
      const lionPointingFrame = el.querySelector('lion-pointing-frame');
      console.log(lionPointingFrame.position);
      const pointingFrame = lionPointingFrame.shadowRoot.querySelector('.pointing-frame');

      expect(await updateSpacing('padding-left', el, pointingFrame, false)).to.equal('26px');

      el.position = 'left-of-top';
      expect(await updateSpacing('padding-right', el, pointingFrame)).to.equal('26px');

      el.position = 'center-of-top';
      expect(await updateSpacing('padding-right', el, pointingFrame)).to.equal('0px');
      expect(await updateSpacing('padding-left', el, pointingFrame, false)).to.equal('0px');

      el.position = 'right-of-bottom';
      expect(await updateSpacing('padding-left', el, pointingFrame)).to.equal('26px');

      el.position = 'left-of-bottom';
      expect(await updateSpacing('padding-right', el, pointingFrame)).to.equal('26px');

      el.position = 'center-of-bottom';
      expect(await updateSpacing('padding-right', el, pointingFrame)).to.equal('0px');
      expect(await updateSpacing('padding-left', el, pointingFrame, false)).to.equal('0px');

      el.position = 'top-of-right';
      expect(await updateSpacing('padding-bottom', el, pointingFrame)).to.equal('1px');

      el.position = 'bottom-of-right';
      expect(await updateSpacing('padding-top', el, pointingFrame)).to.equal('1px');

      el.position = 'center-of-right';
      await el.updateComplete;
      expect(await updateSpacing('padding-top', el, pointingFrame)).to.equal('0px');
      expect(await updateSpacing('padding-bottom', el, pointingFrame, false)).to.equal('0px');

      el.position = 'top-of-left';
      expect(await updateSpacing('padding-bottom', el, pointingFrame)).to.equal('1px');

      el.position = 'bottom-of-left';
      expect(await updateSpacing('padding-top', el, pointingFrame)).to.equal('1px');

      el.position = 'center-of-left';
      expect(await updateSpacing('padding-top', el, pointingFrame)).to.equal('0px');
      expect(await updateSpacing('padding-bottom', el, pointingFrame, false)).to.equal('0px');
    });

    it('should add negative margin to the host if spacing is required is negative', async () => {
      const el = await fixture(html`
        <lion-popup position="top-of-right" style="position: absolute; margin: 240px;">
          <lion-pointing-frame slot="content">
            <div>
              <div>Hello, Planet!</div>
            </div>
          </lion-pointing-frame>
          <button style="width: 100px; height: 40px;" slot="invoker">Click me!</button>
        </lion-popup>
      `);
      el._show();
      await nextFrame();
      const lionPointingFrame = el.querySelector('lion-pointing-frame');
      expect(await updateSpacing('margin-top', el, lionPointingFrame, false)).to.equal('4px');

      el.position = 'bottom-of-right';
      expect(await updateSpacing('margin-top', el, lionPointingFrame)).to.equal('-4px');

      el.position = 'center-of-right';
      expect(await updateSpacing('margin-bottom', el, lionPointingFrame)).to.equal('0px');
      expect(await updateSpacing('margin-top', el, lionPointingFrame, false)).to.equal('0px');

      el.position = 'top-of-left';
      expect(await updateSpacing('margin-top', el, lionPointingFrame)).to.equal('4px');

      el.position = 'bottom-of-left';
      expect(await updateSpacing('margin-top', el, lionPointingFrame)).to.equal('-4px');

      el.position = 'center-of-left';
      expect(await updateSpacing('margin-bottom', el, lionPointingFrame)).to.equal('0px');
      expect(await updateSpacing('margin-top', el, lionPointingFrame, false)).to.equal('0px');
    });

    it('should add some extra pointing-frame padding based on pointer dimensions', async () => {
      const el = await fixture(html`
        <lion-popup position="center-of-top" style="position: absolute; margin: 240px;">
          <lion-pointing-frame slot="content">
            <div>
              <div>Hello, Planet!</div>
            </div>
          </lion-pointing-frame>
          <button style="width: 100px; height: 40px;" slot="invoker">Click me!</button>
        </lion-popup>
      `);
      el._show();
      await nextFrame();
      const lionPointingFrame = el.querySelector('lion-pointing-frame');
      const pointingFrame = lionPointingFrame.shadowRoot.querySelector('.pointing-frame');
      const iconHeight = lionPointingFrame.shadowRoot
        .querySelector('slot[name="pointer"] svg')
        .getAttribute('height');

      expect(await updateSpacing('padding-bottom', el, pointingFrame, false)).to.equal(iconHeight);

      el.position = 'center-of-bottom';
      expect(await updateSpacing('padding-top', el, pointingFrame)).to.equal(iconHeight);

      el.position = 'center-of-right';
      expect(await updateSpacing('padding-left', el, pointingFrame)).to.equal(iconHeight);

      el.position = 'center-of-left';
      expect(await updateSpacing('padding-right', el, pointingFrame)).to.equal(iconHeight);
    });
  });

  describe('Position of pointer', () => {
    /**
     * invoker-height = 40px, then at half it is 20px.
     * pointer-width = 16px, then at half it is 8px.
     * distance-from-edge = 16px.
     */
    it('should adjust pointer icon position based on the position and invoker-width', async () => {
      const el = await fixture(html`
        <lion-popup position="right-of-top" style="position:absolute; margin: 240px;">
          <lion-pointing-frame slot="content">
            <div style="width: 100px; height: 20px;">
              <div>Hello, Planet!</div>
            </div>
          </lion-pointing-frame>
          <button slot="invoker" style="width: 100px; height: 40px;">Click me!</button>
        </lion-popup>
      `);

      el._show();
      await aTimeout;
      await el.updateComplete;

      const lionPointingFrame = el.querySelector('lion-pointing-frame');
      const pointerIcon = lionPointingFrame.shadowRoot.querySelector('slot[name="pointer"]');

      expect(await updateSpacing('left', el, pointerIcon)).to.equal('42px');

      el.position = 'left-of-top';
      expect(await updateSpacing('right', el, pointerIcon)).to.equal('42px');

      el.position = 'right-of-bottom';
      expect(await updateSpacing('left', el, pointerIcon)).to.equal('42px');

      el.position = 'left-of-bottom';
      expect(await updateSpacing('right', el, pointerIcon)).to.equal('42px');

      el.position = 'center-of-left';
      expect(await updateSpacing('top', el, pointerIcon)).to.equal('6px');
      expect(await updateSpacing('right', el, pointerIcon)).to.equal('-4px');

      el.position = 'center-of-right';
      expect(await updateSpacing('top', el, pointerIcon)).to.equal('6px');
      expect(await updateSpacing('left', el, pointerIcon)).to.equal('-4px');
    });
  });

  describe('Passing a custom pointer', () => {
    it('should allow you to pass a custom pointer', async () => {
      const el = await fixture(html`
        <lion-popup position="right-of-top" style="position:absolute; margin: 240px;">
          <lion-pointing-frame slot="content">
            <div>
              <div>Hello, Planet!</div>
            </div>
            <div slot="pointer">
              ${unsafeHTML(customPointerSvg)}
            </div>
          </lion-pointing-frame>
          <button slot="invoker" style="width: 100px; height: 40px;">Click me!</button>
        </lion-popup>
      `);
      el._show();
      await aTimeout;
      await el.updateComplete;
      const lionPointingFrame = el.querySelector('lion-pointing-frame');
      const pointingFrame = lionPointingFrame.shadowRoot.querySelector('.pointing-frame');

      // Assuming 10px height of the customPointerSvg
      expect(window.getComputedStyle(pointingFrame).getPropertyValue('padding-bottom')).to.equal(
        '10px',
      );

      const pointerEl = lionPointingFrame.$$slot('pointer').firstElementChild;
      expect(pointerEl).dom.to.equal(customPointerSvg);
    });

    it('has a default pointer', async () => {
      const el = await fixture(html`
        <lion-popup position="right-of-top" style="position:absolute; margin: 240px;">
          <lion-pointing-frame slot="content">
            <div>
              <div>Hello, Planet!</div>
            </div>
          </lion-pointing-frame>
          <button slot="invoker" style="width: 100px; height: 40px;">Click me!</button>
        </lion-popup>
      `);
      const lionPointingFrame = el.querySelector('lion-pointing-frame');
      const icon = lionPointingFrame.shadowRoot.querySelector('slot[name="pointer"]');
      expect(icon.firstElementChild).dom.to.equal(pointerSvg);
    });
  });
});
