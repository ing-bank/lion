const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.DYUong5B.js","_astro/node-tools_providence-analytics_overview.LFFQBZzG.js","_astro/lit-element.qDHKJJma.js","_astro/lit-html.C7L4dwLU.js","_astro/unsafe-html.J0GGe2Q7.js","_astro/directive.CGE4aKEl.js","_astro/define.m2CvvXyF.js"])))=>i.map(i=>d[i]);
import{_ as n}from"./preload-helper.4zY6-HO4.js";import"./node-tools_providence-analytics_overview.LFFQBZzG.js";import"./lit-element.qDHKJJma.js";import{x as o}from"./lit-html.C7L4dwLU.js";import"./unsafe-html.J0GGe2Q7.js";import"./lion-input-file.sSJZhWom.js";import{R as a}from"./Required.DgHIr_Cn.js";import{V as p}from"./Validator.DAOhFpDH.js";import{l as d}from"./loadDefaultFeedbackMessages.BQgeO4Ka.js";import"./directive.CGE4aKEl.js";import"./LocalizeMixin.VYu75dkK.js";import"./directive-helpers.CLllgGgm.js";import"./async-directive.CHVe8p0E.js";import"./getLocalizeManager.W5d_ICRU.js";import"./index.BNCfcFQh.js";import"./lazifyInstantiation.CgYLRMC3.js";import"./dedupeMixin.6XPTJgK8.js";import"./if-defined.CV50pAZo.js";import"./InteractionStateMixin.BzvQ4Mf0.js";import"./DisabledMixin.Bm1nsErI.js";import"./repeat.BYpCtbkJ.js";import"./LionField.DGnPMihp.js";import"./validators.BccilvTl.js";import"./StringValidators.UXrPEtgv.js";import"./NumberValidators.CmKpqCIb.js";import"./DateValidators.CEq8F9yx.js";import"./normalizeDateTime.BoDqBOW2.js";import"./PhoneUtilManager.DkvpFzJF.js";d();const m=()=>o`
    <lion-input-file
      label="Passport"
      max-file-size="1024000"
      accept=".jpg,.svg,.xml,image/svg+xml"
      @file-list-changed="${e=>{console.log("fileList",e.detail.newFiles)}}"
    >
    </lion-input-file>
  `,u=()=>o`
    <lion-input-file
      accept=".jpg,.svg,.xml,image/svg+xml"
      label="Passport"
      enable-drop-zone
      @file-list-changed="${e=>{console.log(e.detail.newFiles)}}"
    >
    </lion-input-file>
  `,g=()=>o`
    <lion-input-file
      max-file-size="2048"
      label="Passport"
      @file-list-changed="${e=>{console.log(e.detail.newFiles)}}"
    >
    </lion-input-file>
  `,c=()=>o`
    <lion-input-file
      label="Passport"
      name="upload"
      multiple
      max-file-size="1024000"
      @file-removed="${e=>{console.log("removed file details",e.detail)}}"
      @file-list-changed="${e=>{console.log("file-list-changed",e.detail.newFiles)}}"
      @model-value-changed="${e=>{console.log("model-value-changed",e)}}"
    >
    </lion-input-file>
  `,f=()=>o`
    <lion-input-file
      label="Passport"
      name="myFiles"
      multiple
      .validators="${[new a]}"
      .uploadResponse="${[{name:"file1.txt",status:"SUCCESS",errorMessage:"",id:"132"},{name:"file2.txt",status:"SUCCESS",errorMessage:"",id:"abcd"}]}"
    >
    </lion-input-file>
  `,F=e=>{const t=e.target.querySelector("lion-input-file");t.reset(),console.log(t.modelValue)},y=e=>{e.preventDefault();const t=e.target.querySelector("lion-input-file");return console.log(t.hasFeedbackFor),console.log(t.serializedValue),!1},R=()=>{class e extends p{static get validatorName(){return"FilenameLengthValidator"}static getMessage(l){return`Filename length should not exceed ${l.params.maxFilenameLength} characters`}checkFilenameLength(l,i){return l<=i}execute(l,{maxFilenameLength:i}){return l.findIndex(r=>!this.checkFilenameLength(r.name.length,i))>-1}}return o`
    <form @submit="${y}" @reset="${F}">
      <lion-input-file
        label="Passport"
        name="upload"
        multiple
        .validators="${[new a,new e({maxFilenameLength:20})]}"
        .uploadResponse="${[{name:"file1.zip",status:"SUCCESS",id:"132"},{name:"file2.zip",status:"SUCCESS",id:"abcd"}]}"
      >
      </lion-input-file>
      <button type="reset">Reset</button>
      <button>Upload</button>
    </form>
  `},h=()=>o`
    <lion-input-file
      label="Passport"
      name="upload"
      multiple
      upload-on-select
      @file-removed="${e=>{e.target.uploadResponse[e.target.uploadResponse.findIndex(t=>t.name===e.detail.uploadResponse.name)].status="LOADING",e.target.uploadResponse=[...e.target.uploadResponse],setTimeout(()=>{e.target.uploadResponse[e.target.uploadResponse.findIndex(t=>t.name===e.detail.uploadResponse.name)]={},e.target.uploadResponse=[...e.target.uploadResponse]},1e3)}}"
      @file-list-changed="${e=>{e.detail.newFiles[0]&&(e.target.uploadResponse[e.target.uploadResponse.findIndex(t=>t.name===e.detail.newFiles[0].name)].status="LOADING",e.target.uploadResponse=[...e.target.uploadResponse],e.detail.newFiles[1]&&(e.target.uploadResponse[e.target.uploadResponse.findIndex(t=>t.name===e.detail.newFiles[1].name)].status="LOADING",e.target.uploadResponse=[...e.target.uploadResponse]),setTimeout(()=>{e.target.uploadResponse[e.target.uploadResponse.findIndex(t=>t.name===e.detail.newFiles[0].name)].status="SUCCESS",e.target.uploadResponse=[...e.target.uploadResponse]},3e3),setTimeout(()=>{e.detail.newFiles[1]&&(e.detail.newFiles[1].name,e.target.uploadResponse[e.target.uploadResponse.findIndex(t=>t.name===e.detail.newFiles[1].name)]={name:e.detail.newFiles[1].name,status:"FAIL",errorMessage:"error from server"},e.target.uploadResponse=[...e.target.uploadResponse])},3e3))}}"
    >
    </lion-input-file>
  `,x=()=>o`
    <lion-input-file
      label="Passport"
      name="myFiles"
      accept=".png"
      max-file-size="1024000"
      enable-drop-zone
      multiple
      .validators="${[new a]}"
    >
    </lion-input-file>
  `,b=document,S=[{key:"basicFileUpload",story:m},{key:"acceptValidator",story:u},{key:"sizeValidator",story:g},{key:"multipleFileUpload",story:c},{key:"prefilledState",story:f},{key:"withIngForm",story:R},{key:"uploadWithoutFormSubmit",story:h},{key:"dragAndDrop",story:x}];let s=!1;for(const e of S){const t=b.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,s=!0,Object.assign(t,{simulatorUrl:"/next/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}s&&(customElements.get("mdjs-preview")||n(()=>import("./define.DYUong5B.js"),__vite__mapDeps([0,1,2,3,4,5])),customElements.get("mdjs-story")||n(()=>import("./define.m2CvvXyF.js"),__vite__mapDeps([6,2,3])));export{u as acceptValidator,m as basicFileUpload,x as dragAndDrop,c as multipleFileUpload,f as prefilledState,g as sizeValidator,h as uploadWithoutFormSubmit,R as withIngForm};
