const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.D5IFK1jp.js","_astro/MdJsPreview.B62up6PK.js","_astro/lit-element.DxRhnkit.js","_astro/lit-html.BX7rm8u-.js","_astro/dedupeMixin.6XPTJgK8.js","_astro/lit-element.BOikny4r.js","_astro/uuid.DjYKNjre.js","_astro/define.DBgp7shK.js"])))=>i.map(i=>d[i]);
import{_ as r}from"./preload-helper.CVfkMyKi.js";import"./MdJsPreview.B62up6PK.js";import{i as l,a as d}from"./lit-element.DxRhnkit.js";import{b as i}from"./lit-html.BX7rm8u-.js";import"./unsafe-html.FHlAasnX.js";import{L as n}from"./LionField.t9ujElQD.js";import{L as a}from"./InteractionStateMixin.Bm8PsvKl.js";import"./h-output.DYA3MJne.js";customElements.define("lion-field",n);customElements.define("lion-validation-feedback",a);class u extends l{static properties={value:String,reflect:!0};static styles=[d`
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
    `];constructor(){super(),this.value="0",this.addEventListener("click",e=>{this.value=`${Math.round((e.clientX-this.getClientRects()[0].x)/this.offsetWidth*5)}`,this.dispatchEvent(new Event("dummy-slider-changed",{bubbles:!0}))})}connectedCallback(){super.connectedCallback(),this.setAttribute("tabindex",0)}render(){return i` <div part="rail">
      <span part="thumb" style="left:${Number(this.value)*20}%;">${this.value}</span>
    </div>`}}customElements.get("dummy-slider")||customElements.define("dummy-slider",u);const m=()=>i`<dummy-slider></dummy-slider>`,c=()=>{class t extends n{get slots(){return{...super.slots,input:()=>document.createElement("dummy-slider")}}constructor(){super(),this.addEventListener("dummy-slider-changed",s=>{s.stopPropagation(),this.dispatchEvent(new Event("user-input-changed"))})}get value(){return this._inputNode.value}set value(s){this._inputNode.value=s}}return customElements.define("slider-field",t),i`<slider-field
      label="SliderField"
      help-text="Press to see how modelValue is synchronized"
    ></slider-field>
    <h-output .show="${["modelValue","touched","dirty","focused"]}"></h-output>`},p=document,h=[{key:"createAnInteractiveElement",story:m},{key:"createAField",story:c}];let o=!1;for(const t of h){const e=p.querySelector(`[mdjs-story-name="${t.key}"]`);e&&(e.story=t.story,e.key=t.key,o=!0,Object.assign(e,{simulatorUrl:"/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}o&&(customElements.get("mdjs-preview")||r(()=>import("./define.D5IFK1jp.js"),__vite__mapDeps([0,1,2,3,4,5,6])),customElements.get("mdjs-story")||r(()=>import("./define.DBgp7shK.js"),__vite__mapDeps([7,2,3])));export{c as createAField,m as createAnInteractiveElement};
