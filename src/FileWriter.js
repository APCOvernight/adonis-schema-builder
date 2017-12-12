'use strict'

const path = require('path')

class FileWriter {
  constructor (commander) {
    this.commander = commander

    /**
     * Options passed to generator to define file paths etc
     * @type {Object}
     */
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
        seeds: 'database/seeds',
        factory: 'database/factory.js'
      },
      appRoot: this.commander.helpers._appRoot
    }
  }

  /**
   * Write migration files
   * @param  {Array.Object}  migrations formatted migrations schema
   * @return {Array.Promise} Written files
   */
  async migrations (migrations) {
    const deleteExisting = await this.commander.confirm('Delete existing migrations?')
    if (deleteExisting) {
      this.commander.emptyDir(path.join(this.options.appRoot, this.options.dirs.migrations))
    }
    return Promise.all(migrations.map(async migration => {
      return this._generateFile('schema', migration.name, migration, { action: 'create' })
    }))
  }

  /**
   * Write models files
   * @param  {Array.Object}  models formatted models schema
   * @return {Array.Promise} Written files
   */
  async models (models) {
    const deleteExisting = await this.commander.confirm('Overwrite existing models?')

    return Promise.all(models.map(async model => {
      if (deleteExisting) {
        await this.commander.removeFile(path.join(this.options.appRoot, this.options.appDir, this.options.dirs.models, require('./Generators').model.getFileName(model.name) + '.js'))
      }

      return this._generateFile('model', model.modelName, model)
    }))
  }

  /**
   * Write factories file
   * @param  {Array.Object}  factories formatted factories schema
   * @return {Promise} Written file
   */
  async factories (factories) {
    const factoryExists = await this.commander.pathExists(path.join(this.options.appRoot, this.options.dirs.migrations))

    factories.map(factory => {
      factory.name = factory.modelName
    })
    let deleteExisting
    if (factoryExists) {
      deleteExisting = await this.commander.confirm('Overwrite existing factory.js?')
      if (deleteExisting) {
        await this.commander.removeFile(path.join(this.options.appRoot, this.options.dirs.factory))
      }
    }

    if (deleteExisting || !factoryExists) {
      return this._generateFile('factory', 'factory', {tables: factories})
    }

    return null
  }

  /**
   * Generate a file using a mustache template
   * @param  {String}  templateFor template filename
   * @param  {String}  name        name of file, may get modified depending on generator
   * @param  {Object}  data        Data to be passed to mustache templates
   * @param  {Object}  [flags={}]  Options to be passed to generator
   * @return {Object}              Information about success/error and location of new file
   */
  async _generateFile (templateFor, name, data, flags = {}) {
    const generator = require('./Generators')[templateFor]

    const templateFile = path.join(__dirname, 'Generators/templates/', `${templateFor}.mustache`)

    const filePath = generator.getFilePath(name, this.options)
    data = Object.assign(data, generator.getData(name, flags))

    const templateContents = await this.commander.readFile(templateFile, 'utf-8')

    try {
      await this.commander.generateFile(filePath, templateContents, data)

      const createdFile = filePath.replace(process.cwd(), '').replace(path.sep, '')

      console.info(`${this.commander.icon('success')} ${this.commander.chalk.green('create')}  ${createdFile}`)

      return { file: createdFile, namespace: this.commander.getNamespace(createdFile, templateFor), data }
    } catch (error) {
      console.error(`${this.commander.icon('error')} ${this.commander.chalk.red('create')}  ${error.message}`)
      return { error }
    }
  }
}

module.exports = FileWriter
