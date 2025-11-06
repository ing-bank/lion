import"./24f95583.js";import{x as e}from"./b4be29f1.js";import"./05905ff1.js";import{L as t}from"./f7dedd2b.js";import"./dfb90d18.js";import{V as s}from"./4dc0ac82.js";import"./c6fab747.js";import"./dc2f5f5a.js";import"./d45984a3.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./4cc99b59.js";import"./19d2607c.js";import"./afb8834e.js";import"./143fde17.js";import"./5516584c.js";import"./ad6a1a36.js";import"./f12ecf0e.js";const o=()=>e`<lion-switch label="Label" disabled></lion-switch>`;class r extends s{static get validatorName(){return"IsTrue"}execute(e){return!e.checked}static async getMessage(){return"You won't get the latest news!"}}customElements.define("custom-switch",class extends t{static get validationTypes(){return[...super.validationTypes,"info"]}_showFeedbackConditionFor(e,t){return"info"===e||super._showFeedbackConditionFor(e,t)}});const i=()=>e`
  <custom-switch
    name="newsletterCheck"
    label="Subscribe to newsletter"
    .validators="${[new r(null,{type:"info"})]}"
  ></custom-switch>
`,a=({shadowRoot:t})=>e`
    <lion-switch
      label="Label"
      @checked-changed="${e=>{t.querySelector("sb-action-logger").log(`Current value: ${e.target.checked}`)}}"
    >
    </lion-switch>
    <sb-action-logger></sb-action-logger>
  `,n=document,c=[{key:"HtmlStory0",story:o},{key:"validation",story:i},{key:"handler",story:a}];let m=!1;for(const e of c){const t=n.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,m=!0,Object.assign(t,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}m&&(customElements.get("mdjs-preview")||import("./a7b4f51b.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{o as HtmlStory0,a as handler,i as validation};
