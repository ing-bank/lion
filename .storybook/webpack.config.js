const path = require('path');

module.exports = (storybookBaseConfig, configType, defaultConfig) => {
  defaultConfig.module.rules.push({
    test: [/\.stories\.js$/, /index\.js$/],
    loaders: [require.resolve('@storybook/addon-storysource/loader')],
    enforce: 'pre',
  });

  const transpilePackages = ['lit-html', 'lit-element', '@open-wc', 'autosize'];

  // this is a separate config for only those packages
  // the main storybook will use the .babelrc which is needed so storybook itself works in IE
  defaultConfig.module.rules.push({
    test: new RegExp(`node_modules(\\\/|\\\\)(${transpilePackages.join('|')})(.*)\\.js$`),
    use: {
      loader: 'babel-loader',
      options: {
        plugins: [
          '@babel/plugin-syntax-dynamic-import',
          '@babel/plugin-proposal-object-rest-spread',
        ],
        presets: [
          [
            '@babel/preset-env',
            {
              useBuiltIns: 'entry',
            },
          ],
        ],
        babelrc: false,
      },
    },
  });

  defaultConfig.devServer = {
    headers: { 'X-UA-Compatible': 'IE=Edge' },
  };

  return defaultConfig;
};
