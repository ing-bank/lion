const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.DYUong5B.js","_astro/node-tools_providence-analytics_overview.LFFQBZzG.js","_astro/lit-element.qDHKJJma.js","_astro/lit-html.C7L4dwLU.js","_astro/unsafe-html.J0GGe2Q7.js","_astro/directive.CGE4aKEl.js","_astro/define.m2CvvXyF.js"])))=>i.map(i=>d[i]);
import{_ as r}from"./preload-helper.4zY6-HO4.js";import"./node-tools_providence-analytics_overview.LFFQBZzG.js";import{a as e}from"./lit-element.qDHKJJma.js";import{x as t}from"./lit-html.C7L4dwLU.js";import"./unsafe-html.J0GGe2Q7.js";import{L as n}from"./LionButton.B9nVXwmc.js";import"./directive.CGE4aKEl.js";import"./DisabledWithTabIndexMixin.DiSGvuwH.js";import"./DisabledMixin.Bm1nsErI.js";import"./dedupeMixin.6XPTJgK8.js";class a extends n{static properties={variant:{type:String,reflect:!0}};static styles=[...super.styles,e`
      :host {
        --bs-border-radius: 0.375rem;
        --bs-border-width: 1px;

        --bs-btn-font-family:
          system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', 'Noto Sans',
          'Liberation Sans', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
          'Segoe UI Symbol', 'Noto Color Emoji';
        margin: 0.25rem 0.125rem;

        --bs-btn-padding-x: 0.75rem;
        --bs-btn-padding-y: 0.375rem;
        --bs-btn-font-size: 1rem;
        --bs-btn-font-weight: 400;
        --bs-btn-line-height: 1.5;
        --bs-btn-color: var(--bs-body-color);
        --bs-btn-bg: transparent;
        --bs-btn-border-width: var(--bs-border-width);
        --bs-btn-border-color: transparent;
        --bs-btn-border-radius: var(--bs-border-radius);
        --bs-btn-hover-border-color: transparent;
        --bs-btn-box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 1px 1px rgba(0, 0, 0, 0.075);
        --bs-btn-disabled-opacity: 0.65;
        --bs-btn-focus-box-shadow: 0 0 0 0.25rem rgba(var(--bs-btn-focus-shadow-rgb), 0.5);
        display: inline-block;
        padding: var(--bs-btn-padding-y) var(--bs-btn-padding-x);
        font-family: var(--bs-btn-font-family);
        font-size: var(--bs-btn-font-size);
        font-weight: var(--bs-btn-font-weight);
        line-height: var(--bs-btn-line-height);
        color: var(--bs-btn-color);
        text-align: center;
        text-decoration: none;
        vertical-align: middle;
        cursor: pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
        border: var(--bs-btn-border-width) solid var(--bs-btn-border-color);
        border-radius: var(--bs-btn-border-radius);
        background-color: var(--bs-btn-bg);
        transition:
          color 0.15s ease-in-out,
          background-color 0.15s ease-in-out,
          border-color 0.15s ease-in-out,
          box-shadow 0.15s ease-in-out;
        text-transform: none;
      }

      :host(:not([disabled])) {
        cursor: pointer;
      }

      :host(:hover) {
        color: var(--bs-btn-hover-color);
        background-color: var(--bs-btn-hover-bg);
        border-color: var(--bs-btn-hover-border-color);
      }

      :host(:active),
      :host([active]) {
        color: var(--bs-btn-active-color);
        background-color: var(--bs-btn-active-bg);
        border-color: var(--bs-btn-active-border-color);
      }

      :host([variant='primary']) {
        --bs-btn-color: #fff;
        --bs-btn-bg: #0d6efd;
        --bs-btn-border-color: #0d6efd;
        --bs-btn-hover-color: #fff;
        --bs-btn-hover-bg: #0b5ed7;
        --bs-btn-hover-border-color: #0a58ca;
        --bs-btn-focus-shadow-rgb: 49, 132, 253;
        --bs-btn-active-color: #fff;
        --bs-btn-active-bg: #0a58ca;
        --bs-btn-active-border-color: #0a53be;
        --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
        --bs-btn-disabled-color: #fff;
        --bs-btn-disabled-bg: #0d6efd;
        --bs-btn-disabled-border-color: #0d6efd;
      }

      :host([variant='secondary']) {
        --bs-btn-color: #fff;
        --bs-btn-bg: #6c757d;
        --bs-btn-border-color: #6c757d;
        --bs-btn-hover-color: #fff;
        --bs-btn-hover-bg: #5c636a;
        --bs-btn-hover-border-color: #565e64;
        --bs-btn-focus-shadow-rgb: 130, 138, 145;
        --bs-btn-active-color: #fff;
        --bs-btn-active-bg: #565e64;
        --bs-btn-active-border-color: #51585e;
        --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
        --bs-btn-disabled-color: #fff;
        --bs-btn-disabled-bg: #6c757d;
        --bs-btn-disabled-border-color: #6c757d;
      }

      :host([variant='success']) {
        --bs-btn-color: #fff;
        --bs-btn-bg: #198754;
        --bs-btn-border-color: #198754;
        --bs-btn-hover-color: #fff;
        --bs-btn-hover-bg: #157347;
        --bs-btn-hover-border-color: #146c43;
        --bs-btn-focus-shadow-rgb: 60, 153, 110;
        --bs-btn-active-color: #fff;
        --bs-btn-active-bg: #146c43;
        --bs-btn-active-border-color: #13653f;
        --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
        --bs-btn-disabled-color: #fff;
        --bs-btn-disabled-bg: #198754;
        --bs-btn-disabled-border-color: #198754;
      }

      :host([variant='danger']) {
        --bs-btn-color: #fff;
        --bs-btn-bg: #dc3545;
        --bs-btn-border-color: #dc3545;
        --bs-btn-hover-color: #fff;
        --bs-btn-hover-bg: #bb2d3b;
        --bs-btn-hover-border-color: #b02a37;
        --bs-btn-focus-shadow-rgb: 225, 83, 97;
        --bs-btn-active-color: #fff;
        --bs-btn-active-bg: #b02a37;
        --bs-btn-active-border-color: #a52834;
        --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
        --bs-btn-disabled-color: #fff;
        --bs-btn-disabled-bg: #dc3545;
        --bs-btn-disabled-border-color: #dc3545;
      }

      :host([variant='warning']) {
        --bs-btn-color: #000;
        --bs-btn-bg: #ffc107;
        --bs-btn-border-color: #ffc107;
        --bs-btn-hover-color: #000;
        --bs-btn-hover-bg: #ffca2c;
        --bs-btn-hover-border-color: #ffc720;
        --bs-btn-focus-shadow-rgb: 217, 164, 6;
        --bs-btn-active-color: #000;
        --bs-btn-active-bg: #ffcd39;
        --bs-btn-active-border-color: #ffc720;
        --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
        --bs-btn-disabled-color: #000;
        --bs-btn-disabled-bg: #ffc107;
        --bs-btn-disabled-border-color: #ffc107;
      }

      :host([variant='info']) {
        --bs-btn-color: #000;
        --bs-btn-bg: #0dcaf0;
        --bs-btn-border-color: #0dcaf0;
        --bs-btn-hover-color: #000;
        --bs-btn-hover-bg: #31d2f2;
        --bs-btn-hover-border-color: #25cff2;
        --bs-btn-focus-shadow-rgb: 11, 172, 204;
        --bs-btn-active-color: #000;
        --bs-btn-active-bg: #3dd5f3;
        --bs-btn-active-border-color: #25cff2;
        --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
        --bs-btn-disabled-color: #000;
        --bs-btn-disabled-bg: #0dcaf0;
        --bs-btn-disabled-border-color: #0dcaf0;
      }

      :host([variant='light']) {
        --bs-btn-color: #000;
        --bs-btn-bg: #f8f9fa;
        --bs-btn-border-color: #f8f9fa;
        --bs-btn-hover-color: #000;
        --bs-btn-hover-bg: #d3d4d5;
        --bs-btn-hover-border-color: #c6c7c8;
        --bs-btn-focus-shadow-rgb: 211, 212, 213;
        --bs-btn-active-color: #000;
        --bs-btn-active-bg: #c6c7c8;
        --bs-btn-active-border-color: #babbbc;
        --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
        --bs-btn-disabled-color: #000;
        --bs-btn-disabled-bg: #f8f9fa;
        --bs-btn-disabled-border-color: #f8f9fa;
      }

      :host([variant='dark']) {
        --bs-btn-color: #fff;
        --bs-btn-bg: #212529;
        --bs-btn-border-color: #212529;
        --bs-btn-hover-color: #fff;
        --bs-btn-hover-bg: #424649;
        --bs-btn-hover-border-color: #373b3e;
        --bs-btn-focus-shadow-rgb: 66, 70, 73;
        --bs-btn-active-color: #fff;
        --bs-btn-active-bg: #4d5154;
        --bs-btn-active-border-color: #373b3e;
        --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
        --bs-btn-disabled-color: #fff;
        --bs-btn-disabled-bg: #212529;
        --bs-btn-disabled-border-color: #212529;
      }

      :host([variant='link']) {
        --bs-btn-font-weight: 400;
        --bs-btn-color: var(--bs-link-color);
        --bs-btn-bg: transparent;
        --bs-btn-border-color: transparent;
        --bs-btn-hover-color: var(--bs-link-hover-color);
        --bs-btn-hover-border-color: transparent;
        --bs-btn-active-color: var(--bs-link-hover-color);
        --bs-btn-active-border-color: transparent;
        --bs-btn-disabled-color: #6c757d;
        --bs-btn-disabled-border-color: transparent;
        --bs-btn-box-shadow: 0 0 0 #000;
        --bs-btn-focus-shadow-rgb: 49, 132, 253;
        text-decoration: underline;
      }
    `];constructor(){super(),this.variant="primary"}}customElements.define("bootstrap-button",a);const c=b=>b[0].toUpperCase()+b.slice(1),d=()=>t`<div>
    ${["primary","secondary","success","danger","warning","info","light","dark","link"].map(o=>t`<bootstrap-button variant="${o}">${c(o)}</bootstrap-button>`)}
  </div>`,i=document,l=[{key:"bootstrapButton",story:d}];let s=!1;for(const b of l){const o=i.querySelector(`[mdjs-story-name="${b.key}"]`);o&&(o.story=b.story,o.key=b.key,s=!0,Object.assign(o,{simulatorUrl:"/next/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}s&&(customElements.get("mdjs-preview")||r(()=>import("./define.DYUong5B.js"),__vite__mapDeps([0,1,2,3,4,5])),customElements.get("mdjs-story")||r(()=>import("./define.m2CvvXyF.js"),__vite__mapDeps([6,2,3])));export{d as bootstrapButton};
