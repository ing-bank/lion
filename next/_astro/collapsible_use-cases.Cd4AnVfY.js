const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.DYUong5B.js","_astro/node-tools_providence-analytics_overview.LFFQBZzG.js","_astro/lit-element.qDHKJJma.js","_astro/lit-html.C7L4dwLU.js","_astro/unsafe-html.J0GGe2Q7.js","_astro/directive.CGE4aKEl.js","_astro/define.m2CvvXyF.js"])))=>i.map(i=>d[i]);
import{_ as n}from"./preload-helper.4zY6-HO4.js";import"./node-tools_providence-analytics_overview.LFFQBZzG.js";import"./lit-element.qDHKJJma.js";import{x as o}from"./lit-html.C7L4dwLU.js";import"./unsafe-html.J0GGe2Q7.js";import"./lion-collapsible.DpbenLaY.js";import"./directive.CGE4aKEl.js";import"./LionCollapsible.C4jCvCwP.js";const l=()=>o`
  <lion-collapsible opened>
    <button slot="invoker">More about cars</button>
    <div slot="content">
      Most definitions of cars say that they run primarily on roads, seat one to eight people, have
      four tires, and mainly transport people rather than goods.
    </div>
  </lion-collapsible>
`,r=({shadowRoot:t})=>o`
  <lion-collapsible id="car-collapsible">
    <button slot="invoker">More about cars</button>
    <div slot="content">
      Most definitions of cars say that they run primarily on roads, seat one to eight people, have
      four tires, and mainly transport people rather than goods.
    </div>
  </lion-collapsible>
  <section style="margin-top:16px">
    <button @click="${()=>t.querySelector("#car-collapsible").toggle()}">
      Toggle content
    </button>
    <button @click="${()=>t.querySelector("#car-collapsible").show()}">
      Show content
    </button>
    <button @click="${()=>t.querySelector("#car-collapsible").hide()}">
      Hide content
    </button>
  </section>
`,a=({shadowRoot:t})=>o`
  <div class="demo-custom-collapsible-state-container">
    <strong id="collapsible-state"></strong>
  </div>
  <lion-collapsible
    @opened-changed=${e=>{const i=t.getElementById("collapsible-state");i.innerText=`Opened: ${e.target.opened}`}}
  >
    <button slot="invoker">More about cars</button>
    <div slot="content">
      Most definitions of cars say that they run primarily on roads, seat one to eight people, have
      four tires, and mainly transport people rather than goods.
    </div>
  </lion-collapsible>
`,c=document,p=[{key:"defaultOpen",story:l},{key:"methods",story:r},{key:"events",story:a}];let s=!1;for(const t of p){const e=c.querySelector(`[mdjs-story-name="${t.key}"]`);e&&(e.story=t.story,e.key=t.key,s=!0,Object.assign(e,{simulatorUrl:"/next/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}s&&(customElements.get("mdjs-preview")||n(()=>import("./define.DYUong5B.js"),__vite__mapDeps([0,1,2,3,4,5])),customElements.get("mdjs-story")||n(()=>import("./define.m2CvvXyF.js"),__vite__mapDeps([6,2,3])));export{l as defaultOpen,a as events,r as methods};
