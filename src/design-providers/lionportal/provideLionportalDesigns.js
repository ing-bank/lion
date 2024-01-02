import { addIconResolverForPortal } from './iconset-portal/addIconResolverForPortal.js';
import { provideDesignForUIPageLayout } from './UIPageLayout/provide.js';
import { provideDesignForUIMainNav } from './UIMainNav/provide.js';

export function provideLionportalDesigns() {
  addIconResolverForPortal();

  provideDesignForUIPageLayout();
  provideDesignForUIMainNav();
}
