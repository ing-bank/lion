// import { addIconResolverForPortal } from './iconset-portal/addIconResolverForPortal.js';
import { getDesignForUIField } from './UIField/getDesignForUIField.js';
// import { getDesignForUIMainNav } from './UIMainNav/getDesign.js';
// import { getDesignForUIPortalCard } from './UIPortalCard/getDesign.js';
// import { getDesignForUIPortalFooterContent } from './UIPortalFooterContent/getDesign.js';

import { UIField } from '../../components/UIField/UIField.js';
// import { UIPageLayout } from '../../components/UIPageLayout/UIPageLayout.js';
// import { UIPortalCard } from '../../components/UIPortalCard/UIPortalCard.js';
// import { UIPortalFooterContent } from '../../components/UIPortalFooterContent/UIPortalFooterContent.js';

export function provideMacosUIDesigns() {
  // addIconResolverForPortal();

  UIField.provideDesign(getDesignForUIField());
  // UIMainNav.provideDesign(getDesignForUIMainNav());
  // UIPortalCard.provideDesign(getDesignForUIPortalCard());
  // UIPortalFooterContent.provideDesign(getDesignForUIPortalFooterContent());
}
