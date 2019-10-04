/* eslint-disable no-new */
import { expect, html, fixture } from '@open-wc/testing';
import '@lion/core/test-helpers/keyboardEventShimIE.js';
import sinon from 'sinon';
import { keyCodes } from '../src/utils/key-codes.js';
import { simulateTab } from '../src/utils/simulate-tab.js';
import { OverlayController } from '../src/OverlayController.js';
import { getTopOverlay, cleanup } from '../test-helpers/global-positioning-helpers.js';
import { renderAsNode } from '../../core/index.js';
import { overlays, GlobalOverlayController } from '../index.js';

const withDefaultGlobalConfig = () => ({
  placementMode: 'global',
  contentNode: renderAsNode(html`
    <div>my content</div>
  `),
});

const withDefaultLocalConfig = () => ({
  placementMode: 'local',
  contentNode: renderAsNode(html`
    <div>my content</div>
  `),
});

describe('OverlayController', () => {
  afterEach(cleanup);

  describe('Init', () => {
    // adds OverlayController instance to OverlayManager
    // prepares renderTarget
    // prepares contentNodeWrapper
  });

  describe('Node Configuration', () => {
    it('accepts an .contentNode<Node> to directly set content', async () => {
      const ctrl = new OverlayController({
        ...withDefaultGlobalConfig(),
        contentNode: await fixture('<p>direct node</p>'),
      });
      expect(ctrl.contentNode).to.have.trimmed.text('direct node');
    });

    it('accepts an .invokerNode<Node> to directly set content', async () => {
      const ctrl = new OverlayController({
        ...withDefaultGlobalConfig(),
        invokerNode: await fixture('<button>invoke</button>'),
      });
      expect(ctrl.invokerNode).to.have.trimmed.text('invoke');
    });
  });

  describe('Feature Configuration', () => {
    describe.skip('trapsKeyboardFocus', () => {
      it.skip('focuses the overlay on show', async () => {
        const ctrl = new OverlayController({
          ...withDefaultGlobalConfig(),
          trapsKeyboardFocus: true,
          viewportConfig: {},
        });
        await ctrl.show();
        expect(ctrl.contentNode).to.equal(document.activeElement);
      });

      it.skip('keeps focus within the overlay e.g. you can not tab out by accident', async () => {
        const contentNode = await fixture(html`
          <div><input id="input1" /><input id="input2" /></div>
        `);
        const ctrl = new OverlayController({
          ...withDefaultGlobalConfig(),
          contentNode,
        });
        await ctrl.show();

        const elOutside = await fixture(html`
          <button>click me</button>
        `);
        const input1 = ctrl.contentNode.querySelectorAll('input')[0];
        const input2 = ctrl.contentNode.querySelectorAll('input')[1];

        input2.focus();
        // this mimics a tab within the contain-focus system used
        const event = new CustomEvent('keydown', { detail: 0, bubbles: true });
        event.keyCode = keyCodes.tab;
        window.dispatchEvent(event);

        expect(elOutside).to.not.equal(document.activeElement);
        expect(input1).to.equal(document.activeElement);
      });

      it.skip('allows to move the focus outside of the overlay if trapsKeyboardFocus is disabled', async () => {
        const contentNode = await fixture(html`
          <div><input /></div>
        `);

        const ctrl = new OverlayController({
          ...withDefaultGlobalConfig(),
          contentNode,
          trapsKeyboardFocus: true,
        });
        // add element to dom to allow focus
        await fixture(html`
          ${ctrl.content}
        `);
        await ctrl.show();

        const elOutside = await fixture(html`
          <input />
        `);
        const input = ctrl.contentNode.querySelector('input');

        input.focus();
        simulateTab();

        expect(elOutside).to.equal(document.activeElement);
      });
    });

    describe('hidesOnEsc', () => {
      it('hides when [escape] is pressed', async () => {
        const ctrl = new OverlayController({
          ...withDefaultGlobalConfig(),
          hidesOnEsc: true,
        });
        await ctrl.show();

        ctrl._contentNodeWrapper.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape' }));
        expect(ctrl.isShown).to.be.false;
      });

      it('stays shown when [escape] is pressed on outside element', async () => {
        const ctrl = new OverlayController({
          ...withDefaultGlobalConfig(),
          hidesOnEsc: true,
        });
        await ctrl.show();
        document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape' }));
        expect(ctrl.isShown).to.be.true;
      });
    });

    describe.skip('elementToFocusAfterHide', () => {
      it('focuses body when hiding by default', async () => {
        const ctrl = new OverlayController({
          ...withDefaultGlobalConfig(),
          viewportConfig: {
            placement: 'top-left',
          },
          contentNode: renderAsNode(html`
            <div><input />=</div>
          `),
        });

        await ctrl.show();
        const input = getTopOverlay().querySelector('input');
        input.focus();
        expect(document.activeElement).to.equal(input);

        await ctrl.hide();
        expect(document.activeElement).to.equal(document.body);
      });

      it('supports elementToFocusAfterHide option to focus it when hiding', async () => {
        const input = await fixture(html`
          <input />
        `);

        const ctrl = overlays.add(
          new GlobalOverlayController({
            elementToFocusAfterHide: input,
            viewportConfig: {
              placement: 'top-left',
            },
            contentTemplate: () => html`
              <div><textarea></textarea></div>
            `,
          }),
        );

        await ctrl.show();
        const textarea = getTopOverlay().querySelector('textarea');
        textarea.focus();
        expect(document.activeElement).to.equal(textarea);

        await ctrl.hide();
        expect(document.activeElement).to.equal(input);
      });

      it('allows to set elementToFocusAfterHide on show', async () => {
        const input = await fixture(html`
          <input />
        `);

        const ctrl = overlays.add(
          new GlobalOverlayController({
            viewportConfig: {
              placement: 'top-left',
            },
            contentTemplate: () => html`
              <div><textarea></textarea></div>
            `,
          }),
        );

        await ctrl.show(input);
        const textarea = getTopOverlay().querySelector('textarea');
        textarea.focus();
        expect(document.activeElement).to.equal(textarea);

        await ctrl.hide();
        expect(document.activeElement).to.equal(input);
      });

      it('allows to set elementToFocusAfterHide on sync', async () => {
        const input = await fixture(html`
          <input />
        `);

        const ctrl = overlays.add(
          new GlobalOverlayController({
            viewportConfig: {
              placement: 'top-left',
            },
            contentTemplate: () => html`
              <div><textarea></textarea></div>
            `,
          }),
        );

        await ctrl.sync({ isShown: true, elementToFocusAfterHide: input });
        const textarea = getTopOverlay().querySelector('textarea');
        textarea.focus();
        expect(document.activeElement).to.equal(textarea);

        await ctrl.hide();
        expect(document.activeElement).to.equal(input);

        await ctrl.sync({ isShown: true, elementToFocusAfterHide: input });
        const textarea2 = getTopOverlay().querySelector('textarea');
        textarea2.focus();
        expect(document.activeElement).to.equal(textarea2);

        await ctrl.sync({ isShown: false });
        expect(document.activeElement).to.equal(input);
      });
    });

    describe('preventsScroll', () => {
      it('prevent scrolling the background', async () => {
        const ctrl = new OverlayController({
          ...withDefaultGlobalConfig(),
          preventsScroll: true,
        });

        await ctrl.show();
        ctrl.updateComplete;
        expect(getComputedStyle(document.body).overflow).to.equal('hidden');

        await ctrl.hide();
        ctrl.updateComplete;
        expect(getComputedStyle(document.body).overflow).to.equal('visible');
      });
    });

    describe('hasBackdrop', () => {
      it('has no backdrop by default', async () => {
        const ctrl = new OverlayController({
          ...withDefaultGlobalConfig(),
        });
        await ctrl.show();
        expect(ctrl.backdropNode).to.be.undefined;
      });

      it('supports a backdrop option', async () => {
        const ctrl = new OverlayController({
          ...withDefaultGlobalConfig(),
          hasBackdrop: false,
        });
        await ctrl.show();
        expect(ctrl.backdropNode).to.be.undefined;
        await ctrl.hide();

        const controllerWithBackdrop = new OverlayController({
          ...withDefaultGlobalConfig(),
          hasBackdrop: true,
        });
        await controllerWithBackdrop.show();
        expect(controllerWithBackdrop.backdropNode).to.have.class('global-overlays__backdrop');
      });

      it('reenables the backdrop when shown/hidden/shown', async () => {
        const ctrl = new OverlayController({
          ...withDefaultGlobalConfig(),
          hasBackdrop: true,
        });
        await ctrl.show();
        expect(ctrl.backdropNode).to.have.class('global-overlays__backdrop');
        await ctrl.hide();
        await ctrl.show();
        expect(ctrl.backdropNode).to.have.class('global-overlays__backdrop');
      });
    });
  });

  describe('Show / Hide / Toggle', () => {
    it('has .isShown which defaults to false', async () => {
      const ctrl = new OverlayController({
        ...withDefaultGlobalConfig(),
      });
      expect(ctrl.isShown).to.be.false;
    });

    it('has async show() which shows the overlay', async () => {
      const ctrl = new OverlayController({
        ...withDefaultGlobalConfig(),
      });
      await ctrl.show();
      expect(ctrl.isShown).to.be.true;
      expect(ctrl.show()).to.be.instanceOf(Promise);
    });

    it('has async hide() which hides the overlay', async () => {
      const ctrl = new OverlayController({
        ...withDefaultGlobalConfig(),
      });

      await ctrl.hide();
      expect(ctrl.isShown).to.be.false;
      expect(ctrl.hide()).to.be.instanceOf(Promise);
    });

    it('fires "show" event once overlay becomes shown', async () => {
      const showSpy = sinon.spy();
      const ctrl = new OverlayController({
        ...withDefaultGlobalConfig(),
      });

      ctrl.addEventListener('show', showSpy);
      await ctrl.show();
      expect(showSpy.callCount).to.equal(1);
      await ctrl.show();
      expect(showSpy.callCount).to.equal(1);
    });

    it('fires "before-show" event right before overlay becomes shown', async () => {
      const ctrl = new OverlayController({
        ...withDefaultGlobalConfig(),
      });

      const eventSpy = sinon.spy();

      ctrl.addEventListener('before-show', eventSpy);
      ctrl.addEventListener('show', eventSpy);

      await ctrl.show();
      expect(eventSpy.getCall(0).args[0].type).to.equal('before-show');
      expect(eventSpy.getCall(1).args[0].type).to.equal('show');

      expect(eventSpy.callCount).to.equal(2);
      await ctrl.show();
      expect(eventSpy.callCount).to.equal(2);
    });

    it('fires "hide" event once overlay becomes hidden', async () => {
      const hideSpy = sinon.spy();
      const ctrl = new OverlayController({
        ...withDefaultGlobalConfig(),
      });

      ctrl.addEventListener('hide', hideSpy);
      await ctrl.show();
      await ctrl.hide();
      expect(hideSpy.callCount).to.equal(1);
      await ctrl.hide();
      expect(hideSpy.callCount).to.equal(1);
    });

    it('fires "before-hide" event right before overlay becomes hidden', async () => {
      const ctrl = new OverlayController({
        ...withDefaultGlobalConfig(),
      });

      const eventSpy = sinon.spy();

      ctrl.addEventListener('before-hide', eventSpy);
      ctrl.addEventListener('hide', eventSpy);

      await ctrl.show();
      await ctrl.hide();
      expect(eventSpy.getCall(0).args[0].type).to.equal('before-hide');
      expect(eventSpy.getCall(1).args[0].type).to.equal('hide');

      expect(eventSpy.callCount).to.equal(2);
      await ctrl.hide();
      expect(eventSpy.callCount).to.equal(2);
    });
  });

  describe('Update Configuration', () => {
    // reinitializes content (cleanup etc)
    // handles switching placementMode
    // respects the inital config provided to new OverlayController(initialConfig)
  });

  describe('Accessibility', () => {
    it('adds and removes [aria-expanded] on invoker', async () => {
      const invokerNode = await fixture('<div role="button">invoker</div>');
      const ctrl = new OverlayController({
        ...withDefaultLocalConfig(),
        handlesAccessibility: true,
        invokerNode,
      });
      expect(ctrl.invokerNode.getAttribute('aria-expanded')).to.equal('false');
      await ctrl.show();
      expect(ctrl.invokerNode.getAttribute('aria-expanded')).to.equal('true');
      await ctrl.hide();
      expect(ctrl.invokerNode.getAttribute('aria-expanded')).to.equal('false');
    });

    it('creates unique id for content', async () => {
      const ctrl = new OverlayController({
        ...withDefaultLocalConfig(),
        handlesAccessibility: true,
      });
      expect(ctrl.contentNode.id).to.contain(ctrl._contentId);
    });

    it('preserves content id when present', async () => {
      const contentNode = await fixture('<div id="preserved">content</div>');
      const ctrl = new OverlayController({
        ...withDefaultLocalConfig(),
        handlesAccessibility: true,
        contentNode,
      });
      expect(ctrl.contentNode.id).to.contain('preserved');
    });

    it('adds [aria-controls] on invoker', async () => {
      const invokerNode = await fixture('<div role="button">invoker</div>');
      const ctrl = new OverlayController({
        ...withDefaultLocalConfig(),
        handlesAccessibility: true,
        invokerNode,
      });
      expect(ctrl.invokerNode.getAttribute('aria-controls')).to.contain(ctrl.contentNode.id);
    });

    it.skip('adds [role=dialog] on content', async () => {
      const ctrl = new OverlayController({
        ...withDefaultLocalConfig(),
        handlesAccessibility: true,
      });
      expect(ctrl.contentNode.getAttribute('role')).to.equal('dialog');
    });

    describe('Tooltip', () => {
      it('adds [aria-describedby] on invoker', async () => {
        const invokerNode = await fixture('<div role="button">invoker</div>');
        const ctrl = new OverlayController({
          ...withDefaultLocalConfig(),
          handlesAccessibility: true,
          isTooltip: true,
          invokerNode,
        });
        expect(ctrl.invokerNode.getAttribute('aria-describedby')).to.equal(ctrl._contentId);
      });

      it('adds [role=tooltip] on content', async () => {
        const invokerNode = await fixture('<div role="button">invoker</div>');
        const ctrl = new OverlayController({
          ...withDefaultLocalConfig(),
          handlesAccessibility: true,
          isTooltip: true,
          invokerNode,
        });
        expect(ctrl.contentNode.getAttribute('role')).to.equal('tooltip');
      });
    });

    // test tooltip functionality: describedby (only local!) and role=tooltip
  });

  describe('Exception handling', () => {
    it('throws if no .placementMode gets passed on', async () => {
      expect(() => {
        new OverlayController({
          contentNode: {},
        });
      }).to.throw('You need to provide a .placementMode ("global"|"local")');
    });

    it('throws if invalid .placementMode gets passed on', async () => {
      expect(() => {
        new OverlayController({
          placementMode: 'invalid',
        });
      }).to.throw('"invalid" is not a valid .placementMode, use ("global"|"local")');
    });

    it('throws if no .contentNode gets passed on', async () => {
      expect(() => {
        new OverlayController({
          placementMode: 'global',
        });
      }).to.throw('You need to provide a .contentNode');
    });
  });
});
