const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.BdbiuFq9.js","_astro/MdJsPreview.3BOxlSHn.js","_astro/lit-element.jD9bOQKo.js","_astro/lit-html.DtZEZPQ5.js","_astro/lit-element.BdYmZD4s.js","_astro/define.DNIVKtom.js"])))=>i.map(i=>d[i]);
import{_ as n}from"./preload-helper.CVfkMyKi.js";import"./MdJsPreview.3BOxlSHn.js";import"./lit-element.jD9bOQKo.js";import{x as e}from"./lit-html.DtZEZPQ5.js";import"./unsafe-html.DgrA3nwU.js";import"./lion-input-stepper.D3-ZFXAt.js";import{l as s}from"./loadDefaultFeedbackMessages.DKrgwlad.js";s();const i=()=>e`<lion-input-stepper name="year">
  <label slot="label">How old is the existence?</label>
  <div slot="after" data-description>In Billion Years</div>
</lion-input-stepper>`,r=()=>e`<lion-input-stepper
  label="Amount of oranges"
  min="100"
  step="100"
  name="value"
  value="200"
></lion-input-stepper>`,a=()=>e`<lion-input-stepper
  label="Amount of oranges"
  min="200"
  max="500"
  name="value"
  step="100"
  value="200"
></lion-input-stepper>`,p=()=>e`
    <lion-input-stepper
      label="Order"
      min="1"
      max="10"
      name="value"
      .valueTextMapping="${{1:"first",2:"second",3:"third",4:"fourth",5:"fifth",6:"sixth",7:"seventh",8:"eighth",9:"ninth",10:"tenth"}}"
    ></lion-input-stepper>
  `,m=()=>e`
    <lion-input-stepper
      label="Amount of oranges"
      min="0"
      max="5000"
      step="100"
      name="value"
      .formatOptions="${{locale:"nl-NL"}}"
      .modelValue="${1200}"
    ></lion-input-stepper>
  `,u=()=>e`<lion-input-stepper
  label="Amount of oranges"
  min="1"
  max="100"
  step="10"
  name="value"
  alignToStep
  value="55"
></lion-input-stepper>`,y=()=>e`<lion-input-stepper name="year" disabled value="10">
  <label slot="label">How old is the existence?</label>
  <div slot="after" data-description>In Billion Years</div>
</lion-input-stepper>`,d=()=>e`<lion-input-stepper name="year" readonly value="10">
  <label slot="label">How old is the existence?</label>
  <div slot="after" data-description>In Billion Years</div>
</lion-input-stepper>`,c=document,f=[{key:"HtmlStory22",story:i},{key:"HtmlStory23",story:r},{key:"HtmlStory24",story:a},{key:"valueTextMapping",story:p},{key:"formatting",story:m},{key:"HtmlStory25",story:u},{key:"HtmlStory26",story:y},{key:"HtmlStory27",story:d}];let l=!1;for(const t of f){const o=c.querySelector(`[mdjs-story-name="${t.key}"]`);o&&(o.story=t.story,o.key=t.key,l=!0,Object.assign(o,{simulatorUrl:"/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}l&&(customElements.get("mdjs-preview")||n(()=>import("./define.BdbiuFq9.js"),__vite__mapDeps([0,1,2,3,4])),customElements.get("mdjs-story")||n(()=>import("./define.DNIVKtom.js"),__vite__mapDeps([5,2,3])));export{i as HtmlStory22,r as HtmlStory23,a as HtmlStory24,u as HtmlStory25,y as HtmlStory26,d as HtmlStory27,m as formatting,p as valueTextMapping};
