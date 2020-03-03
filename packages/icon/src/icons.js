import { IconManager } from './IconManager.js';

// eslint-disable-next-line import/no-mutable-exports
export let icons = IconManager.getInstance();

export function setIcons(newIcons) {
  icons = newIcons;
}
