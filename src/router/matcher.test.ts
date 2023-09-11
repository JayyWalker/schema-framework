import { describe, it } from 'vitest'

describe('route matcher', () => {
  describe('normaliser', () => {
    it.todo('should return received pathname if it is a /')

    it.todo('should return pathname with prefixed / if it lacks it')

    it.todo('should return pathname with suffixed / if it lacks it')

    it.todo('should return pathname with slashes if it lacks them')
  })

  describe('match methods', () => {
    it.todo('should return filtered routes that match the provided method')

    it.todo('should return empty array if no methods match')
  })

  describe('match route regex', () => {
    it.todo('should return a route after matching against the pathname')

    it.todo('should return the first route which matches the pathname')

    it.todo('should return no routes that match')
  })
})
