const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.DSVRgKCR.js","_astro/node-tools_providence-analytics_overview.BxIihMx7.js","_astro/lit-element.jD9bOQKo.js","_astro/lit-html.DtZEZPQ5.js","_astro/unsafe-html.DgrA3nwU.js","_astro/directive.BO6BEpVC.js","_astro/define.DNIVKtom.js"])))=>i.map(i=>d[i]);
import{_ as i}from"./preload-helper.Cj2JEybs.js";import"./node-tools_providence-analytics_overview.BxIihMx7.js";import"./lit-element.jD9bOQKo.js";import{x as r}from"./lit-html.DtZEZPQ5.js";import"./unsafe-html.DgrA3nwU.js";import"./lion-input-email.CTb8Wu_1.js";import{V as s}from"./Validator.DAOhFpDH.js";const m=()=>r`
  <lion-input-email .modelValue="${"foo"}" label="Email"></lion-input-email>
`,n=()=>{class e extends s{static get validatorName(){return"GmailOnly"}execute(a){let o=!1;return a.indexOf("gmail.com")===-1&&(o=!0),o}static async getMessage(){return"You can only use gmail.com email addresses."}}return r`
    <lion-input-email
      .modelValue="${"foo@bar.com"}"
      .validators="${[new e]}"
      label="Email"
    ></lion-input-email>
  `},u=document,d=[{key:"faultyPrefilled",story:m},{key:"customValidator",story:n}];let l=!1;for(const e of d){const t=u.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,l=!0,Object.assign(t,{simulatorUrl:"/next/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}l&&(customElements.get("mdjs-preview")||i(()=>import("./define.DSVRgKCR.js"),__vite__mapDeps([0,1,2,3,4,5])),customElements.get("mdjs-story")||i(()=>import("./define.DNIVKtom.js"),__vite__mapDeps([6,2,3])));export{n as customValidator,m as faultyPrefilled};
