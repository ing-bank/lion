/**
 * The feature registry. A feature is loaded only when the descriptor asks for it, so an overlay that
 * merely opens and closes pays nothing for positioning, focus handling or scroll locking.
 *
 * @typedef {import('./DisclosureCore.js').Feature} Feature
 */

/** @type {Feature[]} */
export const features = [
  {
    // always on: this is the feature that closes the platform gaps (role, name, expanded state)
    when: () => true,
    load: () => import('./features/a11y.js').then(module => module.installA11y),
  },
  {
    when: descriptor => Boolean(descriptor.closedby) && descriptor.closedby !== 'none',
    load: () => import('./features/esc.js').then(module => module.installEsc),
  },
  {
    when: descriptor => Boolean(descriptor.lightDismiss) || Boolean(descriptor.dismissOnFocusOut),
    load: () => import('./features/dismiss.js').then(module => module.installDismiss),
  },
  {
    when: descriptor => Boolean(descriptor.backdrop),
    load: () => import('./features/backdrop.js').then(module => module.installBackdrop),
  },
  {
    when: descriptor => Boolean(descriptor.anchor),
    load: () => import('./features/position.js').then(module => module.installPosition),
  },
  {
    when: descriptor => Boolean(descriptor.modal),
    load: () => import('./features/focus.js').then(module => module.installFocus),
  },
  {
    when: descriptor => Boolean(descriptor.scrollLock),
    load: () => import('./features/scroll-lock.js').then(module => module.installScrollLock),
  },
];

/**
 * Add a feature. Consumers can register their own without pulling in ours.
 * @param {Feature} feature
 * @returns {void}
 */
export function registerFeature(feature) {
  features.push(feature);
}
