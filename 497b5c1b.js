import"./24f95583.js";import{a as e,x as t,i as o}from"./b4be29f1.js";import"./05905ff1.js";import{d as i}from"./962426a7.js";import{L as r}from"./b494bfc1.js";import{L as n}from"./9b4d17c9.js";import{L as s}from"./5287c897.js";import{r as a}from"./9795287e.js";import"./7902d8e0.js";import"./dc2f5f5a.js";import"./d45984a3.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./4cc99b59.js";import"./19d2607c.js";import"./afb8834e.js";import"./143fde17.js";import"./0bf7a48d.js";import"./48b0a907.js";import"./130d2801.js";import"./65cdf028.js";import"./acda6ea6.js";import"./0ed5d59c.js";import"./459b1eec.js";import"./4dc0ac82.js";import"./5516584c.js";const l=i(o=>class extends o{static get styles(){return[...super.styles,e`
            /** @configure FormControlMixin */

            /* =======================
            block | .form-field
            ======================= */

            :host {
              position: relative;
              font-family: 'Roboto', sans-serif;
              padding-top: 16px;
            }

            /* ==========================
            element | .form-field__label
            ========================== */

            .form-field__label ::slotted(label) {
              display: block;
              color: var(--text-color, #545454);
              font-size: 1rem;
              line-height: 1.5rem;
            }

            :host([disabled]) .form-field__label ::slotted(label) {
              color: var(--disabled-text-color, lightgray);
            }

            .form-field__label {
              position: absolute;
              top: 4px;
              left: 0;
              font: inherit;
              pointer-events: none;
              width: 100%;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              transform: perspective(100px);
              -ms-transform: none;
              transform-origin: 0 0;
              transition:
                transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1),
                color 0.4s cubic-bezier(0.25, 0.8, 0.25, 1),
                width 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
              /* z-index: 1; */
            }

            :host([focused]) .form-field__label,
            :host([filled]) .form-field__label {
              transform: translateY(-1.28125em) scale(0.75) perspective(100px) translateZ(0.001px);
              width: 133.333333333333333333%;
            }

            :host([focused]) .form-field__label {
              color: var(--color-primary, royalblue);
            }

            /* ==============================
            element | .form-field__help-text
            ============================== */

            .form-field__help-text {
              visibility: hidden;
              margin-top: 8px;
              position: relative;
              font-size: 0.8em;
              display: block;
            }

            :host([disabled]) .form-field__help-text ::slotted(*) {
              color: var(--disabled-text-color, lightgray);
            }

            :host([focused]) .form-field__help-text {
              visibility: visible;
            }

            :host([shows-feedback-for~='error']) .form-field__help-text {
              display: none;
            }

            /* ==============================
            element | .form-field__feedback
            ============================== */

            .form-field__feedback {
              margin-top: 8px;
              position: relative;
              font-size: 0.8em;
              display: block;
            }

            :host([shows-feedback-for~='error']) .form-field__feedback {
              color: var(--color-error, red);
            }

            /* ==============================
            element | .input-group
            ============================== */

            .input-group {
              display: flex;
            }

            /* ==============================
            element | .input-group__container
            ============================== */

            .input-group__container {
              position: relative;
              display: flex;
              flex-wrap: wrap;
              align-items: stretch;
              width: 100%;
            }

            /* ==============================
            element | .input-group__input
            ============================== */

            .input-group__input {
              display: flex;
              flex: 1;
              position: relative;
            }

            /* ==============================
            element | [slot="input"]
            ============================== */

            * > ::slotted([slot='input']) {
              display: block;
              box-sizing: border-box;
              flex: 1 1 auto;
              width: 1%;
              padding: 0.5rem 0;
              outline: none;
              border: none;
              color: var(--primary-text-color, #333333);
              background: transparent;
              background-clip: padding-box;
              font-size: 100%;
            }

            :host([disabled])
              .input-group__container
              > .input-group__input
              ::slotted([slot='input']) {
              color: var(--disabled-text-color, lightgray);
            }

            /* ==============================
            element | .input-group__prefix,
            element | .input-group__suffix
            ============================== */

            .input-group__prefix,
            .input-group__suffix {
              display: flex;
            }

            .input-group__prefix ::slotted(*),
            .input-group__suffix ::slotted(*) {
              align-self: center;
              text-align: center;
              padding: 0.375rem 0.75rem;
              line-height: 1.5;
              display: flex;
              white-space: nowrap;
              margin-bottom: 0;
            }

            .input-group__container > .input-group__prefix ::slotted(button),
            .input-group__container > .input-group__suffix ::slotted(button) {
              height: 100%;
              border: none;
              background: transparent;

              position: relative;
              overflow: hidden;
              transform: translate3d(0, 0, 0);
            }

            .input-group__container > .input-group__prefix ::slotted(button)::after,
            .input-group__container > .input-group__suffix ::slotted(button)::after {
              content: '';
              display: block;
              position: absolute;
              width: 100%;
              height: 100%;
              top: 0;
              left: 0;
              pointer-events: none;
              background-image: radial-gradient(circle, #000 10%, transparent 10.01%);
              background-repeat: no-repeat;
              background-position: 50%;
              transform: scale(10, 10);
              opacity: 0;
              transition:
                transform 0.25s,
                opacity 0.5s;
            }

            .input-group__container > .input-group__prefix ::slotted(button:active)::after,
            .input-group__container > .input-group__suffix ::slotted(button:active)::after {
              transform: scale(0, 0);
              opacity: 0.2;
              transition: 0s;
            }

            /* ====  state | :focus  ==== */

            /* ==============================
            element | .input-group__before,
            element | .input-group__after
            ============================== */

            .input-group__before,
            .input-group__after {
              display: flex;
            }

            .input-group__before ::slotted(*),
            .input-group__after ::slotted(*) {
              align-self: center;
              text-align: center;
              padding: 0.375rem 0.75rem;
              line-height: 1.5;
            }

            .input-group__before ::slotted(*) {
              padding-left: 0;
            }

            .input-group__after ::slotted(*) {
              padding-right: 0;
            }

            /** @enhance FormControlMixin */

            /* ==============================
            element | .md-input__underline
            ============================== */

            .md-input__underline {
              position: absolute;
              height: 1px;
              width: 100%;
              background-color: rgba(0, 0, 0, 0.42);
              bottom: 0;
            }

            :host([disabled]) .md-input__underline {
              border-top: 1px var(--disabled-text-color, lightgray) dashed;
              background-color: transparent;
            }

            :host([shows-feedback-for~='error']) .md-input__underline {
              background-color: var(--color-error, red);
            }

            /* ==============================
            element | .md-input__underline-ripple
            ============================== */

            .md-input__underline-ripple {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 2px;
              transform-origin: 50%;
              transform: scaleX(0.5);
              visibility: hidden;
              opacity: 0;
              transition: background-color 0.3s cubic-bezier(0.55, 0, 0.55, 0.2);
              background-color: var(--color-primary, royalblue);
            }

            :host([focused]) .md-input__underline-ripple {
              visibility: visible;
              opacity: 1;
              transform: scaleX(1);
              transition:
                transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1),
                opacity 0.1s cubic-bezier(0.25, 0.8, 0.25, 1),
                background-color 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            }

            :host([shows-feedback-for~='error']) .md-input__underline-ripple {
              background-color: var(--color-error, red);
            }
          `]}_groupOneTemplate(){return t``}_inputGroupInputTemplate(){return t`
          <div class="input-group__input">
            ${this._labelTemplate()}
            <slot name="input"></slot>
          </div>
        `}_inputGroupTemplate(){return t`
          <div class="input-group">
            ${this._inputGroupBeforeTemplate()}
            <div class="input-group__container">
              ${this._inputGroupPrefixTemplate()} ${this._inputGroupInputTemplate()}
              ${this._inputGroupSuffixTemplate()}
              <div class="md-input__underline">
                <span class="md-input__underline-ripple"></span>
              </div>
            </div>
            ${this._inputGroupAfterTemplate()}
          </div>
        `}});customElements.define("md-ripple",class extends o{static get styles(){return[e`
        :host {
          overflow: hidden;
          transition: 0.1s ease-in;
          user-select: none;
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }

        :host:hover {
          cursor: pointer;
        }

        #ripple {
          background-color: rgba(0, 0, 0, 0.1);
          border-radius: 100%;
          position: relative;
          transform: scale(0);
        }

        .animate {
          animation: ripple 0.4s linear;
        }

        @keyframes ripple {
          100% {
            transform: scale(12);
            background-color: transparent;
          }
        }
      `]}render(){return t` <div id="ripple"></div> `}firstUpdated(e){super.firstUpdated(e),this._ripple=this.shadowRoot.querySelector("#ripple"),this._ripple.style.cssText=`width: ${this.offsetHeight}px; height: ${this.offsetHeight}px;`,this.__onRipple=this.__onRipple.bind(this),this.addEventListener("mousedown",this.__onRipple)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("mousedown",this.__onRipple)}__onRipple(e){this._ripple.classList.remove("animate");const t=this.getBoundingClientRect(),o=t.top+document.body.scrollTop,i=t.left+document.body.scrollLeft;this._ripple.style.left=parseInt(e.pageX-i,10)-this._ripple.offsetWidth/2+"px",this._ripple.style.top=parseInt(e.pageY-o,10)-this._ripple.offsetHeight/2+"px",this._ripple.classList.add("animate")}});const p=document.createElement("link");p.href="https://fonts.googleapis.com/css?family=Roboto:300,400,500",p.rel="stylesheet",p.type="text/css",document.head.appendChild(p);class c extends r{static styles=[...super.styles,e`
      :host {
        position: relative;
        padding: 8px;
      }

      :host([focused]) {
        background: lightgray;
      }

      :host([active]) {
        color: #1867c0 !important;
        caret-color: #1867c0 !important;
      }

      :host ::slotted(.md-highlight) {
        color: rgba(0, 0, 0, 0.38);
        background: #eee;
      }
    `];onFilterMatch(e){const{innerHTML:t}=this;this.__originalInnerHTML=t,this.innerHTML=t.replace(new RegExp(`(${e})`,"i"),'<span class="md-highlight">$1</span>'),this.style.display=""}onFilterUnmatch(){this.__originalInnerHTML&&(this.innerHTML=this.__originalInnerHTML),this.style.display="none"}render(){return t`
      ${super.render()}
      <md-ripple></md-ripple>
    `}}customElements.define("md-option",c);class d extends(l(n)){static styles=[...super.styles,e`
      .input-group__container {
        display: flex;
        border-bottom: none;
      }

      * > ::slotted([role='listbox']) {
        box-shadow: 0 4px 6px 0 rgba(32, 33, 36, 0.28);
        padding-top: 8px;
        padding-bottom: 8px;
        top: 2px;
      }
    `];constructor(){super(),this.showAllOnEmpty=!0}}customElements.define("md-combobox",d);customElements.define("gh-button",class extends s{static get properties(){return{value:String}}static get styles(){return e`
      :host {
        outline: none;
        position: relative;
        display: inline-flex;
        align-items: center;
        padding: 5px 16px;
        font-size: 14px;
        font-weight: 500;
        line-height: 20px;
        white-space: nowrap;
        vertical-align: middle;
        cursor: pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        border: 1px solid;
        border-radius: 6px;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;

        color: #24292e;
        background-color: #fafbfc;
        border-color: rgba(27, 31, 35, 0.15);
        box-shadow:
          0 1px 0 rgba(27, 31, 35, 0.04),
          inset 0 1px 0 hsla(0, 0%, 100%, 0.25);
        transition: background-color 0.2s cubic-bezier(0.3, 0, 0.5, 1);
      }

      :host(:hover) {
        background-color: #f3f4f6;
        transition-duration: 0.1s;
      }

      :host ::slotted([slot='before']) {
        margin-right: 4px;
      }

      /**
       * TODO: this doesn't have to be light dom anymore in LionButton,
       * just spawning a hidden native button on submit would be enough
       */
      :host ::slotted(button) {
        position: absolute;
        opacity: 0;
      }
    `}render(){return t` <slot name="before"></slot>
      ${this.value}
      <slot name="after"></slot>
      <slot name="_button"></slot>`}});customElements.define("gh-option",class extends r{static get properties(){return{category:String,default:{type:Boolean,reflect:!0}}}static get styles(){return[...super.styles,e`
        :host {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 16px;
          overflow: hidden;
          color: #24292e;
          text-align: left;
          cursor: pointer;
          background-color: #fff;
          border: 0;
          border-bottom: 1px solid #eaecef;
          box-sizing: border-box;
          display: flex;
          align-items: center;
        }

        @media (min-width: 544px) {
          :host {
            padding-top: 7px;
            padding-bottom: 7px;
          }
        }

        :host([checked]) {
          background-color: white;
        }

        :host(:hover),
        :host([active]),
        :host([focused]) {
          background-color: #f6f8fa;
        }

        .gh-check-icon {
          visibility: hidden;
          margin-right: 4px;
        }

        :host([checked]) .gh-check-icon {
          visibility: visible;
        }

        .gh-default-badge {
          visibility: hidden;

          display: inline-block;
          padding: 0 7px;
          font-size: 12px;
          font-weight: 500;
          line-height: 18px;
          border-radius: 2em;
          background-color: initial !important;
          border: 1px solid #e1e4e8;
          color: #586069;
          border-color: #e1e4e8;
        }

        :host([default]) .gh-default-badge {
          visibility: visible;
        }

        .gh-content {
          flex: 1;
        }
      `]}render(){return t`
      <svg
        class="gh-check-icon"
        viewBox="0 0 16 16"
        version="1.1"
        width="16"
        height="16"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"
        ></path>
      </svg>
      <span class="gh-content"><slot></slot></span>
      <span class="gh-default-badge">default</span>
    `}});customElements.define("gh-combobox",class extends n{static get properties(){return{category:{type:String},isDesktop:{type:Boolean,reflect:!0,attribute:"is-desktop"}}}static get styles(){return[...super.styles,e`
        /** @configure LionCombobox */

        :host {
          font-family:
            apple-system,
            BlinkMacSystemFont,
            Segoe UI,
            Helvetica,
            Arial,
            sans-serif,
            Apple Color Emoji,
            Segoe UI Emoji;
          font-size: 14px;
        }

        .input-group__container {
          display: flex;
          border-bottom: none;
        }

        * > ::slotted([role='listbox']) {
          max-height: none;
        }

        * > ::slotted([slot='input']) {
          padding: 5px 12px;
          font-size: 14px;
          line-height: 20px;
          color: #24292e;
          vertical-align: middle;
          background-color: #fff;
          background-repeat: no-repeat;
          background-position: right 8px center;
          border: 1px solid #e1e4e8;
          border-radius: 6px;
          outline: none;
          box-shadow: inset 0 1px 0 rgba(225, 228, 232, 0.2);
        }

        :host([is-desktop]) {
          font-size: 12px;
        }

        :host([is-desktop]) ::slotted([slot='input']) {
          font-size: 14px;
        }

        :host([focused]) ::slotted([slot='input']) {
          border-color: #0366d6;
          outline: none;
          box-shadow: 0 0 0 3px rgba(3, 102, 214, 0.3);
        }

        .gh-combobox {
          height: auto;
          max-height: 480px;
          margin-top: 8px;

          position: relative;
          z-index: 99;
          display: flex;
          max-height: 66%;
          margin: auto 0;
          overflow: hidden;
          pointer-events: auto;
          flex-direction: column;
          background-color: #fff;
          border-radius: 12px;
          box-shadow: 0 0 18px rgba(27, 31, 35, 0.4);
          /* animation: SelectMenu-modal-animation 0.12s cubic-bezier(0, 0.1, 0.1, 1) backwards; */
        }

        :host([is-desktop]) .gh-combobox {
          width: 300px;
          height: auto;
          max-height: 480px;
          margin: 8px 0 16px;
          font-size: 12px;
          border: 1px solid #e1e4e8;
          border-radius: 6px;
          box-shadow: 0 8px 24px rgba(149, 157, 165, 0.2);
          /* animation-name: SelectMenu-modal-animation--sm; */
        }

        .form-field__label {
          font-weight: bold;
        }

        /** @enhance LionCombobox */

        .gh-categories {
          display: flex;
          flex-shrink: 0;
          overflow-x: auto;
          overflow-y: hidden;
          box-shadow: inset 0 -1px 0 #eaecef;
          -webkit-overflow-scrolling: touch;
        }

        :host([is-desktop]) .gh-categories {
          padding: 8px 8px 0;
        }

        .gh-categories__btn {
          flex: 1;
          padding: 8px 16px;
          font-size: 12px;
          font-weight: 500;
          color: #6a737d;
          text-align: center;
          background-color: initial;
          border: 0;
          box-shadow: inset 0 -1px 0 #eaecef;

          border-radius: 0;
          font-family: inherit;
          font-size: inherit;
          line-height: inherit;
          outline: none;

          cursor: pointer;
        }

        .gh-categories__btn:focus {
          background-color: #dbedff;
        }

        :host([is-desktop]) .gh-categories__btn {
          flex: none;
          padding: 4px 16px;
          border: solid transparent;
          border-width: 1px 1px 0;
          border-top-left-radius: 6px;
          border-top-right-radius: 6px;
        }

        .gh-categories__btn[aria-pressed='true'] {
          z-index: 1;
          color: #24292e;
          cursor: default;
          box-shadow: 0 0 0 1px #eaecef;
          cursor: default;
        }

        :host([is-desktop]) .gh-categories__btn {
          flex: none;
        }
        :host([is-desktop]) .gh-categories__btn[aria-pressed='true'] {
          border-color: #eaecef;
          box-shadow: none;
        }

        .gh-section-wrapper {
          padding: 16px;
          margin: 0;
          border-bottom: 1px solid #eaecef;
        }

        :host([is-desktop]) .gh-section-wrapper {
          padding: 8px;
        }
      `]}render(){return t`
      <slot name="selection-display"></slot>
      <div id="overlay-content-node-wrapper" role="dialog" aria-label="branches and tags">
        <div class="gh-combobox">
          <div class="form-field__group-one">
            <div class="gh-section-wrapper">${this._groupOneTemplate()}</div>
          </div>
          <div class="form-field__group-two">
            <div class="gh-section-wrapper">${this._groupTwoTemplate()}</div>
            <div
              class="gh-categories"
              @click="${this.__handleCategory}"
              @keydown="${this.__handleCategory}"
            >
              <button type="button" data-category="branches" class="gh-categories__btn">
                Branches
              </button>
              <button type="button" data-category="tags" class="gh-categories__btn">Tags</button>
            </div>
            <slot name="listbox"></slot>
          </div>
        </div>
      </div>
      <slot id="options-outlet"></slot>
    `}get _comboboxNode(){if(this.__comboboxNode)return this.__comboboxNode;const e=this.querySelector('[slot="input"]');if(e)return this.__comboboxNode=e,e;const t=this._overlayCtrl?.contentWrapperNode.querySelector('[slot="input"]');return t?(this.__comboboxNode=t,t):null}_inputGroupInputTemplate(){return t`
      <div class="input-group__input">
        <slot name="input"></slot>
      </div>
    `}_groupTwoTemplate(){return t` ${this._inputGroupTemplate()} ${this._feedbackTemplate()} `}get slots(){return{...super.slots,"selection-display":()=>a(t`
          <gh-button>
            <svg
              slot="before"
              text="gray"
              height="16"
              class="octicon octicon-git-branch text-gray"
              viewBox="0 0 16 16"
              version="1.1"
              width="16"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M11.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122V6A2.5 2.5 0 0110 8.5H6a1 1 0 00-1 1v1.128a2.251 2.251 0 11-1.5 0V5.372a2.25 2.25 0 111.5 0v1.836A2.492 2.492 0 016 7h4a1 1 0 001-1v-.628A2.25 2.25 0 019.5 3.25zM4.25 12a.75.75 0 100 1.5.75.75 0 000-1.5zM3.5 3.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0z"
              ></path>
            </svg>

            <span slot="after"> </span>
          </gh-button>
        `)}}get _overlayInvokerNode(){return this.querySelector('[slot="selection-display"]')}get _overlayReferenceNode(){return this._overlayInvokerNode}get _categoryButtons(){return Array.from(this.shadowRoot.querySelectorAll(".gh-categories__btn[data-category]"))}constructor(){super(),this.showAllOnEmpty=!0,this.category="branches",this.selectionFollowsFocus=!1,this.__mobileDropdownComboConfig=this.config}firstUpdated(e){super.firstUpdated(e);const t=window.matchMedia("(min-width: 544px)");this.isDesktop=t.matches,t.addListener(({matches:e})=>{this.isDesktop=e})}updated(e){if(super.updated(e),e.has("category")){const e=this.category;this._categoryButtons.forEach(t=>{t.setAttribute("aria-pressed",t.getAttribute("data-category")===e?"true":"false")}),this._inputNode.placeholder="branches"===e?"Find or create a branch...":"Find a tag",this._handleAutocompletion()}e.has("opened")&&(this._selectionDisplayNode.value=this.modelValue||"Choose a value...",this.opened?setTimeout(()=>{this._inputNode.focus()}):setTimeout(()=>{this._selectionDisplayNode.focus()},100)),e.has("isDesktop")}__handleCategory(e){this.category=e.target.getAttribute("data-category")}_textboxOnKeydown(){this.__hasSelection=this._inputNode.value.length!==this._inputNode.selectionStart}_setupOpenCloseListeners(){super._setupOpenCloseListeners(),this.__toggleOverlay=this.__toggleOverlay.bind(this),this._overlayInvokerNode.addEventListener("click",this.__toggleOverlay)}__toggleOverlay(){this.opened=!this.opened}_teardownOpenCloseListeners(){super._teardownOpenCloseListeners(),this._overlayInvokerNode.removeEventListener("click",this.__toggleOverlay)}});class h extends r{static get properties(){return{title:String,text:String,time:String,image:String,isUserText:{attribute:"is-user-text",reflect:!0,type:Boolean},isUserTextRead:{attribute:"is-user-text-read",reflect:!0,type:Boolean}}}static styles=[...super.styles,e`
      :host {
        --background-default: white;
        --background-default-active: gray;
        --secondary: #777;
        --secondary-lighter: #aaa;
        --chatlist-icon: #aaa;
        background-color: var(--background-default);
        cursor: pointer;
        color: rgb(74, 74, 74);
        padding: 0;
        transition:
          max-height 0.4s ease,
          opacity 0.3s ease;
        max-height: 500px;
      }

      :host([checked]) {
        background-color: #eee;
      }

      :host(:hover) {
        background-color: #f6f6f6;
      }

      .wa-option {
        position: relative;
        display: flex;
        flex-direction: row;
        height: 72px;
        pointer-events: all;
      }

      .wa-option__image {
        display: flex;
        flex: none;
        align-items: center;
        margin-top: -1px;
        padding: 0 15px 0 13px;
      }

      .wa-option__image-inner {
        position: relative;
        overflow: hidden;
        background-color: var(--avatar-background);
        border-radius: 50%;
        height: 49px;
        width: 49px;
      }

      .wa-option__image-inner img,
      .wa-option__image-inner svg {
        width: 100%;
        height: 100%;
      }

      .wa-option__image-inner-inner {
        position: absolute;
        top: 0;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
      }

      .wa-option__content {
        display: flex;
        flex-basis: auto;
        flex-direction: column;
        flex-grow: 1;
        justify-content: center;
        min-width: 0;
        border-bottom: 1px solid #eee;
        padding-right: 15px;
      }

      .wa-option__content-row1 {
        display: flex;
        align-items: center;
        line-height: normal;
        text-align: left;
      }

      .wa-option__content-row1-title {
        display: flex;
        flex-grow: 1;
        overflow: hidden;
        color: var(--primary-strong);
        font-weight: 400;
        font-size: 17px;
        line-height: 21px;
      }

      .wa-option__content-row1-time {
        line-height: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-left: 6px;
        margin-top: 3px;

        flex: none;
        max-width: 100%;
        color: var(--secondary-lighter);
        font-size: 12px;
        line-height: 20px;
      }

      .wa-option__content-row2 {
        display: flex;
        align-items: center;
        min-height: 20px;
        color: var(--secondary);
        font-size: 13px;
        line-height: 20px;
        margin-top: 2px;
        /* color: var(--secondary-stronger); */
      }

      .wa-option__content-row2-text {
        flex-grow: 1;
        overflow: hidden;
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .wa-option__content-row2-text-inner {
        display: flex;
        align-items: flex-start;
      }

      .wa-option__content-row2-text-inner-icon {
        display: none;
        flex: none;
        color: var(--chatlist-icon);
        vertical-align: top;
        margin-right: 2px;
      }

      :host([is-user-text]) .wa-option__content-row2-text-inner-icon {
        display: inline-block;
      }

      :host([is-user-text-read]) .wa-option__content-row2-text-inner-icon {
        color: lightblue;
      }
      /*
      .wa-option__content-row2-menu {
      } */
    `];render(){return t`<div class="wa-option">
      <div class="wa-option__image">
        <div class="wa-option__image-inner">
          <img
            src="${this.image}"
            alt=""
            draggable="false"
            class="_2goTk _1Jdop _3Whw5"
            style="visibility: visible;"
          />
          ${this.image?"":t`<div class="wa-option__image-inner-inner">
                <span data-testid="default-user" data-icon="default-user" class="">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 212 212"
                    width="212"
                    height="212"
                  >
                    <path
                      fill="#DFE5E7"
                      class="background"
                      d="M106.251.5C164.653.5 212 47.846 212 106.25S164.653 212 106.25 212C47.846 212 .5 164.654.5 106.25S47.846.5 106.251.5z"
                    ></path>
                    <path
                      fill="#FFF"
                      class="primary"
                      d="M173.561 171.615a62.767 62.767 0 0 0-2.065-2.955 67.7 67.7 0 0 0-2.608-3.299 70.112 70.112 0 0 0-3.184-3.527 71.097 71.097 0 0 0-5.924-5.47 72.458 72.458 0 0 0-10.204-7.026 75.2 75.2 0 0 0-5.98-3.055c-.062-.028-.118-.059-.18-.087-9.792-4.44-22.106-7.529-37.416-7.529s-27.624 3.089-37.416 7.529c-.338.153-.653.318-.985.474a75.37 75.37 0 0 0-6.229 3.298 72.589 72.589 0 0 0-9.15 6.395 71.243 71.243 0 0 0-5.924 5.47 70.064 70.064 0 0 0-3.184 3.527 67.142 67.142 0 0 0-2.609 3.299 63.292 63.292 0 0 0-2.065 2.955 56.33 56.33 0 0 0-1.447 2.324c-.033.056-.073.119-.104.174a47.92 47.92 0 0 0-1.07 1.926c-.559 1.068-.818 1.678-.818 1.678v.398c18.285 17.927 43.322 28.985 70.945 28.985 27.678 0 52.761-11.103 71.055-29.095v-.289s-.619-1.45-1.992-3.778a58.346 58.346 0 0 0-1.446-2.322zM106.002 125.5c2.645 0 5.212-.253 7.68-.737a38.272 38.272 0 0 0 3.624-.896 37.124 37.124 0 0 0 5.12-1.958 36.307 36.307 0 0 0 6.15-3.67 35.923 35.923 0 0 0 9.489-10.48 36.558 36.558 0 0 0 2.422-4.84 37.051 37.051 0 0 0 1.716-5.25c.299-1.208.542-2.443.725-3.701.275-1.887.417-3.827.417-5.811s-.142-3.925-.417-5.811a38.734 38.734 0 0 0-1.215-5.494 36.68 36.68 0 0 0-3.648-8.298 35.923 35.923 0 0 0-9.489-10.48 36.347 36.347 0 0 0-6.15-3.67 37.124 37.124 0 0 0-5.12-1.958 37.67 37.67 0 0 0-3.624-.896 39.875 39.875 0 0 0-7.68-.737c-21.162 0-37.345 16.183-37.345 37.345 0 21.159 16.183 37.342 37.345 37.342z"
                    ></path>
                  </svg>
                </span>
              </div>`}
        </div>
      </div>
      <div class="wa-option__content">
        <div class="wa-option__content-row1">
          <div class="wa-option__content-row1-title">
            <span class="_357i8">
              <span dir="auto" title="${this.title}" class="_3ko75 _5h6Y_ _3Whw5">
                ${this.title}
              </span>
              <div class="_3XFan"></div>
            </span>
          </div>
          <div class="wa-option__content-row1-time">${this.time}</div>
        </div>
        <div class="wa-option__content-row2">
          <div class="wa-option__content-row2-text">
            <span class="wa-option__content-row2-text-inner" title="‪${this.text}‬">
              <div class="wa-option__content-row2-text-inner-icon">
                <span data-testid="status-dblcheck" data-icon="status-dblcheck" class="">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 18 18"
                    width="18"
                    height="18"
                  >
                    <path
                      fill="currentColor"
                      d="M17.394 5.035l-.57-.444a.434.434 0 0 0-.609.076l-6.39 8.198a.38.38 0 0 1-.577.039l-.427-.388a.381.381 0 0 0-.578.038l-.451.576a.497.497 0 0 0 .043.645l1.575 1.51a.38.38 0 0 0 .577-.039l7.483-9.602a.436.436 0 0 0-.076-.609zm-4.892 0l-.57-.444a.434.434 0 0 0-.609.076l-6.39 8.198a.38.38 0 0 1-.577.039l-2.614-2.556a.435.435 0 0 0-.614.007l-.505.516a.435.435 0 0 0 .007.614l3.887 3.8a.38.38 0 0 0 .577-.039l7.483-9.602a.435.435 0 0 0-.075-.609z"
                    ></path>
                  </svg>
                </span>
              </div>
              <span dir="ltr" class="_3ko75 _5h6Y_ _3Whw5">${this.text}</span></span
            >
          </div>
          <div class="wa-option__content-row2-menu"><span></span><span></span><span></span></div>
        </div>
      </div>
    </div>`}onFilterMatch(e){this.__originalTitle=this.title;const t=this.title.replace(new RegExp(`(${e})`,"i"),"<b>$1</b>"),o=document.createElement("div");o.innerHTML=`<span aria-label="${this.title}">${t}</span>`,[this.title]=o.children,this.style.cssText="\n    max-height: 500px;\n    opacity: 1;\n    "}onFilterUnmatch(){this.__originalTitle&&(this.title=this.__originalTitle),this.style.cssText="\n    max-height: 0;\n    opacity: 0;\n    "}}customElements.define("wa-option",h);class g extends n{static styles=[...super.styles,e`
      :host {
        font-family:
          SF Pro Text,
          SF Pro Icons,
          system,
          -apple-system,
          system-ui,
          BlinkMacSystemFont,
          Helvetica Neue,
          Helvetica,
          Lucida Grande,
          Kohinoor Devanagari,
          sans-serif;
      }

      .input-group__container {
        display: flex;
        border-bottom: none;
      }

      * > ::slotted([role='listbox']) {
        max-height: none;
      }

      * > ::slotted([slot='input']) {
        font-size: 14px;
      }

      .input-group {
        padding: 15px;
        background: #f6f6f6;
      }

      .input-group__prefix {
        margin-right: 20px;
        color: #999;
        display: flex;
      }

      .input-group__container {
        border-radius: 18px;
        background: white;
        padding: 7px;
        padding-left: 16px;
      }

      /** Undo Popper */
      #overlay-content-node-wrapper {
        position: static !important;
        width: auto !important;
        transform: none !important;

        /* height: 300px;
          overflow: scroll; */
      }
    `];get slots(){return{...super.slots,prefix:()=>a(t`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path
              fill="currentColor"
              d="M15.009 13.805h-.636l-.22-.219a5.184 5.184 0 0 0 1.256-3.386 5.207 5.207 0 1 0-5.207 5.208 5.183 5.183 0 0 0 3.385-1.255l.221.22v.635l4.004 3.999 1.194-1.195-3.997-4.007zm-4.808 0a3.605 3.605 0 1 1 0-7.21 3.605 3.605 0 0 1 0 7.21z"
            ></path>
          </svg>`)}}constructor(){super(),this.opened=!0,this.showAllOnEmpty=!1,this.rotateKeyboardNavigation=!1}}customElements.define("wa-combobox",g);const u=i(e=>class extends e{static get properties(){return{href:String,target:String}}constructor(){super(),this._nativeAnchor=document.createElement("a")}connectedCallback(){super.connectedCallback(),this.hasAttribute("role")||this.setAttribute("role","link")}firstUpdated(e){super.firstUpdated(e),this.addEventListener("click",this.__navigate),this.addEventListener("keydown",({key:e})=>{" "!==e&&"Enter"!==e||this.__navigate()})}updated(e){super.updated(e),e.has("href")&&(this._nativeAnchor.href=this.href),e.has("target")&&(this._nativeAnchor.target=this.target)}__navigate(){this._nativeAnchor.click()}});var m=t`
  <svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path
      d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
    ></path>
  </svg>
`,f=t`
  <svg class="HPVvwb" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      d="m12 15c1.66 0 3-1.31 3-2.97v-7.02c0-1.66-1.34-3.01-3-3.01s-3 1.34-3 3.01v7.02c0 1.66 1.34 2.97 3 2.97z"
      fill="#4285f4"
    ></path>
    <path d="m11 18.08h2v3.92h-2z" fill="#34a853"></path>
    <path
      d="m7.05 16.87c-1.27-1.33-2.05-2.83-2.05-4.87h2c0 1.45 0.56 2.42 1.47 3.38v0.32l-1.15 1.18z"
      fill="#f4b400"
    ></path>
    <path
      d="m12 16.93a4.97 5.25 0 0 1 -3.54 -1.55l-1.41 1.49c1.26 1.34 3.02 2.13 4.95 2.13 3.87 0 6.99-2.92 6.99-7h-1.99c0 2.92-2.24 4.93-5 4.93z"
      fill="#ea4335"
    ></path>
  </svg>
`,b=t`
  <svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path
      d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
    ></path>
  </svg>
`;const _=new URL(new URL("a9adbd0d.png",import.meta.url).href,import.meta.url).href;class x extends(u(r)){static get properties(){return{imageUrl:{type:String}}}static get styles(){return[...super.styles,e`
        :host {
          position: relative;
          padding: 8px 16px;
          display: flex;
          align-items: center;
          background: none;
        }

        :host:hover,
        :host([active]) {
          background: #eee !important;
        }

        :host([checked]) {
          background: none;
        }

        /* :host([active]) {
          color: #1867c0 !important;
          caret-color: #1867c0 !important;
        } */

        :host {
          font-weight: bold;
        }

        :host ::slotted(.google-option__highlight) {
          font-weight: normal;
        }

        .google-option__icon {
          height: 20px;
          width: 20px;
          margin-right: 12px;
          fill: var(--icon-color);
        }
      `]}onFilterMatch(e){const{innerHTML:t}=this;this.__originalInnerHTML=t;const o=t.replace(new RegExp(`(${e})`,"i"),'<span class="google-option__highlight">$1</span>');this.setAttribute("aria-label",this.textContent),this.innerHTML=o,this.style.display=""}onFilterUnmatch(){this.removeAttribute("aria-label"),this.__originalInnerHTML&&(this.innerHTML=this.__originalInnerHTML),this.style.display="none"}render(){return t`
      ${this.imageUrl?t` <img class="google-option__icon" src="${this.imageUrl}" alt="" />`:t` <div class="google-option__icon">${m}</div>`}
      ${super.render()}
    `}}customElements.define("google-option",x);customElements.define("google-combobox",class extends n{static get styles(){return[...super.styles,e`
        /** @configure FormControlMixin */

        /* =======================
            block | .form-field
            ======================= */

        :host {
          font-family: arial, sans-serif;
        }

        .form-field__label {
          margin-top: 36px;
          margin-bottom: 24px;
          display: flex;
          justify-content: center;
        }

        /* ==============================
            element | .input-group
            ============================== */

        .input-group {
          margin-bottom: 16px;
          max-width: 582px;
          margin: auto;
        }

        .input-group__container {
          position: relative;
          background: #fff;
          display: flex;
          border: 1px solid #dfe1e5;
          box-shadow: none;
          border-radius: 24px;
          height: 44px;
        }

        .input-group__container:hover,
        :host([opened]) .input-group__container {
          border-color: rgba(223, 225, 229, 0);
          box-shadow: 0 1px 6px rgba(32, 33, 36, 0.28);
        }

        :host([opened]) .input-group__container {
          border-bottom-right-radius: 0;
          border-bottom-left-radius: 0;
        }

        :host([opened]) .input-group__container::before {
          content: '';
          position: absolute;
          background: white;
          left: 0;
          right: 0;
          height: 10px;
          bottom: -10px;
        }

        :host([opened]) .input-group__container::after {
          content: '';
          position: absolute;
          background: #eee;
          left: 16px;
          right: 16px;
          height: 1px;
          bottom: 0;
          z-index: 3;
        }

        .input-group__prefix,
        .input-group__suffix {
          display: block;
          fill: var(--icon-color);
          display: flex;
          place-items: center;
        }

        .input-group__input {
          flex: 1;
        }

        .input-group__input ::slotted([slot='input']) {
          border: transparent;
          width: 100%;
        }

        /** @configure LionCombobox */

        /* =======================
            block | .form-field
            ======================= */

        #overlay-content-node-wrapper {
          box-shadow: 0 4px 6px rgba(32, 33, 36, 0.28);
          border-radius: 0 0 24px 24px;
          margin-top: -2px;
          padding-top: 6px;
          background: white;
        }

        * > ::slotted([slot='listbox']) {
          margin-bottom: 8px;
          background: none;
        }

        :host {
          --icon-color: #9aa0a6;
        }

        /** @enhance LionCombobox */

        /* ===================================
            block | .google-search-clear-btn
          =================================== */

        .google-search-clear-btn {
          position: relative;
          height: 100%;
          align-items: center;
          display: none;
        }

        .google-search-clear-btn::after {
          border-left: 1px solid #dfe1e5;
          height: 65%;
          right: 0;
          content: '';
          margin-right: 10px;
          margin-left: 8px;
        }

        :host([filled]) .google-search-clear-btn {
          display: flex;
        }

        * > ::slotted([slot='suffix']),
        * > ::slotted([slot='clear-btn']) {
          font: inherit;
          margin: 0;
          border: 0;
          outline: 0;
          padding: 0;
          color: inherit;
          background-color: transparent;
          text-align: left;
          white-space: normal;
          overflow: visible;

          user-select: none;
          -moz-user-select: none;
          -webkit-user-select: none;
          -ms-user-select: none;
          -webkit-tap-highlight-color: transparent;

          width: 25px;
          height: 25px;
          cursor: pointer;
        }

        * > ::slotted([slot='suffix']) {
          margin-right: 20px;
        }

        * > ::slotted([slot='prefix']) {
          height: 20px;
          width: 20px;
          margin-left: 12px;
          margin-right: 16px;
        }

        /* =============================
            block | .google-search-btns
            ============================ */

        .google-search-btns {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .google-search-btns__input-button {
          background-image: -webkit-linear-gradient(top, #f8f9fa, #f8f9fa);
          background-color: #f8f9fa;
          border: 1px solid #f8f9fa;
          border-radius: 4px;
          color: #3c4043;
          font-family: arial, sans-serif;
          font-size: 14px;
          margin: 11px 4px;
          padding: 0 16px;
          line-height: 27px;
          height: 36px;
          min-width: 54px;
          text-align: center;
          cursor: pointer;
          user-select: none;
        }

        .google-search-btns__input-button:hover {
          box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
          background-image: -webkit-linear-gradient(top, #f8f8f8, #f1f1f1);
          background-color: #f8f8f8;
          border: 1px solid #c6c6c6;
          color: #222;
        }

        .google-search-btns__input-button:focus {
          border: 1px solid #4d90fe;
          outline: none;
        }

        /* ===============================
            block | .google-search-report
            ============================== */

        .google-search-report {
          display: flex;
          align-content: right;
          color: #70757a;
          font-style: italic;
          font-size: 8pt;
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
          margin-bottom: 8px;
          justify-content: flex-end;
          margin-right: 20px;
        }

        .google-search-report a {
          color: inherit;
        }
      `]}_overlayListboxTemplate(){return t`
      <div id="overlay-content-node-wrapper" role="dialog" aria-label="search predictions">
        <slot name="listbox"></slot>
        ${this._googleSearchBtnsTemplate()}
        <div class="google-search-report"><a href="#">Report inappropriate predictions</a></div>
      </div>
      <slot id="options-outlet"></slot>
    `}_inputGroupSuffixTemplate(){return t`
      <div class="input-group__suffix">
        <div class="google-search-clear-btn">
          <slot name="clear-btn"></slot>
        </div>
        <slot name="suffix"></slot>
      </div>
    `}_googleSearchBtnsTemplate(){return t` <div class="google-search-btns">
      <input
        type="submit"
        class="google-search-btns__input-button"
        value="Google Search"
        aria-label="Google Search"
      />
      <input
        type="submit"
        class="google-search-btns__input-button"
        value="I'm Feeling Lucky"
        aria-label="I'm Feeling Lucky"
      />
    </div>`}_groupTwoTemplate(){return t`${super._groupTwoTemplate()} ${this.opened?"":this._googleSearchBtnsTemplate()} `}get slots(){return{...super.slots,label:()=>a(t` <img alt="Google Search" src="${_}" style="width:auto; " />`),prefix:()=>a(t` <span>${m}</span> `),suffix:()=>a(t`
          <button aria-label="Search by voice">${f}</button>
        `),"clear-btn":()=>a(t`
          <button @click="${this.__clearText}" aria-label="Clear text">${b}</button>
        `)}}get _overlayReferenceNode(){return this.shadowRoot.querySelector(".input-group")}constructor(){super(),this.autocomplete="list",this.showAllOnEmpty=!0,this.__resetFocus=this.__resetFocus.bind(this),this.__clearText=this.__clearText.bind(this)}firstUpdated(e){super.firstUpdated(e),this._overlayContentNode.addEventListener("mouseenter",this.__resetFocus)}_syncToTextboxCondition(){return!0}_showOverlayCondition(e){return this.focused||super._showOverlayCondition(e)}__resetFocus(){this.activeIndex=-1,this.checkedIndex=-1}__clearText(){this._inputNode.value=""}});const w=()=>t`
  <md-combobox name="combo" label="Default">
    <md-option .choiceValue="${"Apple"}">Apple</md-option>
    <md-option .choiceValue="${"Artichoke"}">Artichoke</md-option>
    <md-option .choiceValue="${"Asparagus"}">Asparagus</md-option>
    <md-option .choiceValue="${"Banana"}">Banana</md-option>
    <md-option .choiceValue="${"Beets"}">Beets</md-option>
  </md-combobox>
`,v=()=>t`
  <gh-combobox name="combo" label="Switch branches/tags">
    <gh-option href="https://www.github.com" .choiceValue="${"master"}" default>master</gh-option>
    <gh-option .choiceValue="${"develop"}">develop</gh-option>
    <gh-option .choiceValue="${"release"}">release</gh-option>
    <gh-option .choiceValue="${"feat/abc"}">feat/abc</gh-option>
    <gh-option .choiceValue="${"feat/xyz123"}">feat/xyz123</gh-option>
  </gh-combobox>
`,y=()=>{const e=new URL(new URL("3995b655.jpeg",import.meta.url).href,import.meta.url).href,o=new URL(new URL("fd054bdd.jpeg",import.meta.url).href,import.meta.url).href,i=new URL(new URL("6c21dd64.jpeg",import.meta.url).href,import.meta.url).href,r=new URL(new URL("f6bb77f2.jpeg",import.meta.url).href,import.meta.url).href,n=new URL(new URL("e5048dc1.jpeg",import.meta.url).href,import.meta.url).href;return t`
    <wa-combobox name="combo" label="Filter chats">
      <wa-option
        title="Barack Obama"
        text="Yup, let's try that for now👍"
        time="15:02"
        is-user-text
        is-user-text-read
        image="${e}"
        .choiceValue="${"Barack Obama"}"
      ></wa-option>
      <wa-option
        title="Donald Trump"
        text="Take care!"
        time="14:59"
        is-user-text
        image="${o}"
        .choiceValue="${"Donald Trump"}"
      ></wa-option>
      <wa-option
        title="Joe Biden"
        text="Hehe😅. You too, man, you too..."
        time="yesterday"
        image="${i}"
        .choiceValue="${"Joe Biden"}"
      ></wa-option>
      <wa-option
        title="George W. Bush"
        time="friday"
        text="You bet I will. Let's catch up soon!"
        image="${r}"
        .choiceValue="${"George W. Bush"}"
      ></wa-option>
      <wa-option
        title="Bill Clinton"
        time="thursday"
        text="Dude...😂 😂 😂"
        image="${n}"
        .choiceValue="${"Bill Clinton"}"
      ></wa-option>
    </wa-combobox>
  `},k=()=>t`
    <google-combobox name="combo" label="Google Search">
      <google-option
        href="https://www.google.com/search?query=apple"
        target="_blank"
        rel="noopener noreferrer"
        .choiceValue="${"Apple"}"
        >Apple</google-option
      >
      <google-option
        href="https://www.google.com/search?query=Artichoke"
        target="_blank"
        rel="noopener noreferrer"
        .choiceValue="${"Artichoke"}"
        >Artichoke</google-option
      >
      <google-option
        href="https://www.google.com/search?query=Asparagus"
        target="_blank"
        rel="noopener noreferrer"
        .choiceValue="${"Asparagus"}"
        >Asparagus</google-option
      >
      <google-option
        href="https://www.google.com/search?query=Banana"
        target="_blank"
        rel="noopener noreferrer"
        .choiceValue="${"Banana"}"
        >Banana</google-option
      >
      <google-option
        href="https://www.google.com/search?query=Beets"
        target="_blank"
        rel="noopener noreferrer"
        .choiceValue="${"Beets"}"
        >Beets</google-option
      >
    </google-combobox>
    <div style="height:200px;"></div>
  `,$=document,T=[{key:"MaterialDesign",story:w},{key:"Github",story:v},{key:"Whatsapp",story:y},{key:"GoogleSearch",story:k}];let z=!1;for(const e of T){const t=$.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,z=!0,Object.assign(t,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}z&&(customElements.get("mdjs-preview")||import("./a7b4f51b.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{v as Github,k as GoogleSearch,w as MaterialDesign,y as Whatsapp};
