import{a as t,E as e,B as s,x as i}from"./b8bc2eda.js";import{L as r}from"./c48d90f3.js";import{a as n}from"./6e65f685.js";import{p as a}from"./e3918630.js";import{L as u}from"./45058e5d.js";import{I as o,M as p,a as l}from"./e49751c9.js";const m=t=>{switch(t){case"bg-BG":return import("./04f30997.js");case"bg":return import("./6235db97.js");case"cs-CZ":return import("./1d59bfce.js");case"cs":return import("./2e4764dc.js");case"de-DE":return import("./18605fbf.js");case"de":return import("./d1c8595f.js");case"en-AU":return import("./cede122e.js");case"en-GB":return import("./ea4df694.js");case"en-US":return import("./0258b0cb.js");case"en-PH":case"en":default:return import("./6db5438e.js");case"es-ES":return import("./738d447f.js");case"es":return import("./97b4a8c3.js");case"fr-FR":return import("./404d49ac.js");case"fr-BE":return import("./40303f26.js");case"fr":return import("./e0d16881.js");case"hu-HU":return import("./767edef4.js");case"hu":return import("./d2f71cfa.js");case"it-IT":return import("./8691d9f6.js");case"it":return import("./4c3a3b1d.js");case"nl-BE":return import("./86671272.js");case"nl-NL":return import("./3aa82e42.js");case"nl":return import("./9a4d1d19.js");case"pl-PL":return import("./790b2eba.js");case"pl":return import("./5361a76e.js");case"ro-RO":return import("./4df10c92.js");case"ro":return import("./dc4fa018.js");case"ru-RU":return import("./b2eb09d7.js");case"ru":return import("./86b2846f.js");case"sk-SK":return import("./423915fa.js");case"sk":return import("./98c5c160.js");case"uk-UA":return import("./ce5a67a2.js");case"uk":return import("./fb42cefe.js");case"zh-CN":case"zh":return import("./75ada08d.js")}};class c extends(r(u)){static get styles(){return[...super.styles,t`
        .input-group__container > .input-group__input ::slotted(.form-control) {
          text-align: center;
        }

        .input-stepper__value {
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
      `]}static get properties(){return{min:{type:Number,reflect:!0},max:{type:Number,reflect:!0},valueTextMapping:{type:Object},step:{type:Number,reflect:!0}}}static localizeNamespaces=[{"lion-input-stepper":m},...super.localizeNamespaces];get currentValue(){return this.modelValue||0}get _inputNode(){return super._inputNode}constructor(){super(),this.parser=a,this.formatter=n,this.min=1/0,this.max=1/0,this.valueTextMapping={},this.step=1,this.values={max:this.max,min:this.min,step:this.step},this._increment=this._increment.bind(this),this._decrement=this._decrement.bind(this)}connectedCallback(){super.connectedCallback(),this.values={max:this.max,min:this.min,step:this.step},this._inputNode&&(this._inputNode.role="spinbutton",this._inputNode.setAttribute("inputmode","decimal"),this._inputNode.setAttribute("autocomplete","off")),this.addEventListener("keydown",this.__keyDownHandler),this.__setDefaultValidators(),this.__toggleSpinnerButtonsState()}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("keydown",this.__keyDownHandler)}updated(t){super.updated(t),t.has("modelValue")&&this.__toggleSpinnerButtonsState(),t.has("min")&&(this._inputNode.min=`${this.min}`,this.values.min=this.min,this.min!==1/0?this._inputNode.setAttribute("aria-valuemin",`${this.min}`):this._inputNode.removeAttribute("aria-valuemin"),this.__toggleSpinnerButtonsState()),t.has("max")&&(this._inputNode.max=`${this.max}`,this.values.max=this.max,this.max!==1/0?this._inputNode.setAttribute("aria-valuemax",`${this.max}`):this._inputNode.removeAttribute("aria-valuemax"),this.__toggleSpinnerButtonsState()),t.has("valueTextMapping")&&this._updateAriaAttributes(),t.has("step")&&(this._inputNode.step=`${this.step}`,this.values.step=this.step)}get slots(){return{...super.slots,prefix:()=>this.__getDecrementButtonNode(),suffix:()=>this.__getIncrementButtonNode()}}__setDefaultValidators(){const t=[new o,this.min!==1/0?new p(this.min):null,this.max!==1/0?new l(this.max):null].filter(t=>null!==t);this.defaultValidators.push(...t)}__keyDownHandler(t){"ArrowUp"===t.key&&this._increment(),"ArrowDown"===t.key&&this._decrement()}__toggleSpinnerButtonsState(){const{min:t,max:e}=this.values,s=this.__getSlot("prefix"),i=this.__getSlot("suffix"),r=this.currentValue>=e&&e!==1/0,n=this.currentValue<=t&&t!==1/0;(n&&s===document.activeElement||r&&i===document.activeElement)&&this._inputNode.focus(),s[n?"setAttribute":"removeAttribute"]("disabled","true"),i[r?"setAttribute":"removeAttribute"]("disabled","true"),this._updateAriaAttributes()}_updateAriaAttributes(){const t=this._inputNode.value;t?(this._inputNode.setAttribute("aria-valuenow",`${t}`),0!==Object.keys(this.valueTextMapping).length&&Object.keys(this.valueTextMapping).find(t=>Number(t)===this.currentValue)?this.__valueText=this.valueTextMapping[this.currentValue]:this.__valueText=t,this._inputNode.setAttribute("aria-valuetext",`${this.__valueText}`)):(this._inputNode.removeAttribute("aria-valuenow"),this._inputNode.removeAttribute("aria-valuetext")),this._destroyOutputContent()}_destroyOutputContent(){const t=this.shadowRoot?.querySelector(".input-stepper__value"),s=t?.dataset?.selfDestruct?Number(t.dataset.selfDestruct):2e3;clearTimeout(this.timer),t&&(this.timer=setTimeout(()=>{t.parentNode&&(this.__valueText=e,this.requestUpdate())},s))}__getSlot(t){return Array.from(this.children).find(e=>e.slot===t)||{}}_increment(){const{step:t,min:e,max:s}=this.values,i=e!==1/0?e:0;let r;const n=(this.currentValue-i)%t;r=Math.abs(n)<1e-10||Math.abs(n-t)<1e-10?this.currentValue+t:Math.ceil((this.currentValue-i)/t)*t+i,(r<=s||s===1/0)&&(this.modelValue=r<e&&e!==1/0?`${e}`:`${r}`,this.__toggleSpinnerButtonsState(),this._proxyInputEvent())}_decrement(){const{step:t,max:e,min:s}=this.values,i=s!==1/0?s:0;let r;const n=(this.currentValue-i)%t;r=Math.abs(n)<1e-10||Math.abs(n-t)<1e-10?this.currentValue-t:Math.floor((this.currentValue-i)/t)*t+i,(r>=s||s===1/0)&&(this.modelValue=r>e&&e!==1/0?`${e}`:`${r}`,this.__toggleSpinnerButtonsState(),this._proxyInputEvent())}__getIncrementButtonNode(){const t=document.createElement("div");return s(this._incrementorTemplate(),t,{scopeName:this.localName,eventContext:this}),t.firstElementChild}__getDecrementButtonNode(){const t=document.createElement("div");return s(this._decrementorTemplate(),t,{scopeName:this.localName,eventContext:this}),t.firstElementChild}_onChange(){super._onChange(),this.__toggleSpinnerButtonsState()}_decrementorSignTemplate(){return"－"}_incrementorSignTemplate(){return"＋"}_decrementorTemplate(){return i`
      <button
        ?disabled=${this.disabled||this.readOnly}
        @click=${this._decrement}
        type="button"
        aria-label="${this.msgLit("lion-input-stepper:decrease")} ${this.fieldName}"
      >
        ${this._decrementorSignTemplate()}
      </button>
    `}_incrementorTemplate(){return i`
      <button
        ?disabled=${this.disabled||this.readOnly}
        @click=${this._increment}
        type="button"
        aria-label="${this.msgLit("lion-input-stepper:increase")} ${this.fieldName}"
      >
        ${this._incrementorSignTemplate()}
      </button>
    `}_inputGroupTemplate(){return i`
      <output for="${this._inputId}" data-self-destruct="2000" class="input-stepper__value"
        >${this.__valueText}</output
      >
      <div class="input-group">
        ${this._inputGroupBeforeTemplate()}
        <div class="input-group__container">
          ${this._inputGroupPrefixTemplate()} ${this._inputGroupInputTemplate()}
          ${this._inputGroupSuffixTemplate()}
        </div>
        ${this._inputGroupAfterTemplate()}
      </div>
    `}}customElements.define("lion-input-stepper",c);
