/**
 * @param {string} mask
 * @param {{
 *  currentCaretIndex: number,
 *  prevViewValue: string,
 *  viewValue: string,
 *  placeholderIndexMaps: { indexes: number[], condition: (c: string) => boolean}[],
 *  separatorIndexMaps: { indexes: number[], char: (i: number) => string}[],
 *  outputMask: boolean,
 * }} config
 */
function inputMaskHelper(
  mask,
  {
    currentCaretIndex,
    prevViewValue = '',
    viewValue,
    placeholderIndexMaps,
    separatorIndexMaps,
    outputMask,
  },
) {
  /** @type {number[]} */
  const insertedIndexes = [];
  /** @type {string[]} */
  const newValueA = [];
  let totalLength = viewValue.length;

  for (let i = 0; i < totalLength; i += 1) {
    // const curChar = viewValue[i];
    const curChar = viewValue[i - insertedIndexes.length];
    const nextIndex = newValueA.length;

    // First, check if we should delete. This is the case when condition does not apply for
    // curChar
    // eslint-disable-next-line no-loop-func
    placeholderIndexMaps.forEach(r => {
      if (r.indexes.includes(nextIndex) && r.condition(curChar)) {
        newValueA.push(curChar);
        console.log('pushed', curChar);
      }
    });

    // eslint-disable-next-line no-loop-func
    separatorIndexMaps.forEach((
      /** @type {{ indexes: number[]; char: (i: number) => string; }} */ separator,
    ) => {
      if (separator.indexes.includes(nextIndex)) {
        newValueA.push(separator.char(nextIndex));
        console.log('pushed', separator.char(nextIndex));
        insertedIndexes.push(nextIndex);
        totalLength += 1;
      }
    });
  }

  // Filter out the placeholderChars chars so we can detect deletions
  const normalizedValue = Array.from(viewValue).filter(c => c !== '_');
  const normalizedPrevValue = Array.from(prevViewValue).filter(c => c !== '_');
  // Do not change caretIndex when deleting
  console.log('normalizedPrevValue', normalizedPrevValue, normalizedValue);
  let amtCharsDeleted = normalizedPrevValue.length - normalizedValue.length;
  const isDeleting = amtCharsDeleted > 0;
  amtCharsDeleted = 1;
  let newCaretIndex = currentCaretIndex;
  if (isDeleting) {
    console.log('isDeleting', isDeleting, insertedIndexes, currentCaretIndex);
    // newValueA = newValueA.slice(0, -2);

    if (insertedIndexes.includes(currentCaretIndex)) {
      // Bring current currentCaretIndex char to end of prev 'placeholder group'
      // Example: 'abc-|defg-hijk' => 'ab_|-defg-hijk'
      newValueA[currentCaretIndex - 1] = '_';
      newCaretIndex = currentCaretIndex - 1;
    } else {
      // Insert placeholder chars at end of current 'placeholder group'
      // Example: 'abc-d|ef|g-hijk' => 'abc-dg__-hijk'
      // - 'ef' is selected, thus amtCharsDeleted is 2
      // - nextSeparatorIdx is 8
      const nextSeparatorIdx =
        insertedIndexes.filter(i => currentCaretIndex < i).reverse()[0] || mask.length;
      // 'abc-dghi-jk__' => captures ['h', 'i']
      const charsToBeShifted = newValueA.splice(currentCaretIndex, amtCharsDeleted);
      console.log('charsToBeShifted', charsToBeShifted);

      // add '__' => 'abc-dg__-jk__'
      newValueA.splice(nextSeparatorIdx - 1, 0, ...Array.from('_'.repeat(amtCharsDeleted)));
      // insert ['h', 'i'] again => 'abc-dg__-hijk__'
      newValueA.splice(nextSeparatorIdx, 0, ...charsToBeShifted);
      // strip all outside mask length: 'abc-dg__-hijk__'
      newValueA.splice(mask.length, newValueA.length);
    }

    // // - bring current currentCaretIndex char to end of prev 'placeholder group'
    // newValueA[currentCaretIndex - 1] = newValueA[currentCaretIndex + 1];
    // newValueA.splice(currentCaretIndex + 1, 1);
    // // - insert placeholder char at end of current 'placeholder group'
    // const nextSeparatorIdx =
    //   insertedIndexes[insertedIndexes.indexOf(currentCaretIndex) + 1] || mask.length;
    // newValueA.splice(nextSeparatorIdx - 1, 0, '_');

    // newCaretIndex = currentCaretIndex - 1;
  } else if (!isDeleting) {
    // insertedIndexes.some((insertedIndex, i) => {
    //   // mask '12-123-1234';
    //   // input '121231234';
    //   // (currentCaretIndex is 5, newCaretIndex => 8)
    //   if (insertedIndex <= currentCaretIndex + i) {
    //     console.log('insertedIndex', insertedIndex, 'currentCaretIndex', currentCaretIndex, i);
    //     newCaretIndex = currentCaretIndex + (i + 1);
    //     return false;
    //   }
    //   return true;
    // });
    if (insertedIndexes.includes(currentCaretIndex)) {
      newCaretIndex = currentCaretIndex + 1;
    } else if (currentCaretIndex > newValueA.length) {
      newCaretIndex = newValueA.length;
    }
  }

  let newValue = newValueA.join('');
  if (outputMask) {
    newValue += mask.slice(newValue.length);
  }

  return { viewValue: newValue, caretIndex: newCaretIndex };
}

/**
 * Creates a preprocessor from a mask like '__-__-____'
 * By default, '_' is regarded a 'placeholder character': this means anything typed here will be
 * outputted when the restrictCondition (like 'only numbers' for a date) applies and filtered out
 * when restrictCondition doesn't apply. Note that restrictCondition is optional.
 *
 * All other chars are automatically regarded 'separator characters': the characters found in the
 * mask are placed at their designated places.
 *
 * By default, the mask will be outputted. This can be omitted as well.
 * @param {string} mask
 * @param {Partial<{
 *  viewValue: string,
 *  placeholderIndexMaps: { indexes: number[], condition: (c: string) => boolean}[],
 *  separatorIndexMaps: { indexes: number[], char: (i: number) => string}[],
 *  outputMask: boolean,
 *  charFunction: (i: number) => string,
 *  restrictCondition: (c: string) => boolean,
 * }>} config
 */
export function preprocessorFactory(mask, config = {}) {
  const {
    placeholderIndexMaps = [],
    separatorIndexMaps = [],
    outputMask = true,
    charFunction = (/** @type {number} */ i) => mask[i],
  } = config;
  let { restrictCondition } = config;

  // create placeholderIndexMaps and separatorIndexMaps from mask...
  /** @type {number[]} */
  const restrictIndexes = [];
  /** @type {number[]} */
  const separatorIndexes = [];
  Array.from(mask).forEach((c, i) => {
    if (c === '_') {
      restrictIndexes.push(i);
    } else {
      separatorIndexes.push(i);
    }
  });

  const insertChars = separatorIndexes.map(i => mask[i]);
  const maskChars = [...insertChars, '_'];
  if (typeof restrictCondition !== 'function') {
    restrictCondition = (/** @type {string} */ c) => !maskChars.includes(c);
  }

  if (!placeholderIndexMaps.length) {
    placeholderIndexMaps.push({ indexes: restrictIndexes, condition: restrictCondition });
  }

  if (!separatorIndexMaps.length) {
    separatorIndexMaps.push({ indexes: separatorIndexes, char: charFunction });
  }

  return function preprocessor(
    /** @type {string} */ viewValue,
    /** @type {{ currentCaretIndex: number, prevViewValue: string }} */ {
      currentCaretIndex,
      prevViewValue,
    },
  ) {
    return inputMaskHelper(mask, {
      currentCaretIndex,
      prevViewValue,
      viewValue,
      placeholderIndexMaps,
      separatorIndexMaps,
      outputMask,
    });
  };
}
