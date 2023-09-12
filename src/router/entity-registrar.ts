import { IRoute, Route } from './route'
import { IRouteRegistrar } from './route-registrar'
import { EntityDefinition, EntityFieldDefinition } from '../schemaDefs'
import { createRouteRegex } from './route-regex'
import { IResponse } from '../http/response'
import { flat } from 'radash'

export type EntityRouteTemplate = Record<string, Omit<IRoute, 'regex'>>

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

export class EntityRegistrar implements IRouteRegistrar {
  constructor (
    public routeCollection: IRoute[] = []
  ) {}

  static createRoutes(entities: EntityDefinition[], template: EntityRouteTemplate) {
    const routeArguments = Object.values(template)

    const routes: IRoute[] = flat(entities.map((entity) => {
      const primaryKeyField = getEntityPrimaryKeyField(entity)

      const routeMapped = routeArguments.map((routeArg) => {
        const routePath = routeArg.path.replace(/({primaryKey})/, `{${primaryKeyField.name}:${primaryKeyField.dataType}}`)

        const fullRoutePath = `/${entity.name}${routePath}`

        return new Route(
          routeArg.method,
          normalisePaths(`/${entity.name}${routePath}`),
        createRouteRegex(fullRoutePath),
          routeArg.handler,
        )
      })
      
      return routeMapped
    }))

    return new EntityRegistrar(routes)
  }
}

export function getEntityPrimaryKeyField(entity: EntityDefinition) {
  for (const field of entity.fields) {
    if (field.primaryKey) {
      return field
    }
  }
}

export function getEntityFieldName(entity: EntityFieldDefinition): string {
  return entity.name
}

export function normalisePaths(pathInput: string): string {
  let path: string = pathInput

  if (!path.startsWith('/')) {
    path = `/${path}`
  }

  if (!path.endsWith('/')) {
    path = `${path}/`
  }

  return path
}
