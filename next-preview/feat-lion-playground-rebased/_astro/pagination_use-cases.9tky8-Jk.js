const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.BWpRLYnc.js","_astro/MdJsPreview.CainKAmn.js","_astro/lit-element.B1EQMsFJ.js","_astro/lit-html.BX7rm8u-.js","_astro/dedupeMixin.6XPTJgK8.js","_astro/LionAccordion.CCw3hAmZ.js","_astro/lit-element.BOikny4r.js","_astro/uuid.DjYKNjre.js","_astro/define.BPRa0k46.js"])))=>i.map(i=>d[i]);
import{_ as o}from"./preload-helper.DOA02mLT.js";import"./MdJsPreview.CainKAmn.js";import"./lit-element.B1EQMsFJ.js";import{b as n}from"./lit-html.BX7rm8u-.js";import"./node-tools_providence-analytics_overview.BQH7j7jT.js";import"./lion-pagination.BFL559GO.js";const a=()=>n` <lion-pagination count="20"></lion-pagination> `,m=()=>n` <lion-pagination></lion-pagination> `,g=({shadowRoot:t})=>(setTimeout(()=>{t.getElementById("pagination-method-demo").innerText=t.getElementById("pagination-method").current}),n`
    <p>The current page is: <span id="pagination-method-demo"></span></p>
    <lion-pagination
      id="pagination-method"
      count="100"
      current="75"
      @current-changed=${e=>{const i=t.getElementById("pagination-method-demo");i.innerText=e.target.current}}
    ></lion-pagination>
    <section style="margin-top:16px">
      <button @click="${()=>t.getElementById("pagination-method").previous()}">
        Previous
      </button>
      <button @click="${()=>t.getElementById("pagination-method").next()}">Next</button>
      <br />
      <br />
      <button @click="${()=>t.getElementById("pagination-method").first()}">
        First
      </button>
      <button @click="${()=>t.getElementById("pagination-method").last()}">Last</button>
      <br />
      <br />
      <button @click="${()=>t.getElementById("pagination-method").goto(55)}">
        Go to 55
      </button>
    </section>
  `),s=({shadowRoot:t})=>(setTimeout(()=>{t.getElementById("pagination-event-demo-text").innerText=t.getElementById("pagination-event-demo").current}),n`
    <p>The current page is: <span id="pagination-event-demo-text"></span></p>
    <lion-pagination
      id="pagination-event-demo"
      count="10"
      current="5"
      @current-changed=${e=>{const i=t.getElementById("pagination-event-demo-text");i.innerText=e.target.current}}
    ></lion-pagination>
  `),u=document,p=[{key:"withoutCurrentPage",story:a},{key:"ensureCount",story:m},{key:"methods",story:g},{key:"event",story:s}];let r=!1;for(const t of p){const e=u.querySelector(`[mdjs-story-name="${t.key}"]`);e&&(e.story=t.story,e.key=t.key,r=!0,Object.assign(e,{simulatorUrl:"/next-preview/feat-lion-playground-rebased/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}r&&(customElements.get("mdjs-preview")||o(()=>import("./define.BWpRLYnc.js"),__vite__mapDeps([0,1,2,3,4,5,6,7])),customElements.get("mdjs-story")||o(()=>import("./define.BPRa0k46.js"),__vite__mapDeps([8,2,3])));export{m as ensureCount,s as event,g as methods,a as withoutCurrentPage};
