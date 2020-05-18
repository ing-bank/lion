import { singletonManager } from 'singleton-manager';
import { OverlaysManager } from './OverlaysManager.js';

export const overlays =
  singletonManager.get('@lion/overlays::overlays::0.15.x') || new OverlaysManager();
