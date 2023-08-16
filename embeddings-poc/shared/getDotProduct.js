export function getDotProduct(a, b) {
  if (a.length !== b.length) {
    throw new Error('Both arguments must have the same length');
  }

  let result = 0;

  for (let i = 0; i < a.length; i++) {
    result += a[i] * b[i];
  }

  return result;
}
