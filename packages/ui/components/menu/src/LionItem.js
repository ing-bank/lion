/* eslint-disable max-classes-per-file */
import { html, css, LitElement } from 'lit';

/**
 * @typedef {import('../types/InteractiveListMixinTypes.js').InteractiveListItemRole} InteractiveListItemRole
 */

/**
 * Lightweight component supporting InteractiveListItemRole as a type.
 *
 * Supports:
 * - 1. menu item
 * <lion-item> Item label </lion-item>
 * - 2. sub menu
 * <lion-item>
 *   <button slot="invoker"> Item label </button>
 *   <lion-menu slot="subitems"> ... </lion-menu>
 * </lion-item>
 *
 * Sets the role property on the right element. For case 1, this would be the item itself,
 * for case 2 it would be the [slot=invoker].
 */
export class LionItem extends LitElement {
  static get properties() {
    return {
      itemRole: {
        type: String,
        attribute: 'item-role',
      }
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
    `;
  }

  get _invokerNode() {
    return Array.from(this.children).find(child => child.slot === 'invoker');
  }

  constructor() {
    super();
    /** @type {InteractiveListItemRole} */
    this.itemRole = 'listitem';
  }

  connectedCallback() {
    super.connectedCallback();

    if (this._invokerNode) {
      this._invokerNode.setAttribute('role', this.itemRole);
    } else {
      this.setAttribute('role', this.itemRole);
    }
  }

  render() {
    return html`
      <slot name="invoker"></slot>
      <slot></slot>
    `;
  }
}
