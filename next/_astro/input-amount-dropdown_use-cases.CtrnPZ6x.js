const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.DSVRgKCR.js","_astro/node-tools_providence-analytics_overview.BxIihMx7.js","_astro/lit-element.jD9bOQKo.js","_astro/lit-html.DtZEZPQ5.js","_astro/unsafe-html.DgrA3nwU.js","_astro/directive.BO6BEpVC.js","_astro/define.DNIVKtom.js"])))=>i.map(i=>d[i]);
import{_ as n}from"./preload-helper.Cj2JEybs.js";import"./node-tools_providence-analytics_overview.BxIihMx7.js";import{a as h}from"./lit-element.jD9bOQKo.js";import{x as i}from"./lit-html.DtZEZPQ5.js";import"./unsafe-html.DgrA3nwU.js";import{e as m,n as D}from"./ref.Ce3g7EUE.js";import{o as c}from"./if-defined.D12E33D2.js";import{p as C,f as E,L as y}from"./LionInputAmount.DOqp70Iu.js";import{V as f}from"./Validator.DAOhFpDH.js";import{I as w}from"./NumberValidators.CmKpqCIb.js";import{l as a}from"./loadDefaultFeedbackMessages.G20iUcvC.js";const d={AD:"EUR",AE:"AED",AF:"AFN",AG:"XCD",AI:"XCD",AL:"ALL",AM:"AMD",AO:"AOA",AR:"ARS",AS:"USD",AT:"EUR",AU:"AUD",AW:"AWG",AX:"EUR",AZ:"AZN",BA:"BAM",BB:"BBD",BD:"BDT",BE:"EUR",BF:"XOF",BG:"EUR",BH:"BHD",BI:"BIF",BJ:"XOF",BL:"EUR",BM:"BMD",BN:"BND",BO:"BOB",BQ:"USD",BR:"BRL",BS:"BSD",BT:"BTN",BV:"NOK",BW:"BWP",BY:"BYN",BZ:"BZD",CA:"CAD",CC:"AUD",CD:"CDF",CF:"XAF",CG:"XAF",CH:"CHF",CI:"XOF",CK:"NZD",CL:"CLP",CM:"XAF",CN:"CNY",CO:"COP",CR:"CRC",CU:"CUP",CV:"CVE",CW:"XCG",CX:"AUD",CY:"EUR",CZ:"CZK",DE:"EUR",DJ:"DJF",DK:"DKK",DM:"XCD",DO:"DOP",DZ:"DZD",EC:"USD",EE:"EUR",EG:"EGP",EH:"MAD",ER:"ERN",ES:"EUR",ET:"ETB",FI:"EUR",FJ:"FJD",FK:"FKP",FM:"USD",FO:"DKK",FR:"EUR",GA:"XAF",GB:"GBP",GD:"XCD",GE:"GEL",GF:"EUR",GG:"GBP",GH:"GHS",GI:"GIP",GL:"DKK",GM:"GMD",GN:"GNF",GP:"EUR",GQ:"XAF",GR:"EUR",GS:"GBP",GT:"GTQ",GU:"USD",GW:"XOF",GY:"GYD",HK:"HKD",HM:"AUD",HN:"HNL",HR:"EUR",HT:"HTG",HU:"HUF",ID:"IDR",IE:"EUR",IL:"ILS",IM:"GBP",IN:"INR",IO:"USD",IQ:"IQD",IR:"IRR",IS:"ISK",IT:"EUR",JE:"GBP",JM:"JMD",JO:"JOD",JP:"JPY",KE:"KES",KG:"KGS",KH:"KHR",KI:"AUD",KM:"KMF",KN:"XCD",KP:"KPW",KR:"KRW",KW:"KWD",KY:"KYD",KZ:"KZT",LA:"LAK",LB:"LBP",LC:"XCD",LI:"CHF",LK:"LKR",LR:"LRD",LS:"LSL",LT:"EUR",LU:"EUR",LV:"EUR",LY:"LYD",MA:"MAD",MC:"EUR",MD:"MDL",ME:"EUR",MF:"EUR",MG:"MGA",MH:"USD",MK:"MKD",ML:"XOF",MM:"MMK",MN:"MNT",MO:"MOP",MP:"USD",MQ:"EUR",MR:"MRU",MS:"XCD",MT:"EUR",MU:"MUR",MV:"MVR",MW:"MWK",MX:"MXN",MY:"MYR",MZ:"MZN",NA:"NAD",NC:"XPF",NE:"XOF",NF:"AUD",NG:"NGN",NI:"NIO",NL:"EUR",NO:"NOK",NP:"NPR",NR:"AUD",NU:"NZD",NZ:"NZD",OM:"OMR",PA:"PAB",PE:"PEN",PF:"XPF",PG:"PGK",PH:"PHP",PK:"PKR",PL:"PLN",PM:"EUR",PN:"NZD",PR:"USD",PS:"ILS",PT:"EUR",PW:"USD",PY:"PYG",QA:"QAR",RE:"EUR",RO:"RON",RS:"RSD",RU:"RUB",RW:"RWF",SA:"SAR",SB:"SBD",SC:"SCR",SD:"SDG",SE:"SEK",SG:"SGD",SH:"SHP",SI:"EUR",SJ:"NOK",SK:"EUR",SL:"SLE",SM:"EUR",SN:"XOF",SO:"SOS",SR:"SRD",SS:"SSP",ST:"STN",SV:"SVC",SX:"XCG",SY:"SYP",SZ:"SZL",TC:"USD",TD:"XAF",TF:"EUR",TG:"XOF",TH:"THB",TJ:"TJS",TK:"NZD",TL:"USD",TM:"TMT",TN:"TND",TO:"TOP",TR:"TRY",TT:"TTD",TV:"AUD",TW:"TWD",TZ:"TZS",UA:"UAH",UG:"UGX",UM:"USD",US:"USD",UY:"UYU",UZ:"UZS",VA:"EUR",VC:"XCD",VE:"VES",VG:"USD",VI:"USD",VN:"VND",VU:"VUV",WF:"XPF",WS:"WST",YE:"YER",YT:"EUR",ZA:"ZAR",ZM:"ZMW",ZW:"ZWG"},U=new Map(Object.entries(d)),A=new Set(Object.values(d).sort()),S=(t,e)=>!e||!t?"":new Intl.NumberFormat(e,{style:"currency",currency:t}).formatToParts(1).find(r=>r.type==="currency")?.value||"",u={countryToCurrencyMap:U,allCurrencies:A,getCurrencySymbol:S},R=(t,e)=>({amount:C(t,e),currency:e?.currency}),M=(t,e,r)=>(u.allCurrencies.has(t?.currency)&&r&&(r.currency=t?.currency),E(t?.amount,e)),L=t=>`${t?.currency} ${t?.amount}`,P=t=>{const[e,r]=t.split(" ");return{currency:e,amount:r}};class g extends f{static validatorName="CurrencyAndAmount";execute(e){const r=u.allCurrencies.has(e?.currency),o=new w().execute(e.amount);return r&&o}}const T=t=>{switch(t){case"bg-BG":case"bg":return n(()=>import("./bg.BS39fmwb.js"),[]);case"cs-CZ":case"cs":return n(()=>import("./cs.CrZXKqMg.js"),[]);case"de-DE":case"de":return n(()=>import("./de.CCIsuMZz.js"),[]);case"en-AU":case"en-GB":case"en-US":case"en-PH":case"en":return n(()=>import("./en.BWdXq6-G.js"),[]);case"es-ES":case"es":return n(()=>import("./es.DCuNWYQg.js"),[]);case"fr-FR":case"fr-BE":case"fr":return n(()=>import("./fr.CkPP8HZt.js"),[]);case"hu-HU":case"hu":return n(()=>import("./hu.CKFikVeo.js"),[]);case"id-ID":case"id":return n(()=>import("./id.BECsq2xF.js"),[]);case"it-IT":case"it":return n(()=>import("./it.DusPIPgH.js"),[]);case"nl-BE":case"nl-NL":case"nl":return n(()=>import("./nl.BuGTl-YU.js"),[]);case"pl-PL":case"pl":return n(()=>import("./pl.C4Qgz8s6.js"),[]);case"ro-RO":case"ro":return n(()=>import("./ro.B-fei83F.js"),[]);case"ru-RU":case"ru":return n(()=>import("./ru.y-8Lk-uQ.js"),[]);case"sk-SK":case"sk":return n(()=>import("./sk.F_aXf0-U.js"),[]);case"uk-UA":case"uk":return n(()=>import("./uk.Cjk96XP6.js"),[]);case"zh-CN":case"zh":return n(()=>import("./zh.C9VZfqXb.js"),[]);default:return n(()=>import("./en.BWdXq6-G.js"),[])}};class p extends y{static properties={preferredCurrencies:{type:Array},allowedCurrencies:{type:Array},__dropdownSlot:{type:String}};static localizeNamespaces=[{"lion-input-amount-dropdown":T},...super.localizeNamespaces];refs={dropdown:m()};get _templateDataDropdown(){return{refs:{dropdown:{ref:this.refs.dropdown,listeners:{change:this._onDropdownValueChange,"model-value-changed":this._onDropdownValueChange},labels:{selectCurrency:this._localizeManager.msg("lion-input-amount-dropdown:selectCurrency"),allCurrencies:this._allCurrenciesLabel||this._localizeManager.msg("lion-input-amount-dropdown:allCurrencies"),preferredCurrencies:this._preferredCurrenciesLabel||this._localizeManager.msg("lion-input-amount-dropdown:suggestedCurrencies")}},input:this._inputNode},data:{currency:this.currency,regionMetaList:this.__regionMetaList,regionMetaListPreferred:this.__regionMetaListPreferred}}}get _dropdownSlot(){return this.__dropdownSlot}set _dropdownSlot(e){if(e!=="suffix"&&e!=="prefix")throw new Error("Only the suffix and prefix slots are valid positions for the dropdown.");this.__dropdownSlot=e}static templates={dropdown:e=>{const{refs:r,data:o}=e,s=l=>i`${this.templates.dropdownOption(e,l)} `;return i`
        <select
          ${D(r?.dropdown?.ref)}
          aria-label="${r?.dropdown?.labels?.selectCurrency}"
          @change="${r?.dropdown?.listeners?.change}"
          style="${c(r?.dropdown?.props?.style)}"
        >
          ${o?.regionMetaListPreferred?.length?i`
                <optgroup label="${r?.dropdown?.labels?.preferredCurrencies}">
                  ${o.regionMetaListPreferred.map(s)}
                </optgroup>
                <optgroup label="${r?.dropdown?.labels?.allCurrencies}">
                  ${o?.regionMetaList?.map(s)}
                </optgroup>
              `:i` ${o?.regionMetaList?.map(s)}`}
        </select>
      `},dropdownOption:(e,{currencyCode:r,nameForLocale:o,currencySymbol:s})=>i`
      <option
        value="${r}"
        aria-label="${c(o&&s?`${o}, ${s}`:"")}"
      >
        ${r} (${s})&nbsp;
      </option>
    `};static styles=[super.styles,h`
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
    `];get slots(){return{...super.slots,[this._dropdownSlot]:()=>{const e=this.constructor,{templates:r}=e;return{template:r.dropdown(this._templateDataDropdown),renderAsDirectHostChild:!0}}}}onLocaleUpdated(){super.onLocaleUpdated();const e=this._localizeManager.locale.split("-");this._langIso=e[e.length-1].toUpperCase(),this.__namesForLocale=new Intl.DisplayNames([this._langIso],{type:"currency"}),this.__calculateActiveCurrency(),this.__createCurrencyMeta()}constructor(){super(),this.parser=R,this.formatter=(e,r)=>M(e,r,this),this.serializer=L,this.deserializer=P,this.defaultValidators=[new g],this.__dropdownSlot="prefix",this.preferredCurrencies=[],this.allowedCurrencies=[],this._allCurrenciesLabel="",this._preferredCurrenciesLabel="",this.__regionMetaList=[],this.__regionMetaListPreferred=[],this._onDropdownValueChange=this._onDropdownValueChange.bind(this),this.__syncCurrencyWithDropdown=this.__syncCurrencyWithDropdown.bind(this),this._currencyUtil=u}willUpdate(e){super.willUpdate(e),e.has("allowedCurrencies")&&this.__createCurrencyMeta()}updated(e){super.updated(e),this.__syncCurrencyWithDropdown(),(e.has("disabled")||e.has("readOnly"))&&(this.disabled||this.readOnly?this.refs.dropdown?.value?.setAttribute("disabled",""):this.refs.dropdown?.value?.removeAttribute("disabled")),e.has("allowedCurrencies")&&this.allowedCurrencies.length>0&&this.__calculateActiveCurrency()}firstUpdated(e){super.firstUpdated?.(e),this._initModelValueBasedOnDropdown()}_initModelValueBasedOnDropdown(){!this._initialModelValue&&!this.dirty&&(this.__initializedCurrencyCode=this.currency,this._initialModelValue={currency:this.currency},this.modelValue=this._initialModelValue,this.initInteractionState())}_isEmpty(e=this.modelValue){return super._isEmpty(e)||this.currency===this.__initializedCurrencyCode}_onDropdownValueChange(e){const r=e.detail?.initialize,o=e.target,s=o.modelValue||o.value;if(r||this.currency===s)return;const l=this.currency;this.currency=s,l!==this.currency&&!this.focused&&(this.value?(this.formatOptions.currency=this.currency,this.modelValue=this._callParser(this.value)):this.modelValue={currency:this.currency,amount:this.value})}__syncCurrencyWithDropdown(e=this.currency){const r=this.refs.dropdown?.value;if(!(!r||!e))if("modelValue"in r){if(r.modelValue===e)return;r.modelValue=e}else{if(r.value===e)return;r.value=e}}__createCurrencyMeta(){!this._allowedOrAllCurrencies?.length||!this.__namesForLocale||(this.__regionMetaList=[],this.__regionMetaListPreferred=[],this._allowedOrAllCurrencies.forEach(e=>{(this.preferredCurrencies.includes(e)?this.__regionMetaListPreferred:this.__regionMetaList).push({currencyCode:e,nameForLocale:this.__namesForLocale?.of(e),currencySymbol:this._currencyUtil.getCurrencySymbol(e,this._langIso??"")})}))}_repropagationCondition(){return!1}__calculateActiveCurrency(){if(this.allowedCurrencies?.length===1){[this.currency]=this.allowedCurrencies;return}if(this.modelValue?.currency&&this.allowedCurrencies?.includes(this.modelValue?.currency)){this.currency=this.modelValue.currency;return}if(this.preferredCurrencies?.length>0){[this.currency]=this.preferredCurrencies;return}if(this._langIso&&this._currencyUtil?.countryToCurrencyMap.has(this._langIso)&&this._allowedOrAllCurrencies.includes(this._currencyUtil?.countryToCurrencyMap.get(this._langIso))){this.currency=this._currencyUtil?.countryToCurrencyMap.get(this._langIso);return}this.currency=void 0}get _allowedOrAllCurrencies(){return this.allowedCurrencies?.length?this.allowedCurrencies:Array.from(this._currencyUtil?.allCurrencies)||[]}}customElements.define("lion-input-amount-dropdown",p);const O=()=>(a(),i`
    <lion-input-amount-dropdown
      label="Select currency via dropdown"
      help-text="Shows all currencies by default"
      name="amount"
    ></lion-input-amount-dropdown>
  `),I=()=>(a(),i`
    <lion-input-amount-dropdown
      label="Select currency via dropdown"
      help-text="Shows only allowed currencies"
      name="amount"
      .allowedCurrencies=${["EUR","GBP"]}
    ></lion-input-amount-dropdown>
  `),N=()=>(a(),i`
    <lion-input-amount-dropdown
      label="Select currency via dropdown"
      help-text="Preferred currencies show on top"
      name="amount"
      .allowedCurrencies=${["EUR","GBP","USD","JPY"]}
      .preferredCurrencies=${["USD","JPY"]}
    ></lion-input-amount-dropdown>
  `);class G extends p{constructor(){super(),this._dropdownSlot="suffix"}}customElements.define("demo-amount-dropdown",G);const B=()=>(a(),i`
    <demo-amount-dropdown
      label="Select region via dropdown"
      help-text="the dropdown shows in the suffix slot"
      name="amount"
    ></demo-amount-dropdown>
  `),V=document,v=[{key:"InputAmountDropdown",story:O},{key:"allowedCurrencies",story:I},{key:"preferredCurrencies",story:N},{key:"suffixSlot",story:B}];let _=!1;for(const t of v){const e=V.querySelector(`[mdjs-story-name="${t.key}"]`);e&&(e.story=t.story,e.key=t.key,_=!0,Object.assign(e,{simulatorUrl:"/next/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}_&&(customElements.get("mdjs-preview")||n(()=>import("./define.DSVRgKCR.js"),__vite__mapDeps([0,1,2,3,4,5])),customElements.get("mdjs-story")||n(()=>import("./define.DNIVKtom.js"),__vite__mapDeps([6,2,3])));export{O as InputAmountDropdown,I as allowedCurrencies,N as preferredCurrencies,B as suffixSlot};
