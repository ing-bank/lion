import"./f1151d68.js";import{x as e}from"./b8bc2eda.js";import"./6638bb86.js";import{L as t}from"./6c74574c.js";import"./c3bcd538.js";import{V as s}from"./4dc0ac82.js";import"./4abf0ca8.js";import"./dc2f5f5a.js";import"./7c882590.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./c48d90f3.js";import"./be5f2fd3.js";import"./dcadf410.js";import"./143fde17.js";import"./6722e641.js";import"./5516584c.js";import"./18551691.js";import"./7eab6f7c.js";const o=()=>e`<lion-switch label="Label" disabled></lion-switch>`;class r extends s{static get validatorName(){return"IsTrue"}execute(e){return!e.checked}static async getMessage(){return"You won't get the latest news!"}}customElements.define("custom-switch",class extends t{static get validationTypes(){return[...super.validationTypes,"info"]}_showFeedbackConditionFor(e,t){return"info"===e||super._showFeedbackConditionFor(e,t)}});const i=()=>e`
  <custom-switch
    name="newsletterCheck"
    label="Subscribe to newsletter"
    .validators="${[new r(null,{type:"info"})]}"
  ></custom-switch>
`,a=({shadowRoot:t})=>e`
    <lion-switch
      label="Label"
      @model-value-changed="${e=>{t.querySelector("sb-action-logger").log(`Current value: ${e.target.checked}`)}}"
    >
    </lion-switch>
    <sb-action-logger></sb-action-logger>
  `,n=document,c=[{key:"HtmlStory0",story:o},{key:"validation",story:i},{key:"handler",story:a}];let m=!1;for(const e of c){const t=n.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,m=!0,Object.assign(t,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}m&&(customElements.get("mdjs-preview")||import("./e90784d0.js"),customElements.get("mdjs-story")||import("./0defd61d.js"));export{o as HtmlStory0,a as handler,i as validation};
