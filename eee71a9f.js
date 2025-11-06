import"./24f95583.js";import{x as e}from"./b4be29f1.js";import"./05905ff1.js";import"./c7db7091.js";import"./0b376712.js";import"./74b104922.js";import{r as t}from"./9795287e.js";import{R as o}from"./cc85a6f4.js";import{M as i}from"./b7f85193.js";import{U as a}from"./c6fab747.js";import{V as r}from"./4dc0ac82.js";import"./c2aef983.js";import"./7077221a.js";import"./dc2f5f5a.js";import"./f12ecf0e.js";import"./43bc0982.js";import"./ee959851.js";import"./24c57689.js";import"./d45984a3.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./895f5d38.js";import"./4cc99b59.js";import"./19d2607c.js";import"./afb8834e.js";import"./bbaa6280.js";import"./bfba5e5f.js";import"./ec06148e.js";import"./143fde17.js";import"./622cc741.js";const s=()=>e`
  <lion-input
    label="Interaction States"
    help-text="Interact with this field to see how dirty, touched and prefilled change"
    .modelValue="${"myValue"}"
  ></lion-input>
  <h-output .show="${["touched","dirty","prefilled","focused","submitted"]}"></h-output>
`,n=()=>{const o=["touched","dirty","prefilled","focused","filled","submitted"];const i=t(e`
    <lion-input
      name="interactionField"
      label="Only an odd amount of characters allowed"
      help-text="Change feedback condition"
      .modelValue="${"notodd"}"
      .validators="${[new class extends r{static get validatorName(){return"OddValidator"}execute(e){let t=!1;return e.length%2==0&&(t=!0),t}_getMessage(){return"Add or remove one character"}}]}"
    ></lion-input>
  `);return e`
    <lion-form>
      <form>
        ${i}
        <button>Submit</button>
      </form>
    </lion-form>
    <h-output .field="${i}" .show="${[...o,"hasFeedbackFor"]}"> </h-output>
    <h3>Set conditions for validation feedback visibility</h3>
    <lion-checkbox-group name="props[]" @model-value-changed="${({currentTarget:{modelValue:e}})=>{i._showFeedbackConditionFor=t=>e.every(e=>i[e]),i.validate()}}">
      ${o.map(t=>e` <lion-checkbox .label="${t}" .choiceValue="${t}"> </lion-checkbox> `)}
    </lion-checkbox-group>
  `},d=()=>e`
  <lion-input-date
    .validators="${[new o,new i(new Date("2000/10/10"),{getMessage:()=>"You provided a correctly formatted date, but it's below MinData"})]}"
    .feedbackCondition="${(e,t,o)=>!(!t.modelValue||t.modelValue instanceof a)||o(e,t)}"
    help-text="Error appears as soon as a Parseable date before 10/10/2000 is typed"
    label="Custom feedback visibility"
  ></lion-input-date>
`,l=document,m=[{key:"interactionStates",story:s},{key:"feedbackCondition",story:n},{key:"feedbackVisibility",story:d}];let c=!1;for(const e of m){const t=l.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,c=!0,Object.assign(t,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}c&&(customElements.get("mdjs-preview")||import("./a7b4f51b.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{n as feedbackCondition,d as feedbackVisibility,s as interactionStates};
