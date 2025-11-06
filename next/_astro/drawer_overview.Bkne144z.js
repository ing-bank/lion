const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.DYUong5B.js","_astro/node-tools_providence-analytics_overview.LFFQBZzG.js","_astro/lit-element.qDHKJJma.js","_astro/lit-html.C7L4dwLU.js","_astro/unsafe-html.J0GGe2Q7.js","_astro/directive.CGE4aKEl.js","_astro/define.m2CvvXyF.js"])))=>i.map(i=>d[i]);
import{_ as i}from"./preload-helper.4zY6-HO4.js";import"./node-tools_providence-analytics_overview.LFFQBZzG.js";import"./lit-element.qDHKJJma.js";import{x as r}from"./lit-html.C7L4dwLU.js";import"./unsafe-html.J0GGe2Q7.js";import{d as n}from"./demoStyle.DEpvfmC7.js";import{i as l}from"./lion-icon.CN7y9ybC.js";import"./directive.CGE4aKEl.js";import"./LionCollapsible.C4jCvCwP.js";import"./directive-helpers.CLllgGgm.js";import"./index.BNCfcFQh.js";import"./lazifyInstantiation.CgYLRMC3.js";l.addIconResolver("lion",(e,t)=>{switch(e){case"misc":return i(()=>import("./iconset-misc.M8ilOzr3.js"),[]).then(s=>s[t]);default:throw new Error(`Unknown iconset ${e}`)}});const a=()=>r`
  <style>
    ${n}
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
`,u=document,m=[{key:"main",story:a}];let o=!1;for(const e of m){const t=u.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,o=!0,Object.assign(t,{simulatorUrl:"/next/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}o&&(customElements.get("mdjs-preview")||i(()=>import("./define.DYUong5B.js"),__vite__mapDeps([0,1,2,3,4,5])),customElements.get("mdjs-story")||i(()=>import("./define.m2CvvXyF.js"),__vite__mapDeps([6,2,3])));export{a as main};
