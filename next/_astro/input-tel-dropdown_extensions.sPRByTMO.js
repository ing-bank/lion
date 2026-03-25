const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.DSVRgKCR.js","_astro/node-tools_providence-analytics_overview.BxIihMx7.js","_astro/lit-element.jD9bOQKo.js","_astro/lit-html.DtZEZPQ5.js","_astro/unsafe-html.DgrA3nwU.js","_astro/directive.BO6BEpVC.js","_astro/define.DNIVKtom.js"])))=>i.map(i=>d[i]);
import{_ as s}from"./preload-helper.Cj2JEybs.js";import{S as d}from"./node-tools_providence-analytics_overview.BxIihMx7.js";import{a}from"./lit-element.jD9bOQKo.js";import{x as n}from"./lit-html.DtZEZPQ5.js";import"./unsafe-html.DgrA3nwU.js";import"./lion-select-rich.C6I7iJ-G.js";import{n as u}from"./ref.Ce3g7EUE.js";import{c as l}from"./repeat.DviZyQ5m.js";import{I as m,a as c,b as g}from"./intl-select-rich.BTLozydY.js";import{L as b}from"./LionInputTelDropdown.DWwQytbI.js";import{l as f}from"./loadDefaultFeedbackMessages.G20iUcvC.js";let h=class extends d(b){static styles=[super.styles,a`
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
    `];static templates={...super.templates||{},dropdown:e=>{const{refs:o,data:i}=e;return n`
        <intl-select-rich
          ${u(o?.dropdown?.ref)}
          label="${o?.dropdown?.labels?.country}"
          label-sr-only
          .config="${{elementToFocusAfterHide:o?.input}}"
          @model-value-changed="${o?.dropdown?.listeners["model-value-changed"]}"
          style="${o?.dropdown?.props?.style}"
        >
          ${i?.regionMetaListPreferred?.length?n` ${l(i.regionMetaListPreferred,t=>t.regionCode,t=>n`${this.templates.dropdownOption(e,t)} `)}<intl-separator></intl-separator>`:""}
          ${l(i.regionMetaList,t=>t.regionCode,t=>n`${this.templates.dropdownOption(e,t)} `)}
        </intl-select-rich>
      `},dropdownOption:(e,o)=>n`
      <intl-option .choiceValue="${o.regionCode}" .regionMeta="${o}">
      </intl-option>
    `};static scopedElements={...super.scopedElements,"intl-select-rich":g,"intl-option":c,"intl-separator":m}};customElements.define("intl-input-tel-dropdown",h);const x=()=>(f(),n`
    <intl-input-tel-dropdown
      .preferredRegions="${["NL","PH"]}"
      .modelValue="${"+639608920056"}"
      label="Telephone number"
      help-text="Advanced dropdown and styling"
      name="phoneNumber"
    ></intl-input-tel-dropdown>
  `),w=document,y=[{key:"IntlInputTelDropdown",story:x}];let p=!1;for(const r of y){const e=w.querySelector(`[mdjs-story-name="${r.key}"]`);e&&(e.story=r.story,e.key=r.key,p=!0,Object.assign(e,{simulatorUrl:"/next/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}p&&(customElements.get("mdjs-preview")||s(()=>import("./define.DSVRgKCR.js"),__vite__mapDeps([0,1,2,3,4,5])),customElements.get("mdjs-story")||s(()=>import("./define.DNIVKtom.js"),__vite__mapDeps([6,2,3])));export{x as IntlInputTelDropdown};
