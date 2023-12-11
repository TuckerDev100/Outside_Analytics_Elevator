module.exports = {
  rootDir: __dirname, // Automatically sets the root directory to the directory of jest.config.js
  preset: "ts-jest",
  testEnvironment: "node",
  "moduleNameMapper": {
    "^src/(.*)$": "<rootDir>/src/$1"
  },
  roots: [
      "<rootDir>/src"
  ],
  testMatch: [
      "**/__tests__/**/*.ts?(x)",
      "**/?(*.)+(spec|test).ts?(x)"
  ],
  transform: {
      "^.+\\.tsx?$": "ts-jest"
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
