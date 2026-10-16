const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.BdbiuFq9.js","_astro/MdJsPreview.3BOxlSHn.js","_astro/lit-element.jD9bOQKo.js","_astro/lit-html.DtZEZPQ5.js","_astro/lit-element.BdYmZD4s.js","_astro/define.DNIVKtom.js"])))=>i.map(i=>d[i]);
import{_ as e}from"./preload-helper.CVfkMyKi.js";import"./MdJsPreview.3BOxlSHn.js";import"./lit-element.jD9bOQKo.js";import{x as i}from"./lit-html.DtZEZPQ5.js";import"./unsafe-html.DgrA3nwU.js";import"./lion-tooltip.Cx3inIR5.js";const r=()=>i`
  <style>
    .demo-tooltip-invoker {
      margin: 50px;
    }
  </style>
  <lion-tooltip has-arrow>
    <button slot="invoker" class="demo-tooltip-invoker">Hover me</button>
    <div slot="content">This is a tooltip</div>
  </lion-tooltip>
`,n=document,m=[{key:"main",story:r}];let s=!1;for(const o of m){const t=n.querySelector(`[mdjs-story-name="${o.key}"]`);t&&(t.story=o.story,t.key=o.key,s=!0,Object.assign(t,{simulatorUrl:"/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}s&&(customElements.get("mdjs-preview")||e(()=>import("./define.BdbiuFq9.js"),__vite__mapDeps([0,1,2,3,4])),customElements.get("mdjs-story")||e(()=>import("./define.DNIVKtom.js"),__vite__mapDeps([5,2,3])));export{r as main};
