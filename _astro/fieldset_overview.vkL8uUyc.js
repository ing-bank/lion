const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.BdbiuFq9.js","_astro/MdJsPreview.3BOxlSHn.js","_astro/lit-element.jD9bOQKo.js","_astro/lit-html.DtZEZPQ5.js","_astro/lit-element.BdYmZD4s.js","_astro/define.DNIVKtom.js"])))=>i.map(i=>d[i]);
import{_ as o}from"./preload-helper.CVfkMyKi.js";import"./MdJsPreview.3BOxlSHn.js";import"./lit-element.jD9bOQKo.js";import{x as m}from"./lit-html.DtZEZPQ5.js";import"./unsafe-html.DgrA3nwU.js";import"./lion-input.BZacNd8I.js";import"./lion-fieldset.k-3YnA5R.js";const n=()=>m`
  <lion-fieldset name="nameGroup" label="Name">
    <lion-input name="firstName" label="First Name" .modelValue="${"Foo"}"></lion-input>
    <lion-input name="lastName" label="Last Name" .modelValue="${"Bar"}"></lion-input>
  </lion-fieldset>
`,s=document,r=[{key:"main",story:n}];let i=!1;for(const t of r){const e=s.querySelector(`[mdjs-story-name="${t.key}"]`);e&&(e.story=t.story,e.key=t.key,i=!0,Object.assign(e,{simulatorUrl:"/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}i&&(customElements.get("mdjs-preview")||o(()=>import("./define.BdbiuFq9.js"),__vite__mapDeps([0,1,2,3,4])),customElements.get("mdjs-story")||o(()=>import("./define.DNIVKtom.js"),__vite__mapDeps([5,2,3])));export{n as main};
