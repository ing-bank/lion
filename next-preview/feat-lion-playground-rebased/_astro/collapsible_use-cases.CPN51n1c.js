const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.BWpRLYnc.js","_astro/MdJsPreview.CainKAmn.js","_astro/lit-element.B1EQMsFJ.js","_astro/lit-html.BX7rm8u-.js","_astro/dedupeMixin.6XPTJgK8.js","_astro/LionAccordion.CCw3hAmZ.js","_astro/lit-element.BOikny4r.js","_astro/uuid.DjYKNjre.js","_astro/define.BPRa0k46.js"])))=>i.map(i=>d[i]);
import{_ as n}from"./preload-helper.DOA02mLT.js";import"./MdJsPreview.CainKAmn.js";import"./lit-element.B1EQMsFJ.js";import{b as o}from"./lit-html.BX7rm8u-.js";import"./node-tools_providence-analytics_overview.BQH7j7jT.js";import"./lion-collapsible.O_E5wahG.js";const r=()=>o`
  <lion-collapsible opened>
    <button slot="invoker">More about cars</button>
    <div slot="content">
      Most definitions of cars say that they run primarily on roads, seat one to eight people, have
      four tires, and mainly transport people rather than goods.
    </div>
  </lion-collapsible>
`,i=({shadowRoot:e})=>o`
  <lion-collapsible id="car-collapsible">
    <button slot="invoker">More about cars</button>
    <div slot="content">
      Most definitions of cars say that they run primarily on roads, seat one to eight people, have
      four tires, and mainly transport people rather than goods.
    </div>
  </lion-collapsible>
  <section style="margin-top:16px">
    <button @click="${()=>e.querySelector("#car-collapsible").toggle()}">
      Toggle content
    </button>
    <button @click="${()=>e.querySelector("#car-collapsible").show()}">
      Show content
    </button>
    <button @click="${()=>e.querySelector("#car-collapsible").hide()}">
      Hide content
    </button>
  </section>
`,a=({shadowRoot:e})=>o`
  <div class="demo-custom-collapsible-state-container">
    <strong id="collapsible-state"></strong>
  </div>
  <lion-collapsible
    @opened-changed=${t=>{const l=e.getElementById("collapsible-state");l.innerText=`Opened: ${t.target.opened}`}}
  >
    <button slot="invoker">More about cars</button>
    <div slot="content">
      Most definitions of cars say that they run primarily on roads, seat one to eight people, have
      four tires, and mainly transport people rather than goods.
    </div>
  </lion-collapsible>
`,c=document,p=[{key:"defaultOpen",story:r},{key:"methods",story:i},{key:"events",story:a}];let s=!1;for(const e of p){const t=c.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,s=!0,Object.assign(t,{simulatorUrl:"/next-preview/feat-lion-playground-rebased/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}s&&(customElements.get("mdjs-preview")||n(()=>import("./define.BWpRLYnc.js"),__vite__mapDeps([0,1,2,3,4,5,6,7])),customElements.get("mdjs-story")||n(()=>import("./define.BPRa0k46.js"),__vite__mapDeps([8,2,3])));export{r as defaultOpen,a as events,i as methods};
