const path = require('path');
const Module = require('module');
require('colors');

const paths = {};
const orig = Module._load;
let results = {};

const filters = {
  PROBLEMS: 'problems',
  ALWAYS_EMPTY: 'always-empty',
  SYNC_EMPTY: 'sync-empty',
  MISSING_PROPERTIES: 'missing-properties',
};

function removeExtension(filePath) {
  return filePath.replace('.js', '');
}

function formatProblem(problem, cli) {
  let str = '';
  const { missingProperty } = problem;
  const modulePath = problem.stack[problem.stack.length - 1];
  if (missingProperty) {
    str += 'Can\'t find a property: ';
    str += missingProperty.name.yellow;
    str += ' at ';
    str += modulePath;
    str += ' (It causes problems)'.red;
  } else if (problem.exportsNotIdentical) {
    str += 'The exports of ';
    str += problem.stack[0];
    str += ' is empty when it is required at ';
    str += modulePath;
    str += ' (It causes problems)'.red;
  } else if (problem.hasIncompleteExports) {
    str += 'The exports of ';
    str += problem.stack[0];
    str += ' is not complete when it is required at ';
    str += modulePath;
    str += ' (It doesn\'t cause problems but maybe in future)'.yellow;
  } else {
    str += 'Circular requiring of ';
    str += problem.stack[0];
  }
  str += '\n    Circular Path: ';
  str += problem.stack.join(' > '.cyan);
  str += '\n';
  return str;
}

function isCircularDep(path, parent) {
  const context = {
    parent,
  };
  while (context.parent) {
    if (removeExtension(context.parent.filename) === path) {
      return true;
    }
    context.parent = context.parent.parent;
  }
}

function report({ relativePath, ...rest }) {
  const { data } = paths[relativePath];
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const context = {
      parent: item.parent,
    };

    const current = path.relative(process.cwd(), removeExtension(context.parent.filename));
    const stack = [current];
    while (path.relative(process.cwd(), removeExtension(context.parent.filename)) !== relativePath) {
      context.parent = context.parent.parent;
      if (!context.parent) {
        break;
      }
      const nextPath = path.relative(process.cwd(), removeExtension(context.parent.filename));
      stack.unshift(nextPath);
    }
    results[relativePath] = Object.assign(results[relativePath] || {}, {
      stack,
    }, rest);
    results[relativePath].message = formatProblem(results[relativePath]);
  }
}

function isAcceptableExports(data, newExports) {
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const oldExports = item.moduleExports;
    const oldKeys = item.keys;
    const newKeys = Object.keys(newExports);
    const sameObject = newExports === oldExports;
    const sameProperties = oldKeys.length === newKeys.length
      && oldKeys.every((v, i) => v === newKeys[i]);
    if (!sameObject) {
      return false;
    }
    if (!sameProperties) {
      return 0;
    }
  }
  return true;
}

function validateProperty({ moduleName, propName, value }) {
  const { completeExports } = paths[moduleName];
  const actual = completeExports && completeExports[propName];
  const propertyMissing = actual !== value;
  if (propertyMissing) {
    report({
      relativePath: moduleName,
      causingProblems: true,
      missingProperty: {
        name: propName,
        expectedValue: actual,
      },
    });
  }
}

function compare(options) {
  const {
    relativePath,
    parent,
    moduleExports,
  } = options;
  const filePath = path.resolve(relativePath);
  const item = {
    parent,
    moduleExports,
    keys: Object.keys(moduleExports),
  };
  const circular = isCircularDep(filePath, parent);
  if (!paths[relativePath]) {
    if (circular) {
      paths[relativePath] = { data: [] };
      paths[relativePath].data.push(item);
    }
  } else {
    if (circular) {
      paths[relativePath].data.push(item);
      return;
    }
    paths[relativePath].completeExports = moduleExports;
    const acceptableExports = isAcceptableExports(paths[relativePath].data, moduleExports);

    report({
      relativePath,
      exportsNotIdentical: acceptableExports === false,
      hasIncompleteExports: !acceptableExports,
      causingProblems: acceptableExports === false,
    });
  }
}

function check(options) {
  const {
    path: fPath,
    errCallback,
    parent,
  } = options;

  let { apply } = options;
  const relativePath = removeExtension(path.relative(process.cwd(), fPath));

  compare({
    moduleExports: apply,
    relativePath,
    parent,
    errCallback,
  });

  if (isCircularDep(path.resolve(relativePath), parent)) {
    apply = new Proxy(apply, {
      get(target, propName) {
        if (typeof propName === 'string') {
          const value = target[propName];
          process.nextTick(() => {
            validateProperty({
              moduleName: relativePath,
              propName,
              value,
            });
          });
        }
        return target[propName];
      },
    });
  }

  return apply;
}

function start({ filter, errCallback }) {

  if (errCallback !== undefined && typeof errCallback !== 'function') {
    throw new Error('Parameter errCallback should be function');
  }

  Module._load = function (name, parent) {
    let apply = orig.apply(this, arguments);
    const relative = removeExtension(path.relative(process.cwd(),
      path.resolve(path.dirname(parent.filename), name)));
    if ((name.indexOf('.') === 0 || path.isAbsolute(name))
      && parent.filename.indexOf('node_modules/') === -1) {
      apply = check({
        parent,
        apply,
        path: relative,
      });
    }
    return apply;
  };
  return new Promise((resolve) => {
    setImmediate(() => {
      const keys = Object.keys(results);
      let newResults = keys.map(key => Object.assign({ file: key }, results[key]));
      let filterKey;
      switch (filter) {
        case filters.ALWAYS_EMPTY:
          filterKey = 'exportsNotIdentical';
          break;
        case filters.SYNC_EMPTY:
          filterKey = 'hasIncompleteExports';
          break;
        case filters.MISSING_PROPERTIES:
          filterKey = 'missingProperty';
          break;
        case filters.PROBLEMS:
          filterKey = 'causingProblems';
          break;
        default:
          filterKey = null;
          break;
      }
      newResults = filterKey ? newResults.filter(i => i[filterKey]) : newResults;
      results = {};
      if (errCallback) {
        errCallback(null, newResults);
      }
      resolve(newResults);
    });
  });
}

function stop() {
  Module._load = orig;
}

module.exports = {
  start,
  stop,
  filters,
};
