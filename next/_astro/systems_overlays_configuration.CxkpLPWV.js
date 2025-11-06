const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.DYUong5B.js","_astro/node-tools_providence-analytics_overview.LFFQBZzG.js","_astro/lit-element.qDHKJJma.js","_astro/lit-html.C7L4dwLU.js","_astro/unsafe-html.J0GGe2Q7.js","_astro/directive.CGE4aKEl.js","_astro/define.m2CvvXyF.js"])))=>i.map(i=>d[i]);
import{_ as i}from"./preload-helper.4zY6-HO4.js";import"./node-tools_providence-analytics_overview.LFFQBZzG.js";import"./lit-element.qDHKJJma.js";import{x as t}from"./lit-html.C7L4dwLU.js";import"./unsafe-html.J0GGe2Q7.js";import"./applyDemoOverlayStyles.PXdBqVZC.js";import{w as l}from"./withModalDialogConfig.CPyLhuB7.js";import{w as n}from"./withDropdownConfig.eRP55go6.js";import{w as c}from"./withTooltipConfig.CUfiDvGe.js";import"./directive.CGE4aKEl.js";import"./OverlayMixin.yM-HkbSu.js";import"./index.BNCfcFQh.js";import"./lazifyInstantiation.CgYLRMC3.js";import"./dedupeMixin.6XPTJgK8.js";import"./LionButton.B9nVXwmc.js";import"./DisabledWithTabIndexMixin.DiSGvuwH.js";import"./DisabledMixin.Bm1nsErI.js";import"./withClickInteraction.B1DPetIk.js";const a=()=>{const o={...n()};return t`
    <style>
      .demo-overlay {
        background-color: white;
        border: 1px solid black;
      }
    </style>
    <demo-el-using-overlaymixin .config="${o}">
      <button slot="invoker">Click me to open the local overlay!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          class="close-button"
          @click="${e=>e.target.dispatchEvent(new Event("close-overlay",{bubbles:!0}))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `},u=()=>t`
    <demo-el-using-overlaymixin .config="${{placementMode:"global"}}">
      <button slot="invoker">Click me to open the global overlay!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          class="close-button"
          @click="${e=>e.target.dispatchEvent(new Event("close-overlay",{bubbles:!0}))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `,d=()=>{const o={...l(),isAlertDialog:!0};return t`
    <demo-el-using-overlaymixin .config="${o}">
      <button slot="invoker">Click me to open the alert dialog!</button>
      <div slot="content" class="demo-overlay">
        Are you sure you want to perform this action?
        <button
          type="button"
          @click="${e=>e.target.dispatchEvent(new Event("close-overlay",{bubbles:!0}))}"
        >
          Yes
        </button>
        <button
          type="button"
          @click="${e=>e.target.dispatchEvent(new Event("close-overlay",{bubbles:!0}))}"
        >
          No
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `},v=()=>{const o={...c()};return t`
    <demo-el-using-overlaymixin id="tooltip" .config="${o}">
      <button slot="invoker">Hover me to open the tooltip!</button>
      <div slot="content" class="demo-overlay">Hello!</div>
    </demo-el-using-overlaymixin>
  `},m=()=>{const o={...n(),trapsKeyboardFocus:!0};return t`
    <demo-el-using-overlaymixin .config="${o}">
      <button slot="invoker">Click me to open the overlay!</button>
      <div slot="content" class="demo-overlay">
        <div><a href="#">A focusable anchor</a></div>
        <div><a href="#">Another focusable anchor</a></div>
        Hello! You can close this notification here:
        <button
          class="close-button"
          @click="${e=>e.target.dispatchEvent(new Event("close-overlay",{bubbles:!0}))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `},b=()=>{const o={...n(),hidesOnEsc:!0};return t`
    <demo-el-using-overlaymixin .config="${o}">
      <button slot="invoker">Click me to open the overlay!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          class="close-button"
          @click="${e=>e.target.dispatchEvent(new Event("close-overlay",{bubbles:!0}))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `},y=()=>{const o={...l(),hidesOnEsc:!1,hidesOnOutsideEsc:!1};return t`
    <demo-el-using-overlaymixin .config="${o}">
      <button slot="invoker">Click me to open the overlay!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          class="close-button"
          @click="${e=>e.target.dispatchEvent(new Event("close-overlay",{bubbles:!0}))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `},p=()=>{const o={...n(),hidesOnOutsideEsc:!0};return t`
    <demo-el-using-overlaymixin .config="${o}">
      <button slot="invoker">Click me to open the overlay!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          class="close-button"
          @click="${e=>e.target.dispatchEvent(new Event("close-overlay",{bubbles:!0}))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `},g=()=>{const o={...n(),hidesOnOutsideClick:!0};return t`
    <demo-el-using-overlaymixin .config="${o}">
      <button slot="invoker">Click me to open the overlay!</button>
      <div slot="content" class="demo-overlay">
        <label for="myInput">Clicking this label should not trigger close</label>
        <input id="myInput" />
        <button
          class="close-button"
          @click="${e=>e.target.dispatchEvent(new Event("close-overlay",{bubbles:!0}))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `},h=()=>{const o=document.createElement("button");o.innerText="I should get focus";const e={...n(),elementToFocusAfterHide:o};return t`
    <demo-el-using-overlaymixin .config="${e}">
      <button slot="invoker">Click me to open the overlay!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          class="close-button"
          @click="${r=>r.target.dispatchEvent(new Event("close-overlay",{bubbles:!0}))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
    ${o}
  `},f=()=>{const o={...n(),hasBackdrop:!0};return t`
    <demo-el-using-overlaymixin .config="${o}">
      <button slot="invoker">Click me to open the overlay!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          class="close-button"
          @click="${e=>e.target.dispatchEvent(new Event("close-overlay",{bubbles:!0}))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `},k=()=>{const o={...n(),hasBackdrop:!0,isBlocking:!0};return t`
    <demo-el-using-overlaymixin>
      <button slot="invoker">Overlay A: open first</button>
      <div slot="content" class="demo-overlay" style="width:200px;">
        This overlay gets closed when overlay B gets opened
        <button
          class="close-button"
          @click="${e=>e.target.dispatchEvent(new Event("close-overlay",{bubbles:!0}))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
    <demo-el-using-overlaymixin .config="${o}">
      <button slot="invoker">Overlay B: open second</button>
      <div slot="content" class="demo-overlay demo-overlay--blocking">
        Overlay A is hidden... now close me and see overlay A again.
        <button
          class="close-button"
          @click="${e=>e.target.dispatchEvent(new Event("close-overlay",{bubbles:!0}))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `},E=()=>t`
    <demo-el-using-overlaymixin .config="${{preventsScroll:!0}}">
      <button slot="invoker">Click me to open the overlay!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          class="close-button"
          @click="${e=>e.target.dispatchEvent(new Event("close-overlay",{bubbles:!0}))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `,C=()=>t`
    <demo-el-using-overlaymixin .config="${{placementMode:"global",viewportConfig:{placement:"bottom-left"}}}">
      <button slot="invoker">Click me to open the overlay in the bottom left corner!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          class="close-button"
          @click="${e=>e.target.dispatchEvent(new Event("close-overlay",{bubbles:!0}))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `,x=()=>t`
    <style>
      .demo-overlay {
        background-color: white;
        border: 1px solid black;
      }
    </style>
    <demo-el-using-overlaymixin .config="${{placementMode:"local",popperConfig:{placement:"bottom-start",positionFixed:!0,modifiers:[{name:"preventOverflow",enabled:!1,options:{boundariesElement:"viewport",padding:32}},{name:"flip",options:{boundariesElement:"viewport",padding:16}},{name:"offset",options:{offset:[0,16]}}]}}}">
      <button slot="invoker">Click me to open the overlay!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          class="close-button"
          @click="${e=>e.target.dispatchEvent(new Event("close-overlay",{bubbles:!0}))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `,w=document,$=[{key:"placementLocal",story:a},{key:"placementGlobal",story:u},{key:"alertDialog",story:d},{key:"usingTooltipConfig",story:v},{key:"trapsKeyboardFocus",story:m},{key:"hidesOnEsc",story:b},{key:"hidesOnEscFalse",story:y},{key:"hidesOnOutsideEsc",story:p},{key:"hidesOnOutsideClick",story:g},{key:"elementToFocusAfterHide",story:h},{key:"hasBackdrop",story:f},{key:"isBlocking",story:k},{key:"preventsScroll",story:E},{key:"viewportConfig",story:C},{key:"popperConfig",story:x}];let s=!1;for(const o of $){const e=w.querySelector(`[mdjs-story-name="${o.key}"]`);e&&(e.story=o.story,e.key=o.key,s=!0,Object.assign(e,{simulatorUrl:"/next/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}s&&(customElements.get("mdjs-preview")||i(()=>import("./define.DYUong5B.js"),__vite__mapDeps([0,1,2,3,4,5])),customElements.get("mdjs-story")||i(()=>import("./define.m2CvvXyF.js"),__vite__mapDeps([6,2,3])));export{d as alertDialog,h as elementToFocusAfterHide,f as hasBackdrop,b as hidesOnEsc,y as hidesOnEscFalse,g as hidesOnOutsideClick,p as hidesOnOutsideEsc,k as isBlocking,u as placementGlobal,a as placementLocal,x as popperConfig,E as preventsScroll,m as trapsKeyboardFocus,v as usingTooltipConfig,C as viewportConfig};
