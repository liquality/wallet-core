const a = require('./a');

// console.log(a.name); // = undefined
process.nextTick(() => {
  console.log(a.name); // = b
});

exports.name = 'b';
