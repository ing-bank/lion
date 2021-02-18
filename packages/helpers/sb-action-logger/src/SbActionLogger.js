import { css, html, LitElement, render } from '@lion/core';

/** @typedef {import('@lion/core').TemplateResult} TemplateResult */

export class SbActionLogger extends LitElement {
  static get properties() {
    return {
      title: { type: String, reflect: true },
      simple: { type: Boolean, reflect: true },
      __logCounter: { type: Number },
    };
  }

  static get styles() {
    return [
      css`
        :host {
          --sb-action-logger-title-color: black;
          --sb-action-logger-text-color: black;
          --sb-action-logger-cue-color-primary: #3f51b5;
          --sb-action-logger-cue-color-secondary: #c5cae9;
          --sb-action-logger-cue-duration: 1000ms;
          --sb-action-logger-max-height: 110px;

          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
          display: block;
          font-family: 'Nunito Sans', -apple-system, '.SFNSText-Regular', 'San Francisco',
            BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif;
        }

        .header__info {
          color: var(--sb-action-logger-title-color);
          display: flex;
          align-items: center;
          padding: 16px;
          font-size: 16px;
        }

        .header__clear {
          margin-left: 16px;
          border-radius: 0px;
          background-color: rgba(0, 0, 0, 0.05);
          border: none;
          cursor: pointer;
          padding: 8px;
        }

        .header__clear:hover {
          background-color: rgba(0, 0, 0, 0.1);
        }

        .header__title {
          margin: 0;
          font-weight: bold;
          flex-grow: 1;
        }

        .header__log-cue {
          position: relative;
          height: 3px;
          background-color: var(--sb-action-logger-cue-color-secondary);
          overflow: hidden;
        }

        .header__log-cue-overlay {
          position: absolute;
          height: 3px;
          width: 50px;
          left: -50px;
          background-color: var(--sb-action-logger-cue-color-primary);
        }

        .header__log-cue-overlay--slide {
          animation: slidethrough var(--sb-action-logger-cue-duration) ease-in;
        }

        @keyframes slidethrough {
          from {
            left: -50px;
            width: 50px;
          }

          to {
            left: 100%;
            width: 500px;
          }
        }

        .logger {
          overflow-y: auto;
          max-height: var(--sb-action-logger-max-height);
        }

        .logger__log {
          padding: 16px;
          display: flex;
        }

        .logger__log:not(:last-child) {
          border-bottom: 1px solid lightgrey;
        }

        .logger__log code {
          color: var(--sb-action-logger-text-color);
          white-space: pre-wrap; /* css-3 */
          white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
          white-space: -pre-wrap; /* Opera 4-6 */
          white-space: -o-pre-wrap; /* Opera 7 */
          word-wrap: break-word; /* Internet Explorer 5.5+ */
        }

        .logger__log-count {
          align-self: baseline;
          line-height: 8px;
          font-size: 12px;
          padding: 4px;
          border-radius: 4px;
          margin-right: 8px;
          color: white;
          background-color: #777;
        }
      `,
    ];
  }

  constructor() {
    super();
    this.title = 'Action Logger';
    this.simple = false;
    this.__logCounter = 0;
  }

  get loggerEl() {
    return /** @type {HTMLElement} */ (
      /** @type {ShadowRoot} */ (this.shadowRoot).querySelector('.logger')
    );
  }

  /**
   * Renders the passed content as a node, and appends it to the logger
   * Only supports simple values, will be interpreted to a String
   * E.g. an Object will become '[object Object]'
   *
   * @param {string} content Content to be logged to the action logger
   */
  log(content) {
    this.__animateCue();

    if (this.simple) {
      this.__clearLogs();
    }

    if (this.__isConsecutiveDuplicateLog(content)) {
      this.__handleConsecutiveDuplicateLog();
    } else {
      this.__appendLog(content);
      this.loggerEl.scrollTo({
        top: this.loggerEl.scrollHeight,
        behavior: 'smooth',
      });
    }

    this.__logCounter += 1; // increment total log counter
  }

  /**
   * Protected getter that returns the template of a single log
   *
   * @param {string} content
   * @return {TemplateResult} TemplateResult that uses the content passed to create a log
   */
  // eslint-disable-next-line class-methods-use-this
  _logTemplate(content) {
    return html`
      <div class="logger__log">
        <code>${content}</code>
      </div>
    `;
  }

  render() {
    return html`
      <div class="header">
        <div class="header__info">
          <p class="header__title">${this.title}</p>
          <div class="header__counter">${this.__logCounter}</div>
          <button class="header__clear" @click=${this.__clearLogs}>Clear</button>
        </div>
        <div class="header__log-cue">
          <div class="header__log-cue-overlay"></div>
        </div>
      </div>
      <div class="logger"></div>
    `;
  }

  /**
   * @param {string} content
   */
  __appendLog(content) {
    const offlineRenderContainer = document.createElement('div');
    render(this._logTemplate(content), offlineRenderContainer);
    if (offlineRenderContainer.firstElementChild) {
      this.loggerEl.appendChild(offlineRenderContainer.firstElementChild);
    }
  }

  /**
   * @param {string} content
   */
  __isConsecutiveDuplicateLog(content) {
    if (
      this.loggerEl.lastElementChild &&
      this.loggerEl.lastElementChild.querySelector('code')?.textContent?.trim() === content
    ) {
      return true;
    }
    return false;
  }

  __handleConsecutiveDuplicateLog() {
    if (!this.loggerEl.lastElementChild?.querySelector('.logger__log-count')) {
      this.__prependLogCounterElement();
    }

    // Increment log counter for these duplicate logs

    const logCounter = this.loggerEl.lastElementChild?.querySelector('.logger__log-count');
    if (logCounter instanceof HTMLElement) {
      const logCount = logCounter.textContent;
      if (logCount != null) {
        const incrementedLogCount = parseInt(logCount, 10) + 1;
        logCounter.innerText = incrementedLogCount.toString();
      }
    }
  }

  __prependLogCounterElement() {
    const countEl = document.createElement('div');
    countEl.classList.add('logger__log-count');
    countEl.innerText = (1).toString();

    const loggerLastElementChild = this.loggerEl.lastElementChild;
    if (loggerLastElementChild) {
      loggerLastElementChild.insertBefore(countEl, loggerLastElementChild.firstElementChild);
    }
  }

  __animateCue() {
    const cueEl = this.shadowRoot?.querySelector('.header__log-cue-overlay');
    if (cueEl) {
      cueEl.classList.remove('header__log-cue-overlay--slide');
      // This triggers browser to stop batching changes because it has to evaluate something.
      // eslint-disable-next-line no-void
      void this.offsetWidth;
      // So that when we arrive here, the browser sees this adding as an actual 'change'
      // and this means the animation gets refired.
      cueEl.classList.add('header__log-cue-overlay--slide');
    }
  }

  __clearLogs() {
    const loggerEl = this.shadowRoot?.querySelector('.logger');
    if (loggerEl) {
      loggerEl.innerHTML = '';
      this.__logCounter = 0;
    }
  }
}
