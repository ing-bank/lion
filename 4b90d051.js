import{i as t,a as e,x as o}from"./b4be29f1.js";const n=new class{name="OverlayManager 1.x";blockBody=!1;constructor(){this._setupBlocker()}_setupBlocker(){const t=document.createElement("div");t.setAttribute("style","border: 2px solid #8d0606; margin: 10px; padding: 10px; width: 180px; text-align: center;"),t.innerText=`Blocker for ${this.name}`;document.getElementById("overlay-target").appendChild(t),this.blocker=t}block(){this.blockBody=!0,this.blocker.style.backgroundColor="#ff6161"}unBlock(){this.blockBody=!1,this.blocker.style.backgroundColor="transparent"}};customElements.define("page-c",class extends t{static get styles(){return e`
      :host {
        display: block;
        padding: 10px;
        border: 2px solid #ccc;
      }
    `}render(){return o`
      <h3>I am page A</h3>
      <p>Overlays Status:</p>
      <p>Name: ${n.name}</p>
      <p>Blocked: ${n.blockBody}</p>
      <button @click=${()=>{n.block(),this.requestUpdate()}}>block</button>
      <button @click=${()=>{n.unBlock(),this.requestUpdate()}}>un-block</button>
      <button @click=${()=>{this.requestUpdate()}}>refresh</button>
    `}});const s=new class{name="OverlayManager 2.x";_blockBody=!1;constructor(){this._setupBlocker()}_setupBlocker(){const t=document.createElement("div");t.setAttribute("style","border: 2px solid #8d0606; margin: 10px; padding: 10px; width: 180px; text-align: center;"),t.innerText=`Blocker for ${this.name}`;document.getElementById("overlay-target").appendChild(t),this.blocker=t}blockBody(){this._blockBody=!0,this.blocker.style.backgroundColor="#ff6161"}unBlockBody(){this._blockBody=!1,this.blocker.style.backgroundColor="transparent"}};customElements.define("page-d",class extends t{static get styles(){return e`
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
    `}});customElements.define("demo-app-fail",class extends t{constructor(){super(),this.page="A"}static get properties(){return{page:{type:String}}}static get styles(){return e`
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
      ${"A"===this.page?o` <page-c></page-c> `:o` <page-d></page-d> `}
    `}});
