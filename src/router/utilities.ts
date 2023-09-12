import { EntityDefinition, EntityFieldDefinition } from '../schemaDefs'

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
