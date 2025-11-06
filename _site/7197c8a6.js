import{i as e,x as o,a as t}from"./b4be29f1.js";import{O as n}from"./65cdf028.js";import{w as s}from"./acda6ea6.js";import{L as r}from"./5287c897.js";class l extends(n(e)){_defineOverlayConfig(){return{placementMode:"global",...s()}}render(){return o`
      <slot name="invoker"></slot>
      <slot name="backdrop"></slot>
      <slot name="content"></slot>
    `}}customElements.define("demo-el-using-overlaymixin",l);class a extends(n(e)){static get styles(){return[t`
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
      `]}_defineOverlayConfig(){return{placementMode:"global"}}_setupOpenCloseListeners(){super._setupOpenCloseListeners(),this._overlayInvokerNode&&this._overlayInvokerNode.addEventListener("click",this.toggle)}_teardownOpenCloseListeners(){super._teardownOpenCloseListeners(),this._overlayInvokerNode&&this._overlayInvokerNode.removeEventListener("click",this.toggle)}render(){return o`
      <slot name="invoker"></slot>
      <slot name="backdrop"></slot>
      <div id="overlay-content-node-wrapper">
        <slot name="content"></slot>
      </div>
    `}}customElements.define("demo-overlay",a);customElements.define("demo-close-button",class extends r{static get styles(){return[t`
        ::host {
          background: none;
        }
      `]}connectedCallback(){super.connectedCallback(),this.innerText="⨯",this.setAttribute("aria-label","Close")}});(()=>{const e=t`
    .demo-overlay {
      background-color: white;
      border: 1px solid black;
      padding: 10px;
    }

    .demo-overlay--blocking {
      background-color: lightgrey;
    }
  `,o=document.createElement("style");o.setAttribute("data-demo-overlays",""),o.textContent=e.cssText,document.head.appendChild(o)})();
