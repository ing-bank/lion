import"./24f95583.js";import{i as e,a as t,x as o}from"./b4be29f1.js";import"./05905ff1.js";import{n as a,e as n}from"./3ae224d1.js";import{l as i}from"./573dde6f.js";import"./eb47a05b.js";import{c as l}from"./c9978b47.js";import{r}from"./0e2fc7dd.js";import{S as s}from"./de5cbd7c.js";import"./74b10492.js";import{l as p}from"./7da3d275.js";import{P as m}from"./a06c5caf.js";import{U as d}from"./c6fab747.js";import"./afb8834e.js";import"./19d2607c.js";import"./d45984a3.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./1980e635.js";import"./4cc99b59.js";import"./dc2f5f5a.js";import"./9a16257f.js";import"./c2aef983.js";import"./7077221a.js";import"./f12ecf0e.js";import"./bbaa6280.js";import"./bfba5e5f.js";import"./ec06148e.js";import"./4dc0ac82.js";import"./143fde17.js";import"./3599da39.js";import"./cc85a6f4.js";import"./48ac1cb5.js";import"./e49751c9.js";import"./b7f85193.js";import"./622cc741.js";customElements.define("h-region-code-table",class extends e{static properties={regionMeta:Object};constructor(){super(),this.scopedStylesController=new s(this)}static scopedStyles(e){return t`
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
    `}createRenderRoot(){return this}render(){const e=this.regionMetaList||r;return o`
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
          ${l(e,e=>e.regionCode,({regionCode:e,countryCode:t,flagSymbol:a,nameForLocale:n})=>o` <tr>
                <td align="left"><span aria-hidden="true">${a}</span> ${n}</td>
                <td align="right">${e}</td>
                <td align="right">${t}</td>
              </tr>`)}
        </tbody>
      </table>
    `}});const u=()=>(p(),o`<h-region-code-table></h-region-code-table>`),c=()=>{p();const[e,t,l]=[n(),n(),n()];return o`
    <select
      aria-label="Set scenario"
      @change="${({target:o})=>((o,a=e.value,n=t.value)=>{"only-allowed-region"===o?(a.modelValue=void 0,a.allowedRegions=["NL"],n.innerText=".activeRegion (NL) is only allowed region"):"user-input"===o?(a.allowedRegions=["NL","BE","DE"],a.modelValue="+3261234567",n.innerText=".activeRegion (BE) is derived (since within allowedRegions)"):"locale"===o?(i.locale="en-GB",a.modelValue=void 0,a.allowedRegions=void 0,n.innerText=`.activeRegion (${a._langIso}) set to locale when inside allowed or all regions`):n.innerText=""})(o.value)}"
    >
      <option value="">--- select scenario ---</option>
      <option value="only-allowed-region">1. only allowed region</option>
      <option value="user-input">2. user input</option>
      <option value="locale">3. locale</option>
    </select>
    <output style="display:block; min-height: 1.5em;" id="myOutput" ${a(t)}></output>
    <lion-input-tel
      ${a(e)}
      @model-value-changed="${({detail:e})=>{e.isTriggeredByUser&&l.value&&(l.value.value="")}}"
      name="phoneNumber"
      label="Active region"
      .allowedRegions="${["CN","ES"]}"
    ></lion-input-tel>
    <h-output
      .show="${["activeRegion",{name:"all or allowed regions",processor:e=>JSON.stringify(e._allowedOrAllRegions)},"modelValue"]}"
      .readyPromise="${m.loadComplete}"
    ></h-output>
  `},g=()=>(p(),o`
    <lion-input-tel
      label="Allowed regions 'NL', 'BE', 'DE'"
      help-text="Type '+31'(NL), '+32'(BE) or '+49'(DE) and see how activeRegion changes"
      .allowedRegions="${["NL","BE","DE"]}"
      .modelValue="${"+31612345678"}"
      name="phoneNumber"
    ></lion-input-tel>
    <h-output
      .show="${["modelValue","activeRegion"]}"
      .readyPromise="${m.loadComplete}"
    ></h-output>
  `),h=()=>(p(),o`
    <lion-input-tel
      label="Only allowed region 'DE'"
      help-text="Restricts validation / formatting to one region"
      .allowedRegions="${["DE"]}"
      .modelValue="${"+31612345678"}"
      name="phoneNumber"
    ></lion-input-tel>
    <h-output
      .show="${["modelValue","activeRegion","validationStates"]}"
      .readyPromise="${m.loadComplete}"
    ></h-output>
  `),y=()=>{p();const e=n();return o`
    <select @change="${({target:t})=>e.value.formatStrategy=t.value}">
      <option value="e164">e164</option>
      <option value="international">international</option>
      <option value="national">national</option>
      <option value="significant">significant</option>
      <option value="rfc3966">rfc3966</option>
    </select>
    <lion-input-tel
      ${a(e)}
      label="Format strategy"
      help-text="Choose a strategy above"
      .modelValue="${"+46707123456"}"
      format-strategy="national"
      name="phoneNumber"
    ></lion-input-tel>
    <h-output
      .show="${["modelValue","formatStrategy"]}"
      .readyPromise="${m.loadComplete}"
    ></h-output>
  `},b=()=>{p();const e=n();return o`
    <select @change="${({target:t})=>e.value.formatStrategy=t.value}">
      <option value="e164">e164</option>
      <option value="international">international</option>
      <option value="rfc3966">rfc3966</option>
    </select>
    <lion-input-tel
      ${a(e)}
      label="Format strategy"
      help-text="Choose a strategy above"
      .modelValue="${"+46707123456"}"
      format-country-code-style="parentheses"
      name="phoneNumber"
    ></lion-input-tel>
    <h-output
      .show="${["modelValue","formatStrategy"]}"
      .readyPromise="${m.loadComplete}"
    ></h-output>
  `},f=()=>(p(),o`
    <lion-input-tel
      label="Realtime format on user input"
      help-text="Partial numbers are also formatted"
      .modelValue="${new d("+31")}"
      format-strategy="international"
      live-format
      name="phoneNumber"
    ></lion-input-tel>
  `),v=()=>(p(),o`
    <lion-input-tel
      label="Active phone number type"
      .modelValue="${"+31612345678"}"
      format-strategy="international"
      name="phoneNumber"
    ></lion-input-tel>
    <h-output
      .show="${["activePhoneNumberType"]}"
      .readyPromise="${m.loadComplete}"
    ></h-output>
  `),j=document,$=[{key:"regionCodesTable",story:u},{key:"heuristic",story:c},{key:"allowedRegions",story:g},{key:"oneAllowedRegion",story:h},{key:"formatStrategy",story:y},{key:"formatCountryCodeStyle",story:b},{key:"liveFormat",story:f},{key:"activePhoneNumberType",story:v}];let w=!1;for(const e of $){const t=j.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,w=!0,Object.assign(t,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}w&&(customElements.get("mdjs-preview")||import("./a7b4f51b.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{v as activePhoneNumberType,g as allowedRegions,b as formatCountryCodeStyle,y as formatStrategy,c as heuristic,f as liveFormat,h as oneAllowedRegion,u as regionCodesTable};
