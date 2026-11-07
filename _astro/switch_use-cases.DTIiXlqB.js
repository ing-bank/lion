const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.D5IFK1jp.js","_astro/MdJsPreview.B62up6PK.js","_astro/lit-element.DxRhnkit.js","_astro/lit-html.BX7rm8u-.js","_astro/dedupeMixin.6XPTJgK8.js","_astro/lit-element.BOikny4r.js","_astro/uuid.DjYKNjre.js","_astro/define.DBgp7shK.js"])))=>i.map(i=>d[i]);
import{_ as s}from"./preload-helper.CVfkMyKi.js";import"./MdJsPreview.B62up6PK.js";import"./lit-element.DxRhnkit.js";import{b as o}from"./lit-html.BX7rm8u-.js";import"./unsafe-html.FHlAasnX.js";import"./lion-switch.DLaPbfj6.js";import"./sb-action-logger.CbfRp3mN.js";import{V as n}from"./Validator.DAOhFpDH.js";import{L as a}from"./LionSwitch.D0pC4mK9.js";const l=()=>o`<lion-switch label="Label" disabled></lion-switch>`;class c extends n{static get validatorName(){return"IsTrue"}execute(e){return!e.checked}static async getMessage(){return"You won't get the latest news!"}}class m extends a{static get validationTypes(){return[...super.validationTypes,"info"]}_showFeedbackConditionFor(e,i){return e==="info"?!0:super._showFeedbackConditionFor(e,i)}}customElements.define("custom-switch",m);const d=()=>o`
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
  `,y=document,g=[{key:"HtmlStory47",story:l},{key:"validation",story:d},{key:"handler",story:u}];let r=!1;for(const t of g){const e=y.querySelector(`[mdjs-story-name="${t.key}"]`);e&&(e.story=t.story,e.key=t.key,r=!0,Object.assign(e,{simulatorUrl:"/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}r&&(customElements.get("mdjs-preview")||s(()=>import("./define.D5IFK1jp.js"),__vite__mapDeps([0,1,2,3,4,5,6])),customElements.get("mdjs-story")||s(()=>import("./define.DBgp7shK.js"),__vite__mapDeps([7,2,3])));export{l as HtmlStory47,u as handler,d as validation};
