const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.DSVRgKCR.js","_astro/node-tools_providence-analytics_overview.BxIihMx7.js","_astro/lit-element.jD9bOQKo.js","_astro/lit-html.DtZEZPQ5.js","_astro/unsafe-html.DgrA3nwU.js","_astro/directive.BO6BEpVC.js","_astro/define.DNIVKtom.js"])))=>i.map(i=>d[i]);
import{_ as r}from"./preload-helper.Cj2JEybs.js";import"./node-tools_providence-analytics_overview.BxIihMx7.js";import{a as n}from"./lit-element.jD9bOQKo.js";import{x as o}from"./lit-html.DtZEZPQ5.js";import"./unsafe-html.DgrA3nwU.js";import{f as e}from"./formatDate.CkNfrPBf.js";import{a as m}from"./all-locales.8DFhn3xF.js";const a=n`
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
`,s=()=>o`
  <style>
    ${a}
  </style>
  <table class="demo-table">
    <thead>
      <tr>
        <th>Output</th>
        <th>Options</th>
        <th>Code</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>${e(new Date("1987/05/12"))}</td>
        <td>Default</td>
        <td><code>formatDate(new Date('1987/05/12'))</code></td>
      </tr>
      <tr>
        <td>
          ${e(new Date("1987/05/12"),{weekday:"long",year:"numeric",month:"long",day:"2-digit"})}
        </td>
        <td>Date display</td>
        <td>
          <code
            >formatDate(new Date(){weekday:'long',year:'numeric',month:'long',day:'2-digit'})</code
          >
        </td>
      </tr>
      <tr>
        <td>
          ${e(new Date("1987/05/12"),{weekday:"long",month:"long",day:"2-digit"})}
        </td>
        <td>Date without year</td>
        <td>
          <code>
            formatDate(new Date('1987/05/12'), {weekday:'long',month:'long',day:'2-digit'})
          </code>
        </td>
      </tr>
      <tr>
        <td>
          ${e(new Date("1987/05/12"),{weekday:"long",year:"numeric",day:"2-digit"})}
        </td>
        <td>Date without month</td>
        <td>
          <code>
            formatDate(new Date('1987/05/12'), {weekday:'long',year:'numeric',day:'2-digit'})
          </code>
        </td>
      </tr>
      <tr>
        <td>
          ${e(new Date("1987/05/12"),{weekday:"long",month:"long",year:"numeric"})}
        </td>
        <td>Date without day</td>
        <td>
          <code>
            formatDate(new Date('1987/05/12'), { weekday:'long',year:'numeric',month:'long' })
          </code>
        </td>
      </tr>
      <tr>
        <td>${e(new Date("1987/05/12"),{locale:"nl-NL"})}</td>
        <td>Locale</td>
        <td><code>formatDate(new Date('1987/05/12'){ locale:'nl-NL' })</code></td>
      </tr>
    </tbody>
  </table>
`,i=()=>o`
  <style>
    ${a}
  </style>
  <table class="demo-table">
    <thead>
      <tr>
        <th>Locale</th>
        <th>Output</th>
      </tr>
    </thead>
    <tbody>
      ${["en-GB","en-US","nl-NL","nl-BE","fr-FR","de-DE"].map(t=>o`
          <tr>
            <td>${t}</td>
            <td>${e(new Date("1987/05/12"),{locale:t})}</td>
          </tr>
        `)}
    </tbody>
  </table>
`,y=()=>o`
  <style>
    ${a}
  </style>
  <table class="demo-table">
    <tr>
      <th>Locale</th>
      <th>Output</th>
    </tr>
    ${Object.keys(m).map(t=>o`
        <tr>
          <td>${t}</td>
          <td>${e(new Date("1987/05/12"),{locale:t})}</td>
        </tr>
      `)}
  </table>
`,c=document,h=[{key:"formatting",story:s},{key:"listCommonLocales",story:i},{key:"listAllLocales",story:y}];let l=!1;for(const t of h){const d=c.querySelector(`[mdjs-story-name="${t.key}"]`);d&&(d.story=t.story,d.key=t.key,l=!0,Object.assign(d,{simulatorUrl:"/next/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}l&&(customElements.get("mdjs-preview")||r(()=>import("./define.DSVRgKCR.js"),__vite__mapDeps([0,1,2,3,4,5])),customElements.get("mdjs-story")||r(()=>import("./define.DNIVKtom.js"),__vite__mapDeps([6,2,3])));export{s as formatting,y as listAllLocales,i as listCommonLocales};
