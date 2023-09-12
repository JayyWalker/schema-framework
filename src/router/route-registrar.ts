import { HttpMethods, IRoute, Route, RouteHandler } from './route'
import { createRouteRegex } from './route-regex'

export interface IRouteRegistrar {
  routeCollection: IRoute[]
}

export class RouteRegistrar implements IRouteRegistrar {
  constructor (
    public routeCollection: IRoute[] = []
  ) {}

  protected addRoute(methodInput: HttpMethods, path: string, handler: RouteHandler): void {
    const regex = createRouteRegex(path)

    const method = methodInput.toUpperCase() as HttpMethods

    this.routeCollection.push(
      new Route(method, path, regex, handler)
    )
  }

  get(path: string, handler: RouteHandler): void {
    this.addRoute('GET', path, handler)
  }

  head(path: string, handler: RouteHandler): void {
    this.addRoute('HEAD', path, handler)
  }

  post(path: string, handler: RouteHandler): void {
    this.addRoute('POST', path, handler)
  }

  put(path: string, handler: RouteHandler): void {
    this.addRoute('PUT', path, handler)
  }

  delete(path: string, handler: RouteHandler): void {
    this.addRoute('DELETE', path, handler)
  }

  options(path: string, handler: RouteHandler): void {
    this.addRoute('OPTIONS', path, handler)
  }

  trace(path: string, handler: RouteHandler): void {
    this.addRoute('TRACE', path, handler)
  }

  patch(path: string, handler: RouteHandler): void {
    this.addRoute('PATCH', path, handler)
  }

  connect(path: string, handler: RouteHandler): void {
    this.addRoute('CONNECT', path, handler)
  }
}

