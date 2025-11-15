import"./24f95583.js";import{x as e}from"./b4be29f1.js";import"./05905ff1.js";import"./9cfd5457.js";import"./4de68b8d.js";import"./d3a1c786.js";import"./ee0e4c4a.js";import"./a748cc9c.js";import"./f8f7a3e5.js";import"./b603a46a.js";import"./f59d9df7.js";import"./2fd6213a.js";import"./90702e3a.js";import"./75c653c2.js";import"./f5e3cf69.js";import"./58700fdc.js";import"./8763e36e.js";import{b as t}from"./b494bfc1.js";import"./b57227cf.js";import"./5e7ff1cd.js";import"./01fe287e.js";import"./86d0ae84.js";import{l as o}from"./573dde6f.js";import{V as a}from"./4dc0ac82.js";import{r as i}from"./9795287e.js";import{l as n,D as l}from"./c85cfbca.js";import{R as s}from"./cc85a6f4.js";import{M as r,E as d,a as c,b as u,P as m,I as p,c as b}from"./48ac1cb5.js";import{I as f,M as y,a as h,b as g}from"./e49751c9.js";import{I as $,M as k,a as w,b as V}from"./b7f85193.js";import{L as v}from"./4a239ef1.js";import{U as j}from"./7902d8e0.js";import"./0bf7a48d.js";import"./48b0a907.js";import"./dc2f5f5a.js";import"./788d808c.js";import"./143fde17.js";import"./130d2801.js";import"./9b4d17c9.js";import"./4cc99b59.js";import"./19d2607c.js";import"./afb8834e.js";import"./d45984a3.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./65cdf028.js";import"./acda6ea6.js";import"./0ed5d59c.js";import"./459b1eec.js";import"./9e1b447d.js";import"./5668bf4f.js";import"./88185952.js";import"./24c57689.js";import"./10e1d49e.js";import"./81eca363.js";import"./ee959851.js";import"./895f5d38.js";import"./bee32da7.js";import"./5254a80b.js";import"./88061fcd.js";import"./c84885cc.js";import"./5cdb1e6a.js";import"./622cc741.js";import"./de5cbd7c.js";import"./298b3bc0.js";import"./5287c897.js";import"./5516584c.js";import"./9157d4cc.js";import"./a06c5caf.js";customElements.define("lion-options",t);const x=()=>(n(),e`
    <lion-input
      name="value"
      label="Default validation"
      .fieldName="${"value"}"
      .validators="${[new s,new r(4)]}"
      .modelValue="${"foo"}"
    ></lion-input>
    <button @click="${()=>o.locale="de-DE"}">DE</button>
    <button @click="${()=>o.locale="en-GB"}">EN</button>
    <button @click="${()=>o.locale="fr-FR"}">FR</button>
    <button @click="${()=>o.locale="nl-NL"}">NL</button>
    <button @click="${()=>o.locale="zh-CN"}">CN</button>
  `),M=()=>e`
  <lion-input .validators="${[new s]}" label="Required" .fieldName="value"></lion-input>
`,N=()=>e`
  <lion-input
    .validators="${[new d(7)]}"
    .modelValue="${"not exactly"}"
    label="EqualsLength"
  ></lion-input>
  <lion-input
    .validators="${[new r(10)]}"
    .modelValue="${"too short"}"
    label="MinLength"
  ></lion-input>
  <lion-input
    .validators="${[new c(7)]}"
    .modelValue="${"too long"}"
    label="MaxLength"
  ></lion-input>
  <lion-input
    .validators="${[new u({min:10,max:20})]}"
    .modelValue="${"that should be enough"}"
    label="MinMaxLength"
  ></lion-input>
  <lion-input
    .validators="${[new m(/#LionRocks/)]}"
    .modelValue="${'regex checks if "#Lion<NO SPACE>Rocks" is in this input #LionRocks'}"
    label="Pattern"
  ></lion-input>
`,D=()=>e`
  <lion-input-amount
    .validators="${[new f]}"
    .modelValue="${"foo"}"
    label="IsNumber"
  ></lion-input-amount>
  <lion-input-amount
    .validators="${[new y(7)]}"
    .modelValue="${5}"
    label="MinNumber"
  ></lion-input-amount>
  <lion-input-amount
    .validators="${[new h(7)]}"
    .modelValue="${9}"
    label="MaxNumber"
  ></lion-input-amount>
  <lion-input-amount
    .validators="${[new g({min:10,max:20})]}"
    .modelValue="${5}"
    label="MinMaxNumber"
  ></lion-input-amount>
`,E=()=>{const t=new Date,o=t.getFullYear(),a=t.getMonth(),i=t.getDate(),n=new Date(o,a,i-1),l=new Date(o,a,i+1);return e`
    <lion-input-date
      .validators="${[new $]}"
      .modelValue="${"foo"}"
      label="IsDate"
    ></lion-input-date>
    <lion-input-date
      .validators="${[new k(t)]}"
      .modelValue="${new Date(n)}"
      label="MinDate"
    ></lion-input-date>
    <lion-input-date
      .validators="${[new w(t)]}"
      .modelValue="${new Date(l)}"
      label="MaxDate"
    ></lion-input-date>
    <lion-input-date
      .validators="${[new V({min:new Date(n),max:new Date(l)})]}"
      .modelValue="${new Date(t)}"
      label="MinMaxDate"
    ></lion-input-date>
  `},I=()=>e`
  <lion-input-email
    .validators="${[new p]}"
    .modelValue="${"foo"}"
    label="IsEmail"
  ></lion-input-email>
`,R=()=>e`
  <lion-input
    .validators="${[new d(4,{getMessage:()=>"4 chars please..."})]}"
    .modelValue="${"123"}"
    label="Custom message for validator instance"
  ></lion-input>
  <lion-input
    .validators="${[new d(4,{getMessage:({modelValue:e,params:t})=>{const o=e.length-t;return`${Math.abs(o)} too ${o>0?"much":"few"}...`}})]}"
    .modelValue="${"way too much"}"
    label="Dynamic message for validator instance"
  ></lion-input>
`,C=()=>e`
  <lion-input
    .validators="${[new d(4,{getMessage:()=>e`<div><b>Note</b> 4 chars please...</div>`})]}"
    .modelValue="${"123"}"
    label="Custom message for validator instance"
  ></lion-input>
`,F=()=>e`
  <lion-input
    .validators="${[new d(4,{fieldName:"custom fieldName"})]}"
    .modelValue="${"123"}"
    label="Custom fieldName for 1 validator"
  ></lion-input>
  <lion-input
    .validators="${[new s,new d(4)]}"
    .fieldName="${"custom fieldName"}"
    .modelValue="${"123"}"
    label="Custom fieldName for all validators"
  ></lion-input>
`,P=()=>{const t=/^([A-Z]\.)+$/;return e`
    <lion-input
      label="Initials"
      name="initials"
      .validators="${[new class extends a{static get validatorName(){return"IsExampleInitials"}execute(e){let o=!1;return!(new b).execute(e)&&t.test(e)||(o=!0),o}static getMessage({fieldName:e}){return`Please enter a valid ${e} in the format "L.I.".`}}("mine")]}"
    ></lion-input>
  `},L=()=>e`
    <lion-checkbox-group
      id="scientists"
      name="scientists[]"
      label="Favorite scientists"
      .validators="${[new s]}"
    >
      <lion-checkbox label="Archimedes" .choiceValue="${"Archimedes"}"></lion-checkbox>
      <lion-checkbox label="Francis Bacon" .choiceValue="${"Francis Bacon"}"></lion-checkbox>
      <lion-checkbox label="Marie Curie" .choiceValue="${"Marie Curie"}"></lion-checkbox>
    </lion-checkbox-group>
    <button @click="${e=>(e=>{const t=e.target.parentElement.querySelector("#scientists");t.submitted=!t.submitted})(e)}">Validate</button>
  `,S=()=>e`
    <lion-checkbox-group
      id="scientists2"
      name="scientists2[]"
      label="Favorite scientists"
      help-text="You should have at least 2 of those"
      .validators="${[new s,new class extends a{execute(e){return e.length<2}static get validatorName(){return"HasMinTwoChecked"}static async getMessage(){return"You need to select at least 2 values."}}]}"
    >
      <lion-checkbox label="Archimedes" .choiceValue="${"Archimedes"}"></lion-checkbox>
      <lion-checkbox label="Francis Bacon" .choiceValue="${"Francis Bacon"}"></lion-checkbox>
      <lion-checkbox label="Marie Curie" .choiceValue="${"Marie Curie"}"></lion-checkbox>
    </lion-checkbox-group>
    <button @click="${e=>(e=>{const t=e.target.parentElement.querySelector("#scientists2");t.submitted=!t.submitted})(e)}">Validate</button>
  `,A=()=>e`
    <lion-radio-group
      id="dinos1"
      name="dinos1"
      label="Favourite dinosaur"
      .validators="${[new s]}"
    >
      <lion-radio label="allosaurus" .choiceValue="${"allosaurus"}"></lion-radio>
      <lion-radio label="brontosaurus" .choiceValue="${"brontosaurus"}"></lion-radio>
      <lion-radio label="diplodocus" .choiceValue="${"diplodocus"}"></lion-radio>
    </lion-radio-group>
    <button @click="${e=>(e=>{const t=e.target.parentElement.querySelector("#dinos1");t.submitted=!t.submitted})(e)}">Validate</button>
  `,B=()=>e`
    <lion-radio-group
      id="dinos2"
      name="dinos2"
      label="Favourite dinosaur"
      .validators="${[new s,new class extends a{static get validatorName(){return"IsBrontosaurus"}execute(e){let t=!1;return"brontosaurus"!==e&&(t=!0),t}static async getMessage(){return'You need to select "brontosaurus"'}}]}"
    >
      <lion-radio label="allosaurus" .choiceValue="${"allosaurus"}"></lion-radio>
      <lion-radio label="brontosaurus" .choiceValue="${"brontosaurus"}"></lion-radio>
      <lion-radio label="diplodocus" .choiceValue="${"diplodocus"}"></lion-radio>
    </lion-radio-group>
    <button @click="${e=>(e=>{const t=e.target.parentElement.querySelector("#dinos2");t.submitted=!t.submitted})(e)}">Validate</button>
  `,q=()=>e`
  <lion-combobox .validators="${[new s]}" name="favoriteMovie" label="Favorite movie">
    <lion-option checked .choiceValue="${"Rocky"}">Rocky</lion-option>
    <lion-option .choiceValue="${"Rocky II"}">Rocky II</lion-option>
    <lion-option .choiceValue="${"Rocky III"}">Rocky III</lion-option>
    <lion-option .choiceValue="${"Rocky IV"}">Rocky IV</lion-option>
    <lion-option .choiceValue="${"Rocky V"}">Rocky V</lion-option>
    <lion-option .choiceValue="${"Rocky Balboa"}">Rocky Balboa</lion-option>
  </lion-combobox>
`,T=()=>{try{class e extends v{static get validationTypes(){return["error","warning","info","success"]}}customElements.define("my-types-input",e)}catch(e){}return e`
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
      .validators="${[new s,new r(7,{type:"warning"}),new c(10,{type:"info",getMessage:()=>"Please, keep the length below the 10 characters."}),new l]}"
      .modelValue="${"exactly"}"
      label="Validation Types"
      class="demo-types-input"
    ></my-types-input>
  `},U=()=>e`
    <style>
      lion-input[is-pending] {
        opacity: 0.5;
      }
    </style>
    <lion-input
      label="Async validation"
      .validators="${[new class extends a{constructor(...e){super(...e)}static get validatorName(){return"asyncValidator"}static get async(){return!0}async execute(){return console.log("async pending..."),await function(e=0){return new Promise(t=>{setTimeout(()=>{t()},e)})}(2e3),console.log("async done..."),!0}static getMessage({modelValue:e}){return`validated for modelValue: ${e}...`}}]}"
      .modelValue="${"123"}"
    ></lion-input>
  `,G=()=>{const t=new Date("09/09/1990"),o=new k(t,{message:"Fill in a date after your birth date"});return e`
    <lion-input-date
      label="Birth date"
      help-text="Adjust this date to retrigger validation of the input below..."
      .modelValue="${t}"
      @model-value-changed="${({target:{modelValue:e,errorState:t}})=>{t||(o.param=e)}}"
    ></lion-input-date>
    <lion-input-date
      label="Graduation date"
      .modelValue="${new Date("09/09/1989")}"
      .validators="${[o]}"
    ></lion-input-date>
  `},Y=()=>e`
  <lion-input
    disabled
    .validators="${[new d(7)]}"
    .modelValue="${"not exactly"}"
    label="EqualsLength"
  ></lion-input>
`,O=()=>{let t,o="Unknown Error",i=!1;return e`
    <style>
      lion-input[is-pending] {
        opacity: 0.5;
      }
    </style>
    <lion-form @submit="${e=>{const a=e.target;if(a.hasFeedbackFor.includes("error")){return void a.formElements.find(e=>e.hasFeedbackFor.includes("error")).focus()}i=!0,a.formElements.username.validate();(function(e=0,t=!1){return new Promise(o=>{setTimeout(()=>{o(new Response(JSON.stringify({message:t?"Username is already taken":""}),{status:t?400:200}))},e)})})(2e3,a.serializedValue.simulateError.length).then(async e=>{200!==e.status&&(o=(await e.json())?.message,t(!0)),t(!1),i=!1})}}">
      <form>
        <lion-input
          label="username"
          name="username"
          .validators="${[new class extends a{static get validatorName(){return"backendValidator"}static get async(){return!0}async execute(){return!!i&&await new Promise(e=>t=e)}static getMessage({fieldName:e,modelValue:t,params:a}){return o}}(""),new s]}"
          .modelValue="${""}"
        ></lion-input>
        <lion-checkbox-group name="simulateError">
          <lion-checkbox label="Check to simulate a backend error"></lion-checkbox>
        </lion-checkbox-group>
        <lion-button-submit>Submit</lion-button-submit>
      </form>
    </lion-form>
  `},z=e=>e&&!(e instanceof j);class H extends a{static get validatorName(){return"Interval"}execute({startDate:e,endDate:t}){return!(!z(e)||!z(t))&&!(e<t)}static async getMessage(){return"The start date should be before the end date"}}const J=()=>e`
  <lion-fieldset .validators="${[new H]}">
    <lion-input-date name="startDate" label="Start date"></lion-input-date>
    <lion-input-date name="endDate" label="End date"></lion-input-date>
  </lion-fieldset>
`,K=e=>e&&!(e instanceof j);class W extends a{static get validatorName(){return"PasswordsMatch"}execute(e,{first:t,second:o}){return!(!K(t.modelValue)||!K(o.modelValue))&&t.modelValue!==o.modelValue}}const Z=i(e`
  <lion-input
    .feedbackCondition="${(e,t)=>t.focused}"
    type="password"
    name="initialPassword"
    label="New password"
  ></lion-input>
`),Q=i(e`
  <lion-input
    .feedbackCondition="${(e,t)=>t.focused}"
    type="password"
    name="confirmPassword"
    label="Confirm password"
  ></lion-input>
`);Z.validators=[new W({first:Z,second:Q},{getMessage:()=>"Please match with confirmation field"})],Q.validators=[new W({first:Z,second:Q},{getMessage:()=>"Please match with initial field"})];const X=()=>e` ${Z}${Q} `,_=document,ee=[{key:"defaultValidationMessages",story:x},{key:"requiredValidator",story:M},{key:"stringValidators",story:N},{key:"numberValidators",story:D},{key:"dateValidators",story:E},{key:"emailValidator",story:I},{key:"defaultMessages",story:R},{key:"defaultMessagesWithCustomHtml",story:C},{key:"overrideFieldName",story:F},{key:"customValidators",story:P},{key:"checkboxValidation",story:L},{key:"checkboxValidationAdvanced",story:S},{key:"radioValidation",story:A},{key:"radioValidationAdvanced",story:B},{key:"validationCombobox",story:q},{key:"validationTypes",story:T},{key:"asynchronousValidation",story:U},{key:"dynamicParameterChange",story:G},{key:"disabledInputsValidation",story:Y},{key:"backendValidation",story:O},{key:"fieldsetValidation",story:J},{key:"contextValidation",story:X}];let te=!1;for(const e of ee){const t=_.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,te=!0,Object.assign(t,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}te&&(customElements.get("mdjs-preview")||import("./a7b4f51b.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{U as asynchronousValidation,O as backendValidation,L as checkboxValidation,S as checkboxValidationAdvanced,X as contextValidation,P as customValidators,E as dateValidators,R as defaultMessages,C as defaultMessagesWithCustomHtml,x as defaultValidationMessages,Y as disabledInputsValidation,G as dynamicParameterChange,I as emailValidator,J as fieldsetValidation,D as numberValidators,F as overrideFieldName,A as radioValidation,B as radioValidationAdvanced,M as requiredValidator,N as stringValidators,q as validationCombobox,T as validationTypes};
