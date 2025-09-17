import { singletonManager, lazifyInstantiation } from 'singleton-manager';
import { IconManager } from './IconManager.js';

/**
 * @returns {IconManager}
 */
function getIconManager() {
  if (!singletonManager.has('@lion/ui::icons::0.x')) {
    const iconManager = new IconManager();
    singletonManager.set('@lion/ui::icons::0.x', iconManager);
  }

  return singletonManager.get('@lion/ui::icons::0.x');
}

export const icons = lazifyInstantiation(getIconManager);
