const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.BWpRLYnc.js","_astro/MdJsPreview.CainKAmn.js","_astro/lit-element.B1EQMsFJ.js","_astro/lit-html.BX7rm8u-.js","_astro/dedupeMixin.6XPTJgK8.js","_astro/LionAccordion.CCw3hAmZ.js","_astro/lit-element.BOikny4r.js","_astro/uuid.DjYKNjre.js","_astro/define.BPRa0k46.js"])))=>i.map(i=>d[i]);
import{_ as t}from"./preload-helper.DOA02mLT.js";import"./MdJsPreview.CainKAmn.js";import"./lit-element.B1EQMsFJ.js";import{b as i}from"./lit-html.BX7rm8u-.js";import"./node-tools_providence-analytics_overview.BQH7j7jT.js";import{l as n,a as r}from"./lazyRender.C6asyIK2.js";import"./lion-combobox.Dp49pOGE.js";import"./lion-option.CAR7garS.js";const s=()=>i`
  <lion-combobox name="combo" label="Default">
    ${n(r.map((e,o)=>i`
          <lion-option .checked="${o===0}" .choiceValue="${e}">${e}</lion-option>
        `))}
  </lion-combobox>
`,a=document,l=[{key:"main",story:s}];let m=!1;for(const e of l){const o=a.querySelector(`[mdjs-story-name="${e.key}"]`);o&&(o.story=e.story,o.key=e.key,m=!0,Object.assign(o,{simulatorUrl:"/next-preview/feat-lion-playground-rebased/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}m&&(customElements.get("mdjs-preview")||t(()=>import("./define.BWpRLYnc.js"),__vite__mapDeps([0,1,2,3,4,5,6,7])),customElements.get("mdjs-story")||t(()=>import("./define.BPRa0k46.js"),__vite__mapDeps([8,2,3])));export{s as main};
