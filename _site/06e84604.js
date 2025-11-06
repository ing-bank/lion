import{i as t,a as e,x as r}from"./b4be29f1.js";import{L as s}from"./4cc99b59.js";class i extends(s(t)){static get styles(){return[e`
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
      `]}static get localizeNamespaces(){return[{"lion-pagination":t=>{switch(t){case"bg-BG":return import("./c84b88a7.js");case"cs-CZ":return import("./1356eef5.js");case"de-AT":case"de-DE":return import("./017ddf10.js");case"en-AU":case"en-GB":case"en-PH":case"en-US":default:return import("./c616837d.js");case"es-ES":return import("./3eb5c222.js");case"fr-FR":case"fr-BE":return import("./741dae74.js");case"hu-HU":return import("./0930ae9c.js");case"it-IT":return import("./30cdd527.js");case"nl-BE":case"nl-NL":return import("./53a770ec.js");case"pl-PL":return import("./9d6e0c20.js");case"ro-RO":return import("./9e63c6a0.js");case"ru-RU":return import("./3b6e6c0d.js");case"sk-SK":return import("./1157d6c3.js");case"tr-TR":return import("./99f5df98.js");case"uk-UA":return import("./c37707f8.js");case"zh-CN":return import("./189b3660.js")}}},...super.localizeNamespaces]}static get properties(){return{current:{type:Number,reflect:!0},count:{type:Number,reflect:!0}}}set current(t){if(t!==this.current){const e=this.current;this.__current=t,this.dispatchEvent(new Event("current-changed")),this.requestUpdate("current",e)}}get current(){return this.__current||0}constructor(){super(),this.__visiblePages=5,this.current=1,this.count=0}next(){this.current<this.count&&this.__fire(this.current+1)}first(){this.count>=1&&this.__fire(1)}last(){this.count>=1&&this.__fire(this.count)}goto(t){t>=1&&t<=this.count&&this.__fire(t)}previous(){1!==this.current&&this.__fire(this.current-1)}__fire(t){t!==this.current&&(this.current=t)}__calculateNavList(){const t=this.count;if(this.count>this.__visiblePages){const e=this.current-1,r=this.current,s=this.current+1;if(r<=4){const t=[...Array(this.__visiblePages)].map((t,e)=>1+e);return t.push("..."),t.push(this.count),t}if(t-r<=3){const t=[];t.push(1),t.push("...");const e=[...Array(this.__visiblePages)].map((t,e)=>this.count-this.__visiblePages+1+e);return t.concat(e)}return[1,"...",e,r,s,"...",t]}return[...Array(t-1+1)].map((t,e)=>1+e)}_prevNextIconTemplate(t){return"next"===t?r` &gt; `:r` &lt; `}_prevNextButtonTemplate(t,e,s="lion"){return r`
      <li>
        <button
          aria-label=${this.msgLit(`${s}-pagination:${t}`)}
          @click=${()=>this.__fire(e)}
        >
          ${this._prevNextIconTemplate(t)}
        </button>
      </li>
    `}_disabledButtonTemplate(t){return r`
      <li>
        <button disabled>${this._prevNextIconTemplate(t)}</button>
      </li>
    `}_renderNavList(){return this.__calculateNavList().map(t=>"..."===t?r` <li><span>${t}</span></li> `:r`
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
          `)}render(){return r`
      <nav role="navigation" aria-label="${this.msgLit("lion-pagination:label")}">
        <ul>
          ${this.current>1?this._prevNextButtonTemplate("previous",this.current-1):this._disabledButtonTemplate("previous")}
          ${this._renderNavList()}
          ${this.current<this.count?this._prevNextButtonTemplate("next",this.current+1):this._disabledButtonTemplate("next")}
        </ul>
      </nav>
    `}}customElements.define("lion-pagination",i);
