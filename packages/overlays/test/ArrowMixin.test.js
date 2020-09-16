import { expect, fixture } from '@open-wc/testing';
import { LitElement, html } from '@lion/core';
import { ArrowMixin, OverlayMixin } from '../index.js';

describe('ArrowMixin', () => {
  class ArrowTest extends ArrowMixin(OverlayMixin(LitElement)) {
    /**
     * @overridable method `_defineOverlay`
     * @desc Overrides arrow and keepTogether modifier to be enabled,
     * and adds onCreate and onUpdate hooks to sync from popper state
     * @returns {import('../types/OverlayConfig').OverlayConfig}
     */
    _defineOverlayConfig() {
      return {
        ...super._defineOverlayConfig(),
        placementMode: 'local',
        popperConfig: {
          ...super._defineOverlayConfig().popperConfig,
          placement: 'bottom',
        },
      };
    }

    constructor() {
      super();
      this.__toggle = this.__toggle.bind(this);
    }

    __toggle() {
      this.opened = !this.opened;
    }

    _setupOpenCloseListeners() {
      super._setupOpenCloseListeners();
      if (this._overlayInvokerNode) {
        this._overlayInvokerNode.addEventListener('click', this.__toggle);
      }
    }

    _teardownOpenCloseListeners() {
      super._teardownOpenCloseListeners();
      if (this._overlayInvokerNode) {
        this._overlayInvokerNode.removeEventListener('click', this.__toggle);
      }
    }
  }
  before(() => {
    customElements.define('arrow-test', ArrowTest);
  });

  it('shows by default', async () => {
    const el = /** @type {ArrowTest} */ (await fixture(html`
      <arrow-test>
        <div slot="content">This is a tooltip</div>
        <button slot="invoker">Tooltip button</button>
      </arrow-test>
    `));
    expect(el.hasAttribute('has-arrow')).to.be.true;

    const arrowNode = /** @type {Element} */ (el._arrowNode);
    expect(window.getComputedStyle(arrowNode).getPropertyValue('display')).to.equal('block');
  });

  it('hides the arrow when has-arrow is false', async () => {
    const el = /** @type {ArrowTest} */ (await fixture(html`
      <arrow-test>
        <div slot="content">This is a tooltip</div>
        <button slot="invoker">Tooltip button</button>
      </arrow-test>
    `));
    el.hasArrow = false;
    await el.updateComplete;
    expect(el.hasAttribute('has-arrow')).to.be.false;
    const arrowNode = /** @type {Element} */ (el._arrowNode);
    expect(window.getComputedStyle(arrowNode).getPropertyValue('display')).to.equal('none');
  });

  it('makes sure positioning of the arrow is correct', async () => {
    const el = /** @type {ArrowTest} */ (await fixture(html`
      <arrow-test
        .config="${/** @type {import('../types/OverlayConfig').OverlayConfig} */ ({
          popperConfig: {
            placement: 'right',
          },
        })}"
        style="position: relative; top: 10px;"
      >
        <div slot="content" style="height: 30px; background-color: red;">Hey there</div>
        <button slot="invoker" style="height: 30px;">Tooltip button</button>
      </arrow-test>
    `));

    el.opened = true;

    await el.repositionComplete;
    expect(
      getComputedStyle(/** @type {HTMLElement} */ (el._arrowNode)).getPropertyValue('left'),
    ).to.equal(
      '-10px',
      `
        arrow height is 8px so this offset should be taken into account to align the arrow properly,
        as well as half the difference between width and height ((12 - 8) / 2 = 2)
      `,
    );
  });
});
