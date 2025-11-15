import{S as e}from"./24f95583.js";import{a as o,x as t}from"./b4be29f1.js";import"./05905ff1.js";import"./01fe287e.js";import{n as r}from"./3ae224d1.js";import{c as s}from"./c9978b47.js";import{I as i,a as n,b as p}from"./01749650.js";import{L as a}from"./4777ff9b.js";import{l as d}from"./c85cfbca.js";import"./65cdf028.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./dc2f5f5a.js";import"./acda6ea6.js";import"./0ed5d59c.js";import"./7902d8e0.js";import"./d45984a3.js";import"./4cc99b59.js";import"./19d2607c.js";import"./afb8834e.js";import"./143fde17.js";import"./5287c897.js";import"./5516584c.js";import"./b494bfc1.js";import"./0bf7a48d.js";import"./48b0a907.js";import"./130d2801.js";import"./1fe9105d.js";import"./a06c5caf.js";import"./9a16257f.js";import"./4a239ef1.js";import"./9157d4cc.js";import"./298b3bc0.js";import"./459b1eec.js";import"./4dc0ac82.js";import"./cc85a6f4.js";import"./48ac1cb5.js";import"./e49751c9.js";import"./b7f85193.js";import"./622cc741.js";class l extends(e(a)){static styles=[super.styles,o`
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
    `];static templates={...super.templates||{},dropdown:e=>{const{refs:o,data:i}=e;return t`
        <intl-select-rich
          ${r(o?.dropdown?.ref)}
          label="${o?.dropdown?.labels?.country}"
          label-sr-only
          .config="${{elementToFocusAfterHide:o?.input}}"
          @model-value-changed="${o?.dropdown?.listeners["model-value-changed"]}"
          style="${o?.dropdown?.props?.style}"
        >
          ${i?.regionMetaListPreferred?.length?t` ${s(i.regionMetaListPreferred,e=>e.regionCode,o=>t`${this.templates.dropdownOption(e,o)} `)}<intl-separator></intl-separator>`:""}
          ${s(i.regionMetaList,e=>e.regionCode,o=>t`${this.templates.dropdownOption(e,o)} `)}
        </intl-select-rich>
      `},dropdownOption:(e,o)=>t`
      <intl-option .choiceValue="${o.regionCode}" .regionMeta="${o}">
      </intl-option>
    `};static scopedElements={...super.scopedElements,"intl-select-rich":i,"intl-option":n,"intl-separator":p}}customElements.define("intl-input-tel-dropdown",l);const m=()=>(d(),t`
    <intl-input-tel-dropdown
      .preferredRegions="${["NL","PH"]}"
      .modelValue="${"+639608920056"}"
      label="Telephone number"
      help-text="Advanced dropdown and styling"
      name="phoneNumber"
    ></intl-input-tel-dropdown>
  `),c=document,b=[{key:"IntlInputTelDropdown",story:m}];let f=!1;for(const e of b){const o=c.querySelector(`[mdjs-story-name="${e.key}"]`);o&&(o.story=e.story,o.key=e.key,f=!0,Object.assign(o,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}f&&(customElements.get("mdjs-preview")||import("./a7b4f51b.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{m as IntlInputTelDropdown};
