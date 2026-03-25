const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.DSVRgKCR.js","_astro/node-tools_providence-analytics_overview.BxIihMx7.js","_astro/lit-element.jD9bOQKo.js","_astro/lit-html.DtZEZPQ5.js","_astro/unsafe-html.DgrA3nwU.js","_astro/directive.BO6BEpVC.js","_astro/define.DNIVKtom.js"])))=>i.map(i=>d[i]);
import{_ as t}from"./preload-helper.Cj2JEybs.js";import"./node-tools_providence-analytics_overview.BxIihMx7.js";import{a as o}from"./lit-element.jD9bOQKo.js";import{x as s}from"./lit-html.DtZEZPQ5.js";import"./unsafe-html.DgrA3nwU.js";import{L as n}from"./progress-indicator_overview.ZiCoDHuM.js";class a extends n{static get styles(){return[o`
        .progress__icon {
          display: inline-block;
          width: 48px;
          height: 48px;
          animation: spinner-rotate 2s linear infinite;
        }

        .progress__filled {
          animation: spinner-dash 1.35s ease-in-out infinite;
          fill: none;
          stroke-width: 6px;
          stroke: var(--primary-color);
        }

        @keyframes spinner-rotate {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spinner-dash {
          0% {
            stroke-dasharray: 6, 122;
            stroke-dashoffset: 0;
          }
          50% {
            stroke-dasharray: 100, 28;
            stroke-dashoffset: -16;
          }
          100% {
            stroke-dasharray: 6, 122;
            stroke-dashoffset: -127;
          }
        }
      `]}_graphicTemplate(){return s`
      <svg class="progress__icon" viewBox="20 20 47 47">
        <circle class="progress__filled" cx="44" cy="44" r="20.2" />
      </svg>
    `}}customElements.define("my-indeterminate-progress-spinner",a);class m extends n{static get styles(){return[o`
        :host {
          display: block;
          position: relative;
          width: 100%;
          height: 6px;
          overflow: hidden;
          background-color: #eee;
        }

        .progress__filled {
          height: inherit;
          background-color: green;
        }
      `]}_graphicTemplate(){return s` <div class="progress__filled" style="width: ${this._progressPercentage}%"></div> `}}customElements.define("my-determinate-progress-bar",m);const l=()=>{const e=document.getElementsByName("my-bar")[0];e.value=Math.floor(Math.random()*101)},d=()=>s`
  <my-determinate-progress-bar
    aria-label="Interest rate"
    name="my-bar"
    value="50"
  ></my-determinate-progress-bar>
  <button @click="${l}">Randomize Value</button>
`,p=()=>s`
  <my-indeterminate-progress-spinner></my-indeterminate-progress-spinner>
`,c=document,g=[{key:"progressBarDemo",story:d},{key:"main",story:p}];let i=!1;for(const e of g){const r=c.querySelector(`[mdjs-story-name="${e.key}"]`);r&&(r.story=e.story,r.key=e.key,i=!0,Object.assign(r,{simulatorUrl:"/next/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}i&&(customElements.get("mdjs-preview")||t(()=>import("./define.DSVRgKCR.js"),__vite__mapDeps([0,1,2,3,4,5])),customElements.get("mdjs-story")||t(()=>import("./define.DNIVKtom.js"),__vite__mapDeps([6,2,3])));export{p as main,d as progressBarDemo};
