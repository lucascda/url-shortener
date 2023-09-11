export class UrlNotFoundError extends Error {
  constructor() {
    super();
    this.message = 'Url not found';
    this.name = 'UrlNotFoundError';
  }
}
