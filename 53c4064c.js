import"./24f95583.js";import{x as o,i as e}from"./b4be29f1.js";import"./05905ff1.js";import"./01fe287e.js";import"./8763e36e.js";import"./65cdf028.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./dc2f5f5a.js";import"./acda6ea6.js";import"./0ed5d59c.js";import"./7902d8e0.js";import"./d45984a3.js";import"./4cc99b59.js";import"./19d2607c.js";import"./afb8834e.js";import"./143fde17.js";import"./5287c897.js";import"./5516584c.js";import"./b494bfc1.js";import"./0bf7a48d.js";import"./48b0a907.js";import"./130d2801.js";const i=()=>o`<lion-select-rich label="Favorite color" name="color">
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
</lion-select-rich>`,t=()=>{const e=[{value:"red",checked:!1},{value:"hotpink",checked:!0},{value:"teal",checked:!1},{value:"green",checked:!1},{value:"blue",checked:!1}];return o`
  <style>
    #scrollSelectRich lion-options {
      max-height: 200px;
      overflow-y: auto;
      display: block;
    }
  </style>
  <lion-select-rich id="scrollSelectRich" label="Favorite color" name="color">
    <lion-option .modelValue="${e[0]}">
      <p style="color: red;">I am red</p>
    </lion-option>
    <lion-option .modelValue="${e[1]}">
      <p style="color: hotpink;">I am hotpink</p>
    </lion-option>
    <lion-option .modelValue="${e[2]}">
      <p style="color: teal;">I am teal</p>
    </lion-option>
    <lion-option .modelValue="${e[3]}">
      <p style="color: green;">I am green</p>
    </lion-option>
    <lion-option .modelValue"="${e[4]}"">
      <p style="color: blue;">I am blue</p>
    </lion-option>
  </lion-select-rich>
`},l=()=>o`<lion-select-rich label="Read-only select" readonly name="color">
  <lion-option .choiceValue="${"red"}">Red</lion-option>
  <lion-option .choiceValue="${"hotpink"}" checked>Hotpink</lion-option>
  <lion-option .choiceValue="${"teal"}">Teal</lion-option>
</lion-select-rich>`,n=()=>o`<lion-select-rich label="Disabled select" disabled name="color">
  <lion-option .choiceValue="${"red"}">Red</lion-option>
  <lion-option .choiceValue="${"hotpink"}" checked>Hotpink</lion-option>
  <lion-option .choiceValue="${"teal"}">Teal</lion-option>
</lion-select-rich>`,c=()=>o`<lion-select-rich label="Disabled options" name="color">
  <lion-option .choiceValue="${"red"}" disabled>Red</lion-option>
  <lion-option .choiceValue="${"blue"}">Blue</lion-option>
  <lion-option .choiceValue="${"hotpink"}" disabled>Hotpink</lion-option>
  <lion-option .choiceValue="${"green"}">Green</lion-option>
  <lion-option .choiceValue="${"teal"}" disabled>Teal</lion-option>
</lion-select-rich>`,a=({shadowRoot:e})=>o`
    <lion-select-rich label="Credit Card" name="color" @model-value-changed="${function(o){e.querySelector("#demoRenderOutput").innerHTML=JSON.stringify(o.target.modelValue,null,2)}}">
      ${[{type:"mastercard",label:"Master Card",amount:12e3,active:!0},{type:"visacard",label:"Visa Card",amount:0,active:!1}].map(e=>o` <lion-option .choiceValue="${e}">${e.label}</lion-option> `)}
    </lion-select-rich>
    <p>Full value:</p>
    <pre id="demoRenderOutput"></pre>
  `,p=()=>o`<lion-select-rich label="Mac mode" name="color" interaction-mode="mac">
  <lion-option .choiceValue="${"red"}">Red</lion-option>
  <lion-option .choiceValue="${"hotpink"}" checked>Hotpink</lion-option>
  <lion-option .choiceValue="${"teal"}">Teal</lion-option>
</lion-select-rich>
<lion-select-rich label="Windows/Linux mode" name="color" interaction-mode="windows/linux">
  <lion-option .choiceValue="${"red"}">Red</lion-option>
  <lion-option .choiceValue="${"hotpink"}" checked>Hotpink</lion-option>
  <lion-option .choiceValue="${"teal"}">Teal</lion-option>
</lion-select-rich>`,r=({shadowRoot:e})=>o`
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
      @change=${o=>{e.querySelector("#checkedRichSelect").checkedIndex=Number(o.target.value)}}
    />
  </div>
  <button
    class="log-button"
    @click=${()=>{const o=e.querySelector("#checkedRichSelect");console.log(`checkedIndex: ${o.checkedIndex}`),console.log(`modelValue: ${o.modelValue}`)}}
  >
    Console log checked index and value
  </button>
  <lion-select-rich id="checkedRichSelect" name="favoriteColor" label="Favorite color">
    <lion-option .choiceValue="${"red"}">Red</lion-option>
    <lion-option .choiceValue="${"hotpink"}" checked>Hotpink</lion-option>
    <lion-option .choiceValue="${"teal"}">Teal</lion-option>
  </lion-select-rich>
`,s=()=>o`<lion-select-rich name="favoriteColor" label="Favorite color" has-no-default-selected>
  <lion-option .choiceValue="${"red"}">Red</lion-option>
  <lion-option .choiceValue="${"hotpink"}">Hotpink</lion-option>
  <lion-option .choiceValue="${"teal"}">Teal</lion-option>
</lion-select-rich>`,d=()=>o`<lion-select-rich label="Single Option" name="color">
  <lion-option .choiceValue="${"red"}">Red</lion-option>
</lion-select-rich>`;customElements.define("single-option-remove-add",class extends e{static get properties(){return{options:{type:Array}}}constructor(){super(),this.options=["Option 1","Option 2"]}render(){return o`
      <button @click="${this.addOption}">Add an option</button>
      <button @click="${this.removeOption}">Remove last option</button>
      <lion-select-rich name="favoriteColor" label="Favorite color">
        <lion-options slot="input">
          ${this.options.map(e=>o` <lion-option .choiceValue="${e}">${e}</lion-option> `)}
        </lion-options>
      </lion-select-rich>
    `}addOption(){this.options.push(`Option ${this.options.length+1} with a long title`),this.options=[...this.options],this.requestUpdate()}removeOption(){this.options.length>=2&&(this.options.pop(),this.options=[...this.options],this.requestUpdate())}});const h=()=>o`<single-option-remove-add></single-option-remove-add>`,m=document,u=[{key:"HtmlStory0",story:i},{key:"manyOptionsWithScrolling",story:t},{key:"HtmlStory1",story:l},{key:"HtmlStory2",story:n},{key:"HtmlStory3",story:c},{key:"renderOptions",story:a},{key:"HtmlStory4",story:p},{key:"checkedIndexAndValue",story:r},{key:"HtmlStory5",story:s},{key:"HtmlStory6",story:d},{key:"singleOptionRemoveAdd",story:h}];let y=!1;for(const o of u){const e=m.querySelector(`[mdjs-story-name="${o.key}"]`);e&&(e.story=o.story,e.key=o.key,y=!0,Object.assign(e,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}y&&(customElements.get("mdjs-preview")||import("./a7b4f51b.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{i as HtmlStory0,l as HtmlStory1,n as HtmlStory2,c as HtmlStory3,p as HtmlStory4,s as HtmlStory5,d as HtmlStory6,r as checkedIndexAndValue,t as manyOptionsWithScrolling,a as renderOptions,h as singleOptionRemoveAdd};
