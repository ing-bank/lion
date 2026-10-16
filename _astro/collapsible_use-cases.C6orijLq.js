const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.BdbiuFq9.js","_astro/MdJsPreview.3BOxlSHn.js","_astro/lit-element.jD9bOQKo.js","_astro/lit-html.DtZEZPQ5.js","_astro/lit-element.BdYmZD4s.js","_astro/define.DNIVKtom.js"])))=>i.map(i=>d[i]);
import{_ as n}from"./preload-helper.CVfkMyKi.js";import"./MdJsPreview.3BOxlSHn.js";import"./lit-element.jD9bOQKo.js";import{x as o}from"./lit-html.DtZEZPQ5.js";import"./unsafe-html.DgrA3nwU.js";import"./lion-collapsible.C8cHdFd3.js";const i=()=>o`
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
    @opened-changed=${e=>{const l=t.getElementById("collapsible-state");l.innerText=`Opened: ${e.target.opened}`}}
  >
    <button slot="invoker">More about cars</button>
    <div slot="content">
      Most definitions of cars say that they run primarily on roads, seat one to eight people, have
      four tires, and mainly transport people rather than goods.
    </div>
  </lion-collapsible>
`,c=document,p=[{key:"defaultOpen",story:i},{key:"methods",story:r},{key:"events",story:a}];let s=!1;for(const t of p){const e=c.querySelector(`[mdjs-story-name="${t.key}"]`);e&&(e.story=t.story,e.key=t.key,s=!0,Object.assign(e,{simulatorUrl:"/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}s&&(customElements.get("mdjs-preview")||n(()=>import("./define.BdbiuFq9.js"),__vite__mapDeps([0,1,2,3,4])),customElements.get("mdjs-story")||n(()=>import("./define.DNIVKtom.js"),__vite__mapDeps([5,2,3])));export{i as defaultOpen,a as events,r as methods};
