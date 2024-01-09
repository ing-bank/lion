// @ts-nocheck
import { LitElement, html, css, nothing, render } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { LionAccordion } from '@lion/accordion';

import {
  subscribe,
  unSubscribe,
  saveToSharedStates,
  applySharedStates,
} from './mdjsViewerSharedStates.js';
import { addResizeHandler } from './resizeHandler.js';

/**
 * @typedef {{values: unknown[], strings:string[],processor:Function}} TemplateResult1
 * @typedef {import('lit').TemplateResult} TemplateResult2
 * @typedef {{templateFactory:any; eventContext: EventTarget }} RenderOptions1
 * @typedef {import('lit').RenderOptions} RenderOptions2
 */

/**
 * @param {string} input
 * @param {'js'|'css'} type
 * @returns {string}
 */
function sanitize(input, type) {
  const url = new URL(input);
  return url.pathname.slice(1, (type.length + 1) * -1);
}

/**
 * @typedef {object} StoryOptions
 * @property {HTMLElement | null} StoryOptions.shadowRoot
 */

/** @typedef {(options?: StoryOptions) => ReturnType<LitElement['render']>} LitHtmlStoryFn */

/**
 * Renders a story within a preview frame
 *
 * @element mdjs-preview
 * @prop {StoryFn} [story=(() => TemplateResult)] Function that returns the story
 */
export class MdJsPreview extends ScopedElementsMixin(LitElement) {
  static get scopedElements() {
    return {
      'lion-accordion': LionAccordion,
    };
  }

  static get properties() {
    return {
      story: {
        attribute: false,
      },
      key: {
        type: String,
      },
      deviceMode: {
        type: Boolean,
        attribute: 'device-mode',
        reflect: true,
      },
      sameSettings: { type: Boolean },
      contentHeight: { type: Number },
      simulatorUrl: { type: String },
      // page settings
      platform: { type: String, reflect: true },
      platforms: { type: Array },
      size: { type: String },
      sizes: { type: Array },
      previewTheme: { type: String, reflect: true, attribute: 'preview-theme' },
      themes: { type: Array },
      language: { type: String },
      languages: { type: Array },
      edgeDistance: { type: Boolean },
      autoHeight: { type: Boolean },
      rememberSettings: { type: Boolean },
      __copyButtonText: { type: String },
    };
  }

  /**
   * By default, the render of lit2 is provided, which is compatible with TemplateResults of lit2.
   * However, in contexts that need to run multiple versions of lit, it should be possible to
   * provide a specific render function, like renderHybrid, that internally checks, based on the
   * TemplateResult, whether the render function of lit 1 or 2 should called.
   * Overriding the render function would look like:
   *
   * @protected
   * @param {TemplateResult1|TemplateResult2|LitHtmlStoryFn} html Any value renderable by NodePart - typically a TemplateResult
   * created by evaluating a template tag like `html` or `svg`.
   * @param {HTMLElement} container A DOM parent to render to. The entire contents are either
   * replaced, or efficiently updated if the same result type was previous
   * rendered there.
   * @param {Partial<RenderOptions2>} [options] RenderOptions for the entire render tree rendered to this
   * container. Render options must *not* change between renders to the same
   * container, as those changes will not effect previously rendered DOM.
   *
   * @example
   * ```js
   * import { MdJsPreview } from '@mdjs/mdjs-preview';
   * import { render as render2 } from 'lit';
   * import { isTemplateResult as isTemplateResult2 } from 'lit/directive-helpers.js';
   * import { render as render1  } from 'lit-html';
   *
   * export class HybridLitMdjsPreview extends MdJsPreview {
   *   renderStory(html, container, options) {
   *     if (isTemplateResult2(html)) {
   *       render2(html, container, options);
   *     } else {
   *       render1(html, container, options);
   *     }
   *   }
   * }
   * customElements.define('mdjs-preview', HybridLitMdjsPreview);
   * ```
   */
  renderStory(html, container, options) {
    render(html, container, options);
  }

  constructor() {
    super();
    /** @type {LitHtmlStoryFn} */
    this.story = () => html` <p>Loading...</p> `;
    this.key = '';
    this.contentHeight = 0;
    this.simulatorUrl = '';
    this.__supportsClipboard = 'clipboard' in navigator;
    this.__copyButtonText = 'Copy Code';

    this.previewTheme = 'light';
    /** @type {{ key: string, name: string }[]} */
    this.themes = [
      // { key: 'light', name: 'Light' },
      // { key: 'dark', name: 'Dark' },
    ];

    this.language = 'en-US';
    this.languages = [
      { key: 'en', name: 'English' },
      { key: 'en-US', name: 'English (United States)' },
      { key: 'en-GB', name: 'English (United Kingdom)' },
      { key: 'de', name: 'German' },
      { key: 'es', name: 'Spanish' },
      { key: 'fi', name: 'Finnish' },
      { key: 'fr', name: 'French' },
      { key: 'it', name: 'Italian' },
      { key: 'nl', name: 'Dutch' },
      { key: 'pl', name: 'Polish' },
      { key: 'pt', name: 'Portuguese' },
      { key: 'ro', name: 'Romanian' },
      { key: 'sv', name: 'Swedish' },
    ];

    this.platform = 'web';

    /** @type {{ key: string, name: string }[]} */
    this.platforms = [
      // { key: 'web', name: 'Web' },
      // { key: 'web-windows', name: 'Windows' },
      // { key: 'web-mac', name: 'Mac' },
      // { key: 'android', name: 'Android' },
      // { key: 'ios', name: 'iOS' },
    ];

    this.size = 'webInline';
    this.sizes = [
      {
        key: 'webInline',
        name: 'Inline',
        platform: 'web',
        width: 360,
        height: 640,
        dpr: 1,
      },
      {
        key: 'webSmall',
        name: 'Small',
        platform: 'web',
        width: 360,
        height: 640,
        dpr: 1,
      },
      {
        key: 'webMedium',
        name: 'Medium',
        platform: 'web',
        width: 640,
        height: 640,
        dpr: 1,
      },
      {
        key: 'webLarge',
        name: 'Large',
        platform: 'web',
        width: 1024,
        height: 640,
        dpr: 1,
      },
      {
        key: 'pixel2',
        name: 'Pixel 2',
        platform: 'android',
        width: 411,
        height: 731,
        dpr: 2.6,
      },
      {
        key: 'galaxyS5',
        name: 'Galaxy S5',
        platform: 'android',
        width: 360,
        height: 640,
        dpr: 3,
      },
      {
        key: 'iphoneX',
        name: 'iPhone X',
        platform: 'ios',
        width: 375,
        height: 812,
        dpr: 3,
      },
      {
        key: 'iPad',
        name: 'iPad',
        platform: 'ios',
        width: 768,
        height: 1024,
        dpr: 2,
      },
    ];

    this.deviceMode = false;
    this.autoHeight = true;
    this.edgeDistance = true;
    this.sameSettings = true;
    this.rememberSettings = false;

    this.__firstRun = true;
    this.__syncUp = false;
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.lightDomRenderTarget) {
      this.lightDomRenderTarget = document.createElement('div');
      this.lightDomRenderTarget.setAttribute('slot', 'story');
      this.appendChild(this.lightDomRenderTarget);
    }
    if (this.sameSettings) {
      applySharedStates(this);
    }
    addResizeHandler();
  }

  get baseUrl() {
    return document.location.origin;
  }

  get deviceHeight() {
    const maxHeight = this.sizeData?.height || 50;
    if (this.autoHeight) {
      return Math.min(this.contentHeight, maxHeight);
    }
    return maxHeight;
  }

  /**
   * @param {string} platform
   */
  getSizesFor(platform) {
    return this.sizes.filter(el => el.platform === platform);
  }

  get sizeData() {
    return (
      this.sizes.find(el => el.key === this.size) || { width: 50, height: 50, name: 'default' }
    );
  }

  onSubscribe = () => {
    this.__syncUp = false;
    applySharedStates(this);
    this.__syncUp = true;
  };

  /**
   * @param {import('lit-element').PropertyValues} changeProps
   */
  update(changeProps) {
    super.update(changeProps);
    if (this.sameSettings && this.__syncUp) {
      saveToSharedStates(this, this.onSubscribe);
    }

    if (changeProps.has('sameSettings')) {
      if (this.sameSettings) {
        subscribe(this.onSubscribe);
      } else {
        unSubscribe(this.onSubscribe);
      }
    }

    if (this.lightDomRenderTarget && changeProps.has('story')) {
      this.renderStory(
        /** @type {LitHtmlStoryFn} */ (this.story({ shadowRoot: this })),
        this.lightDomRenderTarget,
      );
    }

    if (changeProps.has('platform') || changeProps.has('size')) {
      this.deviceMode = this.platform === 'web' && this.size === 'webInline' ? false : true;
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.sameSettings) {
      unSubscribe(this.onSubscribe);
    }
  }

  firstUpdated() {
    this.__syncUp = true;
  }

  get iframeUrl() {
    const mdjsSetupScript = /** @type {HTMLScriptElement} */ (
      document.querySelector('script[type=module][mdjs-setup]')
    );
    if (!mdjsSetupScript) {
      throw new Error('Could not find a <script type="module" src="..." mdjs-setup></script>');
    }
    const params = new URLSearchParams();
    params.set('story-file', sanitize(mdjsSetupScript.src, 'js'));
    params.set('story-key', this.key);
    params.set('theme', this.previewTheme);
    params.set('platform', this.platform);
    params.set('language', this.language);
    params.set('edge-distance', this.edgeDistance.toString());

    const links = /** @type {HTMLLinkElement[]} */ ([
      ...document.querySelectorAll('link[mdjs-use]'),
    ]);
    for (const link of links) {
      if (link.href) {
        params.append('stylesheets', sanitize(link.href, 'css'));
      }
    }

    const moduleUrls = /** @type {HTMLScriptElement[]} */ ([
      ...document.querySelectorAll('script[type=module][mdjs-use]'),
    ]);
    for (const moduleUrl of moduleUrls) {
      if (moduleUrl.src) {
        params.append('moduleUrls', sanitize(moduleUrl.src, 'js'));
      }
    }

    return `${this.simulatorUrl}#?${params.toString()}`;
  }

  /**
   * @param {string} platform
   */
  changePlatform(platform) {
    this.platform = platform;
    const sizes = this.getSizesFor(this.platform);
    this.size = sizes[0].key;
  }

  async onCopy() {
    let nodeToConsider = this.children[0];
    if (this.platform === 'android') {
      nodeToConsider = this.children[1];
    }
    if (this.platform === 'ios') {
      nodeToConsider = this.children[2];
    }
    if (nodeToConsider && nodeToConsider.textContent) {
      await navigator.clipboard.writeText(nodeToConsider.textContent.trim());
      this.__copyButtonText = 'Copied ✅';
      setTimeout(() => {
        this.__copyButtonText = 'Copy code';
      }, 2000);
    }
  }

  renderPlatforms() {
    if (this.platforms.length) {
      return html`
        <div
          class="segmented-control"
          @change=${
            /** @param {Event} ev */ ev => {
              if (ev.target) {
                this.changePlatform(/** @type {HTMLInputElement} */ (ev.target).value);
              }
            }
          }
        >
          ${this.platforms.map(
            platform => html`
              <label class="${this.platform === platform.key ? 'selected' : ''}">
                <span>${platform.name}</span>
                <input
                  type="radio"
                  name="platform"
                  value="${platform.key}"
                  ?checked=${this.platform === platform.key}
                />
              </label>
            `,
          )}
        </div>
      `;
    }
  }

  renderPlatform() {
    if (this.platforms.length) {
      return html`
        <div>
          <h4>Platform</h4>
          ${this.renderPlatforms()}
        </div>
      `;
    }
  }

  renderSize() {
    if (this.sizes.length) {
      return html`
        <div>
          <h4>Size</h4>
          ${this.renderSizes()}
        </div>
      `;
    }
  }

  renderSizes() {
    if (this.sizes.length) {
      return html`
        <div
          class="segmented-control"
          @change=${
            /** @param {Event} ev */ ev => {
              if (ev.target) {
                this.size = /** @type {HTMLInputElement} */ (ev.target).value;
              }
            }
          }
        >
          ${this.getSizesFor(this.platform).map(
            size => html`
              <label class="${this.size === size.key ? 'selected' : ''}">
                <span>${size.name}</span>
                <input
                  type="radio"
                  name="size"
                  value="${size.key}"
                  .checked=${this.size === size.key}
                />
              </label>
            `,
          )}
        </div>
      `;
    }
  }

  renderViewport() {
    return html`
      <div>
        <h3>Viewport</h3>
        ${this.renderAutoHeight()}
      </div>
    `;
  }

  renderThemes() {
    if (this.themes.length) {
      return html`
        <div
          class="segmented-control"
          @change=${
            /** @param {Event} ev */ ev => {
              if (ev.target) {
                this.previewTheme = /** @type {HTMLInputElement} */ (ev.target).value;
              }
            }
          }
        >
          ${this.themes.map(
            previewTheme => html`
              <label class="${this.previewTheme === previewTheme.key ? 'selected' : ''}">
                <span>${previewTheme.name}</span>
                <input
                  type="radio"
                  name="theme"
                  value="${previewTheme.key}"
                  ?checked=${this.previewTheme === previewTheme.key}
                />
              </label>
            `,
          )}
        </div>
      `;
    }
  }

  renderVisual() {
    return html`
      <div>
        <h3>Visual</h3>
        ${this.renderThemes()} ${this.renderEdgeDistance()}
      </div>
    `;
  }

  renderLanguages() {
    if (this.languages.length) {
      return html`
        <label>
          Language
          <select
            @change=${
              /** @param {Event} ev */ ev => {
                if (ev.target) {
                  this.language = /** @type {HTMLInputElement} */ (ev.target).value;
                }
              }
            }
          >
            ${this.languages.map(
              language => html`
                <option value="${language.key}" ?selected=${this.language === language.key}>
                  ${language.name}
                </option>
              `,
            )}
          </select>
        </label>
      `;
    }
  }

  renderLocalization() {
    return html`
      <div>
        <h3>Localization</h3>
        ${this.renderLanguages()}
      </div>
    `;
  }

  renderEdgeDistance() {
    return html`
      <div>
        <label class="${this.edgeDistance ? 'switch selected' : 'switch'}">
          Apply distance to edge
          <span part="switch-button"></span>

          <input
            type="checkbox"
            ?checked=${this.edgeDistance}
            @change=${
              /** @param {Event} ev */ ev => {
                if (ev.target) {
                  this.edgeDistance = /** @type {HTMLInputElement} */ (ev.target).checked;
                }
              }
            }
          />
        </label>
      </div>
    `;
  }

  renderAutoHeight() {
    return html`
      <div>
        <label class="${this.autoHeight ? 'switch selected' : 'switch'}">
          Fit height to content
          <span part="switch-button"></span>
          <input
            type="checkbox"
            ?checked=${this.autoHeight}
            @change=${
              /** @param {Event} ev */ ev => {
                if (ev.target) {
                  this.autoHeight = /** @type {HTMLInputElement} */ (ev.target).checked;
                }
              }
            }
          />
        </label>
      </div>
    `;
  }

  renderSameSettings() {
    return html`
      <div>
        <label class="${this.sameSettings ? 'switch selected' : 'switch'}">
          Same settings for all simulations
          <span part="switch-button"></span>
          <input
            type="checkbox"
            ?checked=${this.sameSettings}
            @change=${
              /** @param {Event} ev */ ev => {
                if (ev.target) {
                  this.sameSettings = /** @type {HTMLInputElement} */ (ev.target).checked;
                }
              }
            }
          />
        </label>
      </div>
    `;
  }

  renderRememberSettings() {
    if (!this.sameSettings) {
      return html``;
    }
    return html`
      <div>
        <label class="${this.rememberSettings ? 'switch selected' : 'switch'}">
          Remember settings
          <span part="switch-button"></span>
          <input
            type="checkbox"
            ?checked=${this.rememberSettings}
            @change=${
              /** @param {Event} ev */ ev => {
                if (ev.target) {
                  this.rememberSettings = /** @type {HTMLInputElement} */ (ev.target).checked;
                }
              }
            }
          />
        </label>
      </div>
    `;
  }

  renderSyncSettings() {
    return html`
      <div>
        <h3>Global</h3>
        ${this.renderSameSettings()} ${this.renderRememberSettings()}
      </div>
    `;
  }

  render() {
    return html`
      ${this.simulatorUrl
        ? html`
            <div class="platform-size-controls">${this.renderPlatform()} ${this.renderSize()}</div>
          `
        : ``}
      <div id="wrapper">
        <slot name="story"></slot>
        ${this.deviceMode === true
          ? html`
              <iframe
                part="iframe"
                csp=${`script-src ${document.location.origin} 'unsafe-inline'; connect-src ws://${document.location.host}/`}
                .src=${this.iframeUrl}
                style=${`width: ${this.sizeData.width}px; height: ${this.deviceHeight}px;`}
              ></iframe>
              <p part="frame-description" style=${`width: ${this.sizeData.width + 4}px;`}>
                ${this.sizeData.name} - ${this.deviceHeight}x${this.sizeData.width}
              </p>
            `
          : nothing}
      </div>
      <lion-accordion class="options">
        ${this.simulatorUrl
          ? html`
              <h3 slot="invoker">
                <button>Settings</button>
              </h3>
              <div slot="content">
                ${this.deviceMode
                  ? ``
                  : html`<div>
                      Note: Additional settings become available when not in web inline mode
                    </div>`}
                <div class="settings-wrapper">
                  ${this.deviceMode
                    ? html`
                        ${this.renderViewport()} ${this.renderVisual()} ${this.renderLocalization()}
                        ${this.renderSyncSettings()}
                      `
                    : html` ${this.renderSyncSettings()} `}
                </div>
              </div>
            `
          : ``}
        <h3 slot="invoker">
          <button>Code</button>
        </h3>
        <div slot="content">
          <slot id="code-slot"></slot>
          <button part="copy-button" @click="${this.onCopy}" ?hidden="${!this.__supportsClipboard}">
            ${this.__copyButtonText}
          </button>
        </div>
      </lion-accordion>
      ${this.simulatorUrl
        ? html`
            <div class="controls">
              <a href=${this.iframeUrl} target="_blank">Open simulation in new window</a>
            </div>
          `
        : ''}
    `;
  }

  static get styles() {
    return css`
      :host {
        display: block;
        padding-bottom: 10px;
      }

      :host([device-mode]) slot[name='story'] {
        display: none;
      }

      :host(:not([device-mode])) #wrapper {
        border: 2px solid var(--primary-lines-color, #4caf50);
      }

      iframe {
        border: 2px solid var(--primary-lines-color, #4caf50);
        background: #fff;
      }

      [part='copy-button'] {
        border: 1px solid var(--primary-color, #3f51b5);
        border-radius: 9px;
        padding: 7px;
        background: none;
        font-weight: bold;
        color: var(--primary-color, #3f51b5);
        text-align: center;
        font-size: 12px;
        line-height: 12px;
        float: right;
        margin-top: -10px;
      }

      [part='copy-button']:hover {
        background-color: var(--primary-color, #3f51b5);
        color: var(--primary-text-inverse-color, #eee);
      }

      .switch {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
      }

      .switch:focus-within [part='switch-button'] {
        box-shadow: 0 0 0 1px hsl(0deg 0% 100% / 40%), 0 0 0 4px rgb(31 117 203 / 48%);
      }

      [part='switch-button'] {
        display: inline-block;
        width: 44px;
        background: var(--switch-unselected-color, #808080);
        height: 25px;
        border-radius: 15px;
        position: relative;
      }

      [part='switch-button']::after {
        content: ' ';
        width: 18px;
        height: 18px;
        border-radius: 10px;
        background: rgb(255, 255, 255);
        display: block;
        position: absolute;
        top: 3px;
        left: 4px;
      }

      .switch.selected [part='switch-button'] {
        background: var(--switch-selected-color, #42b983);
      }

      .switch.selected [part='switch-button']::after {
        left: auto;
        right: 4px;
      }

      [part='frame-description'] {
        margin: -5px 0 10px 0;
        text-align: right;
        font-size: 12px;
        color: var(--primary-text-color, #2c3e50);
      }

      .settings-wrapper {
        display: grid;
        grid-template-columns: 1fr;
        grid-gap: 20px 40px;
        max-width: 650px;
      }

      @media (min-width: 640px) {
        .settings-wrapper {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      .settings-wrapper h3 {
        margin: 10px 0;
        font-size: 16px;
      }

      .options {
        display: block;
        padding: 15px 0;
      }

      .platform-size-controls {
        display: flex;
        justify-content: flex-start;
      }

      .platform-size-controls > * {
        margin-right: 25px;
      }

      .controls {
        display: flex;
        justify-content: space-between;
      }

      .controls a {
        color: var(--primary-color, #3f51b5);
        font-size: 14px;
        line-height: 37px;
      }

      .simulation-toggle {
        border: 1px solid var(--primary-color, #3f51b5);
        border-radius: 9px;
        padding: 10px;
        background: none;
        font-weight: bold;
        color: var(--primary-color, #3f51b5);
        text-align: center;
      }

      .simulation-toggle:hover {
        background-color: var(--primary-color, #3f51b5);
        color: var(--primary-text-inverse-color, #eee);
      }

      h3[slot='invoker'] button {
        font-size: 16px;
        display: block;
        position: relative;
        padding: 10px;
        border: none;
        border-bottom: 1px solid #bbb;
        width: 100%;
        color: var(--primary-text-color, #2c3e50);
        background: none;
        text-align: left;
        font-weight: bold;
      }

      h3[slot='invoker'] button::after {
        content: '>';
        right: 20px;
        top: 10px;
        position: absolute;
        transform: rotate(90deg);
      }

      h3[slot='invoker'][expanded='true'] button::after {
        transform: rotate(-90deg);
      }

      h3[slot='invoker'][expanded='true'] button {
        border-bottom: none;
      }

      .options > [slot='content'] {
        border-bottom: 1px solid #bbb;
        padding: 10px;
      }

      h3[slot='invoker']:first-child button {
        border-top: 1px solid #bbb;
      }

      h4 {
        font-weight: normal;
        font-size: 14px;
        margin: 5px 0;
      }

      .segmented-control {
        border: 1px solid var(--primary-color, #3f51b5);
        border-radius: 18px;
        display: inline-block;
        font-size: 14px;
        margin-bottom: 10px;
      }

      .segmented-control span {
        padding: 5px 10px;
        display: inline-block;
        border-radius: 18px;
        margin: 2px 0;
      }

      .segmented-control label:first-child span {
        margin-left: 2px;
      }

      .segmented-control label:last-child span {
        margin-right: 2px;
      }

      .segmented-control label.selected span {
        background: var(--primary-color, #3f51b5);
        color: var(--primary-text-inverse-color, #eee);
      }

      .segmented-control label:focus-within span {
        box-shadow: 0 0 0 1px hsl(0deg 0% 100% / 40%), 0 0 0 4px rgb(31 117 203 / 48%);
      }

      .segmented-control input,
      .switch input {
        clip: rect(0 0 0 0);
        clip-path: inset(50%);
        height: 1px;
        overflow: hidden;
        position: absolute;
        white-space: nowrap;
        width: 1px;
      }

      select {
        display: block;
        padding: 5px;
        border: 1px solid #333;
        border-radius: 3px;
      }

      /** Showing/Hiding additional code blocks **/
      ::slotted(pre) {
        display: none;
      }

      :host([platform='web']) ::slotted(pre:nth-child(1)) {
        display: block;
      }
      :host([platform='android']) ::slotted(pre:nth-child(2)) {
        display: block;
      }
      :host([platform='ios']) ::slotted(pre:nth-child(3)) {
        display: block;
      }
    `;
  }
}
