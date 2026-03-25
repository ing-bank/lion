import"./f1151d68.js";import{x as e}from"./b8bc2eda.js";import"./6638bb86.js";import"./fad5a259.js";import"./20e08a57.js";import"./c48d90f3.js";import"./be5f2fd3.js";import"./dcadf410.js";import"./7c882590.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./dc2f5f5a.js";import"./6e65f685.js";import"./1069d12c.js";import"./e3918630.js";import"./45058e5d.js";import"./57941646.js";import"./4abf0ca8.js";import"./143fde17.js";import"./6722e641.js";import"./7eab6f7c.js";import"./e49751c9.js";import"./4dc0ac82.js";function t(e){return e.replace(/[^0-9,. ]/g,"")}const o=()=>e`
  <lion-input-amount label="Amount" .modelValue="${-123456.78}"></lion-input-amount>
`,n=()=>e`
  <lion-input-amount label="Price" currency="USD" .modelValue="${123456.78}"></lion-input-amount>
`,i=()=>e`
    <lion-input-amount
      label="Price"
      currency="JOD"
      .locale="nl-NL"
      .modelValue="${123456.78}"
    ></lion-input-amount>
  `,r=()=>e`
  <lion-input-amount label="Amount" .preprocessor="${t}"></lion-input-amount>
`,m=()=>e`
  <lion-input-amount
    label="Amount"
    help-text="Faulty prefilled input will cause error feedback"
    .modelValue="${"foo"}"
  ></lion-input-amount>
`,l=()=>e`
  <lion-input-amount
    label="Amount"
    help-text="Prefilled and formatted"
    .formatOptions="$"
    .modelValue="${20}"
  >
  </lion-input-amount>
`,a=document,s=[{key:"negativeNumber",story:o},{key:"currencySuffix",story:n},{key:"forceLocale",story:i},{key:"forceDigits",story:r},{key:"faultyPrefilled",story:m},{key:"noDecimals",story:l}];let u=!1;for(const e of s){const t=a.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,u=!0,Object.assign(t,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}u&&(customElements.get("mdjs-preview")||import("./e90784d0.js"),customElements.get("mdjs-story")||import("./0defd61d.js"));export{n as currencySuffix,m as faultyPrefilled,r as forceDigits,i as forceLocale,o as negativeNumber,l as noDecimals};
