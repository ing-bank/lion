const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.DSVRgKCR.js","_astro/node-tools_providence-analytics_overview.BxIihMx7.js","_astro/lit-element.jD9bOQKo.js","_astro/lit-html.DtZEZPQ5.js","_astro/unsafe-html.DgrA3nwU.js","_astro/directive.BO6BEpVC.js","_astro/define.DNIVKtom.js"])))=>i.map(i=>d[i]);
import{_ as a}from"./preload-helper.Cj2JEybs.js";import{_ as m}from"./dynamic-import-helper.BheWnx7M.js";import"./node-tools_providence-analytics_overview.BxIihMx7.js";import{i as r}from"./lit-element.jD9bOQKo.js";import{x as o,B as i}from"./lit-html.DtZEZPQ5.js";import"./unsafe-html.DgrA3nwU.js";import{L as c}from"./LocalizeMixin.B0CXFYOi.js";import{l as s}from"./singleton.IE6IRoQK.js";class p extends r{static get properties(){return{showLocales:{type:Array,attribute:"show-locales"}}}constructor(){super(),this.showLocales=["en-GB","en-US","en-AU","nl-NL","nl-BE"]}callback(e){document.documentElement.lang=e}render(){return o`
      ${this.showLocales.map(e=>o`
          <button @click=${()=>this.callback(e)}>${e}</button>
        `)}
    `}}window.customElements.define("sb-locale-switcher",p);const d=()=>{const t=document.createElement("div");let e="Loading...";function n(){e=s.msg("lit-html-example:body"),i(o`
        <p>${e}</p>
        <sb-locale-switcher></sb-locale-switcher>
      `,t)}return s.then(()=>{n()}),s.addEventListener("localeChanged",()=>{s.loadingComplete.then(()=>n())}),t},u=()=>{class t extends c(r){static get localizeNamespaces(){return[{"lit-html-example":n=>m(Object.assign({}),`./assets/${n}.js`,3)},...super.localizeNamespaces]}render(){return o`
        <div aria-live="polite">
          <p>${s.msg("lit-html-example:body")}</p>
        </div>
      `}}return customElements.get("message-example")||customElements.define("message-example",t),o`
    <message-example></message-example>
    <sb-locale-switcher></sb-locale-switcher>
  `},g=document,y=[{key:"asFunction",story:d},{key:"webComponent",story:u}];let l=!1;for(const t of y){const e=g.querySelector(`[mdjs-story-name="${t.key}"]`);e&&(e.story=t.story,e.key=t.key,l=!0,Object.assign(e,{simulatorUrl:"/next/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}l&&(customElements.get("mdjs-preview")||a(()=>import("./define.DSVRgKCR.js"),__vite__mapDeps([0,1,2,3,4,5])),customElements.get("mdjs-story")||a(()=>import("./define.DNIVKtom.js"),__vite__mapDeps([6,2,3])));export{d as asFunction,u as webComponent};
