import{a as e,x as t,i as a}from"./b4be29f1.js";import{n}from"./895f5d38.js";import{n as s}from"./622cc741.js";import{L as r}from"./4cc99b59.js";import{o as i}from"./bee32da7.js";function o(e,t){return e instanceof Date&&t instanceof Date&&e.getDate()===t.getDate()&&e.getMonth()===t.getMonth()&&e.getFullYear()===t.getFullYear()}const l={};function d({locale:e="en-GB",style:t="long"}={}){let a=l[e]&&l[e][t];if(a)return a;a=[];const s=new Intl.DateTimeFormat(e,{month:t});for(let e=0;e<12;e+=1){const t=new Date(2019,e,1),r=s.format(t),i=n(r);a.push(i)}return"en-GB"===e&&"short"===t?a=function(e){return"Sept"===e[8]&&(e[8]="Sep"),e}(a):"nl-NL"===e&&"short"===t&&(a=function(e){return e.map(e=>"mei"===e||e.endsWith(".")?e:`${e}.`)}(a)),l[e]=l[e]||{},l[e][t]=a,a}const c={};function h({locale:e="en-GB",style:t="long",firstDayOfWeek:a=0}={}){const s=function(e){const t=c[e];let a;return t||(c[e]={long:[],short:[],narrow:[]},["long","short","narrow"].forEach(t=>{a=c[e][t];const s=new Intl.DateTimeFormat(e,{weekday:t}),r=new Date("2019/04/07");for(let e=0;e<7;e+=1){const e=s.format(r),t=n(e);a.push(t),r.setDate(r.getDate()+1)}}),c[e])}(e)[t],r=[];for(let e=a;e<a+7;e+=1)r.push(s[e%7]);return r}const _=e`
  :host {
    display: block;
  }

  :host([hidden]) {
    display: none;
  }

  .calendar {
    display: block;
  }

  .calendar__navigation {
    padding: 0 8px;
  }

  .calendar__navigation__month,
  .calendar__navigation__year {
    display: flex;
  }

  .calendar__navigation-heading {
    margin: 0.5em 0;
  }

  .calendar__previous-button,
  .calendar__next-button {
    background-color: #fff;
    border: 0;
    padding: 0;
    min-width: 40px;
    min-height: 40px;
  }

  .calendar__grid {
    width: 100%;
    padding: 8px 8px;
  }

  .calendar__weekday-header {
  }

  .calendar__day-cell {
    text-align: center;
  }

  .calendar__day-button {
    background-color: #fff;
    border: 0;
    color: black;
    padding: 0;
    min-width: 40px;
    min-height: 40px;
    /** give div[role=button][aria-disabled] same display type as native btn */
    display: inline-flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
  }

  .calendar__day-button:focus {
    border: 1px solid blue;
    outline: none;
  }

  .calendar__day-button__text {
    pointer-events: none;
  }

  .calendar__day-button[today] {
    text-decoration: underline;
  }

  .calendar__day-button[selected] {
    background: #ccc;
  }

  .calendar__day-button[previous-month],
  .calendar__day-button[next-month] {
    color: rgb(115, 115, 115);
  }

  .calendar__day-button:hover {
    border: 1px solid green;
  }

  .calendar__day-button[aria-disabled='true'] {
    background-color: #fff;
    color: #eee;
    outline: none;
  }

  .u-sr-only {
    position: absolute;
    top: 0;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(100%);
    clip: rect(1px, 1px, 1px, 1px);
    white-space: nowrap;
    border: 0;
    margin: 0;
    padding: 0;
  }
`;function u(e=new Date,{weekOrder:t=0,central:a=!1,startOfWeek:n=!1,selected:s=!1,previousMonth:r=!1,currentMonth:i=!1,nextMonth:o=!1,past:l=!1,today:d=!1,future:c=!1,disabled:h=!1,disabledInfo:_=""}={}){return{weekOrder:t,central:a,date:e,startOfWeek:n,selected:s,previousMonth:r,currentMonth:i,nextMonth:o,past:l,today:d,future:c,disabled:h,tabindex:"-1",ariaPressed:"false",ariaCurrent:void 0,disabledInfo:_}}function D(e,{firstDayOfWeek:t=0}={}){if("[object Date]"!==Object.prototype.toString.call(e))throw new Error("invalid date provided");let a=new Date(e);const n=new Date(e);for(;n.getDay()!==t;)n.setDate(n.getDate()-1),a=new Date(n);const s={days:[]};for(let e=0;e<7;e+=1)0!==e&&a.setDate(a.getDate()+1),s.days.push(u(new Date(a),{weekOrder:e,startOfWeek:0===e}));return s}function f(e,{firstDayOfWeek:t=0}={}){if("[object Date]"!==Object.prototype.toString.call(e))throw new Error("invalid date provided");const a=new Date(e);a.setDate(1);const n={firstDayOfWeek:t},s={weeks:[]};let r=D(a,n);do{s.weeks.push(r);const e=new Date(r.days[6].date);e.setDate(e.getDate()+1),r=D(e,n)}while(6!==s.weeks.length);return s}const p=["January","February","March","April","May","June","July","August","September","October","November","December"];function b(e,t,a=p){return{dayNumber:e.date.getDate(),monthName:a[e.date.getMonth()],year:e.date.getFullYear(),weekdayName:e.weekOrder?t[e.weekOrder]:t[0]}}const m=[1,2,3,4,5,6,7],g=[31,28,31,30,31,30,31,31,30,31,30,31];function y(e,{weekdays:a,monthsLabels:n=p}){const{dayNumber:s,monthName:r,year:o,weekdayName:l}=b(e,a,n);const d=1===s,c=6===e.weekOrder&&m.includes(s),h=e.startOfWeek&&m.includes(s);o%4!=0||o%100==0&&o%400!=0||(g[1]=29);const _=g[e.date.getMonth()],u=[];for(let e=_;e>=_-7;e-=1)u.push(e);const D=6===e.weekOrder&&u.includes(s),f=e.startOfWeek&&u.includes(s),y=_===s;return t`
    <td
      role="gridcell"
      class="calendar__day-cell"
      ?current-month=${e.currentMonth}
      ?first-day=${d}
      ?end-of-first-week=${c}
      ?start-of-first-full-week=${h}
      ?end-of-last-full-week=${D}
      ?start-of-last-week=${f}
      ?last-day=${y}
    >
      <div
        role="button"
        .date=${e.date}
        class="calendar__day-button"
        tabindex=${i(e.tabindex)}
        aria-pressed=${i(e.ariaPressed)}
        aria-current=${i(e.ariaCurrent)}
        aria-disabled=${e.disabled?"true":"false"}
        ?selected=${e.selected}
        ?past=${e.past}
        ?today=${e.today}
        ?future=${e.future}
        ?previous-month=${e.previousMonth}
        ?current-month=${e.currentMonth}
        ?next-month=${e.nextMonth}
      >
        <span class="calendar__day-button__text">${s}</span>
        <span class="u-sr-only">${`${r} ${o} ${l}`} ${`${e.disabledInfo}`}</span>
      </div>
    </td>
  `}const w=e=>e.classList.contains("calendar__day-button");function v(e){return"true"===e.getAttribute("aria-disabled")}class k extends(r(a)){static get localizeNamespaces(){return[{"lion-calendar":e=>{switch(e){case"bg-BG":case"bg":return import("./76fdd600.js");case"cs-CZ":case"cs":return import("./5aa28932.js");case"de-AT":case"de-DE":case"de":return import("./0f51bf95.js");case"en-AU":case"en-GB":case"en-PH":case"en-US":case"en":default:return import("./98ee2e24.js");case"es-ES":case"es":return import("./02ae7299.js");case"fr-FR":case"fr-BE":case"fr":return import("./7d87e663.js");case"hu-HU":case"hu":return import("./61556763.js");case"it-IT":case"it":return import("./f6e2be7a.js");case"nl-BE":case"nl-NL":case"nl":return import("./29513250.js");case"pl-PL":case"pl":return import("./285e7ac5.js");case"ro-RO":case"ro":return import("./f7ace3b0.js");case"ru-RU":case"ru":return import("./5b607be3.js");case"sk-SK":case"sk":return import("./4366c5bb.js");case"tr-TR":case"tr":return import("./cf1a29f8.js");case"uk-UA":case"uk":return import("./bedf9ee5.js");case"zh-CN":case"zh":return import("./e666870c.js")}}},...super.localizeNamespaces]}static get properties(){return{minDate:{attribute:!1},maxDate:{attribute:!1},disableDates:{attribute:!1},selectedDate:{attribute:!1},centralDate:{attribute:!1},firstDayOfWeek:{attribute:!1},weekdayHeaderNotation:{attribute:!1},locale:{attribute:!1},__focusedDate:{attribute:!1},__data:{attribute:!1}}}constructor(){super(),this.__data={months:[]},this.minDate=new Date(0),this.maxDate=new Date(864e13),this.dayPreprocessor=e=>e,this.disableDates=e=>!1,this.firstDayOfWeek=0,this.weekdayHeaderNotation="short",this.__today=s(new Date),this.centralDate=this.__today,this.__focusedDate=null,this.__connectedCallbackDone=!1,this.__eventsAdded=!1,this.locale="",this.__boundKeyboardNavigationEvent=this.__keyboardNavigationEvent.bind(this),this.__boundClickDateDelegation=this.__clickDateDelegation.bind(this),this.__boundFocusDateDelegation=this.__focusDateDelegation.bind(this),this.__boundBlurDateDelegation=this.__focusDateDelegation.bind(this)}static get styles(){return[_]}render(){return t`
      <div class="calendar" role="application">
        ${this.__renderNavigation()} ${this.__renderData()}
      </div>
    `}get focusedDate(){return this.__focusedDate}goToNextMonth(){this.__modifyDate(1,{dateType:"centralDate",type:"Month"})}goToPreviousMonth(){this.__modifyDate(-1,{dateType:"centralDate",type:"Month"})}goToNextYear(){this.__modifyDate(1,{dateType:"centralDate",type:"FullYear"})}goToPreviousYear(){this.__modifyDate(-1,{dateType:"centralDate",type:"FullYear"})}async focusDate(e){this.centralDate=e,await this.updateComplete,this.focusCentralDate()}focusCentralDate(){const e=this.shadowRoot?.querySelector("#js-content-wrapper");e.querySelector('[tabindex="0"]').focus(),this.__focusedDate=this.centralDate}async focusSelectedDate(){this.selectedDate&&await this.focusDate(this.selectedDate)}async connectedCallback(){super.connectedCallback(),this.__connectedCallbackDone=!0,await this.updateComplete,this.__eventsAdded||(this.__contentWrapperElement=this.shadowRoot?.getElementById("js-content-wrapper"),this.__contentWrapperElement.addEventListener("click",this.__boundClickDateDelegation),this.__contentWrapperElement.addEventListener("focus",this.__boundFocusDateDelegation),this.__contentWrapperElement.addEventListener("blur",this.__boundBlurDateDelegation),this.__contentWrapperElement.addEventListener("keydown",this.__boundKeyboardNavigationEvent),this.__eventsAdded=!0)}firstUpdated(e){super.firstUpdated(e),this.__calculateInitialCentralDate(),this.__data=this.__createData()}disconnectedCallback(){super.disconnectedCallback(),this.__contentWrapperElement&&(this.__contentWrapperElement.removeEventListener("click",this.__boundClickDateDelegation),this.__contentWrapperElement.removeEventListener("focus",this.__boundFocusDateDelegation),this.__contentWrapperElement.removeEventListener("blur",this.__boundBlurDateDelegation),this.__contentWrapperElement.removeEventListener("keydown",this.__boundKeyboardNavigationEvent),this.__eventsAdded=!1)}updated(e){super.updated(e),e.has("__focusedDate")&&this.__focusedDate&&this.focusCentralDate()}requestUpdate(e,t,a){if(super.requestUpdate(e,t,a),void 0===e)return;"__focusedDate"===e&&this.__focusedDateChanged();["centralDate","minDate","maxDate","selectedDate","disableDates"].includes(e)&&this.__connectedCallbackDone&&(this.__data=this.__createData())}initCentralDate(){this.selectedDate?this.focusSelectedDate():(this.__isEnabledDate(this.__initialCentralDate)?this.centralDate=this.__initialCentralDate:this.centralDate=this.findNearestEnabledDate(this.__initialCentralDate),this.focusCentralDate())}static enabledWarnings=super.enabledWarnings?.filter(e=>"change-in-update"!==e)||[];__calculateInitialCentralDate(){this.centralDate===this.__today&&this.selectedDate?this.centralDate=this.selectedDate:this.__isEnabledDate(this.centralDate)||(this.centralDate=this.findNearestEnabledDate(this.centralDate)),this.__initialCentralDate=this.centralDate}__renderMonthNavigation(e,a){const n=11===this.centralDate.getMonth()?d({locale:this.__getLocale()})[0]:d({locale:this.__getLocale()})[this.centralDate.getMonth()+1],s=0===this.centralDate.getMonth()?d({locale:this.__getLocale()})[11]:d({locale:this.__getLocale()})[this.centralDate.getMonth()-1],r=11===this.centralDate.getMonth()?a+1:a,i=0===this.centralDate.getMonth()?a-1:a;return t`
      <div class="calendar__navigation__month">
        ${this.__renderPreviousButton("Month",s,i)}
        <h2 class="calendar__navigation-heading" id="month" aria-atomic="true">${e}</h2>
        ${this.__renderNextButton("Month",n,r)}
      </div>
    `}__renderYearNavigation(e,a){const n=a+1,s=a-1;return t`
      <div class="calendar__navigation__year">
        ${this.__renderPreviousButton("FullYear",e,s)}
        <h2 class="calendar__navigation-heading" id="year" aria-atomic="true">${a}</h2>
        ${this.__renderNextButton("FullYear",e,n)}
      </div>
    `}__renderNavigation(){const e=d({locale:this.__getLocale()})[this.centralDate.getMonth()],a=this.centralDate.getFullYear();return t`
      <div class="calendar__navigation">
        ${this.__renderYearNavigation(e,a)} ${this.__renderMonthNavigation(e,a)}
      </div>
    `}__renderData(){return function(e,{weekdaysShort:a,weekdays:n,monthsLabels:s,dayTemplate:r=y}){return t`
    <div id="js-content-wrapper">
      ${e.months.map(e=>t`
          <table
            role="grid"
            data-wrap-cols
            aria-readonly="true"
            class="calendar__grid"
            aria-labelledby="month year"
          >
            <thead>
              <tr role="row">
                ${a.map((e,a)=>t`
                    <th
                      role="columnheader"
                      class="calendar__weekday-header"
                      scope="col"
                      aria-label="${n[a]}"
                    >
                      ${e}
                    </th>
                  `)}
              </tr>
            </thead>
            <tbody>
              ${e.weeks.map(e=>t`
                  <tr role="row">
                    ${e.days.map(e=>r(e,{weekdaysShort:a,weekdays:n,monthsLabels:s}))}
                  </tr>
                `)}
            </tbody>
          </table>
        `)}
    </div>
  `}(this.__data,{monthsLabels:d({locale:this.__getLocale()}),weekdaysShort:h({locale:this.__getLocale(),style:this.weekdayHeaderNotation,firstDayOfWeek:this.firstDayOfWeek}),weekdays:h({locale:this.__getLocale(),style:"long",firstDayOfWeek:this.firstDayOfWeek}),dayTemplate:y})}__getPreviousDisabled(e,t,a){let n,s=t;return this.minDate&&"Month"===e?n=function(e){const t=new Date(e);return t.setDate(0),new Date(t)}(this.centralDate)<this.minDate:this.minDate&&(n=a<this.minDate.getFullYear()),!n&&this.minDate&&"FullYear"===e&&a===this.minDate.getFullYear()&&this.centralDate.getMonth()<this.minDate.getMonth()&&(s=d({locale:this.__getLocale()})[this.minDate.getMonth()]),{disabled:n,month:s}}__getNextDisabled(e,t,a){let n,s=t;return this.maxDate&&"Month"===e?n=function(e){const t=new Date(e);return t.setDate(1),t.setMonth(e.getMonth()+1),t}(this.centralDate)>this.maxDate:this.maxDate&&(n=a>this.maxDate.getFullYear()),!n&&this.maxDate&&"FullYear"===e&&a===this.maxDate.getFullYear()&&this.centralDate.getMonth()>=this.maxDate.getMonth()&&(s=d({locale:this.__getLocale()})[this.maxDate.getMonth()]),{disabled:n,month:s}}__renderPreviousButton(e,a,n){const{disabled:s,month:r}=this.__getPreviousDisabled(e,a,n),i=this.__getNavigationLabel("previous",e,r,n);return t`
      <button
        class="calendar__previous-button"
        aria-label=${i}
        title=${i}
        @click=${()=>{"FullYear"===e?this.goToPreviousYear():this.goToPreviousMonth()}}
        ?disabled=${s}
      >
        ${this._previousIconTemplate()}
      </button>
    `}_previousIconTemplate(){return t`&lt;`}__renderNextButton(e,a,n){const{disabled:s,month:r}=this.__getNextDisabled(e,a,n),i=this.__getNavigationLabel("next",e,r,n);return t`
      <button
        class="calendar__next-button"
        aria-label=${i}
        title=${i}
        @click=${()=>{"FullYear"===e?this.goToNextYear():this.goToNextMonth()}}
        ?disabled=${s}
      >
        ${this._nextIconTemplate()}
      </button>
    `}_nextIconTemplate(){return t`&gt;`}__getNavigationLabel(e,t,a,n){return`${this.msgLit(`lion-calendar:${e}${t}`)}, ${a} ${n}`}__getSelectableDateRange(){const e=u(new Date(this.minDate)),t=u(new Date(this.maxDate)),a=e=>{const{dayNumber:t,monthName:a,year:n}=b(e,h({locale:this.__getLocale(),style:"long",firstDayOfWeek:this.firstDayOfWeek}));return`${t} ${a} ${n}`};return{earliestSelectableDate:a(e),latestSelectableDate:a(t)}}__coreDayPreprocessor(e,{currentMonth:t=!1}={}){const a=u(new Date(e.date),e),n=s(new Date);a.central=o(a.date,this.centralDate);const r=`${a.date.getFullYear()}${`0${a.date.getMonth()+1}`.slice(-2)}`,i=t&&`${t.getFullYear()}${`0${t.getMonth()+1}`.slice(-2)}`;return a.previousMonth=t&&r<i,a.currentMonth=t&&r===i,a.nextMonth=t&&r>i,a.selected=!!this.selectedDate&&o(a.date,this.selectedDate),a.past=a.date<n,a.today=o(a.date,n),a.future=a.date>n,a.disabled=this.disableDates(a.date),a.tabindex=a.central?"0":"-1",a.ariaPressed=a.selected?"true":"false",a.ariaCurrent=a.today?"date":void 0,a.disabledInfo="",a.disabled&&(a.disabledInfo=`${this.msgLit("lion-calendar:defaultDisabledDate")}`),this.minDate&&s(a.date)<s(this.minDate)&&(a.disabled=!0,a.disabledInfo=`${this.msgLit("lion-calendar:beforeDisabledDate",{params:this.__getSelectableDateRange().earliestSelectableDate})}`),this.maxDate&&s(a.date)>s(this.maxDate)&&(a.disabled=!0,a.disabledInfo=`${this.msgLit("lion-calendar:afterDisabledDate",{params:this.__getSelectableDateRange().latestSelectableDate})}`),this.dayPreprocessor(a)}__createData(e){const t=function(e,{firstDayOfWeek:t=0,pastMonths:a=0,futureMonths:n=0}={}){const s={months:[]};for(let n=a;n>0;n-=1){const a=new Date(e);a.setMonth(a.getMonth()-n),s.months.push(f(a,{firstDayOfWeek:t}))}s.months.push(f(e,{firstDayOfWeek:t}));for(let a=0;a<n;a+=1){const n=new Date(e);n.setMonth(n.getMonth()+(a+1)),s.months.push(f(n,{firstDayOfWeek:t}))}return s}(this.centralDate,{firstDayOfWeek:this.firstDayOfWeek,...e});return t.months.forEach((e,a)=>{e.weeks.forEach((e,n)=>{e.days.forEach((e,s)=>{const r=t.months[a].weeks[n].days[s],i=t.months[a].weeks[0].days[6].date;t.months[a].weeks[n].days[s]=this.__coreDayPreprocessor(r,{currentMonth:i})})})}),t}__dateSelectedByUser(e){this.selectedDate=e,this.__focusedDate=e,this.dispatchEvent(new CustomEvent("user-selected-date-changed",{detail:{selectedDate:e}}))}__focusedDateChanged(){this.__focusedDate&&(this.centralDate=this.__focusedDate)}findNextEnabledDate(e){const t=e||this.centralDate;return this.__findBestEnabledDateFor(t,{mode:"future"})}findPreviousEnabledDate(e){const t=e||this.centralDate;return this.__findBestEnabledDateFor(t,{mode:"past"})}findNearestEnabledDate(e){const t=e||this.centralDate;return this.__findBestEnabledDateFor(t,{mode:"both"})}__isEnabledDate(e){return!this.__coreDayPreprocessor({date:e}).disabled}__findBestEnabledDateFor(e,{mode:t="both"}={}){const a=this.minDate&&this.minDate>e?new Date(this.minDate):new Date(e),n=this.maxDate&&this.maxDate<e?new Date(this.maxDate):new Date(e);this.minDate&&this.minDate>e&&a.setDate(a.getDate()-1),this.maxDate&&this.maxDate<e&&n.setDate(n.getDate()+1);let s=0;do{if(s+=1,("both"===t||"future"===t)&&(a.setDate(a.getDate()+1),this.__isEnabledDate(a)))return a;if(("both"===t||"past"===t)&&(n.setDate(n.getDate()-1),this.__isEnabledDate(n)))return n}while(s<750);const r=e.getFullYear(),i=e.getMonth()+1,o=e.getDate();throw new Error(`Could not find a selectable date within +/- 750 day for ${r}/${i}/${o}`)}__clickDateDelegation(e){const t=e.composedPath()[0];w(t)&&!v(t)&&this.__dateSelectedByUser(t.date)}__focusDateDelegation(){!this.__focusedDate&&w(this.shadowRoot?.activeElement)&&(this.__focusedDate=this.shadowRoot?.activeElement?.date)}__blurDateDelegation(){setTimeout(()=>{this.shadowRoot?.activeElement&&!w(this.shadowRoot?.activeElement)&&(this.__focusedDate=null)},1)}__dayButtonSelection(e){w(e)&&!v(e)&&this.__dateSelectedByUser(e.date)}__keyboardNavigationEvent(e){switch(["ArrowLeft","ArrowUp","ArrowRight","ArrowDown","PageDown","PageUp"," ","Enter"].includes(e.key)&&e.preventDefault(),e.key){case" ":case"Enter":this.__dayButtonSelection(e.composedPath()[0]);break;case"ArrowUp":this.__modifyDate(-7,{dateType:"__focusedDate",type:"Date"});break;case"ArrowDown":this.__modifyDate(7,{dateType:"__focusedDate",type:"Date"});break;case"ArrowLeft":this.__modifyDate(-1,{dateType:"__focusedDate",type:"Date"});break;case"ArrowRight":this.__modifyDate(1,{dateType:"__focusedDate",type:"Date"});break;case"PageDown":!0===e.altKey?this.__modifyDate(1,{dateType:"__focusedDate",type:"FullYear"}):this.__modifyDate(1,{dateType:"__focusedDate",type:"Month"});break;case"PageUp":!0===e.altKey?this.__modifyDate(-1,{dateType:"__focusedDate",type:"FullYear"}):this.__modifyDate(-1,{dateType:"__focusedDate",type:"Month"});break;case"Tab":this.__focusedDate=null}}__modifyDate(e,{dateType:t,type:a}){const n=new Date(this.centralDate);if("Date"!==a&&n.setDate(1),n[`set${a}`](n[`get${a}`]()+e),"Date"!==a){const e=new Date(n.getFullYear(),n.getMonth()+1,0).getDate();n.setDate(Math.min(this.centralDate.getDate(),e))}this[t]=n}__getLocale(){return this.locale||this._localizeManager.locale}}export{k as L};
