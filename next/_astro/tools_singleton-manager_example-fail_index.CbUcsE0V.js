import{i as s,a as n}from"./lit-element.qDHKJJma.js";import{x as t}from"./lit-html.C7L4dwLU.js";let l=class{name="OverlayManager 1.x";blockBody=!1;constructor(){this._setupBlocker()}_setupBlocker(){const e=document.createElement("div");e.setAttribute("style","border: 2px solid #8d0606; margin: 10px; padding: 10px; width: 180px; text-align: center;"),e.innerText=`Blocker for ${this.name}`,document.getElementById("overlay-target").appendChild(e),this.blocker=e}block(){this.blockBody=!0,this.blocker.style.backgroundColor="#ff6161"}unBlock(){this.blockBody=!1,this.blocker.style.backgroundColor="transparent"}};const r=new l;class i extends s{static get styles(){return n`
      :host {
        display: block;
        padding: 10px;
        border: 2px solid #ccc;
      }
    `}render(){return t`
      <h3>I am page A</h3>
      <p>Overlays Status:</p>
      <p>Name: ${r.name}</p>
      <p>Blocked: ${r.blockBody}</p>
      <button @click=${()=>{r.block(),this.requestUpdate()}}>block</button>
      <button @click=${()=>{r.unBlock(),this.requestUpdate()}}>un-block</button>
      <button @click=${()=>{this.requestUpdate()}}>refresh</button>
    `}}customElements.define("page-c",i);class d{name="OverlayManager 2.x";_blockBody=!1;constructor(){this._setupBlocker()}_setupBlocker(){const e=document.createElement("div");e.setAttribute("style","border: 2px solid #8d0606; margin: 10px; padding: 10px; width: 180px; text-align: center;"),e.innerText=`Blocker for ${this.name}`,document.getElementById("overlay-target").appendChild(e),this.blocker=e}blockBody(){this._blockBody=!0,this.blocker.style.backgroundColor="#ff6161"}unBlockBody(){this._blockBody=!1,this.blocker.style.backgroundColor="transparent"}}const a=new d;class p extends s{static get styles(){return n`
      :host {
        display: block;
        padding: 10px;
        border: 2px solid #ccc;
      }
    `}render(){return t`
      <h3>I am page B</h3>
      <p>Overlays Status:</p>
      <p>Name: ${a.name}</p>
      <p>Blocked: ${a._blockBody}</p>
      <button @click=${()=>{a.blockBody(),this.requestUpdate()}}>block</button>
      <button @click=${()=>{a.unBlockBody(),this.requestUpdate()}}>un-block</button>
      <button @click=${()=>{this.requestUpdate()}}>refresh</button>
    `}}customElements.define("page-d",p);class u extends s{constructor(){super(),this.page="A"}static get properties(){return{page:{type:String}}}static get styles(){return n`
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
    `}render(){return t`
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
      ${this.page==="A"?t` <page-c></page-c> `:t` <page-d></page-d> `}
    `}}customElements.define("demo-app-fail",u);
