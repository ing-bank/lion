import { expect, fixtureSync } from '@open-wc/testing';
import { html } from 'lit/static-html.js';
import { OverlayController, overlays } from '@lion/ui/overlays.js';

/**
 * @typedef {import('../types/OverlayConfig.js').OverlayConfig} OverlayConfig
 * @typedef {import('../types/OverlayConfig.js').ViewportPlacement} ViewportPlacement
 */

const withDefaultGlobalConfig = () =>
  /** @type {OverlayConfig} */ ({
    placementMode: 'global',
    contentNode: fixtureSync(html`<p>my content</p>`),
  });

describe('Global Positioning', () => {
  afterEach(() => {
    overlays.teardown();
  });

  describe('viewportConfig', () => {
    it('positions the overlay in center by default', async () => {
      const ctrl = new OverlayController({
        ...withDefaultGlobalConfig(),
      });
      await ctrl.show();
      expect(
        ctrl.contentWrapperNode.classList.contains('global-overlays__overlay-container--center'),
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
      placementMap.forEach(async viewportPlacement => {
        const ctrl = new OverlayController({
          ...withDefaultGlobalConfig(),
          viewportConfig: {
            placement: /** @type {ViewportPlacement} */ (viewportPlacement),
          },
        });
        await ctrl.show();
        expect(
          ctrl.contentWrapperNode.classList.contains(
            `global-overlays__overlay-container--${viewportPlacement}`,
          ),
        ).to.be.true;
      });
    });
  });
});
