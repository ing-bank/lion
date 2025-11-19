/** script code **/
import { Required, Validator } from '@lion/ui/form-core.js';
import { loadDefaultFeedbackMessages } from '@lion/ui/validate-messages.js';
import { html } from '@mdjs/mdjs-preview';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { LitElement } from 'lit';
import '@lion/ui/define/lion-input-file.js';
loadDefaultFeedbackMessages();
/** stories code **/
export const basicFileUpload = () => {
  return html`
    <lion-input-file
      label="Passport"
      max-file-size="1024000"
      accept=".jpg,.svg,.xml,image/svg+xml"
      @file-list-changed="${ev => {
        console.log('fileList', ev.detail.newFiles);
      }}"
    >
    </lion-input-file>
  `;
};
export const acceptValidator = () => {
  return html`
    <lion-input-file
      accept=".jpg,.svg,.xml,image/svg+xml"
      label="Passport"
      enable-drop-zone
      @file-list-changed="${ev => {
        console.log(ev.detail.newFiles);
      }}"
    >
    </lion-input-file>
  `;
};
export const sizeValidator = () => {
  return html`
    <lion-input-file
      max-file-size="2048"
      label="Passport"
      @file-list-changed="${ev => {
        console.log(ev.detail.newFiles);
      }}"
    >
    </lion-input-file>
  `;
};
export const multipleFileUpload = () => {
  return html`
    <lion-input-file
      label="Passport"
      name="upload"
      multiple
      max-file-size="1024000"
      @file-removed="${ev => {
        console.log('removed file details', ev.detail);
      }}"
      @file-list-changed="${ev => {
        console.log('file-list-changed', ev.detail.newFiles);
      }}"
      @model-value-changed="${ev => {
        console.log('model-value-changed', ev);
      }}"
    >
    </lion-input-file>
  `;
};
export const prefilledState = () => {
  return html`
    <lion-input-file
      label="Passport"
      name="myFiles"
      multiple
      .validators="${[new Required()]}"
      .uploadResponse="${[
        {
          name: 'file1.txt',
          status: 'SUCCESS',
          errorMessage: '',
          id: '132',
        },
        {
          name: 'file2.txt',
          status: 'SUCCESS',
          errorMessage: '',
          id: 'abcd',
        },
      ]}"
    >
    </lion-input-file>
  `;
};
const myFormReset = ev => {
  const input = ev.target.querySelector('lion-input-file');
  input.reset();
  console.log(input.modelValue);
};

const myFormSubmit = ev => {
  ev.preventDefault();
  const input = ev.target.querySelector('lion-input-file');
  console.log(input.hasFeedbackFor);
  console.log(input.serializedValue);
  return false;
};

export const withIngForm = () => {
  class FilenameLengthValidator extends Validator {
    static get validatorName() {
      return 'FilenameLengthValidator';
    }

    static getMessage(data) {
      return `Filename length should not exceed ${data.params.maxFilenameLength} characters`;
    }

    // eslint-disable-next-line class-methods-use-this
    checkFilenameLength(val, allowedFileNameLength) {
      return val <= allowedFileNameLength;
    }

    execute(modelVal, { maxFilenameLength }) {
      const invalidFileIndex = modelVal.findIndex(
        file => !this.checkFilenameLength(file.name.length, maxFilenameLength),
      );
      return invalidFileIndex > -1;
    }
  }

  return html`
    <form @submit="${myFormSubmit}" @reset="${myFormReset}">
      <lion-input-file
        label="Passport"
        name="upload"
        multiple
        .validators="${[new Required(), new FilenameLengthValidator({ maxFilenameLength: 20 })]}"
        .uploadResponse="${[
          {
            name: 'file1.zip',
            status: 'SUCCESS',
            id: '132',
          },
          {
            name: 'file2.zip',
            status: 'SUCCESS',
            id: 'abcd',
          },
        ]}"
      >
      </lion-input-file>
      <button type="reset">Reset</button>
      <button>Upload</button>
    </form>
  `;
};
export const uploadWithoutFormSubmit = () => {
  return html`
    <lion-input-file
      label="Passport"
      name="upload"
      multiple
      upload-on-select
      @file-removed="${ev => {
        ev.target.uploadResponse[
          ev.target.uploadResponse.findIndex(file => file.name === ev.detail.uploadResponse.name)
        ].status = 'LOADING';
        ev.target.uploadResponse = [...ev.target.uploadResponse]; // update uploadResponse after API calls are completed
        setTimeout(() => {
          ev.target.uploadResponse[
            ev.target.uploadResponse.findIndex(file => file.name === ev.detail.uploadResponse.name)
          ] = {};
          ev.target.uploadResponse = [...ev.target.uploadResponse]; // update uploadResponse after API calls are completed
        }, 1000);
      }}"
      @file-list-changed="${ev => {
        if (!ev.detail.newFiles[0]) {
          return;
        }
        ev.target.uploadResponse[
          ev.target.uploadResponse.findIndex(file => file.name === ev.detail.newFiles[0].name)
        ].status = 'LOADING';
        ev.target.uploadResponse = [...ev.target.uploadResponse]; // update uploadResponse after API calls are completed

        if (ev.detail.newFiles[1]) {
          ev.target.uploadResponse[
            ev.target.uploadResponse.findIndex(file => file.name === ev.detail.newFiles[1].name)
          ].status = 'LOADING';
          ev.target.uploadResponse = [...ev.target.uploadResponse]; // update uploadResponse after API calls are completed
        }
        setTimeout(() => {
          ev.target.uploadResponse[
            ev.target.uploadResponse.findIndex(file => file.name === ev.detail.newFiles[0].name)
          ].status = 'SUCCESS';
          ev.target.uploadResponse = [...ev.target.uploadResponse]; // update uploadResponse after API calls are completed
        }, 3000);

        setTimeout(() => {
          if (ev.detail.newFiles[1]) {
            const file1Status = {
              name: ev.detail.newFiles[1].name,
              status: 'FAIL',
              errorMessage: 'error from server',
            };
            ev.target.uploadResponse[
              ev.target.uploadResponse.findIndex(file => file.name === ev.detail.newFiles[1].name)
            ] = {
              name: ev.detail.newFiles[1].name,
              status: 'FAIL',
              errorMessage: 'error from server',
            };
            ev.target.uploadResponse = [...ev.target.uploadResponse];
          }
        }, 3000);
      }}"
    >
    </lion-input-file>
  `;
};
export const dragAndDrop = () => {
  return html`
    <lion-input-file
      label="Passport"
      name="myFiles"
      accept=".png"
      max-file-size="1024000"
      enable-drop-zone
      multiple
      .validators="${[new Required()]}"
    >
    </lion-input-file>
  `;
};
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'basicFileUpload', story: basicFileUpload }, { key: 'acceptValidator', story: acceptValidator }, { key: 'sizeValidator', story: sizeValidator }, { key: 'multipleFileUpload', story: multipleFileUpload }, { key: 'prefilledState', story: prefilledState }, { key: 'withIngForm', story: withIngForm }, { key: 'uploadWithoutFormSubmit', story: uploadWithoutFormSubmit }, { key: 'dragAndDrop', story: dragAndDrop }];
let needsMdjsElements = false;
for (const story of stories) {
  const storyEl = rootNode.querySelector(`[mdjs-story-name="${story.key}"]`);
  if (storyEl) {
    storyEl.story = story.story;
    storyEl.key = story.key;
    needsMdjsElements = true;
    Object.assign(storyEl, {"simulatorUrl":"/next/simulator/","languages":[{"key":"de-DE","name":"German"},{"key":"en-GB","name":"English (United Kingdom)"},{"key":"en-US","name":"English (United States)"},{"key":"nl-NL","name":"Dutch"}]});
  }
};
if (needsMdjsElements) {
  if (!customElements.get('mdjs-preview')) { import('@mdjs/mdjs-preview/define'); }  if (!customElements.get('mdjs-story')) { import('@mdjs/mdjs-story/define'); }}