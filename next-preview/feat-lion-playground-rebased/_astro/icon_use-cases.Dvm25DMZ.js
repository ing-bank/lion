const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.BWpRLYnc.js","_astro/MdJsPreview.CainKAmn.js","_astro/lit-element.B1EQMsFJ.js","_astro/lit-html.BX7rm8u-.js","_astro/dedupeMixin.6XPTJgK8.js","_astro/LionAccordion.CCw3hAmZ.js","_astro/lit-element.BOikny4r.js","_astro/uuid.DjYKNjre.js","_astro/define.BPRa0k46.js"])))=>i.map(i=>d[i]);
import{_ as t}from"./preload-helper.DOA02mLT.js";import"./MdJsPreview.CainKAmn.js";import"./lit-element.B1EQMsFJ.js";import{b as i}from"./lit-html.BX7rm8u-.js";import"./node-tools_providence-analytics_overview.BQH7j7jT.js";import{s}from"./iconset-space.5UqIl8CU.js";import"./lion-icon.DWIa_Px4.js";const l=()=>i`
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
`,a=()=>i`
  <style>
    .demo-icon {
      width: 160px;
      height: 160px;
      fill: blue;
    }
  </style>
  <lion-icon icon-id="lion:bugs:bug02" aria-label="Bug" class="demo-icon"></lion-icon>
`,c=document,m=[{key:"iconSets",story:l},{key:"accessibleLabel",story:r},{key:"Styling",story:a}];let n=!1;for(const e of m){const o=c.querySelector(`[mdjs-story-name="${e.key}"]`);o&&(o.story=e.story,o.key=e.key,n=!0,Object.assign(o,{simulatorUrl:"/next-preview/feat-lion-playground-rebased/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}n&&(customElements.get("mdjs-preview")||t(()=>import("./define.BWpRLYnc.js"),__vite__mapDeps([0,1,2,3,4,5,6,7])),customElements.get("mdjs-story")||t(()=>import("./define.BPRa0k46.js"),__vite__mapDeps([8,2,3])));export{a as Styling,r as accessibleLabel,l as iconSets};
