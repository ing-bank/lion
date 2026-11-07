const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.D5IFK1jp.js","_astro/MdJsPreview.B62up6PK.js","_astro/lit-element.DxRhnkit.js","_astro/lit-html.BX7rm8u-.js","_astro/dedupeMixin.6XPTJgK8.js","_astro/lit-element.BOikny4r.js","_astro/uuid.DjYKNjre.js","_astro/define.DBgp7shK.js"])))=>i.map(i=>d[i]);
import{_ as i}from"./preload-helper.CVfkMyKi.js";import"./MdJsPreview.B62up6PK.js";import"./lit-element.DxRhnkit.js";import{b as r}from"./lit-html.BX7rm8u-.js";import"./unsafe-html.FHlAasnX.js";import"./lion-input-email.B-Yq3FMQ.js";import{V as s}from"./Validator.DAOhFpDH.js";const m=()=>r`
  <lion-input-email .modelValue="${"foo"}" label="Email"></lion-input-email>
`,n=()=>{class e extends s{static get validatorName(){return"GmailOnly"}execute(a){let o=!1;return a.indexOf("gmail.com")===-1&&(o=!0),o}static async getMessage(){return"You can only use gmail.com email addresses."}}return r`
    <lion-input-email
      .modelValue="${"foo@bar.com"}"
      .validators="${[new e]}"
      label="Email"
    ></lion-input-email>
  `},u=document,d=[{key:"faultyPrefilled",story:m},{key:"customValidator",story:n}];let l=!1;for(const e of d){const t=u.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,l=!0,Object.assign(t,{simulatorUrl:"/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}l&&(customElements.get("mdjs-preview")||i(()=>import("./define.D5IFK1jp.js"),__vite__mapDeps([0,1,2,3,4,5,6])),customElements.get("mdjs-story")||i(()=>import("./define.DBgp7shK.js"),__vite__mapDeps([7,2,3])));export{n as customValidator,m as faultyPrefilled};
