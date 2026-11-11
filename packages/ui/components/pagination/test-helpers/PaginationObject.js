/**
 * Abstraction around pagination DOM structure so shared suite assertions can use custom controls.
 */
export class PaginationObject {
  /**
   * @param {import('../src/LionPagination.js').LionPagination} paginationEl
   */
  constructor(paginationEl) {
    this.el = paginationEl;
  }
  get previousButtonEl() {
    const previousButton = this.el.shadowRoot?.querySelector('nav li:first-child > *');
    if (!(previousButton instanceof HTMLElement)) {
      throw new Error('The previous pagination button was not found.');
    }
    return previousButton;
  }
  get nextButtonEl() {
    const nextButton = this.el.shadowRoot?.querySelector('nav li:last-child > *');
    if (!(nextButton instanceof HTMLElement)) {
      throw new Error('The next pagination button was not found.');
    }
    return nextButton;
  }
  get pageButtonEls() {
    return /** @type {HTMLElement[]} */ Array.from(
      this.el.shadowRoot?.querySelectorAll('nav li > [aria-current]') || [],
    );
  }
  get ellipsisEls() {
    return /** @type {HTMLElement[]} */ Array.from(
      this.el.shadowRoot?.querySelectorAll('nav li > span') || [],
    );
  }
}
