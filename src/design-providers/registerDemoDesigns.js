import { demoDesignRegistry } from '../components/shared/demoDesignRegistry.js';

import { getDesignForUIPageLayout as getDesignForUIPageLayoutLionportal } from './lionportal/UIPageLayout/getDesign.js';
import { getDesignForUIMainNav as getDesignForUIMainNavLionportal } from './lionportal/UIMainNav/getDesign.js';

import { getDesignForUIPageLayout as getDesignForUIPageLayoutIngportal } from './ingportal/UIPageLayout/getDesign.js';
import { getDesignForUIMainNav as getDesignForUIMainNavIngportal } from './ingportal/UIMainNav/getDesign.js';

import { getDesignForUIPageLayout as getDesignForUIPageLayoutIbmCarbon } from './ibmcarbon/UIPageLayout/getDesign.js';
import { getDesignForUIMainNav as getDesignForUIMainNavIbmCarbon } from './ibmcarbon/UIMainNav/getDesign.js';

import { UIMainNav } from '../components/UIMainNav/UIMainNav.js';
import { UIPageLayout } from '../components/UIPageLayout/UIPageLayout.js';

export function registerDemoDesigns() {
  // set 'lionportal'
  demoDesignRegistry.registerDesign({
    ctor: UIPageLayout,
    set: 'lionportal',
    designObj: getDesignForUIPageLayoutLionportal(),
  });
  demoDesignRegistry.registerDesign({
    ctor: UIMainNav,
    set: 'lionportal',
    designObj: getDesignForUIMainNavLionportal(),
  });

  // set 'ingportal'
  demoDesignRegistry.registerDesign({
    ctor: UIPageLayout,
    set: 'ingportal',
    designObj: getDesignForUIPageLayoutIngportal(),
  });
  demoDesignRegistry.registerDesign({
    ctor: UIMainNav,
    set: 'ingportal',
    designObj: getDesignForUIMainNavIngportal(),
  });

  // set 'ibmcarbon'
  demoDesignRegistry.registerDesign({
    ctor: UIPageLayout,
    set: 'ibmcarbon',
    designObj: getDesignForUIPageLayoutIbmCarbon(),
  });
  demoDesignRegistry.registerDesign({
    ctor: UIMainNav,
    set: 'ibmcarbon',
    designObj: getDesignForUIMainNavIbmCarbon(),
  });
}
