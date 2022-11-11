import { html, css, LitElement } from 'lit';

/**
 * Material Design Ripple Element
 *
 * - should be placed in a 'positioned' context (having positon: (realtive/fixed/absolute))
 */
class MdRipple extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          overflow: hidden;
          transition: 0.1s ease-in;
          user-select: none;
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }

        :host:hover {
          cursor: pointer;
        }

        #ripple {
          background-color: rgba(0, 0, 0, 0.1);
          border-radius: 100%;
          position: relative;
          transform: scale(0);
        }

        .animate {
          animation: ripple 0.4s linear;
        }

        @keyframes ripple {
          100% {
            transform: scale(12);
            background-color: transparent;
          }
        }
      `,
    ];
  }

  render() {
    return html` <div id="ripple"></div> `;
  }

  firstUpdated(c) {
    super.firstUpdated(c);
    this._ripple = this.shadowRoot.querySelector('#ripple');
    this._ripple.style.cssText = `width: ${this.offsetHeight}px; height: ${this.offsetHeight}px;`;
    this.__onRipple = this.__onRipple.bind(this);
    this.addEventListener('mousedown', this.__onRipple);
  }

  disconnectedCallback() {
    this.removeEventListener('mousedown', this.__onRipple);
  }

  __onRipple(e) {
    this._ripple.classList.remove('animate');
    const rect = this.getBoundingClientRect();
    const offset = {
      top: rect.top + document.body.scrollTop,
      left: rect.left + document.body.scrollLeft,
    };
    this._ripple.style.left = `${
      parseInt(e.pageX - offset.left, 10) - this._ripple.offsetWidth / 2
    }px`;
    this._ripple.style.top = `${
      parseInt(e.pageY - offset.top, 10) - this._ripple.offsetHeight / 2
    }px`;
    this._ripple.classList.add('animate');
  }
}
customElements.define('md-ripple', MdRipple);
