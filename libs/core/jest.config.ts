/* eslint-disable */
export default {
  displayName: 'core',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/libs/core',
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
};
