import"./24f95583.js";import{x as e}from"./b4be29f1.js";import"./05905ff1.js";import"./5efc6cba.js";import{l as t}from"./c85cfbca.js";import"./4cc99b59.js";import"./19d2607c.js";import"./afb8834e.js";import"./d45984a3.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./dc2f5f5a.js";import"./88185952.js";import"./24c57689.js";import"./10e1d49e.js";import"./4a239ef1.js";import"./9157d4cc.js";import"./7902d8e0.js";import"./143fde17.js";import"./298b3bc0.js";import"./e49751c9.js";import"./4dc0ac82.js";import"./459b1eec.js";import"./cc85a6f4.js";import"./48ac1cb5.js";import"./b7f85193.js";import"./622cc741.js";import"./a06c5caf.js";t();const o=()=>e`<lion-input-stepper name="year">
  <label slot="label">How old is the existence?</label>
  <div slot="after" data-description>In Billion Years</div>
</lion-input-stepper>`,s=()=>e`<lion-input-stepper
  label="Amount of oranges"
  min="100"
  step="100"
  name="value"
  value="200"
></lion-input-stepper>`,i=()=>e`<lion-input-stepper
  label="Amount of oranges"
  min="200"
  max="500"
  name="value"
  step="100"
  value="200"
></lion-input-stepper>`,r=()=>e`
    <lion-input-stepper
      label="Order"
      min="1"
      max="10"
      name="value"
      .valueTextMapping="${{1:"first",2:"second",3:"third",4:"fourth",5:"fifth",6:"sixth",7:"seventh",8:"eighth",9:"ninth",10:"tenth"}}"
    ></lion-input-stepper>
  `,n=()=>e`
    <lion-input-stepper
      label="Amount of oranges"
      min="0"
      max="5000"
      step="100"
      name="value"
      .formatOptions="${{locale:"nl-NL"}}"
      .modelValue="${1200}"
    ></lion-input-stepper>
  `,p=()=>e`<lion-input-stepper
  label="Amount of oranges"
  min="1"
  max="100"
  step="10"
  name="value"
  alignToStep
  value="55"
></lion-input-stepper>`,m=document,a=[{key:"HtmlStory0",story:o},{key:"HtmlStory1",story:s},{key:"HtmlStory2",story:i},{key:"valueTextMapping",story:r},{key:"formatting",story:n},{key:"HtmlStory3",story:p}];let l=!1;for(const e of a){const t=m.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,l=!0,Object.assign(t,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}l&&(customElements.get("mdjs-preview")||import("./a7b4f51b.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{o as HtmlStory0,s as HtmlStory1,i as HtmlStory2,p as HtmlStory3,n as formatting,r as valueTextMapping};
