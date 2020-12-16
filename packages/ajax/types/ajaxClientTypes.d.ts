/**
 * We have a method requestJson that encodes JS Object to
 * a string automatically for `body` property.
 * Sadly, Typescript doesn't allow us to extend RequestInit
 * and override body prop because it is incompatible, so we
 * omit it first from the base RequestInit.
 */
export interface LionRequestInit extends Omit<RequestInit, 'body'> {
  body?: BodyInit | null | Object;
}
