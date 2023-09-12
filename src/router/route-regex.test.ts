import { describe, expect, it } from 'vitest'
import { convertParameterConstraint, createRouteRegex, ParameterConstraintError, parameterToRegex } from './route-regex'

describe('route regexes', () => {
  describe('convert parameter constraint', () => {
    it.each([
      ['int', '\\d+'],
      ['integer', '\\d+'],
      ['unknown', '.+'],
    ])('should convert %s string to regex %s', (humanConstraint, expected) => {
      const sut = convertParameterConstraint(humanConstraint)

      expect(sut).toBe(expected)
    })

    it('should throw error for invalid field types provided', () => {
      expect(() => {
        convertParameterConstraint('foo')
      }).toThrowError(ParameterConstraintError)

      expect(() => {
        convertParameterConstraint('foo')
      }).toThrow('Unrecognised field type provided as parameter constraint')
    })
  })

  describe('converts path segment to regex', () => {
    it('should return segment to sender if no regex is recognised', () => {
      const sut = parameterToRegex('author')

      expect(sut).toBe('author')
    })

    it('should return regex with constraint', () => {
      const sut = parameterToRegex('{id:int}')

      expect(sut).toBe('(?<id>\\d+)')
    })

    it('should return regex without a constraint', () => {
      const sut = parameterToRegex('{id}')

      expect(sut).toBe('(?<id>.+)')
    })
  })

  describe('create regex version of pathname', () => {
    it('should return regex for /', () => {
      const sut = createRouteRegex('/')

      expect(sut).toBe('^\\/$')
    })

    it('should return regex with no path parameters', () => {
      const sut = createRouteRegex('/author')

      expect(sut).toBe('^\\/author\\/$')
    })

    it('should return regex with no constraints', () => {
      const sut = createRouteRegex('/book/{id}')

      expect(sut).toBe('^\\/book\\/(?<id>.+)\\/$')
    })

    it('should return regex for full pathname', () => {
      const sut = createRouteRegex('/author/{id:int}')

      expect(sut).toBe('^\\/author\\/(?<id>\\d+)\\/$')
    })

    it.each([
      ['/author/{id:int}', '^\\/author\\/(?<id>\\d+)\\/$'],
      ['/author', '^\\/author\\/$'],
    ])('should return regex with end slash when pathname did not provide end slash: %s -> %s', (routePath, expected) => {
      const sut = createRouteRegex(routePath)

      expect(sut).toBe(expected)
    })

    it.each([
      ['/', '^\\/$'],
      ['/author/{id:int}/', '^\\/author\\/(?<id>\\d+)\\/$'],
      ['/author/', '^\\/author\\/$'],
    ])('should return regex with end slash maintained: %s -> %s', (routePath, expected) => {
      const sut = createRouteRegex(routePath)

      expect(sut).toBe(expected)
    })
  })
})
