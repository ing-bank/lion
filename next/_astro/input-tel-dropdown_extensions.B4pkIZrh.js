const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.DAMBs0Wv.js","_astro/node-tools_providence-analytics_overview.DzUX1qVL.js","_astro/lit-element.qDHKJJma.js","_astro/lit-html.C7L4dwLU.js","_astro/unsafe-html.J0GGe2Q7.js","_astro/directive.CGE4aKEl.js","_astro/define.m2CvvXyF.js"])))=>i.map(i=>d[i]);
import{_ as s}from"./preload-helper.4zY6-HO4.js";import{S as m}from"./node-tools_providence-analytics_overview.DzUX1qVL.js";import{a as d}from"./lit-element.qDHKJJma.js";import{x as r}from"./lit-html.C7L4dwLU.js";import"./unsafe-html.J0GGe2Q7.js";import"./lion-select-rich.Cdz7hDMQ.js";import{n as a}from"./ref.DN9F-cVD.js";import{c as p}from"./repeat.BYpCtbkJ.js";import{I as u,a as c,b as g}from"./intl-select-rich.cCIzOpQm.js";import{L as b}from"./LionInputTelDropdown.BWdNZhvK.js";import{l as f}from"./loadDefaultFeedbackMessages.CvnX9M_F.js";import"./directive.CGE4aKEl.js";import"./LionSelectRich.C9OEha9X.js";import"./OverlayMixin.DyhQNlPq.js";import"./index.BNCfcFQh.js";import"./lazifyInstantiation.CgYLRMC3.js";import"./dedupeMixin.6XPTJgK8.js";import"./withDropdownConfig.eRP55go6.js";import"./withClickInteraction.B1DPetIk.js";import"./InteractionStateMixin.BJhuwH0C.js";import"./LocalizeMixin.VYu75dkK.js";import"./directive-helpers.CLllgGgm.js";import"./async-directive.CHVe8p0E.js";import"./getLocalizeManager.W5d_ICRU.js";import"./DisabledMixin.Bm1nsErI.js";import"./uuid.DjYKNjre.js";import"./LionButton.B-faj9rA.js";import"./DisabledWithTabIndexMixin.DiSGvuwH.js";import"./LionListbox.Dqnn1yyW.js";import"./ChoiceGroupMixin.DCfjGwdq.js";import"./FormRegistrarMixin.BQ1mpXJi.js";import"./LionOption.CA_stykX.js";import"./ChoiceInputMixin.D_7bdik6.js";import"./LionInputTel.M_2OiNJH.js";import"./PhoneUtilManager.DkvpFzJF.js";import"./preprocessors.BqZFnKWs.js";import"./LionInput.D1iZsL1G.js";import"./NativeTextFieldMixin.y9N8xI5A.js";import"./LionField.BWTJfyXr.js";import"./validators.BanLn3VF.js";import"./Validator.DAOhFpDH.js";import"./Required.DgHIr_Cn.js";import"./StringValidators.UXrPEtgv.js";import"./NumberValidators.CmKpqCIb.js";import"./DateValidators.CEq8F9yx.js";import"./normalizeDateTime.BoDqBOW2.js";let h=class extends m(b){static styles=[super.styles,d`
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
    `];static templates={...super.templates||{},dropdown:o=>{const{refs:t,data:n}=o;return r`
        <intl-select-rich
          ${a(t?.dropdown?.ref)}
          label="${t?.dropdown?.labels?.country}"
          label-sr-only
          .config="${{elementToFocusAfterHide:t?.input}}"
          @model-value-changed="${t?.dropdown?.listeners["model-value-changed"]}"
          style="${t?.dropdown?.props?.style}"
        >
          ${n?.regionMetaListPreferred?.length?r` ${p(n.regionMetaListPreferred,e=>e.regionCode,e=>r`${this.templates.dropdownOption(o,e)} `)}<intl-separator></intl-separator>`:""}
          ${p(n.regionMetaList,e=>e.regionCode,e=>r`${this.templates.dropdownOption(o,e)} `)}
        </intl-select-rich>
      `},dropdownOption:(o,t)=>r`
      <intl-option .choiceValue="${t.regionCode}" .regionMeta="${t}">
      </intl-option>
    `};static scopedElements={...super.scopedElements,"intl-select-rich":g,"intl-option":c,"intl-separator":u}};customElements.define("intl-input-tel-dropdown",h);const x=()=>(f(),r`
    <intl-input-tel-dropdown
      .preferredRegions="${["NL","PH"]}"
      .modelValue="${"+639608920056"}"
      label="Telephone number"
      help-text="Advanced dropdown and styling"
      name="phoneNumber"
    ></intl-input-tel-dropdown>
  `),w=document,y=[{key:"IntlInputTelDropdown",story:x}];let l=!1;for(const i of y){const o=w.querySelector(`[mdjs-story-name="${i.key}"]`);o&&(o.story=i.story,o.key=i.key,l=!0,Object.assign(o,{simulatorUrl:"/next/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}l&&(customElements.get("mdjs-preview")||s(()=>import("./define.DAMBs0Wv.js"),__vite__mapDeps([0,1,2,3,4,5])),customElements.get("mdjs-story")||s(()=>import("./define.m2CvvXyF.js"),__vite__mapDeps([6,2,3])));export{x as IntlInputTelDropdown};
