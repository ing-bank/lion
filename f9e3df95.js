import"./24f95583.js";import{i as o,a as e,x as t,E as i}from"./b4be29f1.js";import{c as l}from"./c9978b47.js";import"./05905ff1.js";import{l as n,a as s,b as a}from"./2758bd27.js";import"./09750da9.js";import"./b72424c3.js";import"./969ba121.js";import{l as c}from"./7da3d275.js";import{L as r}from"./ac41bbf8.js";import{R as m}from"./cc85a6f4.js";import"./19d2607c.js";import"./afb8834e.js";import"./5287c897.js";import"./5516584c.js";import"./143fde17.js";import"./dc2f5f5a.js";import"./0fc7fbf3.js";import"./c6fab747.js";import"./d45984a3.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./4cc99b59.js";import"./44105dd4.js";import"./ec06148e.js";import"./ad6a1a36.js";import"./3599da39.js";import"./4dc0ac82.js";import"./48ac1cb5.js";import"./e49751c9.js";import"./b7f85193.js";import"./622cc741.js";import"./a06c5caf.js";import"./65cdf028.js";import"./acda6ea6.js";import"./0ed5d59c.js";function p(o,e,t,i,l){return o<e||t<e?o>t?t+1:o+1:i===l?e:e+1}customElements.define("demo-selection-display",class extends o{static get properties(){return{comboboxElement:Object,removeChipOnNextBackspace:Boolean,selectedChoices:Array}}static get styles(){return e`
      :host {
        display: flex;
      }

      .combobox__selection {
        flex: none;
      }

      .combobox__input {
        display: block;
      }

      .selection-chip {
        border-radius: 4px;
        background-color: #eee;
        padding: 4px;
        font-size: 10px;
      }

      .selection-chip--highlighted {
        background-color: #ccc;
      }

      * > ::slotted([slot='_textbox']) {
        outline: none;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        border: none;
        border-bottom: 1px solid;
      }
    `}get _inputNode(){return this.comboboxElement._inputNode}get multipleChoice(){return this.comboboxElement?.multipleChoice}constructor(){super(),this.selectedChoices=[],this.__textboxOnKeyup=this.__textboxOnKeyup.bind(this),this.__restoreBackspace=this.__restoreBackspace.bind(this)}firstUpdated(o){super.firstUpdated(o),this.multipleChoice&&(this._inputNode.addEventListener("keyup",this.__textboxOnKeyup),this._inputNode.addEventListener("focusout",this.__restoreBackspace))}onComboboxElementUpdated(o){o.has("modelValue")&&(this.selectedChoices=this.comboboxElement.modelValue)}_selectedElementTemplate(o,e){return t`
      <span class="selection-chip ${e?"selection-chip--highlighted":""}">
        ${o}
      </span>
    `}_selectedElementsTemplate(){return this.multipleChoice?t`
      <div class="combobox__selection">
        ${this.selectedChoices.map((o,e)=>{const t=Boolean(this.removeChipOnNextBackspace&&e===this.selectedChoices.length-1);return this._selectedElementTemplate(o,t)})}
      </div>
    `:i}render(){return t` ${this._selectedElementsTemplate()} `}__textboxOnKeyup(o){"Backspace"===o.key?this._inputNode.value||(this.removeChipOnNextBackspace&&this.selectedChoices.length&&(this.comboboxElement.modelValue=this.selectedChoices.slice(0,-1)),this.removeChipOnNextBackspace=!0):this.removeChipOnNextBackspace=!1}__restoreBackspace(){this.removeChipOnNextBackspace=!1}}),c();const d=()=>t`
  <lion-combobox name="search" label="Search" .requireOptionMatch="${!1}">
    ${n(s.map(o=>t` <lion-option .choiceValue="${o}">${o}</lion-option> `))}
  </lion-combobox>
`,b=()=>t`
  <lion-combobox name="combo" label="Autocomplete 'none'" autocomplete="none">
    ${n(s.map(o=>t` <lion-option .choiceValue="${o}">${o}</lion-option> `))}
  </lion-combobox>
`,h=()=>t`
  <lion-combobox name="combo" label="Autocomplete 'list'" autocomplete="list">
    ${n(s.map(o=>t` <lion-option .choiceValue="${o}">${o}</lion-option> `))}
  </lion-combobox>
`,u=()=>t`
  <lion-combobox name="combo" label="Autocomplete 'inline'" autocomplete="inline">
    ${n(s.map(o=>t` <lion-option .choiceValue="${o}">${o}</lion-option> `))}
  </lion-combobox>
`,y=()=>t`
  <lion-combobox name="combo" label="Autocomplete 'both'" autocomplete="both">
    ${n(s.map(o=>t` <lion-option .choiceValue="${o}">${o}</lion-option> `))}
  </lion-combobox>
`,x=()=>t`
  <lion-combobox name="combo" label="Match Mode 'begin'" match-mode="begin">
    ${n(s.map(o=>t` <lion-option .choiceValue="${o}">${o}</lion-option> `))}
  </lion-combobox>
`,$=()=>t`
  <lion-combobox name="combo" label="Match Mode 'all'" match-mode="all">
    ${n(s.map(o=>t` <lion-option .choiceValue="${o}">${o}</lion-option> `))}
  </lion-combobox>
`,g=()=>t`
  <lion-combobox
    name="combo"
    label="Custom Match Mode 'levenshtein'"
    help-text="Spelling mistakes will be forgiven. Try typing 'Aple' instead of 'Apple'"
    .matchCondition="${({choiceValue:o},e)=>{const t=o.toLowerCase(),i=e.toLowerCase();return t.slice(0,1)===i.slice(0,1)&&function(o,e){if(o===e)return 0;if(o.length>e.length){var t=o;o=e,e=t}for(var i=o.length,l=e.length;i>0&&o.charCodeAt(i-1)===e.charCodeAt(l-1);)i--,l--;for(var n=0;n<i&&o.charCodeAt(n)===e.charCodeAt(n);)n++;if(l-=n,0===(i-=n)||l<3)return l;var s,a,c,r,m,d,b,h,u,y,x,$,g=0,f=[];for(s=0;s<i;s++)f.push(s+1),f.push(o.charCodeAt(n+s));for(var k=f.length-1;g<l-3;)for(u=e.charCodeAt(n+(a=g)),y=e.charCodeAt(n+(c=g+1)),x=e.charCodeAt(n+(r=g+2)),$=e.charCodeAt(n+(m=g+3)),d=g+=4,s=0;s<k;s+=2)a=p(b=f[s],a,c,u,h=f[s+1]),c=p(a,c,r,y,h),r=p(c,r,m,x,h),d=p(r,m,d,$,h),f[s]=d,m=r,r=c,c=a,a=b;for(;g<l;)for(u=e.charCodeAt(n+(a=g)),d=++g,s=0;s<k;s+=2)b=f[s],f[s]=d=p(b,a,d,u,f[s+1]),a=b;return d}(t,i)<3}}"
  >
    ${n(s.map(o=>t` <lion-option .choiceValue="${o}">${o}</lion-option> `))}
  </lion-combobox>
`;customElements.define("demo-disabled-state",class extends o{static get properties(){return{disabled:{type:Boolean}}}constructor(){super(),this.disabled=!0}get combobox(){return this.shadowRoot?.querySelector("#combobox")}toggleDisabled(o){this.disabled=!this.disabled,this.requestUpdate()}render(){return t`
      <lion-button @click=${this.toggleDisabled}>Toggle disabled</lion-button> Disabled state:
      ${this.disabled}
      <lion-combobox name="search" label="Search" ?disabled=${this.disabled}>
        ${n(s.map(o=>t` <lion-option .choiceValue="${o}">${o}</lion-option> `))}
      </lion-combobox>
    `}});const f=()=>t`<demo-disabled-state></demo-disabled-state>`;customElements.define("demo-readonly-state",class extends o{static get properties(){return{readOnly:{type:Boolean}}}constructor(){super(),this.readOnly=!0}get combobox(){return this.shadowRoot?.querySelector("#combobox")}toggleReadonly(o){this.readOnly=!this.readOnly,this.requestUpdate()}render(){return t`
      <lion-button @click=${this.toggleReadonly}>Toggle readonly</lion-button> ReadOnly state:
      ${this.readOnly}
      <lion-combobox name="search" label="Search" ?readOnly=${this.readOnly}>
        ${n(s.map(o=>t` <lion-option .choiceValue="${o}">${o}</lion-option> `))}
      </lion-combobox>
    `}});const k=()=>t`<demo-readonly-state></demo-readonly-state>`,j=()=>t`
  <lion-combobox
    name="combo"
    label="Show all on empty"
    help-text="Shows all (options) on empty (textbox has no value)"
    show-all-on-empty
  >
    ${n(s.map(o=>t` <lion-option .choiceValue="${o}">${o}</lion-option> `))}
  </lion-combobox>
`,C=()=>t`
  <lion-combobox name="combo" label="No Selection Follows focus" .selectionFollowsFocus="${!1}">
    ${n(s.map(o=>t` <lion-option .choiceValue="${o}">${o}</lion-option> `))}
  </lion-combobox>
`,v=()=>t`
  <lion-combobox
    name="combo"
    label="No Rotate Keyboard Navigation"
    .rotateKeyboardNavigation="${!1}"
  >
    ${n(s.map(o=>t` <lion-option .choiceValue="${o}">${o}</lion-option> `))}
  </lion-combobox>
`,_=()=>t`
  <lion-combobox name="combo" label="Multiple" multiple-choice>
    <demo-selection-display
      slot="selection-display"
      style="display: contents;"
    ></demo-selection-display>
    ${n(s.map((o,e)=>t`
          <lion-option .choiceValue="${o}" ?checked="${0===e}">${o}</lion-option>
        `))}
  </lion-combobox>
`,O=()=>t`
  <lion-combobox name="combo" label="Multiple" .requireOptionMatch="${!1}" multiple-choice>
    <demo-selection-display
      slot="selection-display"
      style="display: contents;"
    ></demo-selection-display>
    ${n(s.map((o,e)=>t`
          <lion-option .choiceValue="${o}" ?checked="${0===e}">${o}</lion-option>
        `))}
  </lion-combobox>
`,V=()=>t`
  <lion-combobox name="combo" label="Validation" .validators="${[new m]}">
    ${n(s.map(o=>t` <lion-option .choiceValue="${o}">${o}</lion-option> `))}
  </lion-combobox>
`,A=()=>t`
  <lion-combobox
    .modelValue="${s[1]}"
    autocomplete="none"
    name="combo"
    label="Invoker Button"
    @click="${({currentTarget:o})=>{o.opened=!o.opened}}"
  >
    <button slot="suffix" type="button" tabindex="-1">▼</button>
    ${n(s.map(o=>t` <lion-option .choiceValue="${o}">${o}</lion-option> `))}
  </lion-combobox>
`;let E;customElements.define("demo-server-side",class extends o{static get properties(){return{options:{type:Array}}}constructor(){super(),this.options=[]}get combobox(){return this.shadowRoot?.querySelector("#combobox")}async fetchMyDataAndRender(o){this.loading=!0,this.requestUpdate();try{this.options=await function(o){E&&E();const e=s.filter(e=>e.toLowerCase().includes(o.toLowerCase()));return new Promise((o,t)=>{E=t,setTimeout(()=>{o(e)},1e3)})}(o.target.value),this.loading=!1,this.requestUpdate()}catch(o){}}render(){return t`
      <lion-combobox
        .showAllOnEmpty="${!0}"
        id="combobox"
        @input="${this.fetchMyDataAndRender}"
        .helpText="Returned from server: [${this.options.join(", ")}]"
      >
        <label slot="label" aria-live="polite"
          >Server side completion
          ${this.loading?t`<span style="font-style: italic;">(loading...)</span>`:""}</label
        >
        ${l(this.options,o=>o,o=>t` <lion-option .choiceValue="${o}">${o}</lion-option> `)}
      </lion-combobox>
    `}});const w=()=>t`<demo-server-side></demo-server-side>`;customElements.define("complex-object-combobox",class extends r{_onFilterMatch(o,e){Array.from(o.children).forEach(o=>{o.hasAttribute("data-key")&&this._highlightMatchedOption(o,e)}),o.style.display=""}_onFilterUnmatch(o,e,t){Array.from(o.children).forEach(o=>{o.hasAttribute("data-key")&&this._unhighlightMatchedOption(o)}),o.style.display="none"}});const B=o=>{console.log(`event.target.modelValue: ${JSON.stringify(o.target.modelValue)}`)},M=()=>t` <complex-object-combobox
    name="combo"
    label="Display only the label once selected"
    @model-value-changed="${B}"
  >
    ${n(a.map(o=>t`
          <lion-option .choiceValue="${o.label}">
            <div data-key>${o.label}</div>
            <small>${o.description}</small>
          </lion-option>
        `))}
  </complex-object-combobox>`,N=document,S=[{key:"optionMatch",story:d},{key:"autocompleteNone",story:b},{key:"autocompleteList",story:h},{key:"autocompleteInline",story:u},{key:"autocompleteBoth",story:y},{key:"matchModeBegin",story:x},{key:"matchModeAll",story:$},{key:"customMatchCondition",story:g},{key:"disabledState",story:f},{key:"readonlyState",story:k},{key:"showAllOnEmpty",story:j},{key:"noSelectionFollowsFocus",story:C},{key:"noRotateKeyboardNavigation",story:v},{key:"multipleChoice",story:_},{key:"multipleCustomizableChoice",story:O},{key:"validation",story:V},{key:"invokerButton",story:A},{key:"serverSideCompletion",story:w},{key:"complexObjectChoiceValue",story:M}];let R=!1;for(const o of S){const e=N.querySelector(`[mdjs-story-name="${o.key}"]`);e&&(e.story=o.story,e.key=o.key,R=!0,Object.assign(e,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}R&&(customElements.get("mdjs-preview")||import("./a7b4f51b.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{y as autocompleteBoth,u as autocompleteInline,h as autocompleteList,b as autocompleteNone,M as complexObjectChoiceValue,g as customMatchCondition,f as disabledState,A as invokerButton,$ as matchModeAll,x as matchModeBegin,_ as multipleChoice,O as multipleCustomizableChoice,v as noRotateKeyboardNavigation,C as noSelectionFollowsFocus,d as optionMatch,k as readonlyState,w as serverSideCompletion,j as showAllOnEmpty,V as validation};
