import{i as e,a as o,x as t,B as r}from"./b4be29f1.js";window.customElements.define("sb-action-logger",class extends e{static get properties(){return{title:{type:String,reflect:!0},simple:{type:Boolean,reflect:!0},__logCounter:{type:Number}}}static get styles(){return[o`
        :host {
          --sb-action-logger-title-color: black;
          --sb-action-logger-text-color: black;
          --sb-action-logger-cue-color-primary: #3f51b5;
          --sb-action-logger-cue-color-secondary: #c5cae9;
          --sb-action-logger-cue-duration: 1000ms;
          --sb-action-logger-max-height: 110px;

          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
          display: block;
          font-family:
            'Nunito Sans',
            -apple-system,
            '.SFNSText-Regular',
            'San Francisco',
            BlinkMacSystemFont,
            'Segoe UI',
            'Helvetica Neue',
            Helvetica,
            Arial,
            sans-serif;
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
      `]}constructor(){super(),this.title="Action Logger",this.simple=!1,this.__logCounter=0}get loggerEl(){return this.shadowRoot.querySelector(".logger")}log(e){this.__animateCue(),this.simple&&this.__clearLogs(),this.__isConsecutiveDuplicateLog(e)?this.__handleConsecutiveDuplicateLog():(this.__appendLog(e),this.loggerEl.scrollTo({top:this.loggerEl.scrollHeight,behavior:"smooth"})),this.__logCounter+=1}_logTemplate(e){return t`
      <div class="logger__log">
        <code>${e}</code>
      </div>
    `}render(){return t`
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
    `}__appendLog(e){const o=document.createElement("div");r(this._logTemplate(e),o),o.firstElementChild&&this.loggerEl.appendChild(o.firstElementChild)}__isConsecutiveDuplicateLog(e){return!(!this.loggerEl.lastElementChild||this.loggerEl.lastElementChild.querySelector("code")?.textContent?.trim()!==e)}__handleConsecutiveDuplicateLog(){this.loggerEl.lastElementChild?.querySelector(".logger__log-count")||this.__prependLogCounterElement();const e=this.loggerEl.lastElementChild?.querySelector(".logger__log-count");if(e instanceof HTMLElement){const o=e.textContent;if(null!=o){const t=parseInt(o,10)+1;e.innerText=t.toString()}}}__prependLogCounterElement(){const e=document.createElement("div");e.classList.add("logger__log-count"),e.innerText=1..toString();const o=this.loggerEl.lastElementChild;o&&o.insertBefore(e,o.firstElementChild)}__animateCue(){const e=this.shadowRoot?.querySelector(".header__log-cue-overlay");e&&(e.classList.remove("header__log-cue-overlay--slide"),this.offsetWidth,e.classList.add("header__log-cue-overlay--slide"))}__clearLogs(){const e=this.shadowRoot?.querySelector(".logger");e&&(e.innerHTML="",this.__logCounter=0)}});
