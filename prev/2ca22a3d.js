import"./f1151d68.js";import{x as e}from"./b8bc2eda.js";import"./6638bb86.js";import"./822ba771.js";import"./f196d21a.js";import"./fe4ab3982.js";import{r as t}from"./8df0a0f4.js";import{R as o}from"./cc85a6f4.js";import{M as i}from"./b7f85193.js";import{U as a}from"./4abf0ca8.js";import{V as r}from"./4dc0ac82.js";import"./45058e5d.js";import"./57941646.js";import"./dc2f5f5a.js";import"./7eab6f7c.js";import"./4058fa1a.js";import"./0e597667.js";import"./1069d12c.js";import"./7c882590.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./895f5d38.js";import"./c48d90f3.js";import"./be5f2fd3.js";import"./dcadf410.js";import"./30c0041b.js";import"./92fca6ea.js";import"./af1609b4.js";import"./143fde17.js";import"./622cc741.js";import"./6722e641.js";const s=()=>e`
  <lion-input
    label="Interaction States"
    help-text="Interact with this field to see how dirty, touched and prefilled change"
    .modelValue="${"myValue"}"
  ></lion-input>
  <h-output .show="${["touched","dirty","prefilled","focused","submitted"]}"></h-output>
`,d=()=>{const o=["touched","dirty","prefilled","focused","filled","submitted"];const i=t(e`
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
  `},n=()=>e`
  <lion-input-date
    .validators="${[new o,new i(new Date("2000/10/10"),{getMessage:()=>"You provided a correctly formatted date, but it's below MinData"})]}"
    .feedbackCondition="${(e,t,o)=>!(!t.modelValue||t.modelValue instanceof a)||o(e,t)}"
    help-text="Error appears as soon as a Parseable date before 10/10/2000 is typed"
    label="Custom feedback visibility"
  ></lion-input-date>
`,m=document,l=[{key:"interactionStates",story:s},{key:"feedbackCondition",story:d},{key:"feedbackVisibility",story:n}];let c=!1;for(const e of l){const t=m.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,c=!0,Object.assign(t,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}c&&(customElements.get("mdjs-preview")||import("./e90784d0.js"),customElements.get("mdjs-story")||import("./0defd61d.js"));export{d as feedbackCondition,n as feedbackVisibility,s as interactionStates};
