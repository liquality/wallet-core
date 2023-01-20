import * as a from './a';
// console.log(a.name); // = undefined

process.nextTick(() => {
  console.log(a.name); // = a
});

export const name = 'b';
