import"./f1151d68.js";import{x as e}from"./b8bc2eda.js";import"./6638bb86.js";import"./24edfe3a.js";import"./c93477e4.js";import"./fd5951b6.js";import"./5516584c.js";import"./143fde17.js";import"./dc2f5f5a.js";const t=()=>e`
  <lion-button @click="${e=>console.log("clicked/spaced/entered",e)}">
    Click | Space | Enter me and see log
  </lion-button>
`,o=()=>e`<lion-button disabled>Disabled</lion-button>`,s=()=>e` <style>
      .small {
        padding: 4px;
        line-height: 1em;
      }
      .small::before {
        border: 1px dashed #000;
      }
    </style>
    <lion-button class="small">xs</lion-button>`,l=()=>e`
  <form
    @submit=${e=>{e.preventDefault(),console.log("submit handler",e.target)}}
  >
    <label for="firstNameId">First name</label>
    <input id="firstNameId" name="firstName" />
    <label for="lastNameId">Last name</label>
    <input id="lastNameId" name="lastName" />
    <lion-button-submit @click=${e=>console.log("click submit handler",e.target)}
      >Submit</lion-button-submit
    >
    <lion-button-reset @click=${e=>console.log("click reset handler",e.target)}
      >Reset</lion-button-reset
    >
  </form>
`,n=document,i=[{key:"handler",story:t},{key:"disabled",story:o},{key:"minimumClickArea",story:s},{key:"withinForm",story:l}];let m=!1;for(const e of i){const t=n.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,m=!0,Object.assign(t,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}m&&(customElements.get("mdjs-preview")||import("./e90784d0.js"),customElements.get("mdjs-story")||import("./0defd61d.js"));export{o as disabled,t as handler,s as minimumClickArea,l as withinForm};
