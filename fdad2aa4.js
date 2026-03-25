import"./f1151d68.js";import{x as t}from"./b8bc2eda.js";import"./6638bb86.js";import"./4985e0c2.js";import"./e9f78181.js";import"./6722e641.js";const e=()=>t`
  <lion-collapsible opened>
    <button slot="invoker">More about cars</button>
    <div slot="content">
      Most definitions of cars say that they run primarily on roads, seat one to eight people, have
      four tires, and mainly transport people rather than goods.
    </div>
  </lion-collapsible>
`,o=({shadowRoot:e})=>t`
  <lion-collapsible id="car-collapsible">
    <button slot="invoker">More about cars</button>
    <div slot="content">
      Most definitions of cars say that they run primarily on roads, seat one to eight people, have
      four tires, and mainly transport people rather than goods.
    </div>
  </lion-collapsible>
  <section style="margin-top:16px">
    <button @click="${()=>e.querySelector("#car-collapsible").toggle()}">
      Toggle content
    </button>
    <button @click="${()=>e.querySelector("#car-collapsible").show()}">
      Show content
    </button>
    <button @click="${()=>e.querySelector("#car-collapsible").hide()}">
      Hide content
    </button>
  </section>
`,n=({shadowRoot:e})=>t`
  <div class="demo-custom-collapsible-state-container">
    <strong id="collapsible-state"></strong>
  </div>
  <lion-collapsible
    @opened-changed=${t=>{e.getElementById("collapsible-state").innerText=`Opened: ${t.target.opened}`}}
  >
    <button slot="invoker">More about cars</button>
    <div slot="content">
      Most definitions of cars say that they run primarily on roads, seat one to eight people, have
      four tires, and mainly transport people rather than goods.
    </div>
  </lion-collapsible>
`,s=document,l=[{key:"defaultOpen",story:e},{key:"methods",story:o},{key:"events",story:n}];let a=!1;for(const t of l){const e=s.querySelector(`[mdjs-story-name="${t.key}"]`);e&&(e.story=t.story,e.key=t.key,a=!0,Object.assign(e,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}a&&(customElements.get("mdjs-preview")||import("./e90784d0.js"),customElements.get("mdjs-story")||import("./0defd61d.js"));export{e as defaultOpen,n as events,o as methods};
