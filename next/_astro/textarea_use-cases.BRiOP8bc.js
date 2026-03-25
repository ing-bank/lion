const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.DSVRgKCR.js","_astro/node-tools_providence-analytics_overview.BxIihMx7.js","_astro/lit-element.jD9bOQKo.js","_astro/lit-html.DtZEZPQ5.js","_astro/unsafe-html.DgrA3nwU.js","_astro/directive.BO6BEpVC.js","_astro/define.DNIVKtom.js"])))=>i.map(i=>d[i]);
import{_ as i}from"./preload-helper.Cj2JEybs.js";import"./node-tools_providence-analytics_overview.BxIihMx7.js";import"./lit-element.jD9bOQKo.js";import{x as t}from"./lit-html.DtZEZPQ5.js";import"./unsafe-html.DgrA3nwU.js";import"./lion-textarea.mdKeE1r4.js";const a=()=>t`
  <lion-textarea
    label="Prefilled"
    .modelValue="${["batman","and","robin"].join(`
`)}"
  ></lion-textarea>
`,l=()=>t` <lion-textarea label="Disabled" disabled></lion-textarea> `,r=()=>t`
  <lion-textarea
    label="Readonly"
    readonly
    .modelValue="${["batman","and","robin"].join(`
`)}"
  ></lion-textarea>
`,s=()=>t`
  <lion-textarea
    label="Stop growing"
    max-rows="4"
    .modelValue="${["batman","and","robin"].join(`
`)}"
  ></lion-textarea>
`,d=()=>t`
  <lion-textarea label="Non Growing" rows="3" max-rows="3"></lion-textarea>
`,m=()=>t`
  <div style="display: none">
    <lion-textarea
      .modelValue="${"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}"
      label="Stops growing after 4 rows"
      max-rows="4"
    ></lion-textarea>
  </div>
  <button
    @click=${e=>e.target.previousElementSibling.style.display=e.target.previousElementSibling.style.display==="block"?"none":"block"}
  >
    Toggle display
  </button>
`,u=document,y=[{key:"prefilled",story:a},{key:"disabled",story:l},{key:"readonly",story:r},{key:"stopGrowing",story:s},{key:"nonGrowing",story:d},{key:"hidden",story:m}];let n=!1;for(const e of y){const o=u.querySelector(`[mdjs-story-name="${e.key}"]`);o&&(o.story=e.story,o.key=e.key,n=!0,Object.assign(o,{simulatorUrl:"/next/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}n&&(customElements.get("mdjs-preview")||i(()=>import("./define.DSVRgKCR.js"),__vite__mapDeps([0,1,2,3,4,5])),customElements.get("mdjs-story")||i(()=>import("./define.DNIVKtom.js"),__vite__mapDeps([6,2,3])));export{l as disabled,m as hidden,d as nonGrowing,a as prefilled,r as readonly,s as stopGrowing};
