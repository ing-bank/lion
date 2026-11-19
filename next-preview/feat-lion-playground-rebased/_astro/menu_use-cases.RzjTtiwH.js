const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.BWpRLYnc.js","_astro/MdJsPreview.CainKAmn.js","_astro/lit-element.B1EQMsFJ.js","_astro/lit-html.BX7rm8u-.js","_astro/dedupeMixin.6XPTJgK8.js","_astro/LionAccordion.CCw3hAmZ.js","_astro/lit-element.BOikny4r.js","_astro/uuid.DjYKNjre.js","_astro/define.BPRa0k46.js"])))=>i.map(i=>d[i]);
import{_ as o}from"./preload-helper.DOA02mLT.js";import"./lit-element.B1EQMsFJ.js";import{b as t}from"./lit-html.BX7rm8u-.js";import{a as r}from"./applyMenuDemoStyles.DZO5n0Tm.js";r();const m=()=>t`<nav>
  <button data-invoker>Open menu</button>
  <lion-menu>
    <div role="menuitem">Go to Definition</div>
    <div role="menuitem">Go to Type Definition</div>
    <div>
      <button role="menuitem" data-invoker>Peek</button>
      <lion-menu>
        <div role="menuitem">Peek Call Hierarchy</div>
        <div role="separator"></div>
        <div role="menuitem">Peek Definition</div>
      </lion-menu>
    </div>
    <div role="separator"></div>
    <div role="menuitem">Find all References</div>
  </lion-menu>
</nav>`,l=()=>t`<nav>
  <lion-menu bar>
    <div>
      <a role="menuitem" data-invoker href="#home">home</a>
    </div>
    <div role="menuitem">Go to Definition</div>
    <div role="menuitem">Go to Type Definition</div>
    <div>
      <button role="menuitem" data-invoker>Details</button>
      <lion-menu>
        <div role="menuitem">Peek Call Hierarchy</div>
        <div role="separator"></div>
        <div role="menuitem">Peek Definition</div>
      </lion-menu>
    </div>
    <div role="separator"></div>
    <div role="menuitem">Find all References</div>
  </lion-menu>
</nav>`,d=document,a=[{key:"HtmlStory34",story:m},{key:"HtmlStory35",story:l}];let n=!1;for(const i of a){const e=d.querySelector(`[mdjs-story-name="${i.key}"]`);e&&(e.story=i.story,e.key=i.key,n=!0,Object.assign(e,{simulatorUrl:"/next-preview/feat-lion-playground-rebased/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}n&&(customElements.get("mdjs-preview")||o(()=>import("./define.BWpRLYnc.js"),__vite__mapDeps([0,1,2,3,4,5,6,7])),customElements.get("mdjs-story")||o(()=>import("./define.BPRa0k46.js"),__vite__mapDeps([8,2,3])));export{m as HtmlStory34,l as HtmlStory35};
