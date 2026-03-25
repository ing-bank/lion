const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.DSVRgKCR.js","_astro/node-tools_providence-analytics_overview.BxIihMx7.js","_astro/lit-element.jD9bOQKo.js","_astro/lit-html.DtZEZPQ5.js","_astro/unsafe-html.DgrA3nwU.js","_astro/directive.BO6BEpVC.js","_astro/define.DNIVKtom.js"])))=>i.map(i=>d[i]);
import{_ as O}from"./preload-helper.Cj2JEybs.js";import"./node-tools_providence-analytics_overview.BxIihMx7.js";import{i as v,a as S}from"./lit-element.jD9bOQKo.js";import{x as t,E as M}from"./lit-html.DtZEZPQ5.js";import{c as w}from"./repeat.DviZyQ5m.js";import"./unsafe-html.DgrA3nwU.js";import{l as a,a as n,b as B}from"./lazyRender.DciN-not.js";import"./lion-button.DuC_yWH_.js";import"./lion-combobox.E-OZjOfE.js";import"./lion-option.BiCJ-byu.js";import{R as N}from"./Required.DgHIr_Cn.js";import{l as D}from"./loadDefaultFeedbackMessages.G20iUcvC.js";import{L as R}from"./LionCombobox.BmVZfh6a.js";class j extends v{static get properties(){return{comboboxElement:Object,removeChipOnNextBackspace:Boolean,selectedChoices:Array}}static get styles(){return S`
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
    `}get _inputNode(){return this.comboboxElement._inputNode}get multipleChoice(){return this.comboboxElement?.multipleChoice}constructor(){super(),this.selectedChoices=[],this.__textboxOnKeyup=this.__textboxOnKeyup.bind(this),this.__restoreBackspace=this.__restoreBackspace.bind(this)}firstUpdated(e){super.firstUpdated(e),this.multipleChoice&&(this._inputNode.addEventListener("keyup",this.__textboxOnKeyup),this._inputNode.addEventListener("focusout",this.__restoreBackspace))}onComboboxElementUpdated(e){e.has("modelValue")&&(this.selectedChoices=this.comboboxElement.modelValue)}_selectedElementTemplate(e,i){return t`
      <span class="selection-chip ${i?"selection-chip--highlighted":""}">
        ${e}
      </span>
    `}_selectedElementsTemplate(){return this.multipleChoice?t`
      <div class="combobox__selection">
        ${this.selectedChoices.map((e,i)=>{const l=!!(this.removeChipOnNextBackspace&&i===this.selectedChoices.length-1);return this._selectedElementTemplate(e,l)})}
      </div>
    `:M}render(){return t` ${this._selectedElementsTemplate()} `}__textboxOnKeyup(e){e.key==="Backspace"?this._inputNode.value||(this.removeChipOnNextBackspace&&this.selectedChoices.length&&(this.comboboxElement.modelValue=this.selectedChoices.slice(0,-1)),this.removeChipOnNextBackspace=!0):this.removeChipOnNextBackspace=!1}__restoreBackspace(){this.removeChipOnNextBackspace=!1}}customElements.define("demo-selection-display",j);function $(o,e,i,l,c){return o<e||i<e?o>i?i+1:o+1:l===c?e:e+1}function L(o,e){if(o===e)return 0;if(o.length>e.length){var i=o;o=e,e=i}for(var l=o.length,c=e.length;l>0&&o.charCodeAt(l-1)===e.charCodeAt(c-1);)l--,c--;for(var r=0;r<l&&o.charCodeAt(r)===e.charCodeAt(r);)r++;if(l-=r,c-=r,l===0||c<3)return c;var m=0,s,d,h,u,g,b,y,x,f,C,_,V,p=[];for(s=0;s<l;s++)p.push(s+1),p.push(o.charCodeAt(r+s));for(var E=p.length-1;m<c-3;)for(f=e.charCodeAt(r+(d=m)),C=e.charCodeAt(r+(h=m+1)),_=e.charCodeAt(r+(u=m+2)),V=e.charCodeAt(r+(g=m+3)),b=m+=4,s=0;s<E;s+=2)y=p[s],x=p[s+1],d=$(y,d,h,f,x),h=$(d,h,u,C,x),u=$(h,u,g,_,x),b=$(u,g,b,V,x),p[s]=b,g=u,u=h,h=d,d=y;for(;m<c;)for(f=e.charCodeAt(r+(d=m)),b=++m,s=0;s<E;s+=2)y=p[s],p[s]=b=$(y,d,b,f,p[s+1]),d=y;return b}D();const T=()=>t`
  <lion-combobox name="search" label="Search" .requireOptionMatch="${!1}">
    ${a(n.map(o=>t` <lion-option .choiceValue="${o}">${o}</lion-option> `))}
  </lion-combobox>
`,U=()=>t`
  <lion-combobox name="combo" label="Autocomplete 'none'" autocomplete="none">
    ${a(n.map(o=>t` <lion-option .choiceValue="${o}">${o}</lion-option> `))}
  </lion-combobox>
`,q=()=>t`
  <lion-combobox name="combo" label="Autocomplete 'list'" autocomplete="list">
    ${a(n.map(o=>t` <lion-option .choiceValue="${o}">${o}</lion-option> `))}
  </lion-combobox>
`,F=()=>t`
  <lion-combobox name="combo" label="Autocomplete 'inline'" autocomplete="inline">
    ${a(n.map(o=>t` <lion-option .choiceValue="${o}">${o}</lion-option> `))}
  </lion-combobox>
`,K=()=>t`
  <lion-combobox name="combo" label="Autocomplete 'both'" autocomplete="both">
    ${a(n.map(o=>t` <lion-option .choiceValue="${o}">${o}</lion-option> `))}
  </lion-combobox>
`,z=()=>t`
  <lion-combobox name="combo" label="Match Mode 'begin'" match-mode="begin">
    ${a(n.map(o=>t` <lion-option .choiceValue="${o}">${o}</lion-option> `))}
  </lion-combobox>
`,I=()=>t`
  <lion-combobox name="combo" label="Match Mode 'all'" match-mode="all">
    ${a(n.map(o=>t` <lion-option .choiceValue="${o}">${o}</lion-option> `))}
  </lion-combobox>
`,P=()=>t`
  <lion-combobox
    name="combo"
    label="Custom Match Mode 'levenshtein'"
    help-text="Spelling mistakes will be forgiven. Try typing 'Aple' instead of 'Apple'"
    .matchCondition="${({choiceValue:o},e)=>{const i=o.toLowerCase(),l=e.toLowerCase(),c=1;return i.slice(0,c)===l.slice(0,c)&&L(i,l)<3}}"
  >
    ${a(n.map(o=>t` <lion-option .choiceValue="${o}">${o}</lion-option> `))}
  </lion-combobox>
`;class G extends v{static get properties(){return{disabled:{type:Boolean}}}constructor(){super(),this.disabled=!0}get combobox(){return this.shadowRoot?.querySelector("#combobox")}toggleDisabled(e){this.disabled=!this.disabled,this.requestUpdate()}render(){return t`
      <lion-button @click=${this.toggleDisabled}>Toggle disabled</lion-button> Disabled state:
      ${this.disabled}
      <lion-combobox name="search" label="Search" ?disabled=${this.disabled}>
        ${a(n.map(e=>t` <lion-option .choiceValue="${e}">${e}</lion-option> `))}
      </lion-combobox>
    `}}customElements.define("demo-disabled-state",G);const J=()=>t`<demo-disabled-state></demo-disabled-state>`;class H extends v{static get properties(){return{readOnly:{type:Boolean}}}constructor(){super(),this.readOnly=!0}get combobox(){return this.shadowRoot?.querySelector("#combobox")}toggleReadonly(e){this.readOnly=!this.readOnly,this.requestUpdate()}render(){return t`
      <lion-button @click=${this.toggleReadonly}>Toggle readonly</lion-button> ReadOnly state:
      ${this.readOnly}
      <lion-combobox name="search" label="Search" ?readOnly=${this.readOnly}>
        ${a(n.map(e=>t` <lion-option .choiceValue="${e}">${e}</lion-option> `))}
      </lion-combobox>
    `}}customElements.define("demo-readonly-state",H);const Q=()=>t`<demo-readonly-state></demo-readonly-state>`,W=()=>t`
  <lion-combobox
    name="combo"
    label="Show all on empty"
    help-text="Shows all (options) on empty (textbox has no value)"
    show-all-on-empty
  >
    ${a(n.map(o=>t` <lion-option .choiceValue="${o}">${o}</lion-option> `))}
  </lion-combobox>
`,X=()=>t`
  <lion-combobox name="combo" label="No Selection Follows focus" .selectionFollowsFocus="${!1}">
    ${a(n.map(o=>t` <lion-option .choiceValue="${o}">${o}</lion-option> `))}
  </lion-combobox>
`,Y=()=>t`
  <lion-combobox
    name="combo"
    label="No Rotate Keyboard Navigation"
    .rotateKeyboardNavigation="${!1}"
  >
    ${a(n.map(o=>t` <lion-option .choiceValue="${o}">${o}</lion-option> `))}
  </lion-combobox>
`,Z=()=>t`
  <lion-combobox name="combo" label="Multiple" multiple-choice>
    <demo-selection-display
      slot="selection-display"
      style="display: contents;"
    ></demo-selection-display>
    ${a(n.map((o,e)=>t`
          <lion-option .choiceValue="${o}" ?checked="${e===0}">${o}</lion-option>
        `))}
  </lion-combobox>
`,oo=()=>t`
  <lion-combobox name="combo" label="Multiple" .requireOptionMatch="${!1}" multiple-choice>
    <demo-selection-display
      slot="selection-display"
      style="display: contents;"
    ></demo-selection-display>
    ${a(n.map((o,e)=>t`
          <lion-option .choiceValue="${o}" ?checked="${e===0}">${o}</lion-option>
        `))}
  </lion-combobox>
`,eo=()=>t`
  <lion-combobox name="combo" label="Validation" .validators="${[new N]}">
    ${a(n.map(o=>t` <lion-option .choiceValue="${o}">${o}</lion-option> `))}
  </lion-combobox>
`,to=()=>t`
  <lion-combobox
    .modelValue="${n[1]}"
    autocomplete="none"
    name="combo"
    label="Invoker Button"
    @click="${({currentTarget:o})=>{o.opened=!o.opened}}"
  >
    <button slot="suffix" type="button" tabindex="-1">▼</button>
    ${a(n.map(o=>t` <lion-option .choiceValue="${o}">${o}</lion-option> `))}
  </lion-combobox>
`;let k;function io(o){k&&k();const e=n.filter(i=>i.toLowerCase().includes(o.toLowerCase()));return new Promise((i,l)=>{k=l,setTimeout(()=>{i(e)},1e3)})}class lo extends v{static get properties(){return{options:{type:Array}}}constructor(){super(),this.options=[]}get combobox(){return this.shadowRoot?.querySelector("#combobox")}async fetchMyDataAndRender(e){this.loading=!0,this.requestUpdate();try{this.options=await io(e.target.value),this.loading=!1,this.requestUpdate()}catch{}}render(){return t`
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
        ${w(this.options,e=>e,e=>t` <lion-option .choiceValue="${e}">${e}</lion-option> `)}
      </lion-combobox>
    `}}customElements.define("demo-server-side",lo);const no=()=>t`<demo-server-side></demo-server-side>`;class ao extends R{_onFilterMatch(e,i){Array.from(e.children).forEach(l=>{l.hasAttribute("data-key")&&this._highlightMatchedOption(l,i)}),e.style.display=""}_onFilterUnmatch(e,i,l){Array.from(e.children).forEach(c=>{c.hasAttribute("data-key")&&this._unhighlightMatchedOption(c)}),e.style.display="none"}}customElements.define("complex-object-combobox",ao);const so=o=>{console.log(`event.target.modelValue: ${JSON.stringify(o.target.modelValue)}`)},co=()=>t` <complex-object-combobox
    name="combo"
    label="Display only the label once selected"
    @model-value-changed="${so}"
  >
    ${a(B.map(o=>t`
          <lion-option .choiceValue="${o.label}">
            <div data-key>${o.label}</div>
            <small>${o.description}</small>
          </lion-option>
        `))}
  </complex-object-combobox>`,ro=document,mo=[{key:"optionMatch",story:T},{key:"autocompleteNone",story:U},{key:"autocompleteList",story:q},{key:"autocompleteInline",story:F},{key:"autocompleteBoth",story:K},{key:"matchModeBegin",story:z},{key:"matchModeAll",story:I},{key:"customMatchCondition",story:P},{key:"disabledState",story:J},{key:"readonlyState",story:Q},{key:"showAllOnEmpty",story:W},{key:"noSelectionFollowsFocus",story:X},{key:"noRotateKeyboardNavigation",story:Y},{key:"multipleChoice",story:Z},{key:"multipleCustomizableChoice",story:oo},{key:"validation",story:eo},{key:"invokerButton",story:to},{key:"serverSideCompletion",story:no},{key:"complexObjectChoiceValue",story:co}];let A=!1;for(const o of mo){const e=ro.querySelector(`[mdjs-story-name="${o.key}"]`);e&&(e.story=o.story,e.key=o.key,A=!0,Object.assign(e,{simulatorUrl:"/next/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}A&&(customElements.get("mdjs-preview")||O(()=>import("./define.DSVRgKCR.js"),__vite__mapDeps([0,1,2,3,4,5])),customElements.get("mdjs-story")||O(()=>import("./define.DNIVKtom.js"),__vite__mapDeps([6,2,3])));export{K as autocompleteBoth,F as autocompleteInline,q as autocompleteList,U as autocompleteNone,co as complexObjectChoiceValue,P as customMatchCondition,J as disabledState,to as invokerButton,I as matchModeAll,z as matchModeBegin,Z as multipleChoice,oo as multipleCustomizableChoice,Y as noRotateKeyboardNavigation,X as noSelectionFollowsFocus,T as optionMatch,Q as readonlyState,no as serverSideCompletion,W as showAllOnEmpty,eo as validation};
