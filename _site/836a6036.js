import"./24f95583.js";import{x as t}from"./b4be29f1.js";import"./05905ff1.js";import"./06e84604.js";import"./4cc99b59.js";import"./19d2607c.js";import"./afb8834e.js";import"./d45984a3.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./dc2f5f5a.js";const e=()=>t` <lion-pagination count="20"></lion-pagination> `,n=()=>t` <lion-pagination></lion-pagination> `,o=({shadowRoot:e})=>(setTimeout(()=>{e.getElementById("pagination-method-demo").innerText=e.getElementById("pagination-method").current}),t`
    <p>The current page is: <span id="pagination-method-demo"></span></p>
    <lion-pagination
      id="pagination-method"
      count="100"
      current="75"
      @current-changed=${t=>{e.getElementById("pagination-method-demo").innerText=t.target.current}}
    ></lion-pagination>
    <section style="margin-top:16px">
      <button @click="${()=>e.getElementById("pagination-method").previous()}">
        Previous
      </button>
      <button @click="${()=>e.getElementById("pagination-method").next()}">Next</button>
      <br />
      <br />
      <button @click="${()=>e.getElementById("pagination-method").first()}">
        First
      </button>
      <button @click="${()=>e.getElementById("pagination-method").last()}">Last</button>
      <br />
      <br />
      <button @click="${()=>e.getElementById("pagination-method").goto(55)}">
        Go to 55
      </button>
    </section>
  `),i=({shadowRoot:e})=>(setTimeout(()=>{e.getElementById("pagination-event-demo-text").innerText=e.getElementById("pagination-event-demo").current}),t`
    <p>The current page is: <span id="pagination-event-demo-text"></span></p>
    <lion-pagination
      id="pagination-event-demo"
      count="10"
      current="5"
      @current-changed=${t=>{e.getElementById("pagination-event-demo-text").innerText=t.target.current}}
    ></lion-pagination>
  `),a=document,r=[{key:"withoutCurrentPage",story:e},{key:"ensureCount",story:n},{key:"methods",story:o},{key:"event",story:i}];let m=!1;for(const t of r){const e=a.querySelector(`[mdjs-story-name="${t.key}"]`);e&&(e.story=t.story,e.key=t.key,m=!0,Object.assign(e,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}m&&(customElements.get("mdjs-preview")||import("./a7b4f51b.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{n as ensureCount,i as event,o as methods,e as withoutCurrentPage};
