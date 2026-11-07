const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.D5IFK1jp.js","_astro/MdJsPreview.B62up6PK.js","_astro/lit-element.DxRhnkit.js","_astro/lit-html.BX7rm8u-.js","_astro/dedupeMixin.6XPTJgK8.js","_astro/lit-element.BOikny4r.js","_astro/uuid.DjYKNjre.js","_astro/define.DBgp7shK.js"])))=>i.map(i=>d[i]);
import{_ as o}from"./preload-helper.CVfkMyKi.js";import"./MdJsPreview.B62up6PK.js";import"./lit-element.DxRhnkit.js";import{b as l}from"./lit-html.BX7rm8u-.js";import"./unsafe-html.FHlAasnX.js";import{i as a,a as s,b as n}from"./lit-element.BOikny4r.js";import{L as d}from"./LionTabs.bY7vD4BE.js";class i extends d{static get styles(){return[...super.styles,a`
        :host {
          background: #222;
          display: block;
          padding: 20px;
        }
      `]}connectedCallback(){super.connectedCallback(),this._setupFeature()}_setupFeature(){}}customElements.define("lea-tabs",i);class p extends s{static get styles(){return a`
      :host {
        box-shadow: -4px 0 0 rgba(0, 0, 0, 0.2);
        background: #ad1c1c;
        background: linear-gradient(220deg, transparent 10px, #ad1c1c 10px);
        text-shadow: 0 1px 0 rgba(0, 0, 0, 0.5);
        color: #fff;
        float: left;
        font:
          bold 12px/35px 'Lucida sans',
          Arial,
          Helvetica;
        height: 35px;
        padding: 0 30px;
        text-decoration: none;
      }

      :host(:hover) {
        background: #c93434;
        background: linear-gradient(220deg, transparent 10px, #c93434 10px);
      }

      :host(:focus) {
        border-radius: 4px;
        box-shadow:
          0 0 8px #9fcaea,
          0 0 0 1px #559bd1;

        /* outline: 0; */
      }

      :host([selected]) {
        background: #fff;
        background: linear-gradient(220deg, transparent 10px, #fff 10px);
        text-shadow: none;
        color: #333;
      }
    `}render(){return n`<slot></slot>`}}customElements.define("lea-tab",p);class c extends s{static get styles(){return a`
      :host {
        background-color: #fff;
        background-image: linear-gradient(top, #fff, #ddd);
        border-radius: 0 2px 2px 2px;
        box-shadow:
          0 2px 2px #000,
          0 -1px 0 #fff inset;
        padding: 30px;
      }
    `}render(){return n`
      <!-- dom as needed -->
      <slot></slot>
    `}}customElements.define("lea-tab-panel",c);const b=()=>l`
  <lea-tabs>
    <lea-tab slot="tab">Info</lea-tab>
    <lea-tab-panel slot="panel"> Info page with lots of information about us. </lea-tab-panel>
    <lea-tab slot="tab">Work</lea-tab>
    <lea-tab-panel slot="panel"> Work page that showcases our work. </lea-tab-panel>
  </lea-tabs>
`,m=document,u=[{key:"main",story:b}];let r=!1;for(const e of u){const t=m.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,r=!0,Object.assign(t,{simulatorUrl:"/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}r&&(customElements.get("mdjs-preview")||o(()=>import("./define.D5IFK1jp.js"),__vite__mapDeps([0,1,2,3,4,5,6])),customElements.get("mdjs-story")||o(()=>import("./define.DBgp7shK.js"),__vite__mapDeps([7,2,3])));export{b as main};
