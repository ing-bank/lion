const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.DYUong5B.js","_astro/node-tools_providence-analytics_overview.LFFQBZzG.js","_astro/lit-element.qDHKJJma.js","_astro/lit-html.C7L4dwLU.js","_astro/unsafe-html.J0GGe2Q7.js","_astro/directive.CGE4aKEl.js","_astro/define.m2CvvXyF.js"])))=>i.map(i=>d[i]);
import{_ as n}from"./preload-helper.4zY6-HO4.js";import"./node-tools_providence-analytics_overview.LFFQBZzG.js";import{i as r}from"./lit-element.qDHKJJma.js";import{x as t}from"./lit-html.C7L4dwLU.js";import"./unsafe-html.J0GGe2Q7.js";import"./lion-select-rich.4O3IF_MO.js";import"./lion-option.DH-BZyL4.js";import"./directive.CGE4aKEl.js";import"./OverlayMixin.yM-HkbSu.js";import"./index.BNCfcFQh.js";import"./lazifyInstantiation.CgYLRMC3.js";import"./dedupeMixin.6XPTJgK8.js";import"./withDropdownConfig.eRP55go6.js";import"./withClickInteraction.B1DPetIk.js";import"./InteractionStateMixin.DC1PvWzb.js";import"./LocalizeMixin.VYu75dkK.js";import"./directive-helpers.CLllgGgm.js";import"./async-directive.CHVe8p0E.js";import"./getLocalizeManager.W5d_ICRU.js";import"./DisabledMixin.Bm1nsErI.js";import"./LionButton.B9nVXwmc.js";import"./DisabledWithTabIndexMixin.DiSGvuwH.js";import"./LionOption.BQfAPcbQ.js";import"./ChoiceGroupMixin.32toKWns.js";import"./FormRegistrarMixin.BUWicw9X.js";import"./ChoiceInputMixin.BjGWftzC.js";const p=()=>t`<lion-select-rich label="Favorite color" name="color">
  <lion-option .choiceValue="${"red"}">
    <p style="color: red;">I am red</p>
    <p>and multi Line</p>
  </lion-option>
  <lion-option .choiceValue="${"hotpink"}" checked>
    <p style="color: hotpink;">I am hotpink</p>
    <p>and multi Line</p>
  </lion-option>
  <lion-option .choiceValue="${"teal"}">
    <p style="color: teal;">I am teal</p>
    <p>and multi Line</p>
  </lion-option>
</lion-select-rich>`,a=()=>{const o=[{value:"red",checked:!1},{value:"hotpink",checked:!0},{value:"teal",checked:!1},{value:"green",checked:!1},{value:"blue",checked:!1}];return t`
  <style>
    #scrollSelectRich lion-options {
      max-height: 200px;
      overflow-y: auto;
      display: block;
    }
  </style>
  <lion-select-rich id="scrollSelectRich" label="Favorite color" name="color">
    <lion-option .modelValue="${o[0]}">
      <p style="color: red;">I am red</p>
    </lion-option>
    <lion-option .modelValue="${o[1]}">
      <p style="color: hotpink;">I am hotpink</p>
    </lion-option>
    <lion-option .modelValue="${o[2]}">
      <p style="color: teal;">I am teal</p>
    </lion-option>
    <lion-option .modelValue="${o[3]}">
      <p style="color: green;">I am green</p>
    </lion-option>
    <lion-option .modelValue"="${o[4]}"">
      <p style="color: blue;">I am blue</p>
    </lion-option>
  </lion-select-rich>
`},s=()=>t`<lion-select-rich label="Read-only select" readonly name="color">
  <lion-option .choiceValue="${"red"}">Red</lion-option>
  <lion-option .choiceValue="${"hotpink"}" checked>Hotpink</lion-option>
  <lion-option .choiceValue="${"teal"}">Teal</lion-option>
</lion-select-rich>`,d=()=>t`<lion-select-rich label="Disabled select" disabled name="color">
  <lion-option .choiceValue="${"red"}">Red</lion-option>
  <lion-option .choiceValue="${"hotpink"}" checked>Hotpink</lion-option>
  <lion-option .choiceValue="${"teal"}">Teal</lion-option>
</lion-select-rich>`,h=()=>t`<lion-select-rich label="Disabled options" name="color">
  <lion-option .choiceValue="${"red"}" disabled>Red</lion-option>
  <lion-option .choiceValue="${"blue"}">Blue</lion-option>
  <lion-option .choiceValue="${"hotpink"}" disabled>Hotpink</lion-option>
  <lion-option .choiceValue="${"green"}">Green</lion-option>
  <lion-option .choiceValue="${"teal"}" disabled>Teal</lion-option>
</lion-select-rich>`,m=({shadowRoot:o})=>{const e=[{type:"mastercard",label:"Master Card",amount:12e3,active:!0},{type:"visacard",label:"Visa Card",amount:0,active:!1}];function l(i){o.querySelector("#demoRenderOutput").innerHTML=JSON.stringify(i.target.modelValue,null,2)}return t`
    <lion-select-rich label="Credit Card" name="color" @model-value-changed="${l}">
      ${e.map(i=>t` <lion-option .choiceValue="${i}">${i.label}</lion-option> `)}
    </lion-select-rich>
    <p>Full value:</p>
    <pre id="demoRenderOutput"></pre>
  `},u=()=>t`<lion-select-rich label="Mac mode" name="color" interaction-mode="mac">
  <lion-option .choiceValue="${"red"}">Red</lion-option>
  <lion-option .choiceValue="${"hotpink"}" checked>Hotpink</lion-option>
  <lion-option .choiceValue="${"teal"}">Teal</lion-option>
</lion-select-rich>
<lion-select-rich label="Windows/Linux mode" name="color" interaction-mode="windows/linux">
  <lion-option .choiceValue="${"red"}">Red</lion-option>
  <lion-option .choiceValue="${"hotpink"}" checked>Hotpink</lion-option>
  <lion-option .choiceValue="${"teal"}">Teal</lion-option>
</lion-select-rich>`,y=({shadowRoot:o})=>t`
  <style>
    .log-button {
      margin: 10px 0;
    }
  </style>
  <div>
    <label id="label-richSelectCheckedInput" for="richSelectCheckedInput">
      Set the checkedIndex
    </label>
    <input
      id="richSelectCheckedInput"
      aria-labelledby="label-richSelectCheckedInput"
      type="number"
      @change=${e=>{const l=o.querySelector("#checkedRichSelect");l.checkedIndex=Number(e.target.value)}}
    />
  </div>
  <button
    class="log-button"
    @click=${()=>{const e=o.querySelector("#checkedRichSelect");console.log(`checkedIndex: ${e.checkedIndex}`),console.log(`modelValue: ${e.modelValue}`)}}
  >
    Console log checked index and value
  </button>
  <lion-select-rich id="checkedRichSelect" name="favoriteColor" label="Favorite color">
    <lion-option .choiceValue="${"red"}">Red</lion-option>
    <lion-option .choiceValue="${"hotpink"}" checked>Hotpink</lion-option>
    <lion-option .choiceValue="${"teal"}">Teal</lion-option>
  </lion-select-rich>
`,k=()=>t`<lion-select-rich name="favoriteColor" label="Favorite color" has-no-default-selected>
  <lion-option .choiceValue="${"red"}">Red</lion-option>
  <lion-option .choiceValue="${"hotpink"}">Hotpink</lion-option>
  <lion-option .choiceValue="${"teal"}">Teal</lion-option>
</lion-select-rich>`,$=()=>t`<lion-select-rich label="Single Option" name="color">
  <lion-option .choiceValue="${"red"}">Red</lion-option>
</lion-select-rich>`;class b extends r{static get properties(){return{options:{type:Array}}}constructor(){super(),this.options=["Option 1","Option 2"]}render(){return t`
      <button @click="${this.addOption}">Add an option</button>
      <button @click="${this.removeOption}">Remove last option</button>
      <lion-select-rich name="favoriteColor" label="Favorite color">
        <lion-options slot="input">
          ${this.options.map(e=>t` <lion-option .choiceValue="${e}">${e}</lion-option> `)}
        </lion-options>
      </lion-select-rich>
    `}addOption(){this.options.push(`Option ${this.options.length+1} with a long title`),this.options=[...this.options],this.requestUpdate()}removeOption(){this.options.length>=2&&(this.options.pop(),this.options=[...this.options],this.requestUpdate())}}customElements.define("single-option-remove-add",b);const V=()=>t`<single-option-remove-add></single-option-remove-add>`,g=document,v=[{key:"HtmlStory31",story:p},{key:"manyOptionsWithScrolling",story:a},{key:"HtmlStory32",story:s},{key:"HtmlStory33",story:d},{key:"HtmlStory34",story:h},{key:"renderOptions",story:m},{key:"HtmlStory35",story:u},{key:"checkedIndexAndValue",story:y},{key:"HtmlStory36",story:k},{key:"HtmlStory37",story:$},{key:"singleOptionRemoveAdd",story:V}];let c=!1;for(const o of v){const e=g.querySelector(`[mdjs-story-name="${o.key}"]`);e&&(e.story=o.story,e.key=o.key,c=!0,Object.assign(e,{simulatorUrl:"/next/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}c&&(customElements.get("mdjs-preview")||n(()=>import("./define.DYUong5B.js"),__vite__mapDeps([0,1,2,3,4,5])),customElements.get("mdjs-story")||n(()=>import("./define.m2CvvXyF.js"),__vite__mapDeps([6,2,3])));export{p as HtmlStory31,s as HtmlStory32,d as HtmlStory33,h as HtmlStory34,u as HtmlStory35,k as HtmlStory36,$ as HtmlStory37,y as checkedIndexAndValue,a as manyOptionsWithScrolling,m as renderOptions,V as singleOptionRemoveAdd};
