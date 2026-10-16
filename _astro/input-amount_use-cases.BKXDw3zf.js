const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.BdbiuFq9.js","_astro/MdJsPreview.3BOxlSHn.js","_astro/lit-element.jD9bOQKo.js","_astro/lit-html.DtZEZPQ5.js","_astro/lit-element.BdYmZD4s.js","_astro/define.DNIVKtom.js"])))=>i.map(i=>d[i]);
import{_ as n}from"./preload-helper.CVfkMyKi.js";import"./MdJsPreview.3BOxlSHn.js";import"./lit-element.jD9bOQKo.js";import{x as e}from"./lit-html.DtZEZPQ5.js";import"./unsafe-html.DgrA3nwU.js";import"./lion-input-amount.VujJOCLg.js";function r(t){return t.replace(/[^0-9,. ]/g,"")}const i=()=>e`
  <lion-input-amount label="Amount" .modelValue="${-123456.78}"></lion-input-amount>
`,m=()=>e`<lion-input-amount label="Price" currency="USD" .modelValue="${123456.78}"></lion-input-amount>`,u=()=>e`
  <lion-input-amount
    label="Price"
    currency="USD"
    currency-label="$"
    .modelValue="${123456.78}"
  ></lion-input-amount>
`,a=()=>e`
    <lion-input-amount
      label="Price"
      currency="JOD"
      .locale="nl-NL"
      .modelValue="${123456.78}"
    ></lion-input-amount>
  `,s=()=>e`
  <lion-input-amount label="Amount" .preprocessor="${r}"></lion-input-amount>
`,c=()=>e`
  <lion-input-amount
    label="Amount"
    help-text="Faulty prefilled input will cause error feedback"
    .modelValue="${"foo"}"
  ></lion-input-amount>
`,y=()=>e`
  <lion-input-amount
    label="Amount"
    help-text="Prefilled and formatted"
    .formatOptions="${{minimumFractionDigits:0,maximumFractionDigits:0}}"
    .modelValue="${20}"
  >
  </lion-input-amount>
`,p=document,d=[{key:"negativeNumber",story:i},{key:"HtmlStory13",story:m},{key:"currencySymbol",story:u},{key:"forceLocale",story:a},{key:"forceDigits",story:s},{key:"faultyPrefilled",story:c},{key:"noDecimals",story:y}];let l=!1;for(const t of d){const o=p.querySelector(`[mdjs-story-name="${t.key}"]`);o&&(o.story=t.story,o.key=t.key,l=!0,Object.assign(o,{simulatorUrl:"/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}l&&(customElements.get("mdjs-preview")||n(()=>import("./define.BdbiuFq9.js"),__vite__mapDeps([0,1,2,3,4])),customElements.get("mdjs-story")||n(()=>import("./define.DNIVKtom.js"),__vite__mapDeps([5,2,3])));export{m as HtmlStory13,u as currencySymbol,c as faultyPrefilled,s as forceDigits,a as forceLocale,i as negativeNumber,y as noDecimals};
