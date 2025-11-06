import"./24f95583.js";import{i as e,x as t,B as s}from"./b4be29f1.js";import"./05905ff1.js";import{L as o}from"./4cc99b59.js";import{l as a}from"./573dde6f.js";import"./19d2607c.js";import"./afb8834e.js";import"./d45984a3.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./dc2f5f5a.js";window.customElements.define("sb-locale-switcher",class extends e{static get properties(){return{showLocales:{type:Array,attribute:"show-locales"}}}constructor(){super(),this.showLocales=["en-GB","en-US","en-AU","nl-NL","nl-BE"]}callback(e){document.documentElement.lang=e}render(){return t`
      ${this.showLocales.map(e=>t`
          <button @click=${()=>this.callback(e)}>${e}</button>
        `)}
    `}});const n=()=>{const e=document.createElement("div");let o="Loading...";function n(){o=a.msg("lit-html-example:body"),s(t`
        <p>${o}</p>
        <sb-locale-switcher></sb-locale-switcher>
      `,e)}return a.then(()=>{n()}),a.addEventListener("localeChanged",()=>{a.loadingComplete.then(()=>n())}),e},l=()=>{class s extends(o(e)){static get localizeNamespaces(){return[{"lit-html-example":e=>import(`../assets/translations/${e}.js`)},...super.localizeNamespaces]}render(){return t`
        <div aria-live="polite">
          <p>${a.msg("lit-html-example:body")}</p>
        </div>
      `}}return customElements.get("message-example")||customElements.define("message-example",s),t`
    <message-example></message-example>
    <sb-locale-switcher></sb-locale-switcher>
  `},m=document,r=[{key:"asFunction",story:n},{key:"webComponent",story:l}];let c=!1;for(const e of r){const t=m.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,c=!0,Object.assign(t,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}c&&(customElements.get("mdjs-preview")||import("./a7b4f51b.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{n as asFunction,l as webComponent};
