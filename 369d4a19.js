import"./f1151d68.js";import{x as t}from"./b8bc2eda.js";import"./6638bb86.js";import"./822ba771.js";import"./c91dc6ab.js";import"./45058e5d.js";import"./57941646.js";import"./4abf0ca8.js";import"./dc2f5f5a.js";import"./7c882590.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./c48d90f3.js";import"./be5f2fd3.js";import"./dcadf410.js";import"./143fde17.js";import"./6722e641.js";import"./7eab6f7c.js";import"./30c0041b.js";import"./92fca6ea.js";import"./af1609b4.js";import"./4dc0ac82.js";const e=()=>t`
    <lion-form @submit="${t=>{const e=t.target.serializedValue;console.log("formData",e),fetch("/api/foo/",{method:"POST",body:JSON.stringify(e)})}}">
      <form @submit="${t=>t.preventDefault()}">
        <lion-input name="firstName" label="First Name" .modelValue="${"Foo"}"></lion-input>
        <lion-input name="lastName" label="Last Name" .modelValue="${"Bar"}"></lion-input>
        <button>Submit</button>
      </form>
    </lion-form>
  `,o=document,m=[{key:"main",story:e}];let s=!1;for(const t of m){const e=o.querySelector(`[mdjs-story-name="${t.key}"]`);e&&(e.story=t.story,e.key=t.key,s=!0,Object.assign(e,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}s&&(customElements.get("mdjs-preview")||import("./e90784d0.js"),customElements.get("mdjs-story")||import("./0defd61d.js"));export{e as main};
