const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.DSVRgKCR.js","_astro/node-tools_providence-analytics_overview.BxIihMx7.js","_astro/lit-element.jD9bOQKo.js","_astro/lit-html.DtZEZPQ5.js","_astro/unsafe-html.DgrA3nwU.js","_astro/directive.BO6BEpVC.js","_astro/define.DNIVKtom.js"])))=>i.map(i=>d[i]);
import{_ as t}from"./preload-helper.Cj2JEybs.js";import"./node-tools_providence-analytics_overview.BxIihMx7.js";import"./lit-element.jD9bOQKo.js";import{x as m}from"./lit-html.DtZEZPQ5.js";import"./unsafe-html.DgrA3nwU.js";import{l as s,a as n}from"./lazyRender.DciN-not.js";import"./lion-combobox.E-OZjOfE.js";import"./lion-option.BiCJ-byu.js";const r=()=>m`
  <lion-combobox name="combo" label="Default">
    ${s(n.map((o,e)=>m`
          <lion-option .checked="${e===0}" .choiceValue="${o}">${o}</lion-option>
        `))}
  </lion-combobox>
`,a=document,l=[{key:"main",story:r}];let i=!1;for(const o of l){const e=a.querySelector(`[mdjs-story-name="${o.key}"]`);e&&(e.story=o.story,e.key=o.key,i=!0,Object.assign(e,{simulatorUrl:"/next/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}i&&(customElements.get("mdjs-preview")||t(()=>import("./define.DSVRgKCR.js"),__vite__mapDeps([0,1,2,3,4,5])),customElements.get("mdjs-story")||t(()=>import("./define.DNIVKtom.js"),__vite__mapDeps([6,2,3])));export{r as main};
