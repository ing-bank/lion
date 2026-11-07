const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.D5IFK1jp.js","_astro/MdJsPreview.B62up6PK.js","_astro/lit-element.DxRhnkit.js","_astro/lit-html.BX7rm8u-.js","_astro/dedupeMixin.6XPTJgK8.js","_astro/lit-element.BOikny4r.js","_astro/uuid.DjYKNjre.js","_astro/define.DBgp7shK.js"])))=>i.map(i=>d[i]);
import{_ as s}from"./preload-helper.CVfkMyKi.js";import{S as m}from"./MdJsPreview.B62up6PK.js";import{i as u}from"./lit-element.DxRhnkit.js";import{b as n}from"./lit-html.BX7rm8u-.js";import"./unsafe-html.FHlAasnX.js";import"./lion-fieldset.DA65X2tT.js";import"./lion-input.DmSJ_gE7.js";import"./lion-form.FF5oNE9G.js";import{l as a}from"./loadDefaultFeedbackMessages.Dna2KIXH.js";import{R as o}from"./Required.CvxLsCBg.js";import{S as d}from"./SlotMixin.Cw3cZ2rK.js";import{L as f}from"./LionInput.Ddr1VqyR.js";import{L as p}from"./LionFieldset.RgbpZHJs.js";const b=()=>{a();const r=e=>{const i=e.target.serializedValue;console.log("formData",i),e.target.hasFeedbackFor?.includes("error")||fetch("/api/foo/",{method:"POST",body:JSON.stringify(i)})},t=e=>{e.target.previousElementSibling.submit()};return n`
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
  `);class y extends d(m(u)){static get scopedElements(){return{"lion-fieldset":p,"lion-input":f}}get slots(){return{...super.slots,"":()=>({template:this.#e()})}}render(){return n` <slot></slot> `}#e(){return n`
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
  `),E=document,S=[{key:"formSubmit",story:b},{key:"prefilledData",story:c},{key:"subForms",story:g}];let l=!1;for(const r of S){const t=E.querySelector(`[mdjs-story-name="${r.key}"]`);t&&(t.story=r.story,t.key=r.key,l=!0,Object.assign(t,{simulatorUrl:"/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}l&&(customElements.get("mdjs-preview")||s(()=>import("./define.D5IFK1jp.js"),__vite__mapDeps([0,1,2,3,4,5,6])),customElements.get("mdjs-story")||s(()=>import("./define.DBgp7shK.js"),__vite__mapDeps([7,2,3])));export{b as formSubmit,c as prefilledData,g as subForms};
