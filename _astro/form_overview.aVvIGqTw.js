const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.D5IFK1jp.js","_astro/MdJsPreview.B62up6PK.js","_astro/lit-element.DxRhnkit.js","_astro/lit-html.BX7rm8u-.js","_astro/dedupeMixin.6XPTJgK8.js","_astro/lit-element.BOikny4r.js","_astro/uuid.DjYKNjre.js","_astro/define.DBgp7shK.js"])))=>i.map(i=>d[i]);
import{_ as m}from"./preload-helper.CVfkMyKi.js";import"./MdJsPreview.B62up6PK.js";import"./lit-element.DxRhnkit.js";import{b as n}from"./lit-html.BX7rm8u-.js";import"./unsafe-html.FHlAasnX.js";import"./lion-input.DmSJ_gE7.js";import"./lion-form.FF5oNE9G.js";const r=()=>n`
    <lion-form @submit="${t=>{const o=t.target.serializedValue;console.log("formData",o),fetch("/api/foo/",{method:"POST",body:JSON.stringify(o)})}}">
      <form @submit="${t=>t.preventDefault()}">
        <lion-input name="firstName" label="First Name" .modelValue="${"Foo"}"></lion-input>
        <lion-input name="lastName" label="Last Name" .modelValue="${"Bar"}"></lion-input>
        <button>Submit</button>
      </form>
    </lion-form>
  `,s=document,a=[{key:"main",story:r}];let i=!1;for(const e of a){const t=s.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,i=!0,Object.assign(t,{simulatorUrl:"/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}i&&(customElements.get("mdjs-preview")||m(()=>import("./define.D5IFK1jp.js"),__vite__mapDeps([0,1,2,3,4,5,6])),customElements.get("mdjs-story")||m(()=>import("./define.DBgp7shK.js"),__vite__mapDeps([7,2,3])));export{r as main};
