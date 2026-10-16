const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.BdbiuFq9.js","_astro/MdJsPreview.3BOxlSHn.js","_astro/lit-element.jD9bOQKo.js","_astro/lit-html.DtZEZPQ5.js","_astro/lit-element.BdYmZD4s.js","_astro/define.DNIVKtom.js"])))=>i.map(i=>d[i]);
import{_ as t}from"./preload-helper.CVfkMyKi.js";import"./MdJsPreview.3BOxlSHn.js";import{i as o,a as s}from"./lit-element.jD9bOQKo.js";import{E as l,x as i}from"./lit-html.DtZEZPQ5.js";import"./unsafe-html.DgrA3nwU.js";import"./progress-indicator_overview.BNicFj29.js";import{L as u,g as _}from"./LocalizeMixin.Dif-q-Ka.js";class a extends u(o){static get properties(){return{value:{type:Number},min:{type:Number},max:{type:Number},_ariaLabel:{attribute:"aria-label",type:String},_ariaLabelledby:{attribute:"aria-labelledby",type:String}}}static get localizeNamespaces(){return[{"lion-progress-indicator":e=>{switch(e){case"bg-BG":case"bg":return t(()=>import("./bg.CTgz6wid.js"),[]);case"cs-CZ":case"cs":return t(()=>import("./cs.CGsKXg2V.js"),[]);case"de-DE":case"de":return t(()=>import("./de.CnWAWVv_.js"),[]);case"en-AU":case"en-GB":case"en-US":case"en-PH":case"en":return t(()=>import("./en.D0uhKXGc.js"),[]);case"es-ES":case"es":return t(()=>import("./es.x0fz8Ijl.js"),[]);case"fr-BE":case"fr-FR":case"fr":return t(()=>import("./fr.I31Sf1nS.js"),[]);case"hu-HU":case"hu":return t(()=>import("./hu.Dn_Uyt9z.js"),[]);case"it-IT":case"it":return t(()=>import("./it.CzZ5s44V.js"),[]);case"nl-BE":case"nl-NL":case"nl":return t(()=>import("./nl.BZQCBkk2.js"),[]);case"pl-PL":case"pl":return t(()=>import("./pl.BBnpJrZR.js"),[]);case"ro-RO":case"ro":return t(()=>import("./ro.DaCu7Acp.js"),[]);case"ru-RU":case"ru":return t(()=>import("./ru.CKI8RHV0.js"),[]);case"sk-SK":case"sk":return t(()=>import("./sk.CKI8RHV0.js"),[]);case"uk-UA":case"uk":return t(()=>import("./uk.T7WPitCr.js"),[]);case"zh-CN":case"zh":return t(()=>import("./zh.BPtCZl2J.js"),[]);default:return t(()=>import("./en.D0uhKXGc.js"),[])}}}]}get indeterminate(){return!this.hasAttribute("value")}static enabledWarnings=super.enabledWarnings?.filter(e=>e!=="change-in-update")||[];get _progressPercentage(){if(!this.indeterminate)return(this.value-this.min)/(this.max-this.min)*100}constructor(){super(),this.value=0,this.min=0,this.max=100,this._ariaLabel="",this._ariaLabelledby="",this.__hasDefaultLabelSet=!1}_graphicTemplate(){return l}render(){return this._graphicTemplate()}connectedCallback(){super.connectedCallback(),this.setAttribute("role","progressbar")}updated(e){super.updated(e),this.indeterminate?((e.has("_ariaLabel")||e.has("_ariaLabelledby"))&&this._setDefaultLabel(),e.has("value")&&(this._resetAriaValueAttributes(),this._setDefaultLabel())):(e.has("value")&&(!this.value&&this.value!==0||typeof this.value!="number"?this.removeAttribute("value"):this.value<this.min?(this.value=this.min,this.setAttribute("aria-valuenow",this.min.toString())):this.value>this.max?(this.value=this.max,this.setAttribute("aria-valuenow",this.max.toString())):this.setAttribute("aria-valuenow",this.value.toString()),this.__hasDefaultLabelSet===!0&&this.removeAttribute("aria-label")),e.has("min")&&(this.setAttribute("aria-valuemin",this.min.toString()),this.value<this.min&&(this.value=this.min)),e.has("max")&&(this.setAttribute("aria-valuemax",this.max.toString()),this.value>this.max&&(this.value=this.max)))}onLocaleUpdated(){super.onLocaleUpdated(),this.indeterminate&&this._setDefaultLabel()}_resetAriaValueAttributes(){this.removeAttribute("aria-valuenow"),this.removeAttribute("aria-valuemin"),this.removeAttribute("aria-valuemax")}_setDefaultLabel(){const e=_();this._ariaLabelledby?this.removeAttribute("aria-label"):this._ariaLabel||(this.setAttribute("aria-label",e.msg("lion-progress-indicator:loading")),this.__hasDefaultLabelSet=!0)}}class m extends a{static get styles(){return[s`
        .progress__icon {
          display: inline-block;
          width: 48px;
          height: 48px;
          animation: spinner-rotate 2s linear infinite;
        }

        .progress__filled {
          animation: spinner-dash 1.35s ease-in-out infinite;
          fill: none;
          stroke-width: 6px;
          stroke: var(--primary-color);
        }

        @keyframes spinner-rotate {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spinner-dash {
          0% {
            stroke-dasharray: 6, 122;
            stroke-dashoffset: 0;
          }
          50% {
            stroke-dasharray: 100, 28;
            stroke-dashoffset: -16;
          }
          100% {
            stroke-dasharray: 6, 122;
            stroke-dashoffset: -127;
          }
        }
      `]}_graphicTemplate(){return i`
      <svg class="progress__icon" viewBox="20 20 47 47">
        <circle class="progress__filled" cx="44" cy="44" r="20.2" />
      </svg>
    `}}customElements.define("my-indeterminate-progress-spinner",m);class c extends a{static get styles(){return[s`
        :host {
          display: block;
          position: relative;
          width: 100%;
          height: 6px;
          overflow: hidden;
          background-color: #eee;
        }

        .progress__filled {
          height: inherit;
          background-color: green;
        }
      `]}_graphicTemplate(){return i` <div class="progress__filled" style="width: ${this._progressPercentage}%"></div> `}}customElements.define("my-determinate-progress-bar",c);const h=()=>{const r=document.getElementsByName("my-bar")[0];r.value=Math.floor(Math.random()*101)},d=()=>i`
  <my-determinate-progress-bar
    aria-label="Interest rate"
    name="my-bar"
    value="50"
  ></my-determinate-progress-bar>
  <button @click="${h}">Randomize Value</button>
`,p=()=>i`
  <my-indeterminate-progress-spinner></my-indeterminate-progress-spinner>
`,b=document,g=[{key:"progressBarDemo",story:d},{key:"main",story:p}];let n=!1;for(const r of g){const e=b.querySelector(`[mdjs-story-name="${r.key}"]`);e&&(e.story=r.story,e.key=r.key,n=!0,Object.assign(e,{simulatorUrl:"/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}n&&(customElements.get("mdjs-preview")||t(()=>import("./define.BdbiuFq9.js"),__vite__mapDeps([0,1,2,3,4])),customElements.get("mdjs-story")||t(()=>import("./define.DNIVKtom.js"),__vite__mapDeps([5,2,3])));export{p as main,d as progressBarDemo};
