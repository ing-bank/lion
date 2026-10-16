const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.BdbiuFq9.js","_astro/MdJsPreview.3BOxlSHn.js","_astro/lit-element.jD9bOQKo.js","_astro/lit-html.DtZEZPQ5.js","_astro/lit-element.BdYmZD4s.js","_astro/define.DNIVKtom.js"])))=>i.map(i=>d[i]);
import{_ as t}from"./preload-helper.CVfkMyKi.js";import"./MdJsPreview.3BOxlSHn.js";import"./lit-element.jD9bOQKo.js";import{x as n}from"./lit-html.DtZEZPQ5.js";import"./unsafe-html.DgrA3nwU.js";import"./lion-listbox.Dt75dt9R.js";import"./lion-option.2jrmreLz.js";const s=()=>n`
  <lion-listbox name="listbox" label="Default">
    <lion-option .choiceValue="${"Apple"}">Apple</lion-option>
    <lion-option checked .choiceValue="${"Artichoke"}">Artichoke</lion-option>
    <lion-option .choiceValue="${"Asparagus"}">Asparagus</lion-option>
    <lion-option .choiceValue="${"Banana"}">Banana</lion-option>
    <lion-option .choiceValue="${"Beets"}">Beets</lion-option>
  </lion-listbox>
`,l=document,r=[{key:"main",story:s}];let i=!1;for(const e of r){const o=l.querySelector(`[mdjs-story-name="${e.key}"]`);o&&(o.story=e.story,o.key=e.key,i=!0,Object.assign(o,{simulatorUrl:"/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}i&&(customElements.get("mdjs-preview")||t(()=>import("./define.BdbiuFq9.js"),__vite__mapDeps([0,1,2,3,4])),customElements.get("mdjs-story")||t(()=>import("./define.DNIVKtom.js"),__vite__mapDeps([5,2,3])));export{s as main};
