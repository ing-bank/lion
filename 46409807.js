import"./24f95583.js";import{x as e}from"./b4be29f1.js";import"./05905ff1.js";import{f as t}from"./ee959851.js";import"./0b376712.js";import{l as a}from"./7da3d275.js";import{M as o,a as i,b as s}from"./b7f85193.js";import"./24c57689.js";import"./d45984a3.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./895f5d38.js";import"./43bc0982.js";import"./4cc99b59.js";import"./19d2607c.js";import"./afb8834e.js";import"./dc2f5f5a.js";import"./c2aef983.js";import"./7077221a.js";import"./c6fab747.js";import"./143fde17.js";import"./f12ecf0e.js";import"./3599da39.js";import"./4dc0ac82.js";import"./cc85a6f4.js";import"./48ac1cb5.js";import"./e49751c9.js";import"./a06c5caf.js";import"./622cc741.js";const n=()=>e`
  <lion-input-date label="IsDate" .modelValue="${new Date("foo")}"> </lion-input-date>
`,m=()=>(a(),e`
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
`,p=document,j=[{key:"isADate",story:n},{key:"withMinimumDate",story:m},{key:"withMaximumDate",story:r},{key:"withMinimumAndMaximumDate",story:l},{key:"faultyPrefilled",story:d}];let c=!1;for(const e of j){const t=p.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,c=!0,Object.assign(t,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}c&&(customElements.get("mdjs-preview")||import("./a7b4f51b.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{d as faultyPrefilled,n as isADate,r as withMaximumDate,l as withMinimumAndMaximumDate,m as withMinimumDate};
