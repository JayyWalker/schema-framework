import { describe, expect, it } from 'vitest'
import { IRoute, Route } from './route'
import { filterRoutesByMethod, matcher } from './matcher'
import { IResponse } from '../http/response'
import { Request } from '../http/request'

describe('route matcher', () => {
  // @ts-ignore
  const routeHandler = (): IResponse => {}

  describe('match methods', () => {
    const routes = [
      new Route(
        'GET',
        '/get-method-1',
        '',
        routeHandler,
      ),
      new Route(
        'POST',
        '/',
        '',
        routeHandler,
      ),
      new Route(
        'POST',
        '/',
        '',
        routeHandler,
      ),
      new Route(
        'GET',
        '/get-method-2',
        '',
        routeHandler,
      )
    ]

    it('should return empty array if no methods match', () => {
      const sut = filterRoutesByMethod('PATCH', routes)

      expect(sut.length).toBe(0)
    })

    it('should return filtered routes that match the provided method', () => {
      const sut = filterRoutesByMethod('GET', routes)

      expect(sut).toStrictEqual([
        new Route(
          'GET',
          '/get-method-1',
          '',
          routeHandler,
        ),
        new Route(
          'GET',
          '/get-method-2',
          '',
          routeHandler,
        ),
      ])
    })
  })

  describe('match route regex', () => {
    let routes: IRoute[] = [
      new Route(
        'POST',
        '/pages',
        '^\\/pages\\/$',
        routeHandler
      ),
      new Route(
        'POST',
        '/pages',
        '^\\/pages\\/$',
        routeHandler
      ),
      new Route(
        'POST',
        '/pages/{id:int}',
        '^\\/pages\\/(?<id>\\d+)\\/$',
        routeHandler,
      ),
      new Route(
        'GET',
        '/pages',
        '^\\/pages\\/$',
        routeHandler
      )
    ]

    const request = new Request('POST', '/pages')

    it('should return a route after matching against the pathname', () => {
      const route = matcher(request, routes)

      expect(route).toStrictEqual(
        new Route(
          'POST',
          '/pages',
          new RegExp('^\\/pages\\/$', 'g'),
          routeHandler,
          {}
        )
      )
    })

    it('should return the first route which matches the pathname', () => {
      const route = matcher(request, routes)

      expect(route).toStrictEqual(
        new Route(
          'POST',
          '/pages',
          new RegExp('^\\/pages\\/$', 'g'),
          routeHandler,
          {}
        )
      )

      const firstRoute = routes[0]

      expect(route).toStrictEqual(
        Route.withParameters(
          Route.withRegex(firstRoute, new RegExp(firstRoute.regex, 'g')),
          {}
        )
      )
    })

    it('should return route w/parameters after matching against the pathname', () => {
      const parametersRequest = new Request('POST', '/pages/999')

      const route = matcher(parametersRequest, routes)

      expect(route).toEqual(
        new Route(
          'POST',
          '/pages/{id:int}',
          new RegExp('^\\/pages\\/(?<id>\\d+)\\/$', 'g'),
          routeHandler,
          {
            id: "999",
          }
        )
      )
    })

    it('should return no routes that match', () => {
      const emptyRoutes: IRoute[] = []

      const route = matcher(request, emptyRoutes)

      expect(route).toBeNull()
    })
  })
})
