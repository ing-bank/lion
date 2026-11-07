const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.D5IFK1jp.js","_astro/MdJsPreview.B62up6PK.js","_astro/lit-element.DxRhnkit.js","_astro/lit-html.BX7rm8u-.js","_astro/dedupeMixin.6XPTJgK8.js","_astro/lit-element.BOikny4r.js","_astro/uuid.DjYKNjre.js","_astro/define.DBgp7shK.js"])))=>i.map(i=>d[i]);
import{_ as d}from"./preload-helper.CVfkMyKi.js";import"./MdJsPreview.B62up6PK.js";import{i as m}from"./lit-element.DxRhnkit.js";import{b as t}from"./lit-html.BX7rm8u-.js";import"./unsafe-html.FHlAasnX.js";import{O as p}from"./OverlayMixin.BXBzDSqx.js";import{A as y}from"./ArrowMixin._eTskhTC.js";import{w as c}from"./withBottomSheetConfig.Cflq9zAr.js";import{w as i}from"./withModalDialogConfig.CPyLhuB7.js";import{w as v}from"./withDropdownConfig.mpS2_Nd0.js";import"./applyDemoOverlayStyles.CBkaIoxB.js";import{a as b,i as g}from"./lit-element.BOikny4r.js";import{n as a,e as s}from"./ref.BNaaotgk.js";class k extends b{static get styles(){return g`
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
    `}}customElements.define("demo-overlay-backdrop",k);const f=()=>t`
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
`,h=()=>{const e={...i()};return t`
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
  `},w=()=>{const e=document.createElement("demo-overlay-backdrop"),o={...i(),backdropNode:e};return t`
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
  `},x=()=>{const e={...i()};return t`
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
  `},$=()=>{const e={...c()};return t`
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
  `},C=()=>{const e=s(),o=s(),n=l=>{switch(l){case"modaldialog":return{...i(),hasBackdrop:!0};case"bottomsheet":return{...c()};case"dropdown":return{...v(),hasBackdrop:!1,inheritsReferenceWidth:!0};default:return{...i(),hasBackdrop:!0}}},r=l=>{e.value.config=n(l.target.value)};return t`
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
  `},E=()=>{const e={opened:!1},o={overlay:s(),openedState:s()};function n(r){e.opened=r.target.opened,o.openedState.value.innerText=e.opened}return t`
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
  `},_=()=>{let e=!0;const o={statusButton:s(),overlay:s()};function n(r){e&&r.preventDefault()}return t`
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
  `},O=()=>{const e={...i(),hasBackdrop:!0};return t`
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
  `},B=()=>{const e={...v()};return t`
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
  `},S=()=>t`
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
  `,D=()=>{const e={popperConfig:{placement:"right"}},o={popperConfig:{placement:"bottom"}},n={popperConfig:{placement:"left"}};class r extends y(p(m)){_defineOverlayConfig(){return{...super._defineOverlayConfig(),popperConfig:{...super._defineOverlayConfig().popperConfig,placement:"top"}}}_setupOpenCloseListeners(){super._setupOpenCloseListeners(),this._overlayInvokerNode&&this._overlayInvokerNode.addEventListener("click",this.toggle)}_teardownOpenCloseListeners(){super._teardownOpenCloseListeners(),this._overlayInvokerNode&&this._overlayInvokerNode.removeEventListener("click",this.toggle)}}return customElements.get("arrow-example")||customElements.define("arrow-example",r),t`
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
  `},L=document,H=[{key:"main",story:f},{key:"backdrop",story:h},{key:"backdropImperative",story:w},{key:"backdropAnimation",story:x},{key:"responsiveSwitching",story:$},{key:"responsiveSwitching2",story:C},{key:"openedState",story:E},{key:"interceptingOpenClose",story:_},{key:"overlayManager",story:O},{key:"localBackdrop",story:B},{key:"nestedOverlays",story:S},{key:"LocalWithArrow",story:D}];let u=!1;for(const e of H){const o=L.querySelector(`[mdjs-story-name="${e.key}"]`);o&&(o.story=e.story,o.key=e.key,u=!0,Object.assign(o,{simulatorUrl:"/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}u&&(customElements.get("mdjs-preview")||d(()=>import("./define.D5IFK1jp.js"),__vite__mapDeps([0,1,2,3,4,5,6])),customElements.get("mdjs-story")||d(()=>import("./define.DBgp7shK.js"),__vite__mapDeps([7,2,3])));export{D as LocalWithArrow,h as backdrop,x as backdropAnimation,w as backdropImperative,_ as interceptingOpenClose,B as localBackdrop,f as main,S as nestedOverlays,E as openedState,O as overlayManager,$ as responsiveSwitching,C as responsiveSwitching2};
