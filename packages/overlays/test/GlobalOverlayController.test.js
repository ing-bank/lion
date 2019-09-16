import { expect, fixture, html } from '@open-wc/testing';
import { keyCodes } from '../src/utils/key-codes.js';
import { simulateTab } from '../src/utils/simulate-tab.js';

import { GlobalOverlayController } from '../src/GlobalOverlayController.js';
import { overlays } from '../src/overlays.js';
import { runBaseOverlaySuite } from '../test-suites/BaseOverlayController.suite.js';

function getRootNode() {
  return document.querySelector('.global-overlays');
}

function getRenderedContainers() {
  const rootNode = getRootNode();
  return rootNode ? Array.from(rootNode.children) : [];
}

function isEqualOrHasParent(element, parentElement) {
  if (!parentElement) {
    return false;
  }

  if (element === parentElement) {
    return true;
  }

  return isEqualOrHasParent(element, parentElement.parentElement);
}

function getTopContainer() {
  return getRenderedContainers().find(container => {
    const rect = container.getBoundingClientRect();
    const topElement = document.elementFromPoint(Math.ceil(rect.left), Math.ceil(rect.top));
    return isEqualOrHasParent(container, topElement);
  });
}

function getTopOverlay() {
  const topContainer = getTopContainer();
  return topContainer ? topContainer.children[0] : null;
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

describe('GlobalOverlayController', () => {
  afterEach(cleanup);

  describe('extends BaseOverlayController', () => {
    runBaseOverlaySuite((...args) => overlays.add(new GlobalOverlayController(...args)));
  });

  describe('basics', () => {
    // part of BaseController
    it.skip('creates a controller with methods: show, hide, sync', () => {
      const controller = new GlobalOverlayController();
      expect(controller.show).to.be.a('function');
      expect(controller.hide).to.be.a('function');
      expect(controller.sync).to.be.a('function');
    });

    // this is a micro optimization; 1 global root node for all overlays is ok to create and keep right from the start
    it.skip('creates a root node in body when first controller is shown', async () => {
      const controller = overlays.add(
        new GlobalOverlayController({
          contentTemplate: () => html`
            <p>Content</p>
          `,
        }),
      );
      expect(document.body.querySelectorAll('.global-overlays').length).to.equal(0);
      await controller.show();
      expect(document.body.querySelectorAll('.global-overlays').length).to.equal(1);
      expect(document.body.querySelector('.global-overlays')).to.equal(
        GlobalOverlayController._rootNode,
      );
      expect(document.body.querySelector('.global-overlays').parentElement).to.equal(document.body);
      expect(GlobalOverlayController._rootNode.children.length).to.equal(1);
    });

    it('renders an overlay from the lit-html based contentTemplate when showing', async () => {
      const controller = overlays.add(
        new GlobalOverlayController({
          contentTemplate: () => html`
            <p>my content</p>
          `,
        }),
      );
      await controller.show();
      expect(getRootNode().children.length).to.equal(1);
      expect(getRootNode().children[0]).to.have.trimmed.text('my content');
    });

    it('removes the overlay from DOM when hiding', async () => {
      const controller = overlays.add(
        new GlobalOverlayController({
          contentTemplate: () => html`
            <p>Content</p>
          `,
        }),
      );

      await controller.show();
      expect(getRenderedContainers().length).to.equal(1);
      expect(getRenderedOverlay(0).tagName).to.equal('P');
      expect(getRenderedOverlay(0).textContent).to.equal('Content');
      expect(getTopContainer()).to.equal(getRenderedContainer(0));

      await controller.hide();
      expect(getRenderedContainers().length).to.equal(0);
      expect(getTopContainer()).to.not.exist;
    });

    it('exposes isShown state for reading', async () => {
      const controller = overlays.add(
        new GlobalOverlayController({
          contentTemplate: () => html`
            <p>Content</p>
          `,
        }),
      );

      expect(controller.isShown).to.equal(false);

      await controller.show();
      expect(controller.isShown).to.equal(true);

      await controller.hide();
      expect(controller.isShown).to.equal(false);
    });

    it('puts the latest shown overlay always on top', async () => {
      const controller0 = overlays.add(
        new GlobalOverlayController({
          contentTemplate: () => html`
            <p>Content0</p>
          `,
        }),
      );
      const controller1 = overlays.add(
        new GlobalOverlayController({
          contentTemplate: () => html`
            <p>Content1</p>
          `,
        }),
      );

      await controller0.show();
      await controller1.show();
      await controller0.show();

      expect(getRenderedContainers().length).to.equal(2);
      expect(getRenderedOverlay(0).tagName).to.equal('P');
      expect(getRenderedOverlay(0).textContent).to.equal('Content0');
      expect(getRenderedOverlay(1).tagName).to.equal('P');
      expect(getRenderedOverlay(1).textContent).to.equal('Content1');
      expect(getTopOverlay().textContent).to.equal('Content0');
    });

    it('does not recreate the overlay elements when calling show multiple times', async () => {
      const controller = overlays.add(
        new GlobalOverlayController({
          contentTemplate: () => html`
            <p>Content</p>
          `,
        }),
      );

      await controller.show();
      expect(getRenderedContainers().length).to.equal(1);
      const initialContainer = getRenderedContainer(0);
      const initialOverlay = getRenderedOverlay(0);

      await controller.show();
      expect(getRenderedContainers().length).to.equal(1);
      expect(getRenderedContainer(0)).to.equal(initialContainer);
      expect(getRenderedOverlay(0)).to.equal(initialOverlay);
    });

    // why would we do this? right now keep the renderTarget wrapper, disconnect and
    // reconnect when needed - but do not recreate it every time
    it.skip('recreates the overlay elements when hiding and showing again', async () => {
      const controller = overlays.add(
        new GlobalOverlayController({
          contentTemplate: () => html`
            <p>Content</p>
          `,
        }),
      );

      await controller.show();
      expect(getRenderedContainers().length).to.equal(1);
      const initialContainer = getRenderedContainer(0);
      const initialOverlay = getRenderedOverlay(0);

      await controller.hide();
      await controller.show();
      expect(getRenderedContainers().length).to.equal(1);
      expect(getRenderedContainer(0)).to.not.equal(initialContainer);
      expect(getRenderedOverlay(0)).to.not.equal(initialOverlay);
    });

    it('supports .sync(isShown, data)', async () => {
      const controller = overlays.add(
        new GlobalOverlayController({
          contentTemplate: ({ text = 'default' } = {}) => html`
            <p>${text}</p>
          `,
        }),
      );

      await controller.sync({ isShown: true, data: { text: 'hello world' } });
      expect(getRenderedContainers().length).to.equal(1);
      expect(getRenderedOverlay(0).textContent).to.equal('hello world');

      await controller.sync({ isShown: true, data: { text: 'goodbye world' } });
      expect(getRenderedContainers().length).to.equal(1);
      expect(getRenderedOverlay(0).textContent).to.equal('goodbye world');

      await controller.sync({ isShown: false, data: { text: 'goodbye world' } });
      expect(getRenderedContainers().length).to.equal(0);
    });
  });

  describe('elementToFocusAfterHide', () => {
    it('focuses body when hiding by default', async () => {
      const controller = overlays.add(
        new GlobalOverlayController({
          contentTemplate: () => html`
            <div><input />=</div>
          `,
        }),
      );

      await controller.show();
      const input = getTopOverlay().querySelector('input');
      input.focus();
      expect(document.activeElement).to.equal(input);

      await controller.hide();
      expect(document.activeElement).to.equal(document.body);
    });

    it('supports elementToFocusAfterHide option to focus it when hiding', async () => {
      const input = await fixture(html`
        <input />
      `);

      const controller = overlays.add(
        new GlobalOverlayController({
          elementToFocusAfterHide: input,
          contentTemplate: () => html`
            <div><textarea></textarea></div>
          `,
        }),
      );

      await controller.show();
      const textarea = getTopOverlay().querySelector('textarea');
      textarea.focus();
      expect(document.activeElement).to.equal(textarea);

      await controller.hide();
      expect(document.activeElement).to.equal(input);
    });

    it('allows to set elementToFocusAfterHide on show', async () => {
      const input = await fixture(html`
        <input />
      `);

      const controller = overlays.add(
        new GlobalOverlayController({
          contentTemplate: () => html`
            <div><textarea></textarea></div>
          `,
        }),
      );

      await controller.show(input);
      const textarea = getTopOverlay().querySelector('textarea');
      textarea.focus();
      expect(document.activeElement).to.equal(textarea);

      await controller.hide();
      expect(document.activeElement).to.equal(input);
    });

    it('allows to set elementToFocusAfterHide on sync', async () => {
      const input = await fixture(html`
        <input />
      `);

      const controller = overlays.add(
        new GlobalOverlayController({
          contentTemplate: () => html`
            <div><textarea></textarea></div>
          `,
        }),
      );

      await controller.sync({ isShown: true, elementToFocusAfterHide: input });
      const textarea = getTopOverlay().querySelector('textarea');
      textarea.focus();
      expect(document.activeElement).to.equal(textarea);

      await controller.hide();
      expect(document.activeElement).to.equal(input);

      await controller.sync({ isShown: true, elementToFocusAfterHide: input });
      const textarea2 = getTopOverlay().querySelector('textarea');
      textarea2.focus();
      expect(document.activeElement).to.equal(textarea2);

      await controller.sync({ isShown: false });
      expect(document.activeElement).to.equal(input);
    });
  });

  describe('trapsKeyboardFocus (for a11y)', () => {
    it('focuses the overlay on show', async () => {
      const controller = overlays.add(
        new GlobalOverlayController({
          trapsKeyboardFocus: true,
          contentTemplate: () => html`
            <p>Content</p>
          `,
        }),
      );
      await controller.show();
      expect(getRenderedOverlay(0)).to.equal(document.activeElement);
    });

    it('keeps focus within the overlay e.g. you can not tab out by accident', async () => {
      const controller = overlays.add(
        new GlobalOverlayController({
          trapsKeyboardFocus: true,
          contentTemplate: () => html`
            <div><input /><input /></div>
          `,
        }),
      );
      await controller.show();

      const elOutside = await fixture(html`
        <button>click me</button>
      `);
      const input1 = getRenderedOverlay(0).querySelectorAll('input')[0];
      const input2 = getRenderedOverlay(0).querySelectorAll('input')[1];

      input2.focus();
      // this mimics a tab within the contain-focus system used
      const event = new CustomEvent('keydown', { detail: 0, bubbles: true });
      event.keyCode = keyCodes.tab;
      window.dispatchEvent(event);

      expect(elOutside).to.not.equal(document.activeElement);
      expect(input1).to.equal(document.activeElement);
    });

    it('allows to move the focus outside of the overlay if trapsKeyboardFocus is disabled', async () => {
      const controller = overlays.add(
        new GlobalOverlayController({
          trapsKeyboardFocus: false,
          contentTemplate: () => html`
            <div><input /></div>
          `,
        }),
      );
      await controller.show();

      const elOutside = await fixture(html`
        <input />
      `);
      const input = getRenderedOverlay(0).querySelector('input');

      input.focus();
      simulateTab();

      expect(elOutside).to.equal(document.activeElement);
    });
  });

  describe('preventsScroll', () => {
    it('prevent scrolling the background', async () => {
      const controller = overlays.add(
        new GlobalOverlayController({
          preventsScroll: true,
          contentTemplate: () => html`
            <p>Content</p>
          `,
        }),
      );

      await controller.show();
      controller.updateComplete;
      expect(getComputedStyle(document.body).overflow).to.equal('hidden');

      await controller.hide();
      controller.updateComplete;
      expect(getComputedStyle(document.body).overflow).to.equal('visible');
    });
  });

  describe('hidesOnEsc', () => {
    it('hides when Escape is pressed', async () => {
      const ctrl = overlays.add(
        new GlobalOverlayController({
          hidesOnEsc: true,
          contentTemplate: () => html`
            <p>Content</p>
          `,
        }),
      );
      await ctrl.show();
      expect(ctrl.isShown).to.be.true;

      ctrl.contentNode.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape' }));
      expect(ctrl.isShown).to.be.false;
    });
  });

  describe('hasBackdrop', () => {
    it('has no backdrop by default', async () => {
      const ctrl = overlays.add(
        new GlobalOverlayController({
          contentTemplate: () => html`
            <p>Content</p>
          `,
        }),
      );
      await ctrl.show();
      expect(ctrl.backdropNode).to.be.undefined;
    });

    it('supports a backdrop option', async () => {
      const ctrl = overlays.add(
        new GlobalOverlayController({
          hasBackdrop: false,
          contentTemplate: () => html`
            <p>Content</p>
          `,
        }),
      );
      await ctrl.show();
      expect(ctrl.backdropNode).to.be.undefined;
      await ctrl.hide();

      const controllerWithBackdrop = overlays.add(
        new GlobalOverlayController({
          hasBackdrop: true,
          contentTemplate: () => html`
            <p>Content</p>
          `,
        }),
      );
      await controllerWithBackdrop.show();
      expect(controllerWithBackdrop.backdropNode).to.have.class('global-overlays__backdrop');
    });

    it('reenables the backdrop when shown/hidden/shown', async () => {
      const ctrl = overlays.add(
        new GlobalOverlayController({
          hasBackdrop: true,
          contentTemplate: () => html`
            <p>Content</p>
          `,
        }),
      );
      await ctrl.show();
      expect(ctrl.backdropNode).to.have.class('global-overlays__backdrop');
      await ctrl.hide();
      await ctrl.show();
      expect(ctrl.backdropNode).to.have.class('global-overlays__backdrop');
    });
  });
});
