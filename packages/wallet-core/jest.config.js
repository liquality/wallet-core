module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(ts|js)x?$',
  testPathIgnorePatterns: ['/node_modules/', 'dist'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.{ts,tsx,js,jsx}', '!src/**/*.d.ts'],
  coveragePathIgnorePatterns: ['/node_modules/', 'dist', 'src/store/migrations'],
  coverageThreshold: {
    global: {
      lines: 40,
    },
  },
  globals: {
    'ts-jest': {
      tsconfig: 'src/tsconfig.json',
    },
  },
  reporters: ['default'],
  forceExit: true,
  detectOpenHandles: true,
  verbose: true,
  setupFiles: ['<rootDir>/jest/setup.js'],
};
