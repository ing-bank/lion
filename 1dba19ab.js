import"./24f95583.js";import{x as t}from"./b4be29f1.js";import"./05905ff1.js";import"./a948a137.js";const e=()=>t`
  <lion-steps>
    <lion-step initial-step>
      Step 1
      <button type="button" @click="${t=>t.target.parentElement.controller.next()}">
        Next
      </button>
    </lion-step>
    <lion-step>
      <button type="button" @click="${t=>t.target.parentElement.controller.previous()}">
        Previous
      </button>
      Step 2
      <button type="button" @click="${t=>t.target.parentElement.controller.next()}">
        Next
      </button>
    </lion-step>
    <lion-step>
      <button type="button" @click="${t=>t.target.parentElement.controller.previous()}">
        Previous
      </button>
      Step 3
    </lion-step>
  </lion-steps>
`,n=document,o=[{key:"main",story:e}];let s=!1;for(const t of o){const e=n.querySelector(`[mdjs-story-name="${t.key}"]`);e&&(e.story=t.story,e.key=t.key,s=!0,Object.assign(e,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}s&&(customElements.get("mdjs-preview")||import("./a7b4f51b.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{e as main};
