'use strict'

const BaseCommand = require('@adonisjs/cli/src/Commands/Make/Base')
const SchemaParser = require('../src/SchemaParser')
const FileWriter = require('../src/FileWriter')
const fs = require('fs')
const util = require('util')
const Stat = util.promisify(fs.stat)
const Read = util.promisify(fs.readFile)

class BuildCommand extends BaseCommand {
  static get inject () {
    return ['Adonis/Src/Helpers']
  }

  constructor (helpers) {
    super()
    this.helpers = helpers
  }

  static get signature () {
    return 'schema:build { path?=schema.json: Path to json schema file }'
  }

  static get description () {
    return 'Build migrations, seeds, models and tests based on a json schema'
  }

  async handle (args, options) {
    let schema

    try {
      await this.ensureInProjectRoot()
      schema = await this._loadSchema(args.path)
    } catch ({ message }) {
      this.error(message)
      this.info('See command usage - ./ace schema:build -h')
    }

    const templateSchema = new SchemaParser(schema).convert()

    const writer = new FileWriter(this)

    await writer.migrations(templateSchema.migrations)
    await writer.factories(templateSchema.factories)
    await writer.models(templateSchema.models)
  }

  async _loadSchema (path) {
    await Stat(path)
    return JSON.parse(await Read(path, 'utf8'))
  }
}

module.exports = BuildCommand
