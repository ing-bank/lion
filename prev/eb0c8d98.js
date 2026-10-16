import"./f1151d68.js";import{x as o}from"./b8bc2eda.js";import"./6638bb86.js";import"./2508e43a.js";import"./2cefa045.js";import"./4abf0ca8.js";import"./dc2f5f5a.js";import"./7c882590.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./c48d90f3.js";import"./be5f2fd3.js";import"./dcadf410.js";import"./143fde17.js";import"./6722e641.js";import"./af1609b4.js";import"./92fca6ea.js";import"./4dc0ac82.js";import"./18551691.js";import"./45058e5d.js";import"./57941646.js";import"./7eab6f7c.js";const a=()=>o`
  <lion-radio-group name="dinos_2" label="What are your favourite dinosaurs?">
    <lion-radio label="allosaurus" .choiceValue="${"allosaurus"}"></lion-radio>
    <lion-radio label="brontosaurus" .choiceValue="${"brontosaurus"}" checked></lion-radio>
    <lion-radio label="diplodocus" .choiceValue="${"diplodocus"}"></lion-radio>
  </lion-radio-group>
`,i=()=>o`
  <lion-radio-group name="dinos_4" label="What are your favourite dinosaurs?">
    <lion-radio label="allosaurus" .choiceValue="${"allosaurus"}"></lion-radio>
    <lion-radio label="brontosaurus" .choiceValue="${"brontosaurus"}" disabled></lion-radio>
    <lion-radio label="diplodocus" .choiceValue="${"diplodocus"}"></lion-radio>
  </lion-radio-group>
`,l=()=>o`
  <lion-radio-group name="dinos_6" label="What are your favourite dinosaurs?" disabled>
    <lion-radio label="allosaurus" .choiceValue="${"allosaurus"}"></lion-radio>
    <lion-radio label="brontosaurus" .choiceValue="${"brontosaurus"}"></lion-radio>
    <lion-radio label="diplodocus" .choiceValue="${"diplodocus"}"></lion-radio>
  </lion-radio-group>
`,r=()=>o`
  <lion-radio-group name="dinos_7" label="Favourite dinosaur">
    <lion-radio .choiceValue="${"allosaurus"}">
      <label slot="label"><strong>allosaurus</strong></label>
    </lion-radio>
    <lion-radio .choiceValue="${"brontosaurus"}">
      <label slot="label"><strong>brontosaurus</strong></label>
    </lion-radio>
    <lion-radio .choiceValue="${"diplodocus"}">
      <label slot="label"><strong>diplodocus</strong></label>
    </lion-radio>
  </lion-radio-group>
`,e=()=>o`
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
`,s=({shadowRoot:a})=>o`
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
`,d=document,u=[{key:"preSelect",story:a},{key:"disabledRadio",story:i},{key:"disabledGroup",story:l},{key:"label",story:r},{key:"helpText",story:e},{key:"event",story:s}];let n=!1;for(const o of u){const a=d.querySelector(`[mdjs-story-name="${o.key}"]`);a&&(a.story=o.story,a.key=o.key,n=!0,Object.assign(a,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}n&&(customElements.get("mdjs-preview")||import("./e90784d0.js"),customElements.get("mdjs-story")||import("./0defd61d.js"));export{l as disabledGroup,i as disabledRadio,s as event,e as helpText,r as label,a as preSelect};
