const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.DSVRgKCR.js","_astro/node-tools_providence-analytics_overview.BxIihMx7.js","_astro/lit-element.jD9bOQKo.js","_astro/lit-html.DtZEZPQ5.js","_astro/unsafe-html.DgrA3nwU.js","_astro/directive.BO6BEpVC.js","_astro/define.DNIVKtom.js"])))=>i.map(i=>d[i]);
import{_ as d}from"./preload-helper.Cj2JEybs.js";import"./node-tools_providence-analytics_overview.BxIihMx7.js";import"./lit-element.jD9bOQKo.js";import{x as a}from"./lit-html.DtZEZPQ5.js";import"./unsafe-html.DgrA3nwU.js";import"./lion-calendar.BGQPOVd5.js";const r=()=>a`
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
  `},x=document,b=[{key:"selectedDate",story:r},{key:"centralDate",story:s},{key:"controllingFocus",story:c},{key:"providingLowerLimit",story:i},{key:"providingHigherLimit",story:m},{key:"disabledDates",story:D},{key:"combinedDisabledDates",story:y},{key:"findingEnabledDates",story:u}];let l=!1;for(const e of b){const t=x.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,l=!0,Object.assign(t,{simulatorUrl:"/next/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}l&&(customElements.get("mdjs-preview")||d(()=>import("./define.DSVRgKCR.js"),__vite__mapDeps([0,1,2,3,4,5])),customElements.get("mdjs-story")||d(()=>import("./define.DNIVKtom.js"),__vite__mapDeps([6,2,3])));export{s as centralDate,y as combinedDisabledDates,c as controllingFocus,D as disabledDates,u as findingEnabledDates,m as providingHigherLimit,i as providingLowerLimit,r as selectedDate};
