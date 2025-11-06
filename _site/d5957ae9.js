import"./24f95583.js";import{i as e,a as o,x as t}from"./b4be29f1.js";import"./05905ff1.js";import{O as n}from"./65cdf028.js";import{A as i}from"./5254a80b.js";import{w as l}from"./88061fcd.js";import{w as a}from"./c84885cc.js";import{w as r}from"./acda6ea6.js";import"./7197c8a6.js";import{n as s,e as c}from"./3ae224d1.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./dc2f5f5a.js";import"./0ed5d59c.js";import"./5287c897.js";import"./5516584c.js";import"./143fde17.js";import"./afb8834e.js";import"./19d2607c.js";customElements.define("demo-overlay-backdrop",class extends e{static get styles(){return o`
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
    `}});const d=()=>t`
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
`,v=()=>{const e={...a()};return t`
    <demo-el-using-overlaymixin .config="${e}">
      <demo-overlay-backdrop slot="backdrop"></demo-overlay-backdrop>
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
  `},m=()=>{const e=document.createElement("demo-overlay-backdrop"),o={...a(),backdropNode:e};return t`
    <demo-el-using-overlaymixin .config="${o}">
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
  `},u=()=>{const e={...a()};return t`
    <demo-el-using-overlaymixin .config="${e}">
      <button slot="invoker">Click me to open the overlay!</button>
      <demo-overlay-backdrop slot="backdrop"></demo-overlay-backdrop>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          @click="${e=>e.target.dispatchEvent(new Event("close-overlay",{bubbles:!0}))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `},p=()=>{const e={...l()};return t`
    <demo-el-using-overlaymixin
      .config="${e}"
      @before-opened=${e=>{window.innerWidth>=600?e.target.config={...a()}:e.target.config={...l()}}}
    >
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
  `},b=()=>{const e=c(),o=c(),n=e=>{switch(e){case"modaldialog":default:return{...a(),hasBackdrop:!0};case"bottomsheet":return{...l()};case"dropdown":return{...r(),hasBackdrop:!1,inheritsReferenceWidth:!0}}};return t`
    <style>
      .demo-overlay {
        background-color: white;
        border: 1px solid black;
      }
    </style>
    Change config to:

    <select ${s(o)} @change="${o=>{e.value.config=n(o.target.value)}}">
      <option value="modaldialog">Modal Dialog</option>
      <option value="bottomsheet">Bottom Sheet</option>
      <option value="dropdown">Dropdown</option>
    </select>

    <br />
    <demo-el-using-overlaymixin ${s(e)} .config="${n(o.value?.value)}">
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
  `},y=()=>{const e={opened:!1},o={overlay:c(),openedState:c()};return t`
    appState.opened: <span ${s(o.openedState)}>${e.opened}</span>
    <demo-el-using-overlaymixin
      ${s(o.overlay)}
      .opened="${e.opened}"
      @opened-changed="${function(t){e.opened=t.target.opened,o.openedState.value.innerText=e.opened}}"
    >
      <button slot="invoker">Overlay</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          @click="${e=>e.target.dispatchEvent(new Event("close-overlay",{bubbles:!0}))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `},k=()=>{let e=!0;const o={statusButton:c(),overlay:c()};function n(o){e&&o.preventDefault()}return t`
    Overlay blocked state:
    <button
      ${s(o.statusButton)}
      @click="${()=>{e=!e,o.statusButton.value.textContent=e}}"
    >
      ${e}
    </button>
    <demo-el-using-overlaymixin
      ${s(o.overlay)}
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
  `},g=()=>{const e={...a(),hasBackdrop:!0};return t`
    <demo-el-using-overlaymixin .config="${e}">
      <button slot="invoker">Click me to open the overlay!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          @click="${e=>e.target.dispatchEvent(new Event("close-overlay",{bubbles:!0}))}"
        >
          ⨯
        </button>
        <br />
        <button @click="${e=>document.querySelector("#secondOverlay").opened=!0}">
          Click me to open another overlay which is blocking
        </button>
      </div>
    </demo-el-using-overlaymixin>
    <demo-el-using-overlaymixin
      id="secondOverlay"
      .config="$"
    >
      <div slot="content" class="demo-overlay demo-overlay--second">
        Hello! You can close this notification here:
        <button
          @click="${e=>e.target.dispatchEvent(new Event("close-overlay",{bubbles:!0}))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `},h=()=>{const e={...r()};return t`
    <demo-el-using-overlaymixin .config="${e}">
      <demo-overlay-backdrop slot="backdrop"></demo-overlay-backdrop>
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
  `},f=()=>t`
    <demo-el-using-overlaymixin .config="${a()}">
      <div slot="content" id="mainContent" class="demo-overlay">
        open nested overlay:
        <demo-el-using-overlaymixin .config="${a()}">
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
  `,x=()=>{class o extends(i(n(e))){_defineOverlayConfig(){return{...super._defineOverlayConfig(),popperConfig:{...super._defineOverlayConfig().popperConfig,placement:"top"}}}_setupOpenCloseListeners(){super._setupOpenCloseListeners(),this._overlayInvokerNode&&this._overlayInvokerNode.addEventListener("click",this.toggle)}_teardownOpenCloseListeners(){super._teardownOpenCloseListeners(),this._overlayInvokerNode&&this._overlayInvokerNode.removeEventListener("click",this.toggle)}}return customElements.get("arrow-example")||customElements.define("arrow-example",o),t`
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
      <arrow-example .config="${{popperConfig:{placement:"right"}}}">
        <button slot="invoker">Right</button>
        <div slot="content">This is a tooltip with an arrow</div>
      </arrow-example>
      <arrow-example .config="${{popperConfig:{placement:"bottom"}}}">
        <button slot="invoker">Bottom</button>
        <div slot="content">This is a tooltip with an arrow</div>
      </arrow-example>
      <arrow-example .config="${{popperConfig:{placement:"left"}}}">
        <button slot="invoker">Left</button>
        <div slot="content">This is a tooltip with an arrow</div>
      </arrow-example>
    </div>
  `},w=document,$=[{key:"main",story:d},{key:"backdrop",story:v},{key:"backdropImperative",story:m},{key:"backdropAnimation",story:u},{key:"responsiveSwitching",story:p},{key:"responsiveSwitching2",story:b},{key:"openedState",story:y},{key:"interceptingOpenClose",story:k},{key:"overlayManager",story:g},{key:"localBackdrop",story:h},{key:"nestedOverlays",story:f},{key:"LocalWithArrow",story:x}];let E=!1;for(const e of $){const o=w.querySelector(`[mdjs-story-name="${e.key}"]`);o&&(o.story=e.story,o.key=e.key,E=!0,Object.assign(o,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}E&&(customElements.get("mdjs-preview")||import("./a7b4f51b.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{x as LocalWithArrow,v as backdrop,u as backdropAnimation,m as backdropImperative,k as interceptingOpenClose,h as localBackdrop,d as main,f as nestedOverlays,y as openedState,g as overlayManager,p as responsiveSwitching,b as responsiveSwitching2};
