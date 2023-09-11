import { IncomingMessage, ServerResponse } from 'http'
import { URL } from 'url'

export default class Router {
  protected routes: object[] = []

  constructor (
    protected request: IncomingMessage,
    protected response: ServerResponse<IncomingMessage>
  ) {}

  public matchPattern(url: URL, routePath: string) {

  }

  public handle() {
    const requestUrl = new URL(this.request.url, 'http://localhost')

    const path = requestUrl.pathname

    const invalidPaths = [
      'favicon.ico'
    ]
    if (invalidPaths.indexOf(path) < 0) {
      // Should not handle these
      return
    }
  }

  public register(method: string, path: string, handler: Function) {
    this.routes.push({ method, path, handler })
  }
}
