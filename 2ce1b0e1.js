import{S as t}from"./f1151d68.js";import{i as e,x as o}from"./b8bc2eda.js";import"./6638bb86.js";import"./2248c9f5.js";import"./822ba771.js";import"./c91dc6ab.js";import{S as r}from"./4abf0ca8.js";import{L as i}from"./30c0041b.js";import{L as s}from"./45058e5d.js";import{R as n}from"./cc85a6f4.js";import{l as a}from"./04e5357d.js";import"./dc2f5f5a.js";import"./7c882590.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./c48d90f3.js";import"./be5f2fd3.js";import"./dcadf410.js";import"./143fde17.js";import"./6722e641.js";import"./92fca6ea.js";import"./af1609b4.js";import"./4dc0ac82.js";import"./57941646.js";import"./7eab6f7c.js";import"./d924b319.js";import"./48ac1cb5.js";import"./e49751c9.js";import"./b7f85193.js";import"./622cc741.js";import"./a06c5caf.js";const l=()=>{a();return o`
    <lion-form @submit="${t=>{const e=t.target.serializedValue;console.log("formData",e),t.target.hasFeedbackFor?.includes("error")||fetch("/api/foo/",{method:"POST",body:JSON.stringify(e)})}}">
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
            @click="${t=>t.currentTarget.parentElement.parentElement.parentElement.resetGroup()}"
          >
            Reset
          </button>
        </div>
      </form>
    </lion-form>
    <button @click="${t=>{t.target.previousElementSibling.submit()}}">Explicit submit via JavaScript</button>
  `},m=()=>{a();return o`
    <lion-form @submit="${t=>{const e=t.target.serializedValue;console.log("formData",e),t.target.hasFeedbackFor?.includes("error")||fetch("/api/foo/",{method:"POST",body:JSON.stringify(e)})}}" .serializedValue="${{firstName:"Foo",lastName:"Bar"}}">
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
            @click="${t=>t.currentTarget.parentElement.parentElement.parentElement.resetGroup()}"
          >
            Reset
          </button>
        </div>
      </form>
    </lion-form>
  `};class d extends(r(t(e))){static get scopedElements(){return{"lion-fieldset":i,"lion-input":s}}get slots(){return{...super.slots,"":()=>({template:this.#t()})}}render(){return o` <slot></slot> `}#t(){return o`
      <lion-fieldset name="address" label="Address">
        <lion-input name="street" label="Street" .validators="${[new n]}"></lion-input>
        <lion-input name="number" label="Number" .validators="${[new n]}"></lion-input>
        <lion-input
          name="postalCode"
          label="Postal code"
          .validators="${[new n]}"
        ></lion-input>
      </lion-fieldset>
    `}}customElements.define("sub-form-address",d);const p=()=>{a();return o`
    <lion-form @submit="${t=>{const e=t.target.serializedValue;console.log("formData",e),t.target.hasFeedbackFor?.includes("error")||fetch("/api/foo/",{method:"POST",body:JSON.stringify(e)})}}">
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
            @click="${t=>t.currentTarget.parentElement.parentElement.parentElement.resetGroup()}"
          >
            Reset
          </button>
        </div>
      </form>
    </lion-form>
  `},u=document,f=[{key:"formSubmit",story:l},{key:"prefilledData",story:m},{key:"subForms",story:p}];let c=!1;for(const t of f){const e=u.querySelector(`[mdjs-story-name="${t.key}"]`);e&&(e.story=t.story,e.key=t.key,c=!0,Object.assign(e,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}c&&(customElements.get("mdjs-preview")||import("./e90784d0.js"),customElements.get("mdjs-story")||import("./0defd61d.js"));export{l as formSubmit,m as prefilledData,p as subForms};
