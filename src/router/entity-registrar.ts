import { IRoute, Route } from './route'
import { IRouteRegistrar } from './route-registrar'
import { EntityDefinition } from '../schemaDefs'
import { createRouteRegex } from './route-regex'
import { IResponse } from '../http/response'
import { flat } from 'radash'
import { getEntityPrimaryKeyField, normalisePaths } from './utilities'

export type EntityRouteTemplate = Record<string, Omit<IRoute, 'regex'>>

/* c8 ignore start */
const routesTemplate: EntityRouteTemplate = {
  browse: {
    method: 'GET',
    path: '/',
    // @ts-ignore
    handler: (): IResponse => {
    }
  },
  read: {
    method: 'GET',
    path: '/{primaryKey}',
    handler: (response: IResponse): IResponse => {
      // @ts-ignore
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
    handler: (): IResponse => {}
  },
  add: {
    method: 'POST',
    path: '/',
    // @ts-ignore
    handler: (): IResponse => {}
  },
  delete: {
    method: 'DELETE',
    path: '/{primaryKey}',
    // @ts-ignore
    handler: (): IResponse => {}
  }
}
/* c8 ignore stop */

export class EntityRegistrar implements IRouteRegistrar {
  constructor (
    public routeCollection: IRoute[] = []
  ) {}

  static createRoutes(entities: EntityDefinition[], template: EntityRouteTemplate) {
    const routeArguments = Object.values(template)

    const routes: IRoute[] = flat(entities.map((entity) => {
      const primaryKeyField = getEntityPrimaryKeyField(entity)

      return routeArguments.map((routeArg) => {
        const routePath = routeArg.path.replace(/({primaryKey})/, `{${primaryKeyField.name}:${primaryKeyField.dataType}}`)

        const fullRoutePath = `/${entity.name}${routePath}`

        return new Route(
          routeArg.method,
          normalisePaths(fullRoutePath),
          createRouteRegex(fullRoutePath),
          routeArg.handler,
        )
      })
    }))

    return new EntityRegistrar(routes)
  }
}
