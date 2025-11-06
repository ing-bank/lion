import{a as e,x as t}from"./b4be29f1.js";import{L as s}from"./4cc99b59.js";import{a as r}from"./88185952.js";import{L as i}from"./c2aef983.js";import{S as a}from"./de5cbd7c.js";const n=e=>{switch(e){case"bg-BG":return import("./b3088fec.js");case"bg":return import("./f2b938ae.js");case"cs-CZ":return import("./0eb1be15.js");case"cs":return import("./2061ab53.js");case"de-DE":return import("./08753a42.js");case"de":return import("./47c6706b.js");case"en-AU":return import("./797b68bf.js");case"en-GB":return import("./ac84c5cf.js");case"en-US":return import("./65b542ca.js");case"en-PH":case"en":default:return import("./50e40ffb.js");case"es-ES":return import("./53665d79.js");case"es":return import("./fbcf7707.js");case"fr-FR":return import("./380904c5.js");case"fr-BE":return import("./582b6c24.js");case"fr":return import("./e9ab6a1c.js");case"hu-HU":return import("./6a8d6570.js");case"hu":return import("./f758702d.js");case"it-IT":return import("./b3b2b0a7.js");case"it":return import("./bf82a552.js");case"nl-BE":return import("./356590b9.js");case"nl-NL":return import("./c49bce75.js");case"nl":return import("./db94143f.js");case"pl-PL":return import("./6f0288cc.js");case"pl":return import("./99e5c418.js");case"ro-RO":return import("./74ca6831.js");case"ro":return import("./91ad6ca2.js");case"ru-RU":return import("./e8f7a35e.js");case"ru":return import("./a6fa3f97.js");case"sk-SK":return import("./3479a707.js");case"sk":return import("./7154e41e.js");case"uk-UA":return import("./0fdb84c7.js");case"uk":return import("./d22b1bd7.js");case"zh-CN":case"zh":return import("./0b9abd12.js")}};class p extends(s(i)){static get properties(){return{min:{type:Number,reflect:!0},max:{type:Number,reflect:!0},unit:{type:String,reflect:!0},step:{type:Number,reflect:!0},noMinMaxLabels:{type:Boolean,attribute:"no-min-max-labels"}}}static localizeNamespaces=[{"lion-input-range":n},...super.localizeNamespaces];static scopedStyles(t){return e`
      /* Custom input range styling comes here, be aware that this won't work for polyfilled browsers */
      .${t} .form-control {
        width: 100%;
        box-shadow: none;
        outline: none;
      }
    `}static get styles(){return[super.styles,e`
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
      `]}get _inputNode(){return super._inputNode}constructor(){super(),this.scopedStylesController=new a(this),this.min=1/0,this.max=1/0,this.step=1,this.unit="",this.type="range",this.noMinMaxLabels=!1,this.parser=e=>parseFloat(e)}updated(e){super.updated(e),e.has("min")&&(this._inputNode.min=`${this.min}`),e.has("max")&&(this._inputNode.max=`${this.max}`),e.has("step")&&(this._inputNode.step=`${this.step}`)}firstUpdated(e){super.firstUpdated(e),e.has("modelValue")&&this.updateComplete.then(()=>{this._inputNode.value=`${this.modelValue}`})}_inputGroupTemplate(){return t`
      <div>
        <span class="input-range__value"
          >${r(parseFloat(this.formattedValue))}</span
        >
        <span class="input-range__unit">${this.unit}</span>
      </div>
      <div class="input-group">
        ${this._inputGroupBeforeTemplate()}
        <div class="input-group__container">
          ${this._inputGroupPrefixTemplate()} ${this._inputGroupInputTemplate()}
          ${this._inputGroupSuffixTemplate()}
        </div>
        ${this._inputGroupAfterTemplate()}
      </div>
    `}_inputGroupInputTemplate(){return t`
      <div class="input-group__input">
        <slot name="input"></slot>
        ${this.noMinMaxLabels?"":t`
              <div class="input-range__limits">
                <div>
                  <span class="sr-only">${this.msgLit("lion-input-range:minimum")} </span
                  >${r(this.min)}
                </div>
                <div>
                  <span class="sr-only">${this.msgLit("lion-input-range:maximum")} </span
                  >${r(this.max)}
                </div>
              </div>
            `}
      </div>
    `}}customElements.define("lion-input-range",p);
