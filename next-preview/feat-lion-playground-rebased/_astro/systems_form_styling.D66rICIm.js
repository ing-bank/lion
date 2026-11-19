const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.BWpRLYnc.js","_astro/MdJsPreview.CainKAmn.js","_astro/lit-element.B1EQMsFJ.js","_astro/lit-html.BX7rm8u-.js","_astro/dedupeMixin.6XPTJgK8.js","_astro/LionAccordion.CCw3hAmZ.js","_astro/lit-element.BOikny4r.js","_astro/uuid.DjYKNjre.js","_astro/define.BPRa0k46.js"])))=>i.map(i=>d[i]);
import{_ as e}from"./preload-helper.DOA02mLT.js";import"./MdJsPreview.CainKAmn.js";import"./lit-element.B1EQMsFJ.js";import{b as t}from"./lit-html.BX7rm8u-.js";import"./node-tools_providence-analytics_overview.BQH7j7jT.js";import"./lion-input.B6pwrbDb.js";import"./lion-button.D2RP6o39.js";const l=()=>t`
  <lion-input>
    <label slot="label"> Label with <b>html tag</b> inside </label>
  </lion-input>
`,r=()=>t`<lion-input label="Prefix">
  <div slot="prefix" data-description>[prefix]</div>
</lion-input>`,s=()=>t`<lion-input label="Suffix">
  <div slot="suffix" data-description>[suffix]</div>
</lion-input>`,a=()=>t`<lion-input label="Before">
  <div slot="before" data-description>[before]</div>
</lion-input>`,m=()=>t`<lion-input label="Amount">
  <div slot="after" data-description>EUR</div>
</lion-input>
<lion-input label="Percentage">
  <div slot="after" data-description>%</div>
</lion-input>`,d=()=>t`<lion-input label="Prefix and suffix">
  <lion-button slot="prefix">prefix</lion-button>
  <lion-button slot="suffix">suffix</lion-button>
</lion-input>`,u=document,y=[{key:"label",story:l},{key:"HtmlStory0",story:r},{key:"HtmlStory1",story:s},{key:"HtmlStory2",story:a},{key:"HtmlStory3",story:m},{key:"HtmlStory4",story:d}];let n=!1;for(const i of y){const o=u.querySelector(`[mdjs-story-name="${i.key}"]`);o&&(o.story=i.story,o.key=i.key,n=!0,Object.assign(o,{simulatorUrl:"/next-preview/feat-lion-playground-rebased/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}n&&(customElements.get("mdjs-preview")||e(()=>import("./define.BWpRLYnc.js"),__vite__mapDeps([0,1,2,3,4,5,6,7])),customElements.get("mdjs-story")||e(()=>import("./define.BPRa0k46.js"),__vite__mapDeps([8,2,3])));export{r as HtmlStory0,s as HtmlStory1,a as HtmlStory2,m as HtmlStory3,d as HtmlStory4,l as label};
