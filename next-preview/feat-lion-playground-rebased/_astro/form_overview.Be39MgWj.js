const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.BWpRLYnc.js","_astro/MdJsPreview.CainKAmn.js","_astro/lit-element.B1EQMsFJ.js","_astro/lit-html.BX7rm8u-.js","_astro/dedupeMixin.6XPTJgK8.js","_astro/LionAccordion.CCw3hAmZ.js","_astro/lit-element.BOikny4r.js","_astro/uuid.DjYKNjre.js","_astro/define.BPRa0k46.js"])))=>i.map(i=>d[i]);
import{_ as n}from"./preload-helper.DOA02mLT.js";import"./MdJsPreview.CainKAmn.js";import"./lit-element.B1EQMsFJ.js";import{b as i}from"./lit-html.BX7rm8u-.js";import"./node-tools_providence-analytics_overview.BQH7j7jT.js";import"./lion-input.B6pwrbDb.js";import"./lion-form.rOgotOyV.js";const m=()=>i`
    <lion-form @submit="${e=>{const o=e.target.serializedValue;console.log("formData",o),fetch("/api/foo/",{method:"POST",body:JSON.stringify(o)})}}">
      <form @submit="${e=>e.preventDefault()}">
        <lion-input name="firstName" label="First Name" .modelValue="${"Foo"}"></lion-input>
        <lion-input name="lastName" label="Last Name" .modelValue="${"Bar"}"></lion-input>
        <button>Submit</button>
      </form>
    </lion-form>
  `,s=document,a=[{key:"main",story:m}];let r=!1;for(const t of a){const e=s.querySelector(`[mdjs-story-name="${t.key}"]`);e&&(e.story=t.story,e.key=t.key,r=!0,Object.assign(e,{simulatorUrl:"/next-preview/feat-lion-playground-rebased/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}r&&(customElements.get("mdjs-preview")||n(()=>import("./define.BWpRLYnc.js"),__vite__mapDeps([0,1,2,3,4,5,6,7])),customElements.get("mdjs-story")||n(()=>import("./define.BPRa0k46.js"),__vite__mapDeps([8,2,3])));export{m as main};
