const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.DYUong5B.js","_astro/node-tools_providence-analytics_overview.LFFQBZzG.js","_astro/lit-element.qDHKJJma.js","_astro/lit-html.C7L4dwLU.js","_astro/unsafe-html.J0GGe2Q7.js","_astro/directive.CGE4aKEl.js","_astro/define.m2CvvXyF.js"])))=>i.map(i=>d[i]);
import{_ as o}from"./preload-helper.4zY6-HO4.js";import"./node-tools_providence-analytics_overview.LFFQBZzG.js";import"./lit-element.qDHKJJma.js";import{x as t}from"./lit-html.C7L4dwLU.js";import"./unsafe-html.J0GGe2Q7.js";import{i as r}from"./lion-icon.CN7y9ybC.js";import{d as s}from"./demoStyle.DEpvfmC7.js";import"./directive.CGE4aKEl.js";import"./directive-helpers.CLllgGgm.js";import"./index.BNCfcFQh.js";import"./lazifyInstantiation.CgYLRMC3.js";import"./LionCollapsible.C4jCvCwP.js";r.addIconResolver("lion",(e,i)=>{switch(e){case"misc":return o(()=>import("./iconset-misc.M8ilOzr3.js"),[]).then(l=>l[i]);default:throw new Error(`Unknown iconset ${e}`)}});const a=()=>t`
  <style>
    ${s}
  </style>
  <div class="demo-container-top">
    <lion-drawer position="top">
      <button slot="invoker">
        <lion-icon icon-id="lion:misc:arrowLeft" style="width: 16px; height: 16px;"></lion-icon>
      </button>
      <p slot="headline">Headline</p>
      <div slot="content" class="drawer">Hello! This is the content of the drawer</div>
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
`,n=()=>t`
  <style>
    ${s}
  </style>
  <div class="demo-container-right">
    <lion-drawer position="right">
      <button slot="invoker">
        <lion-icon icon-id="lion:misc:arrowLeft" style="width: 16px; height: 16px;"></lion-icon>
      </button>
      <p slot="headline">Headline</p>
      <div slot="content" class="drawer">Hello! This is the content of the drawer</div>
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
`,c=()=>t`
  <style>
    ${s}
  </style>
  <div class="demo-container">
    <lion-drawer opened>
      <p slot="headline">Headline</p>
      <div slot="content" class="drawer">Hello! This is the content of the drawer</div>
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
`,d=({shadowRoot:e})=>t`
  <style>
    ${s}
  </style>
  <section style="margin-top:16px">
    <button @click="${()=>e.querySelector("#drawer").toggle()}">Toggle content</button>
    <button @click="${()=>e.querySelector("#drawer").show()}">Show content</button>
    <button @click="${()=>e.querySelector("#drawer").hide()}">Hide content</button>
  </section>

  <div class="demo-container">
    <lion-drawer id="drawer">
      <button slot="invoker">
        <lion-icon icon-id="lion:misc:arrowLeft" style="width: 16px; height: 16px;"></lion-icon>
      </button>
      <p slot="headline">Headline</p>
      <div slot="content" class="drawer">Hello! This is the content of the drawer</div>
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
`,m=({shadowRoot:e})=>t`
  <style>
    ${s}
  </style>
  <div class="demo-custom-collapsible-state-container">
    <strong id="collapsible-state"></strong>
  </div>
  <div class="demo-container">
    <lion-drawer
      @opened-changed=${i=>{const l=e.querySelector("#collapsible-state");l.innerText=`Opened: ${i.target.opened}`}}
    >
      <button slot="invoker">
        <lion-icon icon-id="lion:misc:arrowLeft" style="width: 16px; height: 16px;"></lion-icon>
      </button>
      <p slot="headline">Headline</p>
      <div slot="content" class="drawer">Hello! This is the content of the drawer</div>
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
`,v=document,p=[{key:"top",story:a},{key:"right",story:n},{key:"opened",story:c},{key:"methods",story:d},{key:"events",story:m}];let u=!1;for(const e of p){const i=v.querySelector(`[mdjs-story-name="${e.key}"]`);i&&(i.story=e.story,i.key=e.key,u=!0,Object.assign(i,{simulatorUrl:"/next/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}u&&(customElements.get("mdjs-preview")||o(()=>import("./define.DYUong5B.js"),__vite__mapDeps([0,1,2,3,4,5])),customElements.get("mdjs-story")||o(()=>import("./define.m2CvvXyF.js"),__vite__mapDeps([6,2,3])));export{m as events,d as methods,c as opened,n as right,a as top};
