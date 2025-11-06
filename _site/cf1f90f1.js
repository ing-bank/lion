import{i as e,a as t,x as o}from"./b4be29f1.js";import{s}from"./4afec9a2.js";class n{name="OverlayManager 1.x";blockBody=!1;constructor(){this._setupBlocker()}_setupBlocker(){const e=document.createElement("div");e.setAttribute("style","border: 2px solid #8d0606; margin: 10px; padding: 10px; width: 140px; text-align: center;"),e.innerText=`Blocker for ${this.name}`;document.getElementById("overlay-target").appendChild(e),this.blocker=e}block(){this.blockBody=!0,this.blocker.style.backgroundColor="#ff6161"}unBlock(){this.blockBody=!1,this.blocker.style.backgroundColor="transparent"}}let r,c;const a=document.createElement("div");a.setAttribute("style","border: 2px solid #8d0606; margin: 10px; padding: 10px; width: 140px; text-align: center;"),a.innerText="Shared Blocker for App",document.body.appendChild(a);r=new class extends n{constructor(){super(),this.name="Compatible1 from App"}block(e=!0){super.block(),e&&c.blockBody(!1)}unBlock(e=!0){super.unBlock(),e&&c.unBlockBody(!1)}_setupBlocker(){this.blocker=a}},c=new class extends n{constructor(){super(),this.name="Compatible2 from App"}blockBody(e=!0){super.blockBody(),e&&r.block()}unBlockBody(e=!0){super.unBlockBody(),e&&r.unBlock()}_setupBlocker(){this.blocker=a}},s.set("overlays::overlays::1.x",r),s.set("overlays::overlays::2.x",c);const l=s.get("overlays::overlays::1.x")||new n;customElements.define("page-a",class extends e{static get styles(){return t`
      :host {
        display: block;
        padding: 10px;
        border: 2px solid #ccc;
      }
    `}render(){return o`
      <h3>I am page A</h3>
      <p>Overlays Status:</p>
      <p>Name: ${l.name}</p>
      <p>Blocked: ${l.blockBody}</p>
      <button @click=${()=>{l.block(),this.requestUpdate()}}>block</button>
      <button @click=${()=>{l.unBlock(),this.requestUpdate()}}>un-block</button>
      <button @click=${()=>{this.requestUpdate()}}>refresh</button>
    `}});const i=s.get("overlays::overlays::2.x")||new class{name="OverlayManager 2.x";_blockBody=!1;constructor(){this._setupBlocker()}_setupBlocker(){const e=document.createElement("div");e.setAttribute("style","border: 2px solid #8d0606; margin: 10px; padding: 10px; width: 140px; text-align: center;"),e.innerText=`Blocker for ${this.name}`;document.getElementById("overlay-target").appendChild(e),this.blocker=e}blockBody(){this._blockBody=!0,this.blocker.style.backgroundColor="#ff6161"}unBlockBody(){this._blockBody=!1,this.blocker.style.backgroundColor="transparent"}};customElements.define("page-b",class extends e{getInstance(e,t){const o=new CustomEvent("request-instance",{detail:{key:e},bubbles:!0,cancelable:!0,composed:!0});return this.dispatchEvent(o),o.detail.instance||t()}connectedCallback(){super.connectedCallback()}static get styles(){return t`
      :host {
        display: block;
        padding: 10px;
        border: 2px solid #ccc;
      }
    `}render(){return o`
      <h3>I am page B</h3>
      <p>Overlays Status:</p>
      <p>Name: ${i.name}</p>
      <p>Blocked: ${i._blockBody}</p>
      <button @click=${()=>{i.blockBody(),this.requestUpdate()}}>block</button>
      <button @click=${()=>{i.unBlockBody(),this.requestUpdate()}}>un-block</button>
      <button @click=${()=>{this.requestUpdate()}}>refresh</button>
    `}});customElements.define("demo-app",class extends e{constructor(){super(),this.page="A"}static get properties(){return{page:{type:String}}}static get styles(){return t`
      :host {
        display: block;
        max-width: 680px;
        margin: 0 auto;
      }

      nav {
        padding: 0 10px 10px 10px;
      }

      button {
        border: none;
        padding: 1rem 2rem;
        background: #0069ed;
        color: #fff;
        font-size: 1rem;
        cursor: pointer;
        text-align: center;
        transition:
          background 250ms ease-in-out,
          transform 150ms ease;
      }

      button:hover,
      button:focus {
        background: #0053ba;
      }

      button:focus {
        outline: 1px solid #fff;
        outline-offset: -4px;
      }

      button:active {
        transform: scale(0.99);
      }

      button.active {
        background: #33a43f;
      }

      h1 {
        text-align: center;
      }
    `}render(){return o`
      <h1>Demo App</h1>
      <nav>
        <button
          class="${"A"===this.page?"active":""}"
          @click=${()=>{this.page="A"}}
        >
          Page A
        </button>
        <button
          class="${"B"===this.page?"active":""}"
          @click=${()=>{this.page="B"}}
        >
          Page B
        </button>
      </nav>
      ${"A"===this.page?o` <page-a></page-a> `:o` <page-b></page-b> `}
    `}});
