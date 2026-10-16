import"./f1151d68.js";import{i as e,x as t,B as s}from"./b8bc2eda.js";import"./6638bb86.js";import{L as o}from"./c48d90f3.js";import{l as a}from"./3077b96c.js";import"./be5f2fd3.js";import"./dcadf410.js";import"./7c882590.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./dc2f5f5a.js";window.customElements.define("sb-locale-switcher",class extends e{static get properties(){return{showLocales:{type:Array,attribute:"show-locales"}}}constructor(){super(),this.showLocales=["en-GB","en-US","en-AU","nl-NL","nl-BE"]}callback(e){document.documentElement.lang=e}render(){return t`
      ${this.showLocales.map(e=>t`
          <button @click=${()=>this.callback(e)}>${e}</button>
        `)}
    `}});const l=()=>{const e=document.createElement("div");let o="Loading...";function l(){o=a.msg("lit-html-example:body"),s(t`
        <p>${o}</p>
        <sb-locale-switcher></sb-locale-switcher>
      `,e)}return a.then(()=>{l()}),a.addEventListener("localeChanged",()=>{a.loadingComplete.then(()=>l())}),e},m=()=>{class s extends(o(e)){static get localizeNamespaces(){return[{"lit-html-example":e=>import(`../assets/${e}.js`)},...super.localizeNamespaces]}render(){return t`
        <div aria-live="polite">
          <p>${a.msg("lit-html-example:body")}</p>
        </div>
      `}}return customElements.get("message-example")||customElements.define("message-example",s),t`
    <message-example></message-example>
    <sb-locale-switcher></sb-locale-switcher>
  `},n=document,r=[{key:"asFunction",story:l},{key:"webComponent",story:m}];let c=!1;for(const e of r){const t=n.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,c=!0,Object.assign(t,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}c&&(customElements.get("mdjs-preview")||import("./e90784d0.js"),customElements.get("mdjs-story")||import("./0defd61d.js"));export{l as asFunction,m as webComponent};
