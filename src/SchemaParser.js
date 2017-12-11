'use strict'

const _ = require('lodash')
const pluralize = require('pluralize')
const Utils = require('./Utils')
const MigrationFormatter = require('./MigrationFormatter')
const FactoryFormatter = require('./FactoryFormatter')

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
    return this.columnIds[id].table
  }

  _getColumnName (id) {
    return this.columnIds[id].column
  }

  _getColumnId (columnName, tableName) {
    let matchId

    Utils.objectToArray(this.columnIds, 'id').map(column => {
      if (column.name === columnName && column.table === tableName) {
        matchId = column.id
      }
    })

    return matchId
  }

  convert () {
    const tables = this._formatTables(this.schema.tables, this.schema.columns)

    this._decorateRelations(tables, this.schema.relations)

    const migrations = new MigrationFormatter().format(tables)
    const factories = new FactoryFormatter().format(tables)
    const models = this._generateModels(tables)
    const seeds = this._generateSeeds(tables)
    const tests = this._generateTests(tables)

    return {
      tables,
      migrations,
      factories,
      models,
      seeds,
      tests
    }
  }

  _formatTables (rawTables, rawColumns) {
    const tables = this._setupTables(rawTables)
    this._mergeColumns(rawColumns, tables)

    return tables
  }

  _setupTables (rawTables) {
    const tables = {}
    rawTables.forEach(table => {
      tables[table.name] = {
        softDelete: table.softDelete || false,
        timestamp: table.timeStamp || false,
        isLink: table.name.includes('_'),
        modelName: pluralize.singular(_.upperFirst(_.camelCase(table.name)))
      }
      this.tableIds[table.id] = table.name
    })

    return tables
  }

  _mergeColumns (rawColumns, tables) {
    Object.keys(tables).map(tableName => {
      const table = tables[tableName]
      const columnsObject = {}

      rawColumns[this._getTableId(tableName)].forEach(column => {
        this.columnIds[column.id] = {table: tableName, column: column.name}
        columnsObject[column.name] = this._formatColumn(column)
      })

      table.columns = columnsObject
    })
  }

  _formatColumn (column) {
    if (!(column.foreignKey && column.foreignKey.references && column.foreignKey.references.id)) {
      column.foreignKey = null
    }

    this._convertType(column)

    return column
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

  _decorateRelations (tables, relations) {
    Object.keys(tables).map(tableName => {
      const table = tables[tableName]
      table.relations = {}
    })

    relations.map(relation => {
      const sourceName = this._getTableName(relation.source.tableId)
      const source = tables[sourceName]
      const sourceColumnName = this._getColumnName(relation.source.columnId)
      const sourceColumn = tables[sourceName].columns[sourceColumnName]

      const targetName = this._getTableName(relation.target.tableId)
      const target = tables[targetName]
      const targetColumnName = this._getColumnName(relation.target.columnId)
      // const targetColumn = tables[targetName].columns[targetColumnName]

      if (!source.isLink) {
        source.relations[pluralize.singular(_.lowerCase(targetName))] = {
          type: 'belongsTo',
          table: targetName,
          relatedModel: target.modelName,
          primaryKey: targetColumnName,
          foreignKey: sourceColumnName
        }

        let targetRelationName = _.lowerCase(sourceName)
        targetRelationName = sourceColumn.unique ? pluralize.singular(targetRelationName) : pluralize.plural(targetRelationName)

        target.relations[targetRelationName] = {
          type: sourceColumn.unique ? 'hasOne' : 'hasMany',
          table: sourceName,
          relatedModel: source.modelName,
          primaryKey: targetColumnName,
          foreignKey: sourceColumnName
        }
      } else {
        const relatedRelations = relations.filter(related => {
          return related.source.tableId === relation.source.tableId && related.source.columnId !== relation.source.columnId
        })

        relatedRelations.map(related => {
          const relatedName = this._getTableName(related.target.tableId)
          const relatedTable = tables[relatedName]
          const relatedColumnName = this._getColumnName(related.target.columnId)
          const relatedForeignColumnName = this._getColumnName(related.source.columnId)

          target.relations[pluralize.plural(_.lowerCase(relatedName))] = {
            type: 'belongsToMany',
            table: relatedName,
            relatedModel: relatedTable.modelName,
            primaryKey: targetColumnName,
            foreignKey: sourceColumnName,
            relatedPrimaryKey: relatedColumnName,
            relatedForeignKey: relatedForeignColumnName,
            pivotTable: sourceName,
            withTimestamps: source.timestamp
          }
        })
      }
    })

    const chainable = ['belongsToMany', 'hasManyThrough', 'hasMany', 'hasOne']

    // Traverse through to find chainable relations
    for (let i = 0; i < 1; i) {
      i = 1
      Object.keys(tables).map(tableName => {
        const table = tables[tableName]

        Object.keys(table.relations).map(relationName => {
          const relation = table.relations[relationName]
          const relatedTable = tables[relation.table]

          if (chainable.includes(relation.type)) {
            Utils.objectToArray(relatedTable.relations, 'name').map(nextRelation => {
              if (chainable.includes(nextRelation.type) && !table.relations[nextRelation.name]) {
                // If both relationships are chainable, and not already chained, set up hasManyThrough

                table.relations[nextRelation.name] = {
                  type: 'hasManyThrough',
                  table: nextRelation.table,
                  relatedModel: relatedTable.modelName,
                  relatedMethod: nextRelation.name,
                  name: nextRelation.name,
                  primaryKey: relation.primaryKey,
                  foreignKey: relation.foreignKey
                }

                // Keep the loop going again
                i = 0
              }
            })
          }
        })
      })
    }
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
