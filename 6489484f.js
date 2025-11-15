import{S as e}from"./24f95583.js";import{i as t,x as o}from"./b4be29f1.js";import"./05905ff1.js";import"./d3a1c786.js";import"./f5e3cf69.js";import"./ee0e4c4a.js";import{S as r}from"./7902d8e0.js";import{L as i}from"./9e1b447d.js";import{L as s}from"./4a239ef1.js";import{R as n}from"./cc85a6f4.js";import{l as a}from"./c85cfbca.js";import"./dc2f5f5a.js";import"./d45984a3.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./4cc99b59.js";import"./19d2607c.js";import"./afb8834e.js";import"./143fde17.js";import"./788d808c.js";import"./48b0a907.js";import"./4dc0ac82.js";import"./9157d4cc.js";import"./298b3bc0.js";import"./459b1eec.js";import"./48ac1cb5.js";import"./e49751c9.js";import"./b7f85193.js";import"./622cc741.js";import"./a06c5caf.js";const l=()=>{a();return o`
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
  `};class u extends(r(e(t))){static get scopedElements(){return{"lion-fieldset":i,"lion-input":s}}get slots(){return{...super.slots,"":()=>({template:this.#e()})}}render(){return o` <slot></slot> `}#e(){return o`
      <lion-fieldset name="address" label="Address">
        <lion-input name="street" label="Street" .validators="${[new n]}"></lion-input>
        <lion-input name="number" label="Number" .validators="${[new n]}"></lion-input>
        <lion-input
          name="postalCode"
          label="Postal code"
          .validators="${[new n]}"
        ></lion-input>
      </lion-fieldset>
    `}}customElements.define("sub-form-address",u);const p=()=>{a();return o`
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
  `},d=document,c=[{key:"formSubmit",story:l},{key:"prefilledData",story:m},{key:"subForms",story:p}];let f=!1;for(const e of c){const t=d.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,f=!0,Object.assign(t,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}f&&(customElements.get("mdjs-preview")||import("./a7b4f51b.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{l as formSubmit,m as prefilledData,p as subForms};
