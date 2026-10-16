import"./f1151d68.js";import{x as e}from"./b8bc2eda.js";import"./6638bb86.js";import{n as o,e as t}from"./2ff5990a.js";import"./108f5609.js";import"./fe4ab398.js";import{l as r}from"./04e5357d.js";import{P as a}from"./a06c5caf.js";import"./dcadf410.js";import"./be5f2fd3.js";import"./d20b9c62.js";import"./7c882590.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./741dc621.js";import"./c48d90f3.js";import"./dc2f5f5a.js";import"./9a16257f.js";import"./45058e5d.js";import"./57941646.js";import"./4abf0ca8.js";import"./143fde17.js";import"./6722e641.js";import"./7eab6f7c.js";import"./30c0041b.js";import"./92fca6ea.js";import"./af1609b4.js";import"./4dc0ac82.js";import"./d924b319.js";import"./cc85a6f4.js";import"./48ac1cb5.js";import"./e49751c9.js";import"./b7f85193.js";import"./622cc741.js";const n=()=>(r(),e`
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
  `},m=document,d=[{key:"InputTelDropdown",story:n},{key:"allowedRegions",story:i},{key:"preferredRegionCodes",story:l},{key:"formatStrategy",story:p},{key:"formatCountryCodeStyle",story:s}];let u=!1;for(const e of d){const o=m.querySelector(`[mdjs-story-name="${e.key}"]`);o&&(o.story=e.story,o.key=e.key,u=!0,Object.assign(o,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}u&&(customElements.get("mdjs-preview")||import("./e90784d0.js"),customElements.get("mdjs-story")||import("./0defd61d.js"));export{n as InputTelDropdown,i as allowedRegions,s as formatCountryCodeStyle,p as formatStrategy,l as preferredRegionCodes};
