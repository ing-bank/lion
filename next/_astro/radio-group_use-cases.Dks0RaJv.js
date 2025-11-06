const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.DYUong5B.js","_astro/node-tools_providence-analytics_overview.LFFQBZzG.js","_astro/lit-element.qDHKJJma.js","_astro/lit-html.C7L4dwLU.js","_astro/unsafe-html.J0GGe2Q7.js","_astro/directive.CGE4aKEl.js","_astro/define.m2CvvXyF.js"])))=>i.map(i=>d[i]);
import{_ as l}from"./preload-helper.4zY6-HO4.js";import"./node-tools_providence-analytics_overview.LFFQBZzG.js";import"./lit-element.qDHKJJma.js";import{x as i}from"./lit-html.C7L4dwLU.js";import"./unsafe-html.J0GGe2Q7.js";import"./lion-radio.vGSEP9Nl.js";import"./directive.CGE4aKEl.js";import"./ChoiceGroupMixin.v2API64R.js";import"./FormRegistrarMixin.YCZ6eayn.js";import"./InteractionStateMixin.BzvQ4Mf0.js";import"./dedupeMixin.6XPTJgK8.js";import"./LocalizeMixin.VYu75dkK.js";import"./directive-helpers.CLllgGgm.js";import"./async-directive.CHVe8p0E.js";import"./getLocalizeManager.W5d_ICRU.js";import"./index.BNCfcFQh.js";import"./lazifyInstantiation.CgYLRMC3.js";import"./DisabledMixin.Bm1nsErI.js";import"./FormGroupMixin.CQnfLXQx.js";import"./Validator.DAOhFpDH.js";import"./ChoiceInputMixin.BwyQsGXW.js";import"./LionInput.DRpWIRa3.js";import"./NativeTextFieldMixin.Cfq2aKpe.js";import"./LionField.DGnPMihp.js";const e=()=>i`
  <lion-radio-group name="dinos_2" label="What are your favourite dinosaurs?">
    <lion-radio label="allosaurus" .choiceValue="${"allosaurus"}"></lion-radio>
    <lion-radio label="brontosaurus" .choiceValue="${"brontosaurus"}" checked></lion-radio>
    <lion-radio label="diplodocus" .choiceValue="${"diplodocus"}"></lion-radio>
  </lion-radio-group>
`,s=()=>i`
  <lion-radio-group name="dinos_4" label="What are your favourite dinosaurs?">
    <lion-radio label="allosaurus" .choiceValue="${"allosaurus"}"></lion-radio>
    <lion-radio label="brontosaurus" .choiceValue="${"brontosaurus"}" disabled></lion-radio>
    <lion-radio label="diplodocus" .choiceValue="${"diplodocus"}"></lion-radio>
  </lion-radio-group>
`,t=()=>i`
  <lion-radio-group name="dinos_6" label="What are your favourite dinosaurs?" disabled>
    <lion-radio label="allosaurus" .choiceValue="${"allosaurus"}"></lion-radio>
    <lion-radio label="brontosaurus" .choiceValue="${"brontosaurus"}"></lion-radio>
    <lion-radio label="diplodocus" .choiceValue="${"diplodocus"}"></lion-radio>
  </lion-radio-group>
`,u=()=>i`
  <lion-radio-group name="dinos_7" label="Favourite dinosaur">
    <lion-radio .choiceValue="${"allosaurus"}">
      <label slot="label"
        ><a href="https://wikipedia.org/wiki/allosaurus" target="_blank">allosaurus</a></label
      >
    </lion-radio>
    <lion-radio .choiceValue="${"brontosaurus"}">
      <label slot="label"
        ><a href="https://wikipedia.org/wiki/brontosaurus" target="_blank">brontosaurus</a></label
      >
    </lion-radio>
    <lion-radio .choiceValue="${"diplodocus"}">
      <label slot="label"
        ><a href="https://wikipedia.org/wiki/diplodocus" target="_blank">diplodocus</a></label
      >
    </lion-radio>
  </lion-radio-group>
`,d=()=>i`
  <lion-radio-group name="dinosTwo" label="Favourite dinosaur">
    <lion-radio
      label="allosaurus"
      .choiceValue="${"allosaurus"}"
      help-text="Allosaurus is a genus of carnivorous theropod dinosaur that lived 155 to 145 million years ago during the late Jurassic period"
    ></lion-radio>
    <lion-radio
      label="brontosaurus"
      .choiceValue="${"brontosaurus"}"
      help-text="Brontosaurus is a genus of gigantic quadruped sauropod dinosaurs"
    ></lion-radio>
    <lion-radio
      label="diplodocus"
      .choiceValue="${"diplodocus"}"
      help-text="Diplodocus is a genus of diplodocid sauropod dinosaurs whose fossils were first discovered in 1877 by S. W. Williston"
    ></lion-radio>
  </lion-radio-group>
`,n=({shadowRoot:a})=>i`
  <lion-radio-group
    name="dinosTwo"
    label="Favourite dinosaur"
    @model-value-changed=${o=>o.target.parentElement.querySelector("#selectedDinosaur").innerText=o.target.modelValue}
  >
    <lion-radio label="allosaurus" .choiceValue="${"allosaurus"}"></lion-radio>
    <lion-radio label="brontosaurus" .choiceValue="${"brontosaurus"}"></lion-radio>
    <lion-radio label="diplodocus" .choiceValue="${"diplodocus"}"></lion-radio>
  </lion-radio-group>
  <br />
  <span>Selected dinosaur: <strong id="selectedDinosaur">N/A</strong></span>
`,c=document,p=[{key:"preSelect",story:e},{key:"disabledRadio",story:s},{key:"disabledGroup",story:t},{key:"label",story:u},{key:"helpText",story:d},{key:"event",story:n}];let r=!1;for(const a of p){const o=c.querySelector(`[mdjs-story-name="${a.key}"]`);o&&(o.story=a.story,o.key=a.key,r=!0,Object.assign(o,{simulatorUrl:"/next/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}r&&(customElements.get("mdjs-preview")||l(()=>import("./define.DYUong5B.js"),__vite__mapDeps([0,1,2,3,4,5])),customElements.get("mdjs-story")||l(()=>import("./define.m2CvvXyF.js"),__vite__mapDeps([6,2,3])));export{t as disabledGroup,s as disabledRadio,n as event,d as helpText,u as label,e as preSelect};
