import"./24f95583.js";import{x as e}from"./b4be29f1.js";import"./05905ff1.js";import"./9db50cd7.js";import{l as t}from"./c85cfbca.js";import{R as a}from"./cc85a6f4.js";import{V as l}from"./4dc0ac82.js";import"./4cc99b59.js";import"./19d2607c.js";import"./afb8834e.js";import"./d45984a3.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./dc2f5f5a.js";import"./bee32da7.js";import"./7902d8e0.js";import"./143fde17.js";import"./c9978b47.js";import"./298b3bc0.js";import"./459b1eec.js";import"./48ac1cb5.js";import"./e49751c9.js";import"./b7f85193.js";import"./622cc741.js";import"./a06c5caf.js";t();const s=()=>e`
    <lion-input-file
      label="Passport"
      max-file-size="1024000"
      accept=".jpg,.svg,.xml,image/svg+xml"
      @file-list-changed="${e=>{console.log("fileList",e.detail.newFiles)}}"
    >
    </lion-input-file>
  `,o=()=>e`
    <lion-input-file
      accept=".jpg,.svg,.xml,image/svg+xml"
      label="Passport"
      enable-drop-zone
      @file-list-changed="${e=>{console.log(e.detail.newFiles)}}"
    >
    </lion-input-file>
  `,i=()=>e`
    <lion-input-file
      max-file-size="2048"
      label="Passport"
      @file-list-changed="${e=>{console.log(e.detail.newFiles)}}"
    >
    </lion-input-file>
  `,n=()=>e`
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
  `,r=()=>e`
    <lion-input-file
      label="Passport"
      name="myFiles"
      multiple
      .validators="${[new a]}"
      .uploadResponse="${[{name:"file1.txt",status:"SUCCESS",errorMessage:"",id:"132"},{name:"file2.txt",status:"SUCCESS",errorMessage:"",id:"abcd"}]}"
    >
    </lion-input-file>
  `,p=e=>{const t=e.target.querySelector("lion-input-file");t.reset(),console.log(t.modelValue)},d=e=>{e.preventDefault();const t=e.target.querySelector("lion-input-file");return console.log(t.hasFeedbackFor),console.log(t.serializedValue),!1},m=()=>e`
    <form @submit="${d}" @reset="${p}">
      <lion-input-file
        label="Passport"
        name="upload"
        multiple
        .validators="${[new a,new class extends l{static get validatorName(){return"FilenameLengthValidator"}static getMessage(e){return`Filename length should not exceed ${e.params.maxFilenameLength} characters`}checkFilenameLength(e,t){return e<=t}execute(e,{maxFilenameLength:t}){return e.findIndex(e=>!this.checkFilenameLength(e.name.length,t))>-1}}({maxFilenameLength:20})]}"
        .uploadResponse="${[{name:"file1.zip",status:"SUCCESS",id:"132"},{name:"file2.zip",status:"SUCCESS",id:"abcd"}]}"
      >
      </lion-input-file>
      <button type="reset">Reset</button>
      <button>Upload</button>
    </form>
  `,u=()=>e`
    <lion-input-file
      label="Passport"
      name="upload"
      multiple
      upload-on-select
      @file-removed="${e=>{e.target.uploadResponse[e.target.uploadResponse.findIndex(t=>t.name===e.detail.uploadResponse.name)].status="LOADING",e.target.uploadResponse=[...e.target.uploadResponse],setTimeout(()=>{e.target.uploadResponse[e.target.uploadResponse.findIndex(t=>t.name===e.detail.uploadResponse.name)]={},e.target.uploadResponse=[...e.target.uploadResponse]},1e3)}}"
      @file-list-changed="${e=>{e.detail.newFiles[0]&&(e.target.uploadResponse[e.target.uploadResponse.findIndex(t=>t.name===e.detail.newFiles[0].name)].status="LOADING",e.target.uploadResponse=[...e.target.uploadResponse],e.detail.newFiles[1]&&(e.target.uploadResponse[e.target.uploadResponse.findIndex(t=>t.name===e.detail.newFiles[1].name)].status="LOADING",e.target.uploadResponse=[...e.target.uploadResponse]),setTimeout(()=>{e.target.uploadResponse[e.target.uploadResponse.findIndex(t=>t.name===e.detail.newFiles[0].name)].status="SUCCESS",e.target.uploadResponse=[...e.target.uploadResponse]},3e3),setTimeout(()=>{e.detail.newFiles[1]&&(e.detail.newFiles[1].name,e.target.uploadResponse[e.target.uploadResponse.findIndex(t=>t.name===e.detail.newFiles[1].name)]={name:e.detail.newFiles[1].name,status:"FAIL",errorMessage:"error from server"},e.target.uploadResponse=[...e.target.uploadResponse])},3e3))}}"
    >
    </lion-input-file>
  `,c=()=>e`
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
  `,g=document,f=[{key:"basicFileUpload",story:s},{key:"acceptValidator",story:o},{key:"sizeValidator",story:i},{key:"multipleFileUpload",story:n},{key:"prefilledState",story:r},{key:"withIngForm",story:m},{key:"uploadWithoutFormSubmit",story:u},{key:"dragAndDrop",story:c}];let b=!1;for(const e of f){const t=g.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,b=!0,Object.assign(t,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}b&&(customElements.get("mdjs-preview")||import("./a7b4f51b.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{o as acceptValidator,s as basicFileUpload,c as dragAndDrop,n as multipleFileUpload,r as prefilledState,i as sizeValidator,u as uploadWithoutFormSubmit,m as withIngForm};
