const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.DSVRgKCR.js","_astro/node-tools_providence-analytics_overview.BxIihMx7.js","_astro/lit-element.jD9bOQKo.js","_astro/lit-html.DtZEZPQ5.js","_astro/unsafe-html.DgrA3nwU.js","_astro/directive.BO6BEpVC.js","_astro/define.DNIVKtom.js"])))=>i.map(i=>d[i]);
import{_ as s}from"./preload-helper.Cj2JEybs.js";import"./node-tools_providence-analytics_overview.BxIihMx7.js";import"./lit-element.jD9bOQKo.js";import{x as o}from"./lit-html.DtZEZPQ5.js";import"./unsafe-html.DgrA3nwU.js";import"./lion-input.CWsta8VT.js";import"./h-output.-QbYxmpZ.js";import{U as n}from"./InteractionStateMixin.BpvzA9JQ.js";import{l as i}from"./preprocessors.Yg1W8qSj.js";const u=()=>o`
  <lion-input
    label="Number Example"
    help-text="Uses .parser to create model values from view values"
    .parser="${e=>Number(e)}"
    .modelValue="${1234567890}"
    @model-value-changed="${({target:e})=>console.log(e)}"
  ></lion-input>
  <h-output .show="${["modelValue"]}"></h-output>
`,p=()=>o`
  <lion-input
    label="Number Example"
    help-text="Uses .parser and return undefined if Number() cannot parse"
    .parser="${e=>Number(e)||void 0}"
    value="${"1234abc567890"}"
  ></lion-input>
  <h-output .show="${["modelValue"]}"></h-output>
`,m=()=>o`
    <lion-input
      label="Number Example"
      help-text="Uses .formatter to create view value"
      .parser="${r=>Number(r.replace(/[^0-9]/g,""))}"
      .formatter="${(r,t)=>typeof r!="number"?t.formattedValue:new Intl.NumberFormat("en-GB").format(r)}"
      .modelValue="${1234567890}"
    >
    </lion-input>
    <h-output .show="${["modelValue","formattedValue"]}"></h-output>
  `,d=()=>o`
    <lion-input
      label="Date Example"
      help-text="Uses .(de)serializer to restore serialized modelValues"
      .parser="${t=>Number(t.replace(/[^0-9]/g,""))}"
      .serializer="${(t,l)=>parseInt(t,8)}"
      .deserializer="${(t,l)=>new Number(t)}"
      .modelValue="${1234567890}"
    ></lion-input>
    <h-output .show="${["modelValue","serializedValue"]}"></h-output>
  `,c=()=>o`
    <lion-input
      label="Date Example"
      help-text="Uses .preprocessor to prevent digits"
      .preprocessor="${r=>r.replace(/[0-9]/g,"")}"
    ></lion-input>
    <h-output .show="${["modelValue"]}"></h-output>
  `,y=()=>o`
    <lion-input
      label="Live Format"
      .modelValue="${new n("+31")}"
      help-text="Uses .preprocessor to format during typing"
      .preprocessor="${(e,{currentCaretIndex:r,prevViewValue:t})=>i(e,{regionCode:"NL",formatStrategy:"international",currentCaretIndex:r,prevViewValue:t})}"
    ></lion-input>
    <h-output .show="${["modelValue"]}"></h-output>
  `,h=document,f=[{key:"parser",story:u},{key:"unparseable",story:p},{key:"formatters",story:m},{key:"deserializers",story:d},{key:"preprocessors",story:c},{key:"liveFormatters",story:y}];let a=!1;for(const e of f){const r=h.querySelector(`[mdjs-story-name="${e.key}"]`);r&&(r.story=e.story,r.key=e.key,a=!0,Object.assign(r,{simulatorUrl:"/next/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}a&&(customElements.get("mdjs-preview")||s(()=>import("./define.DSVRgKCR.js"),__vite__mapDeps([0,1,2,3,4,5])),customElements.get("mdjs-story")||s(()=>import("./define.DNIVKtom.js"),__vite__mapDeps([6,2,3])));export{d as deserializers,m as formatters,y as liveFormatters,u as parser,c as preprocessors,p as unparseable};
