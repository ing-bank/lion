import { html, unsafeHTML } from '@lion/core';
import { LionLitElement } from '../../core/src/LionLitElement.js';
import { updatePosition } from '../../overlays/src/utils/manage-position.js';
import { getPlacement } from '../../overlays/src/utils/get-position.js';
import pointerSvg from '../../../assets/icons/pointer.svg.js';

import '../../icon/lion-icon.js';

export class LionPointingFrame extends LionLitElement {
  static get properties() {
    return {
      position: {
        type: String,
        reflect: true,
      },
      invokerWidth: {
        type: Number,
        attribute: 'invoker-width',
      },
      invokerHeight: {
        type: Number,
        attribute: 'invoker-height',
      },
      pointerOffset: {
        type: Number,
      },
    };
  }

  constructor() {
    super();
    this.pointerOffset = 16;
  }

  // Return user supplied pointer or default pointer if it wasn't supplied.
  get _pointer() {
    return this.$$slot('pointer') || this.shadowRoot.querySelector('slot[name="pointer"]');
  }

  updated() {
    super.updated();
    if (this.position !== this.__prevPos) {
      this.__prevPos = this.position;
      /**
       * 1) Reset pointer rotation / styles
       * Necessary with rectangular pointers since 90deg or 270deg rotation
       * flip height and width. Calculations will then be wrong.
       */
      const {
        defaultPointerStyles,
        width: pointerWidth,
        height: pointerHeight,
      } = this.__resetPointerStyles(this._pointer);

      /* 2) Set padding / margin based on pointer */
      this.__setFrameStyles(pointerWidth, pointerHeight);

      /* 3) Hide the pointer */
      this.__hidePointer(this._pointer, defaultPointerStyles);

      /**
       * 4) Reposition with the new spacing on the pointing-frame
       * Pointer is hidden first so it does not influence the placement,
       * since we already set padding for it.
       *
       * The parentElement position is taken (user-defined preferred position)
       * This to prevent infinite loops when using the actual position that is given
       */
      updatePosition(this, this.nextElementSibling, {
        placement: this.parentElement.position,
        position: 'absolute',
      });

      /* 5) Rotate, position and display the pointer properly */
      this.__setPointerStyles(this._pointer, defaultPointerStyles, pointerWidth, pointerHeight);

      // TODO: Overflow auto behavior on the content box, instead of the pointing frame
    }
  }

  /* eslint-disable-next-line class-methods-use-this */
  __hidePointer(pointerEl, defaultPointerStyles) {
    const pointerStyles = { ...defaultPointerStyles, display: 'none' };
    Object.assign(pointerEl.style, pointerStyles);
  }

  /* eslint-disable-next-line class-methods-use-this */
  __resetPointerStyles(pointerEl) {
    const defaultPointerStyles = {
      display: 'block',
      position: 'absolute',
      bottom: 'auto',
      top: 'auto',
      left: 'auto',
      right: 'auto',
      transform: 'rotate(0deg)',
    };
    Object.assign(pointerEl.style, defaultPointerStyles);

    // Bugfix to ensure div around svg has the same dimensions as svg
    const svg = pointerEl.querySelector('svg');
    if (svg) {
      svg.style.display = 'inherit';
    }

    const { height, width } = pointerEl.getBoundingClientRect();
    return { defaultPointerStyles, width, height };
  }

  __setPointerStyles(pointerEl, defaultPointerStyles, pointerWidth, pointerHeight) {
    const pointerStyles = { ...defaultPointerStyles };
    const pointingFrameHeight = this.getBoundingClientRect().height;
    const pointingFrameWidth = this.getBoundingClientRect().width;

    const { vertical, horizontal, horizontalIsPrimary } = getPlacement(this.position);

    if (horizontalIsPrimary) {
      if (horizontal === 'left') {
        pointerStyles.transform = 'rotate(90deg)';
        // Correction to do with the quarter rotations of pointers with rectangular dimensions.
        pointerStyles.right = `${-(Math.abs(pointerWidth - pointerHeight) / 2)}px`;
      } else if (horizontal === 'right') {
        pointerStyles.transform = 'rotate(270deg)';
        pointerStyles.left = `${-(Math.abs(pointerWidth - pointerHeight) / 2)}px`;
      }

      const spacing = this.invokerHeight / 2 - pointerWidth / 2 - this.pointerOffset;
      if (vertical === 'top') {
        if (spacing < 0) {
          pointerStyles.bottom = `${pointerHeight / 2 + this.pointerOffset}px`;
        } else {
          pointerStyles.bottom = `${pointerHeight / 2 +
            this.invokerHeight / 2 -
            pointerWidth / 2}px`;
        }
      } else if (vertical === 'center') {
        pointerStyles.bottom = `${pointingFrameHeight / 2 - pointerHeight / 2}px`;
      } else if (vertical === 'bottom') {
        if (spacing < 0) {
          pointerStyles.top = `${pointerHeight / 2 + this.pointerOffset}px`;
        } else {
          pointerStyles.top = `${pointerHeight / 2 + this.invokerHeight / 2 - pointerWidth / 2}px`;
        }
      }
    } else {
      const spacing = this.invokerWidth / 2 - pointerWidth / 2 - this.pointerOffset;
      if (horizontal === 'left') {
        if (spacing < 0) {
          pointerStyles.right = `${this.pointerOffset}px`;
        } else {
          pointerStyles.right = `${this.invokerWidth / 2 - pointerWidth / 2}px`;
        }
      } else if (horizontal === 'center') {
        pointerStyles.bottom = 0;
        pointerStyles.left = `${pointingFrameWidth / 2 - pointerWidth / 2}px`;
      } else if (horizontal === 'right') {
        if (spacing < 0) {
          pointerStyles.left = `${this.pointerOffset}px`;
        } else {
          pointerStyles.left = `${this.invokerWidth / 2 - pointerWidth / 2}px`;
        }
      }

      if (vertical === 'top') {
        pointerStyles.transform = 'rotate(180deg)';
        pointerStyles.bottom = 0;
      } else if (vertical === 'bottom') {
        pointerStyles.top = 0;
      }
    }

    Object.assign(pointerEl.style, pointerStyles);
  }

  __setFrameStyles(pointerWidth, pointerHeight) {
    const pointingFrameEl = this.shadowRoot.querySelector('.pointing-frame');

    const frameStyles = {
      paddingBottom: 0,
      paddingTop: 0,
      paddingRight: 0,
      paddingLeft: 0,
    };

    const hostStyles = {
      marginTop: 0,
      marginBottom: 0,
      marginRight: 0,
      marginLeft: 0,
    };

    const { vertical, horizontal, horizontalIsPrimary } = getPlacement(this.position);
    if (horizontalIsPrimary) {
      if (horizontal === 'left') {
        frameStyles.paddingRight = `${pointerHeight}px`;
      } else if (horizontal === 'right') {
        frameStyles.paddingLeft = `${pointerHeight}px`;
      }

      const spacing = this.invokerHeight / 2 - pointerWidth / 2 - this.pointerOffset;
      if (vertical === 'top') {
        if (spacing < 0) {
          hostStyles.marginTop = `${Math.abs(spacing)}px`;
        } else {
          frameStyles.paddingBottom = `${spacing}px`;
        }
      } else if (vertical === 'bottom') {
        if (spacing < 0) {
          hostStyles.marginTop = `${spacing}px`;
        } else {
          frameStyles.paddingTop = `${spacing}px`;
        }
      }
    } else {
      const spacing = this.invokerWidth / 2 - pointerWidth / 2 - this.pointerOffset;
      if (horizontal === 'left') {
        if (spacing < 0) {
          hostStyles.marginLeft = `${Math.abs(spacing)}px`;
        } else {
          frameStyles.paddingRight = `${spacing}px`;
        }
      } else if (horizontal === 'right') {
        if (spacing < 0) {
          hostStyles.marginLeft = `${spacing}px`;
        } else {
          frameStyles.paddingLeft = `${spacing}px`;
        }
      }

      if (vertical === 'top') {
        frameStyles.paddingBottom = `${pointerHeight}px`;
      } else if (vertical === 'bottom') {
        frameStyles.paddingTop = `${pointerHeight}px`;
      }
    }

    Object.assign(pointingFrameEl.style, frameStyles);
    Object.assign(this.style, hostStyles);
  }

  // eslint-disable-next-line class-methods-use-this
  render() {
    return html`
      <div class="pointing-frame">
        <slot></slot>
        <slot name="pointer">
          ${unsafeHTML(pointerSvg)}
        </slot>
      </div>
    `;
  }
}
