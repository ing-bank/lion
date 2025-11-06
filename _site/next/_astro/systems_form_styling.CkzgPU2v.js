const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.DYUong5B.js","_astro/node-tools_providence-analytics_overview.LFFQBZzG.js","_astro/lit-element.qDHKJJma.js","_astro/lit-html.C7L4dwLU.js","_astro/unsafe-html.J0GGe2Q7.js","_astro/directive.CGE4aKEl.js","_astro/define.m2CvvXyF.js"])))=>i.map(i=>d[i]);
import{_ as e}from"./preload-helper.4zY6-HO4.js";import"./node-tools_providence-analytics_overview.LFFQBZzG.js";import"./lit-element.qDHKJJma.js";import{x as t}from"./lit-html.C7L4dwLU.js";import"./unsafe-html.J0GGe2Q7.js";import"./lion-input.CfgqeAN3.js";import"./lion-button.Cn-OiRgW.js";import"./directive.CGE4aKEl.js";import"./LionInput.DRpWIRa3.js";import"./NativeTextFieldMixin.Cfq2aKpe.js";import"./InteractionStateMixin.BzvQ4Mf0.js";import"./dedupeMixin.6XPTJgK8.js";import"./LocalizeMixin.VYu75dkK.js";import"./directive-helpers.CLllgGgm.js";import"./async-directive.CHVe8p0E.js";import"./getLocalizeManager.W5d_ICRU.js";import"./index.BNCfcFQh.js";import"./lazifyInstantiation.CgYLRMC3.js";import"./DisabledMixin.Bm1nsErI.js";import"./LionField.DGnPMihp.js";import"./LionButton.B9nVXwmc.js";import"./DisabledWithTabIndexMixin.DiSGvuwH.js";const n=()=>t`
  <lion-input>
    <label slot="label"> Label with <b>html tag</b> inside </label>
  </lion-input>
`,l=()=>t`<lion-input label="Prefix">
  <div slot="prefix" data-description>[prefix]</div>
</lion-input>`,s=()=>t`<lion-input label="Suffix">
  <div slot="suffix" data-description>[suffix]</div>
</lion-input>`,m=()=>t`<lion-input label="Before">
  <div slot="before" data-description>[before]</div>
</lion-input>`,p=()=>t`<lion-input label="Amount">
  <div slot="after" data-description>EUR</div>
</lion-input>
<lion-input label="Percentage">
  <div slot="after" data-description>%</div>
</lion-input>`,a=()=>t`<lion-input label="Prefix and suffix">
  <lion-button slot="prefix">prefix</lion-button>
  <lion-button slot="suffix">suffix</lion-button>
</lion-input>`,d=document,u=[{key:"label",story:n},{key:"HtmlStory0",story:l},{key:"HtmlStory1",story:s},{key:"HtmlStory2",story:m},{key:"HtmlStory3",story:p},{key:"HtmlStory4",story:a}];let r=!1;for(const i of u){const o=d.querySelector(`[mdjs-story-name="${i.key}"]`);o&&(o.story=i.story,o.key=i.key,r=!0,Object.assign(o,{simulatorUrl:"/next/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}r&&(customElements.get("mdjs-preview")||e(()=>import("./define.DYUong5B.js"),__vite__mapDeps([0,1,2,3,4,5])),customElements.get("mdjs-story")||e(()=>import("./define.m2CvvXyF.js"),__vite__mapDeps([6,2,3])));export{l as HtmlStory0,s as HtmlStory1,m as HtmlStory2,p as HtmlStory3,a as HtmlStory4,n as label};
