import { IconManager } from './IconManager.js';

// eslint-disable-next-line import/no-mutable-exports
export let icons = new IconManager();

export function setIcons(newIcons) {
  icons = newIcons;
}
