import"./24f95583.js";import{x as e}from"./b4be29f1.js";import"./05905ff1.js";import"./adcdec18.js";import"./5cdb1e6a.js";import"./895f5d38.js";import"./622cc741.js";import"./4cc99b59.js";import"./19d2607c.js";import"./afb8834e.js";import"./d45984a3.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./dc2f5f5a.js";import"./bee32da7.js";const a=()=>e`
  <style>
    .demo-calendar {
      border: 1px solid #adadad;
      box-shadow: 0 0 16px #ccc;
      max-width: 500px;
    }
  </style>
  <lion-calendar class="demo-calendar" .selectedDate="${new Date(1988,2,5)}"></lion-calendar>
`,t=()=>{const a=new Date,t=new Date(a.getFullYear(),a.getMonth()+1,a.getDate());return e`
    <style>
      .demo-calendar {
        border: 1px solid #adadad;
        box-shadow: 0 0 16px #ccc;
        max-width: 500px;
      }
    </style>
    <lion-calendar class="demo-calendar" .centralDate="${t}"></lion-calendar>
  `},d=()=>{const a=new Date,t=new Date(a.getFullYear(),a.getMonth(),a.getDate()+1),d=new Date(a.getFullYear(),a.getMonth(),a.getDate()-5);return e`
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
      .centralDate="${d}"
    ></lion-calendar>
    <button
      @click="${e=>e.target.parentElement.querySelector("#js-demo-calendar").focusCentralDate()}"
    >
      Set focus on: Central date
    </button>
    <button
      @click="${e=>e.target.parentElement.querySelector("#js-demo-calendar").focusSelectedDate()}"
    >
      Set focus on: Selected date
    </button>
    <button
      @click="${e=>e.target.parentElement.querySelector("#js-demo-calendar").focusDate(a)}"
    >
      Set focus on: Today
    </button>
  `},o=()=>{const a=new Date;return e`
    <style>
      .demo-calendar {
        border: 1px solid #adadad;
        box-shadow: 0 0 16px #ccc;
        max-width: 500px;
      }
    </style>
    <lion-calendar class="demo-calendar" .minDate="${a}"></lion-calendar>
  `},n=()=>{const a=new Date,t=new Date(a.getFullYear(),a.getMonth(),a.getDate()+2);return e`
    <style>
      .demo-calendar {
        border: 1px solid #adadad;
        box-shadow: 0 0 16px #ccc;
        max-width: 500px;
      }
    </style>
    <lion-calendar class="demo-calendar" .maxDate="${t}"></lion-calendar>
  `},l=()=>e`
  <style>
    .demo-calendar {
      border: 1px solid #adadad;
      box-shadow: 0 0 16px #ccc;
      max-width: 500px;
    }
  </style>
  <lion-calendar
    class="demo-calendar"
    .disableDates="${e=>6===e.getDay()||0===e.getDay()}"
  ></lion-calendar>
`,r=()=>{const a=new Date,t=new Date(a.getFullYear(),a.getMonth()+2,a.getDate());return e`
    <style>
      .demo-calendar {
        border: 1px solid #adadad;
        box-shadow: 0 0 16px #ccc;
        max-width: 500px;
      }
    </style>
    <lion-calendar
      class="demo-calendar"
      .disableDates="${e=>6===e.getDay()||0===e.getDay()}"
      .minDate="${new Date}"
      .maxDate="${t}"
    ></lion-calendar>
  `},s=()=>{function a(e){return e.target.parentElement.querySelector(".js-calendar")}return e`
    <style>
      .demo-calendar {
        border: 1px solid #adadad;
        box-shadow: 0 0 16px #ccc;
        max-width: 500px;
      }
    </style>
    <lion-calendar
      class="demo-calendar js-calendar"
      .disableDates="${e=>6===e.getDay()||0===e.getDay()}"
    ></lion-calendar>
    <button @click="${e=>a(e).focusDate(a(e).findNextEnabledDate())}">
      focus findNextEnabledDate
    </button>
    <button @click="${e=>a(e).focusDate(a(e).findPreviousEnabledDate())}">
      focus findPreviousEnabledDate
    </button>
    <button @click="${e=>a(e).focusDate(a(e).findNearestEnabledDate())}">
      focus findNearestEnabledDate
    </button>
  `},c=document,i=[{key:"selectedDate",story:a},{key:"centralDate",story:t},{key:"controllingFocus",story:d},{key:"providingLowerLimit",story:o},{key:"providingHigherLimit",story:n},{key:"disabledDates",story:l},{key:"combinedDisabledDates",story:r},{key:"findingEnabledDates",story:s}];let m=!1;for(const e of i){const a=c.querySelector(`[mdjs-story-name="${e.key}"]`);a&&(a.story=e.story,a.key=e.key,m=!0,Object.assign(a,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}m&&(customElements.get("mdjs-preview")||import("./a7b4f51b.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{t as centralDate,r as combinedDisabledDates,d as controllingFocus,l as disabledDates,s as findingEnabledDates,n as providingHigherLimit,o as providingLowerLimit,a as selectedDate};
