import { describe, expect, it } from 'vitest'
import { EntityDefinition } from '../schemaDefs'
import { getEntityFieldName, getEntityPrimaryKeyField, normalisePaths } from './utilities'

describe('utilities', () => {
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
