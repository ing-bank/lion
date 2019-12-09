const { replaceComponent } = require('./replaceComponent.js');

const defaultComponentNames = ['calendar', 'input', 'input-amount', 'input-email'];

const defaultClassNames = ['ajax', 'localize'];

function replaceLionFeatures(
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
    outCode = replaceComponent(outCode, {
      ...settings,
      inTagName: `${inPrefix}-${componentName}`,
      outTagName: `${outPrefix}-${componentName}`,
    });
  });

  return outCode;
}

module.exports = {
  replaceLionFeatures,
};
