import"./f1151d68.js";import{x as t}from"./b8bc2eda.js";import"./6638bb86.js";import"./3e0ae87f.js";const e=()=>t`
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
`,n=document,o=[{key:"main",story:e}];let s=!1;for(const t of o){const e=n.querySelector(`[mdjs-story-name="${t.key}"]`);e&&(e.story=t.story,e.key=t.key,s=!0,Object.assign(e,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}s&&(customElements.get("mdjs-preview")||import("./e90784d0.js"),customElements.get("mdjs-story")||import("./0defd61d.js"));export{e as main};
