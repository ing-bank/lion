export class HttpClientFetchError extends Error {
  constructor(request, response) {
    super(`Fetch request to ${request.url} failed.`);

    this.request = request;
    this.response = response;
  }
}
