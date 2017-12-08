'use strict'

const Utils = {
  objectToArray: (obj, keyField = 'key') => {
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
}

module.exports = Utils
