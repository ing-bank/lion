import"./24f95583.js";import{a as e,i as t,x as a}from"./b4be29f1.js";import"./05905ff1.js";import{L as s}from"./e39be54e.js";customElements.define("lea-tabs",class extends s{static get styles(){return[...super.styles,e`
        :host {
          background: #222;
          display: block;
          padding: 20px;
        }
      `]}connectedCallback(){super.connectedCallback(),this._setupFeature()}_setupFeature(){}});customElements.define("lea-tab",class extends t{static get styles(){return e`
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
    `}render(){return a`<slot></slot>`}});customElements.define("lea-tab-panel",class extends t{static get styles(){return e`
      :host {
        background-color: #fff;
        background-image: linear-gradient(top, #fff, #ddd);
        border-radius: 0 2px 2px 2px;
        box-shadow:
          0 2px 2px #000,
          0 -1px 0 #fff inset;
        padding: 30px;
      }
    `}render(){return a`
      <!-- dom as needed -->
      <slot></slot>
    `}});const o=()=>a`
  <lea-tabs>
    <lea-tab slot="tab">Info</lea-tab>
    <lea-tab-panel slot="panel"> Info page with lots of information about us. </lea-tab-panel>
    <lea-tab slot="tab">Work</lea-tab>
    <lea-tab-panel slot="panel"> Work page that showcases our work. </lea-tab-panel>
  </lea-tabs>
`,n=document,r=[{key:"main",story:o}];let l=!1;for(const e of r){const t=n.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,l=!0,Object.assign(t,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}l&&(customElements.get("mdjs-preview")||import("./a7b4f51b.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{o as main};
