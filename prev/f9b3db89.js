import"./f1151d68.js";import{x as e}from"./b8bc2eda.js";import"./6638bb86.js";import{f as t}from"./0e597667.js";import"./be555594.js";import{l as i}from"./04e5357d.js";import{b as a,c as o}from"./b7f85193.js";import"./1069d12c.js";import"./7c882590.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./895f5d38.js";import"./dc2669c9.js";import"./4c616179.js";import"./dc2f5f5a.js";import"./1c27b902.js";import"./88061fcd.js";import"./0ed5d59c.js";import"./c84885cc.js";import"./c48d90f3.js";import"./be5f2fd3.js";import"./dcadf410.js";import"./4abf0ca8.js";import"./143fde17.js";import"./6722e641.js";import"./4058fa1a.js";import"./45058e5d.js";import"./57941646.js";import"./7eab6f7c.js";import"./73346463.js";import"./622cc741.js";import"./d924b319.js";import"./4dc0ac82.js";import"./cc85a6f4.js";import"./48ac1cb5.js";import"./e49751c9.js";import"./a06c5caf.js";i();const r=()=>e`
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
`,p=()=>e`
  <lion-input-datepicker label="Faulty prefiiled" .modelValue="${new Date("30/01/2022")}">
  </lion-input-datepicker>
`,l=document,c=[{key:"minimumAndMaximumDate",story:r},{key:"disableSpecificDates",story:s},{key:"calendarHeading",story:n},{key:"disabled",story:m},{key:"readOnly",story:d},{key:"faultyPrefilled",story:p}];let j=!1;for(const e of c){const t=l.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,j=!0,Object.assign(t,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}j&&(customElements.get("mdjs-preview")||import("./e90784d0.js"),customElements.get("mdjs-story")||import("./0defd61d.js"));export{n as calendarHeading,s as disableSpecificDates,m as disabled,p as faultyPrefilled,r as minimumAndMaximumDate,d as readOnly};
