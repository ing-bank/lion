const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.DYUong5B.js","_astro/node-tools_providence-analytics_overview.LFFQBZzG.js","_astro/lit-element.qDHKJJma.js","_astro/lit-html.C7L4dwLU.js","_astro/unsafe-html.J0GGe2Q7.js","_astro/directive.CGE4aKEl.js","_astro/define.m2CvvXyF.js"])))=>i.map(i=>d[i]);
import{_ as d}from"./preload-helper.4zY6-HO4.js";import"./node-tools_providence-analytics_overview.LFFQBZzG.js";import"./lit-element.qDHKJJma.js";import{x as a}from"./lit-html.C7L4dwLU.js";import"./unsafe-html.J0GGe2Q7.js";import"./lion-calendar.Cz9vMzxn.js";import"./directive.CGE4aKEl.js";import"./LionCalendar.CeLikVv5.js";import"./if-defined.CV50pAZo.js";import"./LocalizeMixin.VYu75dkK.js";import"./directive-helpers.CLllgGgm.js";import"./async-directive.CHVe8p0E.js";import"./getLocalizeManager.W5d_ICRU.js";import"./index.BNCfcFQh.js";import"./lazifyInstantiation.CgYLRMC3.js";import"./dedupeMixin.6XPTJgK8.js";import"./normalizeDateTime.BoDqBOW2.js";import"./normalizeIntlDate.jFpsyBMC.js";const l=()=>a`
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
  `},p=document,x=[{key:"selectedDate",story:l},{key:"centralDate",story:s},{key:"controllingFocus",story:c},{key:"providingLowerLimit",story:i},{key:"providingHigherLimit",story:m},{key:"disabledDates",story:D},{key:"combinedDisabledDates",story:y},{key:"findingEnabledDates",story:u}];let r=!1;for(const e of x){const t=p.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,r=!0,Object.assign(t,{simulatorUrl:"/next/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}r&&(customElements.get("mdjs-preview")||d(()=>import("./define.DYUong5B.js"),__vite__mapDeps([0,1,2,3,4,5])),customElements.get("mdjs-story")||d(()=>import("./define.m2CvvXyF.js"),__vite__mapDeps([6,2,3])));export{s as centralDate,y as combinedDisabledDates,c as controllingFocus,D as disabledDates,u as findingEnabledDates,m as providingHigherLimit,i as providingLowerLimit,l as selectedDate};
