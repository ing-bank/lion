const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.DSVRgKCR.js","_astro/node-tools_providence-analytics_overview.BxIihMx7.js","_astro/lit-element.jD9bOQKo.js","_astro/lit-html.DtZEZPQ5.js","_astro/unsafe-html.DgrA3nwU.js","_astro/directive.BO6BEpVC.js","_astro/define.DNIVKtom.js"])))=>i.map(i=>d[i]);
import{_ as s}from"./preload-helper.Cj2JEybs.js";import"./node-tools_providence-analytics_overview.BxIihMx7.js";import"./lit-element.jD9bOQKo.js";import{x as o}from"./lit-html.DtZEZPQ5.js";import"./unsafe-html.DgrA3nwU.js";import"./lion-switch.Cw2f7f2C.js";import"./sb-action-logger.Cj3BzsPh.js";import{V as i}from"./Validator.DAOhFpDH.js";import{L as a}from"./LionSwitch.D8FNuC-L.js";const l=()=>o`<lion-switch label="Label" disabled></lion-switch>`;class c extends i{static get validatorName(){return"IsTrue"}execute(e){return!e.checked}static async getMessage(){return"You won't get the latest news!"}}class m extends a{static get validationTypes(){return[...super.validationTypes,"info"]}_showFeedbackConditionFor(e,n){return e==="info"?!0:super._showFeedbackConditionFor(e,n)}}customElements.define("custom-switch",m);const d=()=>o`
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
  `,y=document,g=[{key:"HtmlStory41",story:l},{key:"validation",story:d},{key:"handler",story:u}];let r=!1;for(const t of g){const e=y.querySelector(`[mdjs-story-name="${t.key}"]`);e&&(e.story=t.story,e.key=t.key,r=!0,Object.assign(e,{simulatorUrl:"/next/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}r&&(customElements.get("mdjs-preview")||s(()=>import("./define.DSVRgKCR.js"),__vite__mapDeps([0,1,2,3,4,5])),customElements.get("mdjs-story")||s(()=>import("./define.DNIVKtom.js"),__vite__mapDeps([6,2,3])));export{l as HtmlStory41,u as handler,d as validation};
