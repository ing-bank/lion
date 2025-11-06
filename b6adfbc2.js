import"./24f95583.js";import{x as e}from"./b4be29f1.js";import"./05905ff1.js";import"./c7db7091.js";import"./74b104922.js";import{U as t}from"./c6fab747.js";import{l as r}from"./9a16257f.js";import"./c2aef983.js";import"./7077221a.js";import"./dc2f5f5a.js";import"./f12ecf0e.js";import"./bbaa6280.js";import"./bfba5e5f.js";import"./ec06148e.js";import"./4dc0ac82.js";import"./143fde17.js";import"./d45984a3.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./4cc99b59.js";import"./19d2607c.js";import"./afb8834e.js";import"./a06c5caf.js";const o=()=>e`
  <lion-input
    label="Number Example"
    help-text="Uses .parser to create model values from view values"
    .parser="${e=>Number(e)}"
    .modelValue="${1234567890}"
    @model-value-changed="${({target:e})=>console.log(e)}"
  ></lion-input>
  <h-output .show="${["modelValue"]}"></h-output>
`,s=()=>e`
  <lion-input
    label="Number Example"
    help-text="Uses .parser and return undefined if Number() cannot parse"
    .parser="${e=>Number(e)||void 0}"
    value="${"1234abc567890"}"
  ></lion-input>
  <h-output .show="${["modelValue"]}"></h-output>
`,a=()=>e`
    <lion-input
      label="Number Example"
      help-text="Uses .formatter to create view value"
      .parser="${e=>Number(e.replace(/[^0-9]/g,""))}"
      .formatter="${(e,t)=>"number"!=typeof e?t.formattedValue:new Intl.NumberFormat("en-GB").format(e)}"
      .modelValue="${1234567890}"
    >
    </lion-input>
    <h-output .show="${["modelValue","formattedValue"]}"></h-output>
  `,l=()=>e`
    <lion-input
      label="Date Example"
      help-text="Uses .(de)serializer to restore serialized modelValues"
      .parser="${e=>Number(e.replace(/[^0-9]/g,""))}"
      .serializer="${(e,t)=>parseInt(e,8)}"
      .deserializer="${(e,t)=>new Number(e)}"
      .modelValue="${1234567890}"
    ></lion-input>
    <h-output .show="${["modelValue","serializedValue"]}"></h-output>
  `,p=()=>e`
    <lion-input
      label="Date Example"
      help-text="Uses .preprocessor to prevent digits"
      .preprocessor="${e=>e.replace(/[0-9]/g,"")}"
    ></lion-input>
    <h-output .show="${["modelValue"]}"></h-output>
  `,i=()=>e`
    <lion-input
      label="Live Format"
      .modelValue="${new t("+31")}"
      help-text="Uses .preprocessor to format during typing"
      .preprocessor="${(e,{currentCaretIndex:t,prevViewValue:o})=>r(e,{regionCode:"NL",formatStrategy:"international",currentCaretIndex:t,prevViewValue:o})}"
    ></lion-input>
    <h-output .show="${["modelValue"]}"></h-output>
  `,m=document,u=[{key:"parser",story:o},{key:"unparseable",story:s},{key:"formatters",story:a},{key:"deserializers",story:l},{key:"preprocessors",story:p},{key:"liveFormatters",story:i}];let n=!1;for(const e of u){const t=m.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,n=!0,Object.assign(t,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}n&&(customElements.get("mdjs-preview")||import("./a7b4f51b.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{l as deserializers,a as formatters,i as liveFormatters,o as parser,p as preprocessors,s as unparseable};
