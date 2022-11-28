import { singletonManager } from 'singleton-manager';
import { OverlaysManager } from './OverlaysManager.js';

// eslint-disable-next-line import/no-mutable-exports
export let overlays = singletonManager.get('@lion/ui::overlays::0.x') || new OverlaysManager();

/**
 * @param {OverlaysManager} newOverlays
 */
export function setOverlays(newOverlays) {
  overlays = newOverlays;
}
