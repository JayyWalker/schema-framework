import { IRequest } from '../http/request'
import { IResponse } from '../http/response'

export type HttpMethods = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH'

export type RouteHandler = (request: IRequest, response: IResponse) => IResponse

export interface IRoute {
  readonly method: HttpMethods
  readonly path: string
  readonly regex: string
  readonly handler: RouteHandler
}

export class Route implements IRoute {
  constructor (
    readonly method: HttpMethods,
    readonly path: string,
    readonly regex: string,
    readonly handler: RouteHandler
  ) {}
}

