import"./f1151d68.js";import{a as t,x as e}from"./b8bc2eda.js";import"./6638bb86.js";import{a as r,f as d}from"./6e65f685.js";import{a as o}from"./6befb316.js";import"./7c882590.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./1069d12c.js";const l=t`
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
`,c=1234.56,a=()=>e`
  <style>
    ${l}
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
        <td>${r(c)}</td>
        <td></td>
      </tr>
      <tr>
        <td>Currency symbol</td>
        <td>
          ${r(c,{style:"currency",currencyDisplay:"symbol",currency:"EUR"})}
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
          ${r(c,{style:"currency",currencyDisplay:"code",currency:"EUR"})}
        </td>
        <td>
          <code>formatNumber({ style: 'currency', currencyDisplay: 'code', currency: 'EUR' })</code>
        </td>
      </tr>
      <tr>
        <td>Locale</td>
        <td>${r(c,{locale:"nl-NL"})}</td>
        <td><code>formatNumber({ locale: 'nl-NL' })</code></td>
      </tr>
      <tr>
        <td>No decimals</td>
        <td>
          ${r(c,{minimumFractionDigits:0,maximumFractionDigits:0})}
        </td>
        <td>
          <code>formatNumber({ minimumFractionDigits: 0, maximumFractionDigits: 0, })</code>
        </td>
      </tr>
    </tbody>
  </table>
`,s=()=>e`
  <style>
    ${l}
  </style>
  <table class="demo-table">
    <thead>
      <tr>
        <th>Part</th>
        <th>Output</th>
      </tr>
    </thead>
    <tbody>
      ${d(1234.56,{style:"currency",currency:"EUR"}).map(t=>e`
          <tr>
            <td>${t.type}</td>
            <td>${t.value}</td>
          </tr>
        `)}
    </tbody>
  </table>
`,y=()=>e`
  <style>
    ${l}
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
      ${["en-GB","en-US","nl-NL","nl-BE","fr-FR","de-DE"].map(t=>e`
          <tr>
            <td>${t}</td>
            <td>${r(1234.56,{locale:t,style:"currency",currency:"EUR"})}</td>
            <td>${r(1234.56,{locale:t,style:"currency",currency:"USD"})}</td>
          </tr>
        `)}
    </tbody>
  </table>
`,m=()=>e`
  <style>
    ${l}
  </style>
  <table class="demo-table">
    <tr>
      <th>Locale</th>
      <th>Output Euro</th>
      <th>Output US Dollar</th>
    </tr>
    ${Object.keys(o).map(t=>e`
        <tr>
          <td>${t}</td>
          <td>${r(1234.56,{locale:t,style:"currency",currency:"EUR"})}</td>
          <td>${r(1234.56,{locale:t,style:"currency",currency:"USD"})}</td>
        </tr>
      `)}
  </table>
`,n=document,i=[{key:"formatting",story:a},{key:"formattingParts",story:s},{key:"listCommonLocales",story:y},{key:"listAllLocales",story:m}];let u=!1;for(const t of i){const e=n.querySelector(`[mdjs-story-name="${t.key}"]`);e&&(e.story=t.story,e.key=t.key,u=!0,Object.assign(e,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}u&&(customElements.get("mdjs-preview")||import("./e90784d0.js"),customElements.get("mdjs-story")||import("./0defd61d.js"));export{a as formatting,s as formattingParts,m as listAllLocales,y as listCommonLocales};
