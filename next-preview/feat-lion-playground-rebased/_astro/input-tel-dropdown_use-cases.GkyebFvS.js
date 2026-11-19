const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.BWpRLYnc.js","_astro/MdJsPreview.CainKAmn.js","_astro/lit-element.B1EQMsFJ.js","_astro/lit-html.BX7rm8u-.js","_astro/dedupeMixin.6XPTJgK8.js","_astro/LionAccordion.CCw3hAmZ.js","_astro/lit-element.BOikny4r.js","_astro/uuid.DjYKNjre.js","_astro/define.BPRa0k46.js"])))=>i.map(i=>d[i]);
import{_ as l}from"./preload-helper.DOA02mLT.js";import"./MdJsPreview.CainKAmn.js";import"./lit-element.B1EQMsFJ.js";import{b as t}from"./lit-html.BX7rm8u-.js";import"./node-tools_providence-analytics_overview.BQH7j7jT.js";import{n as a,e as i}from"./ref.CInaizze.js";import"./lion-input-tel-dropdown.DsZKAxyL.js";import"./h-output.CQmTG2rr.js";import{l as r}from"./loadDefaultFeedbackMessages.BgRJgi6F.js";import{P as n}from"./PhoneUtilManager.DhRZ7McK.js";const s=()=>(r(),t`
    <lion-input-tel-dropdown
      label="Select region via dropdown"
      help-text="Shows all regions by default"
      name="phoneNumber"
    ></lion-input-tel-dropdown>
    <h-output
      .show="${["modelValue","activeRegion"]}"
      .readyPromise="${n.loadComplete}"
    ></h-output>
  `),d=()=>(r(),t`
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
  `),m=()=>{r();const e=i();return t`
    <select @change="${({target:o})=>e.value.formatStrategy=o.value}">
      <option value="e164">e164</option>
      <option value="international">international</option>
      <option value="rfc3966">rfc3966</option>
    </select>
    <lion-input-tel-dropdown
      ${a(e)}
      label="Format strategy"
      help-text="Choose a strategy above"
      format-strategy="e164"
      name="phoneNumber"
    ></lion-input-tel-dropdown>
    <h-output
      .show="${["modelValue","formatStrategy"]}"
      .readyPromise="${n.loadComplete}"
    ></h-output>
  `},y=()=>{r();const e=i();return t`
    <select @change="${({target:o})=>e.value.formatStrategy=o.value}">
      <option value="e164">e164</option>
      <option value="international">international</option>
      <option value="rfc3966">rfc3966</option>
    </select>
    <lion-input-tel-dropdown
      ${a(e)}
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
  `},g=document,c=[{key:"InputTelDropdown",story:s},{key:"allowedRegions",story:d},{key:"preferredRegionCodes",story:u},{key:"formatStrategy",story:m},{key:"formatCountryCodeStyle",story:y}];let p=!1;for(const e of c){const o=g.querySelector(`[mdjs-story-name="${e.key}"]`);o&&(o.story=e.story,o.key=e.key,p=!0,Object.assign(o,{simulatorUrl:"/next-preview/feat-lion-playground-rebased/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}p&&(customElements.get("mdjs-preview")||l(()=>import("./define.BWpRLYnc.js"),__vite__mapDeps([0,1,2,3,4,5,6,7])),customElements.get("mdjs-story")||l(()=>import("./define.BPRa0k46.js"),__vite__mapDeps([8,2,3])));export{s as InputTelDropdown,d as allowedRegions,y as formatCountryCodeStyle,m as formatStrategy,u as preferredRegionCodes};
