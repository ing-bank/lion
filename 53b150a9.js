import"./24f95583.js";import{x as e,a as r}from"./b4be29f1.js";import"./05905ff1.js";import{e as t,n as s}from"./3ae224d1.js";import{o}from"./bee32da7.js";import{p as n,f as i,L as a}from"./5668bf4f.js";import{V as c}from"./4dc0ac82.js";import{I as l}from"./e49751c9.js";import{l as u}from"./c85cfbca.js";import"./afb8834e.js";import"./19d2607c.js";import"./4cc99b59.js";import"./d45984a3.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./dc2f5f5a.js";import"./88185952.js";import"./24c57689.js";import"./10e1d49e.js";import"./4a239ef1.js";import"./9157d4cc.js";import"./7902d8e0.js";import"./143fde17.js";import"./298b3bc0.js";import"./459b1eec.js";import"./cc85a6f4.js";import"./48ac1cb5.js";import"./b7f85193.js";import"./622cc741.js";import"./a06c5caf.js";const d={AD:"EUR",AE:"AED",AF:"AFN",AG:"XCD",AI:"XCD",AL:"ALL",AM:"AMD",AO:"AOA",AR:"ARS",AS:"USD",AT:"EUR",AU:"AUD",AW:"AWG",AX:"EUR",AZ:"AZN",BA:"BAM",BB:"BBD",BD:"BDT",BE:"EUR",BF:"XOF",BG:"BGN",BH:"BHD",BI:"BIF",BJ:"XOF",BL:"EUR",BM:"BMD",BN:"BND",BO:"BOB",BQ:"USD",BR:"BRL",BS:"BSD",BT:"BTN",BV:"NOK",BW:"BWP",BY:"BYN",BZ:"BZD",CA:"CAD",CC:"AUD",CD:"CDF",CF:"XAF",CG:"XAF",CH:"CHF",CI:"XOF",CK:"NZD",CL:"CLP",CM:"XAF",CN:"CNY",CO:"COP",CR:"CRC",CU:"CUP",CV:"CVE",CW:"XCG",CX:"AUD",CY:"EUR",CZ:"CZK",DE:"EUR",DJ:"DJF",DK:"DKK",DM:"XCD",DO:"DOP",DZ:"DZD",EC:"USD",EE:"EUR",EG:"EGP",EH:"MAD",ER:"ERN",ES:"EUR",ET:"ETB",FI:"EUR",FJ:"FJD",FK:"FKP",FM:"USD",FO:"DKK",FR:"EUR",GA:"XAF",GB:"GBP",GD:"XCD",GE:"GEL",GF:"EUR",GG:"GBP",GH:"GHS",GI:"GIP",GL:"DKK",GM:"GMD",GN:"GNF",GP:"EUR",GQ:"XAF",GR:"EUR",GS:"GBP",GT:"GTQ",GU:"USD",GW:"XOF",GY:"GYD",HK:"HKD",HM:"AUD",HN:"HNL",HR:"EUR",HT:"HTG",HU:"HUF",ID:"IDR",IE:"EUR",IL:"ILS",IM:"GBP",IN:"INR",IO:"USD",IQ:"IQD",IR:"IRR",IS:"ISK",IT:"EUR",JE:"GBP",JM:"JMD",JO:"JOD",JP:"JPY",KE:"KES",KG:"KGS",KH:"KHR",KI:"AUD",KM:"KMF",KN:"XCD",KP:"KPW",KR:"KRW",KW:"KWD",KY:"KYD",KZ:"KZT",LA:"LAK",LB:"LBP",LC:"XCD",LI:"CHF",LK:"LKR",LR:"LRD",LS:"LSL",LT:"EUR",LU:"EUR",LV:"EUR",LY:"LYD",MA:"MAD",MC:"EUR",MD:"MDL",ME:"EUR",MF:"EUR",MG:"MGA",MH:"USD",MK:"MKD",ML:"XOF",MM:"MMK",MN:"MNT",MO:"MOP",MP:"USD",MQ:"EUR",MR:"MRU",MS:"XCD",MT:"EUR",MU:"MUR",MV:"MVR",MW:"MWK",MX:"MXN",MY:"MYR",MZ:"MZN",NA:"NAD",NC:"XPF",NE:"XOF",NF:"AUD",NG:"NGN",NI:"NIO",NL:"EUR",NO:"NOK",NP:"NPR",NR:"AUD",NU:"NZD",NZ:"NZD",OM:"OMR",PA:"PAB",PE:"PEN",PF:"XPF",PG:"PGK",PH:"PHP",PK:"PKR",PL:"PLN",PM:"EUR",PN:"NZD",PR:"USD",PS:"ILS",PT:"EUR",PW:"USD",PY:"PYG",QA:"QAR",RE:"EUR",RO:"RON",RS:"RSD",RU:"RUB",RW:"RWF",SA:"SAR",SB:"SBD",SC:"SCR",SD:"SDG",SE:"SEK",SG:"SGD",SH:"SHP",SI:"EUR",SJ:"NOK",SK:"EUR",SL:"SLE",SM:"EUR",SN:"XOF",SO:"SOS",SR:"SRD",SS:"SSP",ST:"STN",SV:"SVC",SX:"XCG",SY:"SYP",SZ:"SZL",TC:"USD",TD:"XAF",TF:"EUR",TG:"XOF",TH:"THB",TJ:"TJS",TK:"NZD",TL:"USD",TM:"TMT",TN:"TND",TO:"TOP",TR:"TRY",TT:"TTD",TV:"AUD",TW:"TWD",TZ:"TZS",UA:"UAH",UG:"UGX",UM:"USD",US:"USD",UY:"UYU",UZ:"UZS",VA:"EUR",VC:"XCD",VE:"VES",VG:"USD",VI:"USD",VN:"VND",VU:"VUV",WF:"XPF",WS:"WST",YE:"YER",YT:"EUR",ZA:"ZAR",ZM:"ZMW",ZW:"ZWG"},p={countryToCurrencyMap:new Map(Object.entries(d)),allCurrencies:new Set(Object.values(d).sort()),getCurrencySymbol:(e,r)=>r&&e&&new Intl.NumberFormat(r,{style:"currency",currency:e}).formatToParts(1).find(e=>"currency"===e.type)?.value||""},h=(e,r)=>({amount:n(e,r),currency:r?.currency}),m=e=>`${e?.currency} ${e?.amount}`,y=e=>{const[r,t]=e.split(" ");return{currency:r,amount:t}};class C extends c{static validatorName="CurrencyAndAmount";execute(e){const r=p.allCurrencies.has(e?.currency),t=(new l).execute(e.amount);return r&&t}}const D=e=>{switch(e){case"bg-BG":case"bg":return import("./554e1bc2.js");case"cs-CZ":case"cs":return import("./08d84066.js");case"de-DE":case"de":return import("./19a6e1ba.js");case"en-AU":case"en-GB":case"en-US":case"en-PH":case"en":default:return import("./90a83c7d.js");case"es-ES":case"es":return import("./d5994ea0.js");case"fr-FR":case"fr-BE":case"fr":return import("./4ede55bc.js");case"hu-HU":case"hu":return import("./dc23e79a.js");case"id-ID":case"id":return import("./f83e9e9a.js");case"it-IT":case"it":return import("./78ddb912.js");case"nl-BE":case"nl-NL":case"nl":return import("./7663bdba.js");case"pl-PL":case"pl":return import("./731c1767.js");case"ro-RO":case"ro":return import("./de4eebaf.js");case"ru-RU":case"ru":return import("./620ee492.js");case"sk-SK":case"sk":return import("./a55eb3fc.js");case"uk-UA":case"uk":return import("./23c80da4.js");case"zh-CN":case"zh":return import("./6805a2ac.js")}};class S extends a{static properties={preferredCurrencies:{type:Array},allowedCurrencies:{type:Array},__dropdownSlot:{type:String}};static localizeNamespaces=[{"lion-input-amount-dropdown":D},...super.localizeNamespaces];refs={dropdown:t()};get _templateDataDropdown(){return{refs:{dropdown:{ref:this.refs.dropdown,listeners:{change:this._onDropdownValueChange,"model-value-changed":this._onDropdownValueChange},labels:{selectCurrency:this._localizeManager.msg("lion-input-amount-dropdown:selectCurrency"),allCurrencies:this._allCurrenciesLabel||this._localizeManager.msg("lion-input-amount-dropdown:allCurrencies"),preferredCurrencies:this._preferredCurrenciesLabel||this._localizeManager.msg("lion-input-amount-dropdown:suggestedCurrencies")}},input:this._inputNode},data:{currency:this.currency,regionMetaList:this.__regionMetaList,regionMetaListPreferred:this.__regionMetaListPreferred}}}get _dropdownSlot(){return this.__dropdownSlot}set _dropdownSlot(e){if("suffix"!==e&&"prefix"!==e)throw new Error("Only the suffix and prefix slots are valid positions for the dropdown.");this.__dropdownSlot=e}static templates={dropdown:r=>{const{refs:t,data:n}=r,i=t=>e`${this.templates.dropdownOption(r,t)} `;return e`
        <select
          ${s(t?.dropdown?.ref)}
          aria-label="${t?.dropdown?.labels?.selectCurrency}"
          @change="${t?.dropdown?.listeners?.change}"
          style="${o(t?.dropdown?.props?.style)}"
        >
          ${n?.regionMetaListPreferred?.length?e`
                <optgroup label="${t?.dropdown?.labels?.preferredCurrencies}">
                  ${n.regionMetaListPreferred.map(i)}
                </optgroup>
                <optgroup label="${t?.dropdown?.labels?.allCurrencies}">
                  ${n?.regionMetaList?.map(i)}
                </optgroup>
              `:e` ${n?.regionMetaList?.map(i)}`}
        </select>
      `},dropdownOption:(r,{currencyCode:t,nameForLocale:s,currencySymbol:n})=>e`
      <option
        value="${t}"
        aria-label="${o(s&&n?`${s}, ${n}`:"")}"
      >
        ${t} (${n})&nbsp;
      </option>
    `};static styles=[super.styles,r`
      /**
       * We need to align the height of the dropdown with the height of the text field.
       * We target the HTMLDivElement (render wrapper from SlotMixin) here. Its child,
       * [data-ref=dropdown], receives a 100% height as well via inline styles (since we
       * can't target from shadow styles).
       */
      ::slotted([slot='prefix']),
      ::slotted([slot='suffix']) {
        height: 100%;
      }

      /**
      * visually hiding the 'after' slot, leaving it as sr-only (screen-reader only)
      * source: https://www.scottohara.me/blog/2017/04/14/inclusively-hidden.html
      */
      ::slotted([slot='after']:not(:focus):not(:active)) {
        clip: rect(0 0 0 0);
        clip-path: inset(50%);
        height: 1px;
        overflow: hidden;
        position: absolute;
        white-space: nowrap;
        width: 1px;
      }
    `];get slots(){return{...super.slots,[this._dropdownSlot]:()=>{const e=this.constructor,{templates:r}=e;return{template:r.dropdown(this._templateDataDropdown),renderAsDirectHostChild:!0}}}}onLocaleUpdated(){super.onLocaleUpdated();const e=this._localizeManager.locale.split("-");this._langIso=e[e.length-1].toUpperCase(),this.__namesForLocale=new Intl.DisplayNames([this._langIso],{type:"currency"}),this.__calculateActiveCurrency(),this.__createCurrencyMeta()}constructor(){super(),this.parser=h,this.formatter=(e,r)=>((e,r,t)=>(p.allCurrencies.has(e?.currency)&&t&&(t.currency=e?.currency),i(e?.amount,r)))(e,r,this),this.serializer=m,this.deserializer=y,this.defaultValidators=[new C],this.__dropdownSlot="prefix",this.preferredCurrencies=[],this.allowedCurrencies=[],this._allCurrenciesLabel="",this._preferredCurrenciesLabel="",this.__regionMetaList=[],this.__regionMetaListPreferred=[],this._onDropdownValueChange=this._onDropdownValueChange.bind(this),this.__syncCurrencyWithDropdown=this.__syncCurrencyWithDropdown.bind(this),this._currencyUtil=p}willUpdate(e){super.willUpdate(e),e.has("allowedCurrencies")&&this.__createCurrencyMeta()}updated(e){super.updated(e),this.__syncCurrencyWithDropdown(),(e.has("disabled")||e.has("readOnly"))&&(this.disabled||this.readOnly?this.refs.dropdown?.value?.setAttribute("disabled",""):this.refs.dropdown?.value?.removeAttribute("disabled")),e.has("allowedCurrencies")&&this.allowedCurrencies.length>0&&this.__calculateActiveCurrency()}firstUpdated(e){super.firstUpdated?.(e),this._initModelValueBasedOnDropdown()}_initModelValueBasedOnDropdown(){this._initialModelValue||this.dirty||(this.__initializedCurrencyCode=this.currency,this._initialModelValue={currency:this.currency},this.modelValue=this._initialModelValue,this.initInteractionState())}_isEmpty(e=this.modelValue){return super._isEmpty(e)||this.currency===this.__initializedCurrencyCode}_onDropdownValueChange(e){const r=e.detail?.initialize,t=e.target,s=t.modelValue||t.value;if(r||this.currency===s)return;const o=this.currency;this.currency=s,o===this.currency||this.focused||(this.value?(this.formatOptions.currency=this.currency,this.modelValue=this._callParser(this.value)):this.modelValue={currency:this.currency,amount:this.value})}__syncCurrencyWithDropdown(e=this.currency){const r=this.refs.dropdown?.value;if(r&&e)if("modelValue"in r){if(r.modelValue===e)return;r.modelValue=e}else{if(r.value===e)return;r.value=e}}__createCurrencyMeta(){this._allowedOrAllCurrencies?.length&&this.__namesForLocale&&(this.__regionMetaList=[],this.__regionMetaListPreferred=[],this._allowedOrAllCurrencies.forEach(e=>{(this.preferredCurrencies.includes(e)?this.__regionMetaListPreferred:this.__regionMetaList).push({currencyCode:e,nameForLocale:this.__namesForLocale?.of(e),currencySymbol:this._currencyUtil.getCurrencySymbol(e,this._langIso??"")})}))}_repropagationCondition(){return!1}__calculateActiveCurrency(){1!==this.allowedCurrencies?.length?this.modelValue?.currency&&this.allowedCurrencies?.includes(this.modelValue?.currency)?this.currency=this.modelValue.currency:this.preferredCurrencies?.length>0?[this.currency]=this.preferredCurrencies:this._langIso&&this._currencyUtil?.countryToCurrencyMap.has(this._langIso)&&this._allowedOrAllCurrencies.includes(this._currencyUtil?.countryToCurrencyMap.get(this._langIso))?this.currency=this._currencyUtil?.countryToCurrencyMap.get(this._langIso):this.currency=void 0:[this.currency]=this.allowedCurrencies}get _allowedOrAllCurrencies(){return this.allowedCurrencies?.length?this.allowedCurrencies:Array.from(this._currencyUtil?.allCurrencies)||[]}}customElements.define("lion-input-amount-dropdown",S);const U=()=>(u(),e`
    <lion-input-amount-dropdown
      label="Select currency via dropdown"
      help-text="Shows all currencies by default"
      name="amount"
    ></lion-input-amount-dropdown>
  `),f=()=>(u(),e`
    <lion-input-amount-dropdown
      label="Select currency via dropdown"
      help-text="Shows only allowed currencies"
      name="amount"
      .allowedCurrencies=${["EUR","GBP"]}
    ></lion-input-amount-dropdown>
  `),w=()=>(u(),e`
    <lion-input-amount-dropdown
      label="Select currency via dropdown"
      help-text="Preferred currencies show on top"
      name="amount"
      .allowedCurrencies=${["EUR","GBP","USD","JPY"]}
      .preferredCurrencies=${["USD","JPY"]}
    ></lion-input-amount-dropdown>
  `);customElements.define("demo-amount-dropdown",class extends S{constructor(){super(),this._dropdownSlot="suffix"}});const _=()=>(u(),e`
    <demo-amount-dropdown
      label="Select region via dropdown"
      help-text="the dropdown shows in the suffix slot"
      name="amount"
    ></demo-amount-dropdown>
  `),M=document,R=[{key:"InputAmountDropdown",story:U},{key:"allowedCurrencies",story:f},{key:"preferredCurrencies",story:w},{key:"suffixSlot",story:_}];let E=!1;for(const e of R){const r=M.querySelector(`[mdjs-story-name="${e.key}"]`);r&&(r.story=e.story,r.key=e.key,E=!0,Object.assign(r,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}E&&(customElements.get("mdjs-preview")||import("./a7b4f51b.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{U as InputAmountDropdown,f as allowedCurrencies,w as preferredCurrencies,_ as suffixSlot};
