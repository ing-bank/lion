const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.BWpRLYnc.js","_astro/MdJsPreview.CainKAmn.js","_astro/lit-element.B1EQMsFJ.js","_astro/lit-html.BX7rm8u-.js","_astro/dedupeMixin.6XPTJgK8.js","_astro/LionAccordion.CCw3hAmZ.js","_astro/lit-element.BOikny4r.js","_astro/uuid.DjYKNjre.js","_astro/define.BPRa0k46.js"])))=>i.map(i=>d[i]);
import{_ as n}from"./preload-helper.DOA02mLT.js";import"./MdJsPreview.CainKAmn.js";import"./lit-element.B1EQMsFJ.js";import{b as e}from"./lit-html.BX7rm8u-.js";import"./node-tools_providence-analytics_overview.BQH7j7jT.js";import"./lion-input.B6pwrbDb.js";const i=()=>e` <lion-input label="Input" name="input"></lion-input> `,s=()=>e`
  <lion-input label-sr-only label="Input" name="input"></lion-input>
`,a=()=>e`
  <lion-input>
    <label slot="label">Label</label>
    <div slot="help-text">
      Help text using <a href="https://example.com/" target="_blank">html</a>
    </div>
  </lion-input>
`,r=()=>e`
  <lion-input .modelValue="${"Prefilled value"}" label="Prefilled"></lion-input>
`,d=()=>e`
  <lion-input readonly .modelValue="${"This is read only"}" label="Read only"></lion-input>
`,m=()=>e`
  <lion-input disabled .modelValue="${"This is disabled"}" label="Disabled"></lion-input>
`,p=document,y=[{key:"label",story:i},{key:"labelSrOnly",story:s},{key:"helpText",story:a},{key:"prefilled",story:r},{key:"readOnly",story:d},{key:"disabled",story:m}];let o=!1;for(const t of y){const l=p.querySelector(`[mdjs-story-name="${t.key}"]`);l&&(l.story=t.story,l.key=t.key,o=!0,Object.assign(l,{simulatorUrl:"/next-preview/feat-lion-playground-rebased/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}o&&(customElements.get("mdjs-preview")||n(()=>import("./define.BWpRLYnc.js"),__vite__mapDeps([0,1,2,3,4,5,6,7])),customElements.get("mdjs-story")||n(()=>import("./define.BPRa0k46.js"),__vite__mapDeps([8,2,3])));export{m as disabled,a as helpText,i as label,s as labelSrOnly,r as prefilled,d as readOnly};
