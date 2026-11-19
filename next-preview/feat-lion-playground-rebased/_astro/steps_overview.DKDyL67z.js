const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.BWpRLYnc.js","_astro/MdJsPreview.CainKAmn.js","_astro/lit-element.B1EQMsFJ.js","_astro/lit-html.BX7rm8u-.js","_astro/dedupeMixin.6XPTJgK8.js","_astro/LionAccordion.CCw3hAmZ.js","_astro/lit-element.BOikny4r.js","_astro/uuid.DjYKNjre.js","_astro/define.BPRa0k46.js"])))=>i.map(i=>d[i]);
import{_ as o}from"./preload-helper.DOA02mLT.js";import"./MdJsPreview.CainKAmn.js";import"./lit-element.B1EQMsFJ.js";import{b as r}from"./lit-html.BX7rm8u-.js";import"./node-tools_providence-analytics_overview.BQH7j7jT.js";import"./lion-step.B1bK_oZR.js";const s=()=>r`
  <lion-steps>
    <lion-step initial-step>
      Step 1
      <button type="button" @click="${t=>t.target.parentElement.controller.next()}">
        Next
      </button>
    </lion-step>
    <lion-step>
      <button type="button" @click="${t=>t.target.parentElement.controller.previous()}">
        Previous
      </button>
      Step 2
      <button type="button" @click="${t=>t.target.parentElement.controller.next()}">
        Next
      </button>
    </lion-step>
    <lion-step>
      <button type="button" @click="${t=>t.target.parentElement.controller.previous()}">
        Previous
      </button>
      Step 3
    </lion-step>
  </lion-steps>
`,i=document,l=[{key:"main",story:s}];let n=!1;for(const t of l){const e=i.querySelector(`[mdjs-story-name="${t.key}"]`);e&&(e.story=t.story,e.key=t.key,n=!0,Object.assign(e,{simulatorUrl:"/next-preview/feat-lion-playground-rebased/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}n&&(customElements.get("mdjs-preview")||o(()=>import("./define.BWpRLYnc.js"),__vite__mapDeps([0,1,2,3,4,5,6,7])),customElements.get("mdjs-story")||o(()=>import("./define.BPRa0k46.js"),__vite__mapDeps([8,2,3])));export{s as main};
