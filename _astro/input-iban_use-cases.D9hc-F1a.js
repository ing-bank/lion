const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.BdbiuFq9.js","_astro/MdJsPreview.3BOxlSHn.js","_astro/lit-element.jD9bOQKo.js","_astro/lit-html.DtZEZPQ5.js","_astro/lit-element.BdYmZD4s.js","_astro/define.DNIVKtom.js"])))=>i.map(i=>d[i]);
import{_ as i}from"./preload-helper.CVfkMyKi.js";import"./MdJsPreview.3BOxlSHn.js";import"./lit-element.jD9bOQKo.js";import{x as e}from"./lit-html.DtZEZPQ5.js";import"./unsafe-html.DgrA3nwU.js";import{I as a,a as o}from"./lion-input-iban.B0iV0xs5.js";import{l as n}from"./loadDefaultFeedbackMessages.DKrgwlad.js";const r=()=>e`
  <lion-input-iban .modelValue="${"NL20INGB0001234567"}" name="iban" label="IBAN"></lion-input-iban>
`,m=()=>e`
  <lion-input-iban
    .modelValue="${"NL20INGB0001234567XXXX"}"
    name="iban"
    label="IBAN"
  ></lion-input-iban>
`,u=()=>(n(),e`
    <lion-input-iban
      .modelValue="${"DE89370400440532013000"}"
      .validators="${[new o("NL")]}"
      name="iban"
      label="IBAN"
    ></lion-input-iban>
    <br />
    <small>Demo instructions: you can use NL20 INGB 0001 2345 67</small>
  `),y=()=>(n(),e`
    <lion-input-iban
      .modelValue="${"DE89370400440532013000"}"
      .validators="${[new o(["BE","NL","LU"])]}"
      name="iban"
      label="IBAN"
    ></lion-input-iban>
    <br />
    <small>Demo instructions: you can use:</small>
    <ul>
      <li><small>BE68 5390 0754 7034</small></li>
      <li><small>NL20 INGB 0001 2345 67</small></li>
      <li><small>LU28 0019 4006 4475 0000</small></li>
    </ul>
  `),c=()=>(n(),e`
    <lion-input-iban
      .modelValue="${"DE89370400440532013000"}"
      .validators="${[new a(["RO","NL"])]}"
      name="iban"
      label="IBAN"
    ></lion-input-iban>
    <br />
    <small>
      Demo instructions: Try <code>RO 89 RZBR 6997 3728 4864 5577</code> and watch it fail
    </small>
  `),d=document,b=[{key:"prefilled",story:r},{key:"faultyPrefilled",story:m},{key:"countryRestrictions",story:u},{key:"countryRestrictionsMultiple",story:y},{key:"blacklistedCountry",story:c}];let s=!1;for(const t of b){const l=d.querySelector(`[mdjs-story-name="${t.key}"]`);l&&(l.story=t.story,l.key=t.key,s=!0,Object.assign(l,{simulatorUrl:"/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}s&&(customElements.get("mdjs-preview")||i(()=>import("./define.BdbiuFq9.js"),__vite__mapDeps([0,1,2,3,4])),customElements.get("mdjs-story")||i(()=>import("./define.DNIVKtom.js"),__vite__mapDeps([5,2,3])));export{c as blacklistedCountry,u as countryRestrictions,y as countryRestrictionsMultiple,m as faultyPrefilled,r as prefilled};
