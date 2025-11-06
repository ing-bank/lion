import{S as t}from"./24f95583.js";import{i as e,x as o}from"./b4be29f1.js";import"./05905ff1.js";import"./b75c08d2.js";import"./c7db7091.js";import"./6f59ad08.js";import{S as r}from"./c6fab747.js";import{L as i}from"./bbaa6280.js";import{L as s}from"./c2aef983.js";import{R as a}from"./cc85a6f4.js";import{l as n}from"./7da3d275.js";import"./dc2f5f5a.js";import"./d45984a3.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./4cc99b59.js";import"./19d2607c.js";import"./afb8834e.js";import"./143fde17.js";import"./bfba5e5f.js";import"./ec06148e.js";import"./4dc0ac82.js";import"./7077221a.js";import"./f12ecf0e.js";import"./3599da39.js";import"./48ac1cb5.js";import"./e49751c9.js";import"./b7f85193.js";import"./622cc741.js";import"./a06c5caf.js";const l=()=>{n();return o`
    <lion-form @submit="${t=>{const e=t.target.serializedValue;console.log("formData",e),t.target.hasFeedbackFor?.includes("error")||fetch("/api/foo/",{method:"POST",body:JSON.stringify(e)})}}">
      <form>
        <lion-input
          name="firstName"
          label="First Name"
          .validators="${[new a]}"
        ></lion-input>
        <lion-input
          name="lastName"
          label="Last Name"
          .validators="${[new a]}"
        ></lion-input>
        <div style="display:flex">
          <button>Submit</button>
          <button
            type="button"
            @click="${t=>t.currentTarget.parentElement.parentElement.parentElement.resetGroup()}"
          >
            Reset
          </button>
        </div>
      </form>
    </lion-form>
    <button @click="${t=>{t.target.previousElementSibling.submit()}}">Explicit submit via JavaScript</button>
  `},m=()=>{n();return o`
    <lion-form @submit="${t=>{const e=t.target.serializedValue;console.log("formData",e),t.target.hasFeedbackFor?.includes("error")||fetch("/api/foo/",{method:"POST",body:JSON.stringify(e)})}}" .serializedValue="${{firstName:"Foo",lastName:"Bar"}}">
      <form>
        <lion-input
          name="firstName"
          label="First Name"
          .validators="${[new a]}"
        ></lion-input>
        <lion-input
          name="lastName"
          label="Last Name"
          .validators="${[new a]}"
        ></lion-input>
        <div style="display:flex">
          <button>Submit</button>
          <button
            type="button"
            @click="${t=>t.currentTarget.parentElement.parentElement.parentElement.resetGroup()}"
          >
            Reset
          </button>
        </div>
      </form>
    </lion-form>
  `};class u extends(r(t(e))){static get scopedElements(){return{"lion-fieldset":i,"lion-input":s}}get slots(){return{...super.slots,"":()=>({template:this.#t()})}}render(){return o` <slot></slot> `}#t(){return o`
      <lion-fieldset name="address" label="Address">
        <lion-input name="street" label="Street" .validators="${[new a]}"></lion-input>
        <lion-input name="number" label="Number" .validators="${[new a]}"></lion-input>
        <lion-input
          name="postalCode"
          label="Postal code"
          .validators="${[new a]}"
        ></lion-input>
      </lion-fieldset>
    `}}customElements.define("sub-form-address",u);const p=()=>{n();return o`
    <lion-form @submit="${t=>{const e=t.target.serializedValue;console.log("formData",e),t.target.hasFeedbackFor?.includes("error")||fetch("/api/foo/",{method:"POST",body:JSON.stringify(e)})}}">
      <form>
        <lion-fieldset name="fullName" label="Name">
          <lion-input
            name="firstName"
            label="First Name"
            .validators="${[new a]}"
          ></lion-input>
          <lion-input
            name="lastName"
            label="Last Name"
            .validators="${[new a]}"
          ></lion-input>
        </lion-fieldset>
        <sub-form-address></sub-form-address>
        <div style="display:flex">
          <button>Submit</button>
          <button
            type="button"
            @click="${t=>t.currentTarget.parentElement.parentElement.parentElement.resetGroup()}"
          >
            Reset
          </button>
        </div>
      </form>
    </lion-form>
  `},d=document,f=[{key:"formSubmit",story:l},{key:"prefilledData",story:m},{key:"subForms",story:p}];let b=!1;for(const t of f){const e=d.querySelector(`[mdjs-story-name="${t.key}"]`);e&&(e.story=t.story,e.key=t.key,b=!0,Object.assign(e,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}b&&(customElements.get("mdjs-preview")||import("./a7b4f51b.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{l as formSubmit,m as prefilledData,p as subForms};
