const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.DYUong5B.js","_astro/node-tools_providence-analytics_overview.LFFQBZzG.js","_astro/lit-element.qDHKJJma.js","_astro/lit-html.C7L4dwLU.js","_astro/unsafe-html.J0GGe2Q7.js","_astro/directive.CGE4aKEl.js","_astro/define.m2CvvXyF.js"])))=>i.map(i=>d[i]);
import{_ as b}from"./preload-helper.4zY6-HO4.js";import"./node-tools_providence-analytics_overview.LFFQBZzG.js";import{i as p}from"./lit-element.qDHKJJma.js";import{x as o}from"./lit-html.C7L4dwLU.js";import"./unsafe-html.J0GGe2Q7.js";import"./lion-tabs.DPovUsAN.js";import"./directive.CGE4aKEl.js";import"./LionTabs.gh122RxP.js";const u=()=>o`
  <lion-tabs .selectedIndex="${1}">
    <button slot="tab">Info</button>
    <p slot="panel">Info page with lots of information about us.</p>
    <button slot="tab">Work</button>
    <p slot="panel">Work page that showcases our work.</p>
  </lion-tabs>
`,d=()=>o`
  <lion-tabs>
    <button slot="tab">Info</button>
    <button slot="tab">Work</button>
    <p slot="panel">Info page with lots of information about us.</p>
    <p slot="panel">Work page that showcases our work.</p>
  </lion-tabs>
`,c=()=>o`
  <lion-tabs>
    <button slot="tab">tab 1</button>
    <div slot="panel">panel 1</div>
    <button slot="tab" disabled>tab 2</button>
    <div slot="panel">panel 2</div>
    <button slot="tab" disabled>tab 3</button>
    <div slot="panel">panel 3</div>
    <button slot="tab">tab 4</button>
    <div slot="panel">panel 4</div>
    <button slot="tab">tab 5</button>
    <div slot="panel">panel 5</div>
    <button slot="tab" disabled>tab 6</button>
    <div slot="panel">panel 6</div>
  </lion-tabs>
`,m=()=>o`
  <lion-tabs>
    <button slot="tab">Movies</button>
    <button slot="tab">Work</button>
    <div slot="panel">
      <p>Find some more info about our favorite movies:</p>
      <lion-tabs>
        <button slot="tab">Info about Cars</button>
        <button slot="tab">Info about Toy Story</button>
        <p slot="panel">
          Cars is a 2006 American computer-animated comedy film produced by Pixar Animation Studios
          and released by Walt Disney Pictures.
        </p>
        <p slot="panel">
          The feature film directorial debut of John Lasseter, it was the first entirely
          computer-animated feature film, as well as the first feature film from Pixar.
        </p>
      </lion-tabs>
    </div>
    <p slot="panel">Work page that showcases our work.</p>
  </lion-tabs>
`,h=()=>{const e="demo-tabs-add-dynamically";return customElements.get(e)||customElements.define(e,class extends p{static get properties(){return{__collection:{type:Array}}}render(){return o`
            <h3>Append</h3>
            <lion-tabs id="appendTabs">
              <button slot="tab">tab 1</button>
              <p slot="panel">panel 1</p>
              <button slot="tab">tab 2</button>
              <p slot="panel">panel 2</p>
            </lion-tabs>
            <button @click="${this.__handleAppendClick}">Append</button>
            <hr />
            <h3>Push</h3>
            <lion-tabs id="pushTabs">
              <button slot="tab">tab 1</button>
              <p slot="panel">panel 1</p>
              <button slot="tab">tab 2</button>
              <p slot="panel">panel 2</p>
              ${this.__collection.map(t=>o`
                  <button slot="tab">${t.button}</button>
                  <p slot="panel">${t.panel}</p>
                `)}
            </lion-tabs>
            <button @click="${this.__handlePushClick}">Push</button>
          `}constructor(){super(),this.__collection=[]}__handleAppendClick(){const t=this.shadowRoot.querySelector("#appendTabs"),n=2,i=Math.floor(t.children.length/2);for(let s=i+1;s<i+n;s+=1){const a=document.createElement("button");a.setAttribute("slot","tab"),a.innerText=`tab ${s}`;const l=document.createElement("p");l.setAttribute("slot","panel"),l.innerText=`panel ${s}`,t.append(a),t.append(l)}}__handlePushClick(){const t=this.shadowRoot.querySelector("#pushTabs"),n=Math.floor(t.children.length/2)+1;this.__collection=[...this.__collection,{button:`tab ${n}`,panel:`panel ${n}`}]}}),o` <demo-tabs-add-dynamically></demo-tabs-add-dynamically> `},y=document,f=[{key:"selectedIndex",story:u},{key:"slotsOrder",story:d},{key:"tabsDisabled",story:c},{key:"nestedTabs",story:m},{key:"distributeNewElement",story:h}];let r=!1;for(const e of f){const t=y.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,r=!0,Object.assign(t,{simulatorUrl:"/next/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}r&&(customElements.get("mdjs-preview")||b(()=>import("./define.DYUong5B.js"),__vite__mapDeps([0,1,2,3,4,5])),customElements.get("mdjs-story")||b(()=>import("./define.m2CvvXyF.js"),__vite__mapDeps([6,2,3])));export{h as distributeNewElement,m as nestedTabs,u as selectedIndex,d as slotsOrder,c as tabsDisabled};
