import"./f1151d68.js";import{x as t}from"./b8bc2eda.js";import"./6638bb86.js";import"./c3bcd538.js";const e=()=>{const e=Math.random().toString(36).substr(2,10);return t`
    <p>To log: <code>Hello, World!</code></p>
    <button
      @click=${t=>{t.target.parentElement.querySelector(`#logger-${e}`).log("Hello, World!")}}
    >
      Click this button
    </button>
    <p>Or to log: <code>What's up, Planet!</code></p>
    <button
      @click=${t=>{t.target.parentElement.querySelector(`#logger-${e}`).log("What's up, Planet!")}}
    >
      Click this button
    </button>
    <sb-action-logger id="logger-${e}"></sb-action-logger>
  `},o=()=>{const e=Math.random().toString(36).substr(2,10);return t`
    <div>To log: <code>Hello, World!</code></div>
    <button
      @click=${t=>{t.target.parentElement.querySelector(`#logger-${e}`).log("Hello, World!")}}
    >
      Click this button
    </button>
    <div>Or to log: <code>What's up, Planet!</code></div>
    <button
      @click=${t=>{t.target.parentElement.querySelector(`#logger-${e}`).log("What's up, Planet!")}}
    >
      Click this button
    </button>
    <sb-action-logger simple id="logger-${e}"></sb-action-logger>
  `},r=()=>{const e=Math.random().toString(36).substr(2,10);return t`
    <button
      @click="${t=>t.target.parentElement.querySelector(`#logger-${e}`).log("Hello, World!")}"
    >
      Log
    </button>
    <sb-action-logger id="logger-${e}" .title="${"Hello World"}"></sb-action-logger>
  `},l=document,n=[{key:"main",story:e},{key:"simpleMode",story:o},{key:"customTitle",story:r}];let s=!1;for(const t of n){const e=l.querySelector(`[mdjs-story-name="${t.key}"]`);e&&(e.story=t.story,e.key=t.key,s=!0,Object.assign(e,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}s&&(customElements.get("mdjs-preview")||import("./e90784d0.js"),customElements.get("mdjs-story")||import("./0defd61d.js"));export{r as customTitle,e as main,o as simpleMode};
