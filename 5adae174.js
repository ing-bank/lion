import"./08927fef.js";import{x as e}from"./b4be29f1.js";import"./05905ff1.js";import"./1ae2af96.js";import"./6e34d06c.js";import"./9d4fbb3c.js";import"./5c8a0a9d.js";import"./5034b8b0.js";import"./dc2f5f5a.js";import"./d45984a3.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./4cc99b59.js";import"./19d2607c.js";import"./afb8834e.js";import"./143fde17.js";import"./6722e641.js";import"./ee65bf86.js";import"./ef96d137.js";import"./ddba2eb0.js";import"./dc4e1be5.js";import"./4dc0ac82.js";const t=()=>e`
    <lion-form @submit="${e=>{const t=e.target.serializedValue;console.log("formData",t),fetch("/api/foo/",{method:"POST",body:JSON.stringify(t)})}}">
      <form @submit="${e=>e.preventDefault()}">
        <lion-input name="firstName" label="First Name" .modelValue="${"Foo"}"></lion-input>
        <lion-input name="lastName" label="Last Name" .modelValue="${"Bar"}"></lion-input>
        <button>Submit</button>
      </form>
    </lion-form>
  `,o=document,m=[{key:"main",story:t}];let s=!1;for(const e of m){const t=o.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,s=!0,Object.assign(t,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}s&&(customElements.get("mdjs-preview")||import("./24735558.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{t as main};
