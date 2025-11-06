import"./24f95583.js";import{x as e}from"./b4be29f1.js";import"./05905ff1.js";import"./7197c8a6.js";import"./0a5a5119.js";import"./65cdf028.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./dc2f5f5a.js";import"./acda6ea6.js";import"./0ed5d59c.js";import"./5287c897.js";import"./5516584c.js";import"./143fde17.js";import"./3ae224d1.js";import"./afb8834e.js";import"./19d2607c.js";const o=()=>e`
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
`,t=()=>e`
  <div style="padding: 54px 24px 36px;">
    <div
      style="overflow: hidden; border: 1px black dashed; padding-top: 36px; padding-bottom: 16px;"
    >
      <div style="display: flex; justify-content: space-evenly; position: relative;">
        <demo-overlay-el opened .config="$">
          <button slot="invoker" aria-label="local, non modal"></button>
          <div slot="content">no matter</div>
        </demo-overlay-el>

        <demo-overlay-el opened .config="$">
          <button slot="invoker" aria-label="local, modal"></button>
          <div slot="content">what configuration</div>
        </demo-overlay-el>

        <demo-overlay-el
          opened
          .config="$"
        >
          <button slot="invoker" aria-label="local, absolute"></button>
          <div slot="content">...it</div>
        </demo-overlay-el>

        <demo-overlay-el
          opened
          .config="$"
        >
          <button slot="invoker" aria-label="local, fixed"></button>
          <div slot="content">just</div>
        </demo-overlay-el>

        <demo-overlay-el opened .config="$">
          <button slot="invoker" aria-label="global"></button>
          <div slot="content">works</div>
        </demo-overlay-el>
      </div>
    </div>
  </div>
`,i=()=>e`
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
`,n=document,l=[{key:"edgeCaseOverflowProblem",story:o},{key:"edgeCaseOverflowSolution",story:t},{key:"edgeCaseStackProblem",story:i}];let d=!1;for(const e of l){const o=n.querySelector(`[mdjs-story-name="${e.key}"]`);o&&(o.story=e.story,o.key=e.key,d=!0,Object.assign(o,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}d&&(customElements.get("mdjs-preview")||import("./a7b4f51b.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{o as edgeCaseOverflowProblem,t as edgeCaseOverflowSolution,i as edgeCaseStackProblem};
