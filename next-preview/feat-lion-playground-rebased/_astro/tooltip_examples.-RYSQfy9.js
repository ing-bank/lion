const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.BWpRLYnc.js","_astro/MdJsPreview.CainKAmn.js","_astro/lit-element.B1EQMsFJ.js","_astro/lit-html.BX7rm8u-.js","_astro/dedupeMixin.6XPTJgK8.js","_astro/LionAccordion.CCw3hAmZ.js","_astro/lit-element.BOikny4r.js","_astro/uuid.DjYKNjre.js","_astro/define.BPRa0k46.js"])))=>i.map(i=>d[i]);
import{_ as e}from"./preload-helper.DOA02mLT.js";import"./MdJsPreview.CainKAmn.js";import"./lit-element.B1EQMsFJ.js";import{b as n}from"./lit-html.BX7rm8u-.js";import"./node-tools_providence-analytics_overview.BQH7j7jT.js";import"./lion-tooltip.fum9wIy-.js";const s=()=>n`
  <style>
    .demo-tooltip-invoker {
      margin: 50px;
    }

    .demo-tooltip-content {
      display: block;
      font-size: 16px;
      color: white;
      background-color: black;
      border-radius: 4px;
      padding: 8px;
    }

    .demo-box-placements {
      display: flex;
      flex-direction: column;
      margin: 40px 0 0 200px;
    }

    .demo-box-placements lion-tooltip {
      margin: 20px;
    }
  </style>
  <lion-tooltip has-arrow>
    <button slot="invoker" class="demo-tooltip-invoker">Hover me</button>
    <div slot="content" class="demo-tooltip-content">This is a tooltip</div>
  </lion-tooltip>
`,r=document,l=[{key:"main",story:s}];let i=!1;for(const t of l){const o=r.querySelector(`[mdjs-story-name="${t.key}"]`);o&&(o.story=t.story,o.key=t.key,i=!0,Object.assign(o,{simulatorUrl:"/next-preview/feat-lion-playground-rebased/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}i&&(customElements.get("mdjs-preview")||e(()=>import("./define.BWpRLYnc.js"),__vite__mapDeps([0,1,2,3,4,5,6,7])),customElements.get("mdjs-story")||e(()=>import("./define.BPRa0k46.js"),__vite__mapDeps([8,2,3])));export{s as main};
