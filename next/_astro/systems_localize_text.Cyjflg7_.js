const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.DYUong5B.js","_astro/node-tools_providence-analytics_overview.LFFQBZzG.js","_astro/lit-element.qDHKJJma.js","_astro/lit-html.C7L4dwLU.js","_astro/unsafe-html.J0GGe2Q7.js","_astro/directive.CGE4aKEl.js","_astro/define.m2CvvXyF.js"])))=>i.map(i=>d[i]);
import{_ as n}from"./preload-helper.4zY6-HO4.js";import{_ as m}from"./dynamic-import-helper.BheWnx7M.js";import"./node-tools_providence-analytics_overview.LFFQBZzG.js";import{i as a}from"./lit-element.qDHKJJma.js";import{x as o,B as l}from"./lit-html.C7L4dwLU.js";import"./unsafe-html.J0GGe2Q7.js";import{L as c}from"./LocalizeMixin.VYu75dkK.js";import{l as s}from"./singleton._qiOfd78.js";import"./directive.CGE4aKEl.js";import"./directive-helpers.CLllgGgm.js";import"./async-directive.CHVe8p0E.js";import"./getLocalizeManager.W5d_ICRU.js";import"./index.BNCfcFQh.js";import"./lazifyInstantiation.CgYLRMC3.js";import"./dedupeMixin.6XPTJgK8.js";class p extends a{static get properties(){return{showLocales:{type:Array,attribute:"show-locales"}}}constructor(){super(),this.showLocales=["en-GB","en-US","en-AU","nl-NL","nl-BE"]}callback(e){document.documentElement.lang=e}render(){return o`
      ${this.showLocales.map(e=>o`
          <button @click=${()=>this.callback(e)}>${e}</button>
        `)}
    `}}window.customElements.define("sb-locale-switcher",p);const d=()=>{const t=document.createElement("div");let e="Loading...";function r(){e=s.msg("lit-html-example:body"),l(o`
        <p>${e}</p>
        <sb-locale-switcher></sb-locale-switcher>
      `,t)}return s.then(()=>{r()}),s.addEventListener("localeChanged",()=>{s.loadingComplete.then(()=>r())}),t},u=()=>{class t extends c(a){static get localizeNamespaces(){return[{"lit-html-example":r=>m(Object.assign({}),`./assets/translations/${r}.js`,4)},...super.localizeNamespaces]}render(){return o`
        <div aria-live="polite">
          <p>${s.msg("lit-html-example:body")}</p>
        </div>
      `}}return customElements.get("message-example")||customElements.define("message-example",t),o`
    <message-example></message-example>
    <sb-locale-switcher></sb-locale-switcher>
  `},g=document,y=[{key:"asFunction",story:d},{key:"webComponent",story:u}];let i=!1;for(const t of y){const e=g.querySelector(`[mdjs-story-name="${t.key}"]`);e&&(e.story=t.story,e.key=t.key,i=!0,Object.assign(e,{simulatorUrl:"/next/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}i&&(customElements.get("mdjs-preview")||n(()=>import("./define.DYUong5B.js"),__vite__mapDeps([0,1,2,3,4,5])),customElements.get("mdjs-story")||n(()=>import("./define.m2CvvXyF.js"),__vite__mapDeps([6,2,3])));export{d as asFunction,u as webComponent};
