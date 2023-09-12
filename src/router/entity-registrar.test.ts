import { describe, expect, it } from 'vitest'
import {
  EntityRegistrar,
  EntityRouteTemplate,
} from './entity-registrar'
import { EntityDefinition } from '../schemaDefs'
import { IResponse } from '../http/response'
import { Route } from './route'

describe('route entity registrar', () => {
    // @ts-ignore
    const templateHandler = (): IResponse => {}

    const template: EntityRouteTemplate = {
      browse: {
        method: 'GET',
        path: '/',
        handler: templateHandler,
      },
      read: {
        method: 'GET',
        path: '/{primaryKey}',
        handler: templateHandler,
      },
      edit: {
        method: 'PATCH',
        path: '/{primaryKey}',
        handler: templateHandler,
      },
      add: {
        method: 'POST',
        path: '/',
        handler: templateHandler,
      },
      delete: {
        method: 'DELETE',
        path: '/{primaryKey}',
        handler: templateHandler,
      }
    }

    it('should register routes based on route entity template', () => {
      const entities: EntityDefinition[] = [
        {
          name: 'author',
          fields: [
            {
              name: 'id',
              autoIncrement: true,
              dataType: 'integer',
              primaryKey: true,
            }
          ]
        },
      ]

      const sut = EntityRegistrar.createRoutes(entities, template)

      expect(sut.routeCollection).toStrictEqual([
        new Route(
          'GET',
          '/author/',
          '^\\/author\\/$',
          templateHandler,
        ),
        new Route(
          'GET',
          '/author/{id:integer}/',
          '^\\/author\\/(?<id>\\d+)\\/$',
          templateHandler,
        ),
        new Route(
          'PATCH',
          '/author/{id:integer}/',
          '^\\/author\\/(?<id>\\d+)\\/$',
      templateHandler,
        ),
        new Route(
          'POST',
          '/author/',
          '^\\/author\\/$',
      templateHandler,
        ),
        new Route(
          'DELETE',
          '/author/{id:integer}/',
          '^\\/author\\/(?<id>\\d+)\\/$',
      templateHandler,
        )
      ])
    })

    it('should register no routes', () => {
      expect(EntityRegistrar.createRoutes([], {}).routeCollection).toStrictEqual([])
    })
})
