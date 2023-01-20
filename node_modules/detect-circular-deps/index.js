const detector = require('./lib/index');

const { start, filters } = detector;

function problems({ callback } = {}) {
  return start({
    filter: filters.PROBLEMS,
    errCallback: callback,
  });
}

function circular({ callback } = {}) {
  return start({
    errCallback: callback,
  });
}

function alwaysEmptyExports({ callback } = {}) {
  return start({
    filter: filters.ALWAYS_EMPTY,
    errCallback: callback,
  });
}

function emptySyncAccess({ callback } = {}) {
  return start({
    filter: filters.SYNC_EMPTY,
    errCallback: callback,
  });
}

function missingProperties({ callback } = {}) {
  return start({
    filter: filters.MISSING_PROPERTIES,
    errCallback: callback,
  });
}

module.exports = {
  problems,
  circular,
  alwaysEmptyExports,
  emptySyncAccess,
  missingProperties,
};
