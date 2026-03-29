const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.DSVRgKCR.js","_astro/node-tools_providence-analytics_overview.BxIihMx7.js","_astro/lit-element.jD9bOQKo.js","_astro/lit-html.DtZEZPQ5.js","_astro/unsafe-html.DgrA3nwU.js","_astro/directive.BO6BEpVC.js","_astro/define.DNIVKtom.js"])))=>i.map(i=>d[i]);
import{_ as n}from"./preload-helper.Cj2JEybs.js";import"./node-tools_providence-analytics_overview.BxIihMx7.js";import"./lit-element.jD9bOQKo.js";import{x as e}from"./lit-html.DtZEZPQ5.js";import"./unsafe-html.DgrA3nwU.js";import"./lion-input-stepper.BnfQM9Wk.js";import{l as r}from"./loadDefaultFeedbackMessages.G20iUcvC.js";r();const l=()=>e`<lion-input-stepper name="year">
  <label slot="label">How old is the existence?</label>
  <div slot="after" data-description>In Billion Years</div>
</lion-input-stepper>`,i=()=>e`<lion-input-stepper
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
></lion-input-stepper>`,m=()=>e`
    <lion-input-stepper
      label="Order"
      min="1"
      max="10"
      name="value"
      .valueTextMapping="${{1:"first",2:"second",3:"third",4:"fourth",5:"fifth",6:"sixth",7:"seventh",8:"eighth",9:"ninth",10:"tenth"}}"
    ></lion-input-stepper>
  `,p=()=>e`
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
></lion-input-stepper>`,y=document,d=[{key:"HtmlStory20",story:l},{key:"HtmlStory21",story:i},{key:"HtmlStory22",story:a},{key:"valueTextMapping",story:m},{key:"formatting",story:p},{key:"HtmlStory23",story:u}];let s=!1;for(const t of d){const o=y.querySelector(`[mdjs-story-name="${t.key}"]`);o&&(o.story=t.story,o.key=t.key,s=!0,Object.assign(o,{simulatorUrl:"/next/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}s&&(customElements.get("mdjs-preview")||n(()=>import("./define.DSVRgKCR.js"),__vite__mapDeps([0,1,2,3,4,5])),customElements.get("mdjs-story")||n(()=>import("./define.DNIVKtom.js"),__vite__mapDeps([6,2,3])));export{l as HtmlStory20,i as HtmlStory21,a as HtmlStory22,u as HtmlStory23,p as formatting,m as valueTextMapping};
