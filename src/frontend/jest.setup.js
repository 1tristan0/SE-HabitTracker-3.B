   // jest.setup.js
require('@testing-library/jest-dom');

// Suppress console output during tests to see only failures clearly
const originalConsoleLog = console.log;
const originalConsoleWarn = console.warn;

console.log = jest.fn((...args) => {
  // Only log in certain conditions (e.g., for debugging specific tests)
  // Uncomment the line below if you need to see logs:
  // originalConsoleLog(...args);
});

console.warn = jest.fn((...args) => {
  // Only log warnings in certain conditions
  // Uncomment the line below if you need to see warnings:
  // originalConsoleWarn(...args);
});

// Keep console.error visible so test failures are easy to spot
// console.error is not mocked, it will always show
