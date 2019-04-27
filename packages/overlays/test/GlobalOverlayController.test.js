import { expect, fixture, html } from '@open-wc/testing';
import { keyUpOn } from '@polymer/iron-test-helpers/mock-interactions.js';
import { keyCodes } from '../src/utils/key-codes.js';
import { simulateTab } from '../src/utils/simulate-tab.js';
import { getDeepActiveElement } from '../src/utils/get-deep-active-element.js';

import { GlobalOverlayController } from '../src/GlobalOverlayController.js';

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
  if (GlobalOverlayController._rootNode) {
    GlobalOverlayController._rootNode.parentElement.removeChild(GlobalOverlayController._rootNode);
    GlobalOverlayController._rootNode = undefined;
  }
}

describe('GlobalOverlayController', () => {
  afterEach(cleanup);

  describe('basics', () => {
    it('creates a controller with methods: show, hide, sync', () => {
      const controller = new GlobalOverlayController();
      expect(controller.show).to.be.a('function');
      expect(controller.hide).to.be.a('function');
      expect(controller.sync).to.be.a('function');
    });

    it('creates a root node in body when first controller is shown', () => {
      const controller = new GlobalOverlayController({
        contentTemplate: () =>
          html`
            <p>Content</p>
          `,
      });
      expect(document.body.querySelectorAll('.global-overlays').length).to.equal(0);
      controller.show();
      expect(document.body.querySelectorAll('.global-overlays').length).to.equal(1);
      expect(document.body.querySelector('.global-overlays')).to.equal(
        GlobalOverlayController._rootNode,
      );
      expect(document.body.querySelector('.global-overlays').parentElement).to.equal(document.body);
      expect(GlobalOverlayController._rootNode.children.length).to.equal(1);
    });

    it('renders an overlay from the lit-html based contentTemplate when showing', () => {
      const controller = new GlobalOverlayController({
        contentTemplate: () =>
          html`
            <p>Content</p>
          `,
      });
      controller.show();
      expect(getRootNode().children.length).to.equal(1);
      expect(getRootNode().children[0].classList.contains('global-overlays__overlay')).to.be.true;
      expect(getRootNode().children[0].children.length).to.equal(1);
      expect(getRootNode().children[0].children[0].tagName).to.equal('P');
      expect(getRootNode().children[0].children[0].textContent).to.equal('Content');
    });

    it('removes the overlay from DOM when hiding', () => {
      const controller = new GlobalOverlayController({
        contentTemplate: () =>
          html`
            <p>Content</p>
          `,
      });

      controller.show();
      expect(getRenderedContainers().length).to.equal(1);
      expect(getRenderedOverlay(0).tagName).to.equal('P');
      expect(getRenderedOverlay(0).textContent).to.equal('Content');
      expect(getTopContainer()).to.equal(getRenderedContainer(0));

      controller.hide();
      expect(getRenderedContainers().length).to.equal(0);
      expect(getTopContainer()).to.not.exist;
    });

    it('exposes isShown state for reading', () => {
      const controller = new GlobalOverlayController({
        contentTemplate: () =>
          html`
            <p>Content</p>
          `,
      });

      expect(controller.isShown).to.equal(false);

      controller.show();
      expect(controller.isShown).to.equal(true);

      controller.hide();
      expect(controller.isShown).to.equal(false);
    });

    it('puts the latest shown overlay always on top', () => {
      const controller0 = new GlobalOverlayController({
        contentTemplate: () =>
          html`
            <p>Content0</p>
          `,
      });
      const controller1 = new GlobalOverlayController({
        contentTemplate: () =>
          html`
            <p>Content1</p>
          `,
      });

      controller0.show();
      controller1.show();
      controller0.show();

      expect(getRenderedContainers().length).to.equal(2);
      expect(getRenderedOverlay(0).tagName).to.equal('P');
      expect(getRenderedOverlay(0).textContent).to.equal('Content0');
      expect(getRenderedOverlay(1).tagName).to.equal('P');
      expect(getRenderedOverlay(1).textContent).to.equal('Content1');
      expect(getTopOverlay().textContent).to.equal('Content0');
    });

    it('does not recreate the overlay elements when calling show multiple times', () => {
      const controller = new GlobalOverlayController({
        contentTemplate: () =>
          html`
            <p>Content</p>
          `,
      });

      controller.show();
      expect(getRenderedContainers().length).to.equal(1);
      const initialContainer = getRenderedContainer(0);
      const initialOverlay = getRenderedOverlay(0);

      controller.show();
      expect(getRenderedContainers().length).to.equal(1);
      expect(getRenderedContainer(0)).to.equal(initialContainer);
      expect(getRenderedOverlay(0)).to.equal(initialOverlay);
    });

    it('recreates the overlay elements when hiding and showing again', () => {
      const controller = new GlobalOverlayController({
        contentTemplate: () =>
          html`
            <p>Content</p>
          `,
      });

      controller.show();
      expect(getRenderedContainers().length).to.equal(1);
      const initialContainer = getRenderedContainer(0);
      const initialOverlay = getRenderedOverlay(0);

      controller.hide();
      controller.show();
      expect(getRenderedContainers().length).to.equal(1);
      expect(getRenderedContainer(0)).to.not.equal(initialContainer);
      expect(getRenderedOverlay(0)).to.not.equal(initialOverlay);
    });

    it('supports syncing of shown state, data', () => {
      const controller = new GlobalOverlayController({
        contentTemplate: data =>
          html`
            <p>${data.text}</p>
          `,
      });

      controller.sync({ isShown: true, data: { text: 'hello world' } });
      expect(getRenderedContainers().length).to.equal(1);
      expect(getRenderedOverlay(0).textContent).to.equal('hello world');

      controller.sync({ isShown: true, data: { text: 'goodbye world' } });
      expect(getRenderedContainers().length).to.equal(1);
      expect(getRenderedOverlay(0).textContent).to.equal('goodbye world');

      controller.sync({ isShown: false, data: { text: 'goodbye world' } });
      expect(getRenderedContainers().length).to.equal(0);
    });
  });

  describe('elementToFocusAfterHide', () => {
    it('focuses body when hiding by default', () => {
      const controller = new GlobalOverlayController({
        contentTemplate: () =>
          html`
            <div><input />=</div>
          `,
      });

      controller.show();
      const input = getTopOverlay().querySelector('input');
      input.focus();
      expect(document.activeElement).to.equal(input);

      controller.hide();
      expect(document.activeElement).to.equal(document.body);
    });

    it('supports elementToFocusAfterHide option to focus it when hiding', async () => {
      const input = await fixture(
        html`
          <input />
        `,
      );

      const controller = new GlobalOverlayController({
        elementToFocusAfterHide: input,
        contentTemplate: () =>
          html`
            <div><textarea></textarea></div>
          `,
      });

      controller.show();
      const textarea = getTopOverlay().querySelector('textarea');
      textarea.focus();
      expect(document.activeElement).to.equal(textarea);

      controller.hide();
      expect(document.activeElement).to.equal(input);
    });

    it('allows to set elementToFocusAfterHide on show', async () => {
      const input = await fixture(
        html`
          <input />
        `,
      );

      const controller = new GlobalOverlayController({
        contentTemplate: () =>
          html`
            <div><textarea></textarea></div>
          `,
      });

      controller.show(input);
      const textarea = getTopOverlay().querySelector('textarea');
      textarea.focus();
      expect(document.activeElement).to.equal(textarea);

      controller.hide();
      expect(document.activeElement).to.equal(input);
    });

    it('allows to set elementToFocusAfterHide on sync', async () => {
      const input = await fixture(
        html`
          <input />
        `,
      );

      const controller = new GlobalOverlayController({
        contentTemplate: () =>
          html`
            <div><textarea></textarea></div>
          `,
      });

      controller.sync({ isShown: true, elementToFocusAfterHide: input });
      const textarea = getTopOverlay().querySelector('textarea');
      textarea.focus();
      expect(document.activeElement).to.equal(textarea);

      controller.hide();
      expect(document.activeElement).to.equal(input);

      controller.sync({ isShown: true, elementToFocusAfterHide: input });
      const textarea2 = getTopOverlay().querySelector('textarea');
      textarea2.focus();
      expect(document.activeElement).to.equal(textarea2);

      controller.sync({ isShown: false });
      expect(document.activeElement).to.equal(input);
    });
  });

  describe('hasBackdrop', () => {
    it('has no backdrop by default', () => {
      const controllerWithoutBackdrop = new GlobalOverlayController({
        contentTemplate: () =>
          html`
            <p>Content</p>
          `,
      });
      controllerWithoutBackdrop.show();
      expect(getRenderedContainer(0).classList.contains('global-overlays__backdrop')).to.be.false;
    });

    it('supports a backdrop option', () => {
      const controllerWithoutBackdrop = new GlobalOverlayController({
        hasBackdrop: false,
        contentTemplate: () =>
          html`
            <p>Content</p>
          `,
      });
      controllerWithoutBackdrop.show();
      expect(getRenderedContainer(0).classList.contains('global-overlays__backdrop')).to.be.false;
      controllerWithoutBackdrop.hide();

      const controllerWithBackdrop = new GlobalOverlayController({
        hasBackdrop: true,
        contentTemplate: () =>
          html`
            <p>Content</p>
          `,
      });
      controllerWithBackdrop.show();
      expect(getRenderedContainer(0).classList.contains('global-overlays__backdrop')).to.be.true;
    });

    it('adds a backdrop to the top most overlay with hasBackdrop enabled', () => {
      const controller0 = new GlobalOverlayController({
        hasBackdrop: true,
        contentTemplate: () =>
          html`
            <p>Content0</p>
          `,
      });
      controller0.show();
      expect(getRenderedContainer(0).classList.contains('global-overlays__backdrop')).to.be.true;

      const controller1 = new GlobalOverlayController({
        hasBackdrop: false,
        contentTemplate: () =>
          html`
            <p>Content1</p>
          `,
      });
      controller1.show();
      expect(getRenderedContainer(0).classList.contains('global-overlays__backdrop')).to.be.true;
      expect(getRenderedContainer(1).classList.contains('global-overlays__backdrop')).to.be.false;

      const controller2 = new GlobalOverlayController({
        hasBackdrop: true,
        contentTemplate: () =>
          html`
            <p>Content2</p>
          `,
      });
      controller2.show();
      expect(getRenderedContainer(0).classList.contains('global-overlays__backdrop')).to.be.false;
      expect(getRenderedContainer(1).classList.contains('global-overlays__backdrop')).to.be.false;
      expect(getRenderedContainer(2).classList.contains('global-overlays__backdrop')).to.be.true;
    });

    it('restores the backdrop to the next element with hasBackdrop when hiding', () => {
      const controller0 = new GlobalOverlayController({
        hasBackdrop: true,
        contentTemplate: () =>
          html`
            <p>Content0</p>
          `,
      });
      controller0.show();

      const controller1 = new GlobalOverlayController({
        hasBackdrop: false,
        contentTemplate: () =>
          html`
            <p>Content1</p>
          `,
      });
      controller1.show();

      const controller2 = new GlobalOverlayController({
        hasBackdrop: true,
        contentTemplate: () =>
          html`
            <p>Content2</p>
          `,
      });
      controller2.show();

      controller2.hide();

      expect(getRenderedContainer(0).classList.contains('global-overlays__backdrop')).to.be.true;
      expect(getRenderedContainer(1).classList.contains('global-overlays__backdrop')).to.be.false;
    });
  });

  describe('isBlocking', () => {
    it('prevents showing of other overlays', () => {
      const controller0 = new GlobalOverlayController({
        isBlocking: false,
        contentTemplate: () =>
          html`
            <p>Content0</p>
          `,
      });
      controller0.show();

      const controller1 = new GlobalOverlayController({
        isBlocking: false,
        contentTemplate: () =>
          html`
            <p>Content1</p>
          `,
      });
      controller1.show();

      const controller2 = new GlobalOverlayController({
        isBlocking: true,
        contentTemplate: () =>
          html`
            <p>Content2</p>
          `,
      });
      controller2.show();

      const controller3 = new GlobalOverlayController({
        isBlocking: false,
        contentTemplate: () =>
          html`
            <p>Content3</p>
          `,
      });
      controller3.show();

      expect(window.getComputedStyle(getRenderedContainer(0)).display).to.equal('none');
      expect(window.getComputedStyle(getRenderedContainer(1)).display).to.equal('none');
      expect(window.getComputedStyle(getRenderedContainer(2)).display).to.equal('block');
      expect(window.getComputedStyle(getRenderedContainer(3)).display).to.equal('none');
    });
  });

  describe('trapsKeyboardFocus (for a11y)', () => {
    it('adds attributes inert and aria-hidden="true" on all siblings of rootNode if an overlay is shown', () => {
      const controller = new GlobalOverlayController({
        trapsKeyboardFocus: true,
        contentTemplate: () =>
          html`
            <p>Content</p>
          `,
      });

      // show+hide are needed to create a root node
      controller.show();
      controller.hide();

      const sibling1 = document.createElement('div');
      const sibling2 = document.createElement('div');
      document.body.insertBefore(sibling1, getRootNode());
      document.body.appendChild(sibling2);

      controller.show();

      [sibling1, sibling2].forEach(sibling => {
        expect(sibling.getAttribute('aria-hidden')).to.equal('true');
        expect(sibling.hasAttribute('inert')).to.be.true;
      });
      expect(getRenderedOverlay(0).hasAttribute('aria-hidden')).to.be.false;
      expect(getRenderedOverlay(0).hasAttribute('inert')).to.be.false;

      controller.hide();

      [sibling1, sibling2].forEach(sibling => {
        expect(sibling.hasAttribute('aria-hidden')).to.be.false;
        expect(sibling.hasAttribute('inert')).to.be.false;
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
      const controller = new GlobalOverlayController({
        trapsKeyboardFocus: true,
        contentTemplate: () =>
          html`
            <p>Content</p>
          `,
      });

      // show+hide are needed to create a root node
      controller.show();
      controller.hide();

      const sibling1 = document.createElement('div');
      const sibling2 = document.createElement('div');
      document.body.insertBefore(sibling1, getRootNode());
      document.body.appendChild(sibling2);

      controller.show();

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

      controller.hide();

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

    it('focuses the overlay on show', () => {
      const controller = new GlobalOverlayController({
        trapsKeyboardFocus: true,
        contentTemplate: () =>
          html`
            <p>Content</p>
          `,
      });
      controller.show();
      expect(getRenderedOverlay(0)).to.equal(document.activeElement);
    });

    it('keeps focus within the overlay e.g. you can not tab out by accident', async () => {
      const controller = new GlobalOverlayController({
        trapsKeyboardFocus: true,
        contentTemplate: () =>
          html`
            <div><input /><input /></div>
          `,
      });
      controller.show();

      const elOutside = await fixture(
        html`
          <button>click me</button>
        `,
      );
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
      const controller = new GlobalOverlayController({
        trapsKeyboardFocus: false,
        contentTemplate: () =>
          html`
            <div><input /></div>
          `,
      });
      controller.show();

      const elOutside = await fixture(
        html`
          <input />
        `,
      );
      const input = getRenderedOverlay(0).querySelector('input');

      input.focus();
      simulateTab();

      expect(elOutside).to.equal(document.activeElement);
    });

    it.skip('keeps focus within overlay with multiple overlays with all traps on true', async () => {
      // TODO: find a way to test it
      const controller0 = new GlobalOverlayController({
        trapsKeyboardFocus: true,
        contentTemplate: () =>
          html`
            <div>
              <input id="input0" /><button id="button0">Button0</button><a id="a0">Link0</a>
            </div>
          `,
      });

      const controller1 = new GlobalOverlayController({
        trapsKeyboardFocus: true,
        contentTemplate: () =>
          html`
            <div>
              <input id="input1" /><button id="button1">Button1</button><a id="a1">Link1</a>
            </div>
          `,
      });

      controller0.show();
      controller1.show();

      simulateTab();
      expect(getDeepActiveElement().id).to.equal('input1');
      simulateTab();
      expect(getDeepActiveElement().id).to.equal('button1');
      simulateTab();
      expect(getDeepActiveElement().id).to.equal('input1');
    });
  });

  describe('preventsScroll', () => {
    it('prevent scrolling the background', async () => {
      const controller = new GlobalOverlayController({
        preventsScroll: true,
        contentTemplate: () =>
          html`
            <p>Content</p>
          `,
      });

      controller.show();
      controller.updateComplete;
      expect(getComputedStyle(document.body).overflow).to.equal('hidden');

      controller.hide();
      controller.updateComplete;
      expect(getComputedStyle(document.body).overflow).to.equal('visible');
    });
  });

  describe('hidesOnEsc', () => {
    it('hides when Escape is pressed', async () => {
      const controller = new GlobalOverlayController({
        hidesOnEsc: true,
        contentTemplate: () =>
          html`
            <p>Content</p>
          `,
      });

      controller.show();
      expect(getRenderedContainers().length).to.equal(1);

      keyUpOn(getRenderedContainer(0), keyCodes.escape);
      expect(getRenderedContainers().length).to.equal(0);
    });
  });
});
