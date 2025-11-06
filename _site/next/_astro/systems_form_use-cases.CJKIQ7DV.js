const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.DYUong5B.js","_astro/node-tools_providence-analytics_overview.LFFQBZzG.js","_astro/lit-element.qDHKJJma.js","_astro/lit-html.C7L4dwLU.js","_astro/unsafe-html.J0GGe2Q7.js","_astro/directive.CGE4aKEl.js","_astro/define.m2CvvXyF.js"])))=>i.map(i=>d[i]);
import{_ as t}from"./preload-helper.4zY6-HO4.js";import"./node-tools_providence-analytics_overview.LFFQBZzG.js";import"./lit-element.qDHKJJma.js";import{x as n}from"./lit-html.C7L4dwLU.js";import"./unsafe-html.J0GGe2Q7.js";import"./lion-button.Cn-OiRgW.js";import"./lion-checkbox.BjxNdLhI.js";import"./lion-combobox.CkBF729a.js";import"./lion-option.BK1gXvzd.js";import"./lion-fieldset.BV1UH1f7.js";import"./lion-form.BTIvQ0xp.js";import"./lion-input-amount.DcX5TAZf.js";import"./lion-input-date.CjrpInXw.js";import"./lion-input-datepicker.BaAqWBDD.js";import"./lion-input-email.B_S6djr8.js";import"./lion-input-file.sSJZhWom.js";import"./lion-input-tel.DSUAmd01.js";import"./lion-input-tel-dropdown.C5TJnEG3.js";import"./lion-input-iban.CzBmVbAj.js";import"./lion-input-range.B8brPHrZ.js";import"./lion-input-stepper.Can-IGZB.js";import"./lion-input.CfgqeAN3.js";import"./lion-listbox.C2RtB8pZ.js";import"./lion-radio.vGSEP9Nl.js";import"./lion-select.9hSnArLc.js";import"./lion-select-rich.aIZd_8w4.js";import"./lion-switch.BbuGhEno.js";import"./lion-textarea.D_2uKuPi.js";import"./lion-button-submit.DJFjv3gZ.js";import{l as a}from"./loadDefaultFeedbackMessages.BQgeO4Ka.js";import{R as o}from"./Required.DgHIr_Cn.js";import{M as r}from"./StringValidators.UXrPEtgv.js";import"./directive.CGE4aKEl.js";import"./LionButton.B9nVXwmc.js";import"./DisabledWithTabIndexMixin.DiSGvuwH.js";import"./DisabledMixin.Bm1nsErI.js";import"./dedupeMixin.6XPTJgK8.js";import"./ChoiceGroupMixin.v2API64R.js";import"./FormRegistrarMixin.YCZ6eayn.js";import"./InteractionStateMixin.BzvQ4Mf0.js";import"./LocalizeMixin.VYu75dkK.js";import"./directive-helpers.CLllgGgm.js";import"./async-directive.CHVe8p0E.js";import"./getLocalizeManager.W5d_ICRU.js";import"./index.BNCfcFQh.js";import"./lazifyInstantiation.CgYLRMC3.js";import"./FormGroupMixin.CQnfLXQx.js";import"./Validator.DAOhFpDH.js";import"./ChoiceInputMixin.BwyQsGXW.js";import"./LionInput.DRpWIRa3.js";import"./NativeTextFieldMixin.Cfq2aKpe.js";import"./LionField.DGnPMihp.js";import"./LionCombobox.D5iEaRc7.js";import"./OverlayMixin.yM-HkbSu.js";import"./withDropdownConfig.eRP55go6.js";import"./withClickInteraction.B1DPetIk.js";import"./validators.BccilvTl.js";import"./LionOption.81NUo0Oz.js";import"./LionFieldset.CalDwoQW.js";import"./LionInputAmount.CJWpEuSp.js";import"./formatNumber.aN4wfHaw.js";import"./getLocale.PZ4ia-vo.js";import"./parseNumber.Cin8KryK.js";import"./NumberValidators.CmKpqCIb.js";import"./LionInputDate.BXNz_Vk3.js";import"./formatDate.D_ccCp8N.js";import"./normalizeIntlDate.jFpsyBMC.js";import"./DateValidators.CEq8F9yx.js";import"./normalizeDateTime.BoDqBOW2.js";import"./if-defined.CV50pAZo.js";import"./ArrowMixin.HbYR3IvJ.js";import"./withBottomSheetConfig.Cflq9zAr.js";import"./withModalDialogConfig.CPyLhuB7.js";import"./LionCalendar.CeLikVv5.js";import"./repeat.BYpCtbkJ.js";import"./LionInputTel.DVBCZWII.js";import"./PhoneUtilManager.DkvpFzJF.js";import"./preprocessors.BqZFnKWs.js";import"./LionInputTelDropdown.BB7wW4QH.js";import"./ref.DN9F-cVD.js";import"./ScopedStylesController.JZrBxnCH.js";const p=()=>(a(),n`
    <lion-form>
      <form>
        <lion-fieldset name="fullName">
          <lion-input
            name="firstName"
            label="First Name"
            .fieldName="${"first name"}"
            .validators="${[new o]}"
          ></lion-input>
          <lion-input
            name="lastName"
            label="Last Name"
            .fieldName="${"last name"}"
            .validators="${[new o]}"
          ></lion-input>
        </lion-fieldset>
        <lion-input-date
          name="date"
          label="Date of application"
          .modelValue="${new Date("2000-12-12")}"
          .validators="${[new o]}"
        ></lion-input-date>
        <lion-input-datepicker
          name="datepicker"
          label="Date to be picked"
          .modelValue="${new Date("2020-12-12")}"
          .validators="${[new o]}"
        ></lion-input-datepicker>
        <lion-textarea
          name="bio"
          label="Biography"
          .fieldName="${"value"}"
          .validators="${[new o,new r(10)]}"
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
          .validators="${[new o]}"
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
          .validators="${[new o]}"
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
          .validators="${[new o]}"
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
        <lion-select label="Lyrics" name="lyrics" .validators="${[new o]}">
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
          .validators="${[new o("",{getMessage:()=>"Please accept our terms."})]}"
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
            @click="${i=>i.currentTarget.parentElement.parentElement.parentElement.resetGroup()}"
            >Reset</lion-button-reset
          >
        </div>
      </form>
    </lion-form>
  `),m=document,c=[{key:"main",story:p}];let l=!1;for(const i of c){const e=m.querySelector(`[mdjs-story-name="${i.key}"]`);e&&(e.story=i.story,e.key=i.key,l=!0,Object.assign(e,{simulatorUrl:"/next/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}l&&(customElements.get("mdjs-preview")||t(()=>import("./define.DYUong5B.js"),__vite__mapDeps([0,1,2,3,4,5])),customElements.get("mdjs-story")||t(()=>import("./define.m2CvvXyF.js"),__vite__mapDeps([6,2,3])));export{p as main};
