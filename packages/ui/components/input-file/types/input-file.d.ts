import { FeedbackMessage } from '../../form-core/types/validate/ValidateMixinTypes.js';

// type FileBasics = {
//   name: string;
//   /** size in bytes */
//   size: number;
//   type: string;
//   status?: 'SUCCESS' | 'FAIL' | 'LOADING';
// };

// export type InputFile = {
//   downloadUrl?: string;
//   errorMessage?: FeedbackMessage.message;
//   failedProp?: Array<string | number>;
//   response?: FileSelectResponse;
//   systemFile: Partial<SystemFile>;
//   validationFeedback?: Array<FeedbackMessage>;
// } & FileBasics &
//   Partial<File>;

// export type SystemFile = {
//   downloadUrl?: string;
//   errorMessage?: FeedbackMessage.message;
//   failedProp?: Array<string | number>;
//   response?: FileSelectResponse;
// } & FileBasics &
//   Partial<File>;

// export type FileSelectResponse = {
//   downloadUrl?: string;
//   errorMessage?: FeedbackMessage.message;
//   id?: string;
// } & Partial<FileBasics>;

/*
 * All accept criteria the 'IsAcceptedFile' validator needs to know about.
 * They are derived from LionInputFile.accept and LionInputFile.maxSize properties
 */
export type AcceptCriteria = {
  allowedTypes: string[];
  allowedExtensions: string[];
  maxSize: number;
};

export type AcceptCategory = 'type' | 'extension' | 'size';

/*
 * This is the outcome of the execute function of the IsAcceptedFile Validator.
 * Whereas normal validators usually return a simple false or true, this
 * Validator returns Array<ValidatorOutcomeOfIsAcceptedFile>.
 * The outcomes will be connected via fileIds to ModelValueFile.meta.id
 */
export type ValidatorOutcomeOfIsAcceptedFile = {
  /* this connects the outcome to ModelValueFile.meta.id */
  fileId: string;
  /* What accept criterium did this File fail on? */
  failedOn: AcceptCategory;
  /* Meta data that can be used to construct a feedback message */
  meta: { acceptCriteria: AcceptCriteria };
}[];

/**
 * We have two types of File to deal with:
 * 1. [File](https://developer.mozilla.org/en-US/docs/Web/API/File): supported by [HTMLInputElement](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file) via .files as FileList
 * 2. ModelValueFile: an enriched version of File, that will be supported by LionInputFile via.modelValue as ModelValueFile[]
 *
 * N.B.
 * - all info related to validation (errorMessage, failedProp, validationFeedback) will be stored under ValidatorOutcomeOfIsAcceptedFile (outcome of validation)
 * - response key is not needed, as it is the same as File
 */
export type ModelValueFile = File & {
  /*  */
  meta: {
    downloadUrl?: string;
    /* A unique identifier for the file. Could be hash based on name, size, path etc. */
    id: string;
    // ...moreAttrs can be added in the future if needed
  };
};
