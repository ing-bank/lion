import { Unparseable } from '@lion/validate';

export const defaultProcessors = {
  formatter: {
    exec: v => v,
    options: {},
    disabled: false,
  },
  parser: {
    exec: v => v,
    options: {},
    disabled: false,
  },
  deserializer: {
    exec: v => v,
    options: {},
    disabled: false,
  },
  serializer: {
    exec: v => v,
    options: {},
    disabled: false,
  },
};

function __callParser(value, parser) {
  if (parser.disabled) {
    return value;
  }
  // A) check if we need to parse at all

  // A.1) The end user had no intention to parse
  // @deprecated should also return Unparseable
  if (value === '') {
    // For backwards compatibility we return an empty string:
    // - it triggers validation for required validators (see ValidateMixin.validate())
    // - it can be expected by 3rd parties (for instance unit tests)
    // TODO: In a breaking refactor of the Validation System, this behavior can be corrected.
    return '';
  }

  // A.2) Handle edge cases We might have no view value yet, for instance because
  // inputElement.value was not available yet
  if (typeof value !== 'string') {
    // This means there is nothing to find inside the view that can be of
    // interest to the Application Developer or needed to store for future
    // form state retrieval.
    return value;
  }

  // B) parse the view value

  // - if result:
  // return the successfully parsed viewValue
  // - if no result:
  // Apparently, the parser was not able to produce a satisfactory output for the desired
  // modelValue type, based on the current viewValue. Unparseable allows to restore all
  // states (for instance from a lost user session), since it saves the current viewValue.
  const result = parser.exec(value, parser.options);
  return result !== undefined ? result : new Unparseable(value);
}

function __callFormatter(modelValue, formattedValue, formatter) {
  console.log('is disabled', formatter.disabled);
  if (formatter.disabled) {
    return formattedValue;
  }
  if (modelValue instanceof Unparseable) {
    // When the value currently is unparseable, we need to sync back the supplied
    // viewValue. In flow [2], this should not be needed.
    // In flow [1] (we restore a previously stored value) we should sync down, however.
    return modelValue.viewValue;
  }

  return formatter.exec(modelValue, formatter.options);
}

export function calculateValues(valueObj, source, processors = defaultProcessors) {
  // let modelValue;
  // let formattedValue;
  // let serializedValue;

  let { modelValue, formattedValue, serializedValue } = valueObj;
  const { value } = valueObj;

  // switch (source) {
  //   case 'parser':
  //     source = 'modelValue';
  //     break;
  //   /* no default */
  // }
  //   case 'modelValue':
  //     modelValue = inputValue;
  //     break;
  //   case 'serializedValue':
  //     serializedValue = inputValue;
  //     break;
  //   case 'value':
  //     formattedValue = inputValue;
  //     break;
  //   case 'formatter':
  //     source = 'modelValue';
  //     modelValue = inputValue;
  //     break;
  //   default:
  //     throw new Error(`invalid source "${source}" for calculateValues`);
  // }

  switch (source) {
    case 'serializedValue':
      if (!processors.deserializer.disabled) {
        modelValue = processors.deserializer.exec(serializedValue, processors.deserializer.options);
      }
      break;
    case 'value':
      modelValue = __callParser(value, processors.parser);
      break;
    case 'parser':
    case 'formattedValue':
      modelValue = __callParser(formattedValue, processors.parser);
      break;
    /* no default */
  }

  if (source !== 'formattedValue') {
    formattedValue = __callFormatter(modelValue, formattedValue, processors.formatter);
  }

  if (source !== 'serializedValue') {
    if (!processors.serializer.disabled) {
      serializedValue = processors.serializer.exec(modelValue, processors.serializer.options);
    }
  }

  // value = formattedValue;

  return {
    // value,
    modelValue,
    formattedValue,
    serializedValue,
  };
}
