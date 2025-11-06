import{i as t,a as o}from"./lit-element.qDHKJJma.js";import{x as i}from"./lit-html.C7L4dwLU.js";import{u as n}from"./node-tools_providence-analytics_overview.LFFQBZzG.js";class h extends t{static get styles(){return[o`
        :host {
          display: block;
        }

        :host ::slotted([slot='content']) {
          overflow: hidden;
        }
      `]}static get properties(){return{opened:{type:Boolean,reflect:!0}}}render(){return i`
      <slot name="invoker"></slot>
      <slot name="content"></slot>
    `}constructor(){super(),this.opened=!1,this.toggle=this.toggle.bind(this)}connectedCallback(){super.connectedCallback();const e=n();this._invokerNode&&(this._invokerNode.addEventListener("click",this.toggle),this._invokerNode.setAttribute("aria-expanded",`${this.opened}`),this._invokerNode.setAttribute("id",`collapsible-invoker-${e}`),this._invokerNode.setAttribute("aria-controls",`collapsible-content-${e}`)),this._contentNode&&(this._contentNode.setAttribute("aria-labelledby",`collapsible-invoker-${e}`),this._contentNode.setAttribute("id",`collapsible-content-${e}`)),this.__setDefaultState()}updated(e){super.updated(e),e.has("opened")&&this.__openedChanged()}disconnectedCallback(){super.disconnectedCallback(),this._invokerNode&&this._invokerNode.removeEventListener("click",this.toggle)}show(){this.opened||(this.opened=!0)}hide(){this.opened&&(this.opened=!1)}toggle(){this.opened=!this.opened,this.requestUpdate()}async _showAnimation(e){}async _hideAnimation(e){}get _invokerNode(){return Array.from(this.children).find(e=>e.slot==="invoker")}get _contentNode(){return Array.from(this.children).find(e=>e.slot==="content")}get _contentHeight(){return`${this._contentNode?.getBoundingClientRect().height||0}px`}__openedChanged(){this.__updateContentSize(),this._invokerNode&&this._invokerNode.setAttribute("aria-expanded",`${this.opened}`),this.dispatchEvent(new CustomEvent("opened-changed"))}async __updateContentSize(){this._contentNode&&(this.opened?(this._contentNode.style.setProperty("display",""),await this._showAnimation({contentNode:this._contentNode})):(await this._hideAnimation({contentNode:this._contentNode}),this._contentNode.style.setProperty("display","none")))}__setDefaultState(){!this.opened&&this._contentNode&&this._contentNode.style.setProperty("display","none")}}export{h as L};
