const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.D5IFK1jp.js","_astro/MdJsPreview.B62up6PK.js","_astro/lit-element.DxRhnkit.js","_astro/lit-html.BX7rm8u-.js","_astro/dedupeMixin.6XPTJgK8.js","_astro/lit-element.BOikny4r.js","_astro/uuid.DjYKNjre.js","_astro/define.DBgp7shK.js"])))=>i.map(i=>d[i]);
import{_ as i}from"./preload-helper.CVfkMyKi.js";import"./MdJsPreview.B62up6PK.js";import"./lit-element.DxRhnkit.js";import{b as e}from"./lit-html.BX7rm8u-.js";import"./unsafe-html.FHlAasnX.js";import{f as n}from"./formatDate.l-l_PWWD.js";import"./lion-input-datepicker.BTwcYBUo.js";import{I as o,a as r}from"./DateValidators.DxhEW18Z.js";import{l as d}from"./loadDefaultFeedbackMessages.Dna2KIXH.js";d();const s=()=>e`
  <lion-input-datepicker
    label="MinMaxDate"
    .modelValue="${new Date("2018/05/30")}"
    .validators="${[new r({min:new Date("2018/05/24"),max:new Date("2018/06/24")})]}"
  >
    <div slot="help-text">
      Enter a date between ${n(new Date("2018/05/24"))} and
      ${n(new Date("2018/06/24"))}.
    </div>
  </lion-input-datepicker>
`,m=()=>e`
  <lion-input-datepicker
    label="IsDateDisabled"
    help-text="You're not allowed to choose any 15th."
    .modelValue="${new Date("2023/06/15")}"
    .validators="${[new o(t=>t.getDate()===15)]}"
  ></lion-input-datepicker>
`,p=()=>e`
  <lion-input-datepicker
    label="Date"
    .calendarHeading="${"Custom heading"}"
    .modelValue="${new Date}"
  ></lion-input-datepicker>
`,c=()=>e`
  <lion-input-datepicker label="Disabled" disabled></lion-input-datepicker>
`,u=()=>e`
  <lion-input-datepicker label="Readonly" readonly .modelValue="${new Date}">
  </lion-input-datepicker>
`,y=()=>e`
  <lion-input-datepicker label="Faulty prefilled" .modelValue="${new Date("30/01/2022")}">
  </lion-input-datepicker>
`,k=()=>e`
  <lion-input-datepicker label="Event start date and time" .fieldName="${"StartDate"}">
  </lion-input-datepicker>
`,D=document,f=[{key:"minimumAndMaximumDate",story:s},{key:"disableSpecificDates",story:m},{key:"calendarHeading",story:p},{key:"disabled",story:c},{key:"readOnly",story:u},{key:"faultyPrefilled",story:y},{key:"ariaLabelFieldName",story:k}];let l=!1;for(const t of f){const a=D.querySelector(`[mdjs-story-name="${t.key}"]`);a&&(a.story=t.story,a.key=t.key,l=!0,Object.assign(a,{simulatorUrl:"/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}l&&(customElements.get("mdjs-preview")||i(()=>import("./define.D5IFK1jp.js"),__vite__mapDeps([0,1,2,3,4,5,6])),customElements.get("mdjs-story")||i(()=>import("./define.DBgp7shK.js"),__vite__mapDeps([7,2,3])));export{k as ariaLabelFieldName,p as calendarHeading,m as disableSpecificDates,c as disabled,y as faultyPrefilled,s as minimumAndMaximumDate,u as readOnly};
