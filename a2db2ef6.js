import"./24f95583.js";import{x as e}from"./b4be29f1.js";import"./05905ff1.js";import"./86d0ae84.js";import"./9157d4cc.js";import"./7902d8e0.js";import"./dc2f5f5a.js";import"./d45984a3.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./4cc99b59.js";import"./19d2607c.js";import"./afb8834e.js";import"./143fde17.js";import"./298b3bc0.js";const t=()=>e`
  <lion-textarea
    label="Prefilled"
    .modelValue="${["batman","and","robin"].join("\n")}"
  ></lion-textarea>
`,o=()=>e` <lion-textarea label="Disabled" disabled></lion-textarea> `,i=()=>e`
  <lion-textarea
    label="Readonly"
    readonly
    .modelValue="${["batman","and","robin"].join("\n")}"
  ></lion-textarea>
`,a=()=>e`
  <lion-textarea
    label="Stop growing"
    max-rows="4"
    .modelValue="${["batman","and","robin"].join("\n")}"
  ></lion-textarea>
`,n=()=>e`
  <lion-textarea label="Non Growing" rows="3" max-rows="3"></lion-textarea>
`,r=()=>e`
  <div style="display: none">
    <lion-textarea
      .modelValue="${"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}"
      label="Stops growing after 4 rows"
      max-rows="4"
    ></lion-textarea>
  </div>
  <button
    @click=${e=>e.target.previousElementSibling.style.display="block"===e.target.previousElementSibling.style.display?"none":"block"}
  >
    Toggle display
  </button>
`,l=document,s=[{key:"prefilled",story:t},{key:"disabled",story:o},{key:"readonly",story:i},{key:"stopGrowing",story:a},{key:"nonGrowing",story:n},{key:"hidden",story:r}];let m=!1;for(const e of s){const t=l.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,m=!0,Object.assign(t,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}m&&(customElements.get("mdjs-preview")||import("./a7b4f51b.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{o as disabled,r as hidden,n as nonGrowing,t as prefilled,i as readonly,a as stopGrowing};
