import"./24f95583.js";import{x as e}from"./b4be29f1.js";import"./05905ff1.js";import{n as o,e as t}from"./3ae224d1.js";import"./04dc7892.js";import"./ebf3d6e7.js";import{l as r}from"./c85cfbca.js";import{P as a}from"./a06c5caf.js";import"./afb8834e.js";import"./19d2607c.js";import"./4777ff9b.js";import"./d45984a3.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./1fe9105d.js";import"./4cc99b59.js";import"./dc2f5f5a.js";import"./9a16257f.js";import"./4a239ef1.js";import"./9157d4cc.js";import"./7902d8e0.js";import"./143fde17.js";import"./298b3bc0.js";import"./9e1b447d.js";import"./788d808c.js";import"./48b0a907.js";import"./4dc0ac82.js";import"./459b1eec.js";import"./cc85a6f4.js";import"./48ac1cb5.js";import"./e49751c9.js";import"./b7f85193.js";import"./622cc741.js";const n=()=>(r(),e`
    <lion-input-tel-dropdown
      label="Select region via dropdown"
      help-text="Shows all regions by default"
      name="phoneNumber"
    ></lion-input-tel-dropdown>
    <h-output
      .show="${["modelValue","activeRegion"]}"
      .readyPromise="${a.loadComplete}"
    ></h-output>
  `),i=()=>(r(),e`
    <lion-input-tel-dropdown
      label="Select region via dropdown"
      help-text="With region code 'NL'"
      .modelValue="${"+31612345678"}"
      name="phoneNumber"
      .allowedRegions="${["NL","DE","GB"]}"
    ></lion-input-tel-dropdown>
    <h-output
      .show="${["modelValue","activeRegion"]}"
      .readyPromise="${a.loadComplete}"
    ></h-output>
  `),l=()=>(r(),e`
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
      .readyPromise="${a.loadComplete}"
    ></h-output>
  `),p=()=>{r();const n=t();return e`
    <select @change="${({target:e})=>n.value.formatStrategy=e.value}">
      <option value="e164">e164</option>
      <option value="international">international</option>
      <option value="rfc3966">rfc3966</option>
    </select>
    <lion-input-tel-dropdown
      ${o(n)}
      label="Format strategy"
      help-text="Choose a strategy above"
      format-strategy="e164"
      name="phoneNumber"
    ></lion-input-tel-dropdown>
    <h-output
      .show="${["modelValue","formatStrategy"]}"
      .readyPromise="${a.loadComplete}"
    ></h-output>
  `},s=()=>{r();const n=t();return e`
    <select @change="${({target:e})=>n.value.formatStrategy=e.value}">
      <option value="e164">e164</option>
      <option value="international">international</option>
      <option value="rfc3966">rfc3966</option>
    </select>
    <lion-input-tel-dropdown
      ${o(n)}
      label="Format strategy"
      help-text="Choose a strategy above"
      format-country-code-style="parentheses"
      format-strategy="e164"
      name="phoneNumber"
    ></lion-input-tel-dropdown>
    <h-output
      .show="${["modelValue","formatStrategy"]}"
      .readyPromise="${a.loadComplete}"
    ></h-output>
  `},m=document,d=[{key:"InputTelDropdown",story:n},{key:"allowedRegions",story:i},{key:"preferredRegionCodes",story:l},{key:"formatStrategy",story:p},{key:"formatCountryCodeStyle",story:s}];let u=!1;for(const e of d){const o=m.querySelector(`[mdjs-story-name="${e.key}"]`);o&&(o.story=e.story,o.key=e.key,u=!0,Object.assign(o,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}u&&(customElements.get("mdjs-preview")||import("./a7b4f51b.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{n as InputTelDropdown,i as allowedRegions,s as formatCountryCodeStyle,p as formatStrategy,l as preferredRegionCodes};
