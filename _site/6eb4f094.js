import"./24f95583.js";import{a as e,x as s}from"./b4be29f1.js";import"./05905ff1.js";import{L as r}from"./a0b19cc8.js";import"./4cc99b59.js";import"./19d2607c.js";import"./afb8834e.js";import"./d45984a3.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./dc2f5f5a.js";customElements.define("my-indeterminate-progress-spinner",class extends r{static get styles(){return[e`
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
    `}});customElements.define("my-determinate-progress-bar",class extends r{static get styles(){return[e`
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
      `]}_graphicTemplate(){return s` <div class="progress__filled" style="width: ${this._progressPercentage}%"></div> `}});const t=()=>{document.getElementsByName("my-bar")[0].value=Math.floor(101*Math.random())},o=()=>s`
  <my-determinate-progress-bar
    aria-label="Interest rate"
    name="my-bar"
    value="50"
  ></my-determinate-progress-bar>
  <button @click="${t}">Randomize Value</button>
`,a=()=>s`
  <my-indeterminate-progress-spinner></my-indeterminate-progress-spinner>
`,i=document,n=[{key:"progressBarDemo",story:o},{key:"main",story:a}];let m=!1;for(const e of n){const s=i.querySelector(`[mdjs-story-name="${e.key}"]`);s&&(s.story=e.story,s.key=e.key,m=!0,Object.assign(s,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}m&&(customElements.get("mdjs-preview")||import("./a7b4f51b.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{a as main,o as progressBarDemo};
