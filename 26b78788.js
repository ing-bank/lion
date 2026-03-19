import"./08927fef.js";import{x as e}from"./b4be29f1.js";import"./05905ff1.js";import{f as t}from"./ee959851.js";import"./591ab81a.js";import{l as i}from"./1347002a.js";import{b as a,c as o}from"./b7f85193.js";import"./24c57689.js";import"./d45984a3.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./895f5d38.js";import"./bee32da7.js";import"./9af64c94.js";import"./dc2f5f5a.js";import"./3371a831.js";import"./88061fcd.js";import"./0ed5d59c.js";import"./c84885cc.js";import"./4cc99b59.js";import"./19d2607c.js";import"./afb8834e.js";import"./5034b8b0.js";import"./143fde17.js";import"./6722e641.js";import"./fa30f842.js";import"./9d4fbb3c.js";import"./5c8a0a9d.js";import"./ee65bf86.js";import"./5cdb1e6a.js";import"./622cc741.js";import"./b9d3bf75.js";import"./4dc0ac82.js";import"./cc85a6f4.js";import"./48ac1cb5.js";import"./e49751c9.js";import"./a06c5caf.js";i();const r=()=>e`
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
`,p=()=>e`
  <lion-input-datepicker label="Readonly" readonly .modelValue="${new Date}">
  </lion-input-datepicker>
`,l=()=>e`
  <lion-input-datepicker label="Faulty prefiiled" .modelValue="${new Date("30/01/2022")}">
  </lion-input-datepicker>
`,d=document,c=[{key:"minimumAndMaximumDate",story:r},{key:"disableSpecificDates",story:s},{key:"calendarHeading",story:n},{key:"disabled",story:m},{key:"readOnly",story:p},{key:"faultyPrefilled",story:l}];let j=!1;for(const e of c){const t=d.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,j=!0,Object.assign(t,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}j&&(customElements.get("mdjs-preview")||import("./24735558.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{n as calendarHeading,s as disableSpecificDates,m as disabled,l as faultyPrefilled,r as minimumAndMaximumDate,p as readOnly};
