import{i as t,a as e,x as o}from"./b4be29f1.js";import{e as r,n as a}from"./3ae224d1.js";import{O as n}from"./65cdf028.js";import"./7197c8a6.js";class s extends(n(t)){static get properties(){return{simulateViewport:{type:Boolean,attribute:"simulate-viewport",reflect:!0},noDialogEl:{type:Boolean,attribute:"no-dialog-el"},useAbsolute:{type:Boolean,attribute:"use-absolute",reflect:!0}}}static get styles(){return[super.styles||[],e`
        :host([use-absolute]) dialog {
          position: absolute !important;
        }

        :host([simulate-viewport]) {
          position: absolute;
          inset: 0;
          z-index: -1;
        }

        :host([simulate-viewport]) dialog {
          position: absolute !important;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        :host([simulate-viewport]) #overlay-content-node-wrapper.overlays__overlay-container {
          position: absolute;
        }

        /*=== demo invoker and content ===*/

        :host ::slotted([slot='invoker']) {
          border: 4px dashed;
          height: 24px;
          min-width: 24px;
        }

        :host ::slotted([slot='content']) {
          background-color: black;
          color: white;
          height: 54px;
          min-width: 54px;
          display: flex;
          place-items: center;
          padding: 20px;
          text-align: center;
          font-size: 0.8rem;
        }
      `]}constructor(){super(),this.simulateViewport=!1,this._noDialogEl=!1,this.useAbsolute=!1}_defineOverlayConfig(){return{placementMode:"local",noDialogEl:this._noDialogEl,popperConfig:{strategy:this.useAbsolute?"absolute":"fixed"}}}_setupOpenCloseListeners(){super._setupOpenCloseListeners(),this._overlayInvokerNode&&this._overlayInvokerNode.addEventListener("click",this.toggle)}_teardownOpenCloseListeners(){super._teardownOpenCloseListeners(),this._overlayInvokerNode&&this._overlayInvokerNode.removeEventListener("click",this.toggle)}refs={invokerSlot:r(),backdropSlot:r(),contentSlot:r(),closeButton:r(),contentNodeWrapper:r()};get _templateData(){return{refs:{contentNodeWrapper:{ref:this.refs.contentNodeWrapper},closeButton:{ref:this.refs.closeButton,label:"close dialog"}}}}static templates={main:({refs:t})=>o`
      <slot name="invoker"></slot>
      <slot name="backdrop"></slot>
      <div ${a(t.contentNodeWrapper.ref)} id="overlay-content-node-wrapper">
        <slot name="content"></slot>
      </div>
    `};render(){const t=this.constructor;return(this.templates||t.templates).main(this._templateData)}}customElements.define("demo-overlay-el",s);class p extends t{static properties={placementMode:{attribute:"placement-mode",type:String},simulateViewport:{type:Boolean,attribute:"simulate-viewport",reflect:!0},_activePos:{type:String,reflect:!0,attribute:"active-pos"},_activeConfig:{type:Object,state:!0}};static get styles(){return[e`
        /*=== .pos-container ===*/

        .pos-container {
          padding: 0.5rem;
          overflow: hidden;
          place-items: center;
          height: 20rem;
          display: grid;
          position: relative;
        }

        /*=== .pos-btn-wrapper ===*/

        /** 
         * We need a wrapper for position transforms, so that we can apply scale transforms on .pos-btn hover 
        */

        .pos-btn-wrapper {
          position: absolute;
        }

        .pos-container--local .pos-btn-wrapper--bottom-start,
        .pos-container--local .pos-btn-wrapper--bottom-end,
        .pos-container--local .pos-btn-wrapper--top-start,
        .pos-container--local .pos-btn-wrapper--top-end,
        .pos-container--local .pos-btn-wrapper--top,
        .pos-container--local .pos-btn-wrapper--bottom {
          left: 50%;
          transform: translateX(-50%);
        }

        .pos-container--local .pos-btn-wrapper--top-start,
        .pos-container--local .pos-btn-wrapper--top-end,
        .pos-container--local .pos-btn-wrapper--top {
          top: 0;
        }

        .pos-container--local .pos-btn-wrapper--bottom-start,
        .pos-container--local .pos-btn-wrapper--bottom-end,
        .pos-container--local .pos-btn-wrapper--bottom {
          bottom: 0;
        }

        .pos-container--local .pos-btn-wrapper--left-start,
        .pos-container--local .pos-btn-wrapper--left-end,
        .pos-container--local .pos-btn-wrapper--right-start,
        .pos-container--local .pos-btn-wrapper--right-end,
        .pos-container--local .pos-btn-wrapper--left,
        .pos-container--local .pos-btn-wrapper--right {
          top: 50%;
          transform: translateY(-50%);
        }

        .pos-container--local .pos-btn-wrapper--left-start,
        .pos-container--local .pos-btn-wrapper--left-end,
        .pos-container--local .pos-btn-wrapper--left {
          left: 0;
        }

        .pos-container--local .pos-btn-wrapper--right-start,
        .pos-container--local .pos-btn-wrapper--right-end,
        .pos-container--local .pos-btn-wrapper--right {
          right: 0;
        }

        .pos-container--local .pos-btn-wrapper--bottom-start,
        .pos-container--local .pos-btn-wrapper--top-start {
          transform: translateX(-50%) translateX(-48px);
        }

        .pos-container--local .pos-btn-wrapper--bottom-end,
        .pos-container--local .pos-btn-wrapper--top-end {
          transform: translateX(-50%) translateX(48px);
        }

        .pos-container--local .pos-btn-wrapper--left-start,
        .pos-container--local .pos-btn-wrapper--right-start {
          transform: translateY(calc(-50% - 48px));
        }

        .pos-container--local .pos-btn-wrapper--left-end,
        .pos-container--local .pos-btn-wrapper--right-end {
          transform: translateY(calc(-50% + 48px));
        }

        .pos-container--global .pos-btn-wrapper {
          top: 50%;
          left: 50%;
        }

        .pos-container--global .pos-btn-wrapper--center {
          transform: translateY(-50%) translateX(-50%);
        }

        .pos-container--global .pos-btn-wrapper--top-left {
          transform: translateY(-50%) translateX(-50%) translateY(-48px) translateX(-48px);
        }

        .pos-container--global .pos-btn-wrapper--top {
          transform: translateY(-50%) translateX(-50%) translateY(-48px);
        }

        .pos-container--global .pos-btn-wrapper--top-right {
          transform: translateY(-50%) translateX(-50%) translateY(-48px) translateX(48px);
        }

        .pos-container--global .pos-btn-wrapper--bottom-left {
          transform: translateY(-50%) translateX(-50%) translateY(48px) translateX(-48px);
        }

        .pos-container--global .pos-btn-wrapper--bottom {
          transform: translateY(-50%) translateX(-50%) translateY(48px);
        }

        .pos-container--global .pos-btn-wrapper--bottom-right {
          transform: translateY(-50%) translateX(-50%) translateY(48px) translateX(48px);
        }

        .pos-container--global .pos-btn-wrapper--right {
          transform: translateY(-50%) translateX(-50%) translateX(48px);
        }

        .pos-container--global .pos-btn-wrapper--left {
          transform: translateY(-50%) translateX(-50%) translateX(-48px);
        }

        /*=== .pos-btn ===*/

        .pos-btn {
          padding: 1rem;
          cursor: pointer;
          -webkit-appearance: button;
          background-color: transparent;
          background-image: none;
          text-transform: none;
          font-family: inherit;
          font-size: 100%;
          line-height: inherit;
          color: inherit;
          margin: 0;
          box-sizing: border-box;
          border: 0 solid #bfc3d9;
        }

        .pos-btn__inner {
          border-style: solid;
          border-width: 2px;
          border-radius: 100%;
          width: 0.25rem;
          height: 0.25rem;
        }

        .pos-btn:hover {
          transform: scaleX(2) scaleY(2);
        }

        .pos-btn--active .pos-btn__inner {
          background-color: black;
        }

        /*=== .reference-btn ===*/

        .reference-btn {
          background: white;
          box-sizing: border-box;
          border: 5px dashed black;
          cursor: pointer;
          padding: 1rem;
          width: 8rem;
          height: 8rem;
        }

        .pos-container--global .reference-btn {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
        }

        /*=== .close-btn ===*/

        .close-btn {
          background: transparent;
          border: none;
          position: absolute;
          right: 0;
          top: 0;
          padding: 0.5rem;
        }

        .close-btn::after {
          content: '';
          clear: both;
        }

        /*=== .overlay-content ===*/

        .overlay-content {
          display: flex;
          box-sizing: border-box;
          border: 1px solid black;
          align-items: center;
          justify-items: center;
          background-color: #000;
          padding: 1rem;
          width: 2rem;
          height: 2rem;
        }

        :host([active-pos^='center']) .pos-container--global .overlay-content {
          width: 14rem;
          height: 16rem;
        }

        :host([active-pos^='bottom']) .pos-container--global .overlay-content,
        :host([active-pos^='top']) .pos-container--global .overlay-content {
          width: 50%;
        }

        :host([active-pos^='left']) .pos-container--global .overlay-content,
        :host([active-pos^='right']) .pos-container--global .overlay-content {
          height: 50%;
        }

        :host([active-pos^='center']) .pos-btn {
          color: white;
        }
      `]}refs={overlay:r()};constructor(){super(),this.placementMode="local",this._placements=[],this.simulateViewport=!1,this._activePos="top"}async _updatePos({pos:t}){this._activePos=t;const e=this.refs.overlay.value;e?._overlayCtrl&&(e.config={popperConfig:{placement:t},viewportConfig:{placement:t}},await e._overlayCtrl.hide(),e._overlayCtrl.show(),e.config={popperConfig:{placement:t},viewportConfig:{placement:t}})}firstUpdated(t){super.firstUpdated(t),this._updatePos({pos:"local"===this.placementMode?"top":"center"})}update(t){t.has("placementMode")&&("local"===this.placementMode?this._placements=["top-start","top","top-end","right-start","right","right-end","bottom-start","bottom","bottom-end","left-start","left","left-end"]:this._placements=["center","top-left","top","top-right","right","bottom-right","bottom","bottom-left","left"]),super.update(t)}updated(t){super.updated(t),t.has("placementMode")&&(this._activeConfig={placementMode:this.placementMode})}_isActivePosBtn({pos:t}){return t===this._activePos}render(){return o`
      <div class="pos-container pos-container--${this.placementMode}">
        ${this._placements.map(t=>o`
              <div class="pos-btn-wrapper pos-btn-wrapper--${t}">
                <button
                  @click="${()=>this._updatePos({pos:t})}"
                  class="pos-btn ${this._isActivePosBtn({pos:t})?"pos-btn--active":""}"
                  aria-label="${t}"
                >
                  <div class="pos-btn__inner"></div>
                </button>
              </div>
            `)}

        <demo-overlay-el
          opened
          ?simulate-viewport="${this.simulateViewport}"
          ${a(this.refs.overlay)}
          .config="${this._activeConfig}"
        >
          <button class="reference-btn" slot="invoker"></button>
          <div class="overlay-content" slot="content"></div>
        </demo-overlay-el>
      </div>
    `}}customElements.define("demo-overlay-positioning",p);
