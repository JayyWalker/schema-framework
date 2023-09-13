import { describe, expect, it } from 'vitest'
import { IRoute, Route } from './route'
import { handler, NotFound } from './handler'
import { Request } from '../http/request'
import { Response } from '../http/response'

describe('route handler', () => {
  it('should call handler function from the provided route', () => {
    const route: IRoute = new Route(
      'GET',
      '/',
      '^\\/$',
      (_request, response) => {
        return response
      }
    )

    const request = new Request('GET', '/')

    const response = new Response

    const handlerResponse = handler(request, response, route)

    expect(handlerResponse).toEqual(new Response)
  })

  it('should throw error if the handler dose not create a response', () => {
    const request = new Request('GET', '/')

    const response = new Response

    expect(() => {
      return handler(request, response)
    }).toThrow(`No route found for: GET - /`)

    expect(() => {
      return handler(request, response)
    }).toThrow(NotFound)
  })
})
