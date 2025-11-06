import{i as n,a as c}from"./lit-element.qDHKJJma.js";import{x as o}from"./lit-html.C7L4dwLU.js";import{s as a}from"./index.BNCfcFQh.js";let l=class{name="OverlayManager 1.x";blockBody=!1;constructor(){this._setupBlocker()}_setupBlocker(){const e=document.createElement("div");e.setAttribute("style","border: 2px solid #8d0606; margin: 10px; padding: 10px; width: 140px; text-align: center;"),e.innerText=`Blocker for ${this.name}`,document.getElementById("overlay-target").appendChild(e),this.blocker=e}block(){this.blockBody=!0,this.blocker.style.backgroundColor="#ff6161"}unBlock(){this.blockBody=!1,this.blocker.style.backgroundColor="transparent"}};class d extends l{constructor(){super(),this.name="Compatible from App",this.blocker.innerText=`Blocker for ${this.name}`}blockingBody(){this.block()}unBlockingBody(){this.unBlock()}}const i=new d;a.set("overlays::overlays::1.x",i);a.set("overlays::overlays::2.x",i);const r=a.get("overlays::overlays::1.x")||new l;class u extends n{static get styles(){return c`
      :host {
        display: block;
        padding: 10px;
        border: 2px solid #ccc;
      }
    `}render(){return o`
      <h3>I am page A</h3>
      <p>Overlays Status:</p>
      <p>Name: ${r.name}</p>
      <p>Blocked: ${r.blockBody}</p>
      <button @click=${()=>{r.block(),this.requestUpdate()}}>block</button>
      <button @click=${()=>{r.unBlock(),this.requestUpdate()}}>un-block</button>
      <button @click=${()=>{this.requestUpdate()}}>refresh</button>
    `}}customElements.define("page-e",u);class b{name="OverlayManager 2.x";blockBody=!1;constructor(){this._setupBlocker()}_setupBlocker(){const e=document.createElement("div");e.setAttribute("style","border: 2px solid #8d0606; margin: 10px; padding: 10px; width: 140px; text-align: center;"),e.innerText=`Blocker for ${this.name}`,document.getElementById("overlay-target").appendChild(e),this.blocker=e}blockingBody(){this.blockBody=!0,this.blocker.style.backgroundColor="#ff6161"}unBlockingBody(){this.blockBody=!1,this.blocker.style.backgroundColor="transparent"}}const s=a.get("overlays::overlays::2.x")||new b;class g extends n{static get styles(){return c`
      :host {
        display: block;
        padding: 10px;
        border: 2px solid #ccc;
      }
    `}render(){return o`
      <h3>I am page B</h3>
      <p>Overlays Status:</p>
      <p>Name: ${s.name}</p>
      <p>Blocked: ${s.blockBody}</p>
      <button @click=${()=>{s.blockingBody(),this.requestUpdate()}}>block</button>
      <button @click=${()=>{s.unBlockingBody(),this.requestUpdate()}}>un-block</button>
      <button @click=${()=>{this.requestUpdate()}}>refresh</button>
    `}}customElements.define("page-f",g);class k extends n{constructor(){super(),this.page="A"}static get properties(){return{page:{type:String}}}static get styles(){return c`
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
          class="${this.page==="A"?"active":""}"
          @click=${()=>{this.page="A"}}
        >
          Page A
        </button>
        <button
          class="${this.page==="B"?"active":""}"
          @click=${()=>{this.page="B"}}
        >
          Page B
        </button>
      </nav>
      ${this.page==="A"?o` <page-e></page-e> `:o` <page-f></page-f> `}
    `}}customElements.define("demo-app-success",k);
