/* eslint-disable max-classes-per-file */
/* eslint-disable import/no-extraneous-dependencies */
import { html, LitElement, css } from 'lit';
import { withDropdownConfig } from '@lion/ui/overlays.js';
import './demo-el-using-overlaymixin.js';

export class DemoOverlayReferenceWidth extends LitElement {
  static get properties() {
    return {
      mode: { type: String },
      source: { type: String },
      widthOffset: { type: Number },
      invokerWidth: { type: Number },
      contentWidth: { type: Number },
      measuredInvokerWidth: { type: Number },
      measuredContentWidth: { type: Number },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        font-family: sans-serif;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 20px;
        background: #fafafa;
        margin: 16px 0;
      }

      .controls {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
        background: #ffffff;
        padding: 16px;
        border-radius: 6px;
        border: 1px solid #e0e0e0;
        margin-bottom: 20px;
      }

      .control-group {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .control-group label {
        font-weight: 600;
        font-size: 13px;
        color: #333333;
      }

      .control-group select,
      .control-group input[type='number'] {
        padding: 6px 10px;
        border: 1px solid #cccccc;
        border-radius: 4px;
        font-size: 14px;
        background: #ffffff;
      }

      .preset-buttons {
        display: flex;
        gap: 6px;
      }

      .preset-buttons button {
        padding: 4px 10px;
        font-size: 12px;
        border: 1px solid #ccc;
        border-radius: 4px;
        background: #f0f0f0;
        cursor: pointer;
      }

      .preset-buttons button:hover {
        background: #e0e0e0;
      }

      .stage-card {
        background: #ffffff;
        border: 1px solid #e0e0e0;
        border-radius: 6px;
        padding: 20px;
        margin-bottom: 16px;
      }

      .instruction-text {
        font-size: 13px;
        color: #555555;
        margin-top: 0;
        margin-bottom: 16px;
      }

      .resizable-box {
        resize: horizontal;
        overflow: auto;
        min-width: 120px;
        max-width: 100%;
        box-sizing: border-box;
      }

      .invoker-box {
        border: 2px dashed #ff6200;
        background: #fff0e6;
        padding: 8px 12px;
        border-radius: 6px;
        display: inline-block;
      }

      .invoker-button {
        background: #ff6200;
        color: white;
        border: none;
        padding: 8px 14px;
        border-radius: 4px;
        font-weight: 600;
        cursor: pointer;
        width: 100%;
        box-sizing: border-box;
        text-align: left;
      }

      .demo-overlay {
        background-color: #222222;
        color: #ffffff;
        padding: 12px 16px;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        box-sizing: border-box;
      }

      .close-button {
        background: transparent;
        border: none;
        color: #ffffff;
        font-size: 18px;
        cursor: pointer;
        padding: 0 4px;
      }

      .metrics {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        margin-bottom: 16px;
        font-size: 13px;
        color: #444444;
      }

      .badge {
        background: #e3f2fd;
        color: #0d47a1;
        padding: 2px 8px;
        border-radius: 4px;
        font-family: monospace;
        font-weight: 600;
      }

      pre {
        background: #1e1e1e;
        color: #d4d4d4;
        padding: 12px;
        border-radius: 6px;
        overflow-x: auto;
        font-size: 13px;
        margin: 0;
      }
    `;
  }

  constructor() {
    super();
    this.mode = 'min';
    this.source = 'reference';
    this.widthOffset = 0;
    this.invokerWidth = 220;
    this.contentWidth = 180;
    this.measuredInvokerWidth = 0;
    this.measuredContentWidth = 0;
  }

  firstUpdated() {
    /** @private */
    this.__measureObserver = new ResizeObserver(() => {
      this.__updateMeasurements();
    });
    this.__updateObserverTargets();
  }

  /**
   * @param {import('lit').PropertyValues} changedProperties
   */
  updated(changedProperties) {
    super.updated(changedProperties);
    if (
      changedProperties.has('mode') ||
      changedProperties.has('source') ||
      changedProperties.has('widthOffset') ||
      changedProperties.has('invokerWidth') ||
      changedProperties.has('contentWidth')
    ) {
      this.updateComplete.then(() => {
        this.__updateObserverTargets();
        this.__updateMeasurements();
      });
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.__measureObserver?.disconnect();
  }

  __updateObserverTargets() {
    if (!this.__measureObserver) return;
    this.__measureObserver.disconnect();
    const invoker = this.shadowRoot?.querySelector('.invoker-box');
    const content = this.shadowRoot?.querySelector('.content-box');
    if (invoker) this.__measureObserver.observe(invoker);
    if (content) this.__measureObserver.observe(content);
  }

  __updateMeasurements() {
    const invoker = this.shadowRoot?.querySelector('.invoker-box');
    const content = this.shadowRoot?.querySelector('.content-box');
    if (invoker) {
      this.measuredInvokerWidth = Math.round(invoker.getBoundingClientRect().width);
    }
    if (content) {
      this.measuredContentWidth = Math.round(content.getBoundingClientRect().width);
    }
  }

  /** @param {Event} e */
  _onModeChange(e) {
    this.mode = /** @type {HTMLSelectElement} */ (e.target).value;
  }

  /** @param {Event} e */
  _onSourceChange(e) {
    this.source = /** @type {HTMLSelectElement} */ (e.target).value;
  }

  /** @param {Event} e */
  _onOffsetChange(e) {
    this.widthOffset = Number(/** @type {HTMLInputElement} */ (e.target).value) || 0;
  }

  /** @param {number} width */
  _setInvokerWidth(width) {
    this.invokerWidth = width;
  }

  render() {
    const overlayConfig = {
      ...withDropdownConfig(),
      inheritsReferenceWidth:
        this.mode === 'none'
          ? 'none'
          : {
              mode: /** @type {'min'|'max'|'full'|'none'} */ (this.mode),
              source: /** @type {'reference'|'content'} */ (this.source),
              widthOffset: this.widthOffset,
            },
    };

    return html`
      <div class="controls">
        <div class="control-group">
          <label for="mode-select">Inheritance Mode (mode):</label>
          <select id="mode-select" .value="${this.mode}" @change="${this._onModeChange}">
            <option value="min">min (target ≥ source)</option>
            <option value="full">full (target = source + offset)</option>
            <option value="max">max (target ≤ source)</option>
            <option value="none">none (disabled)</option>
          </select>
        </div>

        <div class="control-group">
          <label for="source-select">Width Source (source):</label>
          <select id="source-select" .value="${this.source}" @change="${this._onSourceChange}">
            <option value="reference">reference (invoker → content)</option>
            <option value="content">content (content → invoker)</option>
          </select>
        </div>

        <div class="control-group">
          <label for="offset-input">Width Offset (widthOffset px):</label>
          <input
            id="offset-input"
            type="number"
            .value="${String(this.widthOffset)}"
            @input="${this._onOffsetChange}"
          />
        </div>

        <div class="control-group">
          <label>Invoker Preset Width:</label>
          <div class="preset-buttons">
            <button type="button" @click="${() => this._setInvokerWidth(160)}">160px</button>
            <button type="button" @click="${() => this._setInvokerWidth(260)}">260px</button>
            <button type="button" @click="${() => this._setInvokerWidth(360)}">360px</button>
          </div>
        </div>
      </div>

      <div class="stage-card">
        <p class="instruction-text">
          💡 <strong>Drag the bottom-right resize handle</strong> on the
          <strong>${this.source === 'content' ? 'content box' : 'invoker box'}</strong> to resize it horizontally and observe live width inheritance!
        </p>

        <demo-el-using-overlaymixin .config="${overlayConfig}">
          <div
            slot="invoker"
            class="invoker-box ${this.source === 'reference' ? 'resizable-box' : ''}"
            style="width: ${this.invokerWidth}px;"
          >
            <button type="button" class="invoker-button">
              Click to Open Dropdown ${this.source === 'reference' ? '↔' : ''}
            </button>
          </div>

          <div
            slot="content"
            class="content-box demo-overlay ${this.source === 'content' ? 'resizable-box' : ''}"
            style="${this.source === 'content' ? `width: ${this.contentWidth}px;` : ''}"
          >
            <div>
              Dropdown Content ${this.source === 'content' ? '↔' : ''}
            </div>
            <button
              type="button"
              class="close-button"
              @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
            >
              ⨯
            </button>
          </div>
        </demo-el-using-overlaymixin>
      </div>

      <div class="metrics">
        <span>Measured Invoker Width: <strong class="badge">${this.measuredInvokerWidth}px</strong></span>
        <span>Measured Content Width: <strong class="badge">${this.measuredContentWidth}px</strong></span>
      </div>

      <pre><code>config = ${JSON.stringify(overlayConfig, null, 2)}</code></pre>
    `;
  }
}

customElements.define('demo-overlay-reference-width', DemoOverlayReferenceWidth);
