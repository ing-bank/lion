import"./f1151d68.js";import{x as e}from"./b8bc2eda.js";import"./6638bb86.js";import"./59569126.js";import{V as t}from"./4dc0ac82.js";import"./c48d90f3.js";import"./be5f2fd3.js";import"./dcadf410.js";import"./7c882590.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./dc2f5f5a.js";import"./45058e5d.js";import"./57941646.js";import"./4abf0ca8.js";import"./143fde17.js";import"./6722e641.js";import"./7eab6f7c.js";import"./48ac1cb5.js";const o=()=>e`
  <lion-input-email .modelValue="${"foo"}" label="Email"></lion-input-email>
`,s=()=>e`
    <lion-input-email
      .modelValue="${"foo@bar.com"}"
      .validators="${[new class extends t{static get validatorName(){return"GmailOnly"}execute(e){let t=!1;return-1===e.indexOf("gmail.com")&&(t=!0),t}static async getMessage(){return"You can only use gmail.com email addresses."}}]}"
      label="Email"
    ></lion-input-email>
  `,m=document,i=[{key:"faultyPrefilled",story:o},{key:"customValidator",story:s}];let a=!1;for(const e of i){const t=m.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,a=!0,Object.assign(t,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}a&&(customElements.get("mdjs-preview")||import("./e90784d0.js"),customElements.get("mdjs-story")||import("./0defd61d.js"));export{s as customValidator,o as faultyPrefilled};
