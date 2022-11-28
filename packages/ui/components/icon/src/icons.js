import { singletonManager } from 'singleton-manager';
import { IconManager } from './IconManager.js';

// eslint-disable-next-line import/no-mutable-exports
export let icons = singletonManager.get('@lion/ui::icons::0.x') || new IconManager();

// @ts-ignore since we don't know which singleton icon manager version will be used, we cannot type it.
export function setIcons(newIcons) {
  icons = newIcons;
}
