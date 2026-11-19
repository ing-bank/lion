const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.BWpRLYnc.js","_astro/MdJsPreview.CainKAmn.js","_astro/lit-element.B1EQMsFJ.js","_astro/lit-html.BX7rm8u-.js","_astro/dedupeMixin.6XPTJgK8.js","_astro/LionAccordion.CCw3hAmZ.js","_astro/lit-element.BOikny4r.js","_astro/uuid.DjYKNjre.js","_astro/define.BPRa0k46.js"])))=>i.map(i=>d[i]);
import{_ as r}from"./preload-helper.DOA02mLT.js";import"./MdJsPreview.CainKAmn.js";import"./lit-element.B1EQMsFJ.js";import{b as i}from"./lit-html.BX7rm8u-.js";import"./node-tools_providence-analytics_overview.BQH7j7jT.js";import"./lion-input-email.D3o91IJz.js";import{V as s}from"./Validator.DAOhFpDH.js";const n=()=>i`
  <lion-input-email .modelValue="${"foo"}" label="Email"></lion-input-email>
`,m=()=>{class e extends s{static get validatorName(){return"GmailOnly"}execute(l){let o=!1;return l.indexOf("gmail.com")===-1&&(o=!0),o}static async getMessage(){return"You can only use gmail.com email addresses."}}return i`
    <lion-input-email
      .modelValue="${"foo@bar.com"}"
      .validators="${[new e]}"
      label="Email"
    ></lion-input-email>
  `},u=document,d=[{key:"faultyPrefilled",story:n},{key:"customValidator",story:m}];let a=!1;for(const e of d){const t=u.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,a=!0,Object.assign(t,{simulatorUrl:"/next-preview/feat-lion-playground-rebased/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}a&&(customElements.get("mdjs-preview")||r(()=>import("./define.BWpRLYnc.js"),__vite__mapDeps([0,1,2,3,4,5,6,7])),customElements.get("mdjs-story")||r(()=>import("./define.BPRa0k46.js"),__vite__mapDeps([8,2,3])));export{m as customValidator,n as faultyPrefilled};
