# API Examples

## Circular
Get all circular dependencies detected while requiring a module

```js
const detector = require('../../index');

detector.circular()
  .then((results) => {
    console.log(results);
  });

require('../always-empty/a');
```

```
[ 
  { 
    file: 'examples/always-empty/a',
    stack: [ 'examples/always-empty/a', 'examples/always-empty/b' ],
    exportsNotIdentical: true,
    hasIncompleteExports: true,
    causingProblems: true,
    message: 'The exports of examples/always-empty/a is empty when it is required at examples/always-empty/b\u001b[31m (It causes problems)\u001b[39m\n    Circular Path: examples/always-empty/a\u001b[36m > \u001b[39mexamples/always-empty/b\n'
  } 
]
```
Each item has some properties which used to filter the results to be used in another functions

.problems() uses .causingProblems == true

.alwaysEmptyExports uses .exportsNotIdentical == true

.emptySyncAccess uses .hasIncompleteExports == true

.emptySyncAccess uses .missingProperty != undefined
