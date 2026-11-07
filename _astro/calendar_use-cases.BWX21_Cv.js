const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.D5IFK1jp.js","_astro/MdJsPreview.B62up6PK.js","_astro/lit-element.DxRhnkit.js","_astro/lit-html.BX7rm8u-.js","_astro/dedupeMixin.6XPTJgK8.js","_astro/lit-element.BOikny4r.js","_astro/uuid.DjYKNjre.js","_astro/define.DBgp7shK.js"])))=>i.map(i=>d[i]);
import{_ as d}from"./preload-helper.CVfkMyKi.js";import"./MdJsPreview.B62up6PK.js";import"./lit-element.DxRhnkit.js";import{b as a}from"./lit-html.BX7rm8u-.js";import"./unsafe-html.FHlAasnX.js";import"./lion-calendar.CxZ892Jo.js";const r=()=>a`
  <style>
    .demo-calendar {
      border: 1px solid #adadad;
      box-shadow: 0 0 16px #ccc;
      max-width: 500px;
    }
  </style>
  <lion-calendar class="demo-calendar" .selectedDate="${new Date(1988,2,5)}"></lion-calendar>
`,s=()=>{const e=new Date,t=new Date(e.getFullYear(),e.getMonth()+1,e.getDate());return a`
    <style>
      .demo-calendar {
        border: 1px solid #adadad;
        box-shadow: 0 0 16px #ccc;
        max-width: 500px;
      }
    </style>
    <lion-calendar class="demo-calendar" .centralDate="${t}"></lion-calendar>
  `},c=()=>{const e=new Date,t=new Date(e.getFullYear(),e.getMonth(),e.getDate()+1),n=new Date(e.getFullYear(),e.getMonth(),e.getDate()-5);return a`
    <style>
      .demo-calendar {
        border: 1px solid #adadad;
        box-shadow: 0 0 16px #ccc;
        max-width: 500px;
      }
    </style>
    <lion-calendar
      id="js-demo-calendar"
      class="demo-calendar"
      .selectedDate="${t}"
      .centralDate="${n}"
    ></lion-calendar>
    <button
      @click="${o=>o.target.parentElement.querySelector("#js-demo-calendar").focusCentralDate()}"
    >
      Set focus on: Central date
    </button>
    <button
      @click="${o=>o.target.parentElement.querySelector("#js-demo-calendar").focusSelectedDate()}"
    >
      Set focus on: Selected date
    </button>
    <button
      @click="${o=>o.target.parentElement.querySelector("#js-demo-calendar").focusDate(e)}"
    >
      Set focus on: Today
    </button>
  `},i=()=>a`
    <style>
      .demo-calendar {
        border: 1px solid #adadad;
        box-shadow: 0 0 16px #ccc;
        max-width: 500px;
      }
    </style>
    <lion-calendar class="demo-calendar" .minDate="${new Date}"></lion-calendar>
  `,m=()=>{const e=new Date,t=new Date(e.getFullYear(),e.getMonth(),e.getDate()+2);return a`
    <style>
      .demo-calendar {
        border: 1px solid #adadad;
        box-shadow: 0 0 16px #ccc;
        max-width: 500px;
      }
    </style>
    <lion-calendar class="demo-calendar" .maxDate="${t}"></lion-calendar>
  `},D=()=>a`
  <style>
    .demo-calendar {
      border: 1px solid #adadad;
      box-shadow: 0 0 16px #ccc;
      max-width: 500px;
    }
  </style>
  <lion-calendar
    class="demo-calendar"
    .disableDates="${e=>e.getDay()===6||e.getDay()===0}"
  ></lion-calendar>
`,y=()=>{const e=new Date,t=new Date(e.getFullYear(),e.getMonth()+2,e.getDate());return a`
    <style>
      .demo-calendar {
        border: 1px solid #adadad;
        box-shadow: 0 0 16px #ccc;
        max-width: 500px;
      }
    </style>
    <lion-calendar
      class="demo-calendar"
      .disableDates="${n=>n.getDay()===6||n.getDay()===0}"
      .minDate="${new Date}"
      .maxDate="${t}"
    ></lion-calendar>
  `},u=()=>{function e(t){return t.target.parentElement.querySelector(".js-calendar")}return a`
    <style>
      .demo-calendar {
        border: 1px solid #adadad;
        box-shadow: 0 0 16px #ccc;
        max-width: 500px;
      }
    </style>
    <lion-calendar
      class="demo-calendar js-calendar"
      .disableDates="${t=>t.getDay()===6||t.getDay()===0}"
    ></lion-calendar>
    <button @click="${t=>e(t).focusDate(e(t).findNextEnabledDate())}">
      focus findNextEnabledDate
    </button>
    <button @click="${t=>e(t).focusDate(e(t).findPreviousEnabledDate())}">
      focus findPreviousEnabledDate
    </button>
    <button @click="${t=>e(t).focusDate(e(t).findNearestEnabledDate())}">
      focus findNearestEnabledDate
    </button>
  `},b=document,x=[{key:"selectedDate",story:r},{key:"centralDate",story:s},{key:"controllingFocus",story:c},{key:"providingLowerLimit",story:i},{key:"providingHigherLimit",story:m},{key:"disabledDates",story:D},{key:"combinedDisabledDates",story:y},{key:"findingEnabledDates",story:u}];let l=!1;for(const e of x){const t=b.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,l=!0,Object.assign(t,{simulatorUrl:"/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}l&&(customElements.get("mdjs-preview")||d(()=>import("./define.D5IFK1jp.js"),__vite__mapDeps([0,1,2,3,4,5,6])),customElements.get("mdjs-story")||d(()=>import("./define.DBgp7shK.js"),__vite__mapDeps([7,2,3])));export{s as centralDate,y as combinedDisabledDates,c as controllingFocus,D as disabledDates,u as findingEnabledDates,m as providingHigherLimit,i as providingLowerLimit,r as selectedDate};
