import{x as e,a as t}from"./b4be29f1.js";import{e as i,n as o}from"./3ae224d1.js";import{g as n}from"./d45984a3.js";import{L as s}from"./1fe9105d.js";function r(e){return String.fromCodePoint(127397+e.toUpperCase().charCodeAt(0))}function a(e){return new Intl.Locale("und",{region:e}).maximize().baseName}class l extends s{refs={dropdown:i()};get _templateDataDropdown(){const e=n();return{refs:{dropdown:{ref:this.refs.dropdown,props:{style:"height: 100%;"},listeners:{change:this._onDropdownValueChange,"model-value-changed":this._onDropdownValueChange},labels:{selectCountry:e.msg("lion-input-tel:selectCountry"),allCountries:this._allCountriesLabel||e.msg("lion-input-tel:allCountries"),preferredCountries:this._preferredCountriesLabel||e.msg("lion-input-tel:suggestedCountries")}},input:this._inputNode},data:{activeRegion:this.activeRegion,regionMetaList:this.__regionMetaList,regionMetaListPreferred:this.__regionMetaListPreferred}}}static templates={dropdown:t=>{const{refs:i,data:n}=t,s=i=>e`${this.templates.dropdownOption(t,i)} `;return e`
        <select
          ${o(i?.dropdown?.ref)}
          aria-label="${i?.dropdown?.labels?.selectCountry}"
          @change="${i?.dropdown?.listeners?.change}"
          style="${i?.dropdown?.props?.style}"
        >
          ${n?.regionMetaListPreferred?.length?e`
                <optgroup label="${i?.dropdown?.labels?.preferredCountries}">
                  ${n.regionMetaListPreferred.map(s)}
                </optgroup>
                <optgroup label="${i?.dropdown?.labels?.allCountries}">
                  ${n?.regionMetaList?.map(s)}
                </optgroup>
              `:e` ${n?.regionMetaList?.map(s)}`}
        </select>
      `},dropdownOption:(t,{regionCode:i,countryCode:o,flagSymbol:n})=>e`
      <option value="${i}">${i} (+${o}) &nbsp; ${n}</option>
    `};static styles=[super.styles,t`
      /**
       * We need to align the height of the dropdown with the height of the text field.
       * We target the HTMLDivElement (render wrapper from SlotMixin) here. Its child,
       * [data-ref=dropdown], receives a 100% height as well via inline styles (since we
       * can't target from shadow styles).
       */
      ::slotted([slot='prefix']) {
        height: 100%;
      }
    `];get slots(){return{...super.slots,prefix:()=>{const e=this.constructor,{templates:t}=e;return{template:t.dropdown(this._templateDataDropdown),renderAsDirectHostChild:!0}}}}onLocaleUpdated(){super.onLocaleUpdated(),this.__namesForLocale=new Intl.DisplayNames([this._localizeManager.locale],{type:"region"}),this.__createRegionMeta()}_onPhoneNumberUtilReady(){super._onPhoneNumberUtilReady(),this.__createRegionMeta()}constructor(){super(),this._allCountriesLabel="",this._preferredCountriesLabel="",this.__regionMetaList=[],this.__regionMetaListPreferred=[],this._onDropdownValueChange=this._onDropdownValueChange.bind(this),this.__syncRegionWithDropdown=this.__syncRegionWithDropdown.bind(this)}willUpdate(e){super.willUpdate(e),e.has("allowedRegions")&&this.__createRegionMeta()}updated(e){super.updated(e),this.__syncRegionWithDropdown(),(e.has("disabled")||e.has("readOnly"))&&(this.disabled||this.readOnly?this.refs.dropdown?.value?.setAttribute("disabled",""):this.refs.dropdown?.value?.removeAttribute("disabled")),e.has("_phoneUtil")&&this._initModelValueBasedOnDropdown()}_initModelValueBasedOnDropdown(){if(!this._initialModelValue&&!this.dirty&&this._phoneUtil){const e=this._phoneUtil.getCountryCodeForRegionCode(this.activeRegion);"parentheses"===this.formatCountryCodeStyle?this.__initializedRegionCode=`(+${e})`:this.__initializedRegionCode=`+${e}`,this._inputNode.value=this.__initializedRegionCode,this._initialModelValue=this.__initializedRegionCode,this.initInteractionState()}}_isEmpty(e=this.modelValue){return super._isEmpty(e)||this.value===this.__initializedRegionCode}_onDropdownValueChange(e){const t=e.detail?.initialize||!this._phoneUtil,i=e.target,o=i.modelValue||i.value;if(t||this.activeRegion===o)return;const n=this.activeRegion;if(this._setActiveRegion(o),n!==this.activeRegion&&!this.focused&&this._phoneUtil){const e=this._phoneUtil.getCountryCodeForRegionCode(n),t=this._phoneUtil.getCountryCodeForRegionCode(this.activeRegion);if(this.value.includes(`+${e}`))this.modelValue=this._callParser(this.value.replace(`+${e}`,`+${t}`));else{const e=this.value.split(" ");"parentheses"!==this.formatCountryCodeStyle||this.value.includes("(")?this.modelValue=this._callParser(this.value.replace(e[0],`+${t}`)):this.modelValue=this._callParser(this.value.replace(e[0],`(+${t})`))}}}__syncRegionWithDropdown(e=this.activeRegion){const t=this.refs.dropdown?.value;if(!t||!e)return;const i=this._phoneUtil?.getCountryCodeForRegionCode(e);if("modelValue"in t){const o=this._phoneUtil?.getCountryCodeForRegionCode(t.modelValue);if(o===i)return;t.modelValue=e}else{const o=this._phoneUtil?.getCountryCodeForRegionCode(t.value);if(o===i)return;t.value=e}}__createRegionMeta(){this._allowedOrAllRegions?.length&&this.__namesForLocale&&(this.__regionMetaList=[],this.__regionMetaListPreferred=[],this._allowedOrAllRegions.forEach(e=>{const t=new Intl.DisplayNames([a(e)],{type:"region"}),i=this._phoneUtil&&this._phoneUtil.getCountryCodeForRegionCode(e),o=function(e){return r(e[0])+r(e[1])}(e);(this.preferredRegions.includes(e)?this.__regionMetaListPreferred:this.__regionMetaList).push({regionCode:e,countryCode:i,flagSymbol:o,nameForLocale:this.__namesForLocale?.of(e),nameForRegion:t.of(e)})}))}_repropagationCondition(){return!1}}export{l as L};
