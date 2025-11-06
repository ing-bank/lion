import{a as r,x as t}from"./b4be29f1.js";import{O as o}from"./65cdf028.js";import{d as e}from"./dc2f5f5a.js";const a=e(e=>class extends(o(e)){static get properties(){return{hasArrow:{type:Boolean,reflect:!0,attribute:"has-arrow"}}}static get styles(){return[...super.styles||[],r`
          :host {
            --tooltip-arrow-width: 12px;
            --tooltip-arrow-height: 8px;
          }

          .arrow svg {
            display: block;
          }

          .arrow {
            position: absolute;
            width: var(--tooltip-arrow-width);
            height: var(--tooltip-arrow-height);
          }

          .arrow__graphic {
            display: block;
          }

          [data-popper-placement^='top'] .arrow {
            bottom: calc(-1 * var(--tooltip-arrow-height));
          }

          [data-popper-placement^='bottom'] .arrow {
            top: calc(-1 * var(--tooltip-arrow-height));
          }

          [data-popper-placement^='bottom'] .arrow__graphic {
            transform: rotate(180deg);
          }

          [data-popper-placement^='left'] .arrow {
            right: calc(
              -1 *
                (
                  var(--tooltip-arrow-height) +
                    (var(--tooltip-arrow-width) - var(--tooltip-arrow-height)) / 2
                )
            );
          }

          [data-popper-placement^='left'] .arrow__graphic {
            transform: rotate(270deg);
          }

          [data-popper-placement^='right'] .arrow {
            left: calc(
              -1 *
                (
                  var(--tooltip-arrow-height) +
                    (var(--tooltip-arrow-width) - var(--tooltip-arrow-height)) / 2
                )
            );
          }

          [data-popper-placement^='right'] .arrow__graphic {
            transform: rotate(90deg);
          }

          :host(:not([has-arrow])) .arrow {
            display: none;
          }
        `]}constructor(){super(),this.hasArrow=!0,this.__setupRepositionCompletePromise()}render(){return t`
        <slot name="invoker"></slot>
        <div id="overlay-content-node-wrapper">
          <slot name="content"></slot>
          ${this._arrowNodeTemplate()}
        </div>
      `}_arrowNodeTemplate(){return t`
        <div class="arrow" aria-hidden="true" data-popper-arrow>${this._arrowTemplate()}</div>
      `}_arrowTemplate(){return t`
        <svg viewBox="0 0 12 8" class="arrow__graphic">
          <path d="M 0,0 h 12 L 6,8 z"></path>
        </svg>
      `}_defineOverlayConfig(){const r=super._defineOverlayConfig()||{};return this.hasArrow?{...r,popperConfig:{...this._getPopperArrowConfig(r.popperConfig)}}:r}_getPopperArrowConfig(r){return{...r||{},placement:"top",modifiers:[{name:"arrow",enabled:!0,options:{padding:8}},{name:"offset",enabled:!0,options:{offset:[0,8]}},...r&&r.modifiers||[]],onFirstUpdate:r=>{this.__syncFromPopperState(r)},afterWrite:r=>{this.__syncFromPopperState(r)}}}__setupRepositionCompletePromise(){this.repositionComplete=new Promise(r=>{this.__repositionCompleteResolver=r})}get _arrowNode(){return this.shadowRoot.querySelector("[data-popper-arrow]")}__syncFromPopperState(r){r&&this._arrowNode&&r.placement!==this._arrowNode.placement&&(this.__repositionCompleteResolver(r.placement),this.__setupRepositionCompletePromise())}});export{a as A};
