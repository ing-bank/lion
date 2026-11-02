export type NavItem = {
  name: string;
  url?: string;
  active?: boolean;
  hasActiveChild?: boolean;
  iconId?: string;
  iconActiveId?: string;
  nextLevel?: NavLevel;
};

export type NavLevel = {
  items: NavItem[];
  /** Whether the level should open as a floating menu on top layer (popover), a disclosure/collapsible or below a heading */
  mode?: 'popover' | 'disclosure' | 'heading';
  /** This can be practical for server rendered navs that need to show the active state of a deeper nested level on first render */
  initialOpen?: boolean;
  /** This is recommended for l0 of (desktop) menus: the button is not shown, l1 is opened */
  hideToggle?: boolean;
  shouldHandleBodyScroll?: boolean;
};
