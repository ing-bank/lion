import{S as y,i as w,a as S}from"./lit-element.B1EQMsFJ.js";import{D as x,b as i,A as v}from"./lit-html.BX7rm8u-.js";import{d as u}from"./dedupeMixin.6XPTJgK8.js";import{L as k}from"./LionAccordion.CCw3hAmZ.js";const c="3.0.0",p=window.scopedElementsVersions||(window.scopedElementsVersions=[]);p.includes(c)||p.push(c);const $=s=>class extends s{static scopedElements;static get scopedElementsVersion(){return c}static __registry;get registry(){return this.constructor.__registry}set registry(t){this.constructor.__registry=t}attachShadow(t){const{scopedElements:r}=this.constructor;if(!this.registry||this.registry===this.constructor.__registry&&!Object.prototype.hasOwnProperty.call(this.constructor,"__registry")){this.registry=new CustomElementRegistry;for(const[a,b]of Object.entries(r??{}))this.registry.define(a,b)}return super.attachShadow({...t,customElements:this.registry,registry:this.registry})}},z=u($),_=s=>class extends z(s){createRenderRoot(){const{shadowRootOptions:t,elementStyles:r}=this.constructor,n=this.attachShadow(t);return this.renderOptions.creationScope=n,y(n,r),this.renderOptions.renderBefore??=n.firstChild,n}},D=u(_),o={platform:"web",size:"webSmall",previewTheme:"light",language:"en",autoHeight:!0,deviceMode:!1,rememberSettings:!1,edgeDistance:!0};let l=[];function U(s){l.push(s)}function m(s){l=l.filter(e=>e!==s)}function H(){for(const s of Object.keys(o)){const e=s;o.rememberSettings?localStorage.setItem(`mdjsViewerSharedStates-${e}`,o[e].toString()):localStorage.removeItem(`mdjsViewerSharedStates-${e}`)}}let h=!1;function C(){for(const s of Object.keys(o)){const e=s,t=localStorage.getItem(`mdjsViewerSharedStates-${e}`);if(t!==null){switch(e){case"autoHeight":case"deviceMode":case"rememberSettings":case"edgeDistance":o[e]=t==="true";break;default:o[e]=t}h=!0}}}C();function g(s){if(h)for(const e of Object.keys(o)){const t=e;switch(t){case"autoHeight":case"deviceMode":case"rememberSettings":case"edgeDistance":s[t]=o[t];break;default:s[t]=o[t]}}else f(s)}function f(s){let e=!1;for(const t of Object.keys(o)){const r=t;if(o[r]!==s[r]){switch(r){case"autoHeight":case"deviceMode":case"rememberSettings":case"edgeDistance":o[r]=s[r];break;default:o[r]=s[r]}e=!0,h=!0}}return e}function E(s,e){if(f(s)){H();for(const r of l)r!==e&&r()}}function R(){window.addEventListener("message",s=>{const{data:e}=s;if(e?.action==="mdjs-viewer-resize"){const t=document.body.querySelector(`[mdjs-story-name="${e.storyKey}"]`);t&&(t.contentHeight=e.height)}})}function d(s,e){return new URL(s).pathname.slice(1,(e.length+1)*-1)}class V extends D(w){static get scopedElements(){return{"lion-accordion":k}}static get properties(){return{story:{attribute:!1},key:{type:String},deviceMode:{type:Boolean,attribute:"device-mode",reflect:!0},sameSettings:{type:Boolean},contentHeight:{type:Number},simulatorUrl:{type:String},platform:{type:String,reflect:!0},platforms:{type:Array},size:{type:String},sizes:{type:Array},previewTheme:{type:String,reflect:!0,attribute:"preview-theme"},themes:{type:Array},language:{type:String},languages:{type:Array},edgeDistance:{type:Boolean},autoHeight:{type:Boolean},rememberSettings:{type:Boolean},__copyButtonText:{type:String}}}renderStory(e,t,r){x(e,t,r)}constructor(){super(),this.story=()=>i` <p>Loading...</p> `,this.key="",this.contentHeight=0,this.simulatorUrl="",this.__supportsClipboard="clipboard"in navigator,this.__copyButtonText="Copy Code",this.previewTheme="light",this.themes=[],this.language="en-US",this.languages=[{key:"en",name:"English"},{key:"en-US",name:"English (United States)"},{key:"en-GB",name:"English (United Kingdom)"},{key:"de",name:"German"},{key:"es",name:"Spanish"},{key:"fi",name:"Finnish"},{key:"fr",name:"French"},{key:"it",name:"Italian"},{key:"nl",name:"Dutch"},{key:"pl",name:"Polish"},{key:"pt",name:"Portuguese"},{key:"ro",name:"Romanian"},{key:"sv",name:"Swedish"}],this.platform="web",this.platforms=[],this.size="webInline",this.sizes=[{key:"webInline",name:"Inline",platform:"web",width:360,height:640,dpr:1},{key:"webSmall",name:"Small",platform:"web",width:360,height:640,dpr:1},{key:"webMedium",name:"Medium",platform:"web",width:640,height:640,dpr:1},{key:"webLarge",name:"Large",platform:"web",width:1024,height:640,dpr:1},{key:"pixel2",name:"Pixel 2",platform:"android",width:411,height:731,dpr:2.6},{key:"galaxyS5",name:"Galaxy S5",platform:"android",width:360,height:640,dpr:3},{key:"iphoneX",name:"iPhone X",platform:"ios",width:375,height:812,dpr:3},{key:"iPad",name:"iPad",platform:"ios",width:768,height:1024,dpr:2}],this.deviceMode=!1,this.autoHeight=!0,this.edgeDistance=!0,this.sameSettings=!0,this.rememberSettings=!1,this.__firstRun=!0,this.__syncUp=!1}connectedCallback(){super.connectedCallback(),this.lightDomRenderTarget||(this.lightDomRenderTarget=document.createElement("div"),this.lightDomRenderTarget.setAttribute("slot","story"),this.appendChild(this.lightDomRenderTarget)),this.sameSettings&&g(this),R()}get baseUrl(){return document.location.origin}get deviceHeight(){const e=this.sizeData?.height||50;return this.autoHeight?Math.min(this.contentHeight,e):e}getSizesFor(e){return this.sizes.filter(t=>t.platform===e)}get sizeData(){return this.sizes.find(e=>e.key===this.size)||{width:50,height:50,name:"default"}}onSubscribe=()=>{this.__syncUp=!1,g(this),this.__syncUp=!0};update(e){super.update(e),this.sameSettings&&this.__syncUp&&E(this,this.onSubscribe),e.has("sameSettings")&&(this.sameSettings?U(this.onSubscribe):m(this.onSubscribe)),this.lightDomRenderTarget&&e.has("story")&&this.renderStory(this.story({shadowRoot:this}),this.lightDomRenderTarget),(e.has("platform")||e.has("size"))&&(this.deviceMode=!(this.platform==="web"&&this.size==="webInline"))}disconnectedCallback(){super.disconnectedCallback(),this.sameSettings&&m(this.onSubscribe)}firstUpdated(){this.__syncUp=!0}get iframeUrl(){const e=document.querySelector("script[type=module][mdjs-setup]");if(!e)throw new Error('Could not find a <script type="module" src="..." mdjs-setup><\/script>');const t=new URLSearchParams;t.set("story-file",d(e.src,"js")),t.set("story-key",this.key),t.set("theme",this.previewTheme),t.set("platform",this.platform),t.set("language",this.language),t.set("edge-distance",this.edgeDistance.toString());const r=[...document.querySelectorAll("link[mdjs-use]")];for(const a of r)a.href&&t.append("stylesheets",d(a.href,"css"));const n=[...document.querySelectorAll("script[type=module][mdjs-use]")];for(const a of n)a.src&&t.append("moduleUrls",d(a.src,"js"));return`${this.simulatorUrl}#?${t.toString()}`}changePlatform(e){this.platform=e;const t=this.getSizesFor(this.platform);this.size=t[0].key}async onCopy(){let e=this.children[0];this.platform==="android"&&(e=this.children[1]),this.platform==="ios"&&(e=this.children[2]),e&&e.textContent&&(await navigator.clipboard.writeText(e.textContent.trim()),this.__copyButtonText="Copied ✅",setTimeout(()=>{this.__copyButtonText="Copy code"},2e3))}renderPlatforms(){if(this.platforms.length)return i`
        <div
          class="segmented-control"
          @change=${e=>{e.target&&this.changePlatform(e.target.value)}}
        >
          ${this.platforms.map(e=>i`
              <label class="${this.platform===e.key?"selected":""}">
                <span>${e.name}</span>
                <input
                  type="radio"
                  name="platform"
                  value="${e.key}"
                  ?checked=${this.platform===e.key}
                />
              </label>
            `)}
        </div>
      `}renderPlatform(){if(this.platforms.length)return i`
        <div>
          <h4>Platform</h4>
          ${this.renderPlatforms()}
        </div>
      `}renderSize(){if(this.sizes.length)return i`
        <div>
          <h4>Size</h4>
          ${this.renderSizes()}
        </div>
      `}renderSizes(){if(this.sizes.length)return i`
        <div
          class="segmented-control"
          @change=${e=>{e.target&&(this.size=e.target.value)}}
        >
          ${this.getSizesFor(this.platform).map(e=>i`
              <label class="${this.size===e.key?"selected":""}">
                <span>${e.name}</span>
                <input
                  type="radio"
                  name="size"
                  value="${e.key}"
                  .checked=${this.size===e.key}
                />
              </label>
            `)}
        </div>
      `}renderViewport(){return i`
      <div>
        <h3>Viewport</h3>
        ${this.renderAutoHeight()}
      </div>
    `}renderThemes(){if(this.themes.length)return i`
        <div
          class="segmented-control"
          @change=${e=>{e.target&&(this.previewTheme=e.target.value)}}
        >
          ${this.themes.map(e=>i`
              <label class="${this.previewTheme===e.key?"selected":""}">
                <span>${e.name}</span>
                <input
                  type="radio"
                  name="theme"
                  value="${e.key}"
                  ?checked=${this.previewTheme===e.key}
                />
              </label>
            `)}
        </div>
      `}renderVisual(){return i`
      <div>
        <h3>Visual</h3>
        ${this.renderThemes()} ${this.renderEdgeDistance()}
      </div>
    `}renderLanguages(){if(this.languages.length)return i`
        <label>
          Language
          <select
            @change=${e=>{e.target&&(this.language=e.target.value)}}
          >
            ${this.languages.map(e=>i`
                <option value="${e.key}" ?selected=${this.language===e.key}>
                  ${e.name}
                </option>
              `)}
          </select>
        </label>
      `}renderLocalization(){return i`
      <div>
        <h3>Localization</h3>
        ${this.renderLanguages()}
      </div>
    `}renderEdgeDistance(){return i`
      <div>
        <label class="${this.edgeDistance?"switch selected":"switch"}">
          Apply distance to edge
          <span part="switch-button"></span>

          <input
            type="checkbox"
            ?checked=${this.edgeDistance}
            @change=${e=>{e.target&&(this.edgeDistance=e.target.checked)}}
          />
        </label>
      </div>
    `}renderAutoHeight(){return i`
      <div>
        <label class="${this.autoHeight?"switch selected":"switch"}">
          Fit height to content
          <span part="switch-button"></span>
          <input
            type="checkbox"
            ?checked=${this.autoHeight}
            @change=${e=>{e.target&&(this.autoHeight=e.target.checked)}}
          />
        </label>
      </div>
    `}renderSameSettings(){return i`
      <div>
        <label class="${this.sameSettings?"switch selected":"switch"}">
          Same settings for all simulations
          <span part="switch-button"></span>
          <input
            type="checkbox"
            ?checked=${this.sameSettings}
            @change=${e=>{e.target&&(this.sameSettings=e.target.checked)}}
          />
        </label>
      </div>
    `}renderRememberSettings(){return this.sameSettings?i`
      <div>
        <label class="${this.rememberSettings?"switch selected":"switch"}">
          Remember settings
          <span part="switch-button"></span>
          <input
            type="checkbox"
            ?checked=${this.rememberSettings}
            @change=${e=>{e.target&&(this.rememberSettings=e.target.checked)}}
          />
        </label>
      </div>
    `:i``}renderSyncSettings(){return i`
      <div>
        <h3>Global</h3>
        ${this.renderSameSettings()} ${this.renderRememberSettings()}
      </div>
    `}render(){return i`
      ${this.simulatorUrl?i`
            <div class="platform-size-controls">${this.renderPlatform()} ${this.renderSize()}</div>
          `:""}
      <div id="wrapper">
        <slot name="story"></slot>
        ${this.deviceMode===!0?i`
              <iframe
                part="iframe"
                csp=${`script-src ${document.location.origin} 'unsafe-inline'; connect-src ws://${document.location.host}/`}
                .src=${this.iframeUrl}
                style=${`width: ${this.sizeData.width}px; height: ${this.deviceHeight}px;`}
              ></iframe>
              <p part="frame-description" style=${`width: ${this.sizeData.width+4}px;`}>
                ${this.sizeData.name} - ${this.deviceHeight}x${this.sizeData.width}
              </p>
            `:v}
      </div>
      <lion-accordion class="options">
        ${this.simulatorUrl?i`
              <h3 slot="invoker">
                <button>Settings</button>
              </h3>
              <div slot="content">
                ${this.deviceMode?"":i`<div>
                      Note: Additional settings become available when not in web inline mode
                    </div>`}
                <div class="settings-wrapper">
                  ${this.deviceMode?i`
                        ${this.renderViewport()} ${this.renderVisual()} ${this.renderLocalization()}
                        ${this.renderSyncSettings()}
                      `:i` ${this.renderSyncSettings()} `}
                </div>
              </div>
            `:""}
        <h3 slot="invoker">
          <button>Code</button>
        </h3>
        <div slot="content">
          <slot id="code-slot"></slot>
          <button part="copy-button" @click="${this.onCopy}" ?hidden="${!this.__supportsClipboard}">
            ${this.__copyButtonText}
          </button>
        </div>
      </lion-accordion>
      ${this.simulatorUrl?i`
            <div class="controls">
              <a href=${this.iframeUrl} target="_blank">Open simulation in new window</a>
            </div>
          `:""}
    `}static get styles(){return S`
      :host {
        display: block;
        padding-bottom: 10px;
      }

      :host([device-mode]) slot[name='story'] {
        display: none;
      }

      :host(:not([device-mode])) #wrapper {
        border: 2px solid var(--primary-lines-color, #4caf50);
      }

      iframe {
        border: 2px solid var(--primary-lines-color, #4caf50);
        background: #fff;
      }

      [part='copy-button'] {
        border: 1px solid var(--primary-color, #3f51b5);
        border-radius: 9px;
        padding: 7px;
        background: none;
        font-weight: bold;
        color: var(--primary-color, #3f51b5);
        text-align: center;
        font-size: 12px;
        line-height: 12px;
        float: right;
        margin-top: -10px;
      }

      [part='copy-button']:hover {
        background-color: var(--primary-color, #3f51b5);
        color: var(--primary-text-inverse-color, #eee);
      }

      .switch {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
      }

      .switch:focus-within [part='switch-button'] {
        box-shadow: 0 0 0 1px hsl(0deg 0% 100% / 40%), 0 0 0 4px rgb(31 117 203 / 48%);
      }

      [part='switch-button'] {
        display: inline-block;
        width: 44px;
        background: var(--switch-unselected-color, #808080);
        height: 25px;
        border-radius: 15px;
        position: relative;
      }

      [part='switch-button']::after {
        content: ' ';
        width: 18px;
        height: 18px;
        border-radius: 10px;
        background: rgb(255, 255, 255);
        display: block;
        position: absolute;
        top: 3px;
        left: 4px;
      }

      .switch.selected [part='switch-button'] {
        background: var(--switch-selected-color, #42b983);
      }

      .switch.selected [part='switch-button']::after {
        left: auto;
        right: 4px;
      }

      [part='frame-description'] {
        margin: -5px 0 10px 0;
        text-align: right;
        font-size: 12px;
        color: var(--primary-text-color, #2c3e50);
      }

      .settings-wrapper {
        display: grid;
        grid-template-columns: 1fr;
        grid-gap: 20px 40px;
        max-width: 650px;
      }

      @media (min-width: 640px) {
        .settings-wrapper {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      .settings-wrapper h3 {
        margin: 10px 0;
        font-size: 16px;
      }

      .options {
        display: block;
        padding: 15px 0;
      }

      .platform-size-controls {
        display: flex;
        justify-content: flex-start;
      }

      .platform-size-controls > * {
        margin-right: 25px;
      }

      .controls {
        display: flex;
        justify-content: space-between;
      }

      .controls a {
        color: var(--primary-color, #3f51b5);
        font-size: 14px;
        line-height: 37px;
      }

      .simulation-toggle {
        border: 1px solid var(--primary-color, #3f51b5);
        border-radius: 9px;
        padding: 10px;
        background: none;
        font-weight: bold;
        color: var(--primary-color, #3f51b5);
        text-align: center;
      }

      .simulation-toggle:hover {
        background-color: var(--primary-color, #3f51b5);
        color: var(--primary-text-inverse-color, #eee);
      }

      h3[slot='invoker'] button {
        font-size: 16px;
        display: block;
        position: relative;
        padding: 10px;
        border: none;
        border-bottom: 1px solid #bbb;
        width: 100%;
        color: var(--primary-text-color, #2c3e50);
        background: none;
        text-align: left;
        font-weight: bold;
      }

      h3[slot='invoker'] button::after {
        content: '>';
        right: 20px;
        top: 10px;
        position: absolute;
        transform: rotate(90deg);
      }

      h3[slot='invoker'][expanded='true'] button::after {
        transform: rotate(-90deg);
      }

      h3[slot='invoker'][expanded='true'] button {
        border-bottom: none;
      }

      .options > [slot='content'] {
        border-bottom: 1px solid #bbb;
        padding: 10px;
      }

      h3[slot='invoker']:first-child button {
        border-top: 1px solid #bbb;
      }

      h4 {
        font-weight: normal;
        font-size: 14px;
        margin: 5px 0;
      }

      .segmented-control {
        border: 1px solid var(--primary-color, #3f51b5);
        border-radius: 18px;
        display: inline-block;
        font-size: 14px;
        margin-bottom: 10px;
      }

      .segmented-control span {
        padding: 5px 10px;
        display: inline-block;
        border-radius: 18px;
        margin: 2px 0;
      }

      .segmented-control label:first-child span {
        margin-left: 2px;
      }

      .segmented-control label:last-child span {
        margin-right: 2px;
      }

      .segmented-control label.selected span {
        background: var(--primary-color, #3f51b5);
        color: var(--primary-text-inverse-color, #eee);
      }

      .segmented-control label:focus-within span {
        box-shadow: 0 0 0 1px hsl(0deg 0% 100% / 40%), 0 0 0 4px rgb(31 117 203 / 48%);
      }

      .segmented-control input,
      .switch input {
        clip: rect(0 0 0 0);
        clip-path: inset(50%);
        height: 1px;
        overflow: hidden;
        position: absolute;
        white-space: nowrap;
        width: 1px;
      }

      select {
        display: block;
        padding: 5px;
        border: 1px solid #333;
        border-radius: 3px;
      }

      /** Showing/Hiding additional code blocks **/
      ::slotted(pre) {
        display: none;
      }

      :host([platform='web']) ::slotted(pre:nth-child(1)) {
        display: block;
      }
      :host([platform='android']) ::slotted(pre:nth-child(2)) {
        display: block;
      }
      :host([platform='ios']) ::slotted(pre:nth-child(3)) {
        display: block;
      }
    `}}export{V as M,D as S};
