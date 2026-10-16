const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.BdbiuFq9.js","_astro/MdJsPreview.3BOxlSHn.js","_astro/lit-element.jD9bOQKo.js","_astro/lit-html.DtZEZPQ5.js","_astro/lit-element.BdYmZD4s.js","_astro/define.DNIVKtom.js"])))=>i.map(i=>d[i]);
import{_ as r}from"./preload-helper.CVfkMyKi.js";import"./MdJsPreview.3BOxlSHn.js";import{i as c,a as l}from"./lit-element.jD9bOQKo.js";import{x as n}from"./lit-html.DtZEZPQ5.js";import"./unsafe-html.DgrA3nwU.js";import"./lion-collapsible.C8cHdFd3.js";import"./lion-button.DwPII_HD.js";import{u as p}from"./uuid.CpLEyVDd.js";class h extends c{static get styles(){return[l`
        :host {
          display: block;
        }

        :host ::slotted([slot='content']) {
          overflow: hidden;
        }
      `]}static get properties(){return{opened:{type:Boolean,reflect:!0}}}render(){return n`
      <slot name="invoker"></slot>
      <slot name="content"></slot>
    `}constructor(){super(),this.opened=!1,this.toggle=this.toggle.bind(this)}connectedCallback(){super.connectedCallback();const t=p();this._invokerNode&&(this._invokerNode.addEventListener("click",this.toggle),this._invokerNode.setAttribute("aria-expanded",`${this.opened}`),this._invokerNode.setAttribute("aria-controls",`collapsible-content-${t}`)),this._contentNode&&this._contentNode.setAttribute("id",`collapsible-content-${t}`),this.__setDefaultState()}updated(t){super.updated(t),t.has("opened")&&this.__openedChanged()}disconnectedCallback(){super.disconnectedCallback(),this._invokerNode&&this._invokerNode.removeEventListener("click",this.toggle)}show(){this.opened||(this.opened=!0)}hide(){this.opened&&(this.opened=!1)}toggle(){this.opened=!this.opened,this.requestUpdate()}async _showAnimation(t){}async _hideAnimation(t){}get _invokerNode(){return Array.from(this.children).find(t=>t.slot==="invoker")}get _contentNode(){return Array.from(this.children).find(t=>t.slot==="content")}get _contentHeight(){return`${this._contentNode?.getBoundingClientRect().height||0}px`}__openedChanged(){this.__updateContentSize(),this._invokerNode&&this._invokerNode.setAttribute("aria-expanded",`${this.opened}`),this.dispatchEvent(new CustomEvent("opened-changed"))}async __updateContentSize(){this._contentNode&&(this.opened?(this._contentNode.style.setProperty("display",""),await this._showAnimation({contentNode:this._contentNode})):(await this._hideAnimation({contentNode:this._contentNode}),this._contentNode.style.setProperty("display","none")))}__setDefaultState(){!this.opened&&this._contentNode&&this._contentNode.style.setProperty("display","none")}}const s={TRANSITION_END:"transitionend",TRANSITION_START:"transitionstart"};class m extends h{static get properties(){return{transitioning:{type:Boolean,reflect:!0}}}constructor(){super(),this.transitioning=!1}connectedCallback(){super.connectedCallback(),this._contentNode?.style.setProperty("transition","max-height 0.35s, padding 0.35s, opacity 0.35s"),this.opened&&this._contentNode?.style.setProperty("padding","12px 0")}toggle(){this.transitioning||super.toggle()}async _showAnimation({contentNode:t}){const o=await this.__calculateHeight(t);t.style.setProperty("opacity","1"),t.style.setProperty("padding","12px 0"),t.style.setProperty("max-height","0px"),await new Promise(i=>requestAnimationFrame(()=>i())),t.style.setProperty("max-height",o),await this._waitForTransition({contentNode:t})}async _hideAnimation({contentNode:t}){this._contentHeight!=="0px"&&(["opacity","padding","max-height"].map(o=>t.style.setProperty(o,"0")),await this._waitForTransition({contentNode:t}))}_waitForTransition({contentNode:t}){return new Promise(o=>{const i=()=>{t.removeEventListener(s.TRANSITION_START,i),this.transitioning=!0};t.addEventListener(s.TRANSITION_START,i);const a=()=>{t.removeEventListener(s.TRANSITION_END,a),this.transitioning=!1,o()};t.addEventListener(s.TRANSITION_END,a)})}async __calculateHeight(t){return t.style.setProperty("max-height",""),await new Promise(o=>requestAnimationFrame(()=>o())),this._contentHeight}}customElements.define("custom-collapsible",m);const u=()=>{const e=l`
    .demo-custom-collapsible-container {
      padding: 16px;
      margin: 16px;
      border-radius: 4px;
      width: 400px;
      box-shadow:
        0 1px 3px rgba(0, 0, 0, 0.12),
        0 1px 2px rgba(0, 0, 0, 0.24);
    }

    .demo-custom-collapsible-body {
      padding: 12px 0px;
    }

    .demo-custom-collapsible-invoker {
      border-width: 0;
      border-radius: 2px;
      padding: 12px 24px;
      box-shadow:
        0 1px 3px rgba(0, 0, 0, 0.12),
        0 1px 2px rgba(0, 0, 0, 0.24);
      font-weight: bold;
      color: #3f51b5;
    }

    .demo-custom-collapsible-state-container {
      padding: 12px 0;
    }
  `,t=document.createElement("style");t.setAttribute("data-demo-collapsible",""),t.textContent=e.cssText,document.head.appendChild(t)};u();const y=()=>n`
  <lion-collapsible style="margin-top:16px;">
    <lion-button slot="invoker">More about cars</lion-button>
    <div slot="content">
      Most definitions of cars say that they run primarily on roads, seat one to eight people, have
      four tires, and mainly transport people rather than goods.
    </div>
  </lion-collapsible>
`,g=()=>n`
  <div class="demo-custom-collapsible-container">
    <div class="demo-custom-collapsible-body">
      A motorcycle, often called a motorbike, bike, or cycle, is a two- or three-wheeled motor
      vehicle.
    </div>
    <custom-collapsible>
      <button class="demo-custom-collapsible-invoker" slot="invoker">MORE ABOUT MOTORCYCLES</button>
      <div slot="content">
        Motorcycle design varies greatly to suit a range of different purposes: long distance
        travel, commuting, cruising, sport including racing, and off-road riding. Motorcycling is
        riding a motorcycle and related social activity such as joining a motorcycle club and
        attending motorcycle rallies.
      </div>
    </custom-collapsible>
  </div>
  <div class="demo-custom-collapsible-container">
    <div class="demo-custom-collapsible-body">
      A car (or automobile) is a wheeled motor vehicle used for transportation.
    </div>
    <custom-collapsible opened>
      <button class="demo-custom-collapsible-invoker" slot="invoker">MORE ABOUT CARS</button>
      <div slot="content">
        Most definitions of cars say that they run primarily on roads, seat one to eight people,
        have four tires, and mainly transport people rather than goods.
      </div>
    </custom-collapsible>
  </div>
`,_=document,b=[{key:"customInvokerTemplate",story:y},{key:"customAnimation",story:g}];let d=!1;for(const e of b){const t=_.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,d=!0,Object.assign(t,{simulatorUrl:"/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}d&&(customElements.get("mdjs-preview")||r(()=>import("./define.BdbiuFq9.js"),__vite__mapDeps([0,1,2,3,4])),customElements.get("mdjs-story")||r(()=>import("./define.DNIVKtom.js"),__vite__mapDeps([5,2,3])));export{g as customAnimation,y as customInvokerTemplate};
