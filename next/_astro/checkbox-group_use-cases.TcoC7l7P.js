const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.DYUong5B.js","_astro/node-tools_providence-analytics_overview.LFFQBZzG.js","_astro/lit-element.qDHKJJma.js","_astro/lit-html.C7L4dwLU.js","_astro/unsafe-html.J0GGe2Q7.js","_astro/directive.CGE4aKEl.js","_astro/define.m2CvvXyF.js"])))=>i.map(i=>d[i]);
import{_ as a}from"./preload-helper.4zY6-HO4.js";import"./node-tools_providence-analytics_overview.LFFQBZzG.js";import{a as k}from"./lit-element.qDHKJJma.js";import{x as o}from"./lit-html.C7L4dwLU.js";import"./unsafe-html.J0GGe2Q7.js";import{L as m}from"./lion-checkbox.DuaQ7yUS.js";import"./directive.CGE4aKEl.js";import"./ChoiceGroupMixin.32toKWns.js";import"./FormRegistrarMixin.BUWicw9X.js";import"./InteractionStateMixin.DC1PvWzb.js";import"./dedupeMixin.6XPTJgK8.js";import"./LocalizeMixin.VYu75dkK.js";import"./directive-helpers.CLllgGgm.js";import"./async-directive.CHVe8p0E.js";import"./getLocalizeManager.W5d_ICRU.js";import"./index.BNCfcFQh.js";import"./lazifyInstantiation.CgYLRMC3.js";import"./DisabledMixin.Bm1nsErI.js";import"./FormGroupMixin.EcgVGa5A.js";import"./Validator.DAOhFpDH.js";import"./ChoiceInputMixin.BjGWftzC.js";import"./LionInput.B2KYRD9B.js";import"./NativeTextFieldMixin.CsE2kjU6.js";import"./LionField.gZkYIwXF.js";class u extends m{static get styles(){return[...super.styles||[],k`
        :host .choice-field__nested-checkboxes {
          display: block;
        }
        ::slotted(*) {
          padding-left: 8px;
        }
      `]}static get properties(){return{indeterminate:{type:Boolean,reflect:!0},mixedState:{type:Boolean,reflect:!0,attribute:"mixed-state"}}}get _checkboxGroupNode(){return this._parentFormGroup}get _subCheckboxes(){return this.__subCheckboxes}_storeIndeterminateState(){this._indeterminateSubStates=this._subCheckboxes.map(e=>e.checked)}_setOldState(){this.indeterminate?this._oldState="indeterminate":this._oldState=this.checked?"checked":"unchecked"}_setOwnCheckedState(){const e=this._subCheckboxes;if(!e.length)return;this.__settingOwnChecked=!0;const c=e.filter(l=>l.checked);switch(e.length-c.length){case 0:this.indeterminate=!1,this.checked=!0;break;case e.length:this.indeterminate=!1,this.checked=!1;break;default:{this.indeterminate=!0;const l=e.filter(i=>i.disabled&&i.checked===!1);this.checked=e.length-c.length-l.length===0}}this.updateComplete.then(()=>{this.__settingOwnChecked=!1})}_setBasedOnMixedState(){switch(this._oldState){case"checked":this.checked=!1,this.indeterminate=!1;break;case"unchecked":this.checked=!1,this.indeterminate=!0;break;case"indeterminate":this.checked=!0,this.indeterminate=!1;break}}__onModelValueChanged(e){if(this.disabled)return;if(e.detail.formPath[0]===this&&!this.__settingOwnChecked){const l=t=>t.every(n=>n===t[0]);this.mixedState&&!l(this._indeterminateSubStates)&&this._setBasedOnMixedState(),this.__settingOwnSubs=!0;const i=this._subCheckboxes,r=i.filter(t=>t.checked),d=i.filter(t=>t.disabled),b=i.length>0&&i.length===r.length;i.length>0&&i.length===d.length&&(this.checked=b),this.indeterminate&&this.mixedState?this._subCheckboxes.forEach((t,n)=>{t.checked=this._indeterminateSubStates[n]}):this._subCheckboxes.filter(t=>!t.disabled).forEach(t=>{t.checked=this._inputNode.checked}),this.updateComplete.then(()=>{this.__settingOwnSubs=!1})}else this._setOwnCheckedState(),this.updateComplete.then(()=>{!this.__settingOwnSubs&&!this.__settingOwnChecked&&this.mixedState&&this._storeIndeterminateState()});this.mixedState&&this._setOldState()}_afterTemplate(){return o`
      <div class="choice-field__nested-checkboxes" role="list">
        <slot></slot>
      </div>
    `}_onRequestToAddFormElement(e){e.target.hasAttribute("role")||e.target?.setAttribute("role","listitem"),this.__addToSubCheckboxes(e.detail.element),this._setOwnCheckedState()}_onRequestToRemoveFormElement(e){e.target.getAttribute("role")==="listitem"&&e.target?.removeAttribute("role"),this.__removeFromSubCheckboxes(e.detail.element)}__addToSubCheckboxes(e){e!==this&&this.contains(e)&&this.__subCheckboxes.push(e)}__removeFromSubCheckboxes(e){const c=this.__subCheckboxes.indexOf(e);c!==-1&&this.__subCheckboxes.splice(c,1)}constructor(){super(),this.indeterminate=!1,this._onRequestToAddFormElement=this._onRequestToAddFormElement.bind(this),this.__onModelValueChanged=this.__onModelValueChanged.bind(this),this.__subCheckboxes=[],this._indeterminateSubStates=[],this.mixedState=!1}connectedCallback(){super.connectedCallback(),this.addEventListener("model-value-changed",this.__onModelValueChanged),this.addEventListener("form-element-register",this._onRequestToAddFormElement)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("model-value-changed",this.__onModelValueChanged),this.removeEventListener("form-element-register",this._onRequestToAddFormElement)}firstUpdated(e){super.firstUpdated(e),this._setOldState(),this.indeterminate&&this._storeIndeterminateState()}updated(e){super.updated(e),(e.has("indeterminate")||e.has("checked"))&&(this._inputNode.indeterminate=this.indeterminate)}}customElements.define("lion-checkbox-indeterminate",u);const x=()=>o`<lion-checkbox-group name="scientists" label="Favorite scientists">
  <lion-checkbox label="Archimedes" .choiceValue="${"Archimedes"}"></lion-checkbox>
  <lion-checkbox label="Francis Bacon" .choiceValue="${"Francis Bacon"}" checked></lion-checkbox>
  <lion-checkbox label="Marie Curie" .choiceValue="${"Marie Curie"}"></lion-checkbox>
</lion-checkbox-group>`,_=()=>o`<lion-checkbox-group name="scientists[]" label="Favorite scientists" disabled>
  <lion-checkbox label="Archimedes" .choiceValue="${"Archimedes"}"></lion-checkbox>
  <lion-checkbox label="Francis Bacon" .choiceValue="${"Francis Bacon"}"></lion-checkbox>
  <lion-checkbox label="Marie Curie" .choiceValue="${"Marie Curie"}"></lion-checkbox>
</lion-checkbox-group>`,p=()=>o`<lion-checkbox-group name="scientists[]" label="Favorite scientists">
  <lion-checkbox .choiceValue="${"Archimedes"}">
    <label slot="label"
      ><a href="https://wikipedia.org/wiki/Archimedes" target="_blank">Archimedes</a></label
    >
  </lion-checkbox>
  <lion-checkbox .choiceValue="${"Francis Bacon"}">
    <label slot="label"
      ><a href="https://wikipedia.org/wiki/Francis_Bacon" target="_blank">Francis Bacon</a></label
    >
  </lion-checkbox>
  <lion-checkbox .choiceValue="${"Marie Curie"}">
    <label slot="label"
      ><a href="https://wikipedia.org/wiki/Marie_Curie" target="_blank">Marie Curie</a></label
    >
  </lion-checkbox>
</lion-checkbox-group>`,g=()=>o`<lion-checkbox-group name="scientists[]" label="Favorite scientists">
  <lion-checkbox
    label="Archimedes"
    .choiceValue="${"Archimedes"}"
    help-text="Archimedes of Syracuse was a Greek mathematician, physicist, engineer, inventor, and astronomer"
  ></lion-checkbox>
  <lion-checkbox
    label="Francis Bacon"
    .choiceValue="${"Francis Bacon"}"
    help-text="Francis Bacon, 1st Viscount St Alban also known as Lord Verulam, was an English philosopher and statesman who served as Attorney General and as Lord Chancellor of England"
  ></lion-checkbox>
  <lion-checkbox
    label="Marie Curie"
    .choiceValue="${"Marie Curie"}"
    help-text="Marie Skłodowska Curie born Maria Salomea Skłodowska, was a Polish and naturalized-French physicist and chemist who conducted pioneering research on radioactivity"
  ></lion-checkbox>
</lion-checkbox-group>`,f=({shadowRoot:s})=>o`
  <lion-checkbox-group
    name="scientists[]"
    label="Favorite scientists"
    @model-value-changed=${e=>e.target.parentElement.querySelector("#selectedDinosaur").innerText=JSON.stringify(e.target.modelValue,null,4)}
  >
    <lion-checkbox label="Archimedes" .choiceValue="${"Archimedes"}"></lion-checkbox>
    <lion-checkbox label="Francis Bacon" .choiceValue="${"Francis Bacon"}"></lion-checkbox>
    <lion-checkbox label="Marie Curie" .choiceValue="${"Marie Curie"}"></lion-checkbox>
  </lion-checkbox-group>
  <br />
  <span>Selected scientists: <strong id="selectedDinosaur">N/A</strong></span>
`,y=()=>o`<lion-checkbox-group name="scientists[]" label="Favorite scientists">
  <lion-checkbox-indeterminate label="Old Greek scientists">
    <lion-checkbox label="Archimedes" .choiceValue="${"Archimedes"}"></lion-checkbox>
    <lion-checkbox label="Plato" .choiceValue="${"Plato"}"></lion-checkbox>
    <lion-checkbox label="Pythagoras" .choiceValue="${"Pythagoras"}"></lion-checkbox>
  </lion-checkbox-indeterminate>
  <lion-checkbox-indeterminate label="17th Century scientists">
    <lion-checkbox label="Isaac Newton" .choiceValue="${"Isaac Newton"}"></lion-checkbox>
    <lion-checkbox label="Galileo Galilei" .choiceValue="${"Galileo Galilei"}"></lion-checkbox>
  </lion-checkbox-indeterminate>
</lion-checkbox-group>`,S=()=>o`<lion-checkbox-group name="scientists[]" label="Favorite scientists">
  <lion-checkbox-indeterminate label="Scientists">
    <lion-checkbox label="Isaac Newton" .choiceValue="${"Isaac Newton"}"></lion-checkbox>
    <lion-checkbox label="Galileo Galilei" .choiceValue="${"Galileo Galilei"}"></lion-checkbox>
    <lion-checkbox-indeterminate label="Old Greek scientists">
      <lion-checkbox label="Archimedes" .choiceValue="${"Archimedes"}"></lion-checkbox>
      <lion-checkbox label="Plato" .choiceValue="${"Plato"}"></lion-checkbox>
      <lion-checkbox label="Pythagoras" .choiceValue="${"Pythagoras"}"></lion-checkbox>
    </lion-checkbox-indeterminate>
  </lion-checkbox-indeterminate>
</lion-checkbox-group>`,C=()=>o`<lion-checkbox-group name="scientists[]" label="Favorite scientists">
  <lion-checkbox-indeterminate mixed-state label="Scientists">
    <lion-checkbox label="Isaac Newton" .choiceValue="${"Isaac Newton"}"></lion-checkbox>
    <lion-checkbox label="Galileo Galilei" .choiceValue="${"Galileo Galilei"}"></lion-checkbox>
    <lion-checkbox-indeterminate mixed-state label="Old Greek scientists">
      <lion-checkbox label="Archimedes" .choiceValue="${"Archimedes"}"></lion-checkbox>
      <lion-checkbox label="Plato" .choiceValue="${"Plato"}"></lion-checkbox>
      <lion-checkbox label="Pythagoras" .choiceValue="${"Pythagoras"}"></lion-checkbox>
    </lion-checkbox-indeterminate>
  </lion-checkbox-indeterminate>
</lion-checkbox-group>`,V=document,w=[{key:"HtmlStory5",story:x},{key:"HtmlStory6",story:_},{key:"HtmlStory7",story:p},{key:"HtmlStory8",story:g},{key:"event",story:f},{key:"HtmlStory9",story:y},{key:"HtmlStory10",story:S},{key:"HtmlStory11",story:C}];let h=!1;for(const s of w){const e=V.querySelector(`[mdjs-story-name="${s.key}"]`);e&&(e.story=s.story,e.key=s.key,h=!0,Object.assign(e,{simulatorUrl:"/next/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}h&&(customElements.get("mdjs-preview")||a(()=>import("./define.DYUong5B.js"),__vite__mapDeps([0,1,2,3,4,5])),customElements.get("mdjs-story")||a(()=>import("./define.m2CvvXyF.js"),__vite__mapDeps([6,2,3])));export{S as HtmlStory10,C as HtmlStory11,x as HtmlStory5,_ as HtmlStory6,p as HtmlStory7,g as HtmlStory8,y as HtmlStory9,f as event};
