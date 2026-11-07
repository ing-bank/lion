const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.D5IFK1jp.js","_astro/MdJsPreview.B62up6PK.js","_astro/lit-element.DxRhnkit.js","_astro/lit-html.BX7rm8u-.js","_astro/dedupeMixin.6XPTJgK8.js","_astro/lit-element.BOikny4r.js","_astro/uuid.DjYKNjre.js","_astro/define.DBgp7shK.js"])))=>i.map(i=>d[i]);
import{_ as s}from"./preload-helper.CVfkMyKi.js";import"./MdJsPreview.B62up6PK.js";import"./lit-element.DxRhnkit.js";import{b as d}from"./lit-html.BX7rm8u-.js";import"./unsafe-html.FHlAasnX.js";import"./lion-select-rich.BI5DhJ_a.js";import{a}from"./ScopedElementsMixin.Bodi36kJ.js";import{i as m,b as n}from"./lit-element.BOikny4r.js";import{n as u}from"./ref.Cob19_Dl.js";import{c as l}from"./repeat.BN-Q0ZFt.js";import{I as c,a as b,b as g}from"./intl-select-rich.BzyNeCDO.js";import{L as f}from"./LionInputTelDropdown.mw5YJyiO.js";import{l as h}from"./loadDefaultFeedbackMessages.Dna2KIXH.js";let x=class extends a(f){static styles=[super.styles,m`
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
    `};static scopedElements={...super.scopedElements,"intl-select-rich":g,"intl-option":b,"intl-separator":c}};customElements.define("intl-input-tel-dropdown",x);const w=()=>(h(),d`
    <intl-input-tel-dropdown
      .preferredRegions="${["NL","PH"]}"
      .modelValue="${"+639608920056"}"
      label="Telephone number"
      help-text="Advanced dropdown and styling"
      name="phoneNumber"
    ></intl-input-tel-dropdown>
  `),y=document,_=[{key:"IntlInputTelDropdown",story:w}];let p=!1;for(const r of _){const e=y.querySelector(`[mdjs-story-name="${r.key}"]`);e&&(e.story=r.story,e.key=r.key,p=!0,Object.assign(e,{simulatorUrl:"/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}p&&(customElements.get("mdjs-preview")||s(()=>import("./define.D5IFK1jp.js"),__vite__mapDeps([0,1,2,3,4,5,6])),customElements.get("mdjs-story")||s(()=>import("./define.DBgp7shK.js"),__vite__mapDeps([7,2,3])));export{w as IntlInputTelDropdown};
