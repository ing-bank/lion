/* eslint-disable max-classes-per-file */
/* eslint-disable import/no-extraneous-dependencies */
import { html, render, nothing } from 'lit';
// @ts-ignore
import { MdJsPreview } from '@mdjs/mdjs-preview';
import { LionButton } from '@lion/ui/button.js';
import { LionSwitch } from '@lion/ui/switch.js';
// eslint-disable-next-line import/no-relative-packages
import { ScopedElementsMixin } from '../../../packages/ui/components/core/src/ScopedElementsMixin.js';
import OJViewerStyle from './style/OJViewer.css.js';

export class HybridLitMdjsPreview extends MdJsPreview {
  // eslint-disable-next-line class-methods-use-this
  renderStory(htmlTag, container) {
    render(htmlTag, container);
  }
}

export class LegacyOJPreview extends ScopedElementsMixin(HybridLitMdjsPreview) {
  static __shadowRootOptions = { mode: 'open' };

  static get scopedElements() {
    return {
      'lion-button': LionButton,
      'lion-switch': LionSwitch,
    };
  }

  constructor() {
    super();
    this.language = 'en-GB';
  }

  static get styles() {
    return [OJViewerStyle];
  }

  renderThemes() {
    if (this.themes.length) {
      return html`
        <fieldset>
          <legend>Theme</legend>
          ${this.themes.map(
            previewTheme => html`
              <label>
                <input
                  type="radio"
                  name="theme"
                  ?checked=${this.previewTheme === previewTheme.key}
                  .value=${previewTheme.key}
                  @change=${
                    /** @param {Event} ev */ ev => {
                      if (ev.target) {
                        this.previewTheme = /** @type {HTMLInputElement} */ (ev.target).value;
                      }
                    }
                  }
                />
                ${previewTheme.name}
              </label>
            `,
          )}
        </fieldset>
      `;
    }
    return nothing;
  }

  renderEdgeDistance() {
    return html`
      <lion-switch
        label="Apply distance to edge"
        ?checked=${this.edgeDistance}
        @change=${
          /** @param {Event} ev */ ev => {
            if (ev.target) {
              this.edgeDistance = /** @type {HTMLInputElement} */ (ev.target).checked;
            }
          }
        }
      ></lion-switch>
    `;
  }

  renderPlatforms() {
    if (this.platforms.length) {
      return html`
        <fieldset>
          <legend>Platform</legend>
          ${this.platforms.map(
            platform => html`
              <label>
                <input
                  type="radio"
                  name="platform"
                  ?checked=${this.platform === platform.key}
                  .value=${platform.key}
                  @change=${
                    /** @param {Event} ev */ ev => {
                      if (ev.target) {
                        this.changePlatform(/** @type {HTMLInputElement} */ (ev.target).value);
                      }
                    }
                  }
                />
                ${platform.name}
              </label>
            `,
          )}
        </fieldset>
      `;
    }
    return nothing;
  }

  renderSizes() {
    if (this.sizes.length) {
      return html`
        <fieldset>
          <legend>Viewer Size</legend>
          ${this.getSizesFor(this.platform).map(
            size => html`
              <label>
                <input
                  type="radio"
                  name="size"
                  ?checked=${this.size === size.key}
                  .value=${size.key}
                  @change=${
                    /** @param {Event} ev */ ev => {
                      if (ev.target) {
                        this.size = /** @type {HTMLInputElement} */ (ev.target).value;
                      }
                    }
                  }
                />
                ${size.name}
              </label>
            `,
          )}
        </fieldset>
      `;
    }
    return nothing;
  }

  renderAutoHeight() {
    return html`
      <lion-switch
        label="Fit height to content"
        ?checked=${this.autoHeight}
        @change=${
          /** @param {Event} ev */ ev => {
            if (ev.target) {
              this.autoHeight = /** @type {HTMLInputElement} */ (ev.target).checked;
            }
          }
        }
      ></lion-switch>
    `;
  }

  renderSameSettings() {
    return html`
      <lion-switch
        label="Same settings for all simulations"
        ?checked=${this.sameSettings}
        @change=${
          /** @param {Event} ev */ ev => {
            if (ev.target) {
              this.sameSettings = /** @type {HTMLInputElement} */ (ev.target).checked;
            }
          }
        }
      ></lion-switch>
    `;
  }

  renderRememberSettings() {
    if (!this.sameSettings) {
      return html``;
    }
    return html`
      <lion-switch
        label="Remember settings"
        ?checked=${this.rememberSettings}
        @change=${
          /** @param {Event} ev */ ev => {
            if (ev.target) {
              this.rememberSettings = /** @type {HTMLInputElement} */ (ev.target).checked;
            }
          }
        }
      ></lion-switch>
    `;
  }

  renderLocalization() {
    return html` <div>${this.renderLanguages()}</div> `;
  }

  renderSyncSettings() {
    return html` <div>${this.renderSameSettings()} ${this.renderRememberSettings()}</div> `;
  }

  render() {
    return html`
      <div id="wrapper">
        <slot name="story"></slot>
        ${this.deviceMode === true
          ? html`
              <iframe
                title="Simulation of the story"
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
      <details class="options" open>
        <summary>Code</summary>
        <div>
          <slot id="code-slot"></slot>
          <lion-button @click="${this.onCopy}" ?hidden="${!this.__supportsClipboard}">
            ${this.__copyButtonText}
          </lion-button>
        </div>
      </details>
      ${this.simulatorUrl
        ? html`
            <details>
              <summary>Settings</summary>
              <div>
                ${this.deviceMode
                  ? ``
                  : html`<div>
                      Note: Additional settings become available when not in web inline mode
                    </div>`}
                <div class="settings-wrapper">
                  ${this.deviceMode
                    ? html`
                        <div class="settings-left">
                          <div class="settings-left-part">${this.renderThemes()}</div>
                          <div>${this.renderAutoHeight()}</div>
                          <div class="settings-left-part">${this.renderEdgeDistance()}</div>
                          ${this.renderSyncSettings()}
                        </div>
                        <div class="settings-right">${this.renderLocalization()}</div>
                      `
                    : html`${this.renderSyncSettings()}`}
                </div>
              </div>
            </details>
          `
        : ``}
      ${this.simulatorUrl
        ? html`
            <div class="controls">
              <a href=${this.iframeUrl} target="_blank" class="link" rel="noopener"
                >Open simulation in new window</a
              >
            </div>
          `
        : ''}
    `;
  }
}
