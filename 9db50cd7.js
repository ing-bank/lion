import{L as e}from"./4cc99b59.js";import{i as t,x as s,E as i,a}from"./b4be29f1.js";import{o as l}from"./bee32da7.js";import{d as o,L as r}from"./7902d8e0.js";import{g as n}from"./d45984a3.js";import{V as d}from"./4dc0ac82.js";import{c as p}from"./c9978b47.js";import{u}from"./24f95583.js";import{L as c}from"./298b3bc0.js";class h extends d{static validatorName="IsAcceptedFile";static checkFileSize(e,t){return e<=t}static getExtension(e){return e?.slice(e.lastIndexOf("."))}static isExtensionAllowed(e,t){return t?.find(t=>t.toUpperCase()===e.toUpperCase())}static isFileTypeAllowed(e,t){return t?.find(t=>t.toUpperCase()===e.toUpperCase())}execute(e,t=this.param){let s,i;const a=this.constructor,{allowedFileTypes:l,allowedFileExtensions:o,maxFileSize:r}=t;if(l?.length)return s=e.some(e=>!a.isFileTypeAllowed(e.type,l)),s;if(o?.length)return i=e.some(e=>!a.isExtensionAllowed(a.getExtension(e.name),o)),i;return e.findIndex(e=>!a.checkFileSize(e.size,r))>-1}static async getMessage(){return""}}class m extends d{static validatorName="DuplicateFileNames";constructor(e,t){super(e,t),this.type="info"}execute(e,t=this.param){return t.show}static async getMessage(){return n().msg("lion-input-file:uploadTextDuplicateFileName")}}const _="FILE_TYPE",f="FILE_SIZE",b="FAIL",F="SUCCESS";class g{constructor(e,t){this.failedProp=[],this.systemFile=e,this._acceptCriteria=t,this.uploadFileStatus(),0===this.failedProp.length&&this.createDownloadUrl(e)}_getFileNameExtension(e){return e.slice(e.lastIndexOf("."))}uploadFileStatus(){if(this._acceptCriteria.allowedFileExtensions.length){const e=this._getFileNameExtension(this.systemFile.name);h.isExtensionAllowed(e,this._acceptCriteria.allowedFileExtensions)||(this.status=b,this.failedProp.push(_))}else if(this._acceptCriteria.allowedFileTypes.length){const e=this.systemFile.type;h.isFileTypeAllowed(e,this._acceptCriteria.allowedFileTypes)||(this.status=b,this.failedProp.push(_))}h.checkFileSize(this.systemFile.size,this._acceptCriteria.maxFileSize)?this.status!==b&&(this.status=F):(this.status=b,this.failedProp.push(f))}createDownloadUrl(e){this.downloadUrl=window.URL.createObjectURL(e)}}const v=e=>{switch(e){case"bg-BG":return import("./de7b49f9.js");case"bg":return import("./bce13af7.js");case"cs-CZ":return import("./e96247da.js");case"cs":return import("./431758b9.js");case"de-DE":return import("./e15dd1b8.js");case"de":return import("./4dc356c5.js");case"en-AU":return import("./29f99ed7.js");case"en-GB":return import("./ab9bf436.js");case"en-US":return import("./099945b3.js");case"en-PH":case"en":default:return import("./96231f33.js");case"es-ES":return import("./517f9356.js");case"es":return import("./10e81149.js");case"fr-FR":return import("./eda811f5.js");case"fr-BE":return import("./ec6fe336.js");case"fr":return import("./15c204cd.js");case"hu-HU":return import("./7a7f6be3.js");case"hu":return import("./aa11301a.js");case"it-IT":return import("./bc094c44.js");case"it":return import("./4f19e11a.js");case"nl-BE":return import("./1a47f328.js");case"nl-NL":return import("./325b41cd.js");case"nl":return import("./2e630673.js");case"pl-PL":return import("./30f2147b.js");case"pl":return import("./923d3cda.js");case"ro-RO":return import("./bbf611f7.js");case"ro":return import("./bce345d2.js");case"ru-RU":return import("./6bf19be5.js");case"ru":return import("./20e4ecc6.js");case"sk-SK":return import("./1e8b6f44.js");case"sk":return import("./5a95fa37.js");case"uk-UA":return import("./0f49a563.js");case"uk":return import("./027e03d8.js");case"zh-CN":case"zh":return import("./1453e138.js")}};class y extends(e(o(t))){static get scopedElements(){return{...super.scopedElements,"lion-validation-feedback":r}}static get properties(){return{fileList:{type:Array},multiple:{type:Boolean}}}static localizeNamespaces=[{"lion-input-file":v},...super.localizeNamespaces];constructor(){super(),this.fileList=[],this.multiple=!1}updated(e){super.updated(e),e.has("fileList")&&this._enhanceLightDomA11y()}_enhanceLightDomA11y(){const e=this.shadowRoot?.querySelectorAll('[id^="file-feedback"]'),t=this.parentNode?.parentNode;e?.forEach(e=>{t?.addEventListener("focusin",()=>{e.setAttribute("aria-live","polite")}),t?.addEventListener("focusout",()=>{e.setAttribute("aria-live","assertive")})})}_removeFile(e){this.dispatchEvent(new CustomEvent("file-remove-requested",{detail:{removedFile:e,status:e.status,uploadResponse:e.response}}))}_validationFeedbackTemplate(e,t){return s`
      <lion-validation-feedback
        id="file-feedback-${t}"
        .feedbackData="${e}"
        aria-live="assertive"
      ></lion-validation-feedback>
    `}_listItemBeforeTemplate(e){return i}_listItemAfterTemplate(e,t){return s`
      <button
        class="selected__list__item__remove-button"
        aria-label="${this.msgLit("lion-input-file:removeButtonLabel",{fileName:e.systemFile.name})}"
        @click=${()=>this._removeFile(e)}
      >
        ${this._removeButtonContentTemplate()}
      </button>
    `}_removeButtonContentTemplate(){return s`✖️`}_selectedListItemTemplate(e){const t=u();return s`
      <div class="selected__list__item" status="${e.status?e.status.toLowerCase():""}">
        <div class="selected__list__item__label">
          ${this._listItemBeforeTemplate(e)}
          <span id="selected-list-item-label-${t}" class="selected__list__item__label__text">
            <span class="sr-only">${this.msgLit("lion-input-file:fileNameDescriptionLabel")}</span>
            ${e.downloadUrl&&"LOADING"!==e.status?s`
                  <a
                    class="selected__list__item__label__link"
                    href="${e.downloadUrl}"
                    target="${e.downloadUrl.startsWith("blob")?"_blank":""}"
                    rel="${l(e.downloadUrl.startsWith("blob")?"noopener noreferrer":void 0)}"
                    >${e.systemFile?.name}</a
                  >
                `:e.systemFile?.name}
          </span>
          ${this._listItemAfterTemplate(e,t)}
        </div>
        ${"FAIL"===e.status&&e.validationFeedback?s`
              ${p(e.validationFeedback,e=>s`
                  ${this._validationFeedbackTemplate([e],t)}
                `)}
            `:i}
      </div>
    `}render(){return this.fileList?.length?s`
          ${this.multiple?s`
                <ul class="selected__list">
                  ${this.fileList.map(e=>s` <li>${this._selectedListItemTemplate(e)}</li> `)}
                </ul>
              `:s` ${this._selectedListItemTemplate(this.fileList[0])} `}
        `:i}static get styles(){return[a`
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
      `]}}function L(e,t=2){if(!+e)return"0 Bytes";const s=t<0?0:t,i=Math.floor(Math.log(e)/Math.log(1024));return`${parseFloat((e/1024**i).toFixed(s))}${[" bytes","KB","MB","GB","TB","PB","EB","ZB","YB"][i]}`}class x extends(o(e(c))){static get scopedElements(){return{...super.scopedElements,"lion-selected-file-list":y}}static get properties(){return{accept:{type:String},multiple:{type:Boolean,reflect:!0},buttonLabel:{type:String,attribute:"button-label"},maxFileSize:{type:Number,attribute:"max-file-size"},enableDropZone:{type:Boolean,attribute:"enable-drop-zone"},uploadOnSelect:{type:Boolean,attribute:"upload-on-select"},isDragging:{type:Boolean,attribute:"is-dragging",reflect:!0},uploadResponse:{type:Array,state:!1},_selectedFilesMetaData:{type:Array,state:!0}}}static localizeNamespaces=[{"lion-input-file":v},...super.localizeNamespaces];static get validationTypes(){return["error","info"]}get slots(){return{...super.slots,input:()=>s`<input .value="${l(this.getAttribute("value"))}" />`,"file-select-button":()=>s`<button
          type="button"
          id="select-button-${this._inputId}"
          @click="${this.__openDialogOnBtnClick}"
        >
          ${this.buttonLabel}
        </button>`,after:()=>s`<div data-description></div>`,"selected-file-list":()=>({template:s`
          <lion-selected-file-list
            .fileList=${this._selectedFilesMetaData}
            .multiple=${this.multiple}
          ></lion-selected-file-list>
        `,renderAsDirectHostChild:!0})}}get _inputNode(){return super._inputNode}get _buttonNode(){return this.querySelector(`#select-button-${this._inputId}`)}get buttonLabel(){return this.__buttonLabel||this._buttonNode?.textContent?.trim()||""}set buttonLabel(e){const t=this.buttonLabel;this.__buttonLabel=e,this.requestUpdate("buttonLabel",t)}get _focusableNode(){return this._buttonNode}get _isDragAndDropSupported(){return"draggable"in document.createElement("div")}constructor(){super(),this.type="file",this._selectedFilesMetaData=[],this.uploadResponse=[],this.__initialUploadResponse=this.uploadResponse,this.uploadOnSelect=!1,this.multiple=!1,this.enableDropZone=!1,this.maxFileSize=524288e3,this.accept="",this.buttonLabel="",this._initialButtonLabel="",this.modelValue=[],this._onRemoveFile=this._onRemoveFile.bind(this),this.__duplicateFileNamesValidator=new m({show:!1}),this.__previouslyParsedFiles=null}get _fileListNode(){return Array.from(this.children).find(e=>"selected-file-list"===e.slot)}connectedCallback(){super.connectedCallback(),this.__initialUploadResponse=this.uploadResponse,this._initialButtonLabel=this.buttonLabel,this._inputNode.addEventListener("change",this._onChange),this._inputNode.addEventListener("click",this._onClick)}disconnectedCallback(){super.disconnectedCallback(),this._inputNode.removeEventListener("change",this._onChange),this._inputNode.removeEventListener("click",this._onClick)}onLocaleUpdated(){super.onLocaleUpdated(),this.multiple?this.buttonLabel=this._initialButtonLabel||this.msgLit("lion-input-file:selectTextMultipleFile"):this.buttonLabel=this._initialButtonLabel||this.msgLit("lion-input-file:selectTextSingleFile")}get operationMode(){return"upload"}get _acceptCriteria(){let e=[],t=[];if(this.accept){const s=this.accept.replace(/\s+/g,"").split(",");e=s.filter(e=>e.includes("/")),t=s.filter(e=>!e.includes("/"))}return{allowedFileTypes:e,allowedFileExtensions:t,maxFileSize:this.maxFileSize}}reset(){super.reset(),this._selectedFilesMetaData=[],this.uploadResponse=this.__initialUploadResponse,this.modelValue=[],this.dirty=!1}clear(){this._selectedFilesMetaData=[],this.uploadResponse=[],this.modelValue=[]}_showFeedbackConditionFor(e,t){return super._showFeedbackConditionFor(e,t)&&!(this.validationStates.error?.FileTypeAllowed||this.validationStates.error?.FileSizeAllowed)}parser(){if(this.__previouslyParsedFiles===this._inputNode.files)return this.modelValue;this.__previouslyParsedFiles=this._inputNode.files;const e=this._inputNode.files?Array.from(this._inputNode.files):[];return this.multiple?[...this.modelValue??[],...e]:e}formatter(e){return this._inputNode?.value||""}__setupDragDropEventListeners(){const e=this.shadowRoot?.querySelector(".input-file__drop-zone");["dragenter","dragover","dragleave"].forEach(t=>{e?.addEventListener(t,e=>{e.preventDefault(),e.stopPropagation(),this.isDragging="dragleave"!==t},!1)}),window.addEventListener("drop",e=>{e.target===this._inputNode&&e.preventDefault(),this.isDragging=!1},!1)}firstUpdated(e){super.firstUpdated(e),this.__setupFileValidators(),this._inputNode&&(this._inputNode.type=this.type,this._inputNode.setAttribute("tabindex","-1"),this._inputNode.multiple=this.multiple,this.accept.length&&(this._inputNode.accept=this.accept)),this.enableDropZone&&this._isDragAndDropSupported&&(this.__setupDragDropEventListeners(),this.setAttribute("drop-zone","")),this._fileListNode.addEventListener("file-remove-requested",this._onRemoveFile)}updated(e){super.updated(e),e.has("disabled")&&(this._inputNode.disabled=this.disabled,this.validate()),e.has("buttonLabel")&&this._buttonNode&&(this._buttonNode.textContent=this.buttonLabel),e.has("name")&&(this._inputNode.name=this.name),e.has("_ariaLabelledNodes")&&this.__syncAriaLabelledByAttributesToButton(),e.has("_ariaDescribedNodes")&&this.__syncAriaDescribedByAttributesToButton(),e.has("uploadResponse")&&(0===this._selectedFilesMetaData.length&&this.uploadResponse.forEach(e=>{const t={systemFile:{name:e.name},response:e,status:e.status,validationFeedback:[{message:e.errorMessage}]};this._selectedFilesMetaData=[...this._selectedFilesMetaData,t]}),this._selectedFilesMetaData.forEach(e=>{!this.uploadResponse.some(t=>t.name===e.systemFile.name)&&this.uploadOnSelect?this.__removeFileFromList(e):(this.uploadResponse.forEach(t=>{t.name===e.systemFile.name&&(e.response=t,e.downloadUrl=t.downloadUrl?t.downloadUrl:e.downloadUrl,e.status=t.status,e.validationFeedback=[{type:"string"==typeof t.errorMessage&&t.errorMessage?.length>0?"error":"success",message:t.errorMessage??""}])}),this._selectedFilesMetaData=[...this._selectedFilesMetaData])}),this._updateUploadButtonDescription())}__computeNewAddedFiles(e){const t=e.filter(e=>-1===this._selectedFilesMetaData.findIndex(t=>t.systemFile.name===e.name));return this.__duplicateFileNamesValidator.param={show:e.length!==t.length},this.validate(),t}_processDroppedFiles(e){e.preventDefault(),this.isDragging=!1;if(!(e.dataTransfer&&e.dataTransfer.items.length>1&&!this.multiple)&&e.dataTransfer?.files){if(this._inputNode.files=e.dataTransfer.files,this.multiple){const t=this.__computeNewAddedFiles(Array.from(e.dataTransfer.files));this.modelValue=[...this.modelValue??[],...t]}else this.modelValue=Array.from(e.dataTransfer.files);this._processFiles(Array.from(e.dataTransfer.files))}}_onChange(e){this.touched=!0,this._onUserInputChanged(),this._processFiles(e?.target?.files)}_onClick(e){e.target.value=""}__syncAriaLabelledByAttributesToButton(){if(this._inputNode.hasAttribute("aria-labelledby")){const e=this._inputNode.getAttribute("aria-labelledby");this._buttonNode?.setAttribute("aria-labelledby",`select-button-${this._inputId} ${e}`)}}__syncAriaDescribedByAttributesToButton(){if(this._inputNode.hasAttribute("aria-describedby")){const e=this._inputNode.getAttribute("aria-describedby")||"";this._buttonNode?.setAttribute("aria-describedby",e)}}__setupFileValidators(){this.defaultValidators=[new h(this._acceptCriteria),this.__duplicateFileNamesValidator]}_processFiles(e){const t=this.__computeNewAddedFiles(Array.from(e));let s;!this.multiple&&t.length>0&&(this._selectedFilesMetaData=[],this.uploadResponse=[]);for(const e of t.values())s=new g(e,this._acceptCriteria),s.failedProp?.length?(this._handleErroredFiles(s),this.uploadResponse=[...this.uploadResponse,{name:s.systemFile.name,status:"FAIL",errorMessage:s.validationFeedback[0].message}]):this.uploadResponse=[...this.uploadResponse,{name:s.systemFile.name,status:"SUCCESS"}],this._selectedFilesMetaData=[...this._selectedFilesMetaData,s],this._handleErrors();const i=this._selectedFilesMetaData.filter(({systemFile:e,status:s})=>t.includes(e)&&"SUCCESS"===s).map(({systemFile:e})=>e);i.length>0&&this._dispatchFileListChangeEvent(i)}_dispatchFileListChangeEvent(e){this.dispatchEvent(new CustomEvent("file-list-changed",{detail:{newFiles:e}}))}_handleErrors(){let e=!1;if(this._selectedFilesMetaData.forEach(t=>{t.failedProp&&t.failedProp.length>0&&(e=!0)}),e)this.hasFeedbackFor?.push("error"),this.shouldShowFeedbackFor.push("error");else if(this._prevHasErrors&&this.hasFeedbackFor.includes("error")){const e=this.hasFeedbackFor.indexOf("error");this.hasFeedbackFor.slice(e,e+1);const t=this.shouldShowFeedbackFor.indexOf("error");this.shouldShowFeedbackFor.slice(t,t+1)}this._prevHasErrors=e}_handleErroredFiles(e){e.validationFeedback=[];const{allowedFileExtensions:t,allowedFileTypes:s}=this._acceptCriteria;let i,a=[],l=0;t.length?(a=t,i=a.pop(),l=a.length):s.length&&(s.forEach(e=>{if(e.endsWith("/*"))a.push(e.slice(0,-2));else if("text/plain"===e)a.push("text");else{const t=e.indexOf("/"),s=e.slice(t+1);if(s.includes("+")){const e=s.split("+");a.push(`.${e[0]}`)}else a.push(`.${s}`)}}),i=a.pop(),l=a.length);let o="";o=i?l?`${this.msgLit("lion-input-file:allowedFileValidatorComplex",{allowedTypesArray:a.join(", "),allowedTypesLastItem:i,maxSize:L(this.maxFileSize)})}`:`${this.msgLit("lion-input-file:allowedFileValidatorSimple",{allowedType:i,maxSize:L(this.maxFileSize)})}`:`${this.msgLit("lion-input-file:allowedFileSize",{maxSize:L(this.maxFileSize)})}`;const r={message:o,type:"error"};e.validationFeedback?.push(r)}_updateUploadButtonDescription(){const e=[];let t;this._selectedFilesMetaData.forEach(s=>{"FAIL"===s.status&&(t=s.validationFeedback?s.validationFeedback[0].message.toString():"",e.push(s.systemFile.name))});const s=this.querySelector('[slot="after"]');if(s)if(this._selectedFilesMetaData&&0!==this._selectedFilesMetaData.length)if(1===this._selectedFilesMetaData.length){const{name:e}=this._selectedFilesMetaData[0].systemFile;this.uploadOnSelect?s.textContent=t||this.msgLit("lion-input-file:fileUploaded")+(e??""):s.textContent=t||this.msgLit("lion-input-file:fileSelected")+(e??"")}else this.uploadOnSelect?s.textContent=`${this.msgLit("lion-input-file:filesUploaded",{numberOfFiles:this._selectedFilesMetaData.length})} ${t?this.msgLit("lion-input-file:generalValidatorMessage",{validatorMessage:t,listOfErroneousFiles:e.join(", ")}):""}`:s.textContent=`${this.msgLit("lion-input-file:filesSelected",{numberOfFiles:this._selectedFilesMetaData.length})} ${t?this.msgLit("lion-input-file:generalValidatorMessage",{validatorMessage:t,listOfErroneousFiles:e.join(", ")}):""}`;else this.uploadOnSelect?s.textContent=this.msgLit("lion-input-file:noFilesUploaded"):s.textContent=this.msgLit("lion-input-file:noFilesSelected")}__removeFileFromList(e){this._selectedFilesMetaData=this._selectedFilesMetaData.filter(t=>t.systemFile.name!==e.systemFile.name),this.modelValue&&(this.modelValue=this.modelValue.filter(t=>t.name!==e.systemFile.name)),this._inputNode.value="",this._handleErrors(),this._updateUploadButtonDescription()}_onRemoveFile(e){if(this.disabled)return;const{removedFile:t}=e.detail;!this.uploadOnSelect&&t&&this.__removeFileFromList(t),this._removeFile(t)}_removeFile(e){this.dispatchEvent(new CustomEvent("file-removed",{detail:{removedFile:e,status:e.status,uploadResponse:e.response}}))}_reflectBackOn(){return!1}_isEmpty(){return 0===this.modelValue?.length}_dropZoneTemplate(){return s`
      <div @drop="${this._processDroppedFiles}" class="input-file__drop-zone">
        <div class="input-file__drop-zone__text">
          ${this.msgLit("lion-input-file:dragAndDropText")}
        </div>
        <slot name="file-select-button"></slot>
      </div>
    `}_inputGroupAfterTemplate(){return s` <slot name="selected-file-list"></slot> `}_inputGroupInputTemplate(){return s`
      <slot name="input"> </slot>
      <slot name="after"> </slot>
      ${this.enableDropZone&&this._isDragAndDropSupported?this._dropZoneTemplate():s`
            <div class="input-group__file-select-button">
              <slot name="file-select-button"></slot>
            </div>
          `}
    `}static get styles(){return[super.styles,a`
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
      `]}__openDialogOnBtnClick(e){e.preventDefault(),e.stopPropagation(),this._inputNode.click()}}customElements.define("lion-input-file",x);
