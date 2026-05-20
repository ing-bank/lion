import { OverlayMixin, withDropdownConfig } from '@lion/ui/overlays.js';
import { LitElement, html } from 'lit';

/**
 * @typedef {import('@lion/ui/types/overlays.js').OverlayConfig} OverlayConfig
 */
export class MoreButtonMenu extends OverlayMixin(LitElement) {
  // eslint-disable-next-line class-methods-use-this
  _defineOverlayConfig() {
    return /** @type {OverlayConfig} */ ({
      placementMode: 'global',
      ...withDropdownConfig(),
    });
  }

  render() {
    return html`
      <slot name="invoker"></slot>
      <slot name="backdrop"></slot>
      <slot name="content"></slot>
    `;
  }
}
