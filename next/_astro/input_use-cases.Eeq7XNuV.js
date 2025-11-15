const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.DYUong5B.js","_astro/node-tools_providence-analytics_overview.LFFQBZzG.js","_astro/lit-element.qDHKJJma.js","_astro/lit-html.C7L4dwLU.js","_astro/unsafe-html.J0GGe2Q7.js","_astro/directive.CGE4aKEl.js","_astro/define.m2CvvXyF.js"])))=>i.map(i=>d[i]);
import{_ as o}from"./preload-helper.4zY6-HO4.js";import"./node-tools_providence-analytics_overview.LFFQBZzG.js";import"./lit-element.qDHKJJma.js";import{x as e}from"./lit-html.C7L4dwLU.js";import"./unsafe-html.J0GGe2Q7.js";import"./lion-input.BRs8ODeY.js";import"./directive.CGE4aKEl.js";import"./LionInput.B2KYRD9B.js";import"./NativeTextFieldMixin.CsE2kjU6.js";import"./InteractionStateMixin.DC1PvWzb.js";import"./dedupeMixin.6XPTJgK8.js";import"./LocalizeMixin.VYu75dkK.js";import"./directive-helpers.CLllgGgm.js";import"./async-directive.CHVe8p0E.js";import"./getLocalizeManager.W5d_ICRU.js";import"./index.BNCfcFQh.js";import"./lazifyInstantiation.CgYLRMC3.js";import"./DisabledMixin.Bm1nsErI.js";import"./LionField.gZkYIwXF.js";const n=()=>e` <lion-input label="Input" name="input"></lion-input> `,r=()=>e`
  <lion-input label-sr-only label="Input" name="input"></lion-input>
`,s=()=>e`
  <lion-input>
    <label slot="label">Label</label>
    <div slot="help-text">
      Help text using <a href="https://example.com/" target="_blank">html</a>
    </div>
  </lion-input>
`,a=()=>e`
  <lion-input .modelValue="${"Prefilled value"}" label="Prefilled"></lion-input>
`,m=()=>e`
  <lion-input readonly .modelValue="${"This is read only"}" label="Read only"></lion-input>
`,p=()=>e`
  <lion-input disabled .modelValue="${"This is disabled"}" label="Disabled"></lion-input>
`,d=document,y=[{key:"label",story:n},{key:"labelSrOnly",story:r},{key:"helpText",story:s},{key:"prefilled",story:a},{key:"readOnly",story:m},{key:"disabled",story:p}];let i=!1;for(const l of y){const t=d.querySelector(`[mdjs-story-name="${l.key}"]`);t&&(t.story=l.story,t.key=l.key,i=!0,Object.assign(t,{simulatorUrl:"/next/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}i&&(customElements.get("mdjs-preview")||o(()=>import("./define.DYUong5B.js"),__vite__mapDeps([0,1,2,3,4,5])),customElements.get("mdjs-story")||o(()=>import("./define.m2CvvXyF.js"),__vite__mapDeps([6,2,3])));export{p as disabled,s as helpText,n as label,r as labelSrOnly,a as prefilled,m as readOnly};
