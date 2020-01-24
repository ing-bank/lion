/**
 * Add separators when they are not present
 *
 * @param {Array} formattedParts
 * @param {string} groupSeparator
 * @returns {Array}
 */
export function forceAddGroupSeparators(formattedParts, groupSeparator) {
  let concatArray = [];
  let firstPart;
  let integerPart;

  for (let i = 0; i < formattedParts.length; i += 1) {
    if (formattedParts[i].type === 'integer') {
      firstPart = formattedParts.splice(0, i);
      integerPart = formattedParts.splice(0, 1);
    }
  }
  if (integerPart !== undefined) {
    const numberOfDigits = integerPart[0].value.length;
    const mod3 = numberOfDigits % 3;
    const groups = Math.floor(numberOfDigits / 3);
    const numberArray = [];
    let numberOfGroups = 0;
    let numberPart = '';
    let firstGroup = false;
    // Loop through the  integer
    for (let i = 0; i < numberOfDigits; i += 1) {
      numberPart += integerPart[0].value[i];
      // Create first grouping which is < 3
      if (numberPart.length === mod3 && firstGroup === false) {
        numberArray.push({ type: 'integer', value: numberPart });
        if (numberOfDigits > 3) {
          numberArray.push({ type: 'group', value: groupSeparator });
        }
        numberPart = '';
        firstGroup = true;
        // Create groupings of 3
      } else if (numberPart.length === 3 && i < numberOfDigits - 1) {
        numberOfGroups += 1;
        numberArray.push({ type: 'integer', value: numberPart });
        if (numberOfGroups !== groups) {
          numberArray.push({ type: 'group', value: groupSeparator });
        }
        numberPart = '';
      }
    }
    numberArray.push({ type: 'integer', value: numberPart });
    concatArray = firstPart.concat(numberArray, formattedParts);
  }
  return concatArray;
}
