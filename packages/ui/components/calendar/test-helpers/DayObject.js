import { weekdayNames } from './weekdayNames.js';

/**
 * Abstraction around calendar day DOM structure,
 * allows for writing readable, 'DOM structure agnostic' tests
 */
export class DayObject {
  /**
   * @param {HTMLElement} dayEl
   */
  constructor(dayEl) {
    this.el = dayEl;
  }

  /**
   * Node references
   */

  get calendarShadowRoot() {
    return this.el.parentNode?.parentNode?.parentNode?.parentNode?.parentNode?.parentNode
      ?.parentNode;
  }

  get cellEl() {
    return /** @type {HTMLElement} */ (this.el.parentElement);
  }

  get buttonEl() {
    return this.el;
  }

  /**
   * States
   */

  get isDisabled() {
    return this.buttonEl.getAttribute('aria-disabled') === 'true';
  }

  get isSelected() {
    return this.buttonEl.hasAttribute('selected');
  }

  get isToday() {
    return this.buttonEl.hasAttribute('today');
  }

  get isCentral() {
    return this.buttonEl.getAttribute('tabindex') === '0';
  }

  get isFocused() {
    return /** @type {ShadowRoot} */ (this.calendarShadowRoot).activeElement === this.buttonEl;
  }

  get monthday() {
    return Number(this.buttonEl.children[0].textContent);
  }

  /**
   * Text
   */

  get weekdayNameShort() {
    const weekdayEls = Array.from(
      /** @type {HTMLElement} */ (this.el.parentElement?.parentElement).querySelectorAll(
        '.calendar__day-cell',
      ),
    );
    const dayIndex = weekdayEls.indexOf(/** @type {HTMLElement} */ (this.el.parentElement));
    return weekdayNames['en-GB'].Sunday.short[dayIndex];
  }

  get weekdayNameLong() {
    const weekdayEls = Array.from(
      /** @type {HTMLElement} */ (this.el.parentElement?.parentElement).querySelectorAll(
        '.calendar__day-cell',
      ),
    );
    const dayIndex = weekdayEls.indexOf(/** @type {HTMLElement} */ (this.el.parentElement));
    return weekdayNames['en-GB'].Sunday.long[dayIndex];
  }

  /**
   * Other
   */
  get cellIndex() {
    return Array.from(/** @type {HTMLElement} */ (this.cellEl.parentElement).children).indexOf(
      this.cellEl,
    );
  }
}
