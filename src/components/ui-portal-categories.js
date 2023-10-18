// eslint-disable-next-line import/no-extraneous-dependencies
import { LitElement, html, css } from 'lit';
import { getComponentEntry } from '../content.ts';

const tagName = 'ui-portal-categories';

export class UIPortalCategories extends LitElement {
  static properties = {
    entry: { type: String, attribute: 'entry-data' },
  };

  static styles = [
    css`
      ul {
        display: flex;
        gap: 8em;
      }
      ul li.active {
        border: 3px solid;
      }
      button.active {
        border: 3px solid;
      }
    `,
  ];

  constructor() {
    super();
    this.categoriesData = null;
  }

  render() {
    return html` <div>${this._renderNavLevel({ entry: this.entry })}</div> `;
  }

  init() {
    const componentName = this.entry.data.component;
    this.webComponentEntry = getComponentEntry({
      component: componentName,
      platform: 'web',
    });
    this.iosComponentEntry = getComponentEntry({
      component: componentName,
      platform: 'ios',
    });
    this.androidComponentEntry = getComponentEntry({
      component: componentName,
      platform: 'android',
    });
    this.designComponentEntry = getComponentEntry({
      component: componentName,
      category: 'design',
    });
    this.changelogComponentEntry = getComponentEntry({
      component: componentName,
      category: 'changelog',
    });
    this.firstDevelopmentEntry =
      this.webComponentEntry || this.androidComponentEntry || this.iosComponentEntry;
    this.isDesign = this.entry.data.category === 'design';
    this.isChangelog = this.entry.data.category === 'changelog';
    this.isDevelopment = !!this.entry.data.platform;
  }

  _renderNavLevel() {
    this.init();
    return html`<ul>
        ${this.designComponentEntry
          ? html`<li class="${this.isDesign ? 'active' : ''}">
              <a href="/${this.designComponentEntry.slug}">Design</a>
            </li>`
          : ''}
        ${this.firstDevelopmentEntry
          ? html`<li class="${this.isDevelopment ? 'active' : ''}">
              <a href="/${this.firstDevelopmentEntry.slug}">Development</a>
            </li>`
          : ''}
        ${this.changelogComponentEntry
          ? html`<li class="${this.isChangelog ? 'active' : ''}">
              <a href="/${this.changelogComponentEntry.slug}">Changelog</a>
            </li>`
          : ''}
      </ul>
      <hr />
      ${this.isDevelopment && this.webComponentEntry
        ? html`<button class="${this.entry.data.platform === 'web' ? 'active' : ''}">
            <a href="/${this.webComponentEntry.slug}">Web</a>
          </button>`
        : ''}
      ${this.isDevelopment && this.androidComponentEntry
        ? html`<button class="${this.entry.data.platform === 'android' ? 'active' : ''}">
            <a href="/${this.androidComponentEntry.slug}">Android</a>
          </button>`
        : ''}
      ${this.isDevelopment && this.iosComponentEntry
        ? html`<button class="${this.entry.data.platform === 'ios' ? 'active' : ''}">
            <a href="/${this.iosComponentEntry.slug}">Ios</a>
          </button>`
        : ''}
      <br />
      <br /> `;
  }
}

customElements.define(tagName, UIPortalCategories);
