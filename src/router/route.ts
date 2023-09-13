import { HttpMethods, IRequest } from '../http/request'
import { IResponse } from '../http/response'

export type RouteHandler = (request: IRequest, response: IResponse) => IResponse

export type Parameters = {
  [k: string]: unknown
}

export interface IRoute {
  readonly method: HttpMethods
  readonly path: string
  readonly regex: RegExp | string
  readonly handler: RouteHandler
  readonly parameters?: Parameters
}

export class Route implements IRoute {
  constructor (
    readonly method: HttpMethods,
    readonly path: string,
    readonly regex: RegExp | string,
    readonly handler: RouteHandler,
    readonly parameters?: Parameters
  ) {}

  static withRegex(route: IRoute, regex: RegExp): IRoute {
    return new Route(
      route.method,
      route.path,
      regex,
      route.handler
    )
  }

  static withParameters(route: IRoute, parameters: Parameters): IRoute {
    return new Route(
      route.method,
      route.path,
      route.regex,
      route.handler,
      parameters
    )
  }
}

