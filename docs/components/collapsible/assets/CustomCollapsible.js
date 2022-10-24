import { LionCollapsible } from '@lion/ui/collapsible.js';

const EVENT = {
  TRANSITION_END: 'transitionend',
  TRANSITION_START: 'transitionstart',
};
/**
 * `CustomCollapsible` is a class for custom collapsible element (`<custom-collapsible>` web component).
 * @customElement custom-collapsible
 */
// @ts-expect-error false positive for incompatible static get properties. Lit-element merges super properties already for you.
export class CustomCollapsible extends LionCollapsible {
  static get properties() {
    return {
      transitioning: {
        type: Boolean,
        reflect: true,
      },
    };
  }

  constructor() {
    super();
    this.transitioning = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this._contentNode?.style.setProperty(
      'transition',
      'max-height 0.35s, padding 0.35s, opacity 0.35s',
    );
    if (this.opened) {
      this._contentNode?.style.setProperty('padding', '12px 0');
    }
  }

  /**
   * Wait until transition is finished.
   * @override
   */
  toggle() {
    if (!this.transitioning) {
      super.toggle();
    }
  }

  /**
   * Trigger show animation and wait for transition to be finished.
   * @param {Object} options - element node and its options
   * @param {HTMLElement} options.contentNode
   * @override
   */
  async _showAnimation({ contentNode }) {
    const expectedHeight = await this.__calculateHeight(contentNode);
    contentNode.style.setProperty('opacity', '1');
    contentNode.style.setProperty('padding', '12px 0');
    contentNode.style.setProperty('max-height', '0px');
    await new Promise(resolve => requestAnimationFrame(() => resolve()));
    contentNode.style.setProperty('max-height', expectedHeight);
    await this._waitForTransition({ contentNode });
  }

  /**
   * Trigger hide animation and wait for transition to be finished.
   * @param {Object} options - element node and its options
   * @param {HTMLElement} options.contentNode
   * @override
   */
  async _hideAnimation({ contentNode }) {
    if (this._contentHeight === '0px') {
      return;
    }
    ['opacity', 'padding', 'max-height'].map(prop => contentNode.style.setProperty(prop, '0'));
    await this._waitForTransition({ contentNode });
  }

  /**
   *  Wait until the transition event is finished.
   * @param {Object} options - element node and its options
   * @param {HTMLElement} options.contentNode
   * @returns {Promise<void>} transition event
   */
  _waitForTransition({ contentNode }) {
    return new Promise(resolve => {
      const transitionStarted = () => {
        contentNode.removeEventListener(EVENT.TRANSITION_START, transitionStarted);
        this.transitioning = true;
      };
      contentNode.addEventListener(EVENT.TRANSITION_START, transitionStarted);

      const transitionEnded = () => {
        contentNode.removeEventListener(EVENT.TRANSITION_END, transitionEnded);
        this.transitioning = false;
        resolve();
      };
      contentNode.addEventListener(EVENT.TRANSITION_END, transitionEnded);
    });
  }

  /**
   * Calculate total content height after collapsible opens
   * @param {HTMLElement} contentNode content node
   * @private
   */
  async __calculateHeight(contentNode) {
    contentNode.style.setProperty('max-height', '');
    await new Promise(resolve => requestAnimationFrame(() => resolve()));
    return this._contentHeight; // Expected height i.e. actual size once collapsed after animation
  }
}

customElements.define('custom-collapsible', CustomCollapsible);
