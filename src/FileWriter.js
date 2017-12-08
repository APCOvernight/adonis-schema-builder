'use strict'

const path = require('path')

class FileWriter {
  constructor (commander) {
    this.commander = commander

    this.options = {
      appDir: 'app',
      dirs: {
        httpControllers: 'Controllers/Http',
        wsControllers: 'Controllers/Ws',
        models: 'Models',
        traits: 'Models/Traits',
        hooks: 'Models/Hooks',
        listeners: 'Listeners',
        exceptions: 'Exceptions',
        middleware: 'Middleware',
        commands: 'Commands',
        views: 'resources/views',
        migrations: 'database/migrations',
        seeds: 'database/seeds'
      },
      appRoot: this.commander.helpers._appRoot
    }
  }

  async migrations (migrations) {
    const deleteExisting = await this.commander.confirm('Delete existing migrations?')
    if (deleteExisting) {
      this.commander.emptyDir(path.join(this.options.appRoot, this.options.dirs.migrations))
    }
    return Promise.all(migrations.map(async migration => {
      return this._generateFile('schema', migration.name, migration, { action: 'create' })
    }))
  }

  async _generateFile (templateFor, name, data, flags) {
    const generator = require('./Generators')[templateFor]

    const templateFile = path.join(__dirname, 'Generators/templates/', `${templateFor}.mustache`)

    const filePath = generator.getFilePath(name, this.options)
    data = Object.assign(data, generator.getData(name, flags))

    const templateContents = await this.commander.readFile(templateFile, 'utf-8')
    await this.commander.generateFile(filePath, templateContents, data)

    const createdFile = filePath.replace(process.cwd(), '').replace(path.sep, '')
    console.info(`${this.commander.icon('success')} ${this.commander.chalk.green('create')}  ${createdFile}`)

    return { file: createdFile, namespace: this.commander.getNamespace(createdFile, templateFor), data }
  }
}

module.exports = FileWriter
