import { Ajax } from './src/Ajax.js';

export { Ajax } from './src/Ajax.js';
export { AjaxFetchError } from './src/AjaxFetchError.js';
export {
  acceptLanguageRequestInterceptor,
  createXsrfRequestInterceptor,
  createCacheInterceptors,
} from './src/interceptors/index.js';

// globally available instance
export const ajax = new Ajax();
