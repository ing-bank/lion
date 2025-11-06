import{a as s}from"./lit-element.qDHKJJma.js";import{x as h}from"./lit-html.C7L4dwLU.js";import{L as a}from"./LionCollapsible.C4jCvCwP.js";const d=s`
  :host {
    display: block;
    height: 100%;
    --min-width: 72px;
    --max-width: 320px;
    --min-height: auto;
    --max-height: fit-content;
    --start-width: var(--min-width);
    --start-height: 100%;
    --transition-property: width;
  }

  :host([position='top']) {
    width: 100%;
    --min-width: 0px;
    --max-width: none;
    --min-height: 50px;
    --max-height: 200px;
    --start-width: 100%;
    --start-height: var(--min-height);
    --transition-property: height;
  }

  .container {
    display: flex;
    flex-direction: column;
    width: var(--start-width);
    height: var(--start-height);
    min-width: var(--min-width);
    max-width: var(--max-width);
    min-height: var(--min-height);
    max-height: var(--max-height);
    overflow: hidden;
    box-sizing: border-box;
    transition: var(--transition-property) 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
  }

  .headline-container {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
  }

  :host([position='right']) .headline-container {
    flex-direction: row-reverse;
  }

  .content-container {
    overflow: hidden;
    flex-grow: 1;
  }

  ::slotted([slot='content']) {
    width: var(--max-width);
  }
`,n={TRANSITION_END:"transitionend",TRANSITION_START:"transitionstart"};class p extends a{static get properties(){return{transitioning:{type:Boolean,reflect:!0},opened:{type:Boolean,reflect:!0},position:{type:String,reflect:!0}}}constructor(){super(),this.__toggle=()=>{this.opened=!this.opened}}connectedCallback(){super.connectedCallback(),this.hasAttribute("position")||(this.position="left"),this._contentNode&&this._contentNode.style.setProperty("display",""),this.__setBoundaries()}updated(t){super.updated(t),t.has("opened")&&this._openedChanged()}static get styles(){return[d]}__setBoundaries(){const t=this.shadowRoot?.host;this.position==="top"?(this.minHeight=t?getComputedStyle(t).getPropertyValue("--min-height"):"0px",this.maxHeight=t?getComputedStyle(t).getPropertyValue("--max-height"):"0px",this.minWidth="0px",this.maxWidth="none"):(this.minWidth=t?getComputedStyle(t).getPropertyValue("--min-width"):"0px",this.maxWidth=t?getComputedStyle(t).getPropertyValue("--max-width"):"0px",this.minHeight="auto",this.maxHeight="fit-content"),setTimeout(()=>{const i=this.position==="top"?"width":"height";this.__contentNode&&this.__contentNode.style.setProperty(i,"")})}set position(t){const i=this.position;this._position=t,this.setAttribute("position",t),this.__setBoundaries(),this.requestUpdate("position",i)}get position(){return this._position??"left"}async _showAnimation({contentNode:t}){const i=this.position==="top"?this.minHeight:this.minWidth,e=this.position==="top"?this.maxHeight:this.maxWidth,o=this.position==="top"?"height":"width";t.style.setProperty(o,i),await new Promise(r=>requestAnimationFrame(()=>r(!0))),t.style.setProperty(o,e),await this._waitForTransition({contentNode:t})}async _hideAnimation({contentNode:t}){if((this.position==="left"||this.position==="right")&&this._contentWidth===this.minWidth||this.position==="top"&&this._contentHeight===this.minHeight)return;const i=this.position==="top"?this.minHeight:this.minWidth,e=this.position==="top"?"height":"width";t.style.setProperty(e,i),await this._waitForTransition({contentNode:t})}_waitForTransition({contentNode:t}){return new Promise(i=>{const e=()=>{t.removeEventListener(n.TRANSITION_START,e),this.transitioning=!0};t.addEventListener(n.TRANSITION_START,e);const o=()=>{t.removeEventListener(n.TRANSITION_END,o),this.transitioning=!1,i()};t.addEventListener(n.TRANSITION_END,o)})}get __contentNode(){return this.shadowRoot?.querySelector(".container")}get _contentWidth(){return`${this.__contentNode?.getBoundingClientRect().width||0}px`}get _contentHeight(){return`${this.__contentNode?.getBoundingClientRect().height||0}px`}_openedChanged(){this._updateContentSize(),this._invokerNode&&this._invokerNode.setAttribute("aria-expanded",`${this.opened}`),this.dispatchEvent(new CustomEvent("opened-changed"))}async _updateContentSize(){this.__contentNode&&(this.opened?await this._showAnimation({contentNode:this.__contentNode}):await this._hideAnimation({contentNode:this.__contentNode}))}render(){return h`
      <div class="container">
        <div class="headline-container">
          <slot name="invoker"></slot>
          <slot name="headline"></slot>
        </div>
        <div class="content-container">
          <slot name="content"></slot>
        </div>
      </div>
    `}}customElements.define("lion-drawer",p);const x=s`
  .demo-container {
    height: 400px;
    display: flex;
    flex-direction: row;
  }

  .demo-container > div {
    padding: 8px;
    background-color: #f6f8fa;
  }

  lion-drawer {
    height: 400px;
  }

  button {
    all: revert !important;
    border: 2px solid #000000;
    background-color: rgb(239, 239, 239);
  }

  .demo-container-top {
    height: 400px;
    display: flex;
    flex-direction: column;
  }

  .demo-container-top > div {
    padding: 8px;
    height: 100%;
    background-color: #f6f8fa;
  }

  .demo-container-top lion-drawer {
    height: auto;
    width: 100%;
  }

  .demo-container-right {
    height: 400px;
    display: flex;
    flex-direction: row-reverse;
  }

  .demo-container-right > div {
    padding: 8px;
    background-color: #f6f8fa;
  }

  .demo-container-right lion-drawer {
    height: 400px;
  }

  .demo-container-opened {
    height: 400px;
    display: flex;
    flex-direction: row;
  }

  .demo-container-opened > div {
    padding: 8px;
    background-color: #f6f8fa;
  }

  .demo-container-opened lion-drawer {
    height: 400px;
  }
`;export{x as d};
