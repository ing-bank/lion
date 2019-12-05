import { LitElement, html, css, UpdateStylesMixin } from '@lion/core';

export class LionTooltipArrow extends UpdateStylesMixin(LitElement) {
  static get properties() {
    return {
      placement: { type: String, reflect: true },
    };
  }

  static get styles() {
    return css`
      :host {
        position: absolute;
        --tooltip-arrow-height: 0px;
      }

      .arrow {
        width: 8px;
      }

      svg {
        display: block;
      }

      :host([placement^='top']) {
        bottom: var(--tooltip-arrow-height);
      }

      :host([placement^='bottom']) {
        top: var(--tooltip-arrow-height);
        transform: rotate(180deg);
      }

      :host([placement^='left']) {
        right: var(--tooltip-arrow-height);
        transform: rotate(270deg);
      }

      :host([placement^='right']) {
        left: var(--tooltip-arrow-height);
        transform: rotate(90deg);
      }
    `;
  }

  // FIXME: Bug on IE11 where bounding client rect gives back weird value.. ('150' instead of '4') and that's why the placement is way off
  _updateArrowStyles() {
    const arrowRect = this.getBoundingClientRect();
    let arrowHeight;
    if (this.placement) {
      // Means it's already rotated by a quarter, so take the width instead
      if (this.placement.indexOf('right') !== -1 || this.placement.indexOf('left') !== -1) {
        arrowHeight = arrowRect.width;
      } else {
        arrowHeight = arrowRect.height;
      }
      this.updateStyles({ '--tooltip-arrow-height': `-${arrowHeight}px` });
    }
  }

  connectedCallback() {
    super.connectedCallback();
    // Add mutation observer on the shadow outlet's x-placement attribute
    this.__addXPlacementMutationObserver();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.__removeXPlacementMutationObserver();
  }

  render() {
    return html`
      <div class="arrow">
        <svg viewBox="0 0 100 80">
          <path d="M 0,0 h 100 L 50,80 z"></path>
        </svg>
      </div>
    `;
  }

  __addXPlacementMutationObserver() {
    if (
      this.parentElement &&
      this.parentElement.parentElement &&
      this.parentElement.parentElement.slot === '_overlay-shadow-outlet'
    ) {
      this.placementObserver = new MutationObserver(this.__xPlacementMutationCallback.bind(this));
      this.placementObserver.observe(this.parentElement.parentElement, { attributes: true });
    }
  }

  __xPlacementMutationCallback(mutationList) {
    mutationList.forEach(mutation => {
      if (mutation.attributeName === 'x-placement') {
        this.placement = mutation.target.getAttribute('x-placement');
        this._updateArrowStyles();
      }
    });
  }

  __removeXPlacementMutationObserver() {
    if (this.placementObserver) {
      this.placementObserver.disconnect();
    }
  }
}
