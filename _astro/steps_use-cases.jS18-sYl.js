const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.D5IFK1jp.js","_astro/MdJsPreview.B62up6PK.js","_astro/lit-element.DxRhnkit.js","_astro/lit-html.BX7rm8u-.js","_astro/dedupeMixin.6XPTJgK8.js","_astro/lit-element.BOikny4r.js","_astro/uuid.DjYKNjre.js","_astro/define.DBgp7shK.js"])))=>i.map(i=>d[i]);
import{_ as n}from"./preload-helper.CVfkMyKi.js";import"./MdJsPreview.B62up6PK.js";import"./lit-element.DxRhnkit.js";import{b as r}from"./lit-html.BX7rm8u-.js";import"./unsafe-html.FHlAasnX.js";import"./lion-step.B1bK_oZR.js";const i=()=>r`
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
`,l=document,s=[{key:"main",story:i}];let o=!1;for(const t of s){const e=l.querySelector(`[mdjs-story-name="${t.key}"]`);e&&(e.story=t.story,e.key=t.key,o=!0,Object.assign(e,{simulatorUrl:"/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}o&&(customElements.get("mdjs-preview")||n(()=>import("./define.D5IFK1jp.js"),__vite__mapDeps([0,1,2,3,4,5,6])),customElements.get("mdjs-story")||n(()=>import("./define.DBgp7shK.js"),__vite__mapDeps([7,2,3])));export{i as main};
