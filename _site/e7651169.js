import"./24f95583.js";import{x as e}from"./b4be29f1.js";import"./05905ff1.js";import"./7197c8a6.js";import{w as o}from"./c84885cc.js";import{w as t}from"./acda6ea6.js";import{w as n}from"./7be278a3.js";import"./65cdf028.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./dc2f5f5a.js";import"./5287c897.js";import"./5516584c.js";import"./143fde17.js";import"./0ed5d59c.js";const l=()=>{const o={...t()};return e`
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
  `},i=()=>e`
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
  `,s=()=>{const t={...o(),isAlertDialog:!0};return e`
    <demo-el-using-overlaymixin .config="${t}">
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
  `},c=()=>{const o={...n()};return e`
    <demo-el-using-overlaymixin id="tooltip" .config="${o}">
      <button slot="invoker">Hover me to open the tooltip!</button>
      <div slot="content" class="demo-overlay">Hello!</div>
    </demo-el-using-overlaymixin>
  `},a=()=>{const o={...t(),trapsKeyboardFocus:!0};return e`
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
  `},r=()=>{const o={...t(),hidesOnEsc:!0};return e`
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
  `},u=()=>{const t={...o(),hidesOnEsc:!1,hidesOnOutsideEsc:!1};return e`
    <demo-el-using-overlaymixin .config="${t}">
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
  `},v=()=>{const o={...t(),hidesOnOutsideEsc:!0};return e`
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
  `},d=()=>{const o={...t(),hidesOnOutsideClick:!0};return e`
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
  `},b=()=>{const o=document.createElement("button");o.innerText="I should get focus";const n={...t(),elementToFocusAfterHide:o};return e`
    <demo-el-using-overlaymixin .config="${n}">
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
    ${o}
  `},m=()=>{const o={...t(),hasBackdrop:!0};return e`
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
  `},y=()=>{const o={...t(),hasBackdrop:!0,isBlocking:!0};return e`
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
  `},g=()=>e`
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
  `,p=()=>e`
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
  `,h=()=>e`
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
  `,k=document,f=[{key:"placementLocal",story:l},{key:"placementGlobal",story:i},{key:"alertDialog",story:s},{key:"usingTooltipConfig",story:c},{key:"trapsKeyboardFocus",story:a},{key:"hidesOnEsc",story:r},{key:"hidesOnEscFalse",story:u},{key:"hidesOnOutsideEsc",story:v},{key:"hidesOnOutsideClick",story:d},{key:"elementToFocusAfterHide",story:b},{key:"hasBackdrop",story:m},{key:"isBlocking",story:y},{key:"preventsScroll",story:g},{key:"viewportConfig",story:p},{key:"popperConfig",story:h}];let E=!1;for(const e of f){const o=k.querySelector(`[mdjs-story-name="${e.key}"]`);o&&(o.story=e.story,o.key=e.key,E=!0,Object.assign(o,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}E&&(customElements.get("mdjs-preview")||import("./a7b4f51b.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{s as alertDialog,b as elementToFocusAfterHide,m as hasBackdrop,r as hidesOnEsc,u as hidesOnEscFalse,d as hidesOnOutsideClick,v as hidesOnOutsideEsc,y as isBlocking,i as placementGlobal,l as placementLocal,h as popperConfig,g as preventsScroll,a as trapsKeyboardFocus,c as usingTooltipConfig,p as viewportConfig};
