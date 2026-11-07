const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.D5IFK1jp.js","_astro/MdJsPreview.B62up6PK.js","_astro/lit-element.DxRhnkit.js","_astro/lit-html.BX7rm8u-.js","_astro/dedupeMixin.6XPTJgK8.js","_astro/lit-element.BOikny4r.js","_astro/uuid.DjYKNjre.js","_astro/define.DBgp7shK.js"])))=>i.map(i=>d[i]);
import{_ as c}from"./preload-helper.CVfkMyKi.js";import"./MdJsPreview.B62up6PK.js";import"./lit-element.DxRhnkit.js";import{b as n}from"./lit-html.BX7rm8u-.js";import"./unsafe-html.FHlAasnX.js";import{n as d,e as s}from"./ref.BNaaotgk.js";import{l as y}from"./singleton.Bku2u1LL.js";import"./lion-input-tel.BAQ42l04.js";import{a as f,i as b,b as g}from"./lit-element.BOikny4r.js";import{c as v}from"./repeat.BN-Q0ZFt.js";import{r as $}from"./regionMetaList.YRoayUlQ.js";import{S as w}from"./ScopedStylesController.hVGHeVX0.js";import"./h-output.DYA3MJne.js";import{l}from"./loadDefaultFeedbackMessages.Dna2KIXH.js";import{P as r}from"./PhoneUtilManager.zIdPai_j.js";import{U as R}from"./InteractionStateMixin.Bm8PsvKl.js";class k extends f{static properties={regionMeta:Object};constructor(){super(),this.scopedStylesController=new w(this)}static scopedStyles(e){return b`
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
    `}createRenderRoot(){return this}render(){const e=this.regionMetaList||$;return g`
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
          ${v(e,i=>i.regionCode,({regionCode:i,countryCode:p,flagSymbol:m,nameForLocale:o})=>g` <tr>
                <td align="left"><span aria-hidden="true">${m}</span> ${o}</td>
                <td align="right">${i}</td>
                <td align="right">${p}</td>
              </tr>`)}
        </tbody>
      </table>
    `}}customElements.define("h-region-code-table",k);const E=()=>(l(),n`<h-region-code-table></h-region-code-table>`),x=()=>{l();const t=["CN","ES"],[e,i,p]=[s(),s(),s()],m=(o,a=e.value,u=i.value)=>{o==="only-allowed-region"?(a.modelValue=void 0,a.allowedRegions=["NL"],u.innerText=".activeRegion (NL) is only allowed region"):o==="user-input"?(a.allowedRegions=["NL","BE","DE"],a.modelValue="+3261234567",u.innerText=".activeRegion (BE) is derived (since within allowedRegions)"):o==="locale"?(y.locale="en-GB",a.modelValue=void 0,a.allowedRegions=void 0,u.innerText=`.activeRegion (${a._langIso}) set to locale when inside allowed or all regions`):u.innerText=""};return n`
    <select
      aria-label="Set scenario"
      @change="${({target:o})=>m(o.value)}"
    >
      <option value="">--- select scenario ---</option>
      <option value="only-allowed-region">1. only allowed region</option>
      <option value="user-input">2. user input</option>
      <option value="locale">3. locale</option>
    </select>
    <output style="display:block; min-height: 1.5em;" id="myOutput" ${d(i)}></output>
    <lion-input-tel
      ${d(e)}
      @model-value-changed="${({detail:o})=>{o.isTriggeredByUser&&p.value&&(p.value.value="")}}"
      name="phoneNumber"
      label="Active region"
      .allowedRegions="${t}"
    ></lion-input-tel>
    <h-output
      .show="${["activeRegion",{name:"all or allowed regions",processor:o=>JSON.stringify(o._allowedOrAllRegions)},"modelValue"]}"
      .readyPromise="${r.loadComplete}"
    ></h-output>
  `},C=()=>(l(),n`
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
  `),N=()=>(l(),n`
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
  `),S=()=>{l();const t=s();return n`
    <select @change="${({target:e})=>t.value.formatStrategy=e.value}">
      <option value="e164">e164</option>
      <option value="international">international</option>
      <option value="national">national</option>
      <option value="significant">significant</option>
      <option value="rfc3966">rfc3966</option>
    </select>
    <lion-input-tel
      ${d(t)}
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
  `},V=()=>{l();const t=s();return n`
    <select @change="${({target:e})=>t.value.formatStrategy=e.value}">
      <option value="e164">e164</option>
      <option value="international">international</option>
      <option value="rfc3966">rfc3966</option>
    </select>
    <lion-input-tel
      ${d(t)}
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
  `},P=()=>(l(),n`
    <lion-input-tel
      label="Realtime format on user input"
      help-text="Partial numbers are also formatted"
      .modelValue="${new R("+31")}"
      format-strategy="international"
      live-format
      name="phoneNumber"
    ></lion-input-tel>
  `),_=()=>(l(),n`
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
  `),D=document,L=[{key:"regionCodesTable",story:E},{key:"heuristic",story:x},{key:"allowedRegions",story:C},{key:"oneAllowedRegion",story:N},{key:"formatStrategy",story:S},{key:"formatCountryCodeStyle",story:V},{key:"liveFormat",story:P},{key:"activePhoneNumberType",story:_}];let h=!1;for(const t of L){const e=D.querySelector(`[mdjs-story-name="${t.key}"]`);e&&(e.story=t.story,e.key=t.key,h=!0,Object.assign(e,{simulatorUrl:"/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}h&&(customElements.get("mdjs-preview")||c(()=>import("./define.D5IFK1jp.js"),__vite__mapDeps([0,1,2,3,4,5,6])),customElements.get("mdjs-story")||c(()=>import("./define.DBgp7shK.js"),__vite__mapDeps([7,2,3])));export{_ as activePhoneNumberType,C as allowedRegions,V as formatCountryCodeStyle,S as formatStrategy,x as heuristic,P as liveFormat,N as oneAllowedRegion,E as regionCodesTable};
