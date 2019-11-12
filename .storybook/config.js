import { configure, addDecorator } from '@storybook/polymer';
import { withA11y } from '@storybook/addon-a11y';
import '@storybook/addon-console';

addDecorator(withA11y);

const req = require.context('../stories', true, /\.stories\.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
