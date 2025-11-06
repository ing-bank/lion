const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.DYUong5B.js","_astro/node-tools_providence-analytics_overview.LFFQBZzG.js","_astro/lit-element.qDHKJJma.js","_astro/lit-html.C7L4dwLU.js","_astro/unsafe-html.J0GGe2Q7.js","_astro/directive.CGE4aKEl.js","_astro/define.m2CvvXyF.js"])))=>i.map(i=>d[i]);
import{_ as s}from"./preload-helper.4zY6-HO4.js";import"./node-tools_providence-analytics_overview.LFFQBZzG.js";import{a as o}from"./lit-element.qDHKJJma.js";import{x as t}from"./lit-html.C7L4dwLU.js";import"./unsafe-html.J0GGe2Q7.js";import{L as i}from"./progress-indicator_overview.D6hkGBUx.js";import"./directive.CGE4aKEl.js";import"./LocalizeMixin.VYu75dkK.js";import"./directive-helpers.CLllgGgm.js";import"./async-directive.CHVe8p0E.js";import"./getLocalizeManager.W5d_ICRU.js";import"./index.BNCfcFQh.js";import"./lazifyInstantiation.CgYLRMC3.js";import"./dedupeMixin.6XPTJgK8.js";class a extends i{static get styles(){return[o`
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
      `]}_graphicTemplate(){return t`
      <svg class="progress__icon" viewBox="20 20 47 47">
        <circle class="progress__filled" cx="44" cy="44" r="20.2" />
      </svg>
    `}}customElements.define("my-indeterminate-progress-spinner",a);class m extends i{static get styles(){return[o`
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
      `]}_graphicTemplate(){return t` <div class="progress__filled" style="width: ${this._progressPercentage}%"></div> `}}customElements.define("my-determinate-progress-bar",m);const l=()=>{const e=document.getElementsByName("my-bar")[0];e.value=Math.floor(Math.random()*101)},d=()=>t`
  <my-determinate-progress-bar
    aria-label="Interest rate"
    name="my-bar"
    value="50"
  ></my-determinate-progress-bar>
  <button @click="${l}">Randomize Value</button>
`,p=()=>t`
  <my-indeterminate-progress-spinner></my-indeterminate-progress-spinner>
`,c=document,g=[{key:"progressBarDemo",story:d},{key:"main",story:p}];let n=!1;for(const e of g){const r=c.querySelector(`[mdjs-story-name="${e.key}"]`);r&&(r.story=e.story,r.key=e.key,n=!0,Object.assign(r,{simulatorUrl:"/next/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}n&&(customElements.get("mdjs-preview")||s(()=>import("./define.DYUong5B.js"),__vite__mapDeps([0,1,2,3,4,5])),customElements.get("mdjs-story")||s(()=>import("./define.m2CvvXyF.js"),__vite__mapDeps([6,2,3])));export{p as main,d as progressBarDemo};
