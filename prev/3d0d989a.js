import"./f1151d68.js";import{x as e}from"./b8bc2eda.js";import"./6638bb86.js";import{f as t}from"./0e597667.js";import"./f196d21a.js";import{l as a}from"./04e5357d.js";import{M as o,a as i,b as s}from"./b7f85193.js";import"./1069d12c.js";import"./7c882590.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./895f5d38.js";import"./4058fa1a.js";import"./c48d90f3.js";import"./be5f2fd3.js";import"./dcadf410.js";import"./dc2f5f5a.js";import"./45058e5d.js";import"./57941646.js";import"./4abf0ca8.js";import"./143fde17.js";import"./6722e641.js";import"./7eab6f7c.js";import"./d924b319.js";import"./4dc0ac82.js";import"./cc85a6f4.js";import"./48ac1cb5.js";import"./e49751c9.js";import"./a06c5caf.js";import"./622cc741.js";const m=()=>e`
  <lion-input-date label="IsDate" .modelValue="${new Date("foo")}"> </lion-input-date>
`,n=()=>(a(),e`
    <lion-input-date
      label="MinDate"
      help-text="Enter a date greater than or equal to today."
      .modelValue="${new Date("2018/05/30")}"
      .validators="${[new o(new Date)]}"
    >
    </lion-input-date>
  `),r=()=>(a(),e`
    <lion-input-date
      label="MaxDate"
      help-text="Enter a date smaller than or equal to today."
      .modelValue="${new Date("2100/05/30")}"
      .validators="${[new i(new Date)]}"
    ></lion-input-date>
  `),l=()=>(a(),e`
    <lion-input-date
      label="MinMaxDate"
      .modelValue="${new Date("2018/05/30")}"
      .validators="${[new s({min:new Date("2018/05/24"),max:new Date("2018/06/24")})]}"
    >
      <div slot="help-text">
        Enter a date between ${t(new Date("2018/05/24"))} and
        ${t(new Date("2018/06/24"))}.
      </div>
    </lion-input-date>
  `),d=()=>e`
  <lion-input-date
    label="Date"
    help-text="Faulty prefilled input will be cleared"
    .modelValue="${"foo"}"
  ></lion-input-date>
`,p=document,j=[{key:"isADate",story:m},{key:"withMinimumDate",story:n},{key:"withMaximumDate",story:r},{key:"withMinimumAndMaximumDate",story:l},{key:"faultyPrefilled",story:d}];let u=!1;for(const e of j){const t=p.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,u=!0,Object.assign(t,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}u&&(customElements.get("mdjs-preview")||import("./e90784d0.js"),customElements.get("mdjs-story")||import("./0defd61d.js"));export{d as faultyPrefilled,m as isADate,r as withMaximumDate,l as withMinimumAndMaximumDate,n as withMinimumDate};
