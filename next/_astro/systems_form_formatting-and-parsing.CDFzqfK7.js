const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.DYUong5B.js","_astro/node-tools_providence-analytics_overview.LFFQBZzG.js","_astro/lit-element.qDHKJJma.js","_astro/lit-html.C7L4dwLU.js","_astro/unsafe-html.J0GGe2Q7.js","_astro/directive.CGE4aKEl.js","_astro/define.m2CvvXyF.js"])))=>i.map(i=>d[i]);
import{_ as s}from"./preload-helper.4zY6-HO4.js";import"./node-tools_providence-analytics_overview.LFFQBZzG.js";import"./lit-element.qDHKJJma.js";import{x as o}from"./lit-html.C7L4dwLU.js";import"./unsafe-html.J0GGe2Q7.js";import"./lion-input.BRs8ODeY.js";import"./h-output.K2J3wTZi.js";import{U as l}from"./InteractionStateMixin.DC1PvWzb.js";import{l as p}from"./preprocessors.BqZFnKWs.js";import"./directive.CGE4aKEl.js";import"./LionInput.B2KYRD9B.js";import"./NativeTextFieldMixin.CsE2kjU6.js";import"./dedupeMixin.6XPTJgK8.js";import"./LionField.gZkYIwXF.js";import"./LionFieldset.Cfuf77fc.js";import"./FormGroupMixin.EcgVGa5A.js";import"./FormRegistrarMixin.BUWicw9X.js";import"./Validator.DAOhFpDH.js";import"./DisabledMixin.Bm1nsErI.js";import"./LocalizeMixin.VYu75dkK.js";import"./directive-helpers.CLllgGgm.js";import"./async-directive.CHVe8p0E.js";import"./getLocalizeManager.W5d_ICRU.js";import"./index.BNCfcFQh.js";import"./lazifyInstantiation.CgYLRMC3.js";import"./PhoneUtilManager.DkvpFzJF.js";const m=()=>o`
  <lion-input
    label="Number Example"
    help-text="Uses .parser to create model values from view values"
    .parser="${e=>Number(e)}"
    .modelValue="${1234567890}"
    @model-value-changed="${({target:e})=>console.log(e)}"
  ></lion-input>
  <h-output .show="${["modelValue"]}"></h-output>
`,n=()=>o`
  <lion-input
    label="Number Example"
    help-text="Uses .parser and return undefined if Number() cannot parse"
    .parser="${e=>Number(e)||void 0}"
    value="${"1234abc567890"}"
  ></lion-input>
  <h-output .show="${["modelValue"]}"></h-output>
`,u=()=>o`
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
      .serializer="${(t,a)=>parseInt(t,8)}"
      .deserializer="${(t,a)=>new Number(t)}"
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
      .modelValue="${new l("+31")}"
      help-text="Uses .preprocessor to format during typing"
      .preprocessor="${(e,{currentCaretIndex:r,prevViewValue:t})=>p(e,{regionCode:"NL",formatStrategy:"international",currentCaretIndex:r,prevViewValue:t})}"
    ></lion-input>
    <h-output .show="${["modelValue"]}"></h-output>
  `,h=document,f=[{key:"parser",story:m},{key:"unparseable",story:n},{key:"formatters",story:u},{key:"deserializers",story:d},{key:"preprocessors",story:c},{key:"liveFormatters",story:y}];let i=!1;for(const e of f){const r=h.querySelector(`[mdjs-story-name="${e.key}"]`);r&&(r.story=e.story,r.key=e.key,i=!0,Object.assign(r,{simulatorUrl:"/next/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}i&&(customElements.get("mdjs-preview")||s(()=>import("./define.DYUong5B.js"),__vite__mapDeps([0,1,2,3,4,5])),customElements.get("mdjs-story")||s(()=>import("./define.m2CvvXyF.js"),__vite__mapDeps([6,2,3])));export{d as deserializers,u as formatters,y as liveFormatters,m as parser,c as preprocessors,n as unparseable};
