Allow advanced preprocessing

- Turn '1' into '01-__-____'
- Turn ’20’ into ’20-’, -> ’20-4’ into ’20-04’ etc…

See: https://nosir.github.io/cleave.js/(But we should enhance the UX when editing the middle of a date)So:

```js
/**  * @returns {string | { viewValue:string, caretIndex:number } } */
preprocessor(viewValue, { previousViewValue = ‘’, currentCaretIndex }) {
  const diff = viewValue.length - previousViewValue.length;
  if (diff === -1) && !isNaN(Number(previousViewValue[currentCaretIndex]))) {
    // don’t respond to delete actions
    return viewValue;
  }

  let newValue = '';
  const strippedVal = viewValue.replace('-', '');
  let dashesPlaced = 0;
  let newCaretIndex;
  for (let i = 0; i < 10; i+= 1) {
    if (i === 2 || i === 4) {
      newValue += ‘-’;
      dashesPlaced += 1;
      }
    else if (i < strippedVal.length + dashesPlaced) {
      newValue += strippedVal[i];
    } else {
      newValue += ‘_’;
      if (newCaretIndex === undefined) {
        newCaretIndex = i;
      }
    }
  }
  return { viewValue: newValue, caretIndex: newCaretIndex };
}
```
