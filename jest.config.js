/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

const customJestConfig  = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  transformIgnorePatterns: [
  ],  
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
      useBabelrc: true,
    },
  },
  globalSetup: "./__tests__/test_config/setup.ts",
  setupFilesAfterEnv: ["./__tests__/test_config/afterEnv.ts"],
  globalTeardown: "./__tests__/test_config/teardown.ts",
  testPathIgnorePatterns: [
    "/node_modules/",
    "/__tests__/test_config/",
    "/__tests__/sockets/io.test.ts",
    "/__tests__/graphql/*"
  ],
  modulePaths: ["/__tests__/"],
  testEnvironment: 'jest-environment-jsdom',

};

module.exports = createJestConfig(customJestConfig)
