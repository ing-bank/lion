import { expect, html } from '@open-wc/testing';
import { fixtureSync } from '@open-wc/testing-helpers';
import { OverlayController } from '../src/OverlayController.js';
import { overlays } from '../src/overlays.js';

const withDefaultGlobalConfig = () => ({
  placementMode: 'global',
  contentNode: fixtureSync(html`<p>my content</p>`),
});

describe('Global Positioning', () => {
  afterEach(() => {
    overlays.teardown();
  });

  describe('Basics', () => {
    it('puts ".contentNode" in the body of the page', async () => {
      const ctrl = new OverlayController({
        ...withDefaultGlobalConfig(),
      });
      await ctrl.show();
      expect(overlays.globalRootNode.children.length).to.equal(1);
      expect(overlays.globalRootNode.children[0]).to.have.trimmed.text('my content');
    });
  });

  describe('viewportConfig', () => {
    it('positions the overlay in center by default', async () => {
      const ctrl = new OverlayController({
        ...withDefaultGlobalConfig(),
      });
      await ctrl.show();
      expect(ctrl.content.classList.contains('global-overlays__overlay-container--center')).to.be
        .true;
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
            placement: viewportPlacement,
          },
        });
        await ctrl.show();
        expect(
          ctrl.content.classList.contains(
            `global-overlays__overlay-container--${viewportPlacement}`,
          ),
        ).to.be.true;
      });
    });
  });
});
