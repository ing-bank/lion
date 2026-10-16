import"./f1151d68.js";import{x as e}from"./b8bc2eda.js";import"./6638bb86.js";import"./52bf0366.js";import"./c48d90f3.js";import"./be5f2fd3.js";import"./dcadf410.js";import"./7c882590.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./dc2f5f5a.js";import"./6e65f685.js";import"./1069d12c.js";import"./45058e5d.js";import"./57941646.js";import"./4abf0ca8.js";import"./143fde17.js";import"./6722e641.js";import"./7eab6f7c.js";import"./65a235eb.js";const t=()=>e`<style>
  lion-input-range {
    max-width: 400px;
  }
</style>
<lion-input-range
  min="0"
  max="100"
  .modelValue="${50}"
  unit="%"
  label="Percentage"
></lion-input-range>`,n=()=>e`<lion-input-range
  style="max-width: 400px;"
  min="200"
  max="500"
  step="50"
  .modelValue="${300}"
  label="Input range"
  help-text="This slider uses increments of 50"
></lion-input-range>`,i=()=>e`<lion-input-range
  style="max-width: 400px;"
  no-min-max-labels
  min="0"
  max="100"
  label="Input range"
></lion-input-range>`,m=()=>e`<lion-input-range
  style="max-width: 400px;"
  disabled
  min="200"
  max="500"
  .modelValue="${300}"
  label="Input range"
></lion-input-range>`,o=document,s=[{key:"HtmlStory0",story:t},{key:"HtmlStory1",story:n},{key:"HtmlStory2",story:i},{key:"HtmlStory3",story:m}];let r=!1;for(const e of s){const t=o.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,r=!0,Object.assign(t,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}r&&(customElements.get("mdjs-preview")||import("./e90784d0.js"),customElements.get("mdjs-story")||import("./0defd61d.js"));export{t as HtmlStory0,n as HtmlStory1,i as HtmlStory2,m as HtmlStory3};
