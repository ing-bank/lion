import { singletonManager } from 'singleton-manager';
import { OverlaysManager } from './OverlaysManager.js';

export const overlays =
  /** @type {OverlaysManager} */
  (singletonManager.get('@lion/ui::overlays::0.x')) || new OverlaysManager();
