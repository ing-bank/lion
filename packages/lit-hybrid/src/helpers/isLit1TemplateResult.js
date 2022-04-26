/**
 * @param {{ processor: any; value: any; _$litType$: any; }|any} potentialTemplateResult
 */
export function isLit1TemplateResult(potentialTemplateResult) {
  return Boolean(
    potentialTemplateResult && potentialTemplateResult.processor && potentialTemplateResult.values,
  );
}
