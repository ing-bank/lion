const { convertModule } = require('./convertModule.js');

const defaultComponentNames = [
  'button',
  'checkbox',
  // 'checkbox-group',
  // 'dialog',
  // 'fieldset',
  // 'form',
  // 'icon',
  // 'input',
  // 'input-amount',
  // 'input-date',
  // 'input-datepicker',
  // 'input-email',
  // 'input-iban',
  // 'input-range',
  // 'options',
  // 'radio',
  // 'radio-group',
  // 'select',
  // 'select-rich',
  // 'options',
  // 'select-invoker',
  // 'steps',
  // 'step',
  // 'switch',
  // 'tabs',
  // 'textarea',
  // 'tooltip',
];

const onlyProcess = ['form-system'];

const processPackages = [...defaultComponentNames, ...onlyProcess];

const defaultClassNames = ['ajax', 'localize'];

function convertLionModules(
  code,
  {
    outPrefix,
    currentPackage,
    inPrefix = 'lion',
    componentNames = defaultComponentNames,
    classNames = defaultClassNames,
    getClassImportPath,
    getTagImportPath,
    getIndexClassImportPath,
    shouldReplaceTagGlobally,
    shouldReplaceClassGlobally,
  },
) {
  // do nothing for packages we don't wanna handle
  if (!processPackages.includes(currentPackage)) {
    return code;
  }

  if (typeof outPrefix !== 'string') {
    throw new Error('You need to provide an outPrefix as a string like "ing"');
  }
  if (typeof currentPackage !== 'string') {
    throw new Error('You need to provide a currentPackage as a string like "input"');
  }

  const settings = {
    currentPackage,
    shouldReplaceTagGlobally,
    shouldReplaceClassGlobally,
  };
  if (getClassImportPath) {
    settings.getClassImportPath = getClassImportPath;
  }
  if (getTagImportPath) {
    settings.getTagImportPath = getTagImportPath;
  }
  if (getIndexClassImportPath) {
    settings.getIndexClassImportPath = getIndexClassImportPath;
  }

  let outCode = code;
  componentNames.forEach(componentName => {
    outCode = convertModule(outCode, {
      ...settings,
      inTagName: `${inPrefix}-${componentName}`,
      outTagName: `${outPrefix}-${componentName}`,
    });
  });

  // TODO: This hasn't been tested yet.. non-components may require some other settings..
  classNames.forEach(className => {
    outCode = convertModule(outCode, {
      ...settings,
      inTagName: `${inPrefix}-${className}`,
      outTagName: `${outPrefix}-${className}`,
    });
  });

  return outCode;
}

module.exports = {
  convertLionModules,
};
