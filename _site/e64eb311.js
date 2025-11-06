import"./24f95583.js";import{x as t,i as o}from"./b4be29f1.js";import"./05905ff1.js";import"./e55ba43c.js";import"./e39be54e.js";const e=()=>t`
  <lion-tabs .selectedIndex="${1}">
    <button slot="tab">Info</button>
    <p slot="panel">Info page with lots of information about us.</p>
    <button slot="tab">Work</button>
    <p slot="panel">Work page that showcases our work.</p>
  </lion-tabs>
`,n=()=>t`
  <lion-tabs>
    <button slot="tab">Info</button>
    <button slot="tab">Work</button>
    <p slot="panel">Info page with lots of information about us.</p>
    <p slot="panel">Work page that showcases our work.</p>
  </lion-tabs>
`,a=()=>t`
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
`,s=()=>t`
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
`,l=()=>{const e="demo-tabs-add-dynamically";return customElements.get(e)||customElements.define(e,class extends o{static get properties(){return{__collection:{type:Array}}}render(){return t`
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
              ${this.__collection.map(o=>t`
                  <button slot="tab">${o.button}</button>
                  <p slot="panel">${o.panel}</p>
                `)}
            </lion-tabs>
            <button @click="${this.__handlePushClick}">Push</button>
          `}constructor(){super(),this.__collection=[]}__handleAppendClick(){const t=this.shadowRoot.querySelector("#appendTabs"),o=Math.floor(t.children.length/2);for(let e=o+1;e<o+2;e+=1){const o=document.createElement("button");o.setAttribute("slot","tab"),o.innerText=`tab ${e}`;const n=document.createElement("p");n.setAttribute("slot","panel"),n.innerText=`panel ${e}`,t.append(o),t.append(n)}}__handlePushClick(){const t=this.shadowRoot.querySelector("#pushTabs"),o=Math.floor(t.children.length/2)+1;this.__collection=[...this.__collection,{button:`tab ${o}`,panel:`panel ${o}`}]}}),t` <demo-tabs-add-dynamically></demo-tabs-add-dynamically> `},b=document,i=[{key:"selectedIndex",story:e},{key:"slotsOrder",story:n},{key:"tabsDisabled",story:a},{key:"nestedTabs",story:s},{key:"distributeNewElement",story:l}];let p=!1;for(const t of i){const o=b.querySelector(`[mdjs-story-name="${t.key}"]`);o&&(o.story=t.story,o.key=t.key,p=!0,Object.assign(o,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}p&&(customElements.get("mdjs-preview")||import("./a7b4f51b.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{l as distributeNewElement,s as nestedTabs,e as selectedIndex,n as slotsOrder,a as tabsDisabled};
