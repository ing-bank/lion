import"./08927fef.js";import{x as i}from"./b4be29f1.js";import"./05905ff1.js";import{I as e,a as t}from"./d03ec624.js";import{l}from"./1347002a.js";import"./4cc99b59.js";import"./19d2607c.js";import"./afb8834e.js";import"./d45984a3.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./dc2f5f5a.js";import"./4dc0ac82.js";import"./5034b8b0.js";import"./143fde17.js";import"./6722e641.js";import"./9d4fbb3c.js";import"./5c8a0a9d.js";import"./ee65bf86.js";import"./b9d3bf75.js";import"./cc85a6f4.js";import"./48ac1cb5.js";import"./e49751c9.js";import"./b7f85193.js";import"./622cc741.js";import"./a06c5caf.js";const o=()=>i`
  <lion-input-iban .modelValue="${"NL20INGB0001234567"}" name="iban" label="IBAN"></lion-input-iban>
`,s=()=>i`
  <lion-input-iban
    .modelValue="${"NL20INGB0001234567XXXX"}"
    name="iban"
    label="IBAN"
  ></lion-input-iban>
`,a=()=>(l(),i`
    <lion-input-iban
      .modelValue="${"DE89370400440532013000"}"
      .validators="${[new e("NL")]}"
      name="iban"
      label="IBAN"
    ></lion-input-iban>
    <br />
    <small>Demo instructions: you can use NL20 INGB 0001 2345 67</small>
  `),n=()=>(l(),i`
    <lion-input-iban
      .modelValue="${"DE89370400440532013000"}"
      .validators="${[new e(["BE","NL","LU"])]}"
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
  `),m=()=>(l(),i`
    <lion-input-iban
      .modelValue="${"DE89370400440532013000"}"
      .validators="${[new t(["RO","NL"])]}"
      name="iban"
      label="IBAN"
    ></lion-input-iban>
    <br />
    <small>
      Demo instructions: Try <code>RO 89 RZBR 6997 3728 4864 5577</code> and watch it fail
    </small>
  `),r=document,c=[{key:"prefilled",story:o},{key:"faultyPrefilled",story:s},{key:"countryRestrictions",story:a},{key:"countryRestrictionsMultiple",story:n},{key:"blacklistedCountry",story:m}];let p=!1;for(const i of c){const e=r.querySelector(`[mdjs-story-name="${i.key}"]`);e&&(e.story=i.story,e.key=i.key,p=!0,Object.assign(e,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}p&&(customElements.get("mdjs-preview")||import("./24735558.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{m as blacklistedCountry,a as countryRestrictions,n as countryRestrictionsMultiple,s as faultyPrefilled,o as prefilled};
