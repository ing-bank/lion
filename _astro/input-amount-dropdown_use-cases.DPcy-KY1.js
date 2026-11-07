const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.D5IFK1jp.js","_astro/MdJsPreview.B62up6PK.js","_astro/lit-element.DxRhnkit.js","_astro/lit-html.BX7rm8u-.js","_astro/dedupeMixin.6XPTJgK8.js","_astro/lit-element.BOikny4r.js","_astro/uuid.DjYKNjre.js","_astro/define.DBgp7shK.js"])))=>i.map(i=>d[i]);
import{_ as n}from"./preload-helper.CVfkMyKi.js";import"./MdJsPreview.B62up6PK.js";import"./lit-element.DxRhnkit.js";import{b as a}from"./lit-html.BX7rm8u-.js";import"./unsafe-html.FHlAasnX.js";import{b as i,i as m}from"./lit-element.BOikny4r.js";import{o as d}from"./if-defined.Bv0WtYQw.js";import{e as D,n as y}from"./ref.Cob19_Dl.js";import{f as C,p as f,L as E}from"./LionInputAmount.CViov2l6.js";import{V as w}from"./Validator.DAOhFpDH.js";import{I as U}from"./NumberValidators.CmKpqCIb.js";import{l as u}from"./loadDefaultFeedbackMessages.Dna2KIXH.js";const p={AD:"EUR",AE:"AED",AF:"AFN",AG:"XCD",AI:"XCD",AL:"ALL",AM:"AMD",AO:"AOA",AR:"ARS",AS:"USD",AT:"EUR",AU:"AUD",AW:"AWG",AX:"EUR",AZ:"AZN",BA:"BAM",BB:"BBD",BD:"BDT",BE:"EUR",BF:"XOF",BG:"EUR",BH:"BHD",BI:"BIF",BJ:"XOF",BL:"EUR",BM:"BMD",BN:"BND",BO:"BOB",BQ:"USD",BR:"BRL",BS:"BSD",BT:"BTN",BV:"NOK",BW:"BWP",BY:"BYN",BZ:"BZD",CA:"CAD",CC:"AUD",CD:"CDF",CF:"XAF",CG:"XAF",CH:"CHF",CI:"XOF",CK:"NZD",CL:"CLP",CM:"XAF",CN:"CNY",CO:"COP",CR:"CRC",CU:"CUP",CV:"CVE",CW:"XCG",CX:"AUD",CY:"EUR",CZ:"CZK",DE:"EUR",DJ:"DJF",DK:"DKK",DM:"XCD",DO:"DOP",DZ:"DZD",EC:"USD",EE:"EUR",EG:"EGP",EH:"MAD",ER:"ERN",ES:"EUR",ET:"ETB",FI:"EUR",FJ:"FJD",FK:"FKP",FM:"USD",FO:"DKK",FR:"EUR",GA:"XAF",GB:"GBP",GD:"XCD",GE:"GEL",GF:"EUR",GG:"GBP",GH:"GHS",GI:"GIP",GL:"DKK",GM:"GMD",GN:"GNF",GP:"EUR",GQ:"XAF",GR:"EUR",GS:"GBP",GT:"GTQ",GU:"USD",GW:"XOF",GY:"GYD",HK:"HKD",HM:"AUD",HN:"HNL",HR:"EUR",HT:"HTG",HU:"HUF",ID:"IDR",IE:"EUR",IL:"ILS",IM:"GBP",IN:"INR",IO:"USD",IQ:"IQD",IR:"IRR",IS:"ISK",IT:"EUR",JE:"GBP",JM:"JMD",JO:"JOD",JP:"JPY",KE:"KES",KG:"KGS",KH:"KHR",KI:"AUD",KM:"KMF",KN:"XCD",KP:"KPW",KR:"KRW",KW:"KWD",KY:"KYD",KZ:"KZT",LA:"LAK",LB:"LBP",LC:"XCD",LI:"CHF",LK:"LKR",LR:"LRD",LS:"LSL",LT:"EUR",LU:"EUR",LV:"EUR",LY:"LYD",MA:"MAD",MC:"EUR",MD:"MDL",ME:"EUR",MF:"EUR",MG:"MGA",MH:"USD",MK:"MKD",ML:"XOF",MM:"MMK",MN:"MNT",MO:"MOP",MP:"USD",MQ:"EUR",MR:"MRU",MS:"XCD",MT:"EUR",MU:"MUR",MV:"MVR",MW:"MWK",MX:"MXN",MY:"MYR",MZ:"MZN",NA:"NAD",NC:"XPF",NE:"XOF",NF:"AUD",NG:"NGN",NI:"NIO",NL:"EUR",NO:"NOK",NP:"NPR",NR:"AUD",NU:"NZD",NZ:"NZD",OM:"OMR",PA:"PAB",PE:"PEN",PF:"XPF",PG:"PGK",PH:"PHP",PK:"PKR",PL:"PLN",PM:"EUR",PN:"NZD",PR:"USD",PS:"ILS",PT:"EUR",PW:"USD",PY:"PYG",QA:"QAR",RE:"EUR",RO:"RON",RS:"RSD",RU:"RUB",RW:"RWF",SA:"SAR",SB:"SBD",SC:"SCR",SD:"SDG",SE:"SEK",SG:"SGD",SH:"SHP",SI:"EUR",SJ:"NOK",SK:"EUR",SL:"SLE",SM:"EUR",SN:"XOF",SO:"SOS",SR:"SRD",SS:"SSP",ST:"STN",SV:"SVC",SX:"XCG",SY:"SYP",SZ:"SZL",TC:"USD",TD:"XAF",TF:"EUR",TG:"XOF",TH:"THB",TJ:"TJS",TK:"NZD",TL:"USD",TM:"TMT",TN:"TND",TO:"TOP",TR:"TRY",TT:"TTD",TV:"AUD",TW:"TWD",TZ:"TZS",UA:"UAH",UG:"UGX",UM:"USD",US:"USD",UY:"UYU",UZ:"UZS",VA:"EUR",VC:"XCD",VE:"VES",VG:"USD",VI:"USD",VN:"VND",VU:"VUV",WF:"XPF",WS:"WST",YE:"YER",YT:"EUR",ZA:"ZAR",ZM:"ZMW",ZW:"ZWG"},A=new Map(Object.entries(p)),S=new Set(Object.values(p).sort()),R=(t,e)=>!e||!t?"":new Intl.NumberFormat(e,{style:"currency",currency:t}).formatToParts(1).find(r=>r.type==="currency")?.value||"",c={countryToCurrencyMap:A,allCurrencies:S,getCurrencySymbol:R},M=(t,e,r)=>(c.allCurrencies.has(t?.currency)&&r&&(r.currency=t?.currency),C(t?.amount,e)),L=t=>{switch(t){case"bg-BG":case"bg":return n(()=>import("./bg.BS39fmwb.js"),[]);case"cs-CZ":case"cs":return n(()=>import("./cs.CrZXKqMg.js"),[]);case"de-DE":case"de":return n(()=>import("./de.CCIsuMZz.js"),[]);case"en-AU":case"en-GB":case"en-US":case"en-PH":case"en":return n(()=>import("./en.BWdXq6-G.js"),[]);case"es-ES":case"es":return n(()=>import("./es.DCuNWYQg.js"),[]);case"fr-FR":case"fr-BE":case"fr":return n(()=>import("./fr.CkPP8HZt.js"),[]);case"hu-HU":case"hu":return n(()=>import("./hu.CKFikVeo.js"),[]);case"id-ID":case"id":return n(()=>import("./id.BECsq2xF.js"),[]);case"it-IT":case"it":return n(()=>import("./it.DusPIPgH.js"),[]);case"nl-BE":case"nl-NL":case"nl":return n(()=>import("./nl.BuGTl-YU.js"),[]);case"pl-PL":case"pl":return n(()=>import("./pl.C4Qgz8s6.js"),[]);case"ro-RO":case"ro":return n(()=>import("./ro.B-fei83F.js"),[]);case"ru-RU":case"ru":return n(()=>import("./ru.y-8Lk-uQ.js"),[]);case"sk-SK":case"sk":return n(()=>import("./sk.F_aXf0-U.js"),[]);case"uk-UA":case"uk":return n(()=>import("./uk.Cjk96XP6.js"),[]);case"zh-CN":case"zh":return n(()=>import("./zh.C9VZfqXb.js"),[]);default:return n(()=>import("./en.BWdXq6-G.js"),[])}},g=(t,e)=>({amount:f(t,e),currency:e?.currency}),P=t=>`${t?.currency} ${t?.amount}`,T=t=>{const[e,r]=t.split(" ");return{currency:e,amount:r}};class N extends w{static validatorName="CurrencyAndAmount";execute(e){const r=c.allCurrencies.has(e?.currency),o=new U().execute(e.amount);return r&&o}}const O=(t,e)=>t===e?!1:!t||!e||typeof t!="object"||typeof e!="object"?t!==e:t.currency!==e.currency||!Object.is(t.amount,e.amount);class _ extends E{static get properties(){return{modelValue:{type:Object,attribute:!1,hasChanged:O},preferredCurrencies:{type:Array},allowedCurrencies:{type:Array},__dropdownSlot:{type:String}}}__modelValue;set modelValue(e){e?this.__modelValue=e:this.__modelValue={currency:this.currency,amount:""}}get modelValue(){return this.__modelValue}static localizeNamespaces=[{"lion-input-amount-dropdown":L},...super.localizeNamespaces];refs={dropdown:D()};get _templateDataDropdown(){return{refs:{dropdown:{ref:this.refs.dropdown,listeners:{change:this._onDropdownValueChange,"model-value-changed":this._onDropdownValueChange},labels:{selectCurrency:this._localizeManager.msg("lion-input-amount-dropdown:selectCurrency"),allCurrencies:this._allCurrenciesLabel||this._localizeManager.msg("lion-input-amount-dropdown:allCurrencies"),preferredCurrencies:this._preferredCurrenciesLabel||this._localizeManager.msg("lion-input-amount-dropdown:suggestedCurrencies")}},input:this._inputNode},data:{currency:this.currency,regionMetaList:this.__regionMetaList,regionMetaListPreferred:this.__regionMetaListPreferred}}}get _dropdownSlot(){return this.__dropdownSlot}set _dropdownSlot(e){if(e!=="suffix"&&e!=="prefix")throw new Error("Only the suffix and prefix slots are valid positions for the dropdown.");this.__dropdownSlot=e}static templates={dropdown:e=>{const{refs:r,data:o}=e,s=l=>i`${this.templates.dropdownOption(e,l)} `;return i`
        <select
          ${y(r?.dropdown?.ref)}
          aria-label="${r?.dropdown?.labels?.selectCurrency}"
          @change="${r?.dropdown?.listeners?.change}"
          style="${d(r?.dropdown?.props?.style)}"
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
        aria-label="${d(o&&s?`${o}, ${s}`:"")}"
      >
        ${r} (${s})&nbsp;
      </option>
    `};static styles=[super.styles,m`
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
    `];get slots(){return{...super.slots,[this._dropdownSlot]:()=>{const e=this.constructor,{templates:r}=e;return{template:r.dropdown(this._templateDataDropdown),renderAsDirectHostChild:!0}}}}onLocaleUpdated(){super.onLocaleUpdated();const e=this._localizeManager.locale.split("-");this._langIso=e[e.length-1].toUpperCase(),this.__namesForLocale=new Intl.DisplayNames([this._langIso],{type:"currency"}),this.__calculateActiveCurrency(),this.__createCurrencyMeta()}_allCurrenciesLabel;_preferredCurrenciesLabel;__regionMetaList;__regionMetaListPreferred;_langIso=void 0;constructor(){super(),this.parser=g,this.__modelValue={currency:this.currency,amount:""},this.formatter=(e,r)=>M(e,r,this),this.serializer=P,this.deserializer=T,this.defaultValidators=[new N],this.__dropdownSlot="prefix",this.preferredCurrencies=[],this.allowedCurrencies=[],this._allCurrenciesLabel="",this._preferredCurrenciesLabel="",this.__regionMetaList=[],this.__regionMetaListPreferred=[],this._onDropdownValueChange=this._onDropdownValueChange.bind(this),this.__syncCurrencyWithDropdown=this.__syncCurrencyWithDropdown.bind(this),this._currencyUtil=c}willUpdate(e){super.willUpdate(e),e.has("allowedCurrencies")&&this.__createCurrencyMeta()}updated(e){super.updated(e),this.__syncCurrencyWithDropdown(),(e.has("disabled")||e.has("readOnly"))&&(this.disabled||this.readOnly?this.refs.dropdown?.value?.setAttribute("disabled",""):this.refs.dropdown?.value?.removeAttribute("disabled")),e.has("allowedCurrencies")&&this.allowedCurrencies.length>0&&this.__calculateActiveCurrency()}firstUpdated(e){super.firstUpdated?.(e),this._initModelValueBasedOnDropdown()}_initModelValueBasedOnDropdown(){const{currency:e,amount:r}=this._initialModelValue||{};!e&&!this.dirty&&(this.__initializedCurrencyCode=this.currency,this._initialModelValue={currency:this.currency,amount:r},this.modelValue=this._initialModelValue,this.initInteractionState())}_isEmpty(e=this.modelValue){const r=typeof e?.amount=="number"&&(e?.amount===0||Number.isNaN(e?.amount));return!e?.amount&&!r}_onDropdownValueChange(e){const r=e.detail?.initialize,o=e.target,s=o.modelValue||o.value;if(r||this.currency===s)return;const l=this.currency;this.currency=s,l!==this.currency&&!this.focused&&(this.value?(this.formatOptions.currency=this.currency,this.modelValue=this._callParser(this.value)):this.modelValue={currency:this.currency,amount:this.value})}__syncCurrencyWithDropdown(e=this.currency){const r=this.refs.dropdown?.value;if(!(!r||!e))if("modelValue"in r){if(r.modelValue===e)return;r.modelValue=e}else{if(r.value===e)return;r.value=e}}__createCurrencyMeta(){!this._allowedOrAllCurrencies?.length||!this.__namesForLocale||(this.__regionMetaList=[],this.__regionMetaListPreferred=[],this._allowedOrAllCurrencies.forEach(e=>{(this.preferredCurrencies.includes(e)?this.__regionMetaListPreferred:this.__regionMetaList).push({currencyCode:e,nameForLocale:this.__namesForLocale?.of(e),currencySymbol:this._currencyUtil.getCurrencySymbol(e,this._langIso??"")})}))}_repropagationCondition(){return!1}__calculateActiveCurrency(){if(this.allowedCurrencies?.length===1){[this.currency]=this.allowedCurrencies;return}if(this.modelValue?.currency&&this.allowedCurrencies?.includes(this.modelValue?.currency)){this.currency=this.modelValue.currency;return}if(this.preferredCurrencies?.length>0){[this.currency]=this.preferredCurrencies;return}if(this._langIso&&this._currencyUtil?.countryToCurrencyMap.has(this._langIso)&&this._allowedOrAllCurrencies.includes(this._currencyUtil?.countryToCurrencyMap.get(this._langIso))){this.currency=this._currencyUtil?.countryToCurrencyMap.get(this._langIso);return}this.currency=void 0}get _allowedOrAllCurrencies(){return this.allowedCurrencies?.length?this.allowedCurrencies:Array.from(this._currencyUtil?.allCurrencies)||[]}}customElements.define("lion-input-amount-dropdown",_);const I=()=>(u(),a`
    <lion-input-amount-dropdown
      label="Select currency via dropdown"
      help-text="Shows all currencies by default"
      name="amount"
    ></lion-input-amount-dropdown>
  `),G=()=>(u(),a`
    <lion-input-amount-dropdown
      label="Select currency via dropdown"
      help-text="Shows only allowed currencies"
      name="amount"
      .allowedCurrencies=${["EUR","GBP"]}
    ></lion-input-amount-dropdown>
  `),B=()=>(u(),a`
    <lion-input-amount-dropdown
      label="Select currency via dropdown"
      help-text="Preferred currencies show on top"
      name="amount"
      .allowedCurrencies=${["EUR","GBP","USD","JPY"]}
      .preferredCurrencies=${["USD","JPY"]}
    ></lion-input-amount-dropdown>
  `);class V extends _{constructor(){super(),this._dropdownSlot="suffix"}}customElements.define("demo-amount-dropdown",V);const K=()=>(u(),a`
    <demo-amount-dropdown
      label="Select region via dropdown"
      help-text="the dropdown shows in the suffix slot"
      name="amount"
    ></demo-amount-dropdown>
  `),b=document,v=[{key:"InputAmountDropdown",story:I},{key:"allowedCurrencies",story:G},{key:"preferredCurrencies",story:B},{key:"suffixSlot",story:K}];let h=!1;for(const t of v){const e=b.querySelector(`[mdjs-story-name="${t.key}"]`);e&&(e.story=t.story,e.key=t.key,h=!0,Object.assign(e,{simulatorUrl:"/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}h&&(customElements.get("mdjs-preview")||n(()=>import("./define.D5IFK1jp.js"),__vite__mapDeps([0,1,2,3,4,5,6])),customElements.get("mdjs-story")||n(()=>import("./define.DBgp7shK.js"),__vite__mapDeps([7,2,3])));export{I as InputAmountDropdown,G as allowedCurrencies,B as preferredCurrencies,K as suffixSlot};
