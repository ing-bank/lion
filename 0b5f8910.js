import"./24f95583.js";import{x as t}from"./b4be29f1.js";import"./05905ff1.js";import"./a948a137.js";const e=()=>t`
  <lion-steps>
    <lion-step initial-step>
      <p>Welcome</p>
      <button disabled>previous</button> &nbsp;
      <button type="button" @click="${t=>t.target.parentElement.controller.next()}">
        Next
      </button>
    </lion-step>
    <lion-step>
      <p>Are you single?</p>
      <button
        type="button"
        @click=${t=>{t.target.parentElement.controller.data.isSingle=!0,t.target.parentElement.controller.next()}}
      >
        Yes
      </button>
      &nbsp;
      <button
        type="button"
        @click=${t=>{t.target.parentElement.controller.data.isSingle=!1,t.target.parentElement.controller.next()}}
      >
        No
      </button>
      <br /><br />
      <button type="button" @click="${t=>t.target.parentElement.controller.previous()}">
        Previous
      </button>
    </lion-step>
    <lion-step id="is-single" .condition="${t=>t.isSingle}">
      <p>You are single</p>
      <button type="button" @click="${t=>t.target.parentElement.controller.previous()}">
        Previous
      </button>
      &nbsp;
      <button type="button" @click="${t=>t.target.parentElement.controller.next()}">
        Next
      </button>
    </lion-step>
    <lion-step id="is-not-single" .condition="${t=>t.isSingle}" invert-condition>
      <p>You are NOT single.</p>
      <button type="button" @click="${t=>t.target.parentElement.controller.previous()}">
        Previous
      </button>
      &nbsp;
      <button type="button" @click="${t=>t.target.parentElement.controller.next()}">
        Next
      </button>
    </lion-step>
    <lion-step>
      <p>Finish</p>
      <button type="button" @click="${t=>t.target.parentElement.controller.previous()}">
        Previous
      </button>
    </lion-step>
  </lion-steps>
`,n=document,o=[{key:"main",story:e}];let r=!1;for(const t of o){const e=n.querySelector(`[mdjs-story-name="${t.key}"]`);e&&(e.story=t.story,e.key=t.key,r=!0,Object.assign(e,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}r&&(customElements.get("mdjs-preview")||import("./a7b4f51b.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{e as main};
