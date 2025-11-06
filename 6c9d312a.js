import"./24f95583.js";import{x as e}from"./b4be29f1.js";import"./05905ff1.js";import"./d0cb395e.js";import"./953d28fa.js";const t=()=>e`
  <lion-collapsible>
    <button slot="invoker">More about cars</button>
    <div slot="content">
      Most definitions of cars say that they run primarily on roads, seat one to eight people, have
      four tires, and mainly transport people rather than goods.
    </div>
  </lion-collapsible>
`,o=document,s=[{key:"main",story:t}];let n=!1;for(const e of s){const t=o.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,n=!0,Object.assign(t,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}n&&(customElements.get("mdjs-preview")||import("./a7b4f51b.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{t as main};
