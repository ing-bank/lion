/**
 * @typedef {'mobile' | 'desktop'} NavBarResponsiveMode
 * Responsive mode for the navigation bar
 */

/**
 * @typedef {Object} MenuItem
 * Navigation menu item
 * @property {string} [id] - Optional unique identifier
 * @property {string} title - Display title of the menu item
 * @property {string} [link] - URL for the menu item (for leaf items)
 * @property {MenuItem[]} [sub] - Submenu items (for parent items)
 */

/**
 * @typedef {Object} CtaLink
 * Call-to-action link
 * @property {string} [id] - Optional unique identifier
 * @property {string} [href] - URL for the CTA
 * @property {string} [text] - Display text for the CTA
 * @property {string} [label] - Accessible label for the CTA
 */

/**
 * @typedef {Object} Logo
 * Logo configuration for the navigation bar
 * @property {string} type - Logo type (e.g., 'ing')
 * @property {string} alt - Alternative text for the logo
 * @property {string} href - URL the logo links to
 * @property {string} [src] - Optional custom logo source URL
 */

/**
 * @typedef {Object} LevelConfig
 * Configuration for a menu level
 * @property {boolean} [isBar] - Whether this level is displayed as a bar
 * @property {boolean} [hasFullWidthFlyout] - Whether this level has a full-width flyout
 * @property {object} [openableConfig] - Configuration for the openable overlay
 */

export {};
