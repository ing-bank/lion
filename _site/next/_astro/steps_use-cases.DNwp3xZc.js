const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.DYUong5B.js","_astro/node-tools_providence-analytics_overview.LFFQBZzG.js","_astro/lit-element.qDHKJJma.js","_astro/lit-html.C7L4dwLU.js","_astro/unsafe-html.J0GGe2Q7.js","_astro/directive.CGE4aKEl.js","_astro/define.m2CvvXyF.js"])))=>i.map(i=>d[i]);
import{_ as n}from"./preload-helper.4zY6-HO4.js";import"./node-tools_providence-analytics_overview.LFFQBZzG.js";import"./lit-element.qDHKJJma.js";import{x as r}from"./lit-html.C7L4dwLU.js";import"./unsafe-html.J0GGe2Q7.js";import"./lion-step.0neQZbfj.js";import"./directive.CGE4aKEl.js";const i=()=>r`
  <lion-steps>
    <lion-step initial-step>
      <p>Welcome</p>
      <button disabled>previous</button> &nbsp;
      <button type="button" @click="${t=>t.target.parentElement.controller.next()}">
        Next
      </button>
    </lion-step>
    <lion-step>
      <p>Are you single?</p>
      <button
        type="button"
        @click=${t=>{t.target.parentElement.controller.data.isSingle=!0,t.target.parentElement.controller.next()}}
      >
        Yes
      </button>
      &nbsp;
      <button
        type="button"
        @click=${t=>{t.target.parentElement.controller.data.isSingle=!1,t.target.parentElement.controller.next()}}
      >
        No
      </button>
      <br /><br />
      <button type="button" @click="${t=>t.target.parentElement.controller.previous()}">
        Previous
      </button>
    </lion-step>
    <lion-step id="is-single" .condition="${t=>t.isSingle}">
      <p>You are single</p>
      <button type="button" @click="${t=>t.target.parentElement.controller.previous()}">
        Previous
      </button>
      &nbsp;
      <button type="button" @click="${t=>t.target.parentElement.controller.next()}">
        Next
      </button>
    </lion-step>
    <lion-step id="is-not-single" .condition="${t=>t.isSingle}" invert-condition>
      <p>You are NOT single.</p>
      <button type="button" @click="${t=>t.target.parentElement.controller.previous()}">
        Previous
      </button>
      &nbsp;
      <button type="button" @click="${t=>t.target.parentElement.controller.next()}">
        Next
      </button>
    </lion-step>
    <lion-step>
      <p>Finish</p>
      <button type="button" @click="${t=>t.target.parentElement.controller.previous()}">
        Previous
      </button>
    </lion-step>
  </lion-steps>
`,l=document,s=[{key:"main",story:i}];let o=!1;for(const t of s){const e=l.querySelector(`[mdjs-story-name="${t.key}"]`);e&&(e.story=t.story,e.key=t.key,o=!0,Object.assign(e,{simulatorUrl:"/next/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}o&&(customElements.get("mdjs-preview")||n(()=>import("./define.DYUong5B.js"),__vite__mapDeps([0,1,2,3,4,5])),customElements.get("mdjs-story")||n(()=>import("./define.m2CvvXyF.js"),__vite__mapDeps([6,2,3])));export{i as main};
