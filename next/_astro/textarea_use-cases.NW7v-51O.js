const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.DYUong5B.js","_astro/node-tools_providence-analytics_overview.LFFQBZzG.js","_astro/lit-element.qDHKJJma.js","_astro/lit-html.C7L4dwLU.js","_astro/unsafe-html.J0GGe2Q7.js","_astro/directive.CGE4aKEl.js","_astro/define.m2CvvXyF.js"])))=>i.map(i=>d[i]);
import{_ as i}from"./preload-helper.4zY6-HO4.js";import"./node-tools_providence-analytics_overview.LFFQBZzG.js";import"./lit-element.qDHKJJma.js";import{x as t}from"./lit-html.C7L4dwLU.js";import"./unsafe-html.J0GGe2Q7.js";import"./lion-textarea.D_2uKuPi.js";import"./directive.CGE4aKEl.js";import"./NativeTextFieldMixin.Cfq2aKpe.js";import"./InteractionStateMixin.BzvQ4Mf0.js";import"./dedupeMixin.6XPTJgK8.js";import"./LocalizeMixin.VYu75dkK.js";import"./directive-helpers.CLllgGgm.js";import"./async-directive.CHVe8p0E.js";import"./getLocalizeManager.W5d_ICRU.js";import"./index.BNCfcFQh.js";import"./lazifyInstantiation.CgYLRMC3.js";import"./DisabledMixin.Bm1nsErI.js";import"./LionField.DGnPMihp.js";const r=()=>t`
  <lion-textarea
    label="Prefilled"
    .modelValue="${["batman","and","robin"].join(`
`)}"
  ></lion-textarea>
`,a=()=>t` <lion-textarea label="Disabled" disabled></lion-textarea> `,l=()=>t`
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
`,m=()=>t`
  <lion-textarea label="Non Growing" rows="3" max-rows="3"></lion-textarea>
`,d=()=>t`
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
`,u=document,p=[{key:"prefilled",story:r},{key:"disabled",story:a},{key:"readonly",story:l},{key:"stopGrowing",story:s},{key:"nonGrowing",story:m},{key:"hidden",story:d}];let n=!1;for(const e of p){const o=u.querySelector(`[mdjs-story-name="${e.key}"]`);o&&(o.story=e.story,o.key=e.key,n=!0,Object.assign(o,{simulatorUrl:"/next/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}n&&(customElements.get("mdjs-preview")||i(()=>import("./define.DYUong5B.js"),__vite__mapDeps([0,1,2,3,4,5])),customElements.get("mdjs-story")||i(()=>import("./define.m2CvvXyF.js"),__vite__mapDeps([6,2,3])));export{a as disabled,d as hidden,m as nonGrowing,r as prefilled,l as readonly,s as stopGrowing};
