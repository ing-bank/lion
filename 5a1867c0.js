import"./f1151d68.js";import{x as t}from"./b8bc2eda.js";import"./6638bb86.js";import"./822ba771.js";import"./24edfe3a.js";import"./45058e5d.js";import"./57941646.js";import"./4abf0ca8.js";import"./dc2f5f5a.js";import"./7c882590.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./c48d90f3.js";import"./be5f2fd3.js";import"./dcadf410.js";import"./143fde17.js";import"./6722e641.js";import"./7eab6f7c.js";import"./fd5951b6.js";import"./5516584c.js";const i=()=>t`
  <lion-input>
    <label slot="label"> Label with <b>html tag</b> inside </label>
  </lion-input>
`,o=()=>t`<lion-input label="Prefix">
  <div slot="prefix" data-description>[prefix]</div>
</lion-input>`,e=()=>t`<lion-input label="Suffix">
  <div slot="suffix" data-description>[suffix]</div>
</lion-input>`,s=()=>t`<lion-input label="Before">
  <div slot="before" data-description>[before]</div>
</lion-input>`,n=()=>t`<lion-input label="Amount">
  <div slot="after" data-description>EUR</div>
</lion-input>
<lion-input label="Percentage">
  <div slot="after" data-description>%</div>
</lion-input>`,l=()=>t`<lion-input label="Prefix and suffix">
  <lion-button slot="prefix">prefix</lion-button>
  <lion-button slot="suffix">suffix</lion-button>
</lion-input>`,r=document,a=[{key:"label",story:i},{key:"HtmlStory0",story:o},{key:"HtmlStory1",story:e},{key:"HtmlStory2",story:s},{key:"HtmlStory3",story:n},{key:"HtmlStory4",story:l}];let m=!1;for(const t of a){const i=r.querySelector(`[mdjs-story-name="${t.key}"]`);i&&(i.story=t.story,i.key=t.key,m=!0,Object.assign(i,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}m&&(customElements.get("mdjs-preview")||import("./e90784d0.js"),customElements.get("mdjs-story")||import("./0defd61d.js"));export{o as HtmlStory0,e as HtmlStory1,s as HtmlStory2,n as HtmlStory3,l as HtmlStory4,i as label};
