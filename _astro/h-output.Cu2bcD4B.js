import{i as u,a as m}from"./lit-element.jD9bOQKo.js";import{x as n}from"./lit-html.DtZEZPQ5.js";import{L as h}from"./LionField.CxE-D4Ht.js";import{c as f,F as c,V as _,d as p,g as E}from"./FormRegistrarMixin.LTK1l1ff.js";import{V as F}from"./Validator.5Lzf4Mnd.js";import{d as b}from"./dedupeMixin.6XPTJgK8.js";import{D as y}from"./DisabledMixin.BmUOUOUf.js";import{S as g}from"./SlotMixin.CqDzMooh.js";class V extends F{static get validatorName(){return"FormElementsHaveNoError"}execute(s,e,t){return t?.node._anyFormElementHasFeedbackFor("error")}static async getMessage(){return""}}const k=(a=>class extends f(c(_(y(g(a))))){static get properties(){return{submitted:{type:Boolean,reflect:!0},focused:{type:Boolean,reflect:!0},dirty:{type:Boolean,reflect:!0},touched:{type:Boolean,reflect:!0},prefilled:{type:Boolean,reflect:!0}}}get _inputNode(){return this}get modelValue(){return this._getFromAllFormElements("modelValue")}set modelValue(e){this.__isInitialModelValue?(this.__isInitialModelValue=!1,this.registrationComplete.then(()=>{this._setValueMapForAllFormElements("modelValue",e)})):this._setValueMapForAllFormElements("modelValue",e)}get serializedValue(){return this._getFromAllFormElements("serializedValue")}set serializedValue(e){this.__isInitialSerializedValue?(this.__isInitialSerializedValue=!1,this.registrationComplete.then(()=>{this._setValueMapForAllFormElements("serializedValue",e)})):this._setValueMapForAllFormElements("serializedValue",e)}get formattedValue(){return this._getFromAllFormElements("formattedValue")}set formattedValue(e){this._setValueMapForAllFormElements("formattedValue",e)}get prefilled(){return this._everyFormElementHas("prefilled")}constructor(){super(),this.value="",this.disabled=!1,this.submitted=!1,this.dirty=!1,this.touched=!1,this.focused=!1,this.__addedSubValidators=!1,this.__isInitialModelValue=!0,this.__isInitialSerializedValue=!0,this._checkForOutsideClick=this._checkForOutsideClick.bind(this),this.addEventListener("focusin",this._syncFocused),this.addEventListener("focusout",this._onFocusOut),this.addEventListener("dirty-changed",this._syncDirty),this.addEventListener("validate-performed",this.__onChildValidatePerformed),this.defaultValidators=[new V],this.__descriptionElementsInParentChain=new Set,this.__pendingValues={modelValue:{},serializedValue:{}}}connectedCallback(){super.connectedCallback(),this.setAttribute("role","group"),this.initComplete.then(()=>{this.__isInitialModelValue=!1,this.__isInitialSerializedValue=!1,this.__initInteractionStates()})}disconnectedCallback(){super.disconnectedCallback(),this.__hasActiveOutsideClickHandling&&(document.removeEventListener("click",this._checkForOutsideClick),this.__hasActiveOutsideClickHandling=!1),this.__descriptionElementsInParentChain.clear()}__initInteractionStates(){this.formElements.forEach(e=>{typeof e.initInteractionState=="function"&&e.initInteractionState()})}_triggerInitialModelValueChangedEvent(){this.registrationComplete.then(()=>{this._dispatchInitialModelValueChangedEvent()})}updated(e){super.updated(e),e.has("disabled")&&(this.disabled?this.__requestChildrenToBeDisabled():this.__retractRequestChildrenToBeDisabled()),e.has("focused")&&this.focused===!0&&this.__setupOutsideClickHandling()}__setupOutsideClickHandling(){this.__hasActiveOutsideClickHandling||(document.addEventListener("click",this._checkForOutsideClick),this.__hasActiveOutsideClickHandling=!0)}_checkForOutsideClick(e){!this.contains(e.target)&&(this.touched=!0)}__requestChildrenToBeDisabled(){this.formElements.forEach(e=>{e.makeRequestToBeDisabled&&e.makeRequestToBeDisabled()})}__retractRequestChildrenToBeDisabled(){this.formElements.forEach(e=>{e.retractRequestToBeDisabled&&e.retractRequestToBeDisabled()})}_inputGroupTemplate(){return n`
        <div class="input-group">
          <slot></slot>
        </div>
      `}submitGroup(){this.submitted=!0,this.formElements.forEach(e=>{typeof e.submitGroup=="function"?e.submitGroup():e.submitted=!0})}resetGroup(){this.formElements.forEach(e=>{typeof e.resetGroup=="function"?e.resetGroup():typeof e.reset=="function"&&e.reset()}),this.resetInteractionState()}clearGroup(){this.formElements.forEach(e=>{typeof e.clearGroup=="function"?e.clearGroup():typeof e.clear=="function"&&e.clear()}),this.resetInteractionState()}resetInteractionState(){this.submitted=!1,this.touched=!1,this.dirty=!1,this.formElements.forEach(e=>{typeof e.resetInteractionState=="function"&&e.resetInteractionState()})}_showFeedbackConditionFor(e,t){return t.touched&&t.dirty||t.prefilled||t.submitted}get _feedbackConditionMeta(){return{...super._feedbackConditionMeta,submitted:this.submitted,touched:this.touched,dirty:this.dirty,prefilled:this.prefilled}}_getFromAllFormElementsFilter(e,t){return!e.disabled}_getFromAllFormElements(e,t){const i={},l=t||this._getFromAllFormElementsFilter;return this.formElements._keys().forEach(r=>{const o=this.formElements[r];o instanceof p?i[r]=o.filter(d=>l(d,e)).map(d=>d[e]):l(o,e)&&(typeof o._getFromAllFormElements=="function"?i[r]=o._getFromAllFormElements(e):i[r]=o[e])}),i}_setValueForAllFormElements(e,t){this.formElements.forEach(i=>{i[e]=t})}_setValueMapForAllFormElements(e,t){t&&typeof t=="object"&&Object.keys(t).forEach(i=>{Array.isArray(this.formElements[i])&&this.formElements[i].forEach((l,r)=>{l[e]=t[i][r]}),this.formElements[i]?this.formElements[i][e]=t[i]:this.__pendingValues[e][i]=t[i]})}_anyFormElementHas(e){return Object.keys(this.formElements).some(t=>Array.isArray(this.formElements[t])?this.formElements[t].some(i=>!!i[e]):!!this.formElements[t][e])}_anyFormElementHasFeedbackFor(e){return Object.keys(this.formElements).some(t=>Array.isArray(this.formElements[t])?this.formElements[t].some(i=>!!(i.hasFeedbackFor&&i.hasFeedbackFor.includes(e))):!!(this.formElements[t].hasFeedbackFor&&this.formElements[t].hasFeedbackFor.includes(e)))}_everyFormElementHas(e){return Object.keys(this.formElements).every(t=>Array.isArray(this.formElements[t])?this.formElements[t].every(i=>!!i[e]):!!this.formElements[t][e])}__onChildValidatePerformed(e){e&&this.isRegisteredFormElement(e.target)&&this.validate()}_syncFocused(){this.focused=this._anyFormElementHas("focused")}_onFocusOut(e){const t=this.formElements[this.formElements.length-1];e.target===t&&(this.touched=!0),this.focused=!1}_syncDirty(){this.dirty=this._anyFormElementHas("dirty")}__storeAllDescriptionElementsInParentChain(){let t=this;for(;t;){const i=t._getAriaDescriptionElements();E(i,{reverse:!0}).forEach(r=>{r.getAttribute("slot")==="feedback"&&this.__descriptionElementsInParentChain.add(r)}),t=t._parentFormGroup}}__linkParentMessages(e){this.__descriptionElementsInParentChain.forEach(t=>{typeof e.addToAriaDescribedBy=="function"&&e.addToAriaDescribedBy(t,{reorder:!1})})}__unlinkParentMessages(e){this.__descriptionElementsInParentChain.forEach(t=>{typeof e.removeFromAriaDescribedBy=="function"&&e.removeFromAriaDescribedBy(t)})}addFormElement(e,t){if(super.addFormElement(e,t),this.disabled&&e.makeRequestToBeDisabled(),this.__descriptionElementsInParentChain.size||this.__storeAllDescriptionElementsInParentChain(),this.__linkParentMessages(e),this.validate({clearCurrentResult:!0}),!e.modelValue){const i=this.__pendingValues;i.modelValue&&i.modelValue[e.name]?e.modelValue=i.modelValue[e.name]:i.serializedValue&&i.serializedValue[e.name]&&(e.serializedValue=i.serializedValue[e.name])}}get _initialModelValue(){return this._getFromAllFormElements("_initialModelValue")}removeFormElement(e){super.removeFormElement(e),this.validate({clearCurrentResult:!0}),typeof e.removeFromAriaLabelledBy=="function"&&this._labelNode&&e.removeFromAriaLabelledBy(this._labelNode,{reorder:!1}),this.__unlinkParentMessages(e)}_isEmpty(){return this.formElements.every(e=>e._isEmpty?.())}}),C=b(k);class v extends C(u){constructor(){super(),this._isFormOrFieldset=!0,this._repropagationRole="fieldset"}}class A extends u{static properties={field:Object,show:Array,title:String,readyPromise:Object};static styles=[m`
      :host {
        display: block;
        margin-top: 8px;
      }

      code {
        font-size: 8px;
        background-color: #eee;
      }

      caption {
        position: absolute;
        top: 0;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip-path: inset(100%);
        clip: rect(1px, 1px, 1px, 1px);
        white-space: nowrap;
        border: 0;
        margin: 0;
        padding: 0;
      }

      table,
      th,
      td {
        border-bottom: 1px solid rgb(204, 204, 204);
        border-image: initial;
        padding: 4px;
        font-size: 12px;
        border-left: none;
        border-right: none;
        text-align: left;
      }

      td {
        max-width: 200px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      table {
        border-collapse: collapse;
      }

      caption {
        text-align: left;
      }
    `];firstUpdated(s){if(super.firstUpdated(s),!this.field){const t=this.previousElementSibling;(t instanceof h||t instanceof v)&&(this.field=t)}this.__rerender=this.__rerender.bind(this);const e=this.closest("[mdjs-story-name]")||this.parentElement;e.addEventListener("model-value-changed",this.__rerender),e.addEventListener("mousemove",this.__rerender),e.addEventListener("focusin",this.__rerender),e.addEventListener("focusout",this.__rerender),e.addEventListener("change",this.__rerender),this.field._inputNode.form&&this.field._inputNode.form.addEventListener("submit",this.__rerender),this.readyPromise&&this.readyPromise.then(()=>{this.__rerender()})}__rerender(){setTimeout(()=>{const s=this.field;this.field=null,this.field=s})}__renderProp(s){const e=this.field||{};let t="";if(typeof s=="string"){const i=e[s];if(typeof i=="boolean")return i===!0?"✓":"";if(typeof i>"u")return n`<code>undefined</code>`;if(typeof i=="object"&&i!==null)return JSON.stringify(i);t=i}else t=s.processor(e);return n`<span title="${t}">${t}</span>`}constructor(){super(),this.title="States"}render(){const s=e=>typeof e=="string"?e:e.name;return n`
      <table>
        <caption>
          ${this.title}
        </caption>
        <tr>
          ${this.show.map(e=>n`<th>${s(e)}</th>`)}
        </tr>
        <tr></tr>
        <tr>
          ${this.show.map(e=>n`<td>${this.__renderProp(e)}</td>`)}
        </tr>
      </table>
    `}}customElements.define("h-output",A);
