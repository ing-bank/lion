import { addIconResolverForPortal } from './iconset-portal/addIconResolverForPortal.js';
import { getDesignForUIPageLayout } from './UIPageLayout/getDesign.js';
import { getDesignForUIMainNav } from './UIMainNav/getDesign.js';
import { getDesignForUIPortalCard } from './UIPortalCard/getDesign.js';
import { UIMainNav } from '../../components/UIMainNav/UIMainNav.js';
import { UIPageLayout } from '../../components/UIPageLayout/UIPageLayout.js';
import { UIPortalCard } from '../../components/UIPortalCard/UIPortalCard.js';

export function provideLionportalDesigns() {
  addIconResolverForPortal();

  UIPageLayout.provideDesign(getDesignForUIPageLayout());
  UIMainNav.provideDesign(getDesignForUIMainNav());
  UIPortalCard.provideDesign(getDesignForUIPortalCard());
}
