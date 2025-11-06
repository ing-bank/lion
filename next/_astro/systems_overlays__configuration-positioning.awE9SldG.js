const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.DYUong5B.js","_astro/node-tools_providence-analytics_overview.LFFQBZzG.js","_astro/lit-element.qDHKJJma.js","_astro/lit-html.C7L4dwLU.js","_astro/unsafe-html.J0GGe2Q7.js","_astro/directive.CGE4aKEl.js","_astro/define.m2CvvXyF.js"])))=>i.map(i=>d[i]);
import{_ as n}from"./preload-helper.4zY6-HO4.js";import"./node-tools_providence-analytics_overview.LFFQBZzG.js";import"./lit-element.qDHKJJma.js";import{x as t}from"./lit-html.C7L4dwLU.js";import"./unsafe-html.J0GGe2Q7.js";import"./applyDemoOverlayStyles.PXdBqVZC.js";import"./demo-overlay-positioning.vWb55mfb.js";import"./directive.CGE4aKEl.js";import"./OverlayMixin.yM-HkbSu.js";import"./index.BNCfcFQh.js";import"./lazifyInstantiation.CgYLRMC3.js";import"./dedupeMixin.6XPTJgK8.js";import"./withDropdownConfig.eRP55go6.js";import"./withClickInteraction.B1DPetIk.js";import"./LionButton.B9nVXwmc.js";import"./DisabledWithTabIndexMixin.DiSGvuwH.js";import"./DisabledMixin.Bm1nsErI.js";import"./ref.DN9F-cVD.js";import"./async-directive.CHVe8p0E.js";import"./directive-helpers.CLllgGgm.js";const l=()=>t`<demo-overlay-positioning></demo-overlay-positioning>`,s=()=>t`<demo-overlay-positioning
    placement-mode="global"
    simulate-viewport
  ></demo-overlay-positioning>`,r=()=>t`
    <demo-el-using-overlaymixin .config="${{placementMode:"local"}}">
      <button slot="invoker">Click me to open the local overlay!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          class="close-button"
          @click="${o=>o.target.dispatchEvent(new Event("close-overlay",{bubbles:!0}))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `,m=()=>t`
    <demo-el-using-overlaymixin .config="${{placementMode:"global"}}">
      <button slot="invoker">Click me to open the global overlay!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          class="close-button"
          @click="${o=>o.target.dispatchEvent(new Event("close-overlay",{bubbles:!0}))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `,a=document,c=[{key:"localPositioning",story:l},{key:"globalPositioning",story:s},{key:"placementLocal",story:r},{key:"placementGlobal",story:m}];let i=!1;for(const e of c){const o=a.querySelector(`[mdjs-story-name="${e.key}"]`);o&&(o.story=e.story,o.key=e.key,i=!0,Object.assign(o,{simulatorUrl:"/next/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}i&&(customElements.get("mdjs-preview")||n(()=>import("./define.DYUong5B.js"),__vite__mapDeps([0,1,2,3,4,5])),customElements.get("mdjs-story")||n(()=>import("./define.m2CvvXyF.js"),__vite__mapDeps([6,2,3])));export{s as globalPositioning,l as localPositioning,m as placementGlobal,r as placementLocal};
