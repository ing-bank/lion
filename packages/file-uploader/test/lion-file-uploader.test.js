import { expect, html, fixture } from '@open-wc/testing';
import sinon from 'sinon';

import { LionFileUploader } from '../src/LionFileUploader.js';
import { LionProgressBar } from '../src/LionProgressBar.js';

customElements.define('lion-progress-bar', LionProgressBar);
customElements.define('lion-file-uploader', LionFileUploader);

const fileUploader = html`<lion-file-uploader
  upload-url="http://example.com/upload"
></lion-file-uploader>`;
const fileUploaderNoUploadUrl = html`<lion-file-uploader></lion-file-uploader>`;

describe('<lion-file-uploader>', () => {
  let el;
  let elNoUploadUrl;
  const imageFile = new File(['fijRKjhudDjiokDhg1524164151'], 'test.jpg', { type: 'image/jpg' });

  const textFile = new File(['test'], 'test.txt', { type: 'text/plain' });

  beforeEach(async () => {
    el = await fixture(fileUploader);
    elNoUploadUrl = await fixture(fileUploaderNoUploadUrl);
  });

  it('should call "preventDefault" on event when dragging starts', () => {
    const event = {
      preventDefault() {
        return true;
      },
    };

    const spy = sinon.spy(event, 'preventDefault');

    el.__handleDragEnter(event);

    expect(spy.called).to.be.true;
  });

  it('should indicate that file is dragged over element', () => {
    const event = {
      preventDefault() {
        return true;
      },
    };

    expect(el.__dragOverInProgress).to.be.false;

    el.__handleDragOver(event);

    expect(el.__dragOverInProgress).to.be.true;

    el.__handleDragLeave();

    expect(el.__dragOverInProgress).to.be.false;
  });

  it('should call "__addFiles" when files are dropped', () => {
    const file = new File(['fijRKjhudDjiokDhg1524164151'], 'test.jpg', { type: 'image/jpg' });

    const spy = sinon.spy(el, '__addFiles');

    const event = {
      dataTransfer: { files: [file] },
      preventDefault() {
        return true;
      },
    };

    el.__handleDrop(event);

    expect(spy.calledWith(event.dataTransfer.files)).to.be.true;
  });

  it('should call "__addFiles" when files are chosen with the "Browse" button', () => {
    const file = new File(['fijRKjhudDjiokDhg1524164151'], 'test.jpg', { type: 'image/jpg' });

    const spy = sinon.spy(el, '__addFiles');

    const event = {
      target: { files: [file] },
      preventDefault() {
        return true;
      },
    };

    el.__handleChange(event);

    expect(spy.calledWith(event.target.files)).to.be.true;
  });

  it('should correctly determine if a file is an image', () => {
    expect(el.__isImage(imageFile)).to.be.true;
    expect(el.__isImage(textFile)).to.be.false;
  });

  it('should correctly format bytes to a human-readable file size', () => {
    expect(el.__formatFileSize(0)).to.equal('0 bytes');
    expect(el.__formatFileSize(100)).to.equal('100 bytes');
    expect(el.__formatFileSize(1023)).to.equal('1023 bytes');
    expect(el.__formatFileSize(1024)).to.equal('1 KB');
    expect(el.__formatFileSize(1535)).to.equal('1 KB');
    expect(el.__formatFileSize(1536)).to.equal('2 KB');
    expect(el.__formatFileSize(10240)).to.equal('10 KB');
    expect(el.__formatFileSize(11264)).to.equal('11 KB');
    expect(el.__formatFileSize(11775)).to.equal('11 KB');
    expect(el.__formatFileSize(11776)).to.equal('12 KB');
    expect(el.__formatFileSize(102400)).to.equal('100 KB');
    expect(el.__formatFileSize(117760)).to.equal('115 KB');
    expect(el.__formatFileSize(1535000)).to.equal('1 MB');
    expect(el.__formatFileSize(1640000)).to.equal('2 MB');
    expect(el.__formatFileSize(1535000000)).to.equal('1 GB');
    expect(el.__formatFileSize(1640000000)).to.equal('2 GB');
  });

  it('should add files to __fileList', async () => {
    expect(el.__fileList.length).to.equal(0);

    await el.__addFiles([imageFile]);

    expect(el.__fileList.length).to.equal(1);

    await el.__addFiles([textFile]);

    expect(el.__fileList.length).to.equal(2);
  });

  it('should empty __fileList when a file is added after files have been uploaded', async () => {
    expect(el.__fileList.length).to.equal(0);

    await el.__addFiles([imageFile]);

    expect(el.__fileList.length).to.equal(1);

    await el.__addFiles([textFile]);

    expect(el.__fileList.length).to.equal(2);

    el.__uploadComplete = true;

    await el.__addFiles([imageFile]);

    expect(el.__fileList.length).to.equal(1);
  });

  it('should upload files', async () => {
    await el.__addFiles([imageFile, textFile]);
    const uploadSpy = sinon.spy(el, '__uploadFile');
    const updateSpy = sinon.spy(el, 'requestUpdate');

    expect(el.__uploadComplete).to.be.false;

    await el.__uploadFiles();

    expect(el.__uploadComplete).to.be.true;

    expect(uploadSpy.args[0][0]).to.equal(imageFile);
    expect(uploadSpy.args[0][1]).to.equal(0);
    expect(uploadSpy.args[1][0]).to.equal(textFile);
    expect(uploadSpy.args[1][1]).to.equal(1);
    expect(updateSpy.called).to.be.true;
  });

  it('should throw an error when "uploadUrl" is empty', async () => {
    expect(elNoUploadUrl.__uploadFile.bind(elNoUploadUrl)).to.throw('Upload URL is empty');
  });

  it('should remove a file from __fileList', async () => {
    const spy = sinon.spy(el, 'requestUpdate');

    await el.__addFiles([imageFile, textFile]);

    expect(el.__fileList[0].file).to.equal(imageFile);
    expect(el.__fileList[1].file).to.equal(textFile);

    el.__removeFile(0);

    expect(el.__fileList[0].file).to.equal(textFile);
    expect(el.__fileList.length).to.equal(1);
    expect(spy.called).to.be.true;
  });
});
