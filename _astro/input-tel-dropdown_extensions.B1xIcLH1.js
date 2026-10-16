const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/bg-BG.Bnnvf1Bg.js","_astro/bg.cAbNsgR2.js","_astro/cs-CZ.jxUu1MQ0.js","_astro/cs.CyY5t3iC.js","_astro/de-DE.BnzYNJbg.js","_astro/de.ou-f7rT6.js","_astro/en-AU.DameL28B.js","_astro/en.BDwGjUbD.js","_astro/en-GB.DameL28B.js","_astro/en-US.DameL28B.js","_astro/es-ES.BsH0TTKF.js","_astro/es.vxHxtw0d.js","_astro/fr-FR.BboN4Rha.js","_astro/fr.DfYBrNY0.js","_astro/fr-BE.BboN4Rha.js","_astro/hu-HU.CGTUtYCS.js","_astro/hu.BbaKgWJP.js","_astro/it-IT.1RI6S2uH.js","_astro/it.v6QT23uy.js","_astro/nl-BE.B42ELDSD.js","_astro/nl.Dc1cf0_P.js","_astro/nl-NL.B42ELDSD.js","_astro/pl-PL.BaaL7tUx.js","_astro/pl.BCWtIbf3.js","_astro/ro-RO.D0dOcG7n.js","_astro/ro.CO9JRaxM.js","_astro/ru-RU.Dwn5zlRa.js","_astro/ru.Dp9gfP09.js","_astro/sk-SK.aEOlEyfw.js","_astro/sk.BGEXiDbG.js","_astro/uk-UA.Cvel3gYC.js","_astro/uk.B-cbhpbu.js","_astro/define.BdbiuFq9.js","_astro/MdJsPreview.3BOxlSHn.js","_astro/lit-element.jD9bOQKo.js","_astro/lit-html.DtZEZPQ5.js","_astro/lit-element.BdYmZD4s.js","_astro/define.DNIVKtom.js"])))=>i.map(i=>d[i]);
import{_ as n}from"./preload-helper.CVfkMyKi.js";import"./MdJsPreview.3BOxlSHn.js";import{a as b}from"./lit-element.jD9bOQKo.js";import{x as d}from"./lit-html.DtZEZPQ5.js";import"./unsafe-html.DgrA3nwU.js";import"./lion-select-rich.C6mEY_FI.js";import{S as N}from"./lit-element.BdYmZD4s.js";import{e as A,n as w}from"./ref.Ce3g7EUE.js";import{c as y}from"./repeat.DviZyQ5m.js";import{I,a as O,b as V}from"./intl-select-rich.JzhcnVKm.js";import{V as U}from"./Validator.5Lzf4Mnd.js";import{L as D,g as x}from"./LocalizeMixin.Dif-q-Ka.js";import{b as T,a as S,F as M}from"./FormRegistrarMixin.LTK1l1ff.js";import{d as $}from"./dedupeMixin.6XPTJgK8.js";import{L as F}from"./LionField.CxE-D4Ht.js";import{l as k}from"./loadDefaultFeedbackMessages.DKrgwlad.js";const z=(o=>class extends T(S(M(o))){static get properties(){return{autocomplete:{type:String,reflect:!0}}}constructor(){super(),this.autocomplete=void 0}get _inputNode(){return super._inputNode}get selectionStart(){const t=this._inputNode;return t&&t.selectionStart?t.selectionStart:0}set selectionStart(t){const i=this._inputNode;i&&i.selectionStart&&(i.selectionStart=t)}get selectionEnd(){const t=this._inputNode;return t&&t.selectionEnd?t.selectionEnd:0}set selectionEnd(t){const i=this._inputNode;i&&i.selectionEnd&&(i.selectionEnd=t)}get value(){return this._inputNode&&this._inputNode.value||this.__value||""}set value(t){this._inputNode?(this._inputNode.value!==t&&this._setValueAndPreserveCaret(t),this.__value=void 0):this.__value=t}_setValueAndPreserveCaret(t){if(this.focused)try{if(!(this._inputNode instanceof HTMLSelectElement)){const i=this._inputNode.selectionStart;this._inputNode.value=t,this._inputNode.selectionStart=i,this._inputNode.selectionEnd=i}}catch{this._inputNode.value=t}else this._inputNode.value=t}_reflectBackFormattedValueToUser(){if(super._reflectBackFormattedValueToUser(),this._reflectBackOn()&&this.focused)try{this._inputNode.selectionStart=this._inputNode.value.length}catch{}}get _focusableNode(){return this._inputNode}}),B=$(z);function v(o){return String.fromCodePoint(127397+o.toUpperCase().charCodeAt(0))}function j(o){return v(o[0])+v(o[1])}let E;class a{static async loadLibPhoneNumber(){const e=await n(()=>import("./index-esm.BEEDzKyl.js"),[]);return this.PhoneUtil={...e},E(void 0),e}static get isLoaded(){return!!this.PhoneUtil}}a.loadComplete=new Promise(o=>{E=o});a.loadLibPhoneNumber();function h(o,{regionCode:e,formatCountryCodeStyle:t}){const i=a?.PhoneUtil?.getCountryCodeForRegionCode(e);return t==="parentheses"&&i&&o.includes(`+${i}`)&&!o.includes("(")?o.replace(`+${i}`,`(+${i})`):o}function L(o,{regionCode:e,formatStrategy:t="international",formatCountryCodeStyle:i="default"}){if(!a.isLoaded)return o;const r=a.PhoneUtil;let s;try{s=r.parsePhoneNumber(o,{regionCode:e})}catch{}if(o?.length>=4&&o?.length<=16&&s?.valid){let l;switch(t){case"e164":l=s.number.e164;break;case"international":l=s.number.international;break;case"national":l=s.number.national;break;case"rfc3966":l=s.number.rfc3966;break;case"significant":l=s.number.significant;break}return i!=="default"?h(l,{regionCode:e,formatCountryCodeStyle:i}):l}return i!=="default"?h(o,{regionCode:e,formatCountryCodeStyle:i}):o}class H extends B(F){static get properties(){return{readOnly:{type:Boolean,attribute:"readonly",reflect:!0},type:{type:String,reflect:!0},placeholder:{type:String,reflect:!0}}}get slots(){return{...super.slots,input:()=>{const e=document.createElement("input"),t=this.getAttribute("value");return t&&e.setAttribute("value",t),e}}}get _inputNode(){return super._inputNode}constructor(){super(),this.readOnly=!1,this.type="text",this.placeholder=""}requestUpdate(e,t,i){super.requestUpdate(e,t,i),e==="readOnly"&&this.__delegateReadOnly()}firstUpdated(e){super.firstUpdated(e),this.__delegateReadOnly()}updated(e){super.updated(e),e.has("type")&&(this._inputNode.type=this.type),e.has("placeholder")&&(this._inputNode.placeholder=this.placeholder),e.has("disabled")&&(this._inputNode.disabled=this.disabled,this.validate()),e.has("name")&&(this._inputNode.name=this.name),e.has("autocomplete")&&(this._inputNode.autocomplete=this.autocomplete)}__delegateReadOnly(){this._inputNode&&(this._inputNode.readOnly=this.readOnly)}}function W(o,{regionCode:e,formatStrategy:t,prevViewValue:i,currentCaretIndex:r,formatCountryCodeStyle:s}){if(o.length-i.length<=0||!a.isLoaded)return;const p=a.PhoneUtil.getAsYouType(e);for(const f of o)f!==""&&p.addChar(f);let m=!1,u=L(p.number(),{regionCode:e,formatStrategy:t});s==="parentheses"&&e&&!u.includes("(")&&(u=h(u,{regionCode:e,formatCountryCodeStyle:s}),m=!0);const c=a?.PhoneUtil?.getCountryCodeForRegionCode(e),P=u.length-o.length;let g=r+P;return m&&c&&o.length>c.toString().length+1&&r<=c.toString().length+1&&(g-=2),u?{viewValue:u,caretIndex:g}:void 0}function q(o,{regionCode:e}){if(!a.isLoaded)return o;const t=a.PhoneUtil,i=/[+0-9]+/gi,r=o.match(i)?.join("");let s;try{s=t.parsePhoneNumber(r,{regionCode:e})}catch{}return s?.number?s.number.e164:o}function R(o,e){const t=a.PhoneUtil;let i=!1;if(e&&o?.length>=4&&o?.length<=16){let r;try{if(r=t.parsePhoneNumber(o,{regionCode:e}),i=r.regionCode!==e,i)return"invalid-country-code"}catch{}const s=r.valid?!1:r.possibility;return s==="is-possible"?"unknown":s}return"unknown"}class G extends U{static validatorName="PhoneNumber";static get async(){return!a.isLoaded}execute(e,t){return a.isLoaded?R(e,t):new Promise(i=>{a.loadComplete.then(()=>{i(R(e,t))})})}}const K=o=>{switch(o){case"bg-BG":return n(()=>import("./bg-BG.Bnnvf1Bg.js"),__vite__mapDeps([0,1]));case"bg":return n(()=>import("./bg.cAbNsgR2.js"),[]);case"cs-CZ":return n(()=>import("./cs-CZ.jxUu1MQ0.js"),__vite__mapDeps([2,3]));case"cs":return n(()=>import("./cs.CyY5t3iC.js"),[]);case"de-DE":return n(()=>import("./de-DE.BnzYNJbg.js"),__vite__mapDeps([4,5]));case"de":return n(()=>import("./de.ou-f7rT6.js"),[]);case"en-AU":return n(()=>import("./en-AU.DameL28B.js"),__vite__mapDeps([6,7]));case"en-GB":return n(()=>import("./en-GB.DameL28B.js"),__vite__mapDeps([8,7]));case"en-US":return n(()=>import("./en-US.DameL28B.js"),__vite__mapDeps([9,7]));case"en-PH":case"en":return n(()=>import("./en.BDwGjUbD.js"),[]);case"es-ES":return n(()=>import("./es-ES.BsH0TTKF.js"),__vite__mapDeps([10,11]));case"es":return n(()=>import("./es.vxHxtw0d.js"),[]);case"fr-FR":return n(()=>import("./fr-FR.BboN4Rha.js"),__vite__mapDeps([12,13]));case"fr-BE":return n(()=>import("./fr-BE.BboN4Rha.js"),__vite__mapDeps([14,13]));case"fr":return n(()=>import("./fr.DfYBrNY0.js"),[]);case"hu-HU":return n(()=>import("./hu-HU.CGTUtYCS.js"),__vite__mapDeps([15,16]));case"hu":return n(()=>import("./hu.BbaKgWJP.js"),[]);case"it-IT":return n(()=>import("./it-IT.1RI6S2uH.js"),__vite__mapDeps([17,18]));case"it":return n(()=>import("./it.v6QT23uy.js"),[]);case"nl-BE":return n(()=>import("./nl-BE.B42ELDSD.js"),__vite__mapDeps([19,20]));case"nl-NL":return n(()=>import("./nl-NL.B42ELDSD.js"),__vite__mapDeps([21,20]));case"nl":return n(()=>import("./nl.Dc1cf0_P.js"),[]);case"pl-PL":return n(()=>import("./pl-PL.BaaL7tUx.js"),__vite__mapDeps([22,23]));case"pl":return n(()=>import("./pl.BCWtIbf3.js"),[]);case"ro-RO":return n(()=>import("./ro-RO.D0dOcG7n.js"),__vite__mapDeps([24,25]));case"ro":return n(()=>import("./ro.CO9JRaxM.js"),[]);case"ru-RU":return n(()=>import("./ru-RU.Dwn5zlRa.js"),__vite__mapDeps([26,27]));case"ru":return n(()=>import("./ru.Dp9gfP09.js"),[]);case"sk-SK":return n(()=>import("./sk-SK.aEOlEyfw.js"),__vite__mapDeps([28,29]));case"sk":return n(()=>import("./sk.BGEXiDbG.js"),[]);case"uk-UA":return n(()=>import("./uk-UA.Cvel3gYC.js"),__vite__mapDeps([30,31]));case"uk":return n(()=>import("./uk.B-cbhpbu.js"),[]);case"zh-CN":case"zh":return n(()=>import("./zh.CmwSrkd3.js"),[]);default:return n(()=>import("./en.BDwGjUbD.js"),[])}};class Y extends D(H){static properties={allowedRegions:{type:Array},formatStrategy:{type:String,attribute:"format-strategy"},formatCountryCodeStyle:{type:String,attribute:"format-country-code-style"},activeRegion:{type:String},preferredRegions:{type:Array},_phoneUtil:{type:Object,state:!0}};static localizeNamespaces=[{"lion-input-tel":K},...super.localizeNamespaces];get activeRegion(){return this.__activeRegion}set activeRegion(e){}get activePhoneNumberType(){let e;try{e=this._phoneUtil&&this._phoneUtil.parsePhoneNumber(this.modelValue,{regionCode:this.activeRegion})}catch{}return e?.type||"unknown"}set activePhoneNumberType(e){}_setActiveRegion(e){const t=this.activeRegion;this.__activeRegion=e,this.requestUpdate("activeRegion",t)}get _allowedOrAllRegions(){return(this.allowedRegions?.length?this.allowedRegions:this._phoneUtil?.getSupportedRegionCodes())||[]}get _phoneUtilLoadComplete(){return a.loadComplete}get fieldName(){return this._localizeManager.msg("lion-input-tel:phoneNumber")}__isPhoneNumberValidatorInstance;_langIso=void 0;constructor(){super(),this.autocomplete="tel",this.formatStrategy="international",this.formatCountryCodeStyle="default",this.allowedRegions=[],this.preferredRegions=[],this.__isPhoneNumberValidatorInstance=new G,this.defaultValidators.push(this.__isPhoneNumberValidatorInstance),this._phoneUtil=a.isLoaded?a.PhoneUtil:null,a.isLoaded||a.loadComplete.then(()=>{this._onPhoneNumberUtilReady()})}firstUpdated(e){super.firstUpdated(e),this._inputNode.inputMode="tel"}updated(e){super.updated(e),e.has("activeRegion")&&(this.__isUpdatingRegionWhileFocused=this.focused,this._calculateValues({source:null}),this.__isUpdatingRegionWhileFocused=!1,this.__isPhoneNumberValidatorInstance.param=this.activeRegion,this.formatOptions.regionCode=this.activeRegion),e.has("formatStrategy")&&(this._calculateValues({source:null}),this.formatOptions.formatStrategy=this.formatStrategy),e.has("formatCountryCodeStyle")&&(this._calculateValues({source:null}),this.formatOptions.formatCountryCodeStyle=this.formatCountryCodeStyle),(e.has("modelValue")||e.has("allowedRegions"))&&this.__calculateActiveRegion()}onLocaleUpdated(){super.onLocaleUpdated();const e=this._localizeManager.locale.split("-");this._langIso=e[e.length-1].toUpperCase(),this.__calculateActiveRegion()}formatter(e){return L(e,{regionCode:this.activeRegion,formatStrategy:this.formatStrategy,formatCountryCodeStyle:this.formatCountryCodeStyle})}parser(e){return q(e,{regionCode:this.activeRegion})}preprocessor(e,{currentCaretIndex:t,prevViewValue:i}){return W(e,{regionCode:this.activeRegion,formatStrategy:this.formatStrategy,formatCountryCodeStyle:this.formatCountryCodeStyle,currentCaretIndex:t,prevViewValue:i})}_reflectBackOn(){return!this.__isUpdatingRegionWhileFocused&&super._reflectBackOn()}_onPhoneNumberUtilReady(){this._phoneUtil=a.PhoneUtil,this._calculateValues({source:null}),this.__calculateActiveRegion()}__calculateActiveRegion(){if(this.allowedRegions?.length===1){this._setActiveRegion(this.allowedRegions[0]);return}const e=/[+0-9]+/gi,t=this.value.match(e)?.join(""),i=t&&this._phoneUtil&&this._phoneUtil.parsePhoneNumber(t).regionCode;if(i&&this._allowedOrAllRegions.includes(i)){this._setActiveRegion(i);return}if(this.preferredRegions?.length>0){this._setActiveRegion(this.preferredRegions[0]);return}if(this._langIso&&this._allowedOrAllRegions.includes(this._langIso)){this._setActiveRegion(this._langIso);return}this._setActiveRegion(void 0)}}function Z(o){return new Intl.Locale("und",{region:o}).maximize().baseName}class J extends Y{refs={dropdown:A()};get _templateDataDropdown(){const e=x();return{refs:{dropdown:{ref:this.refs.dropdown,props:{style:"height: 100%;"},listeners:{change:this._onDropdownValueChange,"model-value-changed":this._onDropdownValueChange},labels:{selectCountry:e.msg("lion-input-tel:selectCountry"),allCountries:this._allCountriesLabel||e.msg("lion-input-tel:allCountries"),preferredCountries:this._preferredCountriesLabel||e.msg("lion-input-tel:suggestedCountries")}},input:this._inputNode},data:{activeRegion:this.activeRegion,regionMetaList:this.__regionMetaList,regionMetaListPreferred:this.__regionMetaListPreferred}}}static templates={dropdown:e=>{const{refs:t,data:i}=e,r=s=>d`${this.templates.dropdownOption(e,s)} `;return d`
        <select
          ${w(t?.dropdown?.ref)}
          aria-label="${t?.dropdown?.labels?.selectCountry}"
          @change="${t?.dropdown?.listeners?.change}"
          style="${t?.dropdown?.props?.style}"
        >
          ${i?.regionMetaListPreferred?.length?d`
                <optgroup label="${t?.dropdown?.labels?.preferredCountries}">
                  ${i.regionMetaListPreferred.map(r)}
                </optgroup>
                <optgroup label="${t?.dropdown?.labels?.allCountries}">
                  ${i?.regionMetaList?.map(r)}
                </optgroup>
              `:d` ${i?.regionMetaList?.map(r)}`}
        </select>
      `},dropdownOption:(e,{regionCode:t,countryCode:i,flagSymbol:r})=>d`
      <option value="${t}">${t} (+${i}) &nbsp; ${r}</option>
    `};static styles=[super.styles,b`
      /**
       * We need to align the height of the dropdown with the height of the text field.
       * We target the HTMLDivElement (render wrapper from SlotMixin) here. Its child,
       * [data-ref=dropdown], receives a 100% height as well via inline styles (since we
       * can't target from shadow styles).
       */
      ::slotted([slot='prefix']) {
        height: 100%;
      }
    `];get slots(){return{...super.slots,prefix:()=>{const e=this.constructor,{templates:t}=e;return{template:t.dropdown(this._templateDataDropdown),renderAsDirectHostChild:!0}}}}onLocaleUpdated(){super.onLocaleUpdated(),this.__namesForLocale=new Intl.DisplayNames([this._localizeManager.locale],{type:"region"}),this.__createRegionMeta()}_onPhoneNumberUtilReady(){super._onPhoneNumberUtilReady(),this.__createRegionMeta()}_allCountriesLabel;_preferredCountriesLabel;__regionMetaList;__regionMetaListPreferred;constructor(){super(),this._allCountriesLabel="",this._preferredCountriesLabel="",this.__regionMetaList=[],this.__regionMetaListPreferred=[],this._onDropdownValueChange=this._onDropdownValueChange.bind(this),this.__syncRegionWithDropdown=this.__syncRegionWithDropdown.bind(this)}willUpdate(e){super.willUpdate(e),e.has("allowedRegions")&&this.__createRegionMeta()}updated(e){super.updated(e),this.__syncRegionWithDropdown(),(e.has("disabled")||e.has("readOnly"))&&(this.disabled||this.readOnly?this.refs.dropdown?.value?.setAttribute("disabled",""):this.refs.dropdown?.value?.removeAttribute("disabled")),e.has("_phoneUtil")&&this._initModelValueBasedOnDropdown()}_initModelValueBasedOnDropdown(){if(!this._initialModelValue&&!this.dirty&&this._phoneUtil){const e=this._phoneUtil.getCountryCodeForRegionCode(this.activeRegion);this.formatCountryCodeStyle==="parentheses"?this.__initializedRegionCode=`(+${e})`:this.__initializedRegionCode=`+${e}`,this._inputNode.value=this.__initializedRegionCode,this._initialModelValue=this.__initializedRegionCode,this.initInteractionState()}}_isEmpty(e=this.modelValue){return super._isEmpty(e)||this.value===this.__initializedRegionCode}_onDropdownValueChange(e){const t=e.detail?.initialize||!this._phoneUtil,i=e.target,r=i.modelValue||i.value;if(t||this.activeRegion===r)return;const s=this.activeRegion;if(this._setActiveRegion(r),s!==this.activeRegion&&!this.focused&&this._phoneUtil){const l=this._phoneUtil.getCountryCodeForRegionCode(s),_=this._phoneUtil.getCountryCodeForRegionCode(this.activeRegion);if(this.value.includes(`+${l}`))this.modelValue=this._callParser(this.value.replace(`+${l}`,`+${_}`));else{const p=this.value.split(" ");this.formatCountryCodeStyle==="parentheses"&&!this.value.includes("(")?this.modelValue=this._callParser(this.value.replace(p[0],`(+${_})`)):this.modelValue=this._callParser(this.value.replace(p[0],`+${_}`))}}}__syncRegionWithDropdown(e=this.activeRegion){const t=this.refs.dropdown?.value;if(!t||!e)return;const i=this._phoneUtil?.getCountryCodeForRegionCode(e);if("modelValue"in t){if(this._phoneUtil?.getCountryCodeForRegionCode(t.modelValue)===i)return;t.modelValue=e}else{if(this._phoneUtil?.getCountryCodeForRegionCode(t.value)===i)return;t.value=e}}__createRegionMeta(){!this._allowedOrAllRegions?.length||!this.__namesForLocale||(this.__regionMetaList=[],this.__regionMetaListPreferred=[],this._allowedOrAllRegions.forEach(e=>{const t=new Intl.DisplayNames([Z(e)],{type:"region"}),i=this._phoneUtil&&this._phoneUtil.getCountryCodeForRegionCode(e),r=j(e);(this.preferredRegions.includes(e)?this.__regionMetaListPreferred:this.__regionMetaList).push({regionCode:e,countryCode:i,flagSymbol:r,nameForLocale:this.__namesForLocale?.of(e),nameForRegion:t.of(e)})}))}_repropagationCondition(){return!1}}let Q=class extends N(J){static styles=[super.styles,b`
      :host,
      ::slotted(*) {
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        font-size: 14px;
        line-height: 1.42857143;
        color: #333;
      }

      :host {
        max-width: 300px;
      }

      .input-group__container {
        width: 100%;
        height: 34px;
        font-size: 14px;
        line-height: 1.42857143;
        color: #555;
        background-color: #fff;
        background-image: none;
        border: 1px solid #ccc;
        border-radius: 4px;
        -webkit-box-shadow: inset 0 1px 1px rgb(0 0 0 / 8%);
        box-shadow: inset 0 1px 1px rgb(0 0 0 / 8%);
        -webkit-transition:
          border-color ease-in-out 0.15s,
          -webkit-box-shadow ease-in-out 0.15s;
        -o-transition:
          border-color ease-in-out 0.15s,
          box-shadow ease-in-out 0.15s;
        transition:
          border-color ease-in-out 0.15s,
          box-shadow ease-in-out 0.15s;
      }

      .input-group__input {
        padding: 6px;
        box-sizing: border-box;
      }

      .input-group__input ::slotted(input) {
        border: none;
        outline: none;
      }

      :host([focused]) .input-group__container {
        border-color: #66afe9;
        outline: 0;
        -webkit-box-shadow:
          inset 0 1px 1px rgb(0 0 0 / 8%),
          0 0 8px rgb(102 175 233 / 60%);
        box-shadow:
          inset 0 1px 1px rgb(0 0 0 / 8%),
          0 0 8px rgb(102 175 233 / 60%);
      }
    `];static templates={...super.templates||{},dropdown:e=>{const{refs:t,data:i}=e;return d`
        <intl-select-rich
          ${w(t?.dropdown?.ref)}
          label="${t?.dropdown?.labels?.country}"
          label-sr-only
          .config="${{elementToFocusAfterHide:t?.input}}"
          @model-value-changed="${t?.dropdown?.listeners["model-value-changed"]}"
          style="${t?.dropdown?.props?.style}"
        >
          ${i?.regionMetaListPreferred?.length?d` ${y(i.regionMetaListPreferred,r=>r.regionCode,r=>d`${this.templates.dropdownOption(e,r)} `)}<intl-separator></intl-separator>`:""}
          ${y(i.regionMetaList,r=>r.regionCode,r=>d`${this.templates.dropdownOption(e,r)} `)}
        </intl-select-rich>
      `},dropdownOption:(e,t)=>d`
      <intl-option .choiceValue="${t.regionCode}" .regionMeta="${t}">
      </intl-option>
    `};static scopedElements={...super.scopedElements,"intl-select-rich":V,"intl-option":O,"intl-separator":I}};customElements.define("intl-input-tel-dropdown",Q);const X=()=>(k(),d`
    <intl-input-tel-dropdown
      .preferredRegions="${["NL","PH"]}"
      .modelValue="${"+639608920056"}"
      label="Telephone number"
      help-text="Advanced dropdown and styling"
      name="phoneNumber"
    ></intl-input-tel-dropdown>
  `),ee=document,te=[{key:"IntlInputTelDropdown",story:X}];let C=!1;for(const o of te){const e=ee.querySelector(`[mdjs-story-name="${o.key}"]`);e&&(e.story=o.story,e.key=o.key,C=!0,Object.assign(e,{simulatorUrl:"/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}C&&(customElements.get("mdjs-preview")||n(()=>import("./define.BdbiuFq9.js"),__vite__mapDeps([32,33,34,35,36])),customElements.get("mdjs-story")||n(()=>import("./define.DNIVKtom.js"),__vite__mapDeps([37,34,35])));export{X as IntlInputTelDropdown};
