/**
 * For Dutch and Belgian amounts the currency should be at the end of the string
 *
 * @param {{type: string, value: string}[]} formattedParts
 * @returns {{type: string, value: string}[]}
 */
export function forceCurrencyToEnd(formattedParts) {
  if (formattedParts[0].type === 'currency') {
    const moveCur = formattedParts.splice(0, 1);
    const moveLit = formattedParts.splice(0, 1);
    formattedParts.push(moveLit[0]);
    formattedParts.push(moveCur[0]);
  } else if (formattedParts[0].type === 'minusSign' && formattedParts[1].type === 'currency') {
    const moveCur = formattedParts.splice(1, 1);
    const moveLit = formattedParts.splice(1, 1);
    formattedParts.push(moveLit[0]);
    formattedParts.push(moveCur[0]);
  }
  return formattedParts;
}
