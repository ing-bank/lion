const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.D5IFK1jp.js","_astro/MdJsPreview.B62up6PK.js","_astro/lit-element.DxRhnkit.js","_astro/lit-html.BX7rm8u-.js","_astro/dedupeMixin.6XPTJgK8.js","_astro/lit-element.BOikny4r.js","_astro/uuid.DjYKNjre.js","_astro/define.DBgp7shK.js"])))=>i.map(i=>d[i]);
import{_ as o}from"./preload-helper.CVfkMyKi.js";import"./MdJsPreview.B62up6PK.js";import"./lit-element.DxRhnkit.js";import{b as e}from"./lit-html.BX7rm8u-.js";import"./unsafe-html.FHlAasnX.js";import{f as i}from"./formatDate.l-l_PWWD.js";import"./lion-input-date.Bj_zKBoW.js";import{l as n}from"./loadDefaultFeedbackMessages.Dna2KIXH.js";import{M as r,a as m,b as s}from"./DateValidators.DxhEW18Z.js";const d=()=>e`
  <lion-input-date label="IsDate" .modelValue="${new Date("foo")}"> </lion-input-date>
`,u=()=>(n(),e`
    <lion-input-date
      label="MinDate"
      help-text="Enter a date greater than or equal to today."
      .modelValue="${new Date("2018/05/30")}"
      .validators="${[new s(new Date)]}"
    >
    </lion-input-date>
  `),D=()=>(n(),e`
    <lion-input-date
      label="MaxDate"
      help-text="Enter a date smaller than or equal to today."
      .modelValue="${new Date("2100/05/30")}"
      .validators="${[new r(new Date)]}"
    ></lion-input-date>
  `),p=()=>(n(),e`
    <lion-input-date
      label="MinMaxDate"
      .modelValue="${new Date("2018/05/30")}"
      .validators="${[new m({min:new Date("2018/05/24"),max:new Date("2018/06/24")})]}"
    >
      <div slot="help-text">
        Enter a date between ${i(new Date("2018/05/24"))} and
        ${i(new Date("2018/06/24"))}.
      </div>
    </lion-input-date>
  `),y=()=>e`
  <lion-input-date
    label="Date"
    help-text="Faulty prefilled input will be cleared"
    .modelValue="${"foo"}"
  ></lion-input-date>
`,f=document,w=[{key:"isADate",story:d},{key:"withMinimumDate",story:u},{key:"withMaximumDate",story:D},{key:"withMinimumAndMaximumDate",story:p},{key:"faultyPrefilled",story:y}];let l=!1;for(const a of w){const t=f.querySelector(`[mdjs-story-name="${a.key}"]`);t&&(t.story=a.story,t.key=a.key,l=!0,Object.assign(t,{simulatorUrl:"/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}l&&(customElements.get("mdjs-preview")||o(()=>import("./define.D5IFK1jp.js"),__vite__mapDeps([0,1,2,3,4,5,6])),customElements.get("mdjs-story")||o(()=>import("./define.DBgp7shK.js"),__vite__mapDeps([7,2,3])));export{y as faultyPrefilled,d as isADate,D as withMaximumDate,p as withMinimumAndMaximumDate,u as withMinimumDate};
