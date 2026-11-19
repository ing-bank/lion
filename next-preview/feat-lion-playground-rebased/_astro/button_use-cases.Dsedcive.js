const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.BWpRLYnc.js","_astro/MdJsPreview.CainKAmn.js","_astro/lit-element.B1EQMsFJ.js","_astro/lit-html.BX7rm8u-.js","_astro/dedupeMixin.6XPTJgK8.js","_astro/LionAccordion.CCw3hAmZ.js","_astro/lit-element.BOikny4r.js","_astro/uuid.DjYKNjre.js","_astro/define.BPRa0k46.js"])))=>i.map(i=>d[i]);
import{_ as n}from"./preload-helper.DOA02mLT.js";import"./MdJsPreview.CainKAmn.js";import"./lit-element.B1EQMsFJ.js";import{b as o}from"./lit-html.BX7rm8u-.js";import"./node-tools_providence-analytics_overview.BQH7j7jT.js";import"./lion-button.D2RP6o39.js";import"./lion-button-submit.CECA2Era.js";const i=()=>o`
  <lion-button @click="${e=>console.log("clicked/spaced/entered",e)}">
    Click | Space | Enter me and see log
  </lion-button>
`,l=()=>o`<lion-button disabled>Disabled</lion-button>`,r=()=>o` <style>
      .small {
        padding: 4px;
        line-height: 1em;
      }
      .small::before {
        border: 1px dashed #000;
      }
    </style>
    <lion-button class="small">xs</lion-button>`,a=()=>o`
  <form
    @submit=${e=>{e.preventDefault(),console.log("submit handler",e.target)}}
  >
    <label for="firstNameId">First name</label>
    <input id="firstNameId" name="firstName" />
    <label for="lastNameId">Last name</label>
    <input id="lastNameId" name="lastName" />
    <lion-button-submit @click=${e=>console.log("click submit handler",e.target)}
      >Submit</lion-button-submit
    >
    <lion-button-reset @click=${e=>console.log("click reset handler",e.target)}
      >Reset</lion-button-reset
    >
  </form>
`,m=document,d=[{key:"handler",story:i},{key:"disabled",story:l},{key:"minimumClickArea",story:r},{key:"withinForm",story:a}];let s=!1;for(const e of d){const t=m.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,s=!0,Object.assign(t,{simulatorUrl:"/next-preview/feat-lion-playground-rebased/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}s&&(customElements.get("mdjs-preview")||n(()=>import("./define.BWpRLYnc.js"),__vite__mapDeps([0,1,2,3,4,5,6,7])),customElements.get("mdjs-story")||n(()=>import("./define.BPRa0k46.js"),__vite__mapDeps([8,2,3])));export{l as disabled,i as handler,r as minimumClickArea,a as withinForm};
