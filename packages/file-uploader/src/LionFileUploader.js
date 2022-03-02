import { LitElement, css, html, classMap } from '@lion/core';

export class LionFileUploader extends LitElement {
  static get properties() {
    return {
      __dragOverInProgress: {
        type: Boolean,
      },
      __fileList: {
        type: Array,
      },
      uploadUrl: {
        type: String,
        attribute: 'upload-url',
      },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      #container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        width: 100%;
        height: 100%;
        padding: 1em;
      }
      #dropzone {
        border: 1px dashed #cecece;
        border-radius: 1rem;
        width: 100%;
        height: 100%;
        min-height: 200px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      #dropzone.dragover {
        border: 1px dashed #000000;
      }

      #file-list {
        list-style-type: none;
        padding: 0;
        width: 100%;
      }

      #file-list li {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        padding: 5px;
      }

      #file-list li img {
        max-width: 50px;
        margin-right: 5px;
      }

      #file-list li .preview {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 50px;
        height: 50px;
        font-size: 0.5rem;
        border: 1px solid #000000;
        margin-right: 5px;
      }

      #file-list li lion-progress-bar {
        width: 100%;
      }

      #file-list li span {
        flex-grow: 1;
      }

      #file-list li.complete .remove {
        display: none;
      }

      #file-list li.error {
        color: #ff0000;
      }

      #file-list li.error lion-progress-bar {
        --progress-bar-color: #ff0000;
      }

      #file-list li .file {
        display: flex;
        flex-direction: column;
      }

      #file-list li .file-name {
        display: flex;
        justify-content: space-between;
      }

      #file-list li .remove {
        display: block;
        width: 15px;
        height: 15px;
        max-width: 15px;
        cursor: pointer;
        background-repeat: no-repeat;
        background-size: 100%;
        background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMzUnIGhlaWdodD0nMzUnIHZpZXdCb3g9JzAgMCAzNSAzNScgZmlsbD0nbm9uZScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cGF0aCBkPSdNMTcuNSAwQzcuODM0OTkgMCAwIDcuODM0OTkgMCAxNy41QzAgMjcuMTY1IDcuODM0OTkgMzUgMTcuNSAzNUMyNy4xNjUgMzUgMzUgMjcuMTY1IDM1IDE3LjVDMzQuOTg4OCA3LjgzOTY1IDI3LjE2MDQgMC4wMTEyMTk4IDE3LjUgMFpNMTcuNSAzMy44NzFDOC40NTg1NyAzMy44NzEgMS4xMjkwMyAyNi41NDE0IDEuMTI5MDMgMTcuNUMxLjEyOTAzIDguNDU4NTcgOC40NTg1NyAxLjEyOTAzIDE3LjUgMS4xMjkwM0MyNi41NDE0IDEuMTI5MDMgMzMuODcxIDguNDU4NTcgMzMuODcxIDE3LjVDMzMuODYxIDI2LjUzNzMgMjYuNTM3MyAzMy44NjEgMTcuNSAzMy44NzFaJyBmaWxsPSdibGFjaycvPjxwYXRoIGQ9J00yNS40ODM0IDkuNTE2NjFDMjUuMjYyOSA5LjI5NjI0IDI0LjkwNTYgOS4yOTYyNCAyNC42ODUyIDkuNTE2NjFMMTcuNSAxNi43MDE4TDEwLjMxNDggOS41MTY2MUMxMC4wOTgzIDkuMjkyMzYgOS43NDA4NyA5LjI4NjE1IDkuNTE2NjEgOS41MDI3MUM5LjI5MjM2IDkuNzE5MjcgOS4yODYxNSAxMC4wNzY3IDkuNTAyNzEgMTAuMzAwOUM5LjUwNzIzIDEwLjMwNTcgOS41MTE4OCAxMC4zMTAzIDkuNTE2NjEgMTAuMzE0OEwxNi43MDE4IDE3LjVMOS41MTY2MSAyNC42ODUyQzkuMjkyMzYgMjQuOTAxOCA5LjI4NjE1IDI1LjI1OTEgOS41MDI3OCAyNS40ODM0QzkuNzE5NDEgMjUuNzA3NiAxMC4wNzY4IDI1LjcxMzkgMTAuMzAxIDI1LjQ5NzJDMTAuMzA1NyAyNS40OTI3IDEwLjMxMDMgMjUuNDg4IDEwLjMxNDggMjUuNDgzNEwxNy41IDE4LjI5ODJMMjQuNjg1MiAyNS40ODM0QzI0LjkwOTQgMjUuNyAyNS4yNjY4IDI1LjY5MzggMjUuNDgzNCAyNS40Njk2QzI1LjY5NDcgMjUuMjUwOCAyNS42OTQ3IDI0LjkwMzkgMjUuNDgzNCAyNC42ODUyTDE4LjI5ODIgMTcuNUwyNS40ODM0IDEwLjMxNDhDMjUuNzAzOCAxMC4wOTQ0IDI1LjcwMzggOS43MzcwNSAyNS40ODM0IDkuNTE2NjFaJyBmaWxsPSdibGFjaycvPjwvc3ZnPgo=);
      }

      input[type='file'] {
        opacity: 0;
        width: 100%;
        height: 100%;
      }

      lion-progress-bar,
      progress {
        margin-top: 15px;
        width: 100%;
      }
    `;
  }

  constructor() {
    super();

    this.__fileList = [];
    this.__dragOverInProgress = false;
    this.__uploadComplete = false;
  }

  static __handleDragEnter(e) {
    e.preventDefault();
  }

  __handleDragOver(e) {
    e.preventDefault();

    this.__dragOverInProgress = true;
  }

  __handleDragLeave() {
    this.__dragOverInProgress = false;
  }

  __handleDrop(e) {
    e.preventDefault();

    const { files } = e.dataTransfer;

    this.__addFiles(files);
  }

  __handleChange(e) {
    const { files } = e.target;

    this.__addFiles(files);
  }

  static __isImage(file) {
    return file.type.startsWith('image');
  }

  static __formatFileSize(bytes) {
    const k = 1024;
    const sizes = ['bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return bytes === 0 ? '0 bytes' : `${Math.round(bytes / k ** i)} ${sizes[i]}`;
  }

  static async __getDataUrl(file) {
    return new Promise(resolve => {
      const reader = new FileReader();

      reader.addEventListener('loadend', async e => resolve(e.target.result));

      reader.readAsDataURL(file);
    });
  }

  async __addFiles(files) {
    if (this.__uploadComplete) {
      this.__fileList = [];
      this.__uploadComplete = false;
    }

    const newFiles = await LionFileUploader.__processFiles([...files]);

    this.__fileList = [...this.__fileList, ...newFiles];
  }

  static async __processFiles(files) {
    const processedFiles = [];

    for (const file of files) {
      const { name, size } = file;
      const processedFile = { file, name, size: LionFileUploader.__formatFileSize(size) };

      if (LionFileUploader.__isImage(file)) {
        processedFile.url = await LionFileUploader.__getDataUrl(file);
      }

      processedFile.uploadProgress = 0;

      processedFiles.push(processedFile);
    }

    return processedFiles;
  }

  __uploadFile(file, index) {
    if (this.uploadUrl === '' || this.uploadUrl === undefined) {
      throw new Error('Upload URL is empty');
    }

    const XHR = new XMLHttpRequest();
    const XHRUpload = XHR.upload;
    const formData = new FormData();

    return new Promise((resolve, reject) => {
      XHRUpload.addEventListener('progress', e => {
        if (e.lengthComputable) {
          const currentFile = { ...this.__fileList[index] };
          currentFile.uploadProgress = Math.ceil((e.loaded / e.total) * 100);

          this.__fileList.splice(index, 1, currentFile);
          this.requestUpdate();
        }
      });

      XHRUpload.addEventListener('load', () => {
        resolve(index);
      });

      XHRUpload.addEventListener('error', () => reject(index));

      formData.append(file.name, file);

      XHR.open('POST', this.uploadUrl, true);
      XHR.send(formData);
    });
  }

  async __uploadFiles() {
    const requests = this.__fileList.map(({ file }, index) =>
      this.__uploadFile(file, index)
        .then(i => {
          this.__fileList[i].status = 'complete';
          this.requestUpdate();
        })
        .catch(i => {
          this.__fileList[i].status = 'error';
          this.requestUpdate();
        }),
    );

    await Promise.allSettled(requests);

    this.__uploadComplete = true;

    this.requestUpdate();
  }

  __handleKeyUp({ key }, index) {
    if (key === 'Backspace') {
      this.__removeFile(index);
    }
  }

  __removeFile(index) {
    this.__fileList.splice(index, 1);
    this.requestUpdate();
  }

  __browseFiles() {
    this.renderRoot.querySelector('input[type="file"]').click();
  }

  render() {
    return html`
      <div id="container">
        <div
          id="dropzone"
          class=${classMap({ dragover: this.__dragOverInProgress })}
          @dragenter="${LionFileUploader.__handleDragEnter}"
          @dragover="${this.__handleDragOver}"
          @dragleave="${this.__handleDragLeave}"
          @drop="${this.__handleDrop}"
        >
          <p>Drop files here</p>
          <p>or</p>
          <p>
            <button id="browse-button" type="button" @click="${this.__browseFiles}">browse</button>
          </p>
        </div>

        <input id="file-input" type="file" multiple @change="${this.__handleChange}" />
        <button id="upload-button" type="button" @click="${this.__uploadFiles}">Upload</button>

        <ul id="file-list">
          ${this.__fileList.map(({ name, size, url, uploadProgress, status }, index) => {
            const ext = name.split('.').pop();
            const classes = { complete: status === 'complete', error: status === 'error' };

            return html`
              <li class=${classMap(classes)}>
                ${url
                  ? html`<img alt="preview" src="${url}" />`
                  : html`<div class="preview">${ext}</div>`}
                <span class="file">
                  <span class="file-name"
                    >${name} (${size})
                    <span
                      class="remove"
                      @click="${() => this.__removeFile(index)}"
                      @keyup="${e => this.__handleKeyUp(e, index)}"
                    ></span>
                  </span>
                  <lion-progress-bar value="${uploadProgress}" max="100"></lion-progress-bar>
                </span>
              </li>
            `;
          })}
        </ul>
      </div>
    `;
  }
}
