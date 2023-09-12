import { describe, expect, it } from 'vitest'
import { RouteRegistrar } from './route-registrar'

describe('route registrar', () => {
  const handler = (_, __) => new Response

  it.each([
    ['get', 'GET'],
    ['head', 'HEAD'],
    ['post', 'POST'],
    ['put', 'PUT'],
    ['delete', 'DELETE'],
    ['options', 'OPTIONS'],
    ['trace', 'TRACE'],
    ['patch', 'PATCH'],
    ['connect', 'CONNECT'],
  ])('should add a %s route to the registar', (method, expected) => {
    const routeRegistrar = new RouteRegistrar

    routeRegistrar[method]('/', handler)

    expect(routeRegistrar.routeCollection[0].method).toBe(expected)
  })

  it('should register no routes', () => {
    const routeRegistrar = new RouteRegistrar

    expect(routeRegistrar.routeCollection.length).toBe(0)
  })
})
