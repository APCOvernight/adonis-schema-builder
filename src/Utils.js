'use strict'

const Utils = {
  objectToArray: (obj, keyField = 'key') => {
    const array = []

    Object.keys(obj).map(key => {
      let item = obj[key]
      if (typeof obj[key] === 'object') {
        item = Object.assign({}, obj[key])
        item[keyField] = key
      }
      array.push(item)
    })

    return array
  }
}

module.exports = Utils
