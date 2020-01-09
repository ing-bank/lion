const { convertModule } = require('./convertModule.js');

const defaultComponentNames = ['calendar', 'input', 'input-amount', 'input-email'];

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
  },
) {
  if (typeof outPrefix !== 'string') {
    throw new Error('You need to provide an outPrefix as a string like "ing"');
  }
  if (typeof currentPackage !== 'string') {
    throw new Error('You need to provide a currentPackage as a string like "input"');
  }

  const settings = {
    currentPackage,
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
