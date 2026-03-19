import{S as e}from"./08927fef.js";import{a as o,x as t}from"./b4be29f1.js";import"./05905ff1.js";import"./80921cb1.js";import{n as r}from"./3ae224d1.js";import{c as s}from"./c9978b47.js";import{I as i,a as n,b as p}from"./cc602b80.js";import{L as a}from"./af6e5dce.js";import{l as d}from"./1347002a.js";import"./9af64c94.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./dc2f5f5a.js";import"./acda6ea6.js";import"./0ed5d59c.js";import"./5034b8b0.js";import"./d45984a3.js";import"./4cc99b59.js";import"./19d2607c.js";import"./afb8834e.js";import"./143fde17.js";import"./6722e641.js";import"./52cbef17.js";import"./5516584c.js";import"./0ab13f37.js";import"./06654559.js";import"./dc4e1be5.js";import"./06f5b106.js";import"./1eda493b.js";import"./a06c5caf.js";import"./9a16257f.js";import"./9d4fbb3c.js";import"./5c8a0a9d.js";import"./ee65bf86.js";import"./b9d3bf75.js";import"./4dc0ac82.js";import"./cc85a6f4.js";import"./48ac1cb5.js";import"./e49751c9.js";import"./b7f85193.js";import"./622cc741.js";class m extends(e(a)){static styles=[super.styles,o`
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
    `};static scopedElements={...super.scopedElements,"intl-select-rich":i,"intl-option":n,"intl-separator":p}}customElements.define("intl-input-tel-dropdown",m);const l=()=>(d(),t`
    <intl-input-tel-dropdown
      .preferredRegions="${["NL","PH"]}"
      .modelValue="${"+639608920056"}"
      label="Telephone number"
      help-text="Advanced dropdown and styling"
      name="phoneNumber"
    ></intl-input-tel-dropdown>
  `),c=document,b=[{key:"IntlInputTelDropdown",story:l}];let f=!1;for(const e of b){const o=c.querySelector(`[mdjs-story-name="${e.key}"]`);o&&(o.story=e.story,o.key=e.key,f=!0,Object.assign(o,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}f&&(customElements.get("mdjs-preview")||import("./24735558.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{l as IntlInputTelDropdown};
