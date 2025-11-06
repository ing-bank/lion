const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.DYUong5B.js","_astro/node-tools_providence-analytics_overview.LFFQBZzG.js","_astro/lit-element.qDHKJJma.js","_astro/lit-html.C7L4dwLU.js","_astro/unsafe-html.J0GGe2Q7.js","_astro/directive.CGE4aKEl.js","_astro/define.m2CvvXyF.js"])))=>i.map(i=>d[i]);
import{_ as d}from"./preload-helper.4zY6-HO4.js";import"./node-tools_providence-analytics_overview.LFFQBZzG.js";import{i as v,a as u}from"./lit-element.qDHKJJma.js";import{x as t}from"./lit-html.C7L4dwLU.js";import"./unsafe-html.J0GGe2Q7.js";import{O as y}from"./OverlayMixin.yM-HkbSu.js";import{A as b}from"./ArrowMixin.HbYR3IvJ.js";import{w as c}from"./withBottomSheetConfig.Cflq9zAr.js";import{w as i}from"./withModalDialogConfig.CPyLhuB7.js";import{w as m}from"./withDropdownConfig.eRP55go6.js";import"./applyDemoOverlayStyles.PXdBqVZC.js";import{n as a,e as s}from"./ref.DN9F-cVD.js";import"./directive.CGE4aKEl.js";import"./index.BNCfcFQh.js";import"./lazifyInstantiation.CgYLRMC3.js";import"./dedupeMixin.6XPTJgK8.js";import"./withClickInteraction.B1DPetIk.js";import"./LionButton.B9nVXwmc.js";import"./DisabledWithTabIndexMixin.DiSGvuwH.js";import"./DisabledMixin.Bm1nsErI.js";import"./async-directive.CHVe8p0E.js";import"./directive-helpers.CLllgGgm.js";class g extends v{static get styles(){return u`
      :host {
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: grey;
        opacity: 0.3;
        position: fixed;
      }

      :host(.local-overlays__backdrop--visible) {
        display: block;
      }

      :host(.local-overlays__backdrop--animation-in) {
        animation: local-overlays-backdrop-fade-in 300ms;
      }

      :host(.local-overlays__backdrop--animation-out) {
        animation: local-overlays-backdrop-fade-out 300ms;
        opacity: 0;
      }

      @keyframes local-overlays-backdrop-fade-in {
        from {
          opacity: 0;
        }
      }

      @keyframes local-overlays-backdrop-fade-out {
        from {
          opacity: 0.3;
        }
      }
    `}}customElements.define("demo-overlay-backdrop",g);const k=()=>t`
  <demo-el-using-overlaymixin>
    <button slot="invoker">Click me to open the overlay!</button>
    <div slot="content" class="demo-overlay">
      Hello! You can close this notification here:
      <button
        @click="${e=>e.target.dispatchEvent(new Event("close-overlay",{bubbles:!0}))}"
      >
        ⨯
      </button>
    </div>
  </demo-el-using-overlaymixin>
`,f=()=>{const e={...i()};return t`
    <demo-el-using-overlaymixin .config="${e}">
      <demo-overlay-backdrop slot="backdrop"></demo-overlay-backdrop>
      <button slot="invoker">Click me to open the overlay!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          @click="${o=>o.target.dispatchEvent(new Event("close-overlay",{bubbles:!0}))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `},h=()=>{const e=document.createElement("demo-overlay-backdrop"),o={...i(),backdropNode:e};return t`
    <demo-el-using-overlaymixin .config="${o}">
      <button slot="invoker">Click me to open the overlay!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          @click="${n=>n.target.dispatchEvent(new Event("close-overlay",{bubbles:!0}))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `},w=()=>{const e={...i()};return t`
    <demo-el-using-overlaymixin .config="${e}">
      <button slot="invoker">Click me to open the overlay!</button>
      <demo-overlay-backdrop slot="backdrop"></demo-overlay-backdrop>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          @click="${o=>o.target.dispatchEvent(new Event("close-overlay",{bubbles:!0}))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `},x=()=>{const e={...c()};return t`
    <demo-el-using-overlaymixin
      .config="${e}"
      @before-opened=${o=>{window.innerWidth>=600?o.target.config={...i()}:o.target.config={...c()}}}
    >
      <button slot="invoker">Click me to open the overlay!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          @click="${o=>o.target.dispatchEvent(new Event("close-overlay",{bubbles:!0}))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `},$=()=>{const e=s(),o=s(),n=l=>{switch(l){case"modaldialog":return{...i(),hasBackdrop:!0};case"bottomsheet":return{...c()};case"dropdown":return{...m(),hasBackdrop:!1,inheritsReferenceWidth:!0};default:return{...i(),hasBackdrop:!0}}},r=l=>{e.value.config=n(l.target.value)};return t`
    <style>
      .demo-overlay {
        background-color: white;
        border: 1px solid black;
      }
    </style>
    Change config to:

    <select ${a(o)} @change="${r}">
      <option value="modaldialog">Modal Dialog</option>
      <option value="bottomsheet">Bottom Sheet</option>
      <option value="dropdown">Dropdown</option>
    </select>

    <br />
    <demo-el-using-overlaymixin ${a(e)} .config="${n(o.value?.value)}">
      <button slot="invoker">Click me to open the overlay!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          @click="${l=>l.target.dispatchEvent(new Event("close-overlay",{bubbles:!0}))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `},C=()=>{const e={opened:!1},o={overlay:s(),openedState:s()};function n(r){e.opened=r.target.opened,o.openedState.value.innerText=e.opened}return t`
    appState.opened: <span ${a(o.openedState)}>${e.opened}</span>
    <demo-el-using-overlaymixin
      ${a(o.overlay)}
      .opened="${e.opened}"
      @opened-changed="${n}"
    >
      <button slot="invoker">Overlay</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          @click="${r=>r.target.dispatchEvent(new Event("close-overlay",{bubbles:!0}))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `},E=()=>{let e=!0;const o={statusButton:s(),overlay:s()};function n(r){e&&r.preventDefault()}return t`
    Overlay blocked state:
    <button
      ${a(o.statusButton)}
      @click="${()=>{e=!e,o.statusButton.value.textContent=e}}"
    >
      ${e}
    </button>
    <demo-el-using-overlaymixin
      ${a(o.overlay)}
      @before-closed="${n}"
      @before-opened="${n}"
    >
      <button
        slot="invoker"
        @click=${()=>console.log("blockOverlay",e,"opened",o.overlay.value.opened)}
      >
        Overlay
      </button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button @click="${()=>o.overlay.value.opened=!1}">⨯</button>
      </div>
    </demo-el-using-overlaymixin>
  `},_=()=>{const e={...i(),hasBackdrop:!0};return t`
    <demo-el-using-overlaymixin .config="${e}">
      <button slot="invoker">Click me to open the overlay!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          @click="${o=>o.target.dispatchEvent(new Event("close-overlay",{bubbles:!0}))}"
        >
          ⨯
        </button>
        <br />
        <button @click="${o=>document.querySelector("#secondOverlay").opened=!0}">
          Click me to open another overlay which is blocking
        </button>
      </div>
    </demo-el-using-overlaymixin>
    <demo-el-using-overlaymixin
      id="secondOverlay"
      .config="${{...i(),hasBackdrop:!0,isBlocking:!0}}"
    >
      <div slot="content" class="demo-overlay demo-overlay--second">
        Hello! You can close this notification here:
        <button
          @click="${o=>o.target.dispatchEvent(new Event("close-overlay",{bubbles:!0}))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `},O=()=>{const e={...m()};return t`
    <demo-el-using-overlaymixin .config="${e}">
      <demo-overlay-backdrop slot="backdrop"></demo-overlay-backdrop>
      <button slot="invoker">Click me to open the overlay!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          @click="${o=>o.target.dispatchEvent(new Event("close-overlay",{bubbles:!0}))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `},B=()=>t`
    <demo-el-using-overlaymixin .config="${i()}">
      <div slot="content" id="mainContent" class="demo-overlay">
        open nested overlay:
        <demo-el-using-overlaymixin .config="${i()}">
          <div slot="content" id="nestedContent" class="demo-overlay">
            Nested content
            <button
              @click="${e=>e.target.dispatchEvent(new Event("close-overlay",{bubbles:!0}))}"
            >
              ⨯
            </button>
          </div>
          <button slot="invoker" id="nestedInvoker">nested invoker button</button>
        </demo-el-using-overlaymixin>
        <button
          @click="${e=>e.target.dispatchEvent(new Event("close-overlay",{bubbles:!0}))}"
        >
          ⨯
        </button>
      </div>
      <button slot="invoker" id="mainInvoker">invoker button</button>
    </demo-el-using-overlaymixin>
  `,S=()=>{const e={popperConfig:{placement:"right"}},o={popperConfig:{placement:"bottom"}},n={popperConfig:{placement:"left"}};class r extends b(y(v)){_defineOverlayConfig(){return{...super._defineOverlayConfig(),popperConfig:{...super._defineOverlayConfig().popperConfig,placement:"top"}}}_setupOpenCloseListeners(){super._setupOpenCloseListeners(),this._overlayInvokerNode&&this._overlayInvokerNode.addEventListener("click",this.toggle)}_teardownOpenCloseListeners(){super._teardownOpenCloseListeners(),this._overlayInvokerNode&&this._overlayInvokerNode.removeEventListener("click",this.toggle)}}return customElements.get("arrow-example")||customElements.define("arrow-example",r),t`
    <style>
      .demo-box-placements {
        display: flex;
        flex-direction: column;
        margin: 40px 0 0 200px;
      }
      .demo-box-placements arrow-example {
        margin: 20px;
      }
    </style>
    <div class="demo-box-placements">
      <arrow-example>
        <button slot="invoker">Top</button>
        <div slot="content">This is a tooltip with an arrow</div>
      </arrow-example>
      <arrow-example .config="${e}">
        <button slot="invoker">Right</button>
        <div slot="content">This is a tooltip with an arrow</div>
      </arrow-example>
      <arrow-example .config="${o}">
        <button slot="invoker">Bottom</button>
        <div slot="content">This is a tooltip with an arrow</div>
      </arrow-example>
      <arrow-example .config="${n}">
        <button slot="invoker">Left</button>
        <div slot="content">This is a tooltip with an arrow</div>
      </arrow-example>
    </div>
  `},D=document,L=[{key:"main",story:k},{key:"backdrop",story:f},{key:"backdropImperative",story:h},{key:"backdropAnimation",story:w},{key:"responsiveSwitching",story:x},{key:"responsiveSwitching2",story:$},{key:"openedState",story:C},{key:"interceptingOpenClose",story:E},{key:"overlayManager",story:_},{key:"localBackdrop",story:O},{key:"nestedOverlays",story:B},{key:"LocalWithArrow",story:S}];let p=!1;for(const e of L){const o=D.querySelector(`[mdjs-story-name="${e.key}"]`);o&&(o.story=e.story,o.key=e.key,p=!0,Object.assign(o,{simulatorUrl:"/next/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}p&&(customElements.get("mdjs-preview")||d(()=>import("./define.DYUong5B.js"),__vite__mapDeps([0,1,2,3,4,5])),customElements.get("mdjs-story")||d(()=>import("./define.m2CvvXyF.js"),__vite__mapDeps([6,2,3])));export{S as LocalWithArrow,f as backdrop,w as backdropAnimation,h as backdropImperative,E as interceptingOpenClose,O as localBackdrop,k as main,B as nestedOverlays,C as openedState,_ as overlayManager,x as responsiveSwitching,$ as responsiveSwitching2};
