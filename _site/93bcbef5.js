import"./24f95583.js";import{x as e}from"./b4be29f1.js";import"./05905ff1.js";import{f as t}from"./ee959851.js";import"./394ddca1.js";import{l as i}from"./7da3d275.js";import{b as a,c as o}from"./b7f85193.js";import"./24c57689.js";import"./d45984a3.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./895f5d38.js";import"./bee32da7.js";import"./65cdf028.js";import"./dc2f5f5a.js";import"./5254a80b.js";import"./88061fcd.js";import"./0ed5d59c.js";import"./c84885cc.js";import"./4cc99b59.js";import"./19d2607c.js";import"./afb8834e.js";import"./c6fab747.js";import"./143fde17.js";import"./43bc0982.js";import"./c2aef983.js";import"./7077221a.js";import"./f12ecf0e.js";import"./5cdb1e6a.js";import"./622cc741.js";import"./3599da39.js";import"./4dc0ac82.js";import"./cc85a6f4.js";import"./48ac1cb5.js";import"./e49751c9.js";import"./a06c5caf.js";i();const r=()=>e`
  <lion-input-datepicker
    label="MinMaxDate"
    .modelValue="${new Date("2018/05/30")}"
    .validators="${[new a({min:new Date("2018/05/24"),max:new Date("2018/06/24")})]}"
  >
    <div slot="help-text">
      Enter a date between ${t(new Date("2018/05/24"))} and
      ${t(new Date("2018/06/24"))}.
    </div>
  </lion-input-datepicker>
`,s=()=>e`
  <lion-input-datepicker
    label="IsDateDisabled"
    help-text="You're not allowed to choose any 15th."
    .modelValue="${new Date("2023/06/15")}"
    .validators="${[new o(e=>15===e.getDate())]}"
  ></lion-input-datepicker>
`,n=()=>e`
  <lion-input-datepicker
    label="Date"
    .calendarHeading="${"Custom heading"}"
    .modelValue="${new Date}"
  ></lion-input-datepicker>
`,m=()=>e`
  <lion-input-datepicker label="Disabled" disabled></lion-input-datepicker>
`,d=()=>e`
  <lion-input-datepicker label="Readonly" readonly .modelValue="${new Date}">
  </lion-input-datepicker>
`,l=()=>e`
  <lion-input-datepicker label="Faulty prefiiled" .modelValue="${new Date("30/01/2022")}">
  </lion-input-datepicker>
`,p=document,c=[{key:"minimumAndMaximumDate",story:r},{key:"disableSpecificDates",story:s},{key:"calendarHeading",story:n},{key:"disabled",story:m},{key:"readOnly",story:d},{key:"faultyPrefilled",story:l}];let j=!1;for(const e of c){const t=p.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,j=!0,Object.assign(t,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}j&&(customElements.get("mdjs-preview")||import("./a7b4f51b.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{n as calendarHeading,s as disableSpecificDates,m as disabled,l as faultyPrefilled,r as minimumAndMaximumDate,d as readOnly};
