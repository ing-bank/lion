import"./24f95583.js";import{x as t}from"./b4be29f1.js";import"./05905ff1.js";import"./c7db7091.js";import"./6f59ad08.js";import"./c2aef983.js";import"./7077221a.js";import"./c6fab747.js";import"./dc2f5f5a.js";import"./d45984a3.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./4cc99b59.js";import"./19d2607c.js";import"./afb8834e.js";import"./143fde17.js";import"./f12ecf0e.js";import"./bbaa6280.js";import"./bfba5e5f.js";import"./ec06148e.js";import"./4dc0ac82.js";const e=()=>t`
    <lion-form @submit="${t=>{const e=t.target.serializedValue;console.log("formData",e),fetch("/api/foo/",{method:"POST",body:JSON.stringify(e)})}}">
      <form @submit="${t=>t.preventDefault()}">
        <lion-input name="firstName" label="First Name" .modelValue="${"Foo"}"></lion-input>
        <lion-input name="lastName" label="Last Name" .modelValue="${"Bar"}"></lion-input>
        <button>Submit</button>
      </form>
    </lion-form>
  `,o=document,m=[{key:"main",story:e}];let s=!1;for(const t of m){const e=o.querySelector(`[mdjs-story-name="${t.key}"]`);e&&(e.story=t.story,e.key=t.key,s=!0,Object.assign(e,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}s&&(customElements.get("mdjs-preview")||import("./a7b4f51b.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{e as main};
