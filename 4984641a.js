import{i as e,a as t,x as o}from"./b4be29f1.js";import{s}from"./4afec9a2.js";class n{name="OverlayManager 1.x";blockBody=!1;constructor(){this._setupBlocker()}_setupBlocker(){const e=document.createElement("div");e.setAttribute("style","border: 2px solid #8d0606; margin: 10px; padding: 10px; width: 140px; text-align: center;"),e.innerText=`Blocker for ${this.name}`;document.getElementById("overlay-target").appendChild(e),this.blocker=e}block(){this.blockBody=!0,this.blocker.style.backgroundColor="#ff6161"}unBlock(){this.blockBody=!1,this.blocker.style.backgroundColor="transparent"}}const r=new class extends n{constructor(){super(),this.name="Compatible from App",this.blocker.innerText=`Blocker for ${this.name}`}blockingBody(){this.block()}unBlockingBody(){this.unBlock()}};s.set("overlays::overlays::1.x",r),s.set("overlays::overlays::2.x",r);const a=s.get("overlays::overlays::1.x")||new n;customElements.define("page-e",class extends e{static get styles(){return t`
      :host {
        display: block;
        padding: 10px;
        border: 2px solid #ccc;
      }
    `}render(){return o`
      <h3>I am page A</h3>
      <p>Overlays Status:</p>
      <p>Name: ${a.name}</p>
      <p>Blocked: ${a.blockBody}</p>
      <button @click=${()=>{a.block(),this.requestUpdate()}}>block</button>
      <button @click=${()=>{a.unBlock(),this.requestUpdate()}}>un-block</button>
      <button @click=${()=>{this.requestUpdate()}}>refresh</button>
    `}});const c=s.get("overlays::overlays::2.x")||new class{name="OverlayManager 2.x";blockBody=!1;constructor(){this._setupBlocker()}_setupBlocker(){const e=document.createElement("div");e.setAttribute("style","border: 2px solid #8d0606; margin: 10px; padding: 10px; width: 140px; text-align: center;"),e.innerText=`Blocker for ${this.name}`;document.getElementById("overlay-target").appendChild(e),this.blocker=e}blockingBody(){this.blockBody=!0,this.blocker.style.backgroundColor="#ff6161"}unBlockingBody(){this.blockBody=!1,this.blocker.style.backgroundColor="transparent"}};customElements.define("page-f",class extends e{static get styles(){return t`
      :host {
        display: block;
        padding: 10px;
        border: 2px solid #ccc;
      }
    `}render(){return o`
      <h3>I am page B</h3>
      <p>Overlays Status:</p>
      <p>Name: ${c.name}</p>
      <p>Blocked: ${c.blockBody}</p>
      <button @click=${()=>{c.blockingBody(),this.requestUpdate()}}>block</button>
      <button @click=${()=>{c.unBlockingBody(),this.requestUpdate()}}>un-block</button>
      <button @click=${()=>{this.requestUpdate()}}>refresh</button>
    `}});customElements.define("demo-app-success",class extends e{constructor(){super(),this.page="A"}static get properties(){return{page:{type:String}}}static get styles(){return t`
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
      ${"A"===this.page?o` <page-e></page-e> `:o` <page-f></page-f> `}
    `}});
