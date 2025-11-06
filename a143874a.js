import"./24f95583.js";import{i as e,a as t,x as s}from"./b4be29f1.js";import"./05905ff1.js";import{L as i}from"./f12ecf0e.js";import{L as r}from"./c6fab747.js";import"./74b104922.js";import"./dc2f5f5a.js";import"./d45984a3.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./4cc99b59.js";import"./19d2607c.js";import"./afb8834e.js";import"./143fde17.js";import"./bbaa6280.js";import"./bfba5e5f.js";import"./ec06148e.js";import"./4dc0ac82.js";customElements.define("lion-field",i),customElements.define("lion-validation-feedback",r);class o extends e{static properties={value:String,reflect:!0};static styles=[t`
      :host {
        display: block;
        padding-top: 16px;
        padding-bottom: 16px;
      }

      [part='rail'] {
        position: relative;
        display: block;
        background: #eee;
        height: 8px;
        border-radius: 8px;
      }

      [part='thumb'] {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        background: black;
        color: white;
        border-radius: 50%;
        height: 24px;
        width: 24px;
        top: 50%;
        transform: translateY(-50%) translateX(-50%);
        transition: left 0.5s ease 0s;
      }
    `];constructor(){super(),this.value="0",this.addEventListener("click",e=>{this.value=`${Math.round((e.clientX-this.getClientRects()[0].x)/this.offsetWidth*5)}`,this.dispatchEvent(new Event("dummy-slider-changed",{bubbles:!0}))})}connectedCallback(){super.connectedCallback(),this.setAttribute("tabindex",0)}render(){return s` <div part="rail">
      <span part="thumb" style="left:${20*Number(this.value)}%;">${this.value}</span>
    </div>`}}customElements.get("dummy-slider")||customElements.define("dummy-slider",o);const n=()=>s`<dummy-slider></dummy-slider>`,a=()=>(customElements.define("slider-field",class extends i{get slots(){return{...super.slots,input:()=>document.createElement("dummy-slider")}}constructor(){super(),this.addEventListener("dummy-slider-changed",e=>{e.stopPropagation(),this.dispatchEvent(new Event("user-input-changed"))})}get value(){return this._inputNode.value}set value(e){this._inputNode.value=e}}),s`<slider-field
      label="SliderField"
      help-text="Press to see how modelValue is synchronized"
    ></slider-field>
    <h-output .show="${["modelValue","touched","dirty","focused"]}"></h-output>`),d=document,l=[{key:"createAnInteractiveElement",story:n},{key:"createAField",story:a}];let m=!1;for(const e of l){const t=d.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,m=!0,Object.assign(t,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}m&&(customElements.get("mdjs-preview")||import("./a7b4f51b.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{a as createAField,n as createAnInteractiveElement};
