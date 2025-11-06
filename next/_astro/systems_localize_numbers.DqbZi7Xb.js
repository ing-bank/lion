const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.DYUong5B.js","_astro/node-tools_providence-analytics_overview.LFFQBZzG.js","_astro/lit-element.qDHKJJma.js","_astro/lit-html.C7L4dwLU.js","_astro/unsafe-html.J0GGe2Q7.js","_astro/directive.CGE4aKEl.js","_astro/define.m2CvvXyF.js"])))=>i.map(i=>d[i]);
import{_ as l}from"./preload-helper.4zY6-HO4.js";import"./node-tools_providence-analytics_overview.LFFQBZzG.js";import{a as c}from"./lit-element.qDHKJJma.js";import{x as r}from"./lit-html.C7L4dwLU.js";import"./unsafe-html.J0GGe2Q7.js";import{f as e,a as m}from"./formatNumber.aN4wfHaw.js";import{a as y}from"./all-locales.8DFhn3xF.js";import"./directive.CGE4aKEl.js";import"./getLocalizeManager.W5d_ICRU.js";import"./index.BNCfcFQh.js";import"./lazifyInstantiation.CgYLRMC3.js";import"./getLocale.PZ4ia-vo.js";const s=c`
  .demo-table {
    border-collapse: collapse;
    text-align: right;
  }
  .demo-table thead > tr {
    border-bottom: 1px solid grey;
  }
  .demo-table thead > tr > :first-child,
  .demo-table tbody > tr > :first-child,
  .demo-table tfoot > tr > :first-child {
    text-align: left;
  }
  .demo-table th,
  .demo-table td {
    padding: 8px;
  }
`,o=1234.56,n=()=>r`
  <style>
    ${s}
  </style>
  <table class="demo-table">
    <thead>
      <tr>
        <th>Options</th>
        <th>Output</th>
        <th>Code</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Default</td>
        <td>${e(o)}</td>
        <td></td>
      </tr>
      <tr>
        <td>Currency symbol</td>
        <td>
          ${e(o,{style:"currency",currencyDisplay:"symbol",currency:"EUR"})}
        </td>
        <td>
          <code
            >formatNumber({ style: 'currency', currencyDisplay: 'symbol', currency: 'EUR' })</code
          >
        </td>
      </tr>
      <tr>
        <td>Currency code</td>
        <td>
          ${e(o,{style:"currency",currencyDisplay:"code",currency:"EUR"})}
        </td>
        <td>
          <code>formatNumber({ style: 'currency', currencyDisplay: 'code', currency: 'EUR' })</code>
        </td>
      </tr>
      <tr>
        <td>Locale</td>
        <td>${e(o,{locale:"nl-NL"})}</td>
        <td><code>formatNumber({ locale: 'nl-NL' })</code></td>
      </tr>
      <tr>
        <td>No decimals</td>
        <td>
          ${e(o,{minimumFractionDigits:0,maximumFractionDigits:0})}
        </td>
        <td>
          <code>formatNumber({ minimumFractionDigits: 0, maximumFractionDigits: 0, })</code>
        </td>
      </tr>
    </tbody>
  </table>
`,i=()=>r`
  <style>
    ${s}
  </style>
  <table class="demo-table">
    <thead>
      <tr>
        <th>Part</th>
        <th>Output</th>
      </tr>
    </thead>
    <tbody>
      ${m(1234.56,{style:"currency",currency:"EUR"}).map(t=>r`
          <tr>
            <td>${t.type}</td>
            <td>${t.value}</td>
          </tr>
        `)}
    </tbody>
  </table>
`,u=()=>r`
  <style>
    ${s}
  </style>
  <table class="demo-table">
    <thead>
      <tr>
        <th>Locale</th>
        <th>Output Euro</th>
        <th>Output US Dollar</th>
      </tr>
    </thead>
    <tbody>
      ${["en-GB","en-US","nl-NL","nl-BE","fr-FR","de-DE"].map(t=>r`
          <tr>
            <td>${t}</td>
            <td>${e(1234.56,{locale:t,style:"currency",currency:"EUR"})}</td>
            <td>${e(1234.56,{locale:t,style:"currency",currency:"USD"})}</td>
          </tr>
        `)}
    </tbody>
  </table>
`,b=()=>r`
  <style>
    ${s}
  </style>
  <table class="demo-table">
    <tr>
      <th>Locale</th>
      <th>Output Euro</th>
      <th>Output US Dollar</th>
    </tr>
    ${Object.keys(y).map(t=>r`
        <tr>
          <td>${t}</td>
          <td>${e(1234.56,{locale:t,style:"currency",currency:"EUR"})}</td>
          <td>${e(1234.56,{locale:t,style:"currency",currency:"USD"})}</td>
        </tr>
      `)}
  </table>
`,h=document,p=[{key:"formatting",story:n},{key:"formattingParts",story:i},{key:"listCommonLocales",story:u},{key:"listAllLocales",story:b}];let a=!1;for(const t of p){const d=h.querySelector(`[mdjs-story-name="${t.key}"]`);d&&(d.story=t.story,d.key=t.key,a=!0,Object.assign(d,{simulatorUrl:"/next/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}a&&(customElements.get("mdjs-preview")||l(()=>import("./define.DYUong5B.js"),__vite__mapDeps([0,1,2,3,4,5])),customElements.get("mdjs-story")||l(()=>import("./define.m2CvvXyF.js"),__vite__mapDeps([6,2,3])));export{n as formatting,i as formattingParts,b as listAllLocales,u as listCommonLocales};
