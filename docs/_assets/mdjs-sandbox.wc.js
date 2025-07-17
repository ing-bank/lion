import { LitElement, html, css } from 'lit';
import { editOnStackblitz } from './stackblitz.js';
import { editOnCodepen } from './codepen.js';
import { CodeIcon, CodeSandbox, Stackblitz } from './sandbox-icons.js';

class MdjsSandbox extends LitElement {
  static styles = css`
    .mdjs-sandbox__preview {
      border: 1px solid var(--primary-lines-color);
      min-height: 4rem;
      overflow: hidden;
    }

    .mdjs-sandbox__tools {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }

    .mdjs-sandbox__tools lion-button {
      padding: 4px 6px;
      font-size: 14px;
    }

    .mdjs-sandbox__tools lion-button svg {
      margin-right: 0.25rem;
      height: 1rem;
      width: 1rem;
    }

    .mdjs-sandbox__demo {
      padding: 1rem;
    }
  `;

  static get properties() {
    return {
      codeContent: { type: String },
      demoElName: { type: String },
      showCode: { type: Boolean },
    };
  }

  firstUpdated() {
    this.__getAssignedNodes();
  }

  __getAssignedNodes() {
    const slot = this.shadowRoot?.querySelector('slot[mdjs-sandbox-code]');
    // @ts-ignore
    slot.addEventListener('slotchange', () => {
      try {
        // @ts-ignore
        const nodes = slot.assignedNodes();
        const codeSnippets = document.createElement('script');
        codeSnippets.setAttribute('type', 'module');
        codeSnippets.textContent = nodes[1].textContent;

        this.codeContent = nodes[1].textContent;

        /* eslint-disable prefer-destructuring */
        this.demoElName = (codeSnippets.textContent?.match(/\b([a-z-]+-demo)\b/) ?? [])[0];

        // @ts-ignore
        const demoElement = document.createElement(/** @type {any} */ this.demoElName);

        this.renderRoot.querySelector('.mdjs-sandbox__demo')?.appendChild(demoElement);

        document.body.appendChild(codeSnippets);
      } catch (error) {
        console.error('Demo is not loaded: ', error);
      }
    });
  }

  // @ts-ignore
  __handleStackblitz() {
    editOnStackblitz(this.codeContent, this.demoElName);
  }

  __handleCodepen() {
    editOnCodepen(this.codeContent, this.demoElName);
  }

  __handleToggleCode() {
    this.showCode = !this.showCode;
  }

  render() {
    return html`
      <div class="mdjs-sandbox">
        <div class="mdjs-sandbox__preview">
          <div class="mdjs-sandbox__tools">
            <lion-button @click=${this.__handleStackblitz}>${Stackblitz} Stackblitz</lion-button>
            <lion-button @click=${this.__handleCodepen}>${CodeSandbox} Code Pen</lion-button>
            <lion-button @click=${this.__handleToggleCode}>${CodeIcon} Show Code</lion-button>
          </div>
          <div class="mdjs-sandbox__demo">
            <!--- demo-commponent-tag will be injected here--->
          </div>
        </div>
        <div class="mdjs-sandbox__code" ?hidden=${!this.showCode}>
          <slot mdjs-sandbox-code></slot>
        </div>
      </div>
    `;
  }
}

customElements.define('mdjs-sandbox', MdjsSandbox);
