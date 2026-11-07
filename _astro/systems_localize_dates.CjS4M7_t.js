const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.D5IFK1jp.js","_astro/MdJsPreview.B62up6PK.js","_astro/lit-element.DxRhnkit.js","_astro/lit-html.BX7rm8u-.js","_astro/dedupeMixin.6XPTJgK8.js","_astro/lit-element.BOikny4r.js","_astro/uuid.DjYKNjre.js","_astro/define.DBgp7shK.js"])))=>i.map(i=>d[i]);
import{_ as r}from"./preload-helper.CVfkMyKi.js";import"./MdJsPreview.B62up6PK.js";import{a as n}from"./lit-element.DxRhnkit.js";import{b as o}from"./lit-html.BX7rm8u-.js";import"./unsafe-html.FHlAasnX.js";import{f as e}from"./formatDate.l-l_PWWD.js";import{a as m}from"./all-locales.8DFhn3xF.js";const a=n`
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
`,c=document,h=[{key:"formatting",story:s},{key:"listCommonLocales",story:i},{key:"listAllLocales",story:y}];let l=!1;for(const t of h){const d=c.querySelector(`[mdjs-story-name="${t.key}"]`);d&&(d.story=t.story,d.key=t.key,l=!0,Object.assign(d,{simulatorUrl:"/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}l&&(customElements.get("mdjs-preview")||r(()=>import("./define.D5IFK1jp.js"),__vite__mapDeps([0,1,2,3,4,5,6])),customElements.get("mdjs-story")||r(()=>import("./define.DBgp7shK.js"),__vite__mapDeps([7,2,3])));export{s as formatting,y as listAllLocales,i as listCommonLocales};
