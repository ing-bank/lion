import{i as n,a as t}from"./lit-element.qDHKJJma.js";import{x as s}from"./lit-html.C7L4dwLU.js";import{O as r}from"./OverlayMixin.yM-HkbSu.js";import{w as l}from"./withDropdownConfig.eRP55go6.js";import{L as a}from"./LionButton.B9nVXwmc.js";class i extends r(n){_defineOverlayConfig(){return{placementMode:"global",...l()}}render(){return s`
      <slot name="invoker"></slot>
      <slot name="backdrop"></slot>
      <slot name="content"></slot>
    `}}customElements.define("demo-el-using-overlaymixin",i);class d extends r(n){static get styles(){return[t`
        ::slotted([slot='content']) {
          background-color: #333;
          color: white;
          padding: 8px;
        }

        .close-button {
          background: none;
          border: none;
          color: white;
          font-weight: bold;
          font-size: 16px;
          padding: 4px;
        }
      `]}_defineOverlayConfig(){return{placementMode:"global"}}_setupOpenCloseListeners(){super._setupOpenCloseListeners(),this._overlayInvokerNode&&this._overlayInvokerNode.addEventListener("click",this.toggle)}_teardownOpenCloseListeners(){super._teardownOpenCloseListeners(),this._overlayInvokerNode&&this._overlayInvokerNode.removeEventListener("click",this.toggle)}render(){return s`
      <slot name="invoker"></slot>
      <slot name="backdrop"></slot>
      <div id="overlay-content-node-wrapper">
        <slot name="content"></slot>
      </div>
    `}}customElements.define("demo-overlay",d);class c extends a{static get styles(){return[t`
        ::host {
          background: none;
        }
      `]}connectedCallback(){super.connectedCallback(),this.innerText="⨯",this.setAttribute("aria-label","Close")}}customElements.define("demo-close-button",c);const m=()=>{const e=t`
    .demo-overlay {
      background-color: white;
      border: 1px solid black;
      padding: 10px;
    }

    .demo-overlay--blocking {
      background-color: lightgrey;
    }
  `,o=document.createElement("style");o.setAttribute("data-demo-overlays",""),o.textContent=e.cssText,document.head.appendChild(o)};m();
