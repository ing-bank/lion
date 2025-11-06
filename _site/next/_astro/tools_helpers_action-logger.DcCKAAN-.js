const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.DYUong5B.js","_astro/node-tools_providence-analytics_overview.LFFQBZzG.js","_astro/lit-element.qDHKJJma.js","_astro/lit-html.C7L4dwLU.js","_astro/unsafe-html.J0GGe2Q7.js","_astro/directive.CGE4aKEl.js","_astro/define.m2CvvXyF.js"])))=>i.map(i=>d[i]);
import{_ as r}from"./preload-helper.4zY6-HO4.js";import"./node-tools_providence-analytics_overview.LFFQBZzG.js";import"./lit-element.qDHKJJma.js";import{x as e}from"./lit-html.C7L4dwLU.js";import"./unsafe-html.J0GGe2Q7.js";import"./sb-action-logger.2lH_jUdd.js";import"./directive.CGE4aKEl.js";const n=()=>{const t=Math.random().toString(36).substr(2,10);return e`
    <p>To log: <code>Hello, World!</code></p>
    <button
      @click=${o=>{o.target.parentElement.querySelector(`#logger-${t}`).log("Hello, World!")}}
    >
      Click this button
    </button>
    <p>Or to log: <code>What's up, Planet!</code></p>
    <button
      @click=${o=>{o.target.parentElement.querySelector(`#logger-${t}`).log("What's up, Planet!")}}
    >
      Click this button
    </button>
    <sb-action-logger id="logger-${t}"></sb-action-logger>
  `},i=()=>{const t=Math.random().toString(36).substr(2,10);return e`
    <div>To log: <code>Hello, World!</code></div>
    <button
      @click=${o=>{o.target.parentElement.querySelector(`#logger-${t}`).log("Hello, World!")}}
    >
      Click this button
    </button>
    <div>Or to log: <code>What's up, Planet!</code></div>
    <button
      @click=${o=>{o.target.parentElement.querySelector(`#logger-${t}`).log("What's up, Planet!")}}
    >
      Click this button
    </button>
    <sb-action-logger simple id="logger-${t}"></sb-action-logger>
  `},s=()=>{const t=Math.random().toString(36).substr(2,10);return e`
    <button
      @click="${o=>o.target.parentElement.querySelector(`#logger-${t}`).log("Hello, World!")}"
    >
      Log
    </button>
    <sb-action-logger id="logger-${t}" .title="${"Hello World"}"></sb-action-logger>
  `},g=document,c=[{key:"main",story:n},{key:"simpleMode",story:i},{key:"customTitle",story:s}];let l=!1;for(const t of c){const o=g.querySelector(`[mdjs-story-name="${t.key}"]`);o&&(o.story=t.story,o.key=t.key,l=!0,Object.assign(o,{simulatorUrl:"/next/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}l&&(customElements.get("mdjs-preview")||r(()=>import("./define.DYUong5B.js"),__vite__mapDeps([0,1,2,3,4,5])),customElements.get("mdjs-story")||r(()=>import("./define.m2CvvXyF.js"),__vite__mapDeps([6,2,3])));export{s as customTitle,n as main,i as simpleMode};
