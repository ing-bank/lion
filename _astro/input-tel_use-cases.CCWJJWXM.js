const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.BdbiuFq9.js","_astro/MdJsPreview.3BOxlSHn.js","_astro/lit-element.jD9bOQKo.js","_astro/lit-html.DtZEZPQ5.js","_astro/lit-element.BdYmZD4s.js","_astro/define.DNIVKtom.js"])))=>i.map(i=>d[i]);
import{_ as m}from"./preload-helper.CVfkMyKi.js";import"./MdJsPreview.3BOxlSHn.js";import{a as h,r as y,i as f}from"./lit-element.jD9bOQKo.js";import{x as n}from"./lit-html.DtZEZPQ5.js";import"./unsafe-html.DgrA3nwU.js";import{n as u,e as s}from"./ref.Ce3g7EUE.js";import{l as b}from"./singleton.B6TzrIoW.js";import"./lion-input-tel.DQt8dMp3.js";import{c as v}from"./repeat.DviZyQ5m.js";import{r as $}from"./regionMetaList.YRoayUlQ.js";import"./h-output.Cu2bcD4B.js";import{l as i}from"./loadDefaultFeedbackMessages.DKrgwlad.js";import{P as r}from"./PhoneUtilManager.zIdPai_j.js";import{U as w}from"./InteractionStateMixin.Dwdprynb.js";class R{#e=!1;static scopedStyles(e){return h``}constructor(e){(this.host=e).addController(this),this.__styleTag=document.createElement("style"),this.scopedClass=`${this.host.localName}-${Math.floor(Math.random()*1e4)}`}hostConnected(){this.#e||(this.host.classList.add(this.scopedClass),this.__setupStyleTag(),this.#e=!0)}__setupStyleTag(){const e=`${this.scopedClass}.${this.scopedClass}`;this.__styleTag.textContent=this.host.constructor.scopedStyles(y(e)).toString(),this.host.insertBefore(this.__styleTag,this.host.childNodes[0])}}class C extends f{static properties={regionMeta:Object};constructor(){super(),this.scopedStylesController=new R(this)}static scopedStyles(e){return h`
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
    `}createRenderRoot(){return this}render(){const e=this.regionMetaList||$;return n`
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
          ${v(e,a=>a.regionCode,({regionCode:a,countryCode:p,flagSymbol:c,nameForLocale:o})=>n` <tr>
                <td align="left"><span aria-hidden="true">${c}</span> ${o}</td>
                <td align="right">${a}</td>
                <td align="right">${p}</td>
              </tr>`)}
        </tbody>
      </table>
    `}}customElements.define("h-region-code-table",C);const E=()=>(i(),n`<h-region-code-table></h-region-code-table>`),S=()=>{i();const t=["CN","ES"],[e,a,p]=[s(),s(),s()],c=(o,l=e.value,d=a.value)=>{o==="only-allowed-region"?(l.modelValue=void 0,l.allowedRegions=["NL"],d.innerText=".activeRegion (NL) is only allowed region"):o==="user-input"?(l.allowedRegions=["NL","BE","DE"],l.modelValue="+3261234567",d.innerText=".activeRegion (BE) is derived (since within allowedRegions)"):o==="locale"?(b.locale="en-GB",l.modelValue=void 0,l.allowedRegions=void 0,d.innerText=`.activeRegion (${l._langIso}) set to locale when inside allowed or all regions`):d.innerText=""};return n`
    <select
      aria-label="Set scenario"
      @change="${({target:o})=>c(o.value)}"
    >
      <option value="">--- select scenario ---</option>
      <option value="only-allowed-region">1. only allowed region</option>
      <option value="user-input">2. user input</option>
      <option value="locale">3. locale</option>
    </select>
    <output style="display:block; min-height: 1.5em;" id="myOutput" ${u(a)}></output>
    <lion-input-tel
      ${u(e)}
      @model-value-changed="${({detail:o})=>{o.isTriggeredByUser&&p.value&&(p.value.value="")}}"
      name="phoneNumber"
      label="Active region"
      .allowedRegions="${t}"
    ></lion-input-tel>
    <h-output
      .show="${["activeRegion",{name:"all or allowed regions",processor:o=>JSON.stringify(o._allowedOrAllRegions)},"modelValue"]}"
      .readyPromise="${r.loadComplete}"
    ></h-output>
  `},_=()=>(i(),n`
    <lion-input-tel
      label="Allowed regions 'NL', 'BE', 'DE'"
      help-text="Type '+31'(NL), '+32'(BE) or '+49'(DE) and see how activeRegion changes"
      .allowedRegions="${["NL","BE","DE"]}"
      .modelValue="${"+31612345678"}"
      name="phoneNumber"
    ></lion-input-tel>
    <h-output
      .show="${["modelValue","activeRegion"]}"
      .readyPromise="${r.loadComplete}"
    ></h-output>
  `),k=()=>(i(),n`
    <lion-input-tel
      label="Only allowed region 'DE'"
      help-text="Restricts validation / formatting to one region"
      .allowedRegions="${["DE"]}"
      .modelValue="${"+31612345678"}"
      name="phoneNumber"
    ></lion-input-tel>
    <h-output
      .show="${["modelValue","activeRegion","validationStates"]}"
      .readyPromise="${r.loadComplete}"
    ></h-output>
  `),x=()=>{i();const t=s();return n`
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
      .readyPromise="${r.loadComplete}"
    ></h-output>
  `},N=()=>{i();const t=s();return n`
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
      .readyPromise="${r.loadComplete}"
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
      .readyPromise="${r.loadComplete}"
    ></h-output>
  `),T=document,L=[{key:"regionCodesTable",story:E},{key:"heuristic",story:S},{key:"allowedRegions",story:_},{key:"oneAllowedRegion",story:k},{key:"formatStrategy",story:x},{key:"formatCountryCodeStyle",story:N},{key:"liveFormat",story:V},{key:"activePhoneNumberType",story:P}];let g=!1;for(const t of L){const e=T.querySelector(`[mdjs-story-name="${t.key}"]`);e&&(e.story=t.story,e.key=t.key,g=!0,Object.assign(e,{simulatorUrl:"/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}g&&(customElements.get("mdjs-preview")||m(()=>import("./define.BdbiuFq9.js"),__vite__mapDeps([0,1,2,3,4])),customElements.get("mdjs-story")||m(()=>import("./define.DNIVKtom.js"),__vite__mapDeps([5,2,3])));export{P as activePhoneNumberType,_ as allowedRegions,N as formatCountryCodeStyle,x as formatStrategy,S as heuristic,V as liveFormat,k as oneAllowedRegion,E as regionCodesTable};
