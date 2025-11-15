import"./24f95583.js";import{x as e}from"./b4be29f1.js";import"./05905ff1.js";import"./90702e3a.js";import"./4cc99b59.js";import"./19d2607c.js";import"./afb8834e.js";import"./d45984a3.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./dc2f5f5a.js";import"./88185952.js";import"./24c57689.js";import"./4a239ef1.js";import"./9157d4cc.js";import"./7902d8e0.js";import"./143fde17.js";import"./298b3bc0.js";import"./de5cbd7c.js";const t=()=>e`<style>
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
></lion-input-range>`,o=document,s=[{key:"HtmlStory0",story:t},{key:"HtmlStory1",story:n},{key:"HtmlStory2",story:i},{key:"HtmlStory3",story:m}];let r=!1;for(const e of s){const t=o.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,r=!0,Object.assign(t,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}r&&(customElements.get("mdjs-preview")||import("./a7b4f51b.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{t as HtmlStory0,n as HtmlStory1,i as HtmlStory2,m as HtmlStory3};
