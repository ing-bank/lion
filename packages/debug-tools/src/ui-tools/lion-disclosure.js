import { LitElement, html } from '@lion/core';

/* eslint-disable */
// TODO: lint and complete
// Implements the official aria widget/design pattern:
// https://www.w3.org/TR/2017/NOTE-wai-aria-practices-1.1-20171214/#disclosure
// Uses: https://www.w3.org/TR/2017/NOTE-wai-aria-practices-1.1-20171214/examples/disclosure/disclosure-faq.html

class LionDisclosure extends LitElement {
  static get properties() {
    return {
      opened: {
        type: Boolean,
      },
    };
  }

  constructor() {
    super();
    this.opened = false;
    if (typeof this.constructor._idCounter !== 'undefined') {
      this.constructor._idCounter++;
    } else {
      this.constructor._idCounter = 0;
    }
    this._id = `${this.localName}-${this.constructor._idCounter.toString(16)}`;
  }

  connectedCallback() {
    super.connectedCallback();
    const invoker = this.querySelector('[data-disclosure-invoker], [data-invoker]');
    const content = this.querySelector('[data-disclosure-content], [data-content]');

    content.id = `${this._id}-content`;
    invoker.setAttribute('aria-expanded', this.opened ? 'true' : 'false');
    content.hidden = !this.opened;
    invoker.setAttribute('aria-controls', content.id);
  }

  updatedShadowDomCallback() {
    this._init(this);
  }

  render() {
    return this.constructor.template;
  }

  static get template() {
    return html`
      <slot></slot>
    `;
  }

  _init(root) {
    /*
     *   This content is licensed according to the W3C Software License at
     *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
     *
     *   File:   ButtonExpand.js
     *
     *   Desc:   Checkbox widget that implements ARIA Authoring Practices
     *           for a menu of links
     */

    /*
     *   @constructor ButtonExpand
     */
    const ButtonExpand = function() {
      this.domNode = root.querySelector('[data-disclosure-invoker], [data-invoker]');
      this.controlledNode = root.querySelector('[data-disclosure-content], [data-content]');

      this.keyCode = Object.freeze({
        RETURN: 13,
      });
    };

    ButtonExpand.prototype.init = function() {
      this.domNode.setAttribute('aria-expanded', 'false');
      this.hideContent();

      this.domNode.addEventListener('keydown', this.handleKeydown.bind(this));
      this.domNode.addEventListener('click', this.handleClick.bind(this));
      this.domNode.addEventListener('focus', this.handleFocus.bind(this));
      this.domNode.addEventListener('blur', this.handleBlur.bind(this));
    };

    ButtonExpand.prototype.showContent = function() {
      if (this.controlledNode) {
        this.controlledNode.style.display = 'block';
      }
    };

    ButtonExpand.prototype.hideContent = function() {
      if (this.controlledNode) {
        this.controlledNode.style.display = 'none';
      }
    };

    ButtonExpand.prototype.toggleExpand = function() {
      if (this.domNode.getAttribute('aria-expanded') === 'true') {
        this.domNode.setAttribute('aria-expanded', 'false');
        this.hideContent();
      } else {
        this.domNode.setAttribute('aria-expanded', 'true');
        this.showContent();
      }
    };

    /* EVENT HANDLERS */

    ButtonExpand.prototype.handleKeydown = function(event) {
      switch (event.keyCode) {
        case this.keyCode.RETURN:
          this.toggleExpand();
          event.stopPropagation();
          event.preventDefault();
          break;
        default:
          break;
      }
    };

    ButtonExpand.prototype.handleClick = function(event) {
      this.toggleExpand();
    };

    ButtonExpand.prototype.handleFocus = function(event) {
      this.domNode.classList.add('focus');
    };

    ButtonExpand.prototype.handleBlur = function(event) {
      this.domNode.classList.remove('focus');
    };

    /* Initialize Hide/Show Buttons */

    // window.addEventListener('load', function (event) {

    //   var buttons = document.querySelectorAll('button[aria-expanded][aria-controls]');

    //   for (var i = 0; i < buttons.length; i++) {
    //     var be = new ButtonExpand(buttons[i]);
    //     be.init();
    //   }

    // }, false);

    const be = new ButtonExpand(root);
    be.init();
  }
}

customElements.define('lion-disclosure', LionDisclosure);
