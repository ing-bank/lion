const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.D5IFK1jp.js","_astro/MdJsPreview.B62up6PK.js","_astro/lit-element.DxRhnkit.js","_astro/lit-html.BX7rm8u-.js","_astro/dedupeMixin.6XPTJgK8.js","_astro/lit-element.BOikny4r.js","_astro/uuid.DjYKNjre.js","_astro/define.DBgp7shK.js"])))=>i.map(i=>d[i]);
import{_ as n}from"./preload-helper.CVfkMyKi.js";import"./MdJsPreview.B62up6PK.js";import"./lit-element.DxRhnkit.js";import{b as e}from"./lit-html.BX7rm8u-.js";import"./unsafe-html.FHlAasnX.js";import"./lion-input-amount.95_Mm5rI.js";function r(t){return t.replace(/[^0-9,. ]/g,"")}const i=()=>e`
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
`,p=document,d=[{key:"negativeNumber",story:i},{key:"HtmlStory13",story:m},{key:"currencySymbol",story:u},{key:"forceLocale",story:a},{key:"forceDigits",story:s},{key:"faultyPrefilled",story:c},{key:"noDecimals",story:y}];let l=!1;for(const t of d){const o=p.querySelector(`[mdjs-story-name="${t.key}"]`);o&&(o.story=t.story,o.key=t.key,l=!0,Object.assign(o,{simulatorUrl:"/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}l&&(customElements.get("mdjs-preview")||n(()=>import("./define.D5IFK1jp.js"),__vite__mapDeps([0,1,2,3,4,5,6])),customElements.get("mdjs-story")||n(()=>import("./define.DBgp7shK.js"),__vite__mapDeps([7,2,3])));export{m as HtmlStory13,u as currencySymbol,c as faultyPrefilled,s as forceDigits,a as forceLocale,i as negativeNumber,y as noDecimals};
