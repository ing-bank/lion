const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.BdbiuFq9.js","_astro/MdJsPreview.3BOxlSHn.js","_astro/lit-element.jD9bOQKo.js","_astro/lit-html.DtZEZPQ5.js","_astro/lit-element.BdYmZD4s.js","_astro/define.DNIVKtom.js"])))=>i.map(i=>d[i]);
import{_ as t}from"./preload-helper.CVfkMyKi.js";import"./MdJsPreview.3BOxlSHn.js";import"./lit-element.jD9bOQKo.js";import{x as s}from"./lit-html.DtZEZPQ5.js";import"./unsafe-html.DgrA3nwU.js";import"./lion-input-tel.DQt8dMp3.js";import"./h-output.Cu2bcD4B.js";import{l as m}from"./loadDefaultFeedbackMessages.DKrgwlad.js";import{P as n}from"./PhoneUtilManager.zIdPai_j.js";const i=()=>(m(),s`
    <lion-input-tel
      .modelValue="${"+639921343959"}"
      live-format
      label="Telephone number"
      name="phoneNumber"
    ></lion-input-tel>
    <h-output
      .show="${["activeRegion",{name:"all or allowed regions",processor:e=>JSON.stringify(e._allowedOrAllRegions)},"modelValue"]}" 'modelValue']}"
      .readyPromise="${n.loadComplete}"
    ></h-output>
  `),l=document,a=[{key:"main",story:i}];let r=!1;for(const e of a){const o=l.querySelector(`[mdjs-story-name="${e.key}"]`);o&&(o.story=e.story,o.key=e.key,r=!0,Object.assign(o,{simulatorUrl:"/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}r&&(customElements.get("mdjs-preview")||t(()=>import("./define.BdbiuFq9.js"),__vite__mapDeps([0,1,2,3,4])),customElements.get("mdjs-story")||t(()=>import("./define.DNIVKtom.js"),__vite__mapDeps([5,2,3])));export{i as main};
