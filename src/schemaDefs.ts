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
  name: string
  dataType: ColumnDataType
  primaryKey?: boolean
  unique?: boolean
  autoIncrement?: boolean
  notNull?: boolean
}

export type EntityDefinition = {
  name: string
  fields: EntityFieldDefinition[]
}

const dates: EntityFieldDefinition[] = [
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

export const AuthorEntity: EntityDefinition = {
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
    ...dates,
  ]
}
