const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.DYUong5B.js","_astro/node-tools_providence-analytics_overview.LFFQBZzG.js","_astro/lit-element.qDHKJJma.js","_astro/lit-html.C7L4dwLU.js","_astro/unsafe-html.J0GGe2Q7.js","_astro/directive.CGE4aKEl.js","_astro/define.m2CvvXyF.js"])))=>i.map(i=>d[i]);
import{_ as s}from"./preload-helper.4zY6-HO4.js";import{S as m}from"./node-tools_providence-analytics_overview.LFFQBZzG.js";import{i as u}from"./lit-element.qDHKJJma.js";import{x as n}from"./lit-html.C7L4dwLU.js";import"./unsafe-html.J0GGe2Q7.js";import"./lion-fieldset.BV1UH1f7.js";import"./lion-input.CfgqeAN3.js";import"./lion-form.BTIvQ0xp.js";import{l as a}from"./loadDefaultFeedbackMessages.BQgeO4Ka.js";import{R as o}from"./Required.DgHIr_Cn.js";import{S as p}from"./InteractionStateMixin.BzvQ4Mf0.js";import{L as d}from"./LionInput.DRpWIRa3.js";import{L as f}from"./LionFieldset.CalDwoQW.js";import"./directive.CGE4aKEl.js";import"./validators.BccilvTl.js";import"./Validator.DAOhFpDH.js";import"./StringValidators.UXrPEtgv.js";import"./NumberValidators.CmKpqCIb.js";import"./DateValidators.CEq8F9yx.js";import"./normalizeDateTime.BoDqBOW2.js";import"./PhoneUtilManager.DkvpFzJF.js";import"./getLocalizeManager.W5d_ICRU.js";import"./index.BNCfcFQh.js";import"./lazifyInstantiation.CgYLRMC3.js";import"./dedupeMixin.6XPTJgK8.js";import"./LocalizeMixin.VYu75dkK.js";import"./directive-helpers.CLllgGgm.js";import"./async-directive.CHVe8p0E.js";import"./DisabledMixin.Bm1nsErI.js";import"./NativeTextFieldMixin.Cfq2aKpe.js";import"./LionField.DGnPMihp.js";import"./FormGroupMixin.CQnfLXQx.js";import"./FormRegistrarMixin.YCZ6eayn.js";const b=()=>{a();const r=t=>{const i=t.target.serializedValue;console.log("formData",i),t.target.hasFeedbackFor?.includes("error")||fetch("/api/foo/",{method:"POST",body:JSON.stringify(i)})},e=t=>{t.target.previousElementSibling.submit()};return n`
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
            @click="${t=>t.currentTarget.parentElement.parentElement.parentElement.resetGroup()}"
          >
            Reset
          </button>
        </div>
      </form>
    </lion-form>
    <button @click="${e}">Explicit submit via JavaScript</button>
  `},c=()=>(a(),n`
    <lion-form @submit="${t=>{const i=t.target.serializedValue;console.log("formData",i),t.target.hasFeedbackFor?.includes("error")||fetch("/api/foo/",{method:"POST",body:JSON.stringify(i)})}}" .serializedValue="${{firstName:"Foo",lastName:"Bar"}}">
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
            @click="${t=>t.currentTarget.parentElement.parentElement.parentElement.resetGroup()}"
          >
            Reset
          </button>
        </div>
      </form>
    </lion-form>
  `);class y extends p(m(u)){static get scopedElements(){return{"lion-fieldset":f,"lion-input":d}}get slots(){return{...super.slots,"":()=>({template:this.#t()})}}render(){return n` <slot></slot> `}#t(){return n`
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
    <lion-form @submit="${e=>{const t=e.target.serializedValue;console.log("formData",t),e.target.hasFeedbackFor?.includes("error")||fetch("/api/foo/",{method:"POST",body:JSON.stringify(t)})}}">
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
            @click="${e=>e.currentTarget.parentElement.parentElement.parentElement.resetGroup()}"
          >
            Reset
          </button>
        </div>
      </form>
    </lion-form>
  `),E=document,S=[{key:"formSubmit",story:b},{key:"prefilledData",story:c},{key:"subForms",story:g}];let l=!1;for(const r of S){const e=E.querySelector(`[mdjs-story-name="${r.key}"]`);e&&(e.story=r.story,e.key=r.key,l=!0,Object.assign(e,{simulatorUrl:"/next/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}l&&(customElements.get("mdjs-preview")||s(()=>import("./define.DYUong5B.js"),__vite__mapDeps([0,1,2,3,4,5])),customElements.get("mdjs-story")||s(()=>import("./define.m2CvvXyF.js"),__vite__mapDeps([6,2,3])));export{b as formSubmit,c as prefilledData,g as subForms};
