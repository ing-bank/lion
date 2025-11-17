const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.DYUong5B.js","_astro/node-tools_providence-analytics_overview.LFFQBZzG.js","_astro/lit-element.qDHKJJma.js","_astro/lit-html.C7L4dwLU.js","_astro/unsafe-html.J0GGe2Q7.js","_astro/directive.CGE4aKEl.js","_astro/define.m2CvvXyF.js"])))=>i.map(i=>d[i]);
import{_ as r}from"./preload-helper.4zY6-HO4.js";import"./node-tools_providence-analytics_overview.LFFQBZzG.js";import"./lit-element.qDHKJJma.js";import{x as o}from"./lit-html.C7L4dwLU.js";import"./unsafe-html.J0GGe2Q7.js";import{L as n}from"./lion-switch.BJ-Nlv46.js";import"./sb-action-logger.2lH_jUdd.js";import{V as a}from"./Validator.DAOhFpDH.js";import"./directive.CGE4aKEl.js";import"./InteractionStateMixin.DC1PvWzb.js";import"./dedupeMixin.6XPTJgK8.js";import"./LocalizeMixin.VYu75dkK.js";import"./directive-helpers.CLllgGgm.js";import"./async-directive.CHVe8p0E.js";import"./getLocalizeManager.W5d_ICRU.js";import"./index.BNCfcFQh.js";import"./lazifyInstantiation.CgYLRMC3.js";import"./DisabledMixin.Bm1nsErI.js";import"./DisabledWithTabIndexMixin.DiSGvuwH.js";import"./ChoiceInputMixin.BjGWftzC.js";import"./LionField.gZkYIwXF.js";const m=()=>o`<lion-switch label="Label" disabled></lion-switch>`;class l extends a{static get validatorName(){return"IsTrue"}execute(t){return!t.checked}static async getMessage(){return"You won't get the latest news!"}}class c extends n{static get validationTypes(){return[...super.validationTypes,"info"]}_showFeedbackConditionFor(t,i){return t==="info"?!0:super._showFeedbackConditionFor(t,i)}}customElements.define("custom-switch",c);const d=()=>o`
  <custom-switch
    name="newsletterCheck"
    label="Subscribe to newsletter"
    .validators="${[new l(null,{type:"info"})]}"
  ></custom-switch>
`,u=({shadowRoot:e})=>o`
    <lion-switch
      label="Label"
      @checked-changed="${t=>{e.querySelector("sb-action-logger").log(`Current value: ${t.target.checked}`)}}"
    >
    </lion-switch>
    <sb-action-logger></sb-action-logger>
  `,p=document,y=[{key:"HtmlStory38",story:m},{key:"validation",story:d},{key:"handler",story:u}];let s=!1;for(const e of y){const t=p.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,s=!0,Object.assign(t,{simulatorUrl:"/next/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}s&&(customElements.get("mdjs-preview")||r(()=>import("./define.DYUong5B.js"),__vite__mapDeps([0,1,2,3,4,5])),customElements.get("mdjs-story")||r(()=>import("./define.m2CvvXyF.js"),__vite__mapDeps([6,2,3])));export{m as HtmlStory38,u as handler,d as validation};
