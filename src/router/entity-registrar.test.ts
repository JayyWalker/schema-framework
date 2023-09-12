import { describe, expect, it } from 'vitest'
import {
  EntityRegistrar,
  EntityRouteTemplate,
  getEntityFieldName,
  getEntityPrimaryKeyField,
  normalisePaths,
} from './entity-registrar'
import { EntityDefinition, EntityFieldDefinition } from '../schemaDefs'
import { IResponse } from '../http/response'
import { Route } from './route'

describe('route entity registrar', () => {
  describe('collection', () => {
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

  describe('get entity primary key', () => {
    it('should receive a single field that is a primary key', () => {
      const exampleEntity: EntityDefinition = {
        name: 'author',
        fields: [
          {
            name: 'id',
            autoIncrement: true,
            dataType: 'varchar',
            primaryKey: true,
          },
          {

            name: 'name',
            dataType: 'varchar',
          },
          {
            name: 'createdAt',
            dataType: 'timestamp',
            notNull: false,
          },
          {
            name: 'updatedAt',
            dataType: 'timestamp',
            notNull: false,
          },
        ]
      }

      const sut = getEntityPrimaryKeyField(exampleEntity)

      expect(sut).toStrictEqual({
        name: 'id',
        autoIncrement: true,
        dataType: 'varchar',
        primaryKey: true,
      })
    })

    it('should receive the entity field name', () => {
      const sut = getEntityFieldName({
        name: 'id',
        autoIncrement: true,
        dataType: 'varchar',
        primaryKey: true,
      })

      expect(sut).toStrictEqual('id')
    })
  })

  describe('paths', () => {
    it('should return index path', () => {
      const sut = normalisePaths('/')
      
      expect(sut).toBe('/')
    })
    
    it('should return path with backslash suffix', () => {
      const sut = normalisePaths('/author/')
      
      expect(sut).toBe('/author/')
    })

    it('should return path with backslash suffix if not provided', () => {
      const sut = normalisePaths('/author')
      
      expect(sut).toBe('/author/')
    })

    it('should return path with backslash prefix', () => {
      const sut = normalisePaths('author/')

      expect(sut).toBe('/author/')
    })

    it('should return path with backslash prefix if not provided', () => {
      const sut = normalisePaths('author/')

      expect(sut).toBe('/author/')
    })
  })
})
