import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { LitElement, html, css } from 'lit';
import { LionPagination } from '@lion/ui/pagination.js';

export class LionCarousel extends ScopedElementsMixin(LitElement) {
  static get scopedElements() {
    return {
      'lion-pagination': LionPagination,
    };
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        ::slotted([slot='slide']) {
          display: none;
        }
        ::slotted([slot='slide'].active) {
          display: block;
        }
        :host [hidden] {
          clip: rect(0 0 0 0);
          clip-path: inset(50%);
          height: 1px;
          overflow: hidden;
          position: absolute;
          white-space: nowrap;
          width: 1px;
        }
      `,
    ];
  }

  static get properties() {
    return {
      currentIndex: { type: Number, attribute: 'current', reflect: true },
      pagination: { type: Boolean, attribute: 'pagination', reflect: true },
      slideshow: { type: Boolean, reflect: true },
      duration: { type: Number, reflect: true },
    };
  }

  render() {
    return html`
      <div @keydown="${this._handleKeyDown}">
        <slot name="slide"></slot>
      </div>
      <button class="prev" @click="${this.prevSlide}" aria-label="previous">&#9664;</button>
      <button class="next" @click="${this.nextSlide}" aria-label="next">&#9654;</button>
      ${this._paginationTemplate} ${this._slideshowControlsTemplate}
      <div aria-live="polite" hidden>
        Viewing slide ${this.currentIndex} of ${this.slides.length}
      </div>
    `;
  }

  constructor() {
    super();
    this.currentIndex = 1;
    this.pagination = false;
    this.slideshow = false;
    this.slideshowAnimating = false;
    /**
     * @type {number | undefined}
     */
    this.duration = undefined;
  }

  firstUpdated() {
    this._updateActiveSlide();
    if (this.slideshow) this._startSlideShow();
  }

  connectedCallback() {
    super.connectedCallback();
    this.slides.forEach((slide, index) => {
      // eslint-disable-next-line no-param-reassign
      slide.ariaLabel = `${index + 1}/${this.slides.length}`;
    });
  }

  /**
   * @protected
   */
  get _paginationTemplate() {
    return this.pagination
      ? html`
          <lion-pagination
            count="${this._getSlidesCount()}"
            current="${this.currentIndex}"
            @current-changed=${this._handlePaginationChange}
          ></lion-pagination>
        `
      : '';
  }

  /**
   * @protected
   */
  get _slideshowControlsTemplate() {
    return this.slideshow
      ? html`
          <button @click="${this._startSlideShow}" aria-label="Start slide show">▶</button>
          <button @click="${this._stopSlideShow}" aria-label="Stop slide show">◼</button>
        `
      : '';
  }

  /**
   * @param {import('lit').PropertyValues } changedProperties
   */
  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('currentIndex')) {
      this._updateActiveSlide();
    }
  }

  /**
   * Animates slide transition.
   * This method can be overridden by subclasses to implement custom animation logic.
   * @param {Number} _oldIndex index of slide transitioning from.
   * @param {Number} _newIndex index of slide transitioning to.
   * @param {'next'|'prev'} _direction The direction of the transition ('next' or 'prev').
   */
  // eslint-disable-next-line class-methods-use-this, no-empty-function, no-unused-vars
  async _slideAnimation(_oldIndex, _newIndex, _direction) {
    // Default implementation does nothing.
  }

  async nextSlide() {
    const oldIndex = this.currentIndex;
    const newIndex = (this.currentIndex % this.slides.length) + 1;
    await this._slideAnimation(oldIndex, newIndex, 'next');
    this.currentIndex = newIndex;
  }

  async prevSlide() {
    const oldIndex = this.currentIndex;
    const newIndex = ((this.currentIndex - 2 + this.slides.length) % this.slides.length) + 1;
    await this._slideAnimation(oldIndex, newIndex, 'prev');
    this.currentIndex = newIndex;
  }

  /**
   *
   * @param {{ key: string; }} e
   */
  _handleKeyDown(e) {
    if (e.key === 'ArrowRight') {
      this.nextSlide();
    } else if (e.key === 'ArrowLeft') {
      this.prevSlide();
    }
  }

  /**
   *
   * @param {{ target: { current: any; }; }} e
   */
  async _handlePaginationChange(e) {
    const newIndex = e.target.current;
    if (newIndex === this.currentIndex) return;
    const direction = newIndex > this.currentIndex ? 'next' : 'prev';
    await this._slideAnimation(this.currentIndex, newIndex, direction);
    this.currentIndex = newIndex;
  }

  get slides() {
    return /** @type {HTMLElement[]} */ (Array.from(this.children)).filter(
      child => child.slot === 'slide',
    );
  }

  /**
   * @protected
   */
  _updateActiveSlide() {
    const { slides } = this;
    slides.forEach((slide, index) => {
      const isActive = index + 1 === this.currentIndex;
      if (isActive) {
        slide.classList.add('active');
        slide.removeAttribute('tabindex');
      } else {
        slide.classList.remove('active');
        // eslint-disable-next-line no-param-reassign
        slide.tabIndex = -1;
      }
      slide.setAttribute('aria-hidden', `${!isActive}`);
      if (isActive && !this.slideshowAnimating) {
        // eslint-disable-next-line no-param-reassign
        slide.tabIndex = 0;
        slide.focus();
      }
    });
  }

  _getSlidesCount() {
    return this.slides.length;
  }

  _updateAriaLiveSettingForAutoplay() {
    const liveRegion = this.shadowRoot?.querySelector('.aria-live');
    if (this.slideshowAnimating) {
      liveRegion?.setAttribute('aria-live', 'off');
    } else {
      liveRegion?.setAttribute('aria-live', 'polite');
    }
  }

  /**
   * @protected
   */
  _startSlideShow() {
    if (this.slideshowAnimating) return;
    this.slideshowAnimating = true;
    const duration = this.duration || 5000;
    this.slideShowTimer = setInterval(() => {
      this.nextSlide();
    }, duration);
  }

  /**
   * @protected
   */
  _stopSlideShow() {
    if (!this.slideshowAnimating) return;
    this.slideshowAnimating = false;
    clearInterval(this.slideShowTimer);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this.slideShowTimer);
  }
}
