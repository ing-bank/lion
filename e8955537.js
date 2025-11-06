import"./24f95583.js";import{x as e}from"./b4be29f1.js";import"./05905ff1.js";import{s as i}from"./e1c0b5a1.js";import"./59b1489d.js";import"./19d2607c.js";import"./4afec9a2.js";import"./11b71ee2.js";const o=()=>e`
  ${Object.keys(i).map(i=>e`
      <style>
        .demo-icon__container {
          display: inline-flex;
          position: relative;
          flex-grow: 1;
          flex-direction: column;
          align-items: center;
          width: 80px;
          height: 80px;
          padding: 4px;
        }
        .demo-icon__name {
          font-size: 10px;
        }
      </style>
      <div class="demo-icon__container">
        <lion-icon icon-id="lion:space:${i}" aria-label="${i}"></lion-icon>
        <span class="demo-icon__name">${i}</span>
      </div>
    `)}
`,n=()=>e`
  <lion-icon icon-id="lion:misc:arrowLeft" aria-label="Pointing left"></lion-icon>
`,s=()=>e`
  <style>
    .demo-icon {
      width: 160px;
      height: 160px;
      fill: blue;
    }
  </style>
  <lion-icon icon-id="lion:bugs:bug02" aria-label="Bug" class="demo-icon"></lion-icon>
`,t=document,l=[{key:"iconSets",story:o},{key:"accessibleLabel",story:n},{key:"Styling",story:s}];let a=!1;for(const e of l){const i=t.querySelector(`[mdjs-story-name="${e.key}"]`);i&&(i.story=e.story,i.key=e.key,a=!0,Object.assign(i,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}a&&(customElements.get("mdjs-preview")||import("./a7b4f51b.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{s as Styling,n as accessibleLabel,o as iconSets};
