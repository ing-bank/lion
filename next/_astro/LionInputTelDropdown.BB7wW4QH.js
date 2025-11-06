import{a as p}from"./lit-element.qDHKJJma.js";import{x as r}from"./lit-html.C7L4dwLU.js";import{e as u,n as c}from"./ref.DN9F-cVD.js";import{L as g}from"./LionInputTel.DVBCZWII.js";import{g as _}from"./getLocalizeManager.W5d_ICRU.js";function h(n){return String.fromCodePoint(127397+n.toUpperCase().charCodeAt(0))}function f(n){return h(n[0])+h(n[1])}function m(n){return new Intl.Locale("und",{region:n}).maximize().baseName}class v extends g{refs={dropdown:u()};get _templateDataDropdown(){const e=_();return{refs:{dropdown:{ref:this.refs.dropdown,props:{style:"height: 100%;"},listeners:{change:this._onDropdownValueChange,"model-value-changed":this._onDropdownValueChange},labels:{selectCountry:e.msg("lion-input-tel:selectCountry"),allCountries:this._allCountriesLabel||e.msg("lion-input-tel:allCountries"),preferredCountries:this._preferredCountriesLabel||e.msg("lion-input-tel:suggestedCountries")}},input:this._inputNode},data:{activeRegion:this.activeRegion,regionMetaList:this.__regionMetaList,regionMetaListPreferred:this.__regionMetaListPreferred}}}static templates={dropdown:e=>{const{refs:t,data:o}=e,i=s=>r`${this.templates.dropdownOption(e,s)} `;return r`
        <select
          ${c(t?.dropdown?.ref)}
          aria-label="${t?.dropdown?.labels?.selectCountry}"
          @change="${t?.dropdown?.listeners?.change}"
          style="${t?.dropdown?.props?.style}"
        >
          ${o?.regionMetaListPreferred?.length?r`
                <optgroup label="${t?.dropdown?.labels?.preferredCountries}">
                  ${o.regionMetaListPreferred.map(i)}
                </optgroup>
                <optgroup label="${t?.dropdown?.labels?.allCountries}">
                  ${o?.regionMetaList?.map(i)}
                </optgroup>
              `:r` ${o?.regionMetaList?.map(i)}`}
        </select>
      `},dropdownOption:(e,{regionCode:t,countryCode:o,flagSymbol:i})=>r`
      <option value="${t}">${t} (+${o}) &nbsp; ${i}</option>
    `};static styles=[super.styles,p`
      /**
       * We need to align the height of the dropdown with the height of the text field.
       * We target the HTMLDivElement (render wrapper from SlotMixin) here. Its child,
       * [data-ref=dropdown], receives a 100% height as well via inline styles (since we
       * can't target from shadow styles).
       */
      ::slotted([slot='prefix']) {
        height: 100%;
      }
    `];get slots(){return{...super.slots,prefix:()=>{const e=this.constructor,{templates:t}=e;return{template:t.dropdown(this._templateDataDropdown),renderAsDirectHostChild:!0}}}}onLocaleUpdated(){super.onLocaleUpdated(),this.__namesForLocale=new Intl.DisplayNames([this._localizeManager.locale],{type:"region"}),this.__createRegionMeta()}_onPhoneNumberUtilReady(){super._onPhoneNumberUtilReady(),this.__createRegionMeta()}constructor(){super(),this._allCountriesLabel="",this._preferredCountriesLabel="",this.__regionMetaList=[],this.__regionMetaListPreferred=[],this._onDropdownValueChange=this._onDropdownValueChange.bind(this),this.__syncRegionWithDropdown=this.__syncRegionWithDropdown.bind(this)}willUpdate(e){super.willUpdate(e),e.has("allowedRegions")&&this.__createRegionMeta()}updated(e){super.updated(e),this.__syncRegionWithDropdown(),(e.has("disabled")||e.has("readOnly"))&&(this.disabled||this.readOnly?this.refs.dropdown?.value?.setAttribute("disabled",""):this.refs.dropdown?.value?.removeAttribute("disabled")),e.has("_phoneUtil")&&this._initModelValueBasedOnDropdown()}_initModelValueBasedOnDropdown(){if(!this._initialModelValue&&!this.dirty&&this._phoneUtil){const e=this._phoneUtil.getCountryCodeForRegionCode(this.activeRegion);this.formatCountryCodeStyle==="parentheses"?this.__initializedRegionCode=`(+${e})`:this.__initializedRegionCode=`+${e}`,this._inputNode.value=this.__initializedRegionCode,this._initialModelValue=this.__initializedRegionCode,this.initInteractionState()}}_isEmpty(e=this.modelValue){return super._isEmpty(e)||this.value===this.__initializedRegionCode}_onDropdownValueChange(e){const t=e.detail?.initialize||!this._phoneUtil,o=e.target,i=o.modelValue||o.value;if(t||this.activeRegion===i)return;const s=this.activeRegion;if(this._setActiveRegion(i),s!==this.activeRegion&&!this.focused&&this._phoneUtil){const l=this._phoneUtil.getCountryCodeForRegionCode(s),a=this._phoneUtil.getCountryCodeForRegionCode(this.activeRegion);if(this.value.includes(`+${l}`))this.modelValue=this._callParser(this.value.replace(`+${l}`,`+${a}`));else{const d=this.value.split(" ");this.formatCountryCodeStyle==="parentheses"&&!this.value.includes("(")?this.modelValue=this._callParser(this.value.replace(d[0],`(+${a})`)):this.modelValue=this._callParser(this.value.replace(d[0],`+${a}`))}}}__syncRegionWithDropdown(e=this.activeRegion){const t=this.refs.dropdown?.value;if(!t||!e)return;const o=this._phoneUtil?.getCountryCodeForRegionCode(e);if("modelValue"in t){if(this._phoneUtil?.getCountryCodeForRegionCode(t.modelValue)===o)return;t.modelValue=e}else{if(this._phoneUtil?.getCountryCodeForRegionCode(t.value)===o)return;t.value=e}}__createRegionMeta(){!this._allowedOrAllRegions?.length||!this.__namesForLocale||(this.__regionMetaList=[],this.__regionMetaListPreferred=[],this._allowedOrAllRegions.forEach(e=>{const t=new Intl.DisplayNames([m(e)],{type:"region"}),o=this._phoneUtil&&this._phoneUtil.getCountryCodeForRegionCode(e),i=f(e);(this.preferredRegions.includes(e)?this.__regionMetaListPreferred:this.__regionMetaList).push({regionCode:e,countryCode:o,flagSymbol:i,nameForLocale:this.__namesForLocale?.of(e),nameForRegion:t.of(e)})}))}_repropagationCondition(){return!1}}export{v as L};
