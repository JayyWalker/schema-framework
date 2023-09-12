import { describe, expect, it } from 'vitest'
import { HttpMethods, IRoute, Route } from './route'

describe('route', () => {
  const handler = (_, __) => new Response

  it.each([
    ['GET', 'GET'],
    ['HEAD', 'HEAD'],
    ['POST', 'POST'],
    ['PUT', 'PUT'],
    ['DELETE', 'DELETE'],
    ['OPTIONS', 'OPTIONS'],
    ['TRACE', 'TRACE'],
    ['PATCH', 'PATCH'],
    ['CONNECT', 'CONNECT'],
  ])('should return %s when the %s method is selected', (method, expected) => {
    const route = new Route(method as HttpMethods, '/', '', handler)

    expect(route.method).toBe(expected)
  })

  it.each([
    ['/', '/'],
    ['/author', '/author'],
    ['/author/{id:int}', '/author/{id:int}'],
    ['/author/{id}', '/author/{id}']
  ])('should return %s when the %s path is provided', (path, expected) => {
      const route = new Route('GET',path, '', handler)

      expect(route.path).toBe(expected)
  })

  it.each([
    // For /
    ['^\\/$', '^\\/$'],
    // For /author/
    ['^\\/author\\/$', '^\\/author\\/$'],
    // For /author/{id:int}/
    ['^\\/author\\/(?<id>\\d+)\\/$', '^\\/author\\/(?<id>\\d+)\\/$']
  ])('should return the regex %s', (regex, expected) => {
    const route = new Route('GET','/', regex, handler)

    expect(route.regex).toBe(expected)
  })

  it('should return the handler of the route', () => {
    const route = new Route('GET','/', '/', handler)

    expect(route.handler).toBeTypeOf('function')
  })
})
