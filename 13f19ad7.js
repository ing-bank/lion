import"./24f95583.js";import{x as e}from"./b4be29f1.js";import"./05905ff1.js";import"./fa14a2cc.js";import{V as t}from"./4dc0ac82.js";import"./4cc99b59.js";import"./19d2607c.js";import"./afb8834e.js";import"./d45984a3.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./dc2f5f5a.js";import"./c2aef983.js";import"./7077221a.js";import"./c6fab747.js";import"./143fde17.js";import"./f12ecf0e.js";import"./48ac1cb5.js";const o=()=>e`
  <lion-input-email .modelValue="${"foo"}" label="Email"></lion-input-email>
`,s=()=>e`
    <lion-input-email
      .modelValue="${"foo@bar.com"}"
      .validators="${[new class extends t{static get validatorName(){return"GmailOnly"}execute(e){let t=!1;return-1===e.indexOf("gmail.com")&&(t=!0),t}static async getMessage(){return"You can only use gmail.com email addresses."}}]}"
      label="Email"
    ></lion-input-email>
  `,a=document,m=[{key:"faultyPrefilled",story:o},{key:"customValidator",story:s}];let i=!1;for(const e of m){const t=a.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,i=!0,Object.assign(t,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}i&&(customElements.get("mdjs-preview")||import("./a7b4f51b.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{s as customValidator,o as faultyPrefilled};
