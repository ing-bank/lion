import{S as e}from"./08927fef.js";import{i as t,x as o}from"./b4be29f1.js";import"./05905ff1.js";import"./86e67e89.js";import"./79b4508b.js";import"./dc45fba6.js";import"./6e34d06c.js";import"./4d71ac72.js";import"./2fa67c5f.js";import"./591ab81a.js";import"./66d1ec5b.js";import"./d03ec624.js";import"./8df22192.js";import"./9b9941ec.js";import"./1ae2af96.js";import"./cd88d4d9.js";import"./9534c2cb.js";import{b as a}from"./0ab13f37.js";import"./f4b71693.js";import"./1b9e341e.js";import"./80921cb1.js";import"./9a9ba5bd.js";import{l as i}from"./573dde6f.js";import{V as n}from"./4dc0ac82.js";import{L as l}from"./9d4fbb3c.js";import{l as s,D as r}from"./1347002a.js";import{R as d}from"./cc85a6f4.js";import{M as c,E as u,a as m,b as p,P as b,I as f,c as y}from"./48ac1cb5.js";import{I as h,M as g,a as $,b as k}from"./e49751c9.js";import{I as w,M as V,a as v,b as j}from"./b7f85193.js";import{U as x}from"./5034b8b0.js";import"./06654559.js";import"./dc4e1be5.js";import"./dc2f5f5a.js";import"./ddba2eb0.js";import"./143fde17.js";import"./06f5b106.js";import"./d6bc368c.js";import"./4cc99b59.js";import"./19d2607c.js";import"./afb8834e.js";import"./d45984a3.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./9af64c94.js";import"./acda6ea6.js";import"./0ed5d59c.js";import"./b9d3bf75.js";import"./ef96d137.js";import"./dfa58534.js";import"./88185952.js";import"./24c57689.js";import"./10e1d49e.js";import"./fa30f842.js";import"./ee959851.js";import"./895f5d38.js";import"./bee32da7.js";import"./3371a831.js";import"./88061fcd.js";import"./c84885cc.js";import"./5cdb1e6a.js";import"./622cc741.js";import"./6722e641.js";import"./4d256b3b.js";import"./ee65bf86.js";import"./52cbef17.js";import"./5516584c.js";import"./5c8a0a9d.js";import"./a06c5caf.js";customElements.define("lion-options",a);const M=()=>(s(),o`
    <lion-input
      name="value"
      label="Default validation"
      .fieldName="${"value"}"
      .validators="${[new d,new c(4)]}"
      .modelValue="${"foo"}"
    ></lion-input>
    <button @click="${()=>i.locale="de-DE"}">DE</button>
    <button @click="${()=>i.locale="en-GB"}">EN</button>
    <button @click="${()=>i.locale="fr-FR"}">FR</button>
    <button @click="${()=>i.locale="nl-NL"}">NL</button>
    <button @click="${()=>i.locale="zh-CN"}">CN</button>
  `),N=()=>o`
  <lion-input .validators="${[new d]}" label="Required" .fieldName="value"></lion-input>
`,E=()=>o`
  <lion-input
    .validators="${[new u(7)]}"
    .modelValue="${"not exactly"}"
    label="EqualsLength"
  ></lion-input>
  <lion-input
    .validators="${[new c(10)]}"
    .modelValue="${"too short"}"
    label="MinLength"
  ></lion-input>
  <lion-input
    .validators="${[new m(7)]}"
    .modelValue="${"too long"}"
    label="MaxLength"
  ></lion-input>
  <lion-input
    .validators="${[new p({min:10,max:20})]}"
    .modelValue="${"that should be enough"}"
    label="MinMaxLength"
  ></lion-input>
  <lion-input
    .validators="${[new b(/#LionRocks/)]}"
    .modelValue="${'regex checks if "#Lion<NO SPACE>Rocks" is in this input #LionRocks'}"
    label="Pattern"
  ></lion-input>
`,D=()=>o`
  <lion-input-amount
    .validators="${[new h]}"
    .modelValue="${"foo"}"
    label="IsNumber"
  ></lion-input-amount>
  <lion-input-amount
    .validators="${[new g(7)]}"
    .modelValue="${5}"
    label="MinNumber"
  ></lion-input-amount>
  <lion-input-amount
    .validators="${[new $(7)]}"
    .modelValue="${9}"
    label="MaxNumber"
  ></lion-input-amount>
  <lion-input-amount
    .validators="${[new k({min:10,max:20})]}"
    .modelValue="${5}"
    label="MinMaxNumber"
  ></lion-input-amount>
`,I=()=>{const e=new Date,t=e.getFullYear(),a=e.getMonth(),i=e.getDate(),n=new Date(t,a,i-1),l=new Date(t,a,i+1);return o`
    <lion-input-date
      .validators="${[new w]}"
      .modelValue="${"foo"}"
      label="IsDate"
    ></lion-input-date>
    <lion-input-date
      .validators="${[new V(e)]}"
      .modelValue="${new Date(n)}"
      label="MinDate"
    ></lion-input-date>
    <lion-input-date
      .validators="${[new v(e)]}"
      .modelValue="${new Date(l)}"
      label="MaxDate"
    ></lion-input-date>
    <lion-input-date
      .validators="${[new j({min:new Date(n),max:new Date(l)})]}"
      .modelValue="${new Date(e)}"
      label="MinMaxDate"
    ></lion-input-date>
  `},R=()=>o`
  <lion-input-email
    .validators="${[new f]}"
    .modelValue="${"foo"}"
    label="IsEmail"
  ></lion-input-email>
`,F=()=>o`
  <lion-input
    .validators="${[new u(4,{getMessage:()=>"4 chars please..."})]}"
    .modelValue="${"123"}"
    label="Custom message for validator instance"
  ></lion-input>
  <lion-input
    .validators="${[new u(4,{getMessage:({modelValue:e,params:t})=>{const o=e.length-t;return`${Math.abs(o)} too ${o>0?"much":"few"}...`}})]}"
    .modelValue="${"way too much"}"
    label="Dynamic message for validator instance"
  ></lion-input>
`,C=()=>o`
  <lion-input
    .validators="${[new u(4,{getMessage:()=>o`<div><b>Note</b> 4 chars please...</div>`})]}"
    .modelValue="${"123"}"
    label="Custom message for validator instance"
  ></lion-input>
`,P=()=>o`
  <lion-input
    .validators="${[new u(4,{fieldName:"custom fieldName"})]}"
    .modelValue="${"123"}"
    label="Custom fieldName for 1 validator"
  ></lion-input>
  <lion-input
    .validators="${[new d,new u(4)]}"
    .fieldName="${"custom fieldName"}"
    .modelValue="${"123"}"
    label="Custom fieldName for all validators"
  ></lion-input>
`,S=()=>{const e=/^([A-Z]\.)+$/;return o`
    <lion-input
      label="Initials"
      name="initials"
      .validators="${[new class extends n{static get validatorName(){return"IsExampleInitials"}execute(t){let o=!1;return!(new y).execute(t)&&e.test(t)||(o=!0),o}static getMessage({fieldName:e}){return`Please enter a valid ${e} in the format "L.I.".`}}("mine")]}"
    ></lion-input>
  `},L=()=>o`
    <lion-checkbox-group
      id="scientists"
      name="scientists[]"
      label="Favorite scientists"
      .validators="${[new d]}"
    >
      <lion-checkbox label="Archimedes" .choiceValue="${"Archimedes"}"></lion-checkbox>
      <lion-checkbox label="Francis Bacon" .choiceValue="${"Francis Bacon"}"></lion-checkbox>
      <lion-checkbox label="Marie Curie" .choiceValue="${"Marie Curie"}"></lion-checkbox>
    </lion-checkbox-group>
    <button @click="${e=>(e=>{const t=e.target.parentElement.querySelector("#scientists");t.submitted=!t.submitted})(e)}">Validate</button>
  `,q=()=>o`
    <lion-checkbox-group
      id="scientists2"
      name="scientists2[]"
      label="Favorite scientists"
      help-text="You should have at least 2 of those"
      .validators="${[new d,new class extends n{execute(e){return e.length<2}static get validatorName(){return"HasMinTwoChecked"}static async getMessage(){return"You need to select at least 2 values."}}]}"
    >
      <lion-checkbox label="Archimedes" .choiceValue="${"Archimedes"}"></lion-checkbox>
      <lion-checkbox label="Francis Bacon" .choiceValue="${"Francis Bacon"}"></lion-checkbox>
      <lion-checkbox label="Marie Curie" .choiceValue="${"Marie Curie"}"></lion-checkbox>
    </lion-checkbox-group>
    <button @click="${e=>(e=>{const t=e.target.parentElement.querySelector("#scientists2");t.submitted=!t.submitted})(e)}">Validate</button>
  `,A=()=>o`
    <lion-radio-group
      id="dinos1"
      name="dinos1"
      label="Favourite dinosaur"
      .validators="${[new d]}"
    >
      <lion-radio label="allosaurus" .choiceValue="${"allosaurus"}"></lion-radio>
      <lion-radio label="brontosaurus" .choiceValue="${"brontosaurus"}"></lion-radio>
      <lion-radio label="diplodocus" .choiceValue="${"diplodocus"}"></lion-radio>
    </lion-radio-group>
    <button @click="${e=>(e=>{const t=e.target.parentElement.querySelector("#dinos1");t.submitted=!t.submitted})(e)}">Validate</button>
  `,B=()=>o`
    <lion-radio-group
      id="dinos2"
      name="dinos2"
      label="Favourite dinosaur"
      .validators="${[new d,new class extends n{static get validatorName(){return"IsBrontosaurus"}execute(e){let t=!1;return"brontosaurus"!==e&&(t=!0),t}static async getMessage(){return'You need to select "brontosaurus"'}}]}"
    >
      <lion-radio label="allosaurus" .choiceValue="${"allosaurus"}"></lion-radio>
      <lion-radio label="brontosaurus" .choiceValue="${"brontosaurus"}"></lion-radio>
      <lion-radio label="diplodocus" .choiceValue="${"diplodocus"}"></lion-radio>
    </lion-radio-group>
    <button @click="${e=>(e=>{const t=e.target.parentElement.querySelector("#dinos2");t.submitted=!t.submitted})(e)}">Validate</button>
  `,U=()=>o`
  <lion-combobox .validators="${[new d]}" name="favoriteMovie" label="Favorite movie">
    <lion-option checked .choiceValue="${"Rocky"}">Rocky</lion-option>
    <lion-option .choiceValue="${"Rocky II"}">Rocky II</lion-option>
    <lion-option .choiceValue="${"Rocky III"}">Rocky III</lion-option>
    <lion-option .choiceValue="${"Rocky IV"}">Rocky IV</lion-option>
    <lion-option .choiceValue="${"Rocky V"}">Rocky V</lion-option>
    <lion-option .choiceValue="${"Rocky Balboa"}">Rocky Balboa</lion-option>
  </lion-combobox>
`,T=()=>{try{class e extends l{static get validationTypes(){return["error","warning","info","success"]}}customElements.define("my-types-input",e)}catch(e){}return o`
    <style>
      .demo-types-input {
        padding: 0.5rem;
      }
      .demo-types-input[shows-feedback-for~='success'] {
        background-color: #e4ffe4;
        border: 1px solid green;
      }
      .demo-types-input[shows-feedback-for~='error'] {
        background-color: #ffd4d4;
        border: 1px solid red;
      }
      .demo-types-input[shows-feedback-for~='warning'] {
        background-color: #ffe4d4;
        border: 1px solid orange;
      }
      .demo-types-input[shows-feedback-for~='info'] {
        background-color: #d4e4ff;
        border: 1px solid blue;
      }
    </style>
    <my-types-input
      .validators="${[new d,new c(7,{type:"warning"}),new m(10,{type:"info",getMessage:()=>"Please, keep the length below the 10 characters."}),new r]}"
      .modelValue="${"exactly"}"
      label="Validation Types"
      class="demo-types-input"
    ></my-types-input>
  `},G=()=>o`
    <style>
      lion-input[is-pending] {
        opacity: 0.5;
      }
    </style>
    <lion-input
      label="Async validation"
      .validators="${[new class extends n{constructor(...e){super(...e)}static get validatorName(){return"asyncValidator"}static get async(){return!0}async execute(){return console.log("async pending..."),await function(e=0){return new Promise(t=>{setTimeout(()=>{t()},e)})}(2e3),console.log("async done..."),!0}static getMessage({modelValue:e}){return`validated for modelValue: ${e}...`}}]}"
      .modelValue="${"123"}"
    ></lion-input>
  `,Y=()=>{const e=new Date("09/09/1990"),t=new V(e,{message:"Fill in a date after your birth date"});return o`
    <lion-input-date
      label="Birth date"
      help-text="Adjust this date to retrigger validation of the input below..."
      .modelValue="${e}"
      @model-value-changed="${({target:{modelValue:e,errorState:o}})=>{o||(t.param=e)}}"
    ></lion-input-date>
    <lion-input-date
      label="Graduation date"
      .modelValue="${new Date("09/09/1989")}"
      .validators="${[t]}"
    ></lion-input-date>
  `},O=()=>o`
  <lion-input
    disabled
    .validators="${[new u(7)]}"
    .modelValue="${"not exactly"}"
    label="EqualsLength"
  ></lion-input>
`,z=()=>{let e,t="Unknown Error",a=!1;return o`
    <style>
      lion-input[is-pending] {
        opacity: 0.5;
      }
    </style>
    <lion-form @submit="${o=>{const i=o.target;if(i.hasFeedbackFor.includes("error")){return void i.formElements.find(e=>e.hasFeedbackFor.includes("error")).focus()}a=!0,i.formElements.username.validate();(function(e=0,t=!1){return new Promise(o=>{setTimeout(()=>{o(new Response(JSON.stringify({message:t?"Username is already taken":""}),{status:t?400:200}))},e)})})(2e3,i.serializedValue.simulateError.length).then(async o=>{200!==o.status&&(t=(await o.json())?.message,e(!0)),e(!1),a=!1})}}">
      <form>
        <lion-input
          label="username"
          name="username"
          .validators="${[new class extends n{static get validatorName(){return"backendValidator"}static get async(){return!0}async execute(){return!!a&&await new Promise(t=>e=t)}static getMessage({fieldName:e,modelValue:o,params:a}){return t}}(""),new d]}"
          .modelValue="${""}"
        ></lion-input>
        <lion-checkbox-group name="simulateError">
          <lion-checkbox label="Check to simulate a backend error"></lion-checkbox>
        </lion-checkbox-group>
        <lion-button-submit>Submit</lion-button-submit>
      </form>
    </lion-form>
  `},H=e=>e&&!(e instanceof x);class J extends n{static get validatorName(){return"Interval"}execute({startDate:e,endDate:t}){return!(!H(e)||!H(t))&&!(e<t)}static async getMessage(){return"The start date should be before the end date"}}const K=()=>o`
  <lion-fieldset .validators="${[new J]}">
    <lion-input-date name="startDate" label="Start date"></lion-input-date>
    <lion-input-date name="endDate" label="End date"></lion-input-date>
  </lion-fieldset>
`,W=e=>e&&!(e instanceof x);class Z extends n{static get validatorName(){return"PasswordsMatch"}execute(e,{first:t,second:o}){return!(!W(t.modelValue)||!W(o.modelValue))&&t.modelValue!==o.modelValue}}class Q extends(e(t)){static get scopedElements(){return{"lion-input":l}}firstUpdated(){const e=this.renderRoot.querySelector('[name="initialPassword"]'),t=this.renderRoot.querySelector('[name="confirmPassword"]');e.validators=[new Z({first:e,second:t},{getMessage:()=>"Please match with confirmation field"})],t.validators=[new Z({first:e,second:t},{getMessage:()=>"Please match with initial field"})]}render(){return o`
      <lion-input type="password" name="initialPassword" label="New password"></lion-input>
      <lion-input type="password" name="confirmPassword" label="Confirm password"></lion-input>
    `}}customElements.define("field-with-context-validation",Q);const X=()=>o`<field-with-context-validation></field-with-context-validation>`,_=document,ee=[{key:"defaultValidationMessages",story:M},{key:"requiredValidator",story:N},{key:"stringValidators",story:E},{key:"numberValidators",story:D},{key:"dateValidators",story:I},{key:"emailValidator",story:R},{key:"defaultMessages",story:F},{key:"defaultMessagesWithCustomHtml",story:C},{key:"overrideFieldName",story:P},{key:"customValidators",story:S},{key:"checkboxValidation",story:L},{key:"checkboxValidationAdvanced",story:q},{key:"radioValidation",story:A},{key:"radioValidationAdvanced",story:B},{key:"validationCombobox",story:U},{key:"validationTypes",story:T},{key:"asynchronousValidation",story:G},{key:"dynamicParameterChange",story:Y},{key:"disabledInputsValidation",story:O},{key:"backendValidation",story:z},{key:"fieldsetValidation",story:K},{key:"multipleFieldValidation",story:X}];let te=!1;for(const e of ee){const t=_.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,te=!0,Object.assign(t,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}te&&(customElements.get("mdjs-preview")||import("./24735558.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{G as asynchronousValidation,z as backendValidation,L as checkboxValidation,q as checkboxValidationAdvanced,S as customValidators,I as dateValidators,F as defaultMessages,C as defaultMessagesWithCustomHtml,M as defaultValidationMessages,O as disabledInputsValidation,Y as dynamicParameterChange,R as emailValidator,K as fieldsetValidation,X as multipleFieldValidation,D as numberValidators,P as overrideFieldName,A as radioValidation,B as radioValidationAdvanced,N as requiredValidator,E as stringValidators,U as validationCombobox,T as validationTypes};
