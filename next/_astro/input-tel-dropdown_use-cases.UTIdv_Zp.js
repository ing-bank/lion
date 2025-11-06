const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.DYUong5B.js","_astro/node-tools_providence-analytics_overview.LFFQBZzG.js","_astro/lit-element.qDHKJJma.js","_astro/lit-html.C7L4dwLU.js","_astro/unsafe-html.J0GGe2Q7.js","_astro/directive.CGE4aKEl.js","_astro/define.m2CvvXyF.js"])))=>i.map(i=>d[i]);
import{_ as i}from"./preload-helper.4zY6-HO4.js";import"./node-tools_providence-analytics_overview.LFFQBZzG.js";import"./lit-element.qDHKJJma.js";import{x as t}from"./lit-html.C7L4dwLU.js";import"./unsafe-html.J0GGe2Q7.js";import{n as l,e as a}from"./ref.DN9F-cVD.js";import"./lion-input-tel-dropdown.C5TJnEG3.js";import"./h-output.CusfOtS0.js";import{l as r}from"./loadDefaultFeedbackMessages.BQgeO4Ka.js";import{P as n}from"./PhoneUtilManager.DkvpFzJF.js";import"./directive.CGE4aKEl.js";import"./async-directive.CHVe8p0E.js";import"./directive-helpers.CLllgGgm.js";import"./LionInputTelDropdown.BB7wW4QH.js";import"./LionInputTel.DVBCZWII.js";import"./preprocessors.BqZFnKWs.js";import"./LocalizeMixin.VYu75dkK.js";import"./getLocalizeManager.W5d_ICRU.js";import"./index.BNCfcFQh.js";import"./lazifyInstantiation.CgYLRMC3.js";import"./dedupeMixin.6XPTJgK8.js";import"./LionInput.DRpWIRa3.js";import"./NativeTextFieldMixin.Cfq2aKpe.js";import"./InteractionStateMixin.BzvQ4Mf0.js";import"./DisabledMixin.Bm1nsErI.js";import"./LionField.DGnPMihp.js";import"./LionFieldset.CalDwoQW.js";import"./FormGroupMixin.CQnfLXQx.js";import"./FormRegistrarMixin.YCZ6eayn.js";import"./Validator.DAOhFpDH.js";import"./validators.BccilvTl.js";import"./Required.DgHIr_Cn.js";import"./StringValidators.UXrPEtgv.js";import"./NumberValidators.CmKpqCIb.js";import"./DateValidators.CEq8F9yx.js";import"./normalizeDateTime.BoDqBOW2.js";const m=()=>(r(),t`
    <lion-input-tel-dropdown
      label="Select region via dropdown"
      help-text="Shows all regions by default"
      name="phoneNumber"
    ></lion-input-tel-dropdown>
    <h-output
      .show="${["modelValue","activeRegion"]}"
      .readyPromise="${n.loadComplete}"
    ></h-output>
  `),s=()=>(r(),t`
    <lion-input-tel-dropdown
      label="Select region via dropdown"
      help-text="With region code 'NL'"
      .modelValue="${"+31612345678"}"
      name="phoneNumber"
      .allowedRegions="${["NL","DE","GB"]}"
    ></lion-input-tel-dropdown>
    <h-output
      .show="${["modelValue","activeRegion"]}"
      .readyPromise="${n.loadComplete}"
    ></h-output>
  `),u=()=>(r(),t`
    <lion-input-tel-dropdown
      label="Select region via dropdown"
      help-text="Preferred regions show on top"
      .modelValue="${"+31612345678"}"
      name="phoneNumber"
      .allowedRegions="${["BE","CA","DE","GB","NL","US"]}"
      .preferredRegions="${["DE","NL"]}"
    ></lion-input-tel-dropdown>
    <h-output
      .show="${["modelValue","activeRegion"]}"
      .readyPromise="${n.loadComplete}"
    ></h-output>
  `),d=()=>{r();const o=a();return t`
    <select @change="${({target:e})=>o.value.formatStrategy=e.value}">
      <option value="e164">e164</option>
      <option value="international">international</option>
      <option value="rfc3966">rfc3966</option>
    </select>
    <lion-input-tel-dropdown
      ${l(o)}
      label="Format strategy"
      help-text="Choose a strategy above"
      format-strategy="e164"
      name="phoneNumber"
    ></lion-input-tel-dropdown>
    <h-output
      .show="${["modelValue","formatStrategy"]}"
      .readyPromise="${n.loadComplete}"
    ></h-output>
  `},y=()=>{r();const o=a();return t`
    <select @change="${({target:e})=>o.value.formatStrategy=e.value}">
      <option value="e164">e164</option>
      <option value="international">international</option>
      <option value="rfc3966">rfc3966</option>
    </select>
    <lion-input-tel-dropdown
      ${l(o)}
      label="Format strategy"
      help-text="Choose a strategy above"
      format-country-code-style="parentheses"
      format-strategy="e164"
      name="phoneNumber"
    ></lion-input-tel-dropdown>
    <h-output
      .show="${["modelValue","formatStrategy"]}"
      .readyPromise="${n.loadComplete}"
    ></h-output>
  `},g=document,c=[{key:"InputTelDropdown",story:m},{key:"allowedRegions",story:s},{key:"preferredRegionCodes",story:u},{key:"formatStrategy",story:d},{key:"formatCountryCodeStyle",story:y}];let p=!1;for(const o of c){const e=g.querySelector(`[mdjs-story-name="${o.key}"]`);e&&(e.story=o.story,e.key=o.key,p=!0,Object.assign(e,{simulatorUrl:"/next/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}p&&(customElements.get("mdjs-preview")||i(()=>import("./define.DYUong5B.js"),__vite__mapDeps([0,1,2,3,4,5])),customElements.get("mdjs-story")||i(()=>import("./define.m2CvvXyF.js"),__vite__mapDeps([6,2,3])));export{m as InputTelDropdown,s as allowedRegions,y as formatCountryCodeStyle,d as formatStrategy,u as preferredRegionCodes};
