import { FeedbackMessage } from "../../form-core/types/validate/ValidateMixinTypes.js";

type FileBasics = {
  name: string;
  /** size in bytes */
  size: number;
  type: string;
  status?: 'SUCCESS' | 'FAIL' | 'LOADING';
};

export type InputFile = {
  downloadUrl?: string;
  errorMessage?: FeedbackMessage.message;
  failedProp?: Array<string|number>;
  response?: UploadResponse;
  systemFile: Partial<SystemFile>;
  validationFeedback?: Array<FeedbackMessage>;
} & FileBasics & Partial<File>;

export type SystemFile = {
  downloadUrl?: string;
  errorMessage?: FeedbackMessage.message;
  failedProp?: Array<string|number>;
  response?: UploadResponse;
} & FileBasics & Partial<File>;


export type UploadResponse = {
  downloadUrl?: string;
  errorMessage?: FeedbackMessage.message;
  id?: string;
} & Partial<FileBasics>;
