const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.DAMBs0Wv.js","_astro/node-tools_providence-analytics_overview.DzUX1qVL.js","_astro/lit-element.qDHKJJma.js","_astro/lit-html.C7L4dwLU.js","_astro/unsafe-html.J0GGe2Q7.js","_astro/directive.CGE4aKEl.js","_astro/define.m2CvvXyF.js"])))=>i.map(i=>d[i]);
import{_ as r}from"./preload-helper.4zY6-HO4.js";import"./node-tools_providence-analytics_overview.DzUX1qVL.js";import"./lit-element.qDHKJJma.js";import{x as o}from"./lit-html.C7L4dwLU.js";import"./unsafe-html.J0GGe2Q7.js";import"./lion-switch.CrUOGprs.js";import"./sb-action-logger.2lH_jUdd.js";import{V as n}from"./Validator.DAOhFpDH.js";import{L as a}from"./LionSwitch.CzhSIK6Z.js";import"./directive.CGE4aKEl.js";import"./InteractionStateMixin.BJhuwH0C.js";import"./dedupeMixin.6XPTJgK8.js";import"./LocalizeMixin.VYu75dkK.js";import"./directive-helpers.CLllgGgm.js";import"./async-directive.CHVe8p0E.js";import"./getLocalizeManager.W5d_ICRU.js";import"./index.BNCfcFQh.js";import"./lazifyInstantiation.CgYLRMC3.js";import"./DisabledMixin.Bm1nsErI.js";import"./uuid.DjYKNjre.js";import"./DisabledWithTabIndexMixin.DiSGvuwH.js";import"./ChoiceInputMixin.D_7bdik6.js";import"./LionField.BWTJfyXr.js";const m=()=>o`<lion-switch label="Label" disabled></lion-switch>`;class l extends n{static get validatorName(){return"IsTrue"}execute(t){return!t.checked}static async getMessage(){return"You won't get the latest news!"}}class c extends a{static get validationTypes(){return[...super.validationTypes,"info"]}_showFeedbackConditionFor(t,s){return t==="info"?!0:super._showFeedbackConditionFor(t,s)}}customElements.define("custom-switch",c);const d=()=>o`
  <custom-switch
    name="newsletterCheck"
    label="Subscribe to newsletter"
    .validators="${[new l(null,{type:"info"})]}"
  ></custom-switch>
`,u=({shadowRoot:e})=>o`
    <lion-switch
      label="Label"
      @model-value-changed="${t=>{e.querySelector("sb-action-logger").log(`Current value: ${t.target.checked}`)}}"
    >
    </lion-switch>
    <sb-action-logger></sb-action-logger>
  `,p=document,y=[{key:"HtmlStory41",story:m},{key:"validation",story:d},{key:"handler",story:u}];let i=!1;for(const e of y){const t=p.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,i=!0,Object.assign(t,{simulatorUrl:"/next/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}i&&(customElements.get("mdjs-preview")||r(()=>import("./define.DAMBs0Wv.js"),__vite__mapDeps([0,1,2,3,4,5])),customElements.get("mdjs-story")||r(()=>import("./define.m2CvvXyF.js"),__vite__mapDeps([6,2,3])));export{m as HtmlStory41,u as handler,d as validation};
