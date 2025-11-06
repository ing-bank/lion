import"./24f95583.js";import{x as t}from"./b4be29f1.js";import"./05905ff1.js";import{d as e}from"./f97918e5.js";import"./65cdf028.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./dc2f5f5a.js";import"./c84885cc.js";import"./0ed5d59c.js";const o=()=>t`
  <style>
    ${e}
  </style>
  <lion-dialog>
    <button slot="invoker">Click me to open dialog</button>
    <div slot="content" class="demo-dialog-content">
      Hello! You can close this dialog here:
      <button
        class="demo-dialog-content__close-button"
        @click="${t=>t.target.dispatchEvent(new Event("close-overlay",{bubbles:!0}))}"
      >
        ⨯
      </button>
    </div>
  </lion-dialog>
`,s=document,n=[{key:"main",story:o}];let i=!1;for(const t of n){const e=s.querySelector(`[mdjs-story-name="${t.key}"]`);e&&(e.story=t.story,e.key=t.key,i=!0,Object.assign(e,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}i&&(customElements.get("mdjs-preview")||import("./a7b4f51b.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{o as main};
