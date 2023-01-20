# crypto-hashing

[![NPM Package](https://img.shields.io/npm/v/crypto-hashing.svg?style=flat-square)](https://www.npmjs.org/package/crypto-hashing)
[![Build Status](https://img.shields.io/travis/cryptocoinjs/crypto-hashing.svg?branch=master&style=flat-square)](https://travis-ci.org/cryptocoinjs/crypto-hashing)
[![Dependency status](https://img.shields.io/david/cryptocoinjs/crypto-hashing.svg?style=flat-square)](https://david-dm.org/cryptocoinjs/crypto-hashing#info=dependencies)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

###### Available functions:

In addition to functions from [crypto-browserify/createHash](https://github.com/crypto-browserify/createHash):
- hash160 (sha256 and then ripemd160)
- hash256 (sha256 twice)

###### Example

```js
var cryptoHash = require('crypto-hashing')
var buffer = new Buffer('Hello there!')
console.log(cryptoHash('hash256', buffer).toString('hex'))
// e365181d0a42d3f57906af24c80d4636158455d140734c85e80609fa7d100300
```

## License

MIT
