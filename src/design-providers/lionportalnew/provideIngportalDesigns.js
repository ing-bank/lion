import { addIconResolverForPortal } from './iconset-portal/addIconResolverForPortal.js';
import { getDesignForUIPageLayout } from './UIPageLayout/getDesign.js';
import { getDesignForUIMainNav } from './UIMainNav/getDesign.js';
import { getDesignForUIPortalCard } from './UIPortalCard/getDesign.js';
import { getDesignForUIPortalFooterContent } from './UIPortalFooterContent/getDesign.js';

import { UIMainNav } from '../../components/UIMainNav/UIMainNav.js';
import { UIPageLayout } from '../../components/UIPageLayout/UIPageLayout.js';
import { UIPortalCard } from '../../components/UIPortalCard/UIPortalCard.js';
import { UIPortalFooterContent } from '../../components/UIPortalFooterContent/UIPortalFooterContent.js';

export function provideIngportalDesigns() {
  addIconResolverForPortal();

  UIPageLayout.provideDesign(getDesignForUIPageLayout());
  UIMainNav.provideDesign(getDesignForUIMainNav());
  UIPortalCard.provideDesign(getDesignForUIPortalCard());
  UIPortalFooterContent.provideDesign(getDesignForUIPortalFooterContent());
}
