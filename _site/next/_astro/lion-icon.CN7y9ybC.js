import{i as l,a as c}from"./lit-element.qDHKJJma.js";import{E as s,x as a,B as h}from"./lit-html.C7L4dwLU.js";import{e as d}from"./directive-helpers.CLllgGgm.js";import{s as o}from"./index.BNCfcFQh.js";import{l as u}from"./lazifyInstantiation.CgYLRMC3.js";class g{constructor(){this.__iconResolvers=new Map}addIconResolver(e,i){if(this.__iconResolvers.has(e))throw new Error(`An icon resolver has already been registered for namespace: ${e}`);this.__iconResolvers.set(e,i)}removeIconResolver(e){this.__iconResolvers.delete(e)}resolveIcon(e,i,n){const r=this.__iconResolvers.get(e);if(r)return r(i,n);throw new Error(`Could not find any icon resolver for namespace ${e}.`)}resolveIconForId(e){const i=e.split(":");if(i.length!==3)throw new Error(`Incorrect iconId: ${e}. Format: <namespace>:<iconset>:<icon>`);return this.resolveIcon(i[0],i[1],i[2])}}function f(){if(!o.has("@lion/ui::icons::0.x")){const t=new g;o.set("@lion/ui::icons::0.x",t)}return o.get("@lion/ui::icons::0.x")}const v=u(f);function I(t){const e=t&&t.default?t.default:t;return typeof e=="function"?e(a):e}function _(t){if(!(t===s||d(t)))throw new Error('icon accepts only lit-html templates or functions like "tag => tag`<svg>...</svg>`"')}class b extends l{static get properties(){return{svg:{attribute:!1},ariaLabel:{type:String,attribute:"aria-label",reflect:!0},iconId:{type:String,attribute:"icon-id"}}}static get styles(){return[c`
        :host {
          box-sizing: border-box;
          display: inline-block;
          width: 1em;
          height: 1em;
        }

        :host([hidden]) {
          display: none;
        }

        :host:first-child {
          margin-left: 0;
        }

        :host:last-child {
          margin-right: 0;
        }

        ::slotted(svg) {
          display: block;
          width: 100%;
          height: 100%;
        }
      `]}constructor(){super(),this.ariaLabel="",this.iconId="",this.__svg=s}static enabledWarnings=super.enabledWarnings?.filter(e=>e!=="change-in-update")||[];update(e){super.update(e),e.has("ariaLabel")&&this._onLabelChanged(),e.has("iconId")&&this._onIconIdChanged(e.get("iconId"))}render(){return a`<slot></slot>`}connectedCallback(){this._onLabelChanged(),super.connectedCallback(),this.setAttribute("role","img")}set svg(e){this.__svg=e,e==null?this._renderSvg(s):this._renderSvg(I(e))}get svg(){return this.__svg}_onLabelChanged(){this.ariaLabel?this.setAttribute("aria-hidden","false"):(this.setAttribute("aria-hidden","true"),this.removeAttribute("aria-label"))}_renderSvg(e){_(e),h(e,this),this.firstElementChild&&this.firstElementChild.setAttribute("aria-hidden","true")}get _iconManager(){return v}async _onIconIdChanged(e){if(!this.iconId)e&&(this.svg=s);else{const i=this.iconId;try{const n=await this._iconManager.resolveIconForId(i);this.iconId===i&&(this.svg=n)}catch(n){console.error(n)}}}}customElements.define("lion-icon",b);export{v as i};
