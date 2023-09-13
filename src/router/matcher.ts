import { HttpMethods, IRequest } from '../http/request'
import { normalisePaths } from './utilities'
import { IRoute, Route, RouteHandler } from './route'
import { first, select } from 'radash'

export function filterRoutesByMethod(methodToMatch: HttpMethods, routes: IRoute[]): IRoute[] {
  return routes.filter((route) => route.method === methodToMatch)
}

export function matcher(request: IRequest, routes: IRoute[]): IRoute | null {
  const url: URL = request.url

  const pathname = normalisePaths(url.pathname)

  const routesFilteredByMethod = filterRoutesByMethod(request.method, routes)

  const routesWithRegex: IRoute[] = routesFilteredByMethod.map(
    (route) => Route.withRegex(route, new RegExp(route.regex, 'g'))
  )

  let matchedRoute: IRoute

  for(let route of routesWithRegex) {
    const matched = pathname.matchAll(route.regex as RegExp)

    const matchedArray: RegExpMatchArray[] = Array.from(matched)

    if (matchedArray.length > 0) {
      const parameters = first(matchedArray).groups || {}

      matchedRoute = Route.withParameters(route, parameters)
    }
  }

  if (matchedRoute === undefined) {
    return null
  }

  return matchedRoute
}
