#!/usr/bin/env node

const program = require('commander');
const glob = require('glob');
const fs = require('fs');
const path = require('path');
const detector = require('./lib/index');
require('colors');

const logger = console.log;
const { filters, start: startDetector, stop } = detector;

function muteConsole() {
  console.log = console.error = console.info = console.debug = console.warn = console.trace = console.dir = console.dirxml = console.group = console.groupEnd = console.time = console.timeEnd = console.assert = console.profile = () => undefined;
  process.stderr.write = () => undefined;
}

function resolvePath(pattern) {
  return new Promise((resolve, reject) => {
    return glob(pattern, {
      nodir: true,
      ignore: [
        '**/node_modules/**',
        './**/node_modules/**',
      ],
    }, (err, resolved) => {
      if (err) {
        reject(err);
      } else {
        resolve(resolved);
      }
    });
  });
}

async function getPaths(args) {
  const results = [];
  for (const pattern of args) {
    if (pattern.indexOf('*') === -1) {
      results.push(pattern);
    } else {
      results.concat(await resolvePath(pattern));
    }
  }
  return results;
}

program
  .version('3.0.0')
  .arguments('<file...>')
  .option('-p, --problems', 'Report CD. that causing problems (Default)')
  .option('-c, --circular', 'Report all Circular Dependencies.')
  .option('-e, --always-empty-exports', 'Report CD. which its exports are always empty even when it\'s async-accessed after requiring (Causes Problems)')
  .option('-s, --empty-sync-access', 'Report CD. which its exports are empty only when it is sync-accessed after requiring. (May causes problems in future)')
  .option('-m, --missing-properties', 'Report CD. which some of the properties of its exports was sync-accessed after requiring but not found (Causes Problems)')
  .option('--es6', 'Enable es6 modules')
  .option('-d, --debug', 'Print debugging messages');

program.parse(process.argv);

async function check({ filter, modulePath }) {
  let exitCode = 0;
  try {
    const promise = startDetector({ filter });
    logger(`Start detecting EntryPoint: ${modulePath.green}`);
    const absolutePath = path.resolve(modulePath);
    const notExists = !fs.existsSync(absolutePath) ? `Cannot find module ${absolutePath}` : null;
    if (notExists) {
      throw new Error(notExists);
    }

    require(absolutePath);

    const results = await promise;
    for (let i = 0; i < results.length; i++) {
      const item = results[i];
      logger('✗  '.red + item.message);
    }
    if (!results.length) {
      logger(`${'✓'.green} No Problems for Circular Dependencies found!${filter ? ' [filtered]'.yellow : ''}`);
    } else {
      exitCode = 1;
    }
  } catch (err) {
    logger('⚠️  '.red + err);
    exitCode = 1;
  }
  stop();
  if (exitCode !== 0) {
    process.exit(exitCode);
  }
}

if (program.es6) {
  require('@babel/register');
}

async function run() {
  if (!program.debug) {
    muteConsole();
  }
  let filter = filters.PROBLEMS;
  if (program.circular) {
    filter = null;
  } else if (program.problems) {
    filter = filters.PROBLEMS;
  } else if (program.alwaysEmptyExports) {
    filter = filters.ALWAYS_EMPTY;
  } else if (program.emptySyncAccess) {
    filter = filters.SYNC_EMPTY;
  } else if (program.missingProperties) {
    filter = filters.MISSING_PROPERTIES;
  }
  const paths = await getPaths(program.args);
  for (const modulePath of paths) {
    await check({
      filter,
      modulePath,
    });
  }
  process.exit();
}

if (program.args.length) {
  run();
}
