# Input File >> Use Cases ||20

```js script
import { Required, Validator } from '@lion/ui/form-core.js';
import { loadDefaultFeedbackMessages } from '@lion/ui/validate-messages.js';
import { html } from '@mdjs/mdjs-preview';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { LitElement } from 'lit';
import '@lion/ui/define/lion-input-file.js';
loadDefaultFeedbackMessages();
```

## Features

API calls to upload the selected files can be done in below two ways which is driven by `uploadOnSelect` property

- On `form` submit
- On file selection

## Parameters

```html
<lion-input-file
  multiple
  label="Attachments"
  help-text="Signature scan file"
  max-file-size="1024000"
  accept="application/PDF"
  upload-on-select
>
</lion-input-file>
```

### modelValue

Array of [File](https://developer.mozilla.org/en-US/docs/Web/API/File); Contains all the uploaded files

### multiple

Boolean; setting to `true` allows selecting multiple files.

### EnableDragAndDrop

Boolean; setting to `true` allows file upload through drag and drop.

### uploadOnSelect

Boolean;

- Set to `true` when API calls for file upload needs to be done on file selection
- Set to `false` when API calls for file upload needs to be done on form submit.
- Default is `false`.

## Events

### model-value-changed

Fired when modelValue property changes.

### file-list-changed

Fired when files are uploaded. Event `detail` gives list of newly added files in `newFiles` key

```js
ev.detail.newFiles;
```

### file-removed

Fired when a file is removed. Event `detail` gives

- File objected for removed file in `ev.detail.removedFile`
- Status of this file can be used as `ev.detail.status`
- uploadResponse for this file as set using `uploadResponse` property. Can use used as `ev.detail.uploadResponse`

## Usage

### Basic File upload

When file has to be uploaded as soon as it is selected by the user. Use `file-list-changed` event to get the newly added file, upload it to your server and set the response back to component via `uploadResponse` property.

```js preview-story
export const basicFileUpload = () => {
  return html`
    <lion-input-file
      label="Label"
      max-file-size="1024000"
      accept=".jpg,.svg,.xml,image/svg+xml"
      @file-list-changed="${ev => {
        console.log('fileList', ev.detail.newFiles);
      }}"
    >
    </lion-input-file>
  `;
};
```

### Validation

#### Accept

The `accept` attribute value is a string that defines the file types the file input should accept. This string is a comma-separated list of unique file type specifiers.

For more info please consult the [MDN documentation for "accept"](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#accept).

```js preview-story
export const acceptValidator = () => {
  return html`
    <lion-input-file
      accept=".jpg,.svg,.xml,image/svg+xml"
      label="Upload"
      enable-drop-zone
      @file-list-changed="${ev => {
        console.log(ev.detail.newFiles);
      }}"
    >
    </lion-input-file>
  `;
};
```

#### Maximum File Size

The `max-file-size` attribute sets the maximum file size in bytes.

```js preview-story
export const sizeValidator = () => {
  return html`
    <lion-input-file
      max-file-size="2048"
      label="Upload"
      @file-list-changed="${ev => {
        console.log(ev.detail.newFiles);
      }}"
    >
    </lion-input-file>
  `;
};
```

### Multiple file upload

When file has to be uploaded as soon as it is selected by the user. Use `file-list-changed` event to get the newly added files, upload it to your server and set the response back to component via `uploadResponse` property for each file.

```js preview-story
export const multipleFileUpload = () => {
  return html`
    <lion-input-file
      label="Upload"
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
```

### Without form submit

Set `uploadOnSelect` property to `true`. This option can be used when Server API calls are needed as soon as it is selected by the user.

For this scenario, the list of files is displayed based on the `_fileSelectResponse` property which needs to maintained by the consumers of this component

Below is the flow:

#### When user uploads new file(s)

1. `file-list-changed` event is fired from component with the newly added files
2. Initiate the request to your backend API and set the status of the relevant files to `LOADING` in `_fileSelectResponse` property
3. Once the API request in completed, set the status of relevant files to `SUCCESS` or `FAIL` in `_fileSelectResponse` property

#### When user deletes a file

1. `file-removed` event is fired from component with the deleted file
2. Initiate the delete request to your backend API and set the status of the relevant files as `LOADING` in `_fileSelectResponse` property
3. Once the API request in completed, delete the file object from `_fileSelectResponse` property

```js preview-story
export const uploadWithoutFormSubmit = () => {
  return html`
    <lion-input-file
      label="Upload"
      name="upload"
      multiple
      upload-on-select
      @file-removed="${ev => {
        ev.target._fileSelectResponse[
          ev.target._fileSelectResponse.findIndex(
            file => file.name === ev.detail._fileSelectResponse.name,
          )
        ].status = 'LOADING';
        ev.target._fileSelectResponse = [...ev.target._fileSelectResponse]; // update _fileSelectResponse after API calls are completed
        setTimeout(() => {
          ev.target._fileSelectResponse[
            ev.target._fileSelectResponse.findIndex(
              file => file.name === ev.detail._fileSelectResponse.name,
            )
          ] = {};
          ev.target._fileSelectResponse = [...ev.target._fileSelectResponse]; // update _fileSelectResponse after API calls are completed
        }, 1000);
      }}"
      @file-list-changed="${ev => {
        if (!ev.detail.newFiles[0]) {
          return;
        }
        ev.target._fileSelectResponse[
          ev.target._fileSelectResponse.findIndex(file => file.name === ev.detail.newFiles[0].name)
        ].status = 'LOADING';
        ev.target._fileSelectResponse = [...ev.target._fileSelectResponse]; // update _fileSelectResponse after API calls are completed

        if (ev.detail.newFiles[1]) {
          ev.target._fileSelectResponse[
            ev.target._fileSelectResponse.findIndex(
              file => file.name === ev.detail.newFiles[1].name,
            )
          ].status = 'LOADING';
          ev.target._fileSelectResponse = [...ev.target._fileSelectResponse]; // update _fileSelectResponse after API calls are completed
        }
        setTimeout(() => {
          ev.target._fileSelectResponse[
            ev.target._fileSelectResponse.findIndex(
              file => file.name === ev.detail.newFiles[0].name,
            )
          ].status = 'SUCCESS';
          ev.target._fileSelectResponse = [...ev.target._fileSelectResponse]; // update _fileSelectResponse after API calls are completed
        }, 3000);

        setTimeout(() => {
          if (ev.detail.newFiles[1]) {
            const file1Status = {
              name: ev.detail.newFiles[1].name,
              status: 'FAIL',
              errorMessage: 'error from server',
            };
            ev.target._fileSelectResponse[
              ev.target._fileSelectResponse.findIndex(
                file => file.name === ev.detail.newFiles[1].name,
              )
            ] = {
              name: ev.detail.newFiles[1].name,
              status: 'FAIL',
              errorMessage: 'error from server',
            };
            ev.target._fileSelectResponse = [...ev.target._fileSelectResponse];
          }
        }, 3000);
      }}"
    >
    </lion-input-file>
  `;
};
```

### Drag and Drop

Set the `enableDropZone` parameter to `true` to use the drag and drop functionality in the component.

Drag and drop the files to be uploaded to the server.

```js preview-story
export const dragAndDrop = () => {
  return html`
    <lion-input-file
      label="Upload"
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
```

### Posting file to API using axios

You can retrieve the uploaded files in `file-list-changed` event or from `modelValue` property of this component

To submit files you can refer to the following code snippet:

```js
const formData = new FormData();
const inputFile = document.querySelector('lion-input-file').modelValue;
formData.append('file', inputFile.querySelector('input').files);
axios.post('upload_file', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
```
