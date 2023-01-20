const detector = require('../../index');

detector.circular()
  .then((results) => {
    console.log(results);
  });

require('../always-empty/a');
