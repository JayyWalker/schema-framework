import { IncomingMessage, ServerResponse } from 'http'

type EntityFields = Record<string, string>

type Entity = {
  name: string,
  primaryKey: string,
  fields: EntityFields,
}

export const AuthorEntity: Entity = {
  name: 'author',
  primaryKey: 'id',
  fields: {
    id: 'int',
    name: 'string',
    createdAt: 'timestamp',
    updatedAt: 'timestamp',
  }
}

type Route = {
  method: 'GET' | 'PATCH' | 'POST' | 'DELETE',
  path: string,
  regex: string,
  handler: (response: Response) => Response
}

let matchedRoute: { route: Route, regexMatchResult: RegExpMatchArray[] }

type MatchedRoute = {
  route: Route
  regexMatchResult: RegExpMatchArray[]
}

class Response {
  readonly nodeResponse: ServerResponse

  httpStatus: number

  httpHeaders: Map<string, string>

  httpBody: string

  constructor (nodeResponse: ServerResponse) {
    this.nodeResponse = nodeResponse

    this.httpHeaders = new Map
    this.httpStatus = 200
    this.httpBody = ''
  }

  status(value: number): Response {
    this.httpStatus = value

    return this
  }

  header(key: string, value: string): Response {
    this.httpHeaders.set(key, value)

    return this
  }

  body(input: unknown): Response {
    this.httpBody = JSON.stringify(input)

    return this
  }

  createResponse() {
    this.httpHeaders.forEach((value, key) => {
      this.nodeResponse.setHeader(key, value)
    })

    this.nodeResponse.statusCode = this.httpStatus

    this.nodeResponse.end(this.httpBody)
  }
}

function createRouteRegex(routePath: string): string {
  /**
   * Converts Human-readable constraint to a regex
   * @param humanConstraint
   */
  function convertParameterConstraint (humanConstraint: string): string {
    switch(humanConstraint) {
      case('int'):
        return '\\d+'
      case('unknown'):
        return '.+'
      default:
        throw new Error('Invalid field type provided')
    }
  }

  function pathToRegex (routeSegments: string) {
    // Checks if the segment is a parameter. If not, it is returned as normal
    if (routeSegments.indexOf('{') < 0) {
      return routeSegments
    }

    const parameter: string[] = routeSegments
      .substring(1, (routeSegments.length - 1))
      .split(':')

    const [parameterName, constraint] = parameter

    const parameterConstraintRegex: string = parameter.length === 2
      ? convertParameterConstraint(constraint)
      : convertParameterConstraint('unknown')

    return `(?<${parameterName}>${parameterConstraintRegex})`
  }

  let result = routePath
    .split('/')
    .map(pathToRegex)
    .join('\\/')

  if (!result.endsWith('/')) {
    result = `${result}\\/`
  }

  return `^${result}$`
}

type RouteMatcherFunc = (request: IncomingMessage) => MatchedRoute

type RouteHandlerFunc = (route: MatchedRoute, request: IncomingMessage, response: ServerResponse<IncomingMessage>) => Response

export function router(entities: Entity[]): [RouteMatcherFunc, RouteHandlerFunc] {
  const routesTemplate: Record<string, Omit<Route, 'regex'>> = {
    browse: {
      method: 'GET',
      path: '/',
      // @ts-ignore
      handler: (): Response => {
      }
    },
    read: {
      method: 'GET',
      path: '/{primaryKey}',
      handler: (response: Response): Response => {
        response.header('content-type', 'application/json')
          .body({
            foo: 'bar'
          })

        return response
      }
    },
    edit: {
      method: 'PATCH',
      path: '/{primaryKey}',
      // @ts-ignore
      handler: (): Response => {}
    },
    add: {
      method: 'POST',
      path: '/',
      // @ts-ignore
      handler: (): Response => {}
    },
    delete: {
      method: 'DELETE',
      path: '/{primaryKey}',
      // @ts-ignore
      handler: (): Response => {}
    }
  }

  let routes: Route[] = []

  const routeArguments = Object.values(routesTemplate)

  entities.forEach((entity) => {
    routeArguments.forEach((routeArg) => {
      const routePath = routeArg.path.replace(/({primaryKey})/, `{${entity.primaryKey}:${entity.fields[entity.primaryKey]}}`)

      const fullRoutePath = `/${entity.name}${routePath}`

      routes.push({
        method: routeArg.method,
        path: `/${entity.name}${routePath}`,
        regex: createRouteRegex(fullRoutePath),
        handler: routeArg.handler,
      })
    })
  })

  console.log(routes)

  function matcher(request: IncomingMessage): MatchedRoute {
    function normaliseRequestPathname(pathname: string) {
      if (pathname === '/') {
        return pathname
      }

      const result = pathname

      if (!result.startsWith('/')) {
        return `/${result}`
      }

      if (!result.endsWith('/')) {
        return `${result}/`
      }

      return pathname
    }

    const url: URL = new URL(request.url, 'http://localhost')

    const normalisedPathname = normaliseRequestPathname(url.pathname)

    console.log('url:', url.href)
    console.log('pathname:', normalisedPathname)

    const routesFilteredByMethod: Route[] = routes.filter((route) => {
      return route.method === request.method;
    })

    let matchedRoute: { route: Route, regexMatchResult: RegExpMatchArray[] }

    for (let route of routesFilteredByMethod) {
      const regex = new RegExp(route.regex, 'g')

      const matched = normalisedPathname.matchAll(regex)

      const matchedArray = Array.from(matched)

      if (matchedArray.length > 0) {
        matchedRoute = {
          route: route,
          regexMatchResult: matchedArray,
        }
      }
    }

    console.log('matchedRoutes:', matchedRoute)

    return matchedRoute
  }

  function handler (matchedRoute: MatchedRoute, _request: IncomingMessage, response: ServerResponse<IncomingMessage>): Response {
    console.log('matchedRoute', matchedRoute)

    if (!matchedRoute?.route) {
      console.log('No route found')

      return new Response(response)
        .status(404)
        .body('Not found')
    }

    return matchedRoute.route.handler(
      new Response(response)
    )
  }

  return [matcher, handler]
}
