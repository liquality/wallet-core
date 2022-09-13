// Import parser classes here

const parserCache = {} as any;

// export function for instantiating parser classes.
// Parser should be cached upon instantiation
function createParser<T extends new () => any>(errorParserType: T): InstanceType<T> {
  const parser = new errorParserType();
  parserCache[errorParserType.name] = parser;
  return parser;
}

// export a function for getting a parser
// The function should check cache first and only instantiate
// a new parser if non exists in cache.
export function getParser<T extends new () => any>(errorParserType: T): InstanceType<T> {
  const cachedParser = parserCache[errorParserType.name];
  if (cachedParser) {
    return cachedParser;
  }

  return createParser(errorParserType);
}
