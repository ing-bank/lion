import { icons as iconsManager } from '@lion/ui/icon.js';

function resolveLionIcon(iconset, name) {
  switch (iconset) {
    case 'portal':
      return import('./iconset-portal.js').then(module => module[name]);
    default:
      throw new Error(`Unknown iconset ${iconset}`);
  }
}

let registered = false;
export function addIconResolverForPortal() {
  if (registered) return;
  iconsManager.addIconResolver('lion-portal', resolveLionIcon);
  registered = true;
}
