import{S as e}from"./08927fef.js";import{i as t,x as o}from"./b4be29f1.js";import"./05905ff1.js";import"./dc45fba6.js";import"./1ae2af96.js";import"./6e34d06c.js";import{S as r}from"./5034b8b0.js";import{L as i}from"./ef96d137.js";import{L as s}from"./9d4fbb3c.js";import{R as n}from"./cc85a6f4.js";import{l as a}from"./1347002a.js";import"./dc2f5f5a.js";import"./d45984a3.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./4cc99b59.js";import"./19d2607c.js";import"./afb8834e.js";import"./143fde17.js";import"./6722e641.js";import"./ddba2eb0.js";import"./dc4e1be5.js";import"./4dc0ac82.js";import"./5c8a0a9d.js";import"./ee65bf86.js";import"./b9d3bf75.js";import"./48ac1cb5.js";import"./e49751c9.js";import"./b7f85193.js";import"./622cc741.js";import"./a06c5caf.js";const l=()=>{a();return o`
    <lion-form @submit="${e=>{const t=e.target.serializedValue;console.log("formData",t),e.target.hasFeedbackFor?.includes("error")||fetch("/api/foo/",{method:"POST",body:JSON.stringify(t)})}}">
      <form>
        <lion-input
          name="firstName"
          label="First Name"
          .validators="${[new n]}"
        ></lion-input>
        <lion-input
          name="lastName"
          label="Last Name"
          .validators="${[new n]}"
        ></lion-input>
        <div style="display:flex">
          <button>Submit</button>
          <button
            type="button"
            @click="${e=>e.currentTarget.parentElement.parentElement.parentElement.resetGroup()}"
          >
            Reset
          </button>
        </div>
      </form>
    </lion-form>
    <button @click="${e=>{e.target.previousElementSibling.submit()}}">Explicit submit via JavaScript</button>
  `},m=()=>{a();return o`
    <lion-form @submit="${e=>{const t=e.target.serializedValue;console.log("formData",t),e.target.hasFeedbackFor?.includes("error")||fetch("/api/foo/",{method:"POST",body:JSON.stringify(t)})}}" .serializedValue="${{firstName:"Foo",lastName:"Bar"}}">
      <form>
        <lion-input
          name="firstName"
          label="First Name"
          .validators="${[new n]}"
        ></lion-input>
        <lion-input
          name="lastName"
          label="Last Name"
          .validators="${[new n]}"
        ></lion-input>
        <div style="display:flex">
          <button>Submit</button>
          <button
            type="button"
            @click="${e=>e.currentTarget.parentElement.parentElement.parentElement.resetGroup()}"
          >
            Reset
          </button>
        </div>
      </form>
    </lion-form>
  `};class p extends(r(e(t))){static get scopedElements(){return{"lion-fieldset":i,"lion-input":s}}get slots(){return{...super.slots,"":()=>({template:this.#e()})}}render(){return o` <slot></slot> `}#e(){return o`
      <lion-fieldset name="address" label="Address">
        <lion-input name="street" label="Street" .validators="${[new n]}"></lion-input>
        <lion-input name="number" label="Number" .validators="${[new n]}"></lion-input>
        <lion-input
          name="postalCode"
          label="Postal code"
          .validators="${[new n]}"
        ></lion-input>
      </lion-fieldset>
    `}}customElements.define("sub-form-address",p);const u=()=>{a();return o`
    <lion-form @submit="${e=>{const t=e.target.serializedValue;console.log("formData",t),e.target.hasFeedbackFor?.includes("error")||fetch("/api/foo/",{method:"POST",body:JSON.stringify(t)})}}">
      <form>
        <lion-fieldset name="fullName" label="Name">
          <lion-input
            name="firstName"
            label="First Name"
            .validators="${[new n]}"
          ></lion-input>
          <lion-input
            name="lastName"
            label="Last Name"
            .validators="${[new n]}"
          ></lion-input>
        </lion-fieldset>
        <sub-form-address></sub-form-address>
        <div style="display:flex">
          <button>Submit</button>
          <button
            type="button"
            @click="${e=>e.currentTarget.parentElement.parentElement.parentElement.resetGroup()}"
          >
            Reset
          </button>
        </div>
      </form>
    </lion-form>
  `},d=document,f=[{key:"formSubmit",story:l},{key:"prefilledData",story:m},{key:"subForms",story:u}];let b=!1;for(const e of f){const t=d.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,b=!0,Object.assign(t,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}b&&(customElements.get("mdjs-preview")||import("./24735558.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{l as formSubmit,m as prefilledData,u as subForms};
