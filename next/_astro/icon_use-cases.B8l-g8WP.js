const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.DYUong5B.js","_astro/node-tools_providence-analytics_overview.LFFQBZzG.js","_astro/lit-element.qDHKJJma.js","_astro/lit-html.C7L4dwLU.js","_astro/unsafe-html.J0GGe2Q7.js","_astro/directive.CGE4aKEl.js","_astro/define.m2CvvXyF.js"])))=>i.map(i=>d[i]);
import{_ as t}from"./preload-helper.4zY6-HO4.js";import"./node-tools_providence-analytics_overview.LFFQBZzG.js";import"./lit-element.qDHKJJma.js";import{x as i}from"./lit-html.C7L4dwLU.js";import"./unsafe-html.J0GGe2Q7.js";import{s}from"./iconset-space.5UqIl8CU.js";import"./lion-icon.CN7y9ybC.js";import"./directive.CGE4aKEl.js";import"./directive-helpers.CLllgGgm.js";import"./index.BNCfcFQh.js";import"./lazifyInstantiation.CgYLRMC3.js";const l=()=>i`
  ${Object.keys(s).map(e=>i`
      <style>
        .demo-icon__container {
          display: inline-flex;
          position: relative;
          flex-grow: 1;
          flex-direction: column;
          align-items: center;
          width: 80px;
          height: 80px;
          padding: 4px;
        }
        .demo-icon__name {
          font-size: 10px;
        }
      </style>
      <div class="demo-icon__container">
        <lion-icon icon-id="lion:space:${e}" aria-label="${e}"></lion-icon>
        <span class="demo-icon__name">${e}</span>
      </div>
    `)}
`,r=()=>i`
  <lion-icon icon-id="lion:misc:arrowLeft" aria-label="Pointing left"></lion-icon>
`,c=()=>i`
  <style>
    .demo-icon {
      width: 160px;
      height: 160px;
      fill: blue;
    }
  </style>
  <lion-icon icon-id="lion:bugs:bug02" aria-label="Bug" class="demo-icon"></lion-icon>
`,a=document,m=[{key:"iconSets",story:l},{key:"accessibleLabel",story:r},{key:"Styling",story:c}];let n=!1;for(const e of m){const o=a.querySelector(`[mdjs-story-name="${e.key}"]`);o&&(o.story=e.story,o.key=e.key,n=!0,Object.assign(o,{simulatorUrl:"/next/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}n&&(customElements.get("mdjs-preview")||t(()=>import("./define.DYUong5B.js"),__vite__mapDeps([0,1,2,3,4,5])),customElements.get("mdjs-story")||t(()=>import("./define.m2CvvXyF.js"),__vite__mapDeps([6,2,3])));export{c as Styling,r as accessibleLabel,l as iconSets};
