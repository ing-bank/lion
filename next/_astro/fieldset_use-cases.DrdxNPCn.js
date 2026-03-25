const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.DSVRgKCR.js","_astro/node-tools_providence-analytics_overview.BxIihMx7.js","_astro/lit-element.jD9bOQKo.js","_astro/lit-html.DtZEZPQ5.js","_astro/unsafe-html.DgrA3nwU.js","_astro/directive.BO6BEpVC.js","_astro/define.DNIVKtom.js"])))=>i.map(i=>d[i]);
import{_ as o}from"./preload-helper.Cj2JEybs.js";import"./node-tools_providence-analytics_overview.BxIihMx7.js";import"./lit-element.jD9bOQKo.js";import{x as l}from"./lit-html.DtZEZPQ5.js";import"./unsafe-html.DgrA3nwU.js";import"./lion-input.CWsta8VT.js";import"./lion-fieldset.Ro_eC8qa.js";import{V as n}from"./Validator.DAOhFpDH.js";const s=()=>l`
  <lion-fieldset name="nameGroup" label="Name">
    <lion-input name="firstName" label="First Name" .modelValue="${"Foo"}"></lion-input>
    <lion-input name="lastName" label="Last Name" .modelValue="${"Bar"}"></lion-input>
    <button @click="${e=>console.log(e.target.parentElement.modelValue)}">
      Log to Action Logger
    </button>
  </lion-fieldset>
`,r=()=>{function e(t){const i=t.target.parentElement.querySelector("#fieldset");i.disabled=!i.disabled}return l`
    <lion-fieldset name="nameGroup" label="Name" id="fieldset" disabled>
      <lion-input name="FirstName" label="First Name" .modelValue="${"Foo"}"></lion-input>
      <lion-input name="LastName" label="Last Name" .modelValue="${"Bar"}"></lion-input>
      <lion-fieldset name="nameGroup2" label="Name">
        <lion-input
          name="FirstName2"
          label="First Name"
          .modelValue="${"Foo"}"
          disabled
        ></lion-input>
        <lion-input name="LastName2" label="Last Name" .modelValue="${"Bar"}"></lion-input>
      </lion-fieldset>
    </lion-fieldset>
    <button @click="${e}">Toggle disabled</button>
  `},d=()=>l`
  <lion-fieldset>
    <div slot="label">Personal data</div>
    <lion-fieldset name="nameGroup" label="Name">
      <lion-input name="FirstName" label="First Name" .modelValue="${"Foo"}"></lion-input>
      <lion-input name="LastName" label="Last Name" .modelValue="${"Bar"}"></lion-input>
    </lion-fieldset>
    <lion-fieldset name="location" label="Location">
      <lion-input name="country" label="Country" .modelValue="${"Netherlands"}"></lion-input>
    </lion-fieldset>
    <lion-input name="age" label="Age" .modelValue="${21}"></lion-input>
    <button @click="${e=>console.log(e.target.parentElement.modelValue)}">
      Log everything to Action Logger
    </button>
    <br />
    <button
      @click="${e=>console.log(e.target.parentElement.formElements.nameGroup.modelValue)}"
    >
      Log only Name fieldset to Action Logger
    </button>
  </lion-fieldset>
`,m=()=>{const e=class extends n{static get validatorName(){return"DemoValidator"}execute(t){return!(t&&t.input1)}static async getMessage(){return"[Fieldset Error] Demo error message"}};return l`
    <lion-fieldset id="someId" .validators="${[new e]}">
      <lion-input name="input1" label="Label"></lion-input>
    </lion-fieldset>
  `},u=()=>{const e=class extends n{static get validatorName(){return"IsCatsAndDogs"}execute(t){return!(t.input1==="cats"&&t.input2==="dogs")}static async getMessage(){return'[Fieldset Error] Input 1 needs to be "cats" and Input 2 needs to be "dogs"'}};return l`
    <lion-fieldset .validators="${[new e]}">
      <lion-input label="An all time YouTube favorite" name="input1" help-text="cats"> </lion-input>
      <lion-input label="Another all time YouTube favorite" name="input2" help-text="dogs">
      </lion-input>
    </lion-fieldset>
  `},p=()=>{const e=class extends n{static get validatorName(){return"IsCatsAndDogs"}execute(t){return!(t.inner1&&t.inner1.input1==="cats"&&t.inner2&&t.inner2.input1==="dogs")}static async getMessage(){return"There is a problem with one of your fieldsets"}};return l`
    <lion-fieldset name="outer" .validators="${[new e]}">
      <lion-fieldset name="inner1">
        <label slot="label">Fieldset no. 1</label>
        <lion-input label="Write 'cats' here" name="input1"> </lion-input>
      </lion-fieldset>
      <hr />
      <lion-fieldset name="inner2">
        <label slot="label">Fieldset no. 2</label>
        <lion-input label="Write 'dogs' here" name="input1"> </lion-input>
      </lion-fieldset>
    </lion-fieldset>
  `},c=document,g=[{key:"data",story:s},{key:"disabled",story:r},{key:"nestingFieldsets",story:d},{key:"validation",story:m},{key:"validatingMultipleFields",story:u},{key:"validatingMultipleFieldsets",story:p}];let a=!1;for(const e of g){const t=c.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,a=!0,Object.assign(t,{simulatorUrl:"/next/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}a&&(customElements.get("mdjs-preview")||o(()=>import("./define.DSVRgKCR.js"),__vite__mapDeps([0,1,2,3,4,5])),customElements.get("mdjs-story")||o(()=>import("./define.DNIVKtom.js"),__vite__mapDeps([6,2,3])));export{s as data,r as disabled,d as nestingFieldsets,u as validatingMultipleFields,p as validatingMultipleFieldsets,m as validation};
