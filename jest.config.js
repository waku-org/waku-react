export default {
  collectCoverageFrom: [
    "**/**/*.{ts,tsx}",
    "!**/**/*.test.{ts,tsx}",
    "!**/src/types/**",
    "!**/node_modules/**",
    "!**/dist/**",
    "!**/__tests__/**",
  ],
  projects: [
    {
      clearMocks: true,
      resetMocks: true,
      restoreMocks: true,
      rootDir: ".",
      roots: ["<rootDir>/src"],
      transformIgnorePatterns: ["[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$"],
      displayName: {
        name: "@waku/react",
        color: "cyan",
      },
      testMatch: ["**/__tests__/**/*.(spec|test).ts?(x)"],
      transform: {
        "^.+\\.tsx?$": "@swc/jest",
      },
      testEnvironment: "jsdom",
    },
  ],
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname",
  ],
};
