module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",

  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },

  testMatch: [
    "**/tests/**/*.{test,spec}.{js,ts}"
  ],

  testPathIgnorePatterns: [
    "/node_modules/",
    "/.next/"
  ]
};
