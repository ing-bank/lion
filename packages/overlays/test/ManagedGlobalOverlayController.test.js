import { expect, html } from '@open-wc/testing';

import { GlobalOverlayController } from '../src/GlobalOverlayController.js';
import { overlays } from '../src/overlays.js';

function getRootNode() {
  return document.querySelector('.global-overlays');
}

function getRenderedContainers() {
  const rootNode = getRootNode();
  return rootNode ? Array.from(rootNode.children) : [];
}

function getRenderedContainer(index) {
  return getRenderedContainers()[index];
}

function getRenderedOverlay(index) {
  const container = getRenderedContainer(index);
  return container ? container.children[0] : null;
}

function cleanup() {
  document.body.removeAttribute('style');
  overlays.teardown();
}

describe('Managed GlobalOverlayController', () => {
  afterEach(cleanup);

  describe('hasBackdrop', () => {
    it('adds and stacks backdrops if .hasBackdrop is enabled', async () => {
      const ctrl0 = overlays.add(
        new GlobalOverlayController({
          hasBackdrop: true,
          contentTemplate: () => html`
            <p>Content0</p>
          `,
        }),
      );
      await ctrl0.show();
      expect(ctrl0.backdropNode).to.have.class('global-overlays__backdrop');

      const ctrl1 = overlays.add(
        new GlobalOverlayController({
          hasBackdrop: false,
          contentTemplate: () => html`
            <p>Content1</p>
          `,
        }),
      );
      await ctrl1.show();
      expect(ctrl0.backdropNode).to.have.class('global-overlays__backdrop');
      expect(ctrl1.backdropNode).to.be.undefined;

      const ctrl2 = overlays.add(
        new GlobalOverlayController({
          hasBackdrop: true,
          contentTemplate: () => html`
            <p>Content2</p>
          `,
        }),
      );
      await ctrl2.show();

      expect(ctrl0.backdropNode).to.have.class('global-overlays__backdrop');
      expect(ctrl1.backdropNode).to.be.undefined;
      expect(ctrl2.backdropNode).to.have.class('global-overlays__backdrop');
    });
  });

  describe('isBlocking', () => {
    it('prevents showing of other overlays', async () => {
      const ctrl0 = overlays.add(
        new GlobalOverlayController({
          isBlocking: false,
          contentTemplate: () => html`
            <p>Content0</p>
          `,
        }),
      );
      await ctrl0.show();

      const ctrl1 = overlays.add(
        new GlobalOverlayController({
          isBlocking: false,
          contentTemplate: () => html`
            <p>Content1</p>
          `,
        }),
      );
      await ctrl1.show();

      const ctrl2 = overlays.add(
        new GlobalOverlayController({
          isBlocking: true,
          contentTemplate: () => html`
            <p>Content2</p>
          `,
        }),
      );
      await ctrl2.show();

      const ctrl3 = overlays.add(
        new GlobalOverlayController({
          isBlocking: false,
          contentTemplate: () => html`
            <p>Content3</p>
          `,
        }),
      );
      await ctrl3.show();

      expect(getRenderedOverlay(0)).to.not.be.displayed;
      expect(getRenderedOverlay(1)).to.not.be.displayed;
      expect(getRenderedOverlay(2)).to.be.displayed;
      expect(getRenderedOverlay(3)).to.not.be.displayed;
    });

    it('keeps backdrop status when used in combination with blocking', async () => {
      const ctrl0 = overlays.add(
        new GlobalOverlayController({
          isBlocking: false,
          hasBackdrop: true,
          contentTemplate: () => html`
            <p>Content0</p>
          `,
        }),
      );
      await ctrl0.show();

      const ctrl1 = overlays.add(
        new GlobalOverlayController({
          isBlocking: false,
          hasBackdrop: true,
          contentTemplate: () => html`
            <p>Content1</p>
          `,
        }),
      );
      await ctrl1.show();
      await ctrl1.hide();
      expect(ctrl0.hasActiveBackdrop).to.be.true;
      expect(ctrl1.hasActiveBackdrop).to.be.false;

      await ctrl1.show();
      expect(ctrl0.hasActiveBackdrop).to.be.true;
      expect(ctrl1.hasActiveBackdrop).to.be.true;
    });
  });

  describe('trapsKeyboardFocus (for a11y)', () => {
    it('adds attributes inert and aria-hidden="true" on all siblings of rootNode if an overlay is shown', async () => {
      const ctrl = overlays.add(
        new GlobalOverlayController({
          trapsKeyboardFocus: true,
          contentTemplate: () => html`
            <p>Content</p>
          `,
        }),
      );

      const sibling1 = document.createElement('div');
      const sibling2 = document.createElement('div');
      document.body.insertBefore(sibling1, getRootNode());
      document.body.appendChild(sibling2);

      await ctrl.show();

      [sibling1, sibling2].forEach(sibling => {
        expect(sibling).to.have.attribute('aria-hidden', 'true');
        expect(sibling).to.have.attribute('inert');
      });
      expect(getRenderedOverlay(0).hasAttribute('aria-hidden')).to.be.false;
      expect(getRenderedOverlay(0).hasAttribute('inert')).to.be.false;

      await ctrl.hide();

      [sibling1, sibling2].forEach(sibling => {
        expect(sibling).to.not.have.attribute('aria-hidden');
        expect(sibling).to.not.have.attribute('inert');
      });

      // cleanup
      document.body.removeChild(sibling1);
      document.body.removeChild(sibling2);
    });

    /**
     * style.userSelect:
     *   - chrome: 'none'
     *   - rest: undefined
     *
     * style.pointerEvents:
     *   - chrome: auto
     *   - IE11: visiblePainted
     */
    it('disables pointer events and selection on inert elements', async () => {
      const ctrl = overlays.add(
        new GlobalOverlayController({
          trapsKeyboardFocus: true,
          contentTemplate: () => html`
            <p>Content</p>
          `,
        }),
      );

      // show+hide are needed to create a root node
      await ctrl.show();
      await ctrl.hide();

      const sibling1 = document.createElement('div');
      const sibling2 = document.createElement('div');
      document.body.insertBefore(sibling1, getRootNode());
      document.body.appendChild(sibling2);

      await ctrl.show();

      [sibling1, sibling2].forEach(sibling => {
        expect(window.getComputedStyle(sibling).userSelect).to.be.oneOf(['none', undefined]);
        expect(window.getComputedStyle(sibling).pointerEvents).to.equal('none');
      });
      expect(window.getComputedStyle(getRenderedOverlay(0)).userSelect).to.be.oneOf([
        'auto',
        undefined,
      ]);
      expect(window.getComputedStyle(getRenderedOverlay(0)).pointerEvents).to.be.oneOf([
        'auto',
        'visiblePainted',
      ]);

      await ctrl.hide();

      [sibling1, sibling2].forEach(sibling => {
        expect(window.getComputedStyle(sibling).userSelect).to.be.oneOf(['auto', undefined]);
        expect(window.getComputedStyle(sibling).pointerEvents).to.be.oneOf([
          'auto',
          'visiblePainted',
        ]);
      });

      // cleanup
      document.body.removeChild(sibling1);
      document.body.removeChild(sibling2);
    });

    it('keeps focus within overlay with multiple overlays with all traps on true', async () => {
      const ctrl0 = overlays.add(
        new GlobalOverlayController({
          trapsKeyboardFocus: true,
          contentTemplate: () => html`
            <div>
              <input id="input0" /><button id="button0">Button0</button><a id="a0">Link0</a>
            </div>
          `,
        }),
      );

      const ctrl1 = overlays.add(
        new GlobalOverlayController({
          trapsKeyboardFocus: true,
          contentTemplate: () => html`
            <div>
              <input id="input1" /><button id="button1">Button1</button><a id="a1">Link1</a>
            </div>
          `,
        }),
      );

      await ctrl0.show();
      await ctrl1.show();
      expect(ctrl0.hasActiveTrapsKeyboardFocus).to.be.false;
      expect(ctrl1.hasActiveTrapsKeyboardFocus).to.be.true;

      await ctrl1.hide();
      expect(ctrl0.hasActiveTrapsKeyboardFocus).to.be.true;
      expect(ctrl1.hasActiveTrapsKeyboardFocus).to.be.false;
    });
  });
});
