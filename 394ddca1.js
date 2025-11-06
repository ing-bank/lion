import{a as e,x as t}from"./b4be29f1.js";import{o as r}from"./bee32da7.js";import{O as a}from"./65cdf028.js";import{A as s}from"./5254a80b.js";import{w as i}from"./88061fcd.js";import{w as n}from"./c84885cc.js";import{L as o}from"./4cc99b59.js";import{d as l}from"./c6fab747.js";import{L as d}from"./43bc0982.js";import{L as c}from"./5cdb1e6a.js";import{u as p}from"./24f95583.js";import{I as m}from"./b7f85193.js";async function _(e){const t=await Promise.all(e),r=t[0];for(const e of t.slice(1))Object.entries(e.default).forEach(([e,t])=>{r.default[e]=t});return r}const u=e=>{switch(e){case"bg-BG":return _([import("./47131fe9.js"),import("./bf56dec0.js")]);case"bg":return _([import("./a47748f3.js"),import("./e7b92f5e.js")]);case"cs-CZ":return _([import("./f9370462.js"),import("./d365278a.js")]);case"cs":return _([import("./9db808c1.js"),import("./a97addcc.js")]);case"de-DE":return _([import("./2ba86fed.js"),import("./4f8b7c95.js")]);case"de":return _([import("./6531481d.js"),import("./7b3e8add.js")]);case"en-AU":return _([import("./d393036f.js"),import("./84bc70e9.js")]);case"en-GB":return _([import("./741116bb.js"),import("./eb5056e2.js")]);case"en-US":return import("./cacbf85e.js");case"en-PH":case"en":default:return _([import("./dcf27ec6.js"),import("./df7a4828.js")]);case"es-ES":return _([import("./bede00f9.js"),import("./05db6b65.js")]);case"es":return _([import("./b89b5193.js"),import("./a917a166.js")]);case"fr-FR":return _([import("./582ce5e8.js"),import("./10f22a19.js")]);case"fr-BE":return _([import("./f03dfa66.js"),import("./8038cfec.js")]);case"fr":return _([import("./5830c954.js"),import("./d8282f4b.js")]);case"hu-HU":return _([import("./d8ce9aa8.js"),import("./832c4ff5.js")]);case"hu":return _([import("./6cdf32d8.js"),import("./c5b519aa.js")]);case"it-IT":return _([import("./399d5582.js"),import("./62c190b8.js")]);case"it":return _([import("./116bf1e0.js"),import("./64e9b8b5.js")]);case"nl-BE":return _([import("./3a6e3b1a.js"),import("./fc7f3456.js")]);case"nl-NL":return _([import("./40c0730d.js"),import("./54edd07e.js")]);case"nl":return _([import("./72de8dfc.js"),import("./835dcc02.js")]);case"pl-PL":return _([import("./9f8fbdf3.js"),import("./505daac6.js")]);case"pl":return _([import("./5ae112e7.js"),import("./776ae4d5.js")]);case"ro-RO":return _([import("./b493c2ad.js"),import("./0eb60ad0.js")]);case"ro":return _([import("./cb788809.js"),import("./ffa152a9.js")]);case"ru-RU":return _([import("./0df71703.js"),import("./97b34a3f.js")]);case"ru":return _([import("./523fa7fc.js"),import("./4bb5fefe.js")]);case"sk-SK":return _([import("./ff951774.js"),import("./2dd710fb.js")]);case"sk":return _([import("./300cff08.js"),import("./ebf52b05.js")]);case"tr-TR":return import("./c2ce83cc.js");case"tr":return _([import("./9a4bf6c7.js"),import("./b9abbf36.js")]);case"uk-UA":return _([import("./dc6903da.js"),import("./c3f3de62.js")]);case"uk":return _([import("./839802f2.js"),import("./0f595f80.js")]);case"zh-CN":case"zh":return _([import("./0501c411.js"),import("./56020588.js")])}};class h extends(l(s(a(o(d))))){static get scopedElements(){return{...super.scopedElements,"lion-calendar":c}}static get styles(){return[...super.styles,e`
        .calendar__overlay-frame {
          display: inline-block;
          background: white;
          position: relative;
        }

        .calendar-overlay__header {
          display: flex;
        }

        .calendar-overlay__heading {
          padding: 16px 16px 8px;
          flex: 1;
        }

        .calendar-overlay__heading > .calendar-overlay__close-button {
          flex: none;
        }

        .calendar-overlay__close-button {
          min-width: 40px;
          min-height: 32px;
          border-width: 0;
          padding: 0;
          font-size: 24px;
        }
      `]}static get properties(){return{calendarHeading:{type:String,attribute:"calendar-heading"},_calendarInvokerSlot:{attribute:!1},__calendarMinDate:{attribute:!1},__calendarMaxDate:{attribute:!1},__calendarDisableDates:{attribute:!1,type:Array}}}get slots(){return{...super.slots,[this._calendarInvokerSlot]:()=>this._invokerTemplate()}}static get localizeNamespaces(){return[{"lion-input-datepicker":u},...super.localizeNamespaces]}get _invokerNode(){return this.querySelector(`#${this.__invokerId}`)}get _calendarNode(){return this._overlayCtrl.contentNode.querySelector('[slot="content"]')}constructor(){super(),this.__invokerId=p(this.localName),this._calendarInvokerSlot="suffix",this._focusCentralDateOnCalendarOpen=!0,this._hideOnUserSelect=!0,this._syncOnUserSelect=!0,this._isHandlingCalendarUserInput=!1,this.__openCalendarOverlay=this.__openCalendarOverlay.bind(this),this._onCalendarUserSelectedChanged=this._onCalendarUserSelectedChanged.bind(this)}requestUpdate(e,t,r){super.requestUpdate(e,t,r),"disabled"!==e&&"readOnly"!==e||this.__toggleInvokerDisabled()}__toggleInvokerDisabled(){if(this._invokerNode){this._invokerNode.disabled=this.disabled||this.readOnly}}firstUpdated(e){super.firstUpdated(e),this.__toggleInvokerDisabled()}updated(e){if(super.updated(e),e.has("validators")){const e=[...this.validators||[]];this.__syncDisabledDates(e)}e.has("label")&&(this.calendarHeading=this.calendarHeading||this.label)}_overlayTemplate(){return t`
      <div id="overlay-content-node-wrapper">
        ${this._overlayFrameTemplate()} ${this._arrowNodeTemplate()}
      </div>
    `}_overlayFrameTemplate(){return t`
      <div class="calendar__overlay-frame">
        <div class="calendar-overlay">
          <div class="calendar-overlay__header">
            <h1 class="calendar-overlay__heading">${this.calendarHeading}</h1>
            <button
              @click="${()=>this._overlayCtrl.hide()}"
              id="close-button"
              title="${this.msgLit("lion-input-datepicker:close")}"
              aria-label="${this.msgLit("lion-input-datepicker:close")}"
              class="calendar-overlay__close-button"
            >
              <slot name="close-icon">&times;</slot>
            </button>
          </div>
          <div>${this._calendarTemplate()}</div>
        </div>
      </div>
    `}render(){return t`
      <div class="form-field__group-one">${this._groupOneTemplate()}</div>
      <div class="form-field__group-two">
        ${this._groupTwoTemplate()} ${this._overlayTemplate()}
      </div>
    `}_calendarTemplate(){return t`
      <lion-calendar
        slot="content"
        .selectedDate="${this.constructor.__getSyncDownValue(this.modelValue)}"
        .minDate="${this.__calendarMinDate}"
        .maxDate="${this.__calendarMaxDate}"
        .disableDates="${r(this.__calendarDisableDates)}"
        @user-selected-date-changed="${this._onCalendarUserSelectedChanged}"
      ></lion-calendar>
    `}_invokerTemplate(){return t`
      <button
        type="button"
        @click="${this.__openCalendarOverlay}"
        id="${this.__invokerId}"
        aria-label="${this.msgLit("lion-input-datepicker:openDatepickerLabel")}"
        title="${this.msgLit("lion-input-datepicker:openDatepickerLabel")}"
      >
        ${this._invokerIconTemplate()}
      </button>
    `}_invokerIconTemplate(){return t`📅`}_setupOverlayCtrl(){super._setupOverlayCtrl(),this.__datepickerBeforeShow=()=>{this._overlayCtrl.updateConfig(this._defineOverlayConfig())},this._overlayCtrl.addEventListener("before-show",this.__datepickerBeforeShow)}_defineOverlayConfig(){return window.innerWidth>=600?(this.hasArrow=!0,{...n(),hidesOnOutsideClick:!0,visibilityTriggerFunction:void 0,...super._defineOverlayConfig(),popperConfig:{...super._defineOverlayConfig().popperConfig,placement:"bottom"}}):(this.hasArrow=!1,i())}async __openCalendarOverlay(){await this._overlayCtrl.show(),await Promise.all([this._overlayCtrl.contentNode.updateComplete,this._calendarNode.updateComplete]),this._onCalendarOverlayOpened()}_onCalendarOverlayOpened(){this._focusCentralDateOnCalendarOpen&&this._calendarNode.initCentralDate()}_onCalendarUserSelectedChanged({target:{selectedDate:e}}){this._hideOnUserSelect&&this._overlayCtrl.hide(),this._syncOnUserSelect&&(this._isHandlingUserInput=!0,this._isHandlingCalendarUserInput=!0,Array.isArray(this.__calendarDisableDates)&&this.__calendarDisableDates.includes(e)?this.modelValue=void 0:this.modelValue=e,this._isHandlingUserInput=!1,this._isHandlingCalendarUserInput=!1)}_reflectBackOn(){return super._reflectBackOn()||this._isHandlingCalendarUserInput}static __getSyncDownValue(e){return(new m).execute(e)?void 0:e}__syncDisabledDates(e){e.forEach(e=>{const t=e.constructor;"MinDate"===t.validatorName&&"error"===e.type?this.__calendarMinDate=e.param:"MaxDate"===t.validatorName&&"error"===e.type?this.__calendarMaxDate=e.param:"MinMaxDate"===t.validatorName&&"error"===e.type?(this.__calendarMinDate=e.param.min,this.__calendarMaxDate=e.param.max):"IsDateDisabled"===t.validatorName&&"error"===e.type&&(this.__calendarDisableDates=e.param)})}_onValidatorUpdated(e,t){super._onValidatorUpdated(e,t),"param-changed"===e.type&&this.__syncDisabledDates([t.validator])}get _overlayInvokerNode(){return this._invokerNode}get _overlayContentNode(){return this._cachedOverlayContentNode||(this._cachedOverlayContentNode=this.shadowRoot.querySelector(".calendar__overlay-frame")),this._cachedOverlayContentNode}}customElements.define("lion-input-datepicker",h);
