import '../src/hybrid-lit2/patch-directive.js';
import { LitElement, html, css } from 'lit';
import {
  Html1InHybrid2Lit2Directives,
  Hybrid2InHybrid2Lit2Directives,
  Lit1Directives,
  Lit2Directives,
  Html1InHtml1Lit2Directives,
} from './hybridDirectives.js';

customElements.define('html1-in-hybrid2-lit2-directives', Html1InHybrid2Lit2Directives);
customElements.define('hybrid2-in-hybrid2-lit2-directives', Hybrid2InHybrid2Lit2Directives);
customElements.define('html1-in-html1-lit2-directives', Html1InHtml1Lit2Directives);

customElements.define('lit1-directives', Lit1Directives);
customElements.define('lit2-directives', Lit2Directives);

class HybridApp extends LitElement {
  static get properties() {
    return {
      __myToggleVal: { type: Number },
      __myToggleOtherVal: { type: Number },
      __reset: { type: Boolean },
    };
  }

  static get styles() {
    return [
      css`
        .flex-equal {
          display: flex;
        }

        .flex-equal > * {
          flex: 1;
        }
      `,
    ];
  }

  constructor() {
    super();

    this.__reset = false;
  }

  render() {
    return html`
      <div style="text-align: center; margin: 0 auto; max-width: 700px">
        <h1>Hybrid app</h1>
        <div style="flex-wrap: wrap;">
          <button
            @click=${() => {
              this.__myToggleVal = this.__myToggleVal === 1 ? 2 : 1;
            }}
          >
            Toggle Directive values
          </button>
          <button
            @click=${() => {
              this.__myToggleOtherVal = this.__myToggleOtherVal === 1 ? 2 : 1;
            }}
          >
            Toggle Directive Other values
          </button>
          <button
            @click=${() => {
              this.__reset = true;
              setTimeout(() => {
                this.__reset = false;
              });
            }}
          >
            Reset
          </button>
        </div>
      </div>
      <div class="wrapper">
        <div style="flex-wrap: wrap;">
          <div class="flex-equal">
            <lit1-directives
              .reset="${this.__reset}"
              .toggleValue="${this.__myToggleVal}"
              .toggleOtherValue="${this.__myToggleOtherVal}"
            ></lit1-directives>
            <lit2-directives
              .reset="${this.__reset}"
              .toggleValue="${this.__myToggleVal}"
              .toggleOtherValue="${this.__myToggleOtherVal}"
            ></lit2-directives>
          </div>
          <div class="flex-equal">
            <html1-in-hybrid2-lit2-directives
              .reset="${this.__reset}"
              .toggleValue="${this.__myToggleVal}"
              .toggleOtherValue="${this.__myToggleOtherVal}"
            ></html1-in-hybrid2-lit2-directives>
            <hybrid2-in-hybrid2-lit2-directives
              .reset="${this.__reset}"
              .toggleValue="${this.__myToggleVal}"
              .toggleOtherValue="${this.__myToggleOtherVal}"
            ></hybrid2-in-hybrid2-lit2-directives>
            <html1-in-html1-lit2-directives
              .reset="${this.__reset}"
              .toggleValue="${this.__myToggleVal}"
              .toggleOtherValue="${this.__myToggleOtherVal}"
            ></html1-in-html1-lit2-directives>
          </div>
        </div>
      </div>
    `;
  }
}
customElements.define('hybrid-app', HybridApp);
