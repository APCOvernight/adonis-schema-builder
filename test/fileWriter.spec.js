'use strict'

/* eslint-disable no-unused-expressions */

const chai = require('chai')
chai.use(require('sinon-chai'))
const expect = chai.expect
const sinon = require('sinon')
const FileWriter = require('../src/FileWriter')
const path = require('path')
const mock = require('mock-require')
const requireg = require('requireg')

const testDir = path.resolve('test/.tmp')

mock('@adonisjs/cli/src/Generators', requireg('@adonisjs/cli/src/Generators'))

class Commander {
  confirm () {}
  emptyDir () {}
  readFile () {}
  generateFile () {}
  icon () {}
  getNamespace () {}
  pathExists () {}
  removeFile () {}

  get chalk () {
    return {
      green: () => {},
      red: () => {}
    }
  }

  get helpers () {
    return {
      _appRoot: testDir
    }
  }
}

describe('Write migration files', () => {
  it('Should prompt for delete - no', async () => {
    const commander = new Commander()
    const confirmStub = sinon.stub(commander, 'confirm').resolves(false)
    const emptyDirStub = sinon.stub(commander, 'emptyDir').resolves(true)

    const writer = new FileWriter(commander)

    await writer.migrations([])

    expect(confirmStub).to.be.calledOnce
    confirmStub.restore()
    expect(emptyDirStub).to.not.be.called
    emptyDirStub.restore()
  })

  it('Should prompt for delete - yes', async () => {
    const commander = new Commander()
    const confirmStub = sinon.stub(commander, 'confirm').resolves(true)
    const emptyDirStub = sinon.stub(commander, 'emptyDir').resolves(true)

    const writer = new FileWriter(commander)

    await writer.migrations([])

    expect(confirmStub).to.be.calledOnce
    confirmStub.restore()
    expect(emptyDirStub).to.be.calledWith(path.resolve(path.join('test/.tmp', 'database/migrations')))
    emptyDirStub.restore()
  })

  it('Should generate migration files', async () => {
    const commander = new Commander()
    const confirmStub = sinon.stub(commander, 'confirm').resolves(false)
    const readFileStub = sinon.stub(commander, 'readFile').resolves(false)
    const consoleStub = sinon.stub(console, 'info')

    const writer = new FileWriter(commander)

    const output = await writer.migrations([{ name: 'users' }])

    expect(output[0].file).to.match(/test\/\.tmp\/database\/migrations\/([0-9]+)_users_schema.js/)
    expect(output[0].data.create).to.equal(true)

    expect(confirmStub).to.be.calledOnce
    confirmStub.restore()

    expect(readFileStub).to.be.calledOnce
    readFileStub.restore()

    expect(consoleStub.args[0][0]).to.match(/test\/\.tmp\/database\/migrations\/([0-9]+)_users_schema.js/)
    consoleStub.restore()
  })
})

describe('Write factory file', () => {
  it('Should prompt for delete - no', async () => {
    const commander = new Commander()
    const confirmStub = sinon.stub(commander, 'confirm').resolves(false)
    const pathExistsStub = sinon.stub(commander, 'pathExists').resolves(true)
    const removeFileStub = sinon.stub(commander, 'removeFile').resolves(true)

    const writer = new FileWriter(commander)

    const output = await writer.factories([])

    expect(output).to.be.null

    expect(pathExistsStub).to.be.calledOnce
    pathExistsStub.restore()
    expect(confirmStub).to.be.calledOnce
    confirmStub.restore()
    expect(removeFileStub).to.not.be.called
    removeFileStub.restore()
  })

  it('Should prompt for delete - yes', async () => {
    const commander = new Commander()
    const confirmStub = sinon.stub(commander, 'confirm').resolves(true)
    const pathExistsStub = sinon.stub(commander, 'pathExists').resolves(true)
    const removeFileStub = sinon.stub(commander, 'removeFile').resolves(true)
    const consoleStub = sinon.stub(console, 'info')

    const writer = new FileWriter(commander)

    await writer.factories([])

    expect(pathExistsStub).to.be.calledOnce
    pathExistsStub.restore()
    expect(confirmStub).to.be.calledOnce
    confirmStub.restore()
    expect(removeFileStub).to.be.calledWith(path.resolve(path.join('test/.tmp', 'database/factory.js')))
    removeFileStub.restore()
    consoleStub.restore()
  })

  it('File doesn\'t exist, Should not prompt for delete', async () => {
    const commander = new Commander()
    const confirmStub = sinon.stub(commander, 'confirm').resolves(false)
    const pathExistsStub = sinon.stub(commander, 'pathExists').resolves(false)
    const removeFileStub = sinon.stub(commander, 'removeFile').resolves(true)
    const consoleStub = sinon.stub(console, 'info')

    const writer = new FileWriter(commander)

    await writer.factories([])

    expect(pathExistsStub).to.be.calledOnce
    pathExistsStub.restore()
    expect(confirmStub).to.not.be.called
    confirmStub.restore()
    expect(removeFileStub).to.not.be.called
    removeFileStub.restore()
    consoleStub.restore()
  })

  it('Should generate factory file', async () => {
    const commander = new Commander()
    const pathExistsStub = sinon.stub(commander, 'pathExists').resolves(true)
    const confirmStub = sinon.stub(commander, 'confirm').resolves(true)
    const readFileStub = sinon.stub(commander, 'readFile').resolves(false)
    const consoleStub = sinon.stub(console, 'info')

    const writer = new FileWriter(commander)

    const output = await writer.factories([{ name: 'users', modelName: 'User' }])

    expect(output.file).to.match(/test\/\.tmp\/database\/factory.js/)

    expect(pathExistsStub).to.be.calledOnce
    pathExistsStub.restore()
    expect(confirmStub).to.be.calledOnce
    confirmStub.restore()
    expect(readFileStub).to.be.calledOnce
    readFileStub.restore()

    expect(consoleStub.args[0][0]).to.match(/test\/\.tmp\/database\/factory.js/)
    consoleStub.restore()
  })

  it('Should give model names to factories', async () => {
    const commander = new Commander()
    const pathExistsStub = sinon.stub(commander, 'pathExists').resolves(false)
    const confirmStub = sinon.stub(commander, 'confirm').resolves(true)
    const readFileStub = sinon.stub(commander, 'readFile').resolves(false)
    const consoleStub = sinon.stub(console, 'info')

    const writer = new FileWriter(commander)

    const output = await writer.factories([{ name: 'users', modelName: 'User' }])

    expect(output.data.tables[0].name).to.equal('User')

    expect(pathExistsStub).to.be.calledOnce
    pathExistsStub.restore()
    expect(confirmStub).to.not.be.called
    confirmStub.restore()
    expect(readFileStub).to.be.calledOnce
    readFileStub.restore()

    expect(consoleStub.args[0][0]).to.match(/test\/\.tmp\/database\/factory.js/)
    consoleStub.restore()
  })
})

describe('Write model files', () => {
  it('Should prompt for delete - no', async () => {
    const commander = new Commander()
    const confirmStub = sinon.stub(commander, 'confirm').resolves(false)
    const removeFileStub = sinon.stub(commander, 'removeFile').resolves(true)
    const consoleStub = sinon.stub(console, 'info')

    const writer = new FileWriter(commander)

    const output = await writer.models([{ name: 'test', modelName: 'Test' }])

    expect(output[0].file).to.equal('test/.tmp/app/Models/Test.js')

    expect(confirmStub).to.be.calledOnce
    confirmStub.restore()
    expect(removeFileStub).to.not.be.called
    removeFileStub.restore()
    consoleStub.restore()
  })

  it('Should prompt for delete - yes', async () => {
    const commander = new Commander()
    const confirmStub = sinon.stub(commander, 'confirm').resolves(true)
    const removeFileStub = sinon.stub(commander, 'removeFile').resolves(true)
    const consoleStub = sinon.stub(console, 'info')

    const writer = new FileWriter(commander)

    await writer.models([{ name: 'test', modelName: 'Test' }])

    expect(confirmStub).to.be.calledOnce
    confirmStub.restore()
    expect(removeFileStub).to.be.calledWith(path.resolve('test/.tmp/app/Models/Test.js'))
    removeFileStub.restore()
    consoleStub.restore()
  })

  it('Should throw graceful error if file already exists', async () => {
    const commander = new Commander()
    const confirmStub = sinon.stub(commander, 'confirm').resolves(false)
    const generateFileStub = sinon.stub(commander, 'generateFile').rejects(new Error('File already exists'))
    const consoleStub = sinon.stub(console, 'error')

    const writer = new FileWriter(commander)

    const output = await writer.models([{ name: 'test', modelName: 'Test' }])

    expect(output[0].error.message).to.equal('File already exists')
    expect(consoleStub).to.be.calledWith('undefined undefined  File already exists')

    expect(confirmStub).to.be.calledOnce
    confirmStub.restore()
    expect(generateFileStub).to.be.calledOnce
    generateFileStub.restore()
    consoleStub.restore()
  })
})

// TODO integration tests
