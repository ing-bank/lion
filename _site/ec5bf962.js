import"./24f95583.js";import{a as t,x as e}from"./b4be29f1.js";import"./05905ff1.js";import{f as d}from"./ee959851.js";import{a}from"./6befb316.js";import"./24c57689.js";import"./d45984a3.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./895f5d38.js";const o=t`
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
`,r=()=>e`
  <style>
    ${o}
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
        <td>${d(new Date("1987/05/12"))}</td>
        <td>Default</td>
        <td><code>formatDate(new Date('1987/05/12'))</code></td>
      </tr>
      <tr>
        <td>
          ${d(new Date("1987/05/12"),{weekday:"long",year:"numeric",month:"long",day:"2-digit"})}
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
          ${d(new Date("1987/05/12"),{weekday:"long",month:"long",day:"2-digit"})}
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
          ${d(new Date("1987/05/12"),{weekday:"long",year:"numeric",day:"2-digit"})}
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
          ${d(new Date("1987/05/12"),{weekday:"long",month:"long",year:"numeric"})}
        </td>
        <td>Date without day</td>
        <td>
          <code>
            formatDate(new Date('1987/05/12'), { weekday:'long',year:'numeric',month:'long' })
          </code>
        </td>
      </tr>
      <tr>
        <td>${d(new Date("1987/05/12"),{locale:"nl-NL"})}</td>
        <td>Locale</td>
        <td><code>formatDate(new Date('1987/05/12'){ locale:'nl-NL' })</code></td>
      </tr>
    </tbody>
  </table>
`,l=()=>e`
  <style>
    ${o}
  </style>
  <table class="demo-table">
    <thead>
      <tr>
        <th>Locale</th>
        <th>Output</th>
      </tr>
    </thead>
    <tbody>
      ${["en-GB","en-US","nl-NL","nl-BE","fr-FR","de-DE"].map(t=>e`
          <tr>
            <td>${t}</td>
            <td>${d(new Date("1987/05/12"),{locale:t})}</td>
          </tr>
        `)}
    </tbody>
  </table>
`,n=()=>e`
  <style>
    ${o}
  </style>
  <table class="demo-table">
    <tr>
      <th>Locale</th>
      <th>Output</th>
    </tr>
    ${Object.keys(a).map(t=>e`
        <tr>
          <td>${t}</td>
          <td>${d(new Date("1987/05/12"),{locale:t})}</td>
        </tr>
      `)}
  </table>
`,m=document,s=[{key:"formatting",story:r},{key:"listCommonLocales",story:l},{key:"listAllLocales",story:n}];let i=!1;for(const t of s){const e=m.querySelector(`[mdjs-story-name="${t.key}"]`);e&&(e.story=t.story,e.key=t.key,i=!0,Object.assign(e,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}i&&(customElements.get("mdjs-preview")||import("./a7b4f51b.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{r as formatting,n as listAllLocales,l as listCommonLocales};
