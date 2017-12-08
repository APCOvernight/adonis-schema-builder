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

  get chalk () {
    return {
      green: () => {}
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
    confirmStub.restore
    expect(emptyDirStub).to.not.be.called
    emptyDirStub.restore
  })

  it('Should prompt for delete - yes', async () => {
    const commander = new Commander()
    const confirmStub = sinon.stub(commander, 'confirm').resolves(true)
    const emptyDirStub = sinon.stub(commander, 'emptyDir').resolves(true)

    const writer = new FileWriter(commander)

    await writer.migrations([])

    expect(confirmStub).to.be.calledOnce
    confirmStub.restore
    expect(emptyDirStub).to.be.calledWith(path.resolve(path.join('test/.tmp', 'database/migrations')))
    emptyDirStub.restore
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
    confirmStub.restore

    expect(readFileStub).to.be.calledOnce
    readFileStub.restore

    expect(consoleStub.args[0][0]).to.match(/test\/\.tmp\/database\/migrations\/([0-9]+)_users_schema.js/)
    consoleStub.restore()
  })
})
