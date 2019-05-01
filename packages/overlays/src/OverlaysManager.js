/* eslint-disable class-methods-use-this */

/**
 * @typedef {object} OverlayController
 * @param {(object) => TemplateResult} contentTemplate the template function
 * which is called on update
 * @param {(boolean, object) => void} sync updates shown state and data all together
 * @param {(object) => void} update updates the overlay (with data if provided as a first argument)
 * @param {Function} show shows the overlay
 * @param {Function} hide hides the overlay
 * @param {boolean} hasBackdrop displays a gray backdrop while the overlay is opened
 * @param {boolean} isBlocking hides all other overlays once shown
 * @param {boolean} preventsScroll prevents scrolling the background
 *   while this overlay is opened
 * @param {boolean} trapsKeyboardFocus keeps focus within the overlay,
 *   and prevents interaction with the overlay background
 */

/**
 * `OverlaysManager` which manages overlays which are rendered into the body
 */
export class OverlaysManager {
  /**
   * Registers an overlay controller.
   * @param {OverlayController} controller controller of the newly added overlay
   * @returns {OverlayController} same controller after adding to the manager
   */
  add(controller) {
    // TODO: hopefully there will be an event-driven system (which will be implemented here)
    // and controllers will just be notified about other controllers being shown/hidden
    // so that we:
    // 1. don't need to store a stack of overlays which leads to memory leaks
    //    (unfortunately WeakSet/WeakMap is not an option because we need to iterate over them)
    // 2. make overlay controllers more independent
    //    (otherwise there will be a tight coupling between the manager and different types)
    return controller;
  }
}
