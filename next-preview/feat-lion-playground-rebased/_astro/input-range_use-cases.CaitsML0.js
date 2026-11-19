const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.BWpRLYnc.js","_astro/MdJsPreview.CainKAmn.js","_astro/lit-element.B1EQMsFJ.js","_astro/lit-html.BX7rm8u-.js","_astro/dedupeMixin.6XPTJgK8.js","_astro/LionAccordion.CCw3hAmZ.js","_astro/lit-element.BOikny4r.js","_astro/uuid.DjYKNjre.js","_astro/define.BPRa0k46.js"])))=>i.map(i=>d[i]);
import{_ as o}from"./preload-helper.DOA02mLT.js";import"./MdJsPreview.CainKAmn.js";import"./lit-element.B1EQMsFJ.js";import{b as t}from"./lit-html.BX7rm8u-.js";import"./node-tools_providence-analytics_overview.BQH7j7jT.js";import"./lion-input-range.BmY3GVrW.js";const i=()=>t`<style>
  lion-input-range {
    max-width: 400px;
  }
</style>
<lion-input-range
  min="0"
  max="100"
  .modelValue="${50}"
  unit="%"
  label="Percentage"
></lion-input-range>`,r=()=>t`<lion-input-range
  style="max-width: 400px;"
  min="200"
  max="500"
  step="50"
  .modelValue="${300}"
  label="Input range"
  help-text="This slider uses increments of 50"
></lion-input-range>`,m=()=>t`<lion-input-range
  style="max-width: 400px;"
  no-min-max-labels
  min="0"
  max="100"
  label="Input range"
></lion-input-range>`,s=()=>t`<lion-input-range
  min="0"
  max="11"
  min-label="less than 1 item"
  max-label="more than 10 items"
  .modelValue="${4}"
  unit="Items"
  label="Items"
></lion-input-range>`,a=()=>t`<lion-input-range
  style="max-width: 400px;"
  disabled
  min="200"
  max="500"
  .modelValue="${300}"
  label="Input range"
></lion-input-range>`,y=document,u=[{key:"HtmlStory16",story:i},{key:"HtmlStory17",story:r},{key:"HtmlStory18",story:m},{key:"HtmlStory19",story:s},{key:"HtmlStory20",story:a}];let l=!1;for(const n of u){const e=y.querySelector(`[mdjs-story-name="${n.key}"]`);e&&(e.story=n.story,e.key=n.key,l=!0,Object.assign(e,{simulatorUrl:"/next-preview/feat-lion-playground-rebased/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}l&&(customElements.get("mdjs-preview")||o(()=>import("./define.BWpRLYnc.js"),__vite__mapDeps([0,1,2,3,4,5,6,7])),customElements.get("mdjs-story")||o(()=>import("./define.BPRa0k46.js"),__vite__mapDeps([8,2,3])));export{i as HtmlStory16,r as HtmlStory17,m as HtmlStory18,s as HtmlStory19,a as HtmlStory20};
