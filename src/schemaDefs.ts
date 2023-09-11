export type ColumnDataType =
  | 'varchar'
  | `varchar(${number})`
  | 'char'
  | `char(${number})`
  | 'text'
  | 'integer'
  | 'int2'
  | 'int4'
  | 'int8'
  | 'bigint'
  | 'boolean'
  | 'real'
  | 'double precision'
  | 'float4'
  | 'float8'
  | 'decimal'
  | `decimal(${number}, ${number})`
  | 'numeric'
  | `numeric(${number}, ${number})`
  | 'binary'
  | `binary(${number})`
  | 'bytea'
  | 'date'
  | 'datetime'
  | `datetime(${number})`
  | 'time'
  | `time(${number})`
  | 'timetz'
  | `timetz(${number})`
  | 'timestamp'
  | `timestamp(${number})`
  | 'timestamptz'
  | `timestamptz(${number})`
  | 'serial'
  | 'bigserial'
  | 'uuid'
  | 'json'
  | 'jsonb'
  | 'blob'


export type EntityFieldDefinition = {
  dataType: ColumnDataType
  primaryKey?: boolean
  unique?: boolean
  autoIncrement?: boolean
  notNull?: boolean
}

// export type EntityDefinition = Record<string, EntityFieldDefinition>

export type EntityDefinition = {
  [FN in string]: EntityFieldDefinition
}

const dates: EntityDefinition = {
  createdAt: {
    dataType: 'timestamp',
    notNull: false,
  },
  updatedAt: {
    dataType: 'timestamp',
    notNull: false,
  },
}

export const AuthorEntity: EntityDefinition = {
  id: {
    autoIncrement: true,
    dataType: 'varchar',
    primaryKey: true,
  },
  name: {
    dataType: 'varchar',
  },
  ...dates,
}
