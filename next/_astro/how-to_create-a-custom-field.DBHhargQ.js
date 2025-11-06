const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.DYUong5B.js","_astro/node-tools_providence-analytics_overview.LFFQBZzG.js","_astro/lit-element.qDHKJJma.js","_astro/lit-html.C7L4dwLU.js","_astro/unsafe-html.J0GGe2Q7.js","_astro/directive.CGE4aKEl.js","_astro/define.m2CvvXyF.js"])))=>i.map(i=>d[i]);
import{_ as r}from"./preload-helper.4zY6-HO4.js";import"./node-tools_providence-analytics_overview.LFFQBZzG.js";import{i as l,a as d}from"./lit-element.qDHKJJma.js";import{x as s}from"./lit-html.C7L4dwLU.js";import"./unsafe-html.J0GGe2Q7.js";import{L as o}from"./LionField.DGnPMihp.js";import{L as a}from"./InteractionStateMixin.BzvQ4Mf0.js";import"./h-output.CusfOtS0.js";import"./directive.CGE4aKEl.js";import"./dedupeMixin.6XPTJgK8.js";import"./LocalizeMixin.VYu75dkK.js";import"./directive-helpers.CLllgGgm.js";import"./async-directive.CHVe8p0E.js";import"./getLocalizeManager.W5d_ICRU.js";import"./index.BNCfcFQh.js";import"./lazifyInstantiation.CgYLRMC3.js";import"./DisabledMixin.Bm1nsErI.js";import"./LionFieldset.CalDwoQW.js";import"./FormGroupMixin.CQnfLXQx.js";import"./FormRegistrarMixin.YCZ6eayn.js";import"./Validator.DAOhFpDH.js";customElements.define("lion-field",o);customElements.define("lion-validation-feedback",a);class m extends l{static properties={value:String,reflect:!0};static styles=[d`
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
      <span part="thumb" style="left:${Number(this.value)*20}%;">${this.value}</span>
    </div>`}}customElements.get("dummy-slider")||customElements.define("dummy-slider",m);const u=()=>s`<dummy-slider></dummy-slider>`,p=()=>{class t extends o{get slots(){return{...super.slots,input:()=>document.createElement("dummy-slider")}}constructor(){super(),this.addEventListener("dummy-slider-changed",i=>{i.stopPropagation(),this.dispatchEvent(new Event("user-input-changed"))})}get value(){return this._inputNode.value}set value(i){this._inputNode.value=i}}return customElements.define("slider-field",t),s`<slider-field
      label="SliderField"
      help-text="Press to see how modelValue is synchronized"
    ></slider-field>
    <h-output .show="${["modelValue","touched","dirty","focused"]}"></h-output>`},c=document,h=[{key:"createAnInteractiveElement",story:u},{key:"createAField",story:p}];let n=!1;for(const t of h){const e=c.querySelector(`[mdjs-story-name="${t.key}"]`);e&&(e.story=t.story,e.key=t.key,n=!0,Object.assign(e,{simulatorUrl:"/next/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}n&&(customElements.get("mdjs-preview")||r(()=>import("./define.DYUong5B.js"),__vite__mapDeps([0,1,2,3,4,5])),customElements.get("mdjs-story")||r(()=>import("./define.m2CvvXyF.js"),__vite__mapDeps([6,2,3])));export{p as createAField,u as createAnInteractiveElement};
