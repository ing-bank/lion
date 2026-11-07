const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.D5IFK1jp.js","_astro/MdJsPreview.B62up6PK.js","_astro/lit-element.DxRhnkit.js","_astro/lit-html.BX7rm8u-.js","_astro/dedupeMixin.6XPTJgK8.js","_astro/lit-element.BOikny4r.js","_astro/uuid.DjYKNjre.js","_astro/define.DBgp7shK.js"])))=>i.map(i=>d[i]);
import{_ as A}from"./preload-helper.CVfkMyKi.js";import"./MdJsPreview.B62up6PK.js";import{i as C}from"./lit-element.DxRhnkit.js";import{b as t}from"./lit-html.BX7rm8u-.js";import{c as M}from"./repeat.C1qdnZak.js";import"./unsafe-html.FHlAasnX.js";import{l as a,a as n,b as w}from"./lazyRender.C6asyIK2.js";import"./lion-button.CKpAHAIx.js";import"./lion-combobox.CTbx4Rjx.js";import"./lion-option.Dq2Rs-EH.js";import{a as B,i as N,b as v,A as D}from"./lit-element.BOikny4r.js";import{R}from"./Required.CvxLsCBg.js";import{l as j}from"./loadDefaultFeedbackMessages.Dna2KIXH.js";import{L}from"./LionCombobox.DwGDO6BY.js";class T extends B{static get properties(){return{comboboxElement:Object,removeChipOnNextBackspace:Boolean,selectedChoices:Array}}static get styles(){return N`
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
    `}get _inputNode(){return this.comboboxElement._inputNode}get multipleChoice(){return this.comboboxElement?.multipleChoice}constructor(){super(),this.selectedChoices=[],this.__textboxOnKeyup=this.__textboxOnKeyup.bind(this),this.__restoreBackspace=this.__restoreBackspace.bind(this)}firstUpdated(e){super.firstUpdated(e),this.multipleChoice&&(this._inputNode.addEventListener("keyup",this.__textboxOnKeyup),this._inputNode.addEventListener("focusout",this.__restoreBackspace))}onComboboxElementUpdated(e){e.has("modelValue")&&(this.selectedChoices=this.comboboxElement.modelValue)}_selectedElementTemplate(e,i){return v`
      <span class="selection-chip ${i?"selection-chip--highlighted":""}">
        ${e}
      </span>
    `}_selectedElementsTemplate(){return this.multipleChoice?v`
      <div class="combobox__selection">
        ${this.selectedChoices.map((e,i)=>{const l=!!(this.removeChipOnNextBackspace&&i===this.selectedChoices.length-1);return this._selectedElementTemplate(e,l)})}
      </div>
    `:D}render(){return v` ${this._selectedElementsTemplate()} `}__textboxOnKeyup(e){e.key==="Backspace"?this._inputNode.value||(this.removeChipOnNextBackspace&&this.selectedChoices.length&&(this.comboboxElement.modelValue=this.selectedChoices.slice(0,-1)),this.removeChipOnNextBackspace=!0):this.removeChipOnNextBackspace=!1}__restoreBackspace(){this.removeChipOnNextBackspace=!1}}customElements.define("demo-selection-display",T);function $(o,e,i,l,c){return o<e||i<e?o>i?i+1:o+1:l===c?e:e+1}function U(o,e){if(o===e)return 0;if(o.length>e.length){var i=o;o=e,e=i}for(var l=o.length,c=e.length;l>0&&o.charCodeAt(l-1)===e.charCodeAt(c-1);)l--,c--;for(var r=0;r<l&&o.charCodeAt(r)===e.charCodeAt(r);)r++;if(l-=r,c-=r,l===0||c<3)return c;var m=0,s,d,h,u,g,b,y,x,f,_,V,E,p=[];for(s=0;s<l;s++)p.push(s+1),p.push(o.charCodeAt(r+s));for(var O=p.length-1;m<c-3;)for(f=e.charCodeAt(r+(d=m)),_=e.charCodeAt(r+(h=m+1)),V=e.charCodeAt(r+(u=m+2)),E=e.charCodeAt(r+(g=m+3)),b=m+=4,s=0;s<O;s+=2)y=p[s],x=p[s+1],d=$(y,d,h,f,x),h=$(d,h,u,_,x),u=$(h,u,g,V,x),b=$(u,g,b,E,x),p[s]=b,g=u,u=h,h=d,d=y;for(;m<c;)for(f=e.charCodeAt(r+(d=m)),b=++m,s=0;s<O;s+=2)y=p[s],p[s]=b=$(y,d,b,f,p[s+1]),d=y;return b}j();const q=()=>t`
  <lion-combobox name="search" label="Search" .requireOptionMatch="${!1}">
    ${a(n.map(o=>t` <lion-option .choiceValue="${o}">${o}</lion-option> `))}
  </lion-combobox>
`,F=()=>t`
  <lion-combobox name="combo" label="Autocomplete 'none'" autocomplete="none">
    ${a(n.map(o=>t` <lion-option .choiceValue="${o}">${o}</lion-option> `))}
  </lion-combobox>
`,K=()=>t`
  <lion-combobox name="combo" label="Autocomplete 'list'" autocomplete="list">
    ${a(n.map(o=>t` <lion-option .choiceValue="${o}">${o}</lion-option> `))}
  </lion-combobox>
`,z=()=>t`
  <lion-combobox name="combo" label="Autocomplete 'inline'" autocomplete="inline">
    ${a(n.map(o=>t` <lion-option .choiceValue="${o}">${o}</lion-option> `))}
  </lion-combobox>
`,I=()=>t`
  <lion-combobox name="combo" label="Autocomplete 'both'" autocomplete="both">
    ${a(n.map(o=>t` <lion-option .choiceValue="${o}">${o}</lion-option> `))}
  </lion-combobox>
`,P=()=>t`
  <lion-combobox name="combo" label="Match Mode 'begin'" match-mode="begin">
    ${a(n.map(o=>t` <lion-option .choiceValue="${o}">${o}</lion-option> `))}
  </lion-combobox>
`,G=()=>t`
  <lion-combobox name="combo" label="Match Mode 'all'" match-mode="all">
    ${a(n.map(o=>t` <lion-option .choiceValue="${o}">${o}</lion-option> `))}
  </lion-combobox>
`,J=()=>t`
  <lion-combobox
    name="combo"
    label="Custom Match Mode 'levenshtein'"
    help-text="Spelling mistakes will be forgiven. Try typing 'Aple' instead of 'Apple'"
    .matchCondition="${({choiceValue:o},e)=>{const i=o.toLowerCase(),l=e.toLowerCase(),c=1;return i.slice(0,c)===l.slice(0,c)&&U(i,l)<3}}"
  >
    ${a(n.map(o=>t` <lion-option .choiceValue="${o}">${o}</lion-option> `))}
  </lion-combobox>
`;class H extends C{static get properties(){return{disabled:{type:Boolean}}}constructor(){super(),this.disabled=!0}get combobox(){return this.shadowRoot?.querySelector("#combobox")}toggleDisabled(e){this.disabled=!this.disabled,this.requestUpdate()}render(){return t`
      <lion-button @click=${this.toggleDisabled}>Toggle disabled</lion-button> Disabled state:
      ${this.disabled}
      <lion-combobox name="search" label="Search" ?disabled=${this.disabled}>
        ${a(n.map(e=>t` <lion-option .choiceValue="${e}">${e}</lion-option> `))}
      </lion-combobox>
    `}}customElements.define("demo-disabled-state",H);const Q=()=>t`<demo-disabled-state></demo-disabled-state>`;class W extends C{static get properties(){return{readOnly:{type:Boolean}}}constructor(){super(),this.readOnly=!0}get combobox(){return this.shadowRoot?.querySelector("#combobox")}toggleReadonly(e){this.readOnly=!this.readOnly,this.requestUpdate()}render(){return t`
      <lion-button @click=${this.toggleReadonly}>Toggle readonly</lion-button> ReadOnly state:
      ${this.readOnly}
      <lion-combobox name="search" label="Search" ?readOnly=${this.readOnly}>
        ${a(n.map(e=>t` <lion-option .choiceValue="${e}">${e}</lion-option> `))}
      </lion-combobox>
    `}}customElements.define("demo-readonly-state",W);const X=()=>t`<demo-readonly-state></demo-readonly-state>`,Y=()=>t`
  <lion-combobox
    name="combo"
    label="Show all on empty"
    help-text="Shows all (options) on empty (textbox has no value)"
    show-all-on-empty
  >
    ${a(n.map(o=>t` <lion-option .choiceValue="${o}">${o}</lion-option> `))}
  </lion-combobox>
`,Z=()=>t`
  <lion-combobox name="combo" label="No Selection Follows focus" .selectionFollowsFocus="${!1}">
    ${a(n.map(o=>t` <lion-option .choiceValue="${o}">${o}</lion-option> `))}
  </lion-combobox>
`,oo=()=>t`
  <lion-combobox
    name="combo"
    label="No Rotate Keyboard Navigation"
    .rotateKeyboardNavigation="${!1}"
  >
    ${a(n.map(o=>t` <lion-option .choiceValue="${o}">${o}</lion-option> `))}
  </lion-combobox>
`,eo=()=>t`
  <lion-combobox name="combo" label="Multiple" multiple-choice>
    <demo-selection-display
      slot="selection-display"
      style="display: contents;"
    ></demo-selection-display>
    ${a(n.map((o,e)=>t`
          <lion-option .choiceValue="${o}" ?checked="${e===0}">${o}</lion-option>
        `))}
  </lion-combobox>
`,to=()=>t`
  <lion-combobox name="combo" label="Multiple" .requireOptionMatch="${!1}" multiple-choice>
    <demo-selection-display
      slot="selection-display"
      style="display: contents;"
    ></demo-selection-display>
    ${a(n.map((o,e)=>t`
          <lion-option .choiceValue="${o}" ?checked="${e===0}">${o}</lion-option>
        `))}
  </lion-combobox>
`,io=()=>t`
  <lion-combobox name="combo" label="Validation" .validators="${[new R]}">
    ${a(n.map(o=>t` <lion-option .choiceValue="${o}">${o}</lion-option> `))}
  </lion-combobox>
`,lo=()=>t`
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
`;let k;function no(o){k&&k();const e=n.filter(i=>i.toLowerCase().includes(o.toLowerCase()));return new Promise((i,l)=>{k=l,setTimeout(()=>{i(e)},1e3)})}class ao extends C{static get properties(){return{options:{type:Array}}}constructor(){super(),this.options=[]}get combobox(){return this.shadowRoot?.querySelector("#combobox")}async fetchMyDataAndRender(e){this.loading=!0,this.requestUpdate();try{this.options=await no(e.target.value),this.loading=!1,this.requestUpdate()}catch{}}render(){return t`
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
        ${M(this.options,e=>e,e=>t` <lion-option .choiceValue="${e}">${e}</lion-option> `)}
      </lion-combobox>
    `}}customElements.define("demo-server-side",ao);const so=()=>t`<demo-server-side></demo-server-side>`;class co extends L{_onFilterMatch(e,i){Array.from(e.children).forEach(l=>{l.hasAttribute("data-key")&&this._highlightMatchedOption(l,i)}),e.style.display=""}_onFilterUnmatch(e,i,l){Array.from(e.children).forEach(c=>{c.hasAttribute("data-key")&&this._unhighlightMatchedOption(c)}),e.style.display="none"}}customElements.define("complex-object-combobox",co);const ro=o=>{console.log(`event.target.modelValue: ${JSON.stringify(o.target.modelValue)}`)},mo=()=>t` <complex-object-combobox
    name="combo"
    label="Display only the label once selected"
    @model-value-changed="${ro}"
  >
    ${a(w.map(o=>t`
          <lion-option .choiceValue="${o.label}">
            <div data-key>${o.label}</div>
            <small>${o.description}</small>
          </lion-option>
        `))}
  </complex-object-combobox>`,po=document,bo=[{key:"optionMatch",story:q},{key:"autocompleteNone",story:F},{key:"autocompleteList",story:K},{key:"autocompleteInline",story:z},{key:"autocompleteBoth",story:I},{key:"matchModeBegin",story:P},{key:"matchModeAll",story:G},{key:"customMatchCondition",story:J},{key:"disabledState",story:Q},{key:"readonlyState",story:X},{key:"showAllOnEmpty",story:Y},{key:"noSelectionFollowsFocus",story:Z},{key:"noRotateKeyboardNavigation",story:oo},{key:"multipleChoice",story:eo},{key:"multipleCustomizableChoice",story:to},{key:"validation",story:io},{key:"invokerButton",story:lo},{key:"serverSideCompletion",story:so},{key:"complexObjectChoiceValue",story:mo}];let S=!1;for(const o of bo){const e=po.querySelector(`[mdjs-story-name="${o.key}"]`);e&&(e.story=o.story,e.key=o.key,S=!0,Object.assign(e,{simulatorUrl:"/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}S&&(customElements.get("mdjs-preview")||A(()=>import("./define.D5IFK1jp.js"),__vite__mapDeps([0,1,2,3,4,5,6])),customElements.get("mdjs-story")||A(()=>import("./define.DBgp7shK.js"),__vite__mapDeps([7,2,3])));export{I as autocompleteBoth,z as autocompleteInline,K as autocompleteList,F as autocompleteNone,mo as complexObjectChoiceValue,J as customMatchCondition,Q as disabledState,lo as invokerButton,G as matchModeAll,P as matchModeBegin,eo as multipleChoice,to as multipleCustomizableChoice,oo as noRotateKeyboardNavigation,Z as noSelectionFollowsFocus,q as optionMatch,X as readonlyState,so as serverSideCompletion,Y as showAllOnEmpty,io as validation};
