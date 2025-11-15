const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.DYUong5B.js","_astro/node-tools_providence-analytics_overview.LFFQBZzG.js","_astro/lit-element.qDHKJJma.js","_astro/lit-html.C7L4dwLU.js","_astro/unsafe-html.J0GGe2Q7.js","_astro/directive.CGE4aKEl.js","_astro/define.m2CvvXyF.js"])))=>i.map(i=>d[i]);
import{_ as c}from"./preload-helper.4zY6-HO4.js";import"./node-tools_providence-analytics_overview.LFFQBZzG.js";import{i as h,a as y}from"./lit-element.qDHKJJma.js";import{x as n}from"./lit-html.C7L4dwLU.js";import"./unsafe-html.J0GGe2Q7.js";import{e as s,n as u}from"./ref.DN9F-cVD.js";import{l as f}from"./singleton._qiOfd78.js";import"./lion-input-tel.DI4Bh7hg.js";import{c as b}from"./repeat.BYpCtbkJ.js";import{r as v}from"./regionMetaList.YRoayUlQ.js";import{S as $}from"./ScopedStylesController.JZrBxnCH.js";import"./h-output.K2J3wTZi.js";import{l as i}from"./loadDefaultFeedbackMessages.griJXdpI.js";import{P as a}from"./PhoneUtilManager.DkvpFzJF.js";import{U as w}from"./InteractionStateMixin.DC1PvWzb.js";import"./directive.CGE4aKEl.js";import"./async-directive.CHVe8p0E.js";import"./directive-helpers.CLllgGgm.js";import"./getLocalizeManager.W5d_ICRU.js";import"./index.BNCfcFQh.js";import"./lazifyInstantiation.CgYLRMC3.js";import"./LionInputTel.DEumyhNb.js";import"./preprocessors.BqZFnKWs.js";import"./LocalizeMixin.VYu75dkK.js";import"./dedupeMixin.6XPTJgK8.js";import"./LionInput.B2KYRD9B.js";import"./NativeTextFieldMixin.CsE2kjU6.js";import"./LionField.gZkYIwXF.js";import"./LionFieldset.Cfuf77fc.js";import"./FormGroupMixin.EcgVGa5A.js";import"./FormRegistrarMixin.BUWicw9X.js";import"./Validator.DAOhFpDH.js";import"./DisabledMixin.Bm1nsErI.js";import"./validators.CMPigxVG.js";import"./Required.DgHIr_Cn.js";import"./StringValidators.UXrPEtgv.js";import"./NumberValidators.CmKpqCIb.js";import"./DateValidators.CEq8F9yx.js";import"./normalizeDateTime.BoDqBOW2.js";class R extends h{static properties={regionMeta:Object};constructor(){super(),this.scopedStylesController=new $(this)}static scopedStyles(e){return y`
      /* Custom input range styling comes here, be aware that this won't work for polyfilled browsers */
      .${e} .sr-only {
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

      .${e} table {
        position: relative;
        height: 300px;
      }

      .${e} th {
        border-left: none;
        border-right: none;
        position: sticky;
        top: -1px;
      }

      .${e} th .backdrop {
        background-color: white;
        opacity: 0.95;
        filter: blur(4px);
        position: absolute;
        inset: -5px;
      }

      .${e} th .content {
        position: relative;
      }

      .${e} td {
        border-left: none;
        border-right: none;
      }
    `}createRenderRoot(){return this}render(){const e=this.regionMetaList||v;return n`
      <table role="table">
        <caption class="sr-only">
          Region codes
        </caption>
        <thead>
          <tr>
            <th align="left">
              <span class="backdrop"></span><span class="content">country name</span>
            </th>
            <th align="right">
              <span class="backdrop"></span><span class="content">region code</span>
            </th>
            <th align="right">
              <span class="backdrop"></span><span class="content">country code</span>
            </th>
          </tr>
        </thead>
        <tbody>
          ${b(e,r=>r.regionCode,({regionCode:r,countryCode:p,flagSymbol:d,nameForLocale:o})=>n` <tr>
                <td align="left"><span aria-hidden="true">${d}</span> ${o}</td>
                <td align="right">${r}</td>
                <td align="right">${p}</td>
              </tr>`)}
        </tbody>
      </table>
    `}}customElements.define("h-region-code-table",R);const k=()=>(i(),n`<h-region-code-table></h-region-code-table>`),E=()=>{i();const t=["CN","ES"],[e,r,p]=[s(),s(),s()],d=(o,l=e.value,m=r.value)=>{o==="only-allowed-region"?(l.modelValue=void 0,l.allowedRegions=["NL"],m.innerText=".activeRegion (NL) is only allowed region"):o==="user-input"?(l.allowedRegions=["NL","BE","DE"],l.modelValue="+3261234567",m.innerText=".activeRegion (BE) is derived (since within allowedRegions)"):o==="locale"?(f.locale="en-GB",l.modelValue=void 0,l.allowedRegions=void 0,m.innerText=`.activeRegion (${l._langIso}) set to locale when inside allowed or all regions`):m.innerText=""};return n`
    <select
      aria-label="Set scenario"
      @change="${({target:o})=>d(o.value)}"
    >
      <option value="">--- select scenario ---</option>
      <option value="only-allowed-region">1. only allowed region</option>
      <option value="user-input">2. user input</option>
      <option value="locale">3. locale</option>
    </select>
    <output style="display:block; min-height: 1.5em;" id="myOutput" ${u(r)}></output>
    <lion-input-tel
      ${u(e)}
      @model-value-changed="${({detail:o})=>{o.isTriggeredByUser&&p.value&&(p.value.value="")}}"
      name="phoneNumber"
      label="Active region"
      .allowedRegions="${t}"
    ></lion-input-tel>
    <h-output
      .show="${["activeRegion",{name:"all or allowed regions",processor:o=>JSON.stringify(o._allowedOrAllRegions)},"modelValue"]}"
      .readyPromise="${a.loadComplete}"
    ></h-output>
  `},x=()=>(i(),n`
    <lion-input-tel
      label="Allowed regions 'NL', 'BE', 'DE'"
      help-text="Type '+31'(NL), '+32'(BE) or '+49'(DE) and see how activeRegion changes"
      .allowedRegions="${["NL","BE","DE"]}"
      .modelValue="${"+31612345678"}"
      name="phoneNumber"
    ></lion-input-tel>
    <h-output
      .show="${["modelValue","activeRegion"]}"
      .readyPromise="${a.loadComplete}"
    ></h-output>
  `),C=()=>(i(),n`
    <lion-input-tel
      label="Only allowed region 'DE'"
      help-text="Restricts validation / formatting to one region"
      .allowedRegions="${["DE"]}"
      .modelValue="${"+31612345678"}"
      name="phoneNumber"
    ></lion-input-tel>
    <h-output
      .show="${["modelValue","activeRegion","validationStates"]}"
      .readyPromise="${a.loadComplete}"
    ></h-output>
  `),N=()=>{i();const t=s();return n`
    <select @change="${({target:e})=>t.value.formatStrategy=e.value}">
      <option value="e164">e164</option>
      <option value="international">international</option>
      <option value="national">national</option>
      <option value="significant">significant</option>
      <option value="rfc3966">rfc3966</option>
    </select>
    <lion-input-tel
      ${u(t)}
      label="Format strategy"
      help-text="Choose a strategy above"
      .modelValue="${"+46707123456"}"
      format-strategy="national"
      name="phoneNumber"
    ></lion-input-tel>
    <h-output
      .show="${["modelValue","formatStrategy"]}"
      .readyPromise="${a.loadComplete}"
    ></h-output>
  `},S=()=>{i();const t=s();return n`
    <select @change="${({target:e})=>t.value.formatStrategy=e.value}">
      <option value="e164">e164</option>
      <option value="international">international</option>
      <option value="rfc3966">rfc3966</option>
    </select>
    <lion-input-tel
      ${u(t)}
      label="Format strategy"
      help-text="Choose a strategy above"
      .modelValue="${"+46707123456"}"
      format-country-code-style="parentheses"
      name="phoneNumber"
    ></lion-input-tel>
    <h-output
      .show="${["modelValue","formatStrategy"]}"
      .readyPromise="${a.loadComplete}"
    ></h-output>
  `},V=()=>(i(),n`
    <lion-input-tel
      label="Realtime format on user input"
      help-text="Partial numbers are also formatted"
      .modelValue="${new w("+31")}"
      format-strategy="international"
      live-format
      name="phoneNumber"
    ></lion-input-tel>
  `),P=()=>(i(),n`
    <lion-input-tel
      label="Active phone number type"
      .modelValue="${"+31612345678"}"
      format-strategy="international"
      name="phoneNumber"
    ></lion-input-tel>
    <h-output
      .show="${["activePhoneNumberType"]}"
      .readyPromise="${a.loadComplete}"
    ></h-output>
  `),_=document,D=[{key:"regionCodesTable",story:k},{key:"heuristic",story:E},{key:"allowedRegions",story:x},{key:"oneAllowedRegion",story:C},{key:"formatStrategy",story:N},{key:"formatCountryCodeStyle",story:S},{key:"liveFormat",story:V},{key:"activePhoneNumberType",story:P}];let g=!1;for(const t of D){const e=_.querySelector(`[mdjs-story-name="${t.key}"]`);e&&(e.story=t.story,e.key=t.key,g=!0,Object.assign(e,{simulatorUrl:"/next/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}g&&(customElements.get("mdjs-preview")||c(()=>import("./define.DYUong5B.js"),__vite__mapDeps([0,1,2,3,4,5])),customElements.get("mdjs-story")||c(()=>import("./define.m2CvvXyF.js"),__vite__mapDeps([6,2,3])));export{P as activePhoneNumberType,x as allowedRegions,S as formatCountryCodeStyle,N as formatStrategy,E as heuristic,V as liveFormat,C as oneAllowedRegion,k as regionCodesTable};
