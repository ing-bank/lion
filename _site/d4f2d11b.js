import{i as e,a as i}from"./b4be29f1.js";import{O as t}from"./65cdf028.js";import{A as o}from"./5254a80b.js";import{w as n}from"./7be278a3.js";class r extends(o(t(e))){static get properties(){return{invokerRelation:{type:String,attribute:"invoker-relation"}}}static get styles(){return[...super.styles,i`
        :host {
          display: inline-block;
        }

        :host([hidden]) {
          display: none;
        }

        ::slotted([slot='content']) {
          width: max-content;
        }
      `]}constructor(){super(),this.hasArrow=!1,this.invokerRelation="description"}static enabledWarnings=super.enabledWarnings?.filter(e=>"change-in-update"!==e)||[];_defineOverlayConfig(){const e=super._defineOverlayConfig(),i=n({invokerRelation:this.invokerRelation});return{...e,...i,popperConfig:{...e.popperConfig||{},...i.popperConfig||{},modifiers:[...e.popperConfig?.modifiers||[],...i.popperConfig?.modifiers||[]]}}}}customElements.define("lion-tooltip",r);export{r as L};
