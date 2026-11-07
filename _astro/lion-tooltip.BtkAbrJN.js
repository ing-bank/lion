import{a as o,i as t}from"./lit-element.BOikny4r.js";import{O as n}from"./OverlayMixin.BXBzDSqx.js";import{A as r}from"./ArrowMixin._eTskhTC.js";import{w as s}from"./withTooltipConfig.DtmcPaJW.js";class p extends r(n(o)){static get properties(){return{invokerRelation:{type:String,attribute:"invoker-relation"}}}static get styles(){return[...super.styles,t`
        :host {
          display: inline-block;
        }

        :host([hidden]) {
          display: none;
        }

        ::slotted([slot='content']) {
          width: max-content;
        }
      `]}constructor(){super(),this.hasArrow=!1,this.invokerRelation="description"}static enabledWarnings=super.enabledWarnings?.filter(i=>i!=="change-in-update")||[];_defineOverlayConfig(){const i=super._defineOverlayConfig(),e=s({invokerRelation:this.invokerRelation});return{...i,...e,popperConfig:{...i.popperConfig||{},...e.popperConfig||{},modifiers:[...i.popperConfig?.modifiers||[],...e.popperConfig?.modifiers||[]]}}}}customElements.define("lion-tooltip",p);export{p as L};
