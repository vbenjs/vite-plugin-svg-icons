module.exports = {
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  moduleFileExtensions: ['js', 'ts', 'json', 'vue'],
  setupFilesAfterEnv: ['<rootDir>/src/config/jest/plugins.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.vue$': 'vue-jest',
  }
}
