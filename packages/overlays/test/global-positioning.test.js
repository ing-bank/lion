import { expect, html } from '@open-wc/testing';
import { renderAsNode } from '../../core/index.js';
import { OverlayController } from '../src/OverlayController.js';

import {
  getRootNode,
  // getRenderedContainers,
  // isEqualOrHasParent,
  // getTopContainer,
  // getTopOverlay,
  // getRenderedContainer,
  // getRenderedOverlay,
  cleanup,
} from '../test-helpers/global-positioning-helpers.js';

const withDefaultGlobalConfig = () => ({
  placementMode: 'global',
  contentNode: renderAsNode(html`
    <p>my content</p>
  `),
});

describe('Global Positioning', () => {
  cleanup();
  afterEach(cleanup);

  describe('Basics', () => {
    it('puts ".contentNode" in the body of the page', async () => {
      const ctrl = new OverlayController({
        ...withDefaultGlobalConfig(),
      });
      await ctrl.show();
      console.log(getRootNode().children);
      expect(getRootNode().children.length).to.equal(1);
      expect(getRootNode().children[0]).to.have.trimmed.text('my content');
    });

    // TODO: not implemented atm. Is this needed? If so, it should be covered in a css class
    // on a wrapping element, since it may break user styling.
    it.skip('sets contentNode styling to display flex by default', async () => {
      const ctrl = new OverlayController({
        ...withDefaultGlobalConfig(),
      });
      await ctrl.show();
      expect(
        window.getComputedStyle(getRootNode().children[0]).getPropertyValue('display'),
      ).to.equal('flex');
    });
  });

  describe('viewportConfig', () => {
    it('positions the overlay in center by default', async () => {
      const controller = new OverlayController({
        ...withDefaultGlobalConfig(),
      });
      await controller.show();
      expect(
        controller._contentNodeWrapper.classList.contains(
          'global-overlays__overlay-container--center',
        ),
      ).to.be.true;
    });

    it('positions relative to the viewport ', async () => {
      const placementMap = [
        'top-left',
        'top',
        'top-right',
        'right',
        'bottom-right',
        'bottom',
        'bottom-left',
        'left',
        'center',
      ];
      placementMap.forEach(viewportPlacement => {
        const controller = new OverlayController({
          ...withDefaultGlobalConfig(),
          viewportConfig: {
            placement: viewportPlacement,
          },
        });
        controller.show();
        expect(
          controller._contentNodeWrapper.classList.contains(
            `global-overlays__overlay-container--${viewportPlacement}`,
          ),
        ).to.be.true;
      });
    });
  });
});
