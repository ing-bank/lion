const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.D5IFK1jp.js","_astro/MdJsPreview.B62up6PK.js","_astro/lit-element.DxRhnkit.js","_astro/lit-html.BX7rm8u-.js","_astro/dedupeMixin.6XPTJgK8.js","_astro/lit-element.BOikny4r.js","_astro/uuid.DjYKNjre.js","_astro/define.DBgp7shK.js"])))=>i.map(i=>d[i]);
import{_ as l}from"./preload-helper.CVfkMyKi.js";import"./MdJsPreview.B62up6PK.js";import"./lit-element.DxRhnkit.js";import{b as t}from"./lit-html.BX7rm8u-.js";import"./unsafe-html.FHlAasnX.js";import"./lion-select.lOwS0ZcX.js";import{l as n}from"./loadDefaultFeedbackMessages.Dna2KIXH.js";n();const s=()=>t`<lion-select name="favoriteColor" label="Favorite color" .modelValue="${"hotpink"}">
  <select slot="input">
    <option selected value>Please select</option>
    <option value="red">Red</option>
    <option value="hotpink">Hotpink</option>
    <option value="teal">Teal</option>
  </select>
</lion-select>`,r=()=>t`<lion-select name="favoriteColor" label="Favorite color">
  <select slot="input">
    <option selected value>Please select</option>
    <option value="red">Red</option>
    <option value="hotpink" disabled>Hotpink</option>
    <option value="teal">Teal</option>
  </select>
</lion-select>`,a=()=>t`<lion-select name="favoriteColor" label="Favorite color" disabled>
  <select slot="input">
    <option selected value>Please select</option>
    <option value="red">Red</option>
    <option value="hotpink">Hotpink</option>
    <option value="teal">Teal</option>
  </select>
</lion-select>`,p=document,m=[{key:"HtmlStory36",story:s},{key:"HtmlStory37",story:r},{key:"HtmlStory38",story:a}];let i=!1;for(const o of m){const e=p.querySelector(`[mdjs-story-name="${o.key}"]`);e&&(e.story=o.story,e.key=o.key,i=!0,Object.assign(e,{simulatorUrl:"/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}i&&(customElements.get("mdjs-preview")||l(()=>import("./define.D5IFK1jp.js"),__vite__mapDeps([0,1,2,3,4,5,6])),customElements.get("mdjs-story")||l(()=>import("./define.DBgp7shK.js"),__vite__mapDeps([7,2,3])));export{s as HtmlStory36,r as HtmlStory37,a as HtmlStory38};
