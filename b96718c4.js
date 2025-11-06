import"./24f95583.js";import{x as t}from"./b4be29f1.js";import"./05905ff1.js";import"./c7db7091.js";import"./09750da9.js";import"./c2aef983.js";import"./7077221a.js";import"./c6fab747.js";import"./dc2f5f5a.js";import"./d45984a3.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./4cc99b59.js";import"./19d2607c.js";import"./afb8834e.js";import"./143fde17.js";import"./f12ecf0e.js";import"./5287c897.js";import"./5516584c.js";const i=()=>t`
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
</lion-input>`,r=document,a=[{key:"label",story:i},{key:"HtmlStory0",story:o},{key:"HtmlStory1",story:e},{key:"HtmlStory2",story:s},{key:"HtmlStory3",story:n},{key:"HtmlStory4",story:l}];let m=!1;for(const t of a){const i=r.querySelector(`[mdjs-story-name="${t.key}"]`);i&&(i.story=t.story,i.key=t.key,m=!0,Object.assign(i,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}m&&(customElements.get("mdjs-preview")||import("./a7b4f51b.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{o as HtmlStory0,e as HtmlStory1,s as HtmlStory2,n as HtmlStory3,l as HtmlStory4,i as label};
