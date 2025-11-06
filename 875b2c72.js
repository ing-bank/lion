import"./24f95583.js";import{a as t,x as e}from"./b4be29f1.js";import"./05905ff1.js";import"./d0cb395e.js";import"./09750da9.js";import{L as o}from"./953d28fa.js";import"./5287c897.js";import"./5516584c.js";import"./143fde17.js";import"./dc2f5f5a.js";const i="transitionend",s="transitionstart";customElements.define("custom-collapsible",class extends o{static get properties(){return{transitioning:{type:Boolean,reflect:!0}}}constructor(){super(),this.transitioning=!1}connectedCallback(){super.connectedCallback(),this._contentNode?.style.setProperty("transition","max-height 0.35s, padding 0.35s, opacity 0.35s"),this.opened&&this._contentNode?.style.setProperty("padding","12px 0")}toggle(){this.transitioning||super.toggle()}async _showAnimation({contentNode:t}){const e=await this.__calculateHeight(t);t.style.setProperty("opacity","1"),t.style.setProperty("padding","12px 0"),t.style.setProperty("max-height","0px"),await new Promise(t=>requestAnimationFrame(()=>t())),t.style.setProperty("max-height",e),await this._waitForTransition({contentNode:t})}async _hideAnimation({contentNode:t}){"0px"!==this._contentHeight&&(["opacity","padding","max-height"].map(e=>t.style.setProperty(e,"0")),await this._waitForTransition({contentNode:t}))}_waitForTransition({contentNode:t}){return new Promise(e=>{const o=()=>{t.removeEventListener(s,o),this.transitioning=!0};t.addEventListener(s,o);const n=()=>{t.removeEventListener(i,n),this.transitioning=!1,e()};t.addEventListener(i,n)})}async __calculateHeight(t){return t.style.setProperty("max-height",""),await new Promise(t=>requestAnimationFrame(()=>t())),this._contentHeight}});(()=>{const e=t`
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
  `,o=document.createElement("style");o.setAttribute("data-demo-collapsible",""),o.textContent=e.cssText,document.head.appendChild(o)})();const n=()=>e`
  <lion-collapsible style="margin-top:16px;">
    <lion-button slot="invoker">More about cars</lion-button>
    <div slot="content">
      Most definitions of cars say that they run primarily on roads, seat one to eight people, have
      four tires, and mainly transport people rather than goods.
    </div>
  </lion-collapsible>
`,a=()=>e`
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
`,r=document,l=[{key:"customInvokerTemplate",story:n},{key:"customAnimation",story:a}];let c=!1;for(const t of l){const e=r.querySelector(`[mdjs-story-name="${t.key}"]`);e&&(e.story=t.story,e.key=t.key,c=!0,Object.assign(e,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}c&&(customElements.get("mdjs-preview")||import("./a7b4f51b.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{a as customAnimation,n as customInvokerTemplate};
