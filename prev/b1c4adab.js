import"./f1151d68.js";import{x as e}from"./b8bc2eda.js";import"./6638bb86.js";import{d as t}from"./9837122f.js";import{i}from"./64eb75e6.js";import"./e9f78181.js";import"./6722e641.js";import"./be5f2fd3.js";import"./4afec9a2.js";import"./11b71ee2.js";i.addIconResolver("lion",(e,t)=>{if("misc"===e)return import("./1e82ba79.js").then(e=>e[t]);throw new Error(`Unknown iconset ${e}`)});const s=()=>e`
  <style>
    ${t}
  </style>
  <div class="demo-container">
    <lion-drawer>
      <button slot="invoker">
        <lion-icon icon-id="lion:misc:arrowLeft" style="width: 16px; height: 16px;"></lion-icon>
      </button>
      <p slot="headline">Headline</p>
      <div slot="content" class="drawer">Hello! This is the content of the drawer</div>
      <button slot="bottom-invoker">
        <lion-icon icon-id="lion:misc:arrowLeft" style="width: 16px; height: 16px;"></lion-icon>
      </button>
    </lion-drawer>
    <div>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum convallis, lorem sit amet
      sollicitudin egestas, dui lectus sodales leo, quis luctus nulla metus vitae lacus. In at
      imperdiet augue. Mauris mauris dolor, faucibus non nulla vel, vulputate hendrerit mauris.
      Praesent dapibus leo nec libero scelerisque, ac venenatis ante tincidunt. Nulla maximus
      vestibulum orci, ac viverra nisi molestie vel. Vivamus eget elit et turpis elementum tempor
      ultricies at turpis. Ut pretium aliquet finibus. Duis ullamcorper ultrices velit id luctus.
      Phasellus in ex luctus, interdum ex vel, eleifend dolor. Cras massa odio, sodales quis
      consectetur a, blandit eu purus. Donec ut gravida libero, sed accumsan arcu.
    </div>
  </div>
`,o=document,n=[{key:"main",story:s}];let r=!1;for(const e of n){const t=o.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,r=!0,Object.assign(t,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}r&&(customElements.get("mdjs-preview")||import("./e90784d0.js"),customElements.get("mdjs-story")||import("./0defd61d.js"));export{s as main};
