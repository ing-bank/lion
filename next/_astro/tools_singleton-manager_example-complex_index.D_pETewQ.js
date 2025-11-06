import{i as p,a as d}from"./lit-element.qDHKJJma.js";import{x as o}from"./lit-html.C7L4dwLU.js";import{s as c}from"./index.BNCfcFQh.js";let u=class{name="OverlayManager 1.x";blockBody=!1;constructor(){this._setupBlocker()}_setupBlocker(){const e=document.createElement("div");e.setAttribute("style","border: 2px solid #8d0606; margin: 10px; padding: 10px; width: 140px; text-align: center;"),e.innerText=`Blocker for ${this.name}`,document.getElementById("overlay-target").appendChild(e),this.blocker=e}block(){this.blockBody=!0,this.blocker.style.backgroundColor="#ff6161"}unBlock(){this.blockBody=!1,this.blocker.style.backgroundColor="transparent"}},n,l;const r=document.createElement("div");r.setAttribute("style","border: 2px solid #8d0606; margin: 10px; padding: 10px; width: 140px; text-align: center;");r.innerText="Shared Blocker for App";document.body.appendChild(r);class k extends u{constructor(){super(),this.name="Compatible1 from App"}block(e=!0){super.block(),e&&l.blockBody(!1)}unBlock(e=!0){super.unBlock(),e&&l.unBlockBody(!1)}_setupBlocker(){this.blocker=r}}class g extends u{constructor(){super(),this.name="Compatible2 from App"}blockBody(e=!0){super.blockBody(),e&&n.block()}unBlockBody(e=!0){super.unBlockBody(),e&&n.unBlock()}_setupBlocker(){this.blocker=r}}n=new k;l=new g;c.set("overlays::overlays::1.x",n);c.set("overlays::overlays::2.x",l);const a=c.get("overlays::overlays::1.x")||new u;class m extends p{static get styles(){return d`
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
    `}}customElements.define("page-a",m);class y{name="OverlayManager 2.x";_blockBody=!1;constructor(){this._setupBlocker()}_setupBlocker(){const e=document.createElement("div");e.setAttribute("style","border: 2px solid #8d0606; margin: 10px; padding: 10px; width: 140px; text-align: center;"),e.innerText=`Blocker for ${this.name}`,document.getElementById("overlay-target").appendChild(e),this.blocker=e}blockBody(){this._blockBody=!0,this.blocker.style.backgroundColor="#ff6161"}unBlockBody(){this._blockBody=!1,this.blocker.style.backgroundColor="transparent"}}const s=c.get("overlays::overlays::2.x")||new y;class h extends p{getInstance(e,i){const b=new CustomEvent("request-instance",{detail:{key:e},bubbles:!0,cancelable:!0,composed:!0});return this.dispatchEvent(b),b.detail.instance||i()}connectedCallback(){super.connectedCallback()}static get styles(){return d`
      :host {
        display: block;
        padding: 10px;
        border: 2px solid #ccc;
      }
    `}render(){return o`
      <h3>I am page B</h3>
      <p>Overlays Status:</p>
      <p>Name: ${s.name}</p>
      <p>Blocked: ${s._blockBody}</p>
      <button @click=${()=>{s.blockBody(),this.requestUpdate()}}>block</button>
      <button @click=${()=>{s.unBlockBody(),this.requestUpdate()}}>un-block</button>
      <button @click=${()=>{this.requestUpdate()}}>refresh</button>
    `}}customElements.define("page-b",h);class B extends p{constructor(){super(),this.page="A"}static get properties(){return{page:{type:String}}}static get styles(){return d`
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
      ${this.page==="A"?o` <page-a></page-a> `:o` <page-b></page-b> `}
    `}}customElements.define("demo-app",B);
