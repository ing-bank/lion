import { singletonManager } from 'singleton-manager';
import { IconManager } from './IconManager.js';

// eslint-disable-next-line import/no-mutable-exports
export let icons = singletonManager.get('@lion/icon::icons::0.5.x') || new IconManager();

// @ts-ignore since we don't know which singleton icon manager version will be used, we cannot type it.
export function setIcons(newIcons) {
  icons = newIcons;
}
