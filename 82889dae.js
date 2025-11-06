import"./24f95583.js";import{x as o}from"./b4be29f1.js";import"./05905ff1.js";import"./09750da9.js";import"./887e72cd.js";import"./b72424c3.js";import"./969ba121.js";import"./b75c08d2.js";import"./6f59ad08.js";import"./a09a22d1.js";import"./0b376712.js";import"./394ddca1.js";import"./fa14a2cc.js";import"./50ee01c7.js";import"./eb47a05b.js";import"./e74d65e5.js";import"./c61afa71.js";import"./5a85bca3.js";import"./3e4749c6.js";import"./c7db7091.js";import"./14e62db2.js";import"./828a75da.js";import"./8696b442.js";import"./686245cb.js";import"./f7dedd2b.js";import"./140013ef.js";import"./051a62bd.js";import{l as i}from"./7da3d275.js";import{R as e}from"./cc85a6f4.js";import{M as t}from"./48ac1cb5.js";import"./5287c897.js";import"./5516584c.js";import"./143fde17.js";import"./dc2f5f5a.js";import"./44105dd4.js";import"./ec06148e.js";import"./c6fab747.js";import"./d45984a3.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./4cc99b59.js";import"./19d2607c.js";import"./afb8834e.js";import"./bfba5e5f.js";import"./4dc0ac82.js";import"./ad6a1a36.js";import"./c2aef983.js";import"./7077221a.js";import"./f12ecf0e.js";import"./ac41bbf8.js";import"./65cdf028.js";import"./acda6ea6.js";import"./0ed5d59c.js";import"./3599da39.js";import"./0fc7fbf3.js";import"./bbaa6280.js";import"./a36c54fe.js";import"./88185952.js";import"./24c57689.js";import"./10e1d49e.js";import"./e49751c9.js";import"./43bc0982.js";import"./ee959851.js";import"./895f5d38.js";import"./b7f85193.js";import"./622cc741.js";import"./bee32da7.js";import"./5254a80b.js";import"./88061fcd.js";import"./c84885cc.js";import"./5cdb1e6a.js";import"./c9978b47.js";import"./1980e635.js";import"./a06c5caf.js";import"./9a16257f.js";import"./7a362bca.js";import"./3ae224d1.js";import"./de5cbd7c.js";const a=()=>(i(),o`
    <lion-form>
      <form>
        <lion-fieldset name="fullName">
          <lion-input
            name="firstName"
            label="First Name"
            .fieldName="${"first name"}"
            .validators="${[new e]}"
          ></lion-input>
          <lion-input
            name="lastName"
            label="Last Name"
            .fieldName="${"last name"}"
            .validators="${[new e]}"
          ></lion-input>
        </lion-fieldset>
        <lion-input-date
          name="date"
          label="Date of application"
          .modelValue="${new Date("2000-12-12")}"
          .validators="${[new e]}"
        ></lion-input-date>
        <lion-input-datepicker
          name="datepicker"
          label="Date to be picked"
          .modelValue="${new Date("2020-12-12")}"
          .validators="${[new e]}"
        ></lion-input-datepicker>
        <lion-textarea
          name="bio"
          label="Biography"
          .fieldName="${"value"}"
          .validators="${[new e,new t(10)]}"
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
          .validators="${[new e]}"
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
          .validators="${[new e]}"
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
          .validators="${[new e]}"
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
        <lion-select label="Lyrics" name="lyrics" .validators="${[new e]}">
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
          .validators="${[new e("",{getMessage:()=>"Please accept our terms."})]}"
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
  `),l=document,n=[{key:"main",story:a}];let r=!1;for(const o of n){const i=l.querySelector(`[mdjs-story-name="${o.key}"]`);i&&(i.story=o.story,i.key=o.key,r=!0,Object.assign(i,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}r&&(customElements.get("mdjs-preview")||import("./a7b4f51b.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{a as main};
