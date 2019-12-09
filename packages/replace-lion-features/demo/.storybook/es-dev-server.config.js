const { createLionFeaturesReplaceMiddleware } = require('../../index.js');

// *************** local setting ****************

const formElements = [
  'checkbox',
  'checkbox-group',
  'field',
  'fieldset',
  'form',
  'input',
  'input-amount',
  'input-date',
  'input-datepicker',
  'input-email',
  'input-iban',
  'radio',
  'radio-group',
  'select',
  'select-rich',
];

module.exports = {
  responseTransformers: [
    createLionFeaturesReplaceMiddleware({
      outPrefix: 'demo',
      getIndexClassImportPath: ({ outPackageName }) => {
        if (outPackageName === 'input-email') {
          return '../../../../forms.js';
        }
        return `../../../../packages/${outPackageName}/index.js`;
      },
      getTagImportPath: ({ outTagName }) => {
        return `../../../../packages/replace-lion-features/demo/${outTagName}.js`;
      },
    }),
  ],
};
