const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.DYUong5B.js","_astro/node-tools_providence-analytics_overview.LFFQBZzG.js","_astro/lit-element.qDHKJJma.js","_astro/lit-html.C7L4dwLU.js","_astro/unsafe-html.J0GGe2Q7.js","_astro/directive.CGE4aKEl.js","_astro/define.m2CvvXyF.js"])))=>i.map(i=>d[i]);
import{_ as s}from"./preload-helper.4zY6-HO4.js";import"./node-tools_providence-analytics_overview.LFFQBZzG.js";import{a,i as n}from"./lit-element.qDHKJJma.js";import{x as o}from"./lit-html.C7L4dwLU.js";import"./unsafe-html.J0GGe2Q7.js";import{L as l}from"./LionTabs.gh122RxP.js";import"./directive.CGE4aKEl.js";class d extends l{static get styles(){return[...super.styles,a`
        :host {
          background: #222;
          display: block;
          padding: 20px;
        }
      `]}connectedCallback(){super.connectedCallback(),this._setupFeature()}_setupFeature(){}}customElements.define("lea-tabs",d);class i extends n{static get styles(){return a`
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
    `}render(){return o`<slot></slot>`}}customElements.define("lea-tab",i);class p extends n{static get styles(){return a`
      :host {
        background-color: #fff;
        background-image: linear-gradient(top, #fff, #ddd);
        border-radius: 0 2px 2px 2px;
        box-shadow:
          0 2px 2px #000,
          0 -1px 0 #fff inset;
        padding: 30px;
      }
    `}render(){return o`
      <!-- dom as needed -->
      <slot></slot>
    `}}customElements.define("lea-tab-panel",p);const c=()=>o`
  <lea-tabs>
    <lea-tab slot="tab">Info</lea-tab>
    <lea-tab-panel slot="panel"> Info page with lots of information about us. </lea-tab-panel>
    <lea-tab slot="tab">Work</lea-tab>
    <lea-tab-panel slot="panel"> Work page that showcases our work. </lea-tab-panel>
  </lea-tabs>
`,b=document,m=[{key:"main",story:c}];let r=!1;for(const e of m){const t=b.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,r=!0,Object.assign(t,{simulatorUrl:"/next/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}r&&(customElements.get("mdjs-preview")||s(()=>import("./define.DYUong5B.js"),__vite__mapDeps([0,1,2,3,4,5])),customElements.get("mdjs-story")||s(()=>import("./define.m2CvvXyF.js"),__vite__mapDeps([6,2,3])));export{c as main};
