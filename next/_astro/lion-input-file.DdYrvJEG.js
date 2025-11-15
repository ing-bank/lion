const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/bg-BG.DP5et3WI.js","_astro/bg.B0hZfDdt.js","_astro/cs-CZ.DnMQPDX7.js","_astro/cs.DPSuDd69.js","_astro/de-DE.BKK8qAxt.js","_astro/de.Dp1aWnqF.js","_astro/en-AU.CKKojYlp.js","_astro/en.BLUCqhh8.js","_astro/en-GB.CKKojYlp.js","_astro/en-US.CKKojYlp.js","_astro/es-ES.AXi4fvI_.js","_astro/es.D3Z6RsHb.js","_astro/fr-FR.CuxCwOSf.js","_astro/fr.DAmVJt6X.js","_astro/fr-BE.CuxCwOSf.js","_astro/hu-HU.DgJ_EK8c.js","_astro/hu.Dtj4-RGt.js","_astro/it-IT.C-bxuMIT.js","_astro/it.C0jiecn2.js","_astro/nl-BE.CYXYQU9Z.js","_astro/nl.Ckb6gFxt.js","_astro/nl-NL.CYXYQU9Z.js","_astro/pl-PL.DAqYMyVe.js","_astro/pl.DrsBFJ0w.js","_astro/ro-RO.BdI8j3Pd.js","_astro/ro.BP6Mc_yM.js","_astro/ru-RU.Crw68yyk.js","_astro/ru.BhV3PeXR.js","_astro/sk-SK.3EkZqHZj.js","_astro/sk.CvMPTWO4.js","_astro/uk-UA.m3ossnhr.js","_astro/uk.Co5ofLm_.js"])))=>i.map(i=>d[i]);
import{L as g}from"./LocalizeMixin.VYu75dkK.js";import{i as x,a as E}from"./lit-element.qDHKJJma.js";import{x as a,E as f}from"./lit-html.C7L4dwLU.js";import{o as L}from"./if-defined.CV50pAZo.js";import{d as v,L as T}from"./InteractionStateMixin.DC1PvWzb.js";import{V as D}from"./Validator.DAOhFpDH.js";import{g as w}from"./getLocalizeManager.W5d_ICRU.js";import{c as I}from"./repeat.BYpCtbkJ.js";import{_ as s}from"./preload-helper.4zY6-HO4.js";import{u as S}from"./node-tools_providence-analytics_overview.LFFQBZzG.js";import{L as N}from"./LionField.gZkYIwXF.js";class c extends D{static validatorName="IsAcceptedFile";static checkFileSize(e,t){return e<=t}static getExtension(e){return e?.slice(e.lastIndexOf("."))}static isExtensionAllowed(e,t){return t?.find(i=>i.toUpperCase()===e.toUpperCase())}static isFileTypeAllowed(e,t){return t?.find(i=>i.toUpperCase()===e.toUpperCase())}execute(e,t=this.param){let i,l;const o=this.constructor,{allowedFileTypes:n,allowedFileExtensions:d,maxFileSize:h}=t;return n?.length?(i=e.some(u=>!o.isFileTypeAllowed(u.type,n)),i):d?.length?(l=e.some(u=>!o.isExtensionAllowed(o.getExtension(u.name),d)),l):e.findIndex(u=>!o.checkFileSize(u.size,h))>-1}static async getMessage(){return""}}class R extends D{static validatorName="DuplicateFileNames";constructor(e,t){super(e,t),this.type="info"}execute(e,t=this.param){return t.show}static async getMessage(){return w().msg("lion-input-file:uploadTextDuplicateFileName")}}const V=524288e3,F={type:"FILE_TYPE",size:"FILE_SIZE"},_={fail:"FAIL",pass:"SUCCESS"};class O{constructor(e,t){this.failedProp=[],this.systemFile=e,this._acceptCriteria=t,this.uploadFileStatus(),this.failedProp.length===0&&this.createDownloadUrl(e)}_getFileNameExtension(e){return e.slice(e.lastIndexOf("."))}uploadFileStatus(){if(this._acceptCriteria.allowedFileExtensions.length){const e=this._getFileNameExtension(this.systemFile.name);c.isExtensionAllowed(e,this._acceptCriteria.allowedFileExtensions)||(this.status=_.fail,this.failedProp.push(F.type))}else if(this._acceptCriteria.allowedFileTypes.length){const e=this.systemFile.type;c.isFileTypeAllowed(e,this._acceptCriteria.allowedFileTypes)||(this.status=_.fail,this.failedProp.push(F.type))}c.checkFileSize(this.systemFile.size,this._acceptCriteria.maxFileSize)?this.status!==_.fail&&(this.status=_.pass):(this.status=_.fail,this.failedProp.push(F.size))}createDownloadUrl(e){this.downloadUrl=window.URL.createObjectURL(e)}}const y=r=>{switch(r){case"bg-BG":return s(()=>import("./bg-BG.DP5et3WI.js"),__vite__mapDeps([0,1]));case"bg":return s(()=>import("./bg.B0hZfDdt.js"),[]);case"cs-CZ":return s(()=>import("./cs-CZ.DnMQPDX7.js"),__vite__mapDeps([2,3]));case"cs":return s(()=>import("./cs.DPSuDd69.js"),[]);case"de-DE":return s(()=>import("./de-DE.BKK8qAxt.js"),__vite__mapDeps([4,5]));case"de":return s(()=>import("./de.Dp1aWnqF.js"),[]);case"en-AU":return s(()=>import("./en-AU.CKKojYlp.js"),__vite__mapDeps([6,7]));case"en-GB":return s(()=>import("./en-GB.CKKojYlp.js"),__vite__mapDeps([8,7]));case"en-US":return s(()=>import("./en-US.CKKojYlp.js"),__vite__mapDeps([9,7]));case"en-PH":case"en":return s(()=>import("./en.BLUCqhh8.js"),[]);case"es-ES":return s(()=>import("./es-ES.AXi4fvI_.js"),__vite__mapDeps([10,11]));case"es":return s(()=>import("./es.D3Z6RsHb.js"),[]);case"fr-FR":return s(()=>import("./fr-FR.CuxCwOSf.js"),__vite__mapDeps([12,13]));case"fr-BE":return s(()=>import("./fr-BE.CuxCwOSf.js"),__vite__mapDeps([14,13]));case"fr":return s(()=>import("./fr.DAmVJt6X.js"),[]);case"hu-HU":return s(()=>import("./hu-HU.DgJ_EK8c.js"),__vite__mapDeps([15,16]));case"hu":return s(()=>import("./hu.Dtj4-RGt.js"),[]);case"it-IT":return s(()=>import("./it-IT.C-bxuMIT.js"),__vite__mapDeps([17,18]));case"it":return s(()=>import("./it.C0jiecn2.js"),[]);case"nl-BE":return s(()=>import("./nl-BE.CYXYQU9Z.js"),__vite__mapDeps([19,20]));case"nl-NL":return s(()=>import("./nl-NL.CYXYQU9Z.js"),__vite__mapDeps([21,20]));case"nl":return s(()=>import("./nl.Ckb6gFxt.js"),[]);case"pl-PL":return s(()=>import("./pl-PL.DAqYMyVe.js"),__vite__mapDeps([22,23]));case"pl":return s(()=>import("./pl.DrsBFJ0w.js"),[]);case"ro-RO":return s(()=>import("./ro-RO.BdI8j3Pd.js"),__vite__mapDeps([24,25]));case"ro":return s(()=>import("./ro.BP6Mc_yM.js"),[]);case"ru-RU":return s(()=>import("./ru-RU.Crw68yyk.js"),__vite__mapDeps([26,27]));case"ru":return s(()=>import("./ru.BhV3PeXR.js"),[]);case"sk-SK":return s(()=>import("./sk-SK.3EkZqHZj.js"),__vite__mapDeps([28,29]));case"sk":return s(()=>import("./sk.CvMPTWO4.js"),[]);case"uk-UA":return s(()=>import("./uk-UA.m3ossnhr.js"),__vite__mapDeps([30,31]));case"uk":return s(()=>import("./uk.Co5ofLm_.js"),[]);case"zh-CN":case"zh":return s(()=>import("./zh.CFUcOJRZ.js"),[]);default:return s(()=>import("./en.BLUCqhh8.js"),[])}};class k extends g(v(x)){static get scopedElements(){return{...super.scopedElements,"lion-validation-feedback":T}}static get properties(){return{fileList:{type:Array},multiple:{type:Boolean}}}static localizeNamespaces=[{"lion-input-file":y},...super.localizeNamespaces];constructor(){super(),this.fileList=[],this.multiple=!1}updated(e){super.updated(e),e.has("fileList")&&this._enhanceLightDomA11y()}_enhanceLightDomA11y(){const e=this.shadowRoot?.querySelectorAll('[id^="file-feedback"]'),t=this.parentNode?.parentNode;e?.forEach(i=>{t?.addEventListener("focusin",()=>{i.setAttribute("aria-live","polite")}),t?.addEventListener("focusout",()=>{i.setAttribute("aria-live","assertive")})})}_removeFile(e){this.dispatchEvent(new CustomEvent("file-remove-requested",{detail:{removedFile:e,status:e.status,uploadResponse:e.response}}))}_validationFeedbackTemplate(e,t){return a`
      <lion-validation-feedback
        id="file-feedback-${t}"
        .feedbackData="${e}"
        aria-live="assertive"
      ></lion-validation-feedback>
    `}_listItemBeforeTemplate(e){return f}_listItemAfterTemplate(e,t){return a`
      <button
        class="selected__list__item__remove-button"
        aria-label="${this.msgLit("lion-input-file:removeButtonLabel",{fileName:e.systemFile.name})}"
        @click=${()=>this._removeFile(e)}
      >
        ${this._removeButtonContentTemplate()}
      </button>
    `}_removeButtonContentTemplate(){return a`✖️`}_selectedListItemTemplate(e){const t=S();return a`
      <div class="selected__list__item" status="${e.status?e.status.toLowerCase():""}">
        <div class="selected__list__item__label">
          ${this._listItemBeforeTemplate(e)}
          <span id="selected-list-item-label-${t}" class="selected__list__item__label__text">
            <span class="sr-only">${this.msgLit("lion-input-file:fileNameDescriptionLabel")}</span>
            ${e.downloadUrl&&e.status!=="LOADING"?a`
                  <a
                    class="selected__list__item__label__link"
                    href="${e.downloadUrl}"
                    target="${e.downloadUrl.startsWith("blob")?"_blank":""}"
                    rel="${L(e.downloadUrl.startsWith("blob")?"noopener noreferrer":void 0)}"
                    >${e.systemFile?.name}</a
                  >
                `:e.systemFile?.name}
          </span>
          ${this._listItemAfterTemplate(e,t)}
        </div>
        ${e.status==="FAIL"&&e.validationFeedback?a`
              ${I(e.validationFeedback,i=>a`
                  ${this._validationFeedbackTemplate([i],t)}
                `)}
            `:f}
      </div>
    `}render(){return this.fileList?.length?a`
          ${this.multiple?a`
                <ul class="selected__list">
                  ${this.fileList.map(e=>a` <li>${this._selectedListItemTemplate(e)}</li> `)}
                </ul>
              `:a` ${this._selectedListItemTemplate(this.fileList[0])} `}
        `:f}static get styles(){return[E`
        .selected__list {
          list-style-type: none;
          margin-block-start: 0;
          margin-block-end: 0;
          padding-inline-start: 0;
        }

        .sr-only {
          position: absolute;
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
      `]}}function b(r,e=2){if(!+r)return"0 Bytes";const t=1024,i=e<0?0:e,l=[" bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],o=Math.floor(Math.log(r)/Math.log(t));return`${parseFloat((r/t**o).toFixed(i))}${l[o]}`}class C extends v(g(N)){static get scopedElements(){return{...super.scopedElements,"lion-selected-file-list":k}}static get properties(){return{accept:{type:String},multiple:{type:Boolean,reflect:!0},buttonLabel:{type:String,attribute:"button-label"},maxFileSize:{type:Number,attribute:"max-file-size"},enableDropZone:{type:Boolean,attribute:"enable-drop-zone"},uploadOnSelect:{type:Boolean,attribute:"upload-on-select"},isDragging:{type:Boolean,attribute:"is-dragging",reflect:!0},uploadResponse:{type:Array,state:!1},_selectedFilesMetaData:{type:Array,state:!0}}}static localizeNamespaces=[{"lion-input-file":y},...super.localizeNamespaces];static get validationTypes(){return["error","info"]}get slots(){return{...super.slots,input:()=>a`<input .value="${L(this.getAttribute("value"))}" />`,"file-select-button":()=>a`<button
          type="button"
          id="select-button-${this._inputId}"
          @click="${this.__openDialogOnBtnClick}"
        >
          ${this.buttonLabel}
        </button>`,after:()=>a`<div data-description></div>`,"selected-file-list":()=>({template:a`
          <lion-selected-file-list
            .fileList=${this._selectedFilesMetaData}
            .multiple=${this.multiple}
          ></lion-selected-file-list>
        `,renderAsDirectHostChild:!0})}}get _inputNode(){return super._inputNode}get _buttonNode(){return this.querySelector(`#select-button-${this._inputId}`)}get buttonLabel(){return this.__buttonLabel||this._buttonNode?.textContent?.trim()||""}set buttonLabel(e){const t=this.buttonLabel;this.__buttonLabel=e,this.requestUpdate("buttonLabel",t)}get _focusableNode(){return this._buttonNode}get _isDragAndDropSupported(){return"draggable"in document.createElement("div")}constructor(){super(),this.type="file",this._selectedFilesMetaData=[],this.uploadResponse=[],this.__initialUploadResponse=this.uploadResponse,this.uploadOnSelect=!1,this.multiple=!1,this.enableDropZone=!1,this.maxFileSize=V,this.accept="",this.buttonLabel="",this._initialButtonLabel="",this.modelValue=[],this._onRemoveFile=this._onRemoveFile.bind(this),this.__duplicateFileNamesValidator=new R({show:!1}),this.__previouslyParsedFiles=null}get _fileListNode(){return Array.from(this.children).find(e=>e.slot==="selected-file-list")}connectedCallback(){super.connectedCallback(),this.__initialUploadResponse=this.uploadResponse,this._initialButtonLabel=this.buttonLabel,this._inputNode.addEventListener("change",this._onChange),this._inputNode.addEventListener("click",this._onClick)}disconnectedCallback(){super.disconnectedCallback(),this._inputNode.removeEventListener("change",this._onChange),this._inputNode.removeEventListener("click",this._onClick)}onLocaleUpdated(){super.onLocaleUpdated(),this.multiple?this.buttonLabel=this._initialButtonLabel||this.msgLit("lion-input-file:selectTextMultipleFile"):this.buttonLabel=this._initialButtonLabel||this.msgLit("lion-input-file:selectTextSingleFile")}get operationMode(){return"upload"}get _acceptCriteria(){let e=[],t=[];if(this.accept){const i=this.accept.replace(/\s+/g,"").split(",");e=i.filter(l=>l.includes("/")),t=i.filter(l=>!l.includes("/"))}return{allowedFileTypes:e,allowedFileExtensions:t,maxFileSize:this.maxFileSize}}reset(){super.reset(),this._selectedFilesMetaData=[],this.uploadResponse=this.__initialUploadResponse,this.modelValue=[],this.dirty=!1}clear(){this._selectedFilesMetaData=[],this.uploadResponse=[],this.modelValue=[]}_showFeedbackConditionFor(e,t){return super._showFeedbackConditionFor(e,t)&&!(this.validationStates.error?.FileTypeAllowed||this.validationStates.error?.FileSizeAllowed)}parser(){if(this.__previouslyParsedFiles===this._inputNode.files)return this.modelValue;this.__previouslyParsedFiles=this._inputNode.files;const e=this._inputNode.files?Array.from(this._inputNode.files):[];return this.multiple?[...this.modelValue??[],...e]:e}formatter(e){return this._inputNode?.value||""}__setupDragDropEventListeners(){const e=this.shadowRoot?.querySelector(".input-file__drop-zone");["dragenter","dragover","dragleave"].forEach(t=>{e?.addEventListener(t,i=>{i.preventDefault(),i.stopPropagation(),this.isDragging=t!=="dragleave"},!1)}),window.addEventListener("drop",t=>{t.target===this._inputNode&&t.preventDefault(),this.isDragging=!1},!1)}firstUpdated(e){super.firstUpdated(e),this.__setupFileValidators(),this._inputNode&&(this._inputNode.type=this.type,this._inputNode.setAttribute("tabindex","-1"),this._inputNode.multiple=this.multiple,this.accept.length&&(this._inputNode.accept=this.accept)),this.enableDropZone&&this._isDragAndDropSupported&&(this.__setupDragDropEventListeners(),this.setAttribute("drop-zone","")),this._fileListNode.addEventListener("file-remove-requested",this._onRemoveFile)}updated(e){super.updated(e),e.has("disabled")&&(this._inputNode.disabled=this.disabled,this.validate()),e.has("buttonLabel")&&this._buttonNode&&(this._buttonNode.textContent=this.buttonLabel),e.has("name")&&(this._inputNode.name=this.name),e.has("_ariaLabelledNodes")&&this.__syncAriaLabelledByAttributesToButton(),e.has("_ariaDescribedNodes")&&this.__syncAriaDescribedByAttributesToButton(),e.has("uploadResponse")&&(this._selectedFilesMetaData.length===0&&this.uploadResponse.forEach(t=>{const i={systemFile:{name:t.name},response:t,status:t.status,validationFeedback:[{message:t.errorMessage}]};this._selectedFilesMetaData=[...this._selectedFilesMetaData,i]}),this._selectedFilesMetaData.forEach(t=>{!this.uploadResponse.some(i=>i.name===t.systemFile.name)&&this.uploadOnSelect?this.__removeFileFromList(t):(this.uploadResponse.forEach(i=>{i.name===t.systemFile.name&&(t.response=i,t.downloadUrl=i.downloadUrl?i.downloadUrl:t.downloadUrl,t.status=i.status,t.validationFeedback=[{type:typeof i.errorMessage=="string"&&i.errorMessage?.length>0?"error":"success",message:i.errorMessage??""}])}),this._selectedFilesMetaData=[...this._selectedFilesMetaData])}),this._updateUploadButtonDescription())}__computeNewAddedFiles(e){const t=e.filter(i=>this._selectedFilesMetaData.findIndex(l=>l.systemFile.name===i.name)===-1);return this.__duplicateFileNamesValidator.param={show:e.length!==t.length},this.validate(),t}_processDroppedFiles(e){if(e.preventDefault(),this.isDragging=!1,!(e.dataTransfer&&e.dataTransfer.items.length>1&&!this.multiple||!e.dataTransfer?.files)){if(this._inputNode.files=e.dataTransfer.files,this.multiple){const i=this.__computeNewAddedFiles(Array.from(e.dataTransfer.files));this.modelValue=[...this.modelValue??[],...i]}else this.modelValue=Array.from(e.dataTransfer.files);this._processFiles(Array.from(e.dataTransfer.files))}}_onChange(e){this.touched=!0,this._onUserInputChanged(),this._processFiles(e?.target?.files)}_onClick(e){e.target.value=""}__syncAriaLabelledByAttributesToButton(){if(this._inputNode.hasAttribute("aria-labelledby")){const e=this._inputNode.getAttribute("aria-labelledby");this._buttonNode?.setAttribute("aria-labelledby",`select-button-${this._inputId} ${e}`)}}__syncAriaDescribedByAttributesToButton(){if(this._inputNode.hasAttribute("aria-describedby")){const e=this._inputNode.getAttribute("aria-describedby")||"";this._buttonNode?.setAttribute("aria-describedby",e)}}__setupFileValidators(){this.defaultValidators=[new c(this._acceptCriteria),this.__duplicateFileNamesValidator]}_processFiles(e){const t=this.__computeNewAddedFiles(Array.from(e));!this.multiple&&t.length>0&&(this._selectedFilesMetaData=[],this.uploadResponse=[]);let i;for(const o of t.values())i=new O(o,this._acceptCriteria),i.failedProp?.length?(this._handleErroredFiles(i),this.uploadResponse=[...this.uploadResponse,{name:i.systemFile.name,status:"FAIL",errorMessage:i.validationFeedback[0].message}]):this.uploadResponse=[...this.uploadResponse,{name:i.systemFile.name,status:"SUCCESS"}],this._selectedFilesMetaData=[...this._selectedFilesMetaData,i],this._handleErrors();const l=this._selectedFilesMetaData.filter(({systemFile:o,status:n})=>t.includes(o)&&n==="SUCCESS").map(({systemFile:o})=>o);l.length>0&&this._dispatchFileListChangeEvent(l)}_dispatchFileListChangeEvent(e){this.dispatchEvent(new CustomEvent("file-list-changed",{detail:{newFiles:e}}))}_handleErrors(){let e=!1;if(this._selectedFilesMetaData.forEach(t=>{t.failedProp&&t.failedProp.length>0&&(e=!0)}),e)this.hasFeedbackFor?.push("error"),this.shouldShowFeedbackFor.push("error");else if(this._prevHasErrors&&this.hasFeedbackFor.includes("error")){const t=this.hasFeedbackFor.indexOf("error");this.hasFeedbackFor.slice(t,t+1);const i=this.shouldShowFeedbackFor.indexOf("error");this.shouldShowFeedbackFor.slice(i,i+1)}this._prevHasErrors=e}_handleErroredFiles(e){e.validationFeedback=[];const{allowedFileExtensions:t,allowedFileTypes:i}=this._acceptCriteria;let l=[],o=0,n;t.length?(l=t,n=l.pop(),o=l.length):i.length&&(i.forEach(p=>{if(p.endsWith("/*"))l.push(p.slice(0,-2));else if(p==="text/plain")l.push("text");else{const u=p.indexOf("/"),m=p.slice(u+1);if(!m.includes("+"))l.push(`.${m}`);else{const A=m.split("+");l.push(`.${A[0]}`)}}}),n=l.pop(),o=l.length);let d="";n?o?d=`${this.msgLit("lion-input-file:allowedFileValidatorComplex",{allowedTypesArray:l.join(", "),allowedTypesLastItem:n,maxSize:b(this.maxFileSize)})}`:d=`${this.msgLit("lion-input-file:allowedFileValidatorSimple",{allowedType:n,maxSize:b(this.maxFileSize)})}`:d=`${this.msgLit("lion-input-file:allowedFileSize",{maxSize:b(this.maxFileSize)})}`;const h={message:d,type:"error"};e.validationFeedback?.push(h)}_updateUploadButtonDescription(){const e=[];let t;this._selectedFilesMetaData.forEach(l=>{l.status==="FAIL"&&(t=l.validationFeedback?l.validationFeedback[0].message.toString():"",e.push(l.systemFile.name))});const i=this.querySelector('[slot="after"]');if(i)if(!this._selectedFilesMetaData||this._selectedFilesMetaData.length===0)this.uploadOnSelect?i.textContent=this.msgLit("lion-input-file:noFilesUploaded"):i.textContent=this.msgLit("lion-input-file:noFilesSelected");else if(this._selectedFilesMetaData.length===1){const{name:l}=this._selectedFilesMetaData[0].systemFile;this.uploadOnSelect?i.textContent=t||this.msgLit("lion-input-file:fileUploaded")+(l??""):i.textContent=t||this.msgLit("lion-input-file:fileSelected")+(l??"")}else this.uploadOnSelect?i.textContent=`${this.msgLit("lion-input-file:filesUploaded",{numberOfFiles:this._selectedFilesMetaData.length})} ${t?this.msgLit("lion-input-file:generalValidatorMessage",{validatorMessage:t,listOfErroneousFiles:e.join(", ")}):""}`:i.textContent=`${this.msgLit("lion-input-file:filesSelected",{numberOfFiles:this._selectedFilesMetaData.length})} ${t?this.msgLit("lion-input-file:generalValidatorMessage",{validatorMessage:t,listOfErroneousFiles:e.join(", ")}):""}`}__removeFileFromList(e){this._selectedFilesMetaData=this._selectedFilesMetaData.filter(t=>t.systemFile.name!==e.systemFile.name),this.modelValue&&(this.modelValue=this.modelValue.filter(t=>t.name!==e.systemFile.name)),this._inputNode.value="",this._handleErrors(),this._updateUploadButtonDescription()}_onRemoveFile(e){if(this.disabled)return;const{removedFile:t}=e.detail;!this.uploadOnSelect&&t&&this.__removeFileFromList(t),this._removeFile(t)}_removeFile(e){this.dispatchEvent(new CustomEvent("file-removed",{detail:{removedFile:e,status:e.status,uploadResponse:e.response}}))}_reflectBackOn(){return!1}_isEmpty(){return this.modelValue?.length===0}_dropZoneTemplate(){return a`
      <div @drop="${this._processDroppedFiles}" class="input-file__drop-zone">
        <div class="input-file__drop-zone__text">
          ${this.msgLit("lion-input-file:dragAndDropText")}
        </div>
        <slot name="file-select-button"></slot>
      </div>
    `}_inputGroupAfterTemplate(){return a` <slot name="selected-file-list"></slot> `}_inputGroupInputTemplate(){return a`
      <slot name="input"> </slot>
      <slot name="after"> </slot>
      ${this.enableDropZone&&this._isDragAndDropSupported?this._dropZoneTemplate():a`
            <div class="input-group__file-select-button">
              <slot name="file-select-button"></slot>
            </div>
          `}
    `}static get styles(){return[super.styles,E`
        .input-group__container {
          position: relative;
          display: flex;
          flex-direction: column;
          width: fit-content;
        }

        :host([drop-zone]) .input-group__container {
          width: auto;
        }

        .input-group__container ::slotted(input[type='file']) {
          /** Invisible, since means of interaction is button */
          position: absolute;
          opacity: 0;
          /** Full cover positioned, so it will be a drag and drop surface */
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }

        .input-file__drop-zone {
          display: flex;
          position: relative;
          flex-direction: column;
          align-items: center;
          border: dashed 2px black;
          padding: 24px 0;
        }

        .input-group__container ::slotted([slot='after']) {
          position: absolute;
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
      `]}__openDialogOnBtnClick(e){e.preventDefault(),e.stopPropagation(),this._inputNode.click()}}customElements.define("lion-input-file",C);
