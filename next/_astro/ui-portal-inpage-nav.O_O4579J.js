import{i as n,a as i}from"./lit-element.qDHKJJma.js";import{x as r,E as l}from"./lit-html.C7L4dwLU.js";const o="ui-portal-inpage-nav";class d extends n{static properties={navData:{type:Array,attribute:"nav-data"}};static styles=[i`
      @media (max-width: 899px) {
        :host {
          display: none;
        }
      }

      [data-part='nav'] {
        position: sticky;
        top: 20px;
        margin-left: 20px;
        margin-top: 100px;
      }

      [data-part='list'] {
        list-style-type: none;
        margin: 0;
        padding: 0 0 0 20px;
        border-left: 1px solid var(--primary-lines-color);
      }

      [data-part='anchor'] {
        color: inherit;
        text-decoration: inherit;
        font-size: 14px;
      }

      [data-part='anchor']:hover {
        text-decoration: underline;
      }

      h4 {
        font-weight: normal;
      }
    `];constructor(){super(),this.navData=[]}connectedCallback(){super.connectedCallback(),window&&window.setTimeout(()=>{const a=this.renderRoot.querySelectorAll('[data-part="nav"]');a.length>1&&a[1].remove()})}render(){return r`
      <nav data-part="nav" aria-labelledby="inpage-nav-title">
        <h4 id="inpage-nav-title">Contents</h4>
        ${this._renderNavLevel({children:this.navData})}
      </nav>
    `}_renderNavLevel({children:a,level:e=0}){return r`
      <ul data-part="list" data-level="${e}">
        ${a.map(t=>r`<li data-part="listitem">
              <a data-part="anchor" data-level="${e}" href="#${t.url}">${t.name}</a>
              ${t.children?.length?this._renderNavLevel({children:t.children,level:e+1}):l}
            </li>`)}
      </ul>
    `}}customElements.define(o,d);export{d as UIPortalInpageNav};
