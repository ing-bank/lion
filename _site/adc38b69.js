import"./24f95583.js";import{x as o}from"./b4be29f1.js";import"./05905ff1.js";import"./828a75da.js";import"./44105dd4.js";import"./ec06148e.js";import"./c6fab747.js";import"./dc2f5f5a.js";import"./d45984a3.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./4cc99b59.js";import"./19d2607c.js";import"./afb8834e.js";import"./143fde17.js";import"./bfba5e5f.js";import"./4dc0ac82.js";import"./ad6a1a36.js";import"./c2aef983.js";import"./7077221a.js";import"./f12ecf0e.js";const a=()=>o`
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
`,e=()=>o`
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
`,r=()=>o`
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
`,d=document,u=[{key:"preSelect",story:a},{key:"disabledRadio",story:i},{key:"disabledGroup",story:l},{key:"label",story:e},{key:"helpText",story:r},{key:"event",story:s}];let n=!1;for(const o of u){const a=d.querySelector(`[mdjs-story-name="${o.key}"]`);a&&(a.story=o.story,a.key=o.key,n=!0,Object.assign(a,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}n&&(customElements.get("mdjs-preview")||import("./a7b4f51b.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{l as disabledGroup,i as disabledRadio,s as event,r as helpText,e as label,a as preSelect};
