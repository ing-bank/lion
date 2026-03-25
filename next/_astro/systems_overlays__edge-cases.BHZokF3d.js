const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.DSVRgKCR.js","_astro/node-tools_providence-analytics_overview.BxIihMx7.js","_astro/lit-element.jD9bOQKo.js","_astro/lit-html.DtZEZPQ5.js","_astro/unsafe-html.DgrA3nwU.js","_astro/directive.BO6BEpVC.js","_astro/define.DNIVKtom.js"])))=>i.map(i=>d[i]);
import{_ as i}from"./preload-helper.Cj2JEybs.js";import"./node-tools_providence-analytics_overview.BxIihMx7.js";import"./lit-element.jD9bOQKo.js";import{x as t}from"./lit-html.DtZEZPQ5.js";import"./unsafe-html.DgrA3nwU.js";import"./applyDemoOverlayStyles.jiEWGORD.js";import"./demo-overlay-positioning.CEbLUHL8.js";const n=()=>t`
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
`,s=document,r=[{key:"edgeCaseOverflowProblem",story:n},{key:"edgeCaseOverflowSolution",story:a},{key:"edgeCaseStackProblem",story:d}];let l=!1;for(const o of r){const e=s.querySelector(`[mdjs-story-name="${o.key}"]`);e&&(e.story=o.story,e.key=o.key,l=!0,Object.assign(e,{simulatorUrl:"/next/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}l&&(customElements.get("mdjs-preview")||i(()=>import("./define.DSVRgKCR.js"),__vite__mapDeps([0,1,2,3,4,5])),customElements.get("mdjs-story")||i(()=>import("./define.DNIVKtom.js"),__vite__mapDeps([6,2,3])));export{n as edgeCaseOverflowProblem,a as edgeCaseOverflowSolution,d as edgeCaseStackProblem};
