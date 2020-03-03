import { icons } from '../index.js';

icons.addIconResolver('lion', (iconset, name) => {
  switch (iconset) {
    case 'bugs':
      return import('./icons/iconset-bugs.js').then(module => module[name]);
    case 'space':
      return import('./icons/iconset-space.js').then(module => module[name]);
    case 'misc':
      return import('./icons/iconset-misc.js').then(module => module[name]);
    default:
      throw new Error(`Unknown iconset ${iconset}`);
  }
});
