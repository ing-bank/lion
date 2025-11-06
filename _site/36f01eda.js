import"./24f95583.js";import{x as e}from"./b4be29f1.js";import"./05905ff1.js";import"./c7db7091.js";import"./b75c08d2.js";import{V as t}from"./4dc0ac82.js";import"./c2aef983.js";import"./7077221a.js";import"./c6fab747.js";import"./dc2f5f5a.js";import"./d45984a3.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./4cc99b59.js";import"./19d2607c.js";import"./afb8834e.js";import"./143fde17.js";import"./f12ecf0e.js";import"./bbaa6280.js";import"./bfba5e5f.js";import"./ec06148e.js";const l=()=>e`
  <lion-fieldset name="nameGroup" label="Name">
    <lion-input name="firstName" label="First Name" .modelValue="${"Foo"}"></lion-input>
    <lion-input name="lastName" label="Last Name" .modelValue="${"Bar"}"></lion-input>
    <button @click="${e=>console.log(e.target.parentElement.modelValue)}">
      Log to Action Logger
    </button>
  </lion-fieldset>
`,n=()=>e`
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
    <button @click="${function(e){const t=e.target.parentElement.querySelector("#fieldset");t.disabled=!t.disabled}}">Toggle disabled</button>
  `,i=()=>e`
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
`,o=()=>e`
    <lion-fieldset id="someId" .validators="${[new class extends t{static get validatorName(){return"DemoValidator"}execute(e){return!e||!e.input1}static async getMessage(){return"[Fieldset Error] Demo error message"}}]}">
      <lion-input name="input1" label="Label"></lion-input>
    </lion-fieldset>
  `,a=()=>e`
    <lion-fieldset .validators="${[new class extends t{static get validatorName(){return"IsCatsAndDogs"}execute(e){return!("cats"===e.input1&&"dogs"===e.input2)}static async getMessage(){return'[Fieldset Error] Input 1 needs to be "cats" and Input 2 needs to be "dogs"'}}]}">
      <lion-input label="An all time YouTube favorite" name="input1" help-text="cats"> </lion-input>
      <lion-input label="Another all time YouTube favorite" name="input2" help-text="dogs">
      </lion-input>
    </lion-fieldset>
  `,s=()=>e`
    <lion-fieldset name="outer" .validators="${[new class extends t{static get validatorName(){return"IsCatsAndDogs"}execute(e){return!e.inner1||"cats"!==e.inner1.input1||!e.inner2||"dogs"!==e.inner2.input1}static async getMessage(){return"There is a problem with one of your fieldsets"}}]}">
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
  `,r=document,m=[{key:"data",story:l},{key:"disabled",story:n},{key:"nestingFieldsets",story:i},{key:"validation",story:o},{key:"validatingMultipleFields",story:a},{key:"validatingMultipleFieldsets",story:s}];let d=!1;for(const e of m){const t=r.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,d=!0,Object.assign(t,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}d&&(customElements.get("mdjs-preview")||import("./a7b4f51b.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{l as data,n as disabled,i as nestingFieldsets,a as validatingMultipleFields,s as validatingMultipleFieldsets,o as validation};
