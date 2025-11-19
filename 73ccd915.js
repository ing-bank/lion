import"./24f95583.js";import{x as o}from"./b4be29f1.js";import"./05905ff1.js";import"./09750da9.js";import"./9cfd5457.js";import"./4de68b8d.js";import"./8763e36e.js";import"./d3a1c786.js";import"./ee0e4c4a.js";import"./a748cc9c.js";import"./f8f7a3e5.js";import"./b603a46a.js";import"./f59d9df7.js";import"./9db50cd7.js";import"./d5d7e9e8.js";import"./04dc7892.js";import"./2fd6213a.js";import"./90702e3a.js";import"./5efc6cba.js";import"./f5e3cf69.js";import"./58700fdc.js";import"./b57227cf.js";import"./5e7ff1cd.js";import"./01fe287e.js";import"./c35e1f22.js";import"./86d0ae84.js";import"./051a62bd.js";import{l as e}from"./c85cfbca.js";import{R as i}from"./cc85a6f4.js";import{M as t}from"./48ac1cb5.js";import"./5287c897.js";import"./5516584c.js";import"./143fde17.js";import"./dc2f5f5a.js";import"./0bf7a48d.js";import"./48b0a907.js";import"./7902d8e0.js";import"./d45984a3.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./4cc99b59.js";import"./19d2607c.js";import"./afb8834e.js";import"./788d808c.js";import"./4dc0ac82.js";import"./130d2801.js";import"./4a239ef1.js";import"./9157d4cc.js";import"./298b3bc0.js";import"./9b4d17c9.js";import"./65cdf028.js";import"./acda6ea6.js";import"./0ed5d59c.js";import"./459b1eec.js";import"./b494bfc1.js";import"./9e1b447d.js";import"./5668bf4f.js";import"./88185952.js";import"./24c57689.js";import"./10e1d49e.js";import"./e49751c9.js";import"./81eca363.js";import"./ee959851.js";import"./895f5d38.js";import"./b7f85193.js";import"./622cc741.js";import"./bee32da7.js";import"./5254a80b.js";import"./88061fcd.js";import"./c84885cc.js";import"./5cdb1e6a.js";import"./c9978b47.js";import"./1fe9105d.js";import"./a06c5caf.js";import"./9a16257f.js";import"./4777ff9b.js";import"./3ae224d1.js";import"./de5cbd7c.js";const l=()=>(e(),o`
    <lion-form>
      <form>
        <lion-fieldset name="fullName">
          <lion-input
            name="firstName"
            label="First Name"
            .fieldName="${"first name"}"
            .validators="${[new i]}"
          ></lion-input>
          <lion-input
            name="lastName"
            label="Last Name"
            .fieldName="${"last name"}"
            .validators="${[new i]}"
          ></lion-input>
        </lion-fieldset>
        <lion-input-date
          name="date"
          label="Date of application"
          .modelValue="${new Date("2000-12-12")}"
          .validators="${[new i]}"
        ></lion-input-date>
        <lion-input-datepicker
          name="datepicker"
          label="Date to be picked"
          .modelValue="${new Date("2020-12-12")}"
          .validators="${[new i]}"
        ></lion-input-datepicker>
        <lion-textarea
          name="bio"
          label="Biography"
          .fieldName="${"value"}"
          .validators="${[new i,new t(10)]}"
          help-text="Please enter at least 10 characters"
        ></lion-textarea>
        <lion-input-amount name="money" label="Money"></lion-input-amount>
        <lion-input-iban name="iban" label="Iban"></lion-input-iban>
        <lion-input-email name="email" label="Email"></lion-input-email>
        <lion-input-file name="file" label="File"></lion-input-file>
        <lion-input-tel name="tel" label="Telephone number"></lion-input-tel>
        <lion-checkbox-group
          label="What do you like?"
          name="checkers"
          .validators="${[new i]}"
          .fieldName="${"value"}"
        >
          <lion-checkbox .choiceValue="${"foo"}" label="I like foo"></lion-checkbox>
          <lion-checkbox .choiceValue="${"bar"}" label="I like bar"></lion-checkbox>
          <lion-checkbox .choiceValue="${"baz"}" label="I like baz"></lion-checkbox>
        </lion-checkbox-group>
        <lion-radio-group
          name="dinosaurs"
          label="Favorite dinosaur"
          .fieldName="${"dinosaur"}"
          .validators="${[new i]}"
        >
          <lion-radio .choiceValue="${"allosaurus"}" label="allosaurus"></lion-radio>
          <lion-radio .choiceValue="${"brontosaurus"}" label="brontosaurus"></lion-radio>
          <lion-radio .choiceValue="${"diplodocus"}" label="diplodocus"></lion-radio>
        </lion-radio-group>
        <lion-listbox name="favoriteFruit" label="Favorite fruit">
          <lion-option .choiceValue="${"Apple"}">Apple</lion-option>
          <lion-option checked .choiceValue="${"Banana"}">Banana</lion-option>
          <lion-option .choiceValue="${"Mango"}">Mango</lion-option>
        </lion-listbox>
        <lion-combobox
          .validators="${[new i]}"
          name="favoriteMovie"
          label="Favorite movie"
          autocomplete="both"
        >
          <lion-option checked .choiceValue="${"Rocky"}">Rocky</lion-option>
          <lion-option .choiceValue="${"Rocky II"}">Rocky II</lion-option>
          <lion-option .choiceValue="${"Rocky III"}">Rocky III</lion-option>
          <lion-option .choiceValue="${"Rocky IV"}">Rocky IV</lion-option>
          <lion-option .choiceValue="${"Rocky V"}">Rocky V</lion-option>
          <lion-option .choiceValue="${"Rocky Balboa"}">Rocky Balboa</lion-option>
        </lion-combobox>
        <lion-select-rich name="favoriteColor" label="Favorite color">
          <lion-option .choiceValue="${"red"}">Red</lion-option>
          <lion-option .choiceValue="${"hotpink"}" checked>Hotpink</lion-option>
          <lion-option .choiceValue="${"teal"}">Teal</lion-option>
        </lion-select-rich>
        <lion-select label="Lyrics" name="lyrics" .validators="${[new i]}">
          <select slot="input">
            <option value="1">Fire up that loud</option>
            <option value="2">Another round of shots...</option>
            <option value="3">Drop down for what?</option>
          </select>
        </lion-select>
        <lion-input-range
          name="range"
          min="1"
          max="5"
          .modelValue="${2.3}"
          unit="%"
          step="0.1"
          label="Input range"
        ></lion-input-range>
        <lion-checkbox-group
          name="terms"
          .validators="${[new i("",{getMessage:()=>"Please accept our terms."})]}"
        >
          <lion-checkbox
            .choiceValue="${"true"}"
            label="I blindly accept all terms and conditions"
          ></lion-checkbox>
        </lion-checkbox-group>
        <lion-switch name="notifications" label="Notifications"></lion-switch>
        <lion-input-stepper max="5" min="0" name="rsvp">
          <label slot="label">RSVP</label>
          <div slot="help-text">Max. 5 guests</div>
        </lion-input-stepper>
        <div class="buttons">
          <lion-button-submit>Submit</lion-button-submit>
          <lion-button-reset
            @click="${o=>o.currentTarget.parentElement.parentElement.parentElement.resetGroup()}"
            >Reset</lion-button-reset
          >
        </div>
      </form>
    </lion-form>
  `),a=document,n=[{key:"main",story:l}];let r=!1;for(const o of n){const e=a.querySelector(`[mdjs-story-name="${o.key}"]`);e&&(e.story=o.story,e.key=o.key,r=!0,Object.assign(e,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}r&&(customElements.get("mdjs-preview")||import("./a7b4f51b.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{l as main};
