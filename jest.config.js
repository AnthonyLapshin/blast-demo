/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: [
    '<rootDir>/__tests__',
    '<rootDir>/__mocks__',
    '<rootDir>/assets/Scripts'
  ],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.test.json'
    }]
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/assets/Scripts/$1',
    '^cc$': '<rootDir>/__mocks__/cc.ts',
    // Map test imports
    '^../Game/(.*)$': '<rootDir>/assets/Scripts/Game/$1',
    '^../Services/(.*)$': '<rootDir>/assets/Scripts/Services/$1',
    '^../GameField/(.*)$': '<rootDir>/assets/Scripts/GameField/$1',
    '^../Libs/(.*)$': '<rootDir>/assets/Scripts/Libs/$1'
  },
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  verbose: true,
  setupFiles: ['<rootDir>/jest.setup.js']
};
