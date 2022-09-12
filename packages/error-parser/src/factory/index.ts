/* eslint-disable @typescript-eslint/no-explicit-any */
// Import parser classes here

import { PARSERS } from '../config';
import { ErrorSource } from '../types/types';

const parserCache = {} as any;

// export function for instantiating parser classes.
// Parser should be cached upon instantiation
export function createParser(errorSource: ErrorSource) {
  const parser = new PARSERS[errorSource]();
  parserCache[errorSource] = parser;

  return parser;
}

// export a function for getting a parser
// The function should check cache first and only instantiate
// a new parser if non exists in cache.
export function getParser(errorSource: ErrorSource) {
  const cachedParser = parserCache[errorSource];
  if (cachedParser) return cachedParser;

  return createParser(errorSource);
}
