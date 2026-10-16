const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.BdbiuFq9.js","_astro/MdJsPreview.3BOxlSHn.js","_astro/lit-element.jD9bOQKo.js","_astro/lit-html.DtZEZPQ5.js","_astro/lit-element.BdYmZD4s.js","_astro/define.DNIVKtom.js"])))=>i.map(i=>d[i]);
import{_ as s}from"./preload-helper.CVfkMyKi.js";import"./MdJsPreview.3BOxlSHn.js";import{i as m}from"./lit-element.jD9bOQKo.js";import{x as n}from"./lit-html.DtZEZPQ5.js";import"./unsafe-html.DgrA3nwU.js";import"./lion-fieldset.k-3YnA5R.js";import"./lion-input.BZacNd8I.js";import"./lion-form.BfgW6x5O.js";import{S as u}from"./lit-element.BdYmZD4s.js";import{l as a}from"./loadDefaultFeedbackMessages.DKrgwlad.js";import{R as o}from"./Required.CvxLsCBg.js";import{S as d}from"./SlotMixin.DX3mwGiD.js";import{L as p}from"./LionInput.C0jEFl-r.js";import{L as f}from"./LionFieldset.CNWXTYf3.js";const b=()=>{a();const r=e=>{const i=e.target.serializedValue;console.log("formData",i),e.target.hasFeedbackFor?.includes("error")||fetch("/api/foo/",{method:"POST",body:JSON.stringify(i)})},t=e=>{e.target.previousElementSibling.submit()};return n`
    <lion-form @submit="${r}">
      <form>
        <lion-input
          name="firstName"
          label="First Name"
          .validators="${[new o]}"
        ></lion-input>
        <lion-input
          name="lastName"
          label="Last Name"
          .validators="${[new o]}"
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
    <button @click="${t}">Explicit submit via JavaScript</button>
  `},c=()=>(a(),n`
    <lion-form @submit="${e=>{const i=e.target.serializedValue;console.log("formData",i),e.target.hasFeedbackFor?.includes("error")||fetch("/api/foo/",{method:"POST",body:JSON.stringify(i)})}}" .serializedValue="${{firstName:"Foo",lastName:"Bar"}}">
      <form>
        <lion-input
          name="firstName"
          label="First Name"
          .validators="${[new o]}"
        ></lion-input>
        <lion-input
          name="lastName"
          label="Last Name"
          .validators="${[new o]}"
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
  `);class y extends d(u(m)){static get scopedElements(){return{"lion-fieldset":f,"lion-input":p}}get slots(){return{...super.slots,"":()=>({template:this.#e()})}}render(){return n` <slot></slot> `}#e(){return n`
      <lion-fieldset name="address" label="Address">
        <lion-input name="street" label="Street" .validators="${[new o]}"></lion-input>
        <lion-input name="number" label="Number" .validators="${[new o]}"></lion-input>
        <lion-input
          name="postalCode"
          label="Postal code"
          .validators="${[new o]}"
        ></lion-input>
      </lion-fieldset>
    `}}customElements.define("sub-form-address",y);const g=()=>(a(),n`
    <lion-form @submit="${t=>{const e=t.target.serializedValue;console.log("formData",e),t.target.hasFeedbackFor?.includes("error")||fetch("/api/foo/",{method:"POST",body:JSON.stringify(e)})}}">
      <form>
        <lion-fieldset name="fullName" label="Name">
          <lion-input
            name="firstName"
            label="First Name"
            .validators="${[new o]}"
          ></lion-input>
          <lion-input
            name="lastName"
            label="Last Name"
            .validators="${[new o]}"
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
  `),E=document,S=[{key:"formSubmit",story:b},{key:"prefilledData",story:c},{key:"subForms",story:g}];let l=!1;for(const r of S){const t=E.querySelector(`[mdjs-story-name="${r.key}"]`);t&&(t.story=r.story,t.key=r.key,l=!0,Object.assign(t,{simulatorUrl:"/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}l&&(customElements.get("mdjs-preview")||s(()=>import("./define.BdbiuFq9.js"),__vite__mapDeps([0,1,2,3,4])),customElements.get("mdjs-story")||s(()=>import("./define.DNIVKtom.js"),__vite__mapDeps([5,2,3])));export{b as formSubmit,c as prefilledData,g as subForms};
