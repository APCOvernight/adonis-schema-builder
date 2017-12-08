'use strict'

class SchemaParser {
  constructor (schema) {
    this.schema = schema
    this.tableIds = {}
    this.columnIds = {}
  }

  _getTableName (id) {
    return this.tableIds[id]
  }

  _getTableId (name) {
    let matchId

    Object.keys(this.tableIds).map(id => {
      if (this.tableIds[id] === name) {
        matchId = id
      }
    })

    return matchId
  }

  _getColumnTable (id) {
    return this.tableIds[id].table
  }

  _getColumnName (id) {
    return this.tableIds[id].name
  }

  _objectToArray (obj, keyField = 'name') {
    const array = []

    Object.keys(obj).map(key => {
      const item = obj[key]
      if (typeof item === 'object') {
        item[keyField] = key
      }
      array.push(item)
    })

    return array
  }

  _getColumnId (columnName, tableName) {
    let matchId

    Object.keys(this.tableIds).map(id => {
      if (this.tableIds[id].column === columnName && this.tableIds[id].table === tableName) {
        matchId = id
      }
    })

    return matchId
  }

  convert () {
    const tables = this._formatTables(this.schema.tables, this.schema.columns)

    const migrations = this._generateMigrations(tables)
    const models = this._generateModels(tables)
    const seeds = this._generateSeeds(tables)
    const tests = this._generateTests(tables)

    return {
      tables,
      migrations,
      models,
      seeds,
      tests
    }
  }

  _formatTables (rawTables, rawColumns) {
    const tables = this._setupTables(rawTables)
    this._addColumns(rawColumns, tables)

    return tables
  }

  _setupTables (rawTables) {
    const tables = {}
    rawTables.forEach(table => {
      tables[table.name] = {
        softDelete: table.softDelete,
        timestamp: table.timeStamp
      }
      this.tableIds[table.id] = table.name
    })

    return tables
  }

  _addColumns (rawColumns, tables) {
    Object.keys(tables).map(tableName => {
      const table = tables[tableName]
      const columnsObject = {}

      rawColumns[this._getTableId(tableName)].forEach(column => {
        this.columnIds[column.id] = {table: tableName, column: column.name}
        columnsObject[column.name] = this._formatColumn(column)
      })

      table.columns = columnsObject
      table.keys = this._generateKeys(table.columns)
    })
  }

  _formatColumn (column) {
    if (!(column.foreignKey && column.foreignKey.references && column.foreignKey.references && column.foreignKey.references.id)) {
      column.foreignKey = null
    }

    column.knexString = this._columnKnex(column)

    return column
  }

  _generateKeys (columns) {

  }

  _columnKnex (column) {
    let string = 'table.'

    this._convertType(column)

    string += this._knexType(column)
    string += this._knexChain(column)
    string += this._knexRelationships(column)

    return string
  }

  _convertType (column) {
    if (['tinyInteger', 'smallInteger', 'mediumInteger'].includes(column.type)) {
      column.type = 'integer'
    }

    if (column.length && ['text', 'char'].includes(column.type)) {
      column.type = 'string'
    }

    if (column.type === 'double') {
      column.type = 'float'
    }

    if (column.type === 'char') {
      column.type = 'text'
    }

    if (column.autoInc) {
      column.type = 'increments'
    }
  }

  _knexChain (column) {
    let chainString = ''

    if (column.defValue) {
      chainString += `.defaultTo('${column.defValue}')`
    }

    if (!column.nullable) {
      chainString += `.notNullable()`
    }

    if (column.unique) {
      chainString += `.unique()`
    }

    if (column.index) {
      chainString += `.index()`
    }

    if (column.unsigned) {
      chainString += `.unsigned()`
    }

    if (column.comment) {
      chainString += `.comment('${column.comment}')`
    }

    return chainString
  }

  _knexType (column) {
    let typeString = ''

    if (['text', 'string', 'integer', 'bigInteger', 'date', 'dateTime', 'timestamp', 'time', 'float', 'decimal', 'boolean', 'increments'].includes(column.type)) {
      typeString += `${column.type}('${column.name}'`
    }

    if (column.type.includes('Text')) {
      typeString += `text('${column.name}', '${column.type.replace('Text', '')}text'`
    }

    if (column.length) {
      typeString += `, ${column.length}`
    }

    typeString += `)`

    return typeString
  }

  _knexRelationships (column) {
    let relationshipString = ''

    if (column.foreignKey) {
      relationshipString = `.references('${column.foreignKey.references.name}').on('${column.foreignKey.on.name}').onDelete('set null')`
    }

    return relationshipString
  }

  _generateMigrations (tables) {
    const migrations = this._objectToArray(tables)

    migrations.map(migration => {
      migration.columns = this._objectToArray(migration.columns)
    })

    return migrations
  }

  _generateModels (tables) {
    const models = []
    return models
  }

  _generateSeeds (tables) {
    const seeds = []
    return seeds
  }

  _generateTests (tables) {
    const tests = []
    return tests
  }
}

module.exports = SchemaParser
