const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.DYUong5B.js","_astro/node-tools_providence-analytics_overview.LFFQBZzG.js","_astro/lit-element.qDHKJJma.js","_astro/lit-html.C7L4dwLU.js","_astro/unsafe-html.J0GGe2Q7.js","_astro/directive.CGE4aKEl.js","_astro/define.m2CvvXyF.js"])))=>i.map(i=>d[i]);
import{_ as i}from"./preload-helper.4zY6-HO4.js";import"./node-tools_providence-analytics_overview.LFFQBZzG.js";import"./lit-element.qDHKJJma.js";import{x as t}from"./lit-html.C7L4dwLU.js";import"./unsafe-html.J0GGe2Q7.js";import"./lion-input-amount.DcX5TAZf.js";import"./directive.CGE4aKEl.js";import"./LionInputAmount.CJWpEuSp.js";import"./formatNumber.aN4wfHaw.js";import"./getLocalizeManager.W5d_ICRU.js";import"./index.BNCfcFQh.js";import"./lazifyInstantiation.CgYLRMC3.js";import"./getLocale.PZ4ia-vo.js";import"./parseNumber.Cin8KryK.js";import"./LocalizeMixin.VYu75dkK.js";import"./directive-helpers.CLllgGgm.js";import"./async-directive.CHVe8p0E.js";import"./dedupeMixin.6XPTJgK8.js";import"./LionInput.DRpWIRa3.js";import"./NativeTextFieldMixin.Cfq2aKpe.js";import"./InteractionStateMixin.BzvQ4Mf0.js";import"./DisabledMixin.Bm1nsErI.js";import"./LionField.DGnPMihp.js";import"./NumberValidators.CmKpqCIb.js";import"./Validator.DAOhFpDH.js";function n(o){return o.replace(/[^0-9,. ]/g,"")}const m=()=>t`
  <lion-input-amount label="Amount" .modelValue="${-123456.78}"></lion-input-amount>
`,l=()=>t`
  <lion-input-amount label="Price" currency="USD" .modelValue="${123456.78}"></lion-input-amount>
`,u=()=>t`
    <lion-input-amount
      label="Price"
      currency="JOD"
      .locale="nl-NL"
      .modelValue="${123456.78}"
    ></lion-input-amount>
  `,a=()=>t`
  <lion-input-amount label="Amount" .preprocessor="${n}"></lion-input-amount>
`,s=()=>t`
  <lion-input-amount
    label="Amount"
    help-text="Faulty prefilled input will cause error feedback"
    .modelValue="${"foo"}"
  ></lion-input-amount>
`,p=()=>t`
  <lion-input-amount
    label="Amount"
    help-text="Prefilled and formatted"
    .formatOptions="${{minimumFractionDigits:0,maximumFractionDigits:0}}"
    .modelValue="${20}"
  >
  </lion-input-amount>
`,c=document,y=[{key:"negativeNumber",story:m},{key:"currencySuffix",story:l},{key:"forceLocale",story:u},{key:"forceDigits",story:a},{key:"faultyPrefilled",story:s},{key:"noDecimals",story:p}];let r=!1;for(const o of y){const e=c.querySelector(`[mdjs-story-name="${o.key}"]`);e&&(e.story=o.story,e.key=o.key,r=!0,Object.assign(e,{simulatorUrl:"/next/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}r&&(customElements.get("mdjs-preview")||i(()=>import("./define.DYUong5B.js"),__vite__mapDeps([0,1,2,3,4,5])),customElements.get("mdjs-story")||i(()=>import("./define.m2CvvXyF.js"),__vite__mapDeps([6,2,3])));export{l as currencySuffix,s as faultyPrefilled,a as forceDigits,u as forceLocale,m as negativeNumber,p as noDecimals};
