/* eslint-disable import/no-extraneous-dependencies, no-return-assign */
import { html, nothing, render } from 'lit';
import { MdJsPreview } from '@mdjs/mdjs-preview';
import { codeIcon, copyIcon, externalDemoIcon, copiedCorrectlyFeedbackIcon } from './icons.js';
// @ts-expect-error
import LionViewerStyle from './style/LionViewer.css.js';

export class LionPreview extends MdJsPreview {
  /** @type {any} */
  static get properties() {
    return {
      _shouldShowCodePreview: Boolean,
      __isHoveringDemo: Boolean,
      __isCopying: Boolean,
      mdjsStoryName: { attribute: 'mdjs-story-name', type: String },
    };
  }

  static get styles() {
    return [LionViewerStyle];
  }

  get _demoCanvasNode() {
    return this.shadowRoot?.querySelector('.demo-viewer__inner-section');
  }

  constructor() {
    super();
    this.language = 'en-GB';
    // Use this to check whether we have an 'actual' story or a 'placeholder' story
    // @ts-expect-error
    this.__placeholderStory = this.story;
    this._shouldShowCodePreview = false;
  }

  /**
   * @param {*} htmlTag
   * @param {*} container
   */
  // eslint-disable-next-line class-methods-use-this
  renderStory(htmlTag, container) {
    render(htmlTag, container);
  }

  renderToolbar() {
    return html`
      <div class="icon-toolbar" role="toolbar">
        <button
          class="tools-btn"
          .title="${`${this._shouldShowCodePreview ? 'close' : 'open'} code preview`}"
          aria-pressed="${this._shouldShowCodePreview ? 'true' : 'false'}"
          @click="${() => (this._shouldShowCodePreview = !this._shouldShowCodePreview)}"
        >
          ${codeIcon}
        </button>

        ${this.simulatorUrl
          ? html`
              <a
                class="tools-btn"
                href=${this.iframeUrl}
                target="_blank"
                rel="noopener"
                title="Open simulation in new window"
                >${externalDemoIcon}</a
              >
            `
          : nothing}
      </div>
    `;
  }

  renderCodeblock() {
    return html`<slot id="code-slot"></slot>
      <div class="icon-toolbar" role="toolbar">
        <button
          class="tools-btn"
          @click="${this.onCopy}"
          ?hidden="${!(
            // @ts-expect-error
            this.__supportsClipboard
          )}"
          title="${
            // @ts-expect-error
            this.__copyButtonText
          }"
        >
          ${!this.__isCopying ? copyIcon : copiedCorrectlyFeedbackIcon}
        </button>
      </div>`;
  }

  render() {
    return html`
      <div class="demo-viewer card" id="wrapper">
        <div class="demo-viewer__section demo-viewer__section--modifier-combinator">
          ${this.renderToolbar()}
        </div>
        <div class="demo-viewer__section demo-viewer__section--demo">
          <div class="demo-viewer__inner-section">
            <div class="demo-viewer__surface surface">
              <slot name="story"></slot>
            </div>
          </div>
        </div>
        ${this._shouldShowCodePreview
          ? html`<div class="demo-viewer__section demo-viewer__section--code">
              ${this.renderCodeblock()}
            </div>`
          : nothing}
      </div>
    `;
  }

  /**
   * @override
   * @param  {...any} args
   */
  // @ts-expect-error
  onCopy(...args) {
    // @ts-expect-error
    super.onCopy(...args);
    this.__isCopying = true;
    setTimeout(() => {
      this.__isCopying = false;
    }, 1000);
  }
}
