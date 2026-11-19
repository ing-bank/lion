const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.BWpRLYnc.js","_astro/MdJsPreview.CainKAmn.js","_astro/lit-element.B1EQMsFJ.js","_astro/lit-html.BX7rm8u-.js","_astro/dedupeMixin.6XPTJgK8.js","_astro/LionAccordion.CCw3hAmZ.js","_astro/lit-element.BOikny4r.js","_astro/uuid.DjYKNjre.js","_astro/define.BPRa0k46.js"])))=>i.map(i=>d[i]);
import{_ as r}from"./preload-helper.DOA02mLT.js";import{_ as i}from"./dynamic-import-helper.BheWnx7M.js";import"./MdJsPreview.CainKAmn.js";import{i as m}from"./lit-element.B1EQMsFJ.js";import{b as a,D as c}from"./lit-html.BX7rm8u-.js";import"./node-tools_providence-analytics_overview.BQH7j7jT.js";import{L as p}from"./LocalizeMixin.Cvshks-q.js";import{l as s}from"./singleton.Bku2u1LL.js";import{a as d,b as n}from"./lit-element.BOikny4r.js";class u extends d{static get properties(){return{showLocales:{type:Array,attribute:"show-locales"}}}constructor(){super(),this.showLocales=["en-GB","en-US","en-AU","nl-NL","nl-BE"]}callback(e){document.documentElement.lang=e}render(){return n`
      ${this.showLocales.map(e=>n`
          <button @click=${()=>this.callback(e)}>${e}</button>
        `)}
    `}}window.customElements.define("sb-locale-switcher",u);const g=()=>{const t=document.createElement("div");let e="Loading...";function o(){e=s.msg("lit-html-example:body"),c(a`
        <p>${e}</p>
        <sb-locale-switcher></sb-locale-switcher>
      `,t)}return s.then(()=>{o()}),s.addEventListener("localeChanged",()=>{s.loadingComplete.then(()=>o())}),t},y=()=>{class t extends p(m){static get localizeNamespaces(){return[{"lit-html-example":o=>i(Object.assign({}),`./assets/${o}.js`,3)},...super.localizeNamespaces]}render(){return a`
        <div aria-live="polite">
          <p>${s.msg("lit-html-example:body")}</p>
        </div>
      `}}return customElements.get("message-example")||customElements.define("message-example",t),a`
    <message-example></message-example>
    <sb-locale-switcher></sb-locale-switcher>
  `},b=document,h=[{key:"asFunction",story:g},{key:"webComponent",story:y}];let l=!1;for(const t of h){const e=b.querySelector(`[mdjs-story-name="${t.key}"]`);e&&(e.story=t.story,e.key=t.key,l=!0,Object.assign(e,{simulatorUrl:"/next-preview/feat-lion-playground-rebased/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}l&&(customElements.get("mdjs-preview")||r(()=>import("./define.BWpRLYnc.js"),__vite__mapDeps([0,1,2,3,4,5,6,7])),customElements.get("mdjs-story")||r(()=>import("./define.BPRa0k46.js"),__vite__mapDeps([8,2,3])));export{g as asFunction,y as webComponent};
