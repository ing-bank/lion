import{_ as e}from"./preload-helper.4zY6-HO4.js";import{i as l,a as h}from"./lit-element.qDHKJJma.js";import{x as s}from"./lit-html.C7L4dwLU.js";import{L as p}from"./LocalizeMixin.VYu75dkK.js";class m extends p(l){static get styles(){return[h`
        :host {
          cursor: default;
        }

        ul {
          list-style: none;
          padding: 0;
          text-align: center;
        }

        li {
          display: inline-block;
        }

        button[aria-current='true'] {
          font-weight: bold;
        }
      `]}static get localizeNamespaces(){return[{"lion-pagination":t=>{switch(t){case"bg-BG":return e(()=>import("./bg.CiDfi_Ac.js"),[]);case"cs-CZ":return e(()=>import("./cs.Cbq8FOwp.js"),[]);case"de-AT":case"de-DE":return e(()=>import("./de.BGemJ2Pa.js"),[]);case"en-AU":case"en-GB":case"en-PH":case"en-US":return e(()=>import("./en.Kd0M3ta6.js"),[]);case"es-ES":return e(()=>import("./es.UzPGLGuF.js"),[]);case"fr-FR":case"fr-BE":return e(()=>import("./fr.Bkw7nZlI.js"),[]);case"hu-HU":return e(()=>import("./hu.BpzqSgYY.js"),[]);case"it-IT":return e(()=>import("./it.C5QRzKeh.js"),[]);case"nl-BE":case"nl-NL":return e(()=>import("./nl.Cvy-mIRV.js"),[]);case"pl-PL":return e(()=>import("./pl.DXzJbmqO.js"),[]);case"ro-RO":return e(()=>import("./ro.CWPwI493.js"),[]);case"ru-RU":return e(()=>import("./ru.Bp6CpecO.js"),[]);case"sk-SK":return e(()=>import("./sk.ef8rJ6cn.js"),[]);case"tr-TR":return e(()=>import("./tr.C502NONG.js"),[]);case"uk-UA":return e(()=>import("./uk.Bra3QmBe.js"),[]);case"zh-CN":return e(()=>import("./zh.brvFp_l7.js"),[]);default:return e(()=>import("./en.Kd0M3ta6.js"),[])}}},...super.localizeNamespaces]}static get properties(){return{current:{type:Number,reflect:!0},count:{type:Number,reflect:!0}}}set current(t){if(t!==this.current){const r=this.current;this.__current=t,this.dispatchEvent(new Event("current-changed")),this.requestUpdate("current",r)}}get current(){return this.__current||0}constructor(){super(),this.__visiblePages=5,this.current=1,this.count=0}next(){this.current<this.count&&this.__fire(this.current+1)}first(){this.count>=1&&this.__fire(1)}last(){this.count>=1&&this.__fire(this.count)}goto(t){t>=1&&t<=this.count&&this.__fire(t)}previous(){this.current!==1&&this.__fire(this.current-1)}__fire(t){t!==this.current&&(this.current=t)}__calculateNavList(){const r=this.count;if(this.count>this.__visiblePages){const _=this.current-1,n=this.current,a=this.current+1;if(n<=4){const i=[...Array(this.__visiblePages)].map((u,o)=>1+o);return i.push("..."),i.push(this.count),i}if(r-n<=3){const i=[];i.push(1),i.push("...");const u=[...Array(this.__visiblePages)].map((o,c)=>this.count-this.__visiblePages+1+c);return i.concat(u)}return[1,"...",_,n,a,"...",r]}return[...Array(r-1+1)].map((_,n)=>1+n)}_prevNextIconTemplate(t){return t==="next"?s` &gt; `:s` &lt; `}_prevNextButtonTemplate(t,r,_="lion"){return s`
      <li>
        <button
          aria-label=${this.msgLit(`${_}-pagination:${t}`)}
          @click=${()=>this.__fire(r)}
        >
          ${this._prevNextIconTemplate(t)}
        </button>
      </li>
    `}_disabledButtonTemplate(t){return s`
      <li>
        <button disabled>${this._prevNextIconTemplate(t)}</button>
      </li>
    `}_renderNavList(){return this.__calculateNavList().map(t=>t==="..."?s` <li><span>${t}</span></li> `:s`
            <li>
              <button
                aria-label="${this.msgLit("lion-pagination:page",{page:t})}"
                aria-current=${t===this.current}
                aria-live="${t===this.current?"polite":"off"}"
                @click=${()=>this.__fire(t)}
              >
                ${t}
              </button>
            </li>
          `)}render(){return s`
      <nav role="navigation" aria-label="${this.msgLit("lion-pagination:label")}">
        <ul>
          ${this.current>1?this._prevNextButtonTemplate("previous",this.current-1):this._disabledButtonTemplate("previous")}
          ${this._renderNavList()}
          ${this.current<this.count?this._prevNextButtonTemplate("next",this.current+1):this._disabledButtonTemplate("next")}
        </ul>
      </nav>
    `}}customElements.define("lion-pagination",m);
