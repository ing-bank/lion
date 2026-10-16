import"./f1151d68.js";import{x as e}from"./b8bc2eda.js";import"./6638bb86.js";import{d as t}from"./20dfa475.js";import"./4c616179.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./dc2f5f5a.js";import"./c84885cc.js";import"./0ed5d59c.js";const o=()=>e`
  <style>
    ${t}
  </style>
  <lion-dialog>
    <button slot="invoker">Click me to open dialog</button>
    <div slot="content" class="demo-dialog-content">
      Hello! You can close this dialog here:
      <button
        class="demo-dialog-content__close-button"
        @click="${e=>e.target.dispatchEvent(new Event("close-overlay",{bubbles:!0}))}"
      >
        ⨯
      </button>
    </div>
  </lion-dialog>
`,s=document,n=[{key:"main",story:o}];let i=!1;for(const e of n){const t=s.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,i=!0,Object.assign(t,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}i&&(customElements.get("mdjs-preview")||import("./e90784d0.js"),customElements.get("mdjs-story")||import("./0defd61d.js"));export{o as main};
