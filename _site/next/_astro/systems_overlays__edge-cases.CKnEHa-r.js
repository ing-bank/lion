const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.DYUong5B.js","_astro/node-tools_providence-analytics_overview.LFFQBZzG.js","_astro/lit-element.qDHKJJma.js","_astro/lit-html.C7L4dwLU.js","_astro/unsafe-html.J0GGe2Q7.js","_astro/directive.CGE4aKEl.js","_astro/define.m2CvvXyF.js"])))=>i.map(i=>d[i]);
import{_ as i}from"./preload-helper.4zY6-HO4.js";import"./node-tools_providence-analytics_overview.LFFQBZzG.js";import"./lit-element.qDHKJJma.js";import{x as t}from"./lit-html.C7L4dwLU.js";import"./unsafe-html.J0GGe2Q7.js";import"./applyDemoOverlayStyles.PXdBqVZC.js";import"./demo-overlay-positioning.vWb55mfb.js";import"./directive.CGE4aKEl.js";import"./OverlayMixin.yM-HkbSu.js";import"./index.BNCfcFQh.js";import"./lazifyInstantiation.CgYLRMC3.js";import"./dedupeMixin.6XPTJgK8.js";import"./withDropdownConfig.eRP55go6.js";import"./withClickInteraction.B1DPetIk.js";import"./LionButton.B9nVXwmc.js";import"./DisabledWithTabIndexMixin.DiSGvuwH.js";import"./DisabledMixin.Bm1nsErI.js";import"./ref.DN9F-cVD.js";import"./async-directive.CHVe8p0E.js";import"./directive-helpers.CLllgGgm.js";const n=()=>t`
  <div style="padding: 54px 24px 36px;">
    <div
      style="overflow: hidden; border: 1px black dashed; padding-top: 44px; padding-bottom: 16px;"
    >
      <div style="display: flex; justify-content: space-evenly; position: relative;">
        <demo-overlay-el opened use-absolute>
          <button slot="invoker" aria-label="local, non modal"></button>
          <div slot="content">absolute (for&nbsp;demo)</div>
        </demo-overlay-el>
      </div>
    </div>
  </div>
`,a=()=>t`
  <div style="padding: 54px 24px 36px;">
    <div
      style="overflow: hidden; border: 1px black dashed; padding-top: 36px; padding-bottom: 16px;"
    >
      <div style="display: flex; justify-content: space-evenly; position: relative;">
        <demo-overlay-el opened .config="${{placementMode:"local",trapsKeyboardFocus:!1}}">
          <button slot="invoker" aria-label="local, non modal"></button>
          <div slot="content">no matter</div>
        </demo-overlay-el>

        <demo-overlay-el opened .config="${{placementMode:"local",trapsKeyboardFocus:!0}}">
          <button slot="invoker" aria-label="local, modal"></button>
          <div slot="content">what configuration</div>
        </demo-overlay-el>

        <demo-overlay-el
          opened
          .config="${{placementMode:"local",popperConfig:{strategy:"absolute"}}}"
        >
          <button slot="invoker" aria-label="local, absolute"></button>
          <div slot="content">...it</div>
        </demo-overlay-el>

        <demo-overlay-el
          opened
          .config="${{placementMode:"local",popperConfig:{strategy:"fixed"}}}"
        >
          <button slot="invoker" aria-label="local, fixed"></button>
          <div slot="content">just</div>
        </demo-overlay-el>

        <demo-overlay-el opened .config="${{placementMode:"global"}}">
          <button slot="invoker" aria-label="global"></button>
          <div slot="content">works</div>
        </demo-overlay-el>
      </div>
    </div>
  </div>
`,d=()=>t`
  <div style="width: 300px; height: 300px; position: relative;">
    <div
      id="stacking-context-a"
      style="position: absolute; z-index: 2; top: 0; width: 100px; height: 200px;"
    >
      I am on top and I don't care about your 9999
    </div>

    <div
      id="stacking-context-b"
      style="position: absolute; z-index: 1; top: 0; width: 200px; height: 200px;"
    >
      <demo-overlay-el no-dialog-el style="overflow:hidden; position: relative;">
        <button slot="invoker">invoke</button>
        <div slot="content">
          The overlay can never be in front, since the parent stacking context has a lower priority
          than its sibling.
          <div id="stacking-context-b-inner" style="position: absolute; z-index: 9999;">
            So, even if we add a new stacking context in our overlay with z-index 9999, it will
            never be painted on top.
          </div>
        </div>
      </demo-overlay-el>
    </div>
  </div>
`,r=document,s=[{key:"edgeCaseOverflowProblem",story:n},{key:"edgeCaseOverflowSolution",story:a},{key:"edgeCaseStackProblem",story:d}];let l=!1;for(const o of s){const e=r.querySelector(`[mdjs-story-name="${o.key}"]`);e&&(e.story=o.story,e.key=o.key,l=!0,Object.assign(e,{simulatorUrl:"/next/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}l&&(customElements.get("mdjs-preview")||i(()=>import("./define.DYUong5B.js"),__vite__mapDeps([0,1,2,3,4,5])),customElements.get("mdjs-story")||i(()=>import("./define.m2CvvXyF.js"),__vite__mapDeps([6,2,3])));export{n as edgeCaseOverflowProblem,a as edgeCaseOverflowSolution,d as edgeCaseStackProblem};
