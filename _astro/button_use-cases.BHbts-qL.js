const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.BdbiuFq9.js","_astro/MdJsPreview.3BOxlSHn.js","_astro/lit-element.jD9bOQKo.js","_astro/lit-html.DtZEZPQ5.js","_astro/lit-element.BdYmZD4s.js","_astro/define.DNIVKtom.js"])))=>i.map(i=>d[i]);
import{_ as s}from"./preload-helper.CVfkMyKi.js";import"./MdJsPreview.3BOxlSHn.js";import"./lit-element.jD9bOQKo.js";import{x as o}from"./lit-html.DtZEZPQ5.js";import"./unsafe-html.DgrA3nwU.js";import"./lion-button.DwPII_HD.js";import"./lion-button-submit.DGxbKsex.js";const l=()=>o`
  <lion-button @click="${e=>console.log("clicked/spaced/entered",e)}">
    Click | Space | Enter me and see log
  </lion-button>
`,n=()=>o`<lion-button disabled>Disabled</lion-button>`,r=()=>o` <style>
      .small {
        padding: 4px;
        line-height: 1em;
      }
      .small::before {
        border: 1px dashed #000;
      }
    </style>
    <lion-button class="small">xs</lion-button>`,m=()=>o`
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
`,a=document,d=[{key:"handler",story:l},{key:"disabled",story:n},{key:"minimumClickArea",story:r},{key:"withinForm",story:m}];let i=!1;for(const e of d){const t=a.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,i=!0,Object.assign(t,{simulatorUrl:"/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}i&&(customElements.get("mdjs-preview")||s(()=>import("./define.BdbiuFq9.js"),__vite__mapDeps([0,1,2,3,4])),customElements.get("mdjs-story")||s(()=>import("./define.DNIVKtom.js"),__vite__mapDeps([5,2,3])));export{n as disabled,l as handler,r as minimumClickArea,m as withinForm};
