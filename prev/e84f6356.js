import"./f1151d68.js";import{x as e}from"./b8bc2eda.js";import"./6638bb86.js";import"./222c49e4.js";import{l as o}from"./04e5357d.js";import"./7eab6f7c.js";import"./4abf0ca8.js";import"./dc2f5f5a.js";import"./7c882590.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./c48d90f3.js";import"./be5f2fd3.js";import"./dcadf410.js";import"./143fde17.js";import"./6722e641.js";import"./d924b319.js";import"./4dc0ac82.js";import"./cc85a6f4.js";import"./48ac1cb5.js";import"./e49751c9.js";import"./b7f85193.js";import"./622cc741.js";import"./a06c5caf.js";o();const t=()=>e`<lion-select name="favoriteColor" label="Favorite color" .modelValue="${"hotpink"}">
  <select slot="input">
    <option selected value>Please select</option>
    <option value="red">Red</option>
    <option value="hotpink">Hotpink</option>
    <option value="teal">Teal</option>
  </select>
</lion-select>`,i=()=>e`<lion-select name="favoriteColor" label="Favorite color">
  <select slot="input">
    <option selected value>Please select</option>
    <option value="red">Red</option>
    <option value="hotpink" disabled>Hotpink</option>
    <option value="teal">Teal</option>
  </select>
</lion-select>`,l=()=>e`<lion-select name="favoriteColor" label="Favorite color" disabled>
  <select slot="input">
    <option selected value>Please select</option>
    <option value="red">Red</option>
    <option value="hotpink">Hotpink</option>
    <option value="teal">Teal</option>
  </select>
</lion-select>`,s=document,n=[{key:"HtmlStory0",story:t},{key:"HtmlStory1",story:i},{key:"HtmlStory2",story:l}];let a=!1;for(const e of n){const o=s.querySelector(`[mdjs-story-name="${e.key}"]`);o&&(o.story=e.story,o.key=e.key,a=!0,Object.assign(o,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}a&&(customElements.get("mdjs-preview")||import("./e90784d0.js"),customElements.get("mdjs-story")||import("./0defd61d.js"));export{t as HtmlStory0,i as HtmlStory1,l as HtmlStory2};
