const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.BWpRLYnc.js","_astro/MdJsPreview.CainKAmn.js","_astro/lit-element.B1EQMsFJ.js","_astro/lit-html.BX7rm8u-.js","_astro/dedupeMixin.6XPTJgK8.js","_astro/LionAccordion.CCw3hAmZ.js","_astro/lit-element.BOikny4r.js","_astro/uuid.DjYKNjre.js","_astro/define.BPRa0k46.js"])))=>i.map(i=>d[i]);
import{_ as s}from"./preload-helper.DOA02mLT.js";import"./MdJsPreview.CainKAmn.js";import"./lit-element.B1EQMsFJ.js";import{b as o}from"./lit-html.BX7rm8u-.js";import"./node-tools_providence-analytics_overview.BQH7j7jT.js";import"./lion-switch.Boxha07D.js";import"./sb-action-logger.CbfRp3mN.js";import{V as i}from"./Validator.DAOhFpDH.js";import{L as a}from"./LionSwitch.DdfmWRoh.js";const l=()=>o`<lion-switch label="Label" disabled></lion-switch>`;class c extends i{static get validatorName(){return"IsTrue"}execute(e){return!e.checked}static async getMessage(){return"You won't get the latest news!"}}class m extends a{static get validationTypes(){return[...super.validationTypes,"info"]}_showFeedbackConditionFor(e,n){return e==="info"?!0:super._showFeedbackConditionFor(e,n)}}customElements.define("custom-switch",m);const d=()=>o`
  <custom-switch
    name="newsletterCheck"
    label="Subscribe to newsletter"
    .validators="${[new c(null,{type:"info"})]}"
  ></custom-switch>
`,u=({shadowRoot:t})=>o`
    <lion-switch
      label="Label"
      @model-value-changed="${e=>{t.querySelector("sb-action-logger").log(`Current value: ${e.target.checked}`)}}"
    >
    </lion-switch>
    <sb-action-logger></sb-action-logger>
  `,y=document,g=[{key:"HtmlStory47",story:l},{key:"validation",story:d},{key:"handler",story:u}];let r=!1;for(const t of g){const e=y.querySelector(`[mdjs-story-name="${t.key}"]`);e&&(e.story=t.story,e.key=t.key,r=!0,Object.assign(e,{simulatorUrl:"/next-preview/feat-lion-playground-rebased/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}r&&(customElements.get("mdjs-preview")||s(()=>import("./define.BWpRLYnc.js"),__vite__mapDeps([0,1,2,3,4,5,6,7])),customElements.get("mdjs-story")||s(()=>import("./define.BPRa0k46.js"),__vite__mapDeps([8,2,3])));export{l as HtmlStory47,u as handler,d as validation};
