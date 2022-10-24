import { singletonManager } from 'singleton-manager';
// eslint-disable-next-line import/no-cycle
import { OverlaysManager } from './OverlaysManager.js';

// eslint-disable-next-line import/no-mutable-exports
export let overlays =
  singletonManager.get('@lion/overlays::overlays::0.15.x') || new OverlaysManager();

/**
 * @param {OverlaysManager} newOverlays
 */
export function setOverlays(newOverlays) {
  overlays = newOverlays;
}
