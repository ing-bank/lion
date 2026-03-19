const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.DAMBs0Wv.js","_astro/node-tools_providence-analytics_overview.DzUX1qVL.js","_astro/lit-element.qDHKJJma.js","_astro/lit-html.C7L4dwLU.js","_astro/unsafe-html.J0GGe2Q7.js","_astro/directive.CGE4aKEl.js","_astro/define.m2CvvXyF.js"])))=>i.map(i=>d[i]);
import{_ as e}from"./preload-helper.4zY6-HO4.js";import"./node-tools_providence-analytics_overview.DzUX1qVL.js";import"./lit-element.qDHKJJma.js";import{x as n}from"./lit-html.C7L4dwLU.js";import"./unsafe-html.J0GGe2Q7.js";import"./lion-tabs.BCJGDeuT.js";import"./directive.CGE4aKEl.js";import"./LionTabs.ChXPLgfG.js";import"./uuid.DjYKNjre.js";const r=()=>n`
  <lion-tabs>
    <button slot="tab">Info</button>
    <p slot="panel">Info page with lots of information about us.</p>
    <button slot="tab">Work</button>
    <p slot="panel">Work page that showcases our work.</p>
  </lion-tabs>
`,i=document,m=[{key:"main",story:r}];let s=!1;for(const o of m){const t=i.querySelector(`[mdjs-story-name="${o.key}"]`);t&&(t.story=o.story,t.key=o.key,s=!0,Object.assign(t,{simulatorUrl:"/next/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}s&&(customElements.get("mdjs-preview")||e(()=>import("./define.DAMBs0Wv.js"),__vite__mapDeps([0,1,2,3,4,5])),customElements.get("mdjs-story")||e(()=>import("./define.m2CvvXyF.js"),__vite__mapDeps([6,2,3])));export{r as main};
