import { IRoute } from './route'
import { IRequest } from '../http/request'
import { IResponse } from '../http/response'

export class NotFound extends Error {}

export function handler(request: IRequest, response: IResponse, route?: IRoute): IResponse {
  if (!route) {
    throw new NotFound(`No route found for: ${request.method} - ${request.url.pathname}`)
  }

  return route.handler(request, response)
}
