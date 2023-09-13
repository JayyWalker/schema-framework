export type HttpMethods = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH'

export interface IRequest {
  readonly url: URL
  readonly method: HttpMethods
}

export class Request implements IRequest {
  public readonly url: URL
  public readonly method: HttpMethods

  constructor (
    method: string,
    url: string
  ) {
    this.method = Request.createMethod(method)
    this.url = new URL(url, 'http://localhost')
  }

  static createMethod(method: string): HttpMethods {
    return method.toUpperCase() as HttpMethods
  }
}
