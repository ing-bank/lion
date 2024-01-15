import { LitElement, html } from 'lit-element';
import { demoDesignRegistry } from '../components/shared/demoDesignRegistry.js';
import { registerDemoDesigns } from '../design-providers/registerDemoDesigns.js';

registerDemoDesigns();

class DemoSwitcher extends LitElement {
  static properties = {
    sets: { type: Array },
    activeSet: { type: String, attribute: 'active-set' },
  };

  constructor() {
    super();
    this.sets = demoDesignRegistry.getSets();
    this.activeSet = 'lionportal';
  }

  render() {
    return html`
      <select @change=${this._onChange}>
        ${this.sets.map(
          set => html` <option value=${set} ?selected=${set === this.activeSet}>${set}</option> `,
        )}
      </select>
    `;
  }

  _onChange(e) {
    const { value } = e.target;
    demoDesignRegistry.activateSetGlobally(value);
  }
}
customElements.define('demo-switcher', DemoSwitcher);
