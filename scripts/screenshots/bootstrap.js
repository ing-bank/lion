const { createCapture, getPage, getStoryPage } = require('./index.js');

global.capture = createCapture();
global.getPage = getPage;
global.getStoryPage = getStoryPage;
