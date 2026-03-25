import"./f1151d68.js";import{x as o}from"./b8bc2eda.js";import"./6638bb86.js";import"./ce352a10.js";import"./e4ad5728.js";import"./4c616179.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./dc2f5f5a.js";import"./acda6ea6.js";import"./0ed5d59c.js";import"./fd5951b6.js";import"./5516584c.js";import"./143fde17.js";import"./2ff5990a.js";import"./dcadf410.js";import"./be5f2fd3.js";const e=()=>o`<demo-overlay-positioning></demo-overlay-positioning>`,t=()=>o`<demo-overlay-positioning
    placement-mode="global"
    simulate-viewport
  ></demo-overlay-positioning>`,i=()=>o`
    <demo-el-using-overlaymixin .config="${{placementMode:"local"}}">
      <button slot="invoker">Click me to open the local overlay!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          class="close-button"
          @click="${o=>o.target.dispatchEvent(new Event("close-overlay",{bubbles:!0}))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `,s=()=>o`
    <demo-el-using-overlaymixin .config="${{placementMode:"global"}}">
      <button slot="invoker">Click me to open the global overlay!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          class="close-button"
          @click="${o=>o.target.dispatchEvent(new Event("close-overlay",{bubbles:!0}))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `,n=document,l=[{key:"localPositioning",story:e},{key:"globalPositioning",story:t},{key:"placementLocal",story:i},{key:"placementGlobal",story:s}];let a=!1;for(const o of l){const e=n.querySelector(`[mdjs-story-name="${o.key}"]`);e&&(e.story=o.story,e.key=o.key,a=!0,Object.assign(e,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}a&&(customElements.get("mdjs-preview")||import("./e90784d0.js"),customElements.get("mdjs-story")||import("./0defd61d.js"));export{t as globalPositioning,e as localPositioning,s as placementGlobal,i as placementLocal};
