/**
 * We have a method fetchJson that encodes JS Object to
 * a string automatically for `body` property.
 * Sadly, Typescript doesn't allow us to extend RequestInit
 * and override body prop because it is incompatible, so we
 * omit it first from the base RequestInit.
 */
export interface LionRequestInit extends Omit<RequestInit, 'body'> {
  body?: BodyInit | null | Object;
  request?: CacheRequest;
}

export interface AjaxConfig {
  addAcceptLanguage?: boolean;
  addCaching?: boolean;
  xsrfCookieName?: string | null;
  xsrfHeaderName?: string | null;
  cacheOptions?: CacheOptionsWithIdentifier;
  xsrfTrustedOrigins?: string[] | null;
  jsonPrefix?: string;
}

export type RequestInterceptor = (request: Request) => Promise<Request | Response>;
export type ResponseInterceptor = (response: Response) => Promise<Response>;
export type ResponseJsonInterceptor = (jsonObject: object, response: Response) => Promise<object>;

export interface CacheConfig {
  expires: string;
}

export type Params = { [key: string]: any };

export type RequestIdFunction = (
  request: Partial<CacheRequest>,
  serializeSearchParams?: (params: Params) => string,
) => string;

export interface CacheOptions {
  useCache?: boolean;
  methods?: string[];
  maxAge?: number;
  invalidateUrls?: string[];
  invalidateUrlsRegex?: RegExp;
  requestIdFunction?: RequestIdFunction;
  contentTypes?: string[];
  maxResponseSize?: number;
  maxCacheSize?: number;
}

export interface CacheOptionsWithIdentifier extends CacheOptions {
  getCacheIdentifier?: () => string|Promise<string>;
}

export interface ValidatedCacheOptions extends CacheOptions {
  useCache: boolean;
  methods: string[];
  maxAge: number;
  requestIdFunction: RequestIdFunction;
}

export interface CacheRequestExtension {
  cacheSessionId?: string;
  cacheOptions?: CacheOptions;
  adapter: any;
  status: number;
  statusText: string;
  params: Params;
}

export interface CacheResponseRequest {
  cacheSessionId?: string;
  cacheOptions?: CacheOptions;
  method: string;
}

export interface CacheResponseExtension {
  request: CacheResponseRequest;
  fromCache?: boolean;
}

export type CacheRequest = Request & Partial<CacheRequestExtension>;

export interface CacheResponse extends Response, CacheResponseExtension {
  clone: () => CacheResponse;
}

export type CachedRequests = { [requestId: string]: { createdAt: number, size: number, response: CacheResponse } };

export type CachedRequestInterceptor = (
  request: CacheRequest,
) => Promise<CacheRequest | CacheResponse>;

export type CachedResponseInterceptor = (request: CacheResponse) => Promise<CacheResponse>;
