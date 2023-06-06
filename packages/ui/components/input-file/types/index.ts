export type AllowedFileCategory = 'type' | 'extension' | 'size' | 'duplicate';

/*
 * All allow criteria the 'IsAllowedFile' validator needs to know about.
 * They are derived from LionInputFile.accept and LionInputFile.maxSize properties
 */

export type AllowedFileCriteria = {
  types: string[];
  extensions: string[];
  size: number;
};

/*
 * This is the outcome of the execute function of the IsAllowedFile Validator.
 * Whereas normal validators usually return a simple false or true, this
 * Validator returns Array<ValidatorOutcomeOfIsAllowedFile>.
 * The outcomes will be connected via fileIds to ModelValueFile.meta.id
 */
export type ValidatorOutcomeOfIsAllowedFile = {
  /* this connects the outcome to ModelValueFile.meta.id */
  id: string;
  outcome: {
    /* What accept criterium did this File fail on? */
    failedOn: AllowedFileCategory[];
  };
  /* Meta data that can be used to construct a feedback message */
  meta: { AllowedFileCriteria: AllowedFileCriteria; file: ModelValueFile };
};

/**
 * We have two types of File to deal with:
 * 1. [File](https://developer.mozilla.org/en-US/docs/Web/API/File): supported by [HTMLInputElement](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file) via .files as FileList
 * 2. ModelValueFile: an enriched version of File, that will be supported by LionInputFile via.modelValue as ModelValueFile[]
 *
 * N.B.
 * - all info related to validation (errorMessage, failedProp, validationFeedback) will be stored under ValidatorOutcomeOfIsAllowedFile (outcome of validation)
 * - response key is not needed, as it is the same as File
 */
export type ModelValueFile = File & {
  /*  */
  meta: {
    downloadUrl?: string;
    /* A unique identifier for the file. Hash based on name, size, path etc. */
    id: string;
    status: 'staged-for-upload' | 'uploaded' | 'pending-upload';
    // ...moreAttrs can be added in the future if needed
  };
};
