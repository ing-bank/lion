import"./08927fef.js";import{x as e}from"./b4be29f1.js";import"./05905ff1.js";import"./66d1ec5b.js";import{V as t}from"./4dc0ac82.js";import"./4cc99b59.js";import"./19d2607c.js";import"./afb8834e.js";import"./d45984a3.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./dc2f5f5a.js";import"./9d4fbb3c.js";import"./5c8a0a9d.js";import"./5034b8b0.js";import"./143fde17.js";import"./6722e641.js";import"./ee65bf86.js";import"./48ac1cb5.js";const o=()=>e`
  <lion-input-email .modelValue="${"foo"}" label="Email"></lion-input-email>
`,s=()=>e`
    <lion-input-email
      .modelValue="${"foo@bar.com"}"
      .validators="${[new class extends t{static get validatorName(){return"GmailOnly"}execute(e){let t=!1;return-1===e.indexOf("gmail.com")&&(t=!0),t}static async getMessage(){return"You can only use gmail.com email addresses."}}]}"
      label="Email"
    ></lion-input-email>
  `,m=document,i=[{key:"faultyPrefilled",story:o},{key:"customValidator",story:s}];let a=!1;for(const e of i){const t=m.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,a=!0,Object.assign(t,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}a&&(customElements.get("mdjs-preview")||import("./24735558.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{s as customValidator,o as faultyPrefilled};
