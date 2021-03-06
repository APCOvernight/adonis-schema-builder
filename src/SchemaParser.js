'use strict'

const _ = require('lodash')
const pluralize = require('pluralize')
const Utils = require('./Utils')
const MigrationFormatter = require('./MigrationFormatter')
const FactoryFormatter = require('./FactoryFormatter')
const ModelFormatter = require('./ModelFormatter')

/**
 * Parse JSON schema
 */
class SchemaParser {
  /**
   * @param  {Object} schema Parsed JSON schema
   */
  constructor (schema, commander) {
    this.schema = schema
    this.commander = commander
    this.tableIds = {}
    this.columnIds = {}
  }

  /**
   * get table name from an id
   * @param  {[type]} id
   * @return {[type]}
   */
  _getTableName (id) {
    return this.tableIds[id]
  }

  /**
   * get table id from name
   * @param  {String} name
   * @return {String}
   */
  _getTableId (name) {
    let matchId

    Object.keys(this.tableIds).map(id => {
      if (this.tableIds[id] === name) {
        matchId = id
      }
    })

    return matchId
  }

  /**
   * get a column's table from id
   * @param  {String} id
   * @return {String}
   */
  _getColumnTable (id) {
    return this.columnIds[id].table
  }

  /**
   * get a column's name from id
   * @param  {String} id
   * @return {String}
   */
  _getColumnName (id) {
    return this.columnIds[id].column
  }

  /**
   * get a column id from the column and table name
   * @param  {String} columnName
   * @param  {String} tableName
   * @return {String}
   */
  _getColumnId (columnName, tableName) {
    let matchId

    Utils.objectToArray(this.columnIds, 'id').map(column => {
      if (column.name === columnName && column.table === tableName) {
        matchId = column.id
      }
    })

    return matchId
  }

  /**
   * Convert the Schema JSON into a format ready for the file writer
   * @return {Object}
   */
  async convert () {
    const tables = this._formatTables(this.schema.tables, this.schema.columns)

    await this._decorateRelations(tables, this.schema.relations)

    const migrations = new MigrationFormatter().format(tables)
    const factories = new FactoryFormatter().format(tables)
    const models = new ModelFormatter().format(tables)
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

  /**
   * Format the tables object ready for use in writers
   * @param  {Object} rawTables  tables object from raw json schema
   * @param  {Object} rawColumns  columns object from raw json schema
   * @return {Object}
   */
  _formatTables (rawTables, rawColumns) {
    const tables = this._setupTables(rawTables)
    this._mergeColumns(rawColumns, tables)

    return tables
  }

  /**
   * Add basic data to each table
   * @param  {Object} rawTables  tables object from raw json schema
   * @return {Object}
   */
  _setupTables (rawTables) {
    const tables = {}
    rawTables.forEach(table => {
      tables[table.name] = {
        softDelete: table.softDelete || false,
        timestamp: table.timeStamp || false,
        isLink: table.name.includes('_'),
        modelName: pluralize.singular(_.upperFirst(_.camelCase(table.name))),
        relations: {}
      }
      this.tableIds[table.id] = table.name
    })

    return tables
  }

  /**
   * Add corresponding columns to the tables object
   * @param  {Object} rawColumns  columns object from raw json schema
   * @param  {Object} tables      partially formatted tables object
   */
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

  /**
   * Prepare column for tables object
   * @param  {Object} column column object from raw json schema
   * @return {Object}        [description]
   */
  _formatColumn (column) {
    if (!(column.foreignKey && column.foreignKey.references && column.foreignKey.references.id)) {
      column.foreignKey = null
    }

    this._convertType(column)

    return column
  }

  /**
   * Convert schema builder types into corresponding knex types
   * @param  {Object} column column object from raw json schema
   */
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

  /**
   * Add relations to tables
   * @param  {Object} tables    Tables object
   * @param  {Array} relations  relations array from raw json schema
   */
  async _decorateRelations (tables, relations) {
    for(const relation of relations){
      this._getRelationData(tables, relation)

      if (!relation.sourceTable.isLink) {
        await this._setBelongsTo(relation)
        await this._setHas(relation)
      } else {
        const relatedRelations = relations.filter(related => {
          return related.source.tableId === relation.source.tableId && related.source.columnId !== relation.source.columnId
        })

        for(const related of relatedRelations){
          await this._setBelongsToMany(tables, relation, related)
        }
      }
    }
    this._findHasManyThrough(tables)
  }

  /**
   * Collate data about a relationship and the tables involved
   * @param  {Object} tables    Tables object
   * @param  {Object} relation  relation object from raw json schema
   */
  _getRelationData (tables, relation) {
    relation.sourceTableName = this._getTableName(relation.source.tableId)
    relation.sourceTable = tables[relation.sourceTableName]
    relation.sourceColumnName = this._getColumnName(relation.source.columnId)
    relation.sourceColumn = tables[relation.sourceTableName].columns[relation.sourceColumnName]

    relation.targetTableName = this._getTableName(relation.target.tableId)
    relation.targetTable = tables[relation.targetTableName]
    relation.targetColumnName = this._getColumnName(relation.target.columnId)
    relation.targetColumn = tables[relation.targetTableName].columns[relation.targetColumnName]
  }

/**
 * checks if a duplicate exists with the same name on the relations object
 * and prompts the user to enter a new name if it dose
 * @param {Array} relations
 * @param {String} relationName
 * @param {String} tableName
 * @returns {String} relation name
 */
async _handleDuplicates (relations, relationName, tableName){
    return relations[relationName] && this.commander
            ? await this.commander.ask(`a relation with the name "${relationName}" already exists on model ${pluralize.singular(tableName)}. please enter a new name`)
            : relationName
}

  /**
   * Add a belongsTo relationship to a table
   * @param {Object} relation formatted relation object
   */
  async _setBelongsTo (relation) {
    let relationName = _.camelCase(relation.sourceColumnName)
    relationName = await this._handleDuplicates (relation.sourceTable.relations, relationName, relation.sourceTableName)
    relation.sourceTable.relations[relationName] = {
      type: 'belongsTo',
      table: relation.targetTableName,
      relatedModel: relation.targetTable.modelName,
      primaryKey: relation.targetColumnName,
      foreignKey: relation.sourceColumnName
    }
  }

  /**
   * Add a hasOne or hasMany relationship to a table
   * @param {Object} relation formatted relation object
   */
  async _setHas (relation) {
    let targetRelationName = _.lowerCase(relation.sourceTableName)
    targetRelationName = relation.sourceColumn.unique
                          ? _.camelCase(pluralize.singular(targetRelationName) + "_" + relation.sourceColumnName)
                          : _.camelCase(pluralize.plural(targetRelationName) + "_" + relation.sourceColumnName)

    targetRelationName = await this._handleDuplicates (relation.targetTable.relations, targetRelationName, relation.targetTableName)

    relation.targetTable.relations[targetRelationName] = {
      type: relation.sourceColumn.unique ? 'hasOne' : 'hasMany',
      table: relation.sourceTableName,
      relatedModel: relation.sourceTable.modelName,
      primaryKey: relation.targetColumnName,
      foreignKey: relation.sourceColumnName
    }
  }

  /**
   * Add a belongsToMany relationship to a table
   * @param  {Object} tables    Tables object
   * @param {Object} relation   formatted relation object
   * @param {Object} related    formatted relation object for corresponding relation
   */
 async _setBelongsToMany (tables, relation, related) {
    const relatedName = this._getTableName(related.target.tableId)
    const relatedTable = tables[relatedName]
    const relatedColumnName = this._getColumnName(related.target.columnId)
    const relatedForeignColumnName = this._getColumnName(related.source.columnId)
    let relationName = pluralize.plural(_.lowerCase(relatedName))
    relationName = await this._handleDuplicates (relation.targetTable.relations, relationName, relation.targetTableName)

    relation.targetTable.relations[relationName] = {
      type: 'belongsToMany',
      table: relatedName,
      relatedModel: relatedTable.modelName,
      primaryKey: relation.targetColumnName,
      foreignKey: relation.sourceColumnName,
      relatedPrimaryKey: relatedColumnName,
      relatedForeignKey: relatedForeignColumnName,
      pivotTable: relation.sourceTableName,
      withTimestamps: relation.sourceTable.timestamp
    }
  }

  /**
   * Traverse through relations to find chainable hasManyThrough relations
   * @param {Object} tables formatted tables object
   */
  _findHasManyThrough (tables) {
    const chainable = ['belongsToMany', 'hasManyThrough', 'hasMany', 'hasOne']

    // Traverse through to find chainable relations
    for (let i = 0; i < 1; i) {
      i = 1
      Object.keys(tables).map(tableName => {
        const table = tables[tableName]

        Object.keys(table.relations).map(relationName => {
          const relation = table.relations[relationName]
          const relatedTable = tables[relation.table]

          Utils.objectToArray(relatedTable.relations, 'name').map(nextRelation => {
            if (chainable.includes(relation.type) &&
              chainable.includes(nextRelation.type) &&
              !table.relations[nextRelation.name] &&
              nextRelation.table !== tableName) {
              // If both relationships are chainable, and not already chained, set up hasManyThrough

              table.relations[nextRelation.name] = {
                type: 'hasManyThrough',
                table: nextRelation.table,
                relatedModel: relatedTable.modelName,
                relatedMethod: nextRelation.name,
                primaryKey: relation.primaryKey,
                foreignKey: relation.foreignKey
              }

              // Keep the loop going again
              i = 0
            }
          })
        })
      })
    }
  }

  /**
   * Generate Seed files
   * @param {Object} tables formatted tables object
   * @return {Array}
   */
  _generateSeeds (tables) {
    const seeds = []
    return seeds
  }

  /**
   * Generate Test files
   * @param {Object} tables formatted tables object
   * @return {Array}
   */
  _generateTests (tables) {
    const tests = []
    return tests
  }
}

module.exports = SchemaParser
