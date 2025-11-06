import"./24f95583.js";import{x as t}from"./b4be29f1.js";import"./05905ff1.js";import"./d0cb395e.js";import"./953d28fa.js";const o=()=>t`
  <lion-collapsible opened>
    <button slot="invoker">More about cars</button>
    <div slot="content">
      Most definitions of cars say that they run primarily on roads, seat one to eight people, have
      four tires, and mainly transport people rather than goods.
    </div>
  </lion-collapsible>
`,e=({shadowRoot:o})=>t`
  <lion-collapsible id="car-collapsible">
    <button slot="invoker">More about cars</button>
    <div slot="content">
      Most definitions of cars say that they run primarily on roads, seat one to eight people, have
      four tires, and mainly transport people rather than goods.
    </div>
  </lion-collapsible>
  <section style="margin-top:16px">
    <button @click="${()=>o.querySelector("#car-collapsible").toggle()}">
      Toggle content
    </button>
    <button @click="${()=>o.querySelector("#car-collapsible").show()}">
      Show content
    </button>
    <button @click="${()=>o.querySelector("#car-collapsible").hide()}">
      Hide content
    </button>
  </section>
`,n=({shadowRoot:o})=>t`
  <div class="demo-custom-collapsible-state-container">
    <strong id="collapsible-state"></strong>
  </div>
  <lion-collapsible
    @opened-changed=${t=>{o.getElementById("collapsible-state").innerText=`Opened: ${t.target.opened}`}}
  >
    <button slot="invoker">More about cars</button>
    <div slot="content">
      Most definitions of cars say that they run primarily on roads, seat one to eight people, have
      four tires, and mainly transport people rather than goods.
    </div>
  </lion-collapsible>
`,s=document,l=[{key:"defaultOpen",story:o},{key:"methods",story:e},{key:"events",story:n}];let a=!1;for(const t of l){const o=s.querySelector(`[mdjs-story-name="${t.key}"]`);o&&(o.story=t.story,o.key=t.key,a=!0,Object.assign(o,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}a&&(customElements.get("mdjs-preview")||import("./a7b4f51b.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{o as defaultOpen,n as events,e as methods};
