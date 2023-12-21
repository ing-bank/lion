/**
 * @typedef {import('./UIMainNav.types').NavLevel} NavLevel
 * @typedef {import('./UIMainNav.types').NavItem} NavItem
 */

/**
 * Updates active and hasActiveChild props of NavItems
 * @param {NavLevel} navData
 * @param {{activePath: string; activeItem: NavItem; shouldReset: boolean;}} options
 */
export function updateNavData(navData, { activePath, activeItem, shouldReset = false } = {}) {
  const parents = new WeakMap();
  let shouldLookForReset = shouldReset;
  // False when activePath or activeItem is provided
  let hasActiveSet = !activePath && !activeItem;
  // We will use this as a helper to prevent that we're resetting parents when we're not supposed to
  let newActiveItem = null;
  let lastParent = null;

  const handleParents = (navItem, { action }) => {
    const parent = parents.get(navItem);
    if (parent) {
      if (action === 'activate') {
        parent.hasActiveChild = true;
      } else if (action === 'reset') {
        delete parent.hasActiveChild;
        // In case we're resetting, we don't want to reset the parent of the new active item
        if (newActiveItem === parent) return;
      } else {
        throw new Error(`[UIMainNav]: Unknown action ${action}`);
      }
      handleParents(parent, { action });
    }
  };

  const loopLvl = level => {
    for (const navItem of level.items) {
      parents.set(navItem, lastParent);
      if (shouldLookForReset && navItem.active) {
        delete navItem.active;
        handleParents(navItem, { action: 'reset' });
        shouldLookForReset = false;
      }
      if ((activePath && navItem.url === activePath) || (activeItem && navItem === activeItem)) {
        navItem.active = true;
        handleParents(navItem, { action: 'activate' });
        hasActiveSet = true;
        newActiveItem = navItem;
      }
      if (hasActiveSet && !shouldLookForReset) {
        break;
      }
      if (navItem.nextLevel) {
        lastParent = navItem;
        loopLvl(navItem.nextLevel);
      }
    }
  };

  loopLvl(navData);
}
