'use strict'
var createHash = require('create-hash')

function hash160 (buffer) {
  var t = createHash('sha256').update(buffer).digest()
  return createHash('rmd160').update(t).digest()
}

function hash256 (buffer) {
  var t = createHash('sha256').update(buffer).digest()
  return createHash('sha256').update(t).digest()
}

module.exports = function cryptoHash (algorithm, buffer) {
  if (algorithm === 'hash160') return hash160(buffer)
  if (algorithm === 'hash256') return hash256(buffer)
  return createHash(algorithm).update(buffer).digest()
}
