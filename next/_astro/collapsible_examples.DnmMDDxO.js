const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.DSVRgKCR.js","_astro/node-tools_providence-analytics_overview.BxIihMx7.js","_astro/lit-element.jD9bOQKo.js","_astro/lit-html.DtZEZPQ5.js","_astro/unsafe-html.DgrA3nwU.js","_astro/directive.BO6BEpVC.js","_astro/define.DNIVKtom.js"])))=>i.map(i=>d[i]);
import{_ as n}from"./preload-helper.Cj2JEybs.js";import"./node-tools_providence-analytics_overview.BxIihMx7.js";import{a as c}from"./lit-element.jD9bOQKo.js";import{x as r}from"./lit-html.DtZEZPQ5.js";import"./unsafe-html.DgrA3nwU.js";import"./lion-collapsible.C8cHdFd3.js";import"./lion-button.DuC_yWH_.js";import{L as p}from"./LionCollapsible.Xai3QZts.js";const s={TRANSITION_END:"transitionend",TRANSITION_START:"transitionstart"};class d extends p{static get properties(){return{transitioning:{type:Boolean,reflect:!0}}}constructor(){super(),this.transitioning=!1}connectedCallback(){super.connectedCallback(),this._contentNode?.style.setProperty("transition","max-height 0.35s, padding 0.35s, opacity 0.35s"),this.opened&&this._contentNode?.style.setProperty("padding","12px 0")}toggle(){this.transitioning||super.toggle()}async _showAnimation({contentNode:t}){const e=await this.__calculateHeight(t);t.style.setProperty("opacity","1"),t.style.setProperty("padding","12px 0"),t.style.setProperty("max-height","0px"),await new Promise(i=>requestAnimationFrame(()=>i())),t.style.setProperty("max-height",e),await this._waitForTransition({contentNode:t})}async _hideAnimation({contentNode:t}){this._contentHeight!=="0px"&&(["opacity","padding","max-height"].map(e=>t.style.setProperty(e,"0")),await this._waitForTransition({contentNode:t}))}_waitForTransition({contentNode:t}){return new Promise(e=>{const i=()=>{t.removeEventListener(s.TRANSITION_START,i),this.transitioning=!0};t.addEventListener(s.TRANSITION_START,i);const a=()=>{t.removeEventListener(s.TRANSITION_END,a),this.transitioning=!1,e()};t.addEventListener(s.TRANSITION_END,a)})}async __calculateHeight(t){return t.style.setProperty("max-height",""),await new Promise(e=>requestAnimationFrame(()=>e())),this._contentHeight}}customElements.define("custom-collapsible",d);const m=()=>{const o=c`
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
  `,t=document.createElement("style");t.setAttribute("data-demo-collapsible",""),t.textContent=o.cssText,document.head.appendChild(t)};m();const u=()=>r`
  <lion-collapsible style="margin-top:16px;">
    <lion-button slot="invoker">More about cars</lion-button>
    <div slot="content">
      Most definitions of cars say that they run primarily on roads, seat one to eight people, have
      four tires, and mainly transport people rather than goods.
    </div>
  </lion-collapsible>
`,y=()=>r`
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
`,g=document,h=[{key:"customInvokerTemplate",story:u},{key:"customAnimation",story:y}];let l=!1;for(const o of h){const t=g.querySelector(`[mdjs-story-name="${o.key}"]`);t&&(t.story=o.story,t.key=o.key,l=!0,Object.assign(t,{simulatorUrl:"/next/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}l&&(customElements.get("mdjs-preview")||n(()=>import("./define.DSVRgKCR.js"),__vite__mapDeps([0,1,2,3,4,5])),customElements.get("mdjs-story")||n(()=>import("./define.DNIVKtom.js"),__vite__mapDeps([6,2,3])));export{y as customAnimation,u as customInvokerTemplate};
