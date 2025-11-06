import{i as e,a as t,E as i,x as s,B as n}from"./b4be29f1.js";import{e as r}from"./19d2607c.js";import{s as o}from"./4afec9a2.js";import{l as a}from"./11b71ee2.js";class c{constructor(){this.__iconResolvers=new Map}addIconResolver(e,t){if(this.__iconResolvers.has(e))throw new Error(`An icon resolver has already been registered for namespace: ${e}`);this.__iconResolvers.set(e,t)}removeIconResolver(e){this.__iconResolvers.delete(e)}resolveIcon(e,t,i){const s=this.__iconResolvers.get(e);if(s)return s(t,i);throw new Error(`Could not find any icon resolver for namespace ${e}.`)}resolveIconForId(e){const t=e.split(":");if(3!==t.length)throw new Error(`Incorrect iconId: ${e}. Format: <namespace>:<iconset>:<icon>`);return this.resolveIcon(t[0],t[1],t[2])}}const l=a(function(){if(!o.has("@lion/ui::icons::0.x")){const e=new c;o.set("@lion/ui::icons::0.x",e)}return o.get("@lion/ui::icons::0.x")});class h extends e{static get properties(){return{svg:{attribute:!1},ariaLabel:{type:String,attribute:"aria-label",reflect:!0},iconId:{type:String,attribute:"icon-id"}}}static get styles(){return[t`
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
      `]}constructor(){super(),this.ariaLabel="",this.iconId="",this.__svg=i}static enabledWarnings=super.enabledWarnings?.filter(e=>"change-in-update"!==e)||[];update(e){super.update(e),e.has("ariaLabel")&&this._onLabelChanged(),e.has("iconId")&&this._onIconIdChanged(e.get("iconId"))}render(){return s`<slot></slot>`}connectedCallback(){this._onLabelChanged(),super.connectedCallback(),this.setAttribute("role","img")}set svg(e){this.__svg=e,null==e?this._renderSvg(i):this._renderSvg(function(e){const t=e&&e.default?e.default:e;return"function"==typeof t?t(s):t}(e))}get svg(){return this.__svg}_onLabelChanged(){this.ariaLabel?this.setAttribute("aria-hidden","false"):(this.setAttribute("aria-hidden","true"),this.removeAttribute("aria-label"))}_renderSvg(e){!function(e){if(e!==i&&!r(e))throw new Error('icon accepts only lit-html templates or functions like "tag => tag`<svg>...</svg>`"')}(e),n(e,this),this.firstElementChild&&this.firstElementChild.setAttribute("aria-hidden","true")}get _iconManager(){return l}async _onIconIdChanged(e){if(this.iconId){const e=this.iconId;try{const t=await this._iconManager.resolveIconForId(e);this.iconId===e&&(this.svg=t)}catch(e){console.error(e)}}else e&&(this.svg=i)}}customElements.define("lion-icon",h);export{l as i};
