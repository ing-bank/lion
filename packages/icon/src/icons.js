import { singletonManager } from 'singleton-manager';
import { IconManager } from './IconManager.js';

// eslint-disable-next-line import/no-mutable-exports
export let icons = singletonManager.get('@lion/icon::icons::0.5.x') || new IconManager();

export function setIcons(newIcons) {
  icons = newIcons;
}
