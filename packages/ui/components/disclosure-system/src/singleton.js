import { singletonManager, lazifyInstantiation } from 'singleton-manager';
import { OverlaysManager } from './OverlaysManager.js';

/**
 * @returns {OverlaysManager}
 */
function getOverlaysManager() {
  if (!singletonManager.has('@lion/ui::overlays::0.x')) {
    const overlaysManager = new OverlaysManager();
    singletonManager.set('@lion/ui::overlays::0.x', overlaysManager);
  }

  return singletonManager.get('@lion/ui::overlays::0.x');
}

export const overlays = lazifyInstantiation(getOverlaysManager);
