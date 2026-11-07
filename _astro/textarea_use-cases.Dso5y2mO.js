const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.D5IFK1jp.js","_astro/MdJsPreview.B62up6PK.js","_astro/lit-element.DxRhnkit.js","_astro/lit-html.BX7rm8u-.js","_astro/dedupeMixin.6XPTJgK8.js","_astro/lit-element.BOikny4r.js","_astro/uuid.DjYKNjre.js","_astro/define.DBgp7shK.js"])))=>i.map(i=>d[i]);
import{_ as i}from"./preload-helper.CVfkMyKi.js";import"./MdJsPreview.B62up6PK.js";import"./lit-element.DxRhnkit.js";import{b as o}from"./lit-html.BX7rm8u-.js";import"./unsafe-html.FHlAasnX.js";import"./lion-textarea.CbVV94_w.js";const a=()=>o`
  <lion-textarea
    label="Prefilled"
    .modelValue="${["batman","and","robin"].join(`
`)}"
  ></lion-textarea>
`,l=()=>o` <lion-textarea label="Disabled" disabled></lion-textarea> `,r=()=>o`
  <lion-textarea
    label="Readonly"
    readonly
    .modelValue="${["batman","and","robin"].join(`
`)}"
  ></lion-textarea>
`,s=()=>o`
  <lion-textarea
    label="Stop growing"
    max-rows="4"
    .modelValue="${["batman","and","robin"].join(`
`)}"
  ></lion-textarea>
`,d=()=>o`
  <lion-textarea label="Non Growing" rows="3" max-rows="3"></lion-textarea>
`,m=()=>o`
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
`,u=document,y=[{key:"prefilled",story:a},{key:"disabled",story:l},{key:"readonly",story:r},{key:"stopGrowing",story:s},{key:"nonGrowing",story:d},{key:"hidden",story:m}];let n=!1;for(const e of y){const t=u.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,n=!0,Object.assign(t,{simulatorUrl:"/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}n&&(customElements.get("mdjs-preview")||i(()=>import("./define.D5IFK1jp.js"),__vite__mapDeps([0,1,2,3,4,5,6])),customElements.get("mdjs-story")||i(()=>import("./define.DBgp7shK.js"),__vite__mapDeps([7,2,3])));export{l as disabled,m as hidden,d as nonGrowing,a as prefilled,r as readonly,s as stopGrowing};
