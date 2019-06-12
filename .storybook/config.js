import { configure } from '@storybook/polymer';
import '@storybook/addon-console';

// import '../packages/debug-tools/formsDebugConfig.js';


const req = require.context('../stories', true, /\.stories\.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
