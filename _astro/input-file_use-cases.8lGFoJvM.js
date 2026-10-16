const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.BdbiuFq9.js","_astro/MdJsPreview.3BOxlSHn.js","_astro/lit-element.jD9bOQKo.js","_astro/lit-html.DtZEZPQ5.js","_astro/lit-element.BdYmZD4s.js","_astro/define.DNIVKtom.js"])))=>i.map(i=>d[i]);
import{_ as s}from"./preload-helper.CVfkMyKi.js";import"./MdJsPreview.3BOxlSHn.js";import"./lit-element.jD9bOQKo.js";import{x as l}from"./lit-html.DtZEZPQ5.js";import"./unsafe-html.DgrA3nwU.js";import"./lion-input-file.pV4Plk3A.js";import{R as n}from"./Required.CvxLsCBg.js";import{V as p}from"./Validator.DAOhFpDH.js";import{l as d}from"./loadDefaultFeedbackMessages.DKrgwlad.js";d();const u=()=>l`
    <lion-input-file
      label="Passport"
      max-file-size="1024000"
      accept=".jpg,.svg,.xml,image/svg+xml"
      @file-list-changed="${e=>{console.log("fileList",e.detail.newFiles)}}"
    >
    </lion-input-file>
  `,m=()=>l`
    <lion-input-file
      accept=".jpg,.svg,.xml,image/svg+xml"
      label="Passport"
      enable-drop-zone
      @file-list-changed="${e=>{console.log(e.detail.newFiles)}}"
    >
    </lion-input-file>
  `,g=()=>l`
    <lion-input-file
      max-file-size="2048"
      label="Passport"
      @file-list-changed="${e=>{console.log(e.detail.newFiles)}}"
    >
    </lion-input-file>
  `,c=()=>l`
    <lion-input-file
      label="Passport"
      max-file-size="1024000"
      accept=".jpg,.svg,.xml,image/svg+xml"
      .validators=${[new MaxFileCount(2,{getMessage:()=>"You must not select more than 2 files"})]}
    >
    </lion-input-file>
  `,f=()=>l`
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
  `,y=()=>l`
    <lion-input-file
      label="Passport"
      name="myFiles"
      multiple
      .validators="${[new n]}"
      .uploadResponse="${[{name:"file1.txt",status:"SUCCESS",errorMessage:"",id:"132"},{name:"file2.txt",status:"SUCCESS",errorMessage:"",id:"abcd"}]}"
    >
    </lion-input-file>
  `,F=e=>{const t=e.target.querySelector("lion-input-file");t.reset(),console.log(t.modelValue)},R=e=>{e.preventDefault();const t=e.target.querySelector("lion-input-file");return console.log(t.hasFeedbackFor),console.log(t.serializedValue),!1},h=()=>{class e extends p{static get validatorName(){return"FilenameLengthValidator"}static getMessage(a){return`Filename length should not exceed ${a.params.maxFilenameLength} characters`}checkFilenameLength(a,o){return a<=o}execute(a,{maxFilenameLength:o}){return a.findIndex(r=>!this.checkFilenameLength(r.name.length,o))>-1}}return l`
    <form @submit="${R}" @reset="${F}">
      <lion-input-file
        label="Passport"
        name="upload"
        multiple
        .validators="${[new n,new e({maxFilenameLength:20})]}"
        .uploadResponse="${[{name:"file1.zip",status:"SUCCESS",id:"132"},{name:"file2.zip",status:"SUCCESS",id:"abcd"}]}"
      >
      </lion-input-file>
      <button type="reset">Reset</button>
      <button>Upload</button>
    </form>
  `},x=()=>l`
    <lion-input-file
      label="Passport"
      name="upload"
      multiple
      upload-on-select
      @file-removed="${e=>{e.target.uploadResponse[e.target.uploadResponse.findIndex(t=>t.name===e.detail.uploadResponse.name)].status="LOADING",e.target.uploadResponse=[...e.target.uploadResponse],setTimeout(()=>{e.target.uploadResponse[e.target.uploadResponse.findIndex(t=>t.name===e.detail.uploadResponse.name)]={},e.target.uploadResponse=[...e.target.uploadResponse]},1e3)}}"
      @file-list-changed="${e=>{e.detail.newFiles[0]&&(e.target.uploadResponse[e.target.uploadResponse.findIndex(t=>t.name===e.detail.newFiles[0].name)].status="LOADING",e.target.uploadResponse=[...e.target.uploadResponse],e.detail.newFiles[1]&&(e.target.uploadResponse[e.target.uploadResponse.findIndex(t=>t.name===e.detail.newFiles[1].name)].status="LOADING",e.target.uploadResponse=[...e.target.uploadResponse]),setTimeout(()=>{e.target.uploadResponse[e.target.uploadResponse.findIndex(t=>t.name===e.detail.newFiles[0].name)].status="SUCCESS",e.target.uploadResponse=[...e.target.uploadResponse]},3e3),setTimeout(()=>{e.detail.newFiles[1]&&(e.detail.newFiles[1].name,e.target.uploadResponse[e.target.uploadResponse.findIndex(t=>t.name===e.detail.newFiles[1].name)]={name:e.detail.newFiles[1].name,status:"FAIL",errorMessage:"error from server"},e.target.uploadResponse=[...e.target.uploadResponse])},3e3))}}"
    >
    </lion-input-file>
  `,b=()=>l`
    <lion-input-file
      label="Passport"
      name="myFiles"
      accept=".png"
      max-file-size="1024000"
      enable-drop-zone
      multiple
      .validators="${[new n]}"
    >
    </lion-input-file>
  `,S=document,w=[{key:"basicFileUpload",story:u},{key:"acceptValidator",story:m},{key:"sizeValidator",story:g},{key:"fileCountValidator",story:c},{key:"multipleFileUpload",story:f},{key:"prefilledState",story:y},{key:"withIngForm",story:h},{key:"uploadWithoutFormSubmit",story:x},{key:"dragAndDrop",story:b}];let i=!1;for(const e of w){const t=S.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,i=!0,Object.assign(t,{simulatorUrl:"/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}i&&(customElements.get("mdjs-preview")||s(()=>import("./define.BdbiuFq9.js"),__vite__mapDeps([0,1,2,3,4])),customElements.get("mdjs-story")||s(()=>import("./define.DNIVKtom.js"),__vite__mapDeps([5,2,3])));export{m as acceptValidator,u as basicFileUpload,b as dragAndDrop,c as fileCountValidator,f as multipleFileUpload,y as prefilledState,g as sizeValidator,x as uploadWithoutFormSubmit,h as withIngForm};
