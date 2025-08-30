// Test setup file to mock problematic dependencies
const Module = require('module');
const originalRequire = Module.prototype.require;

// Mock DeepSpeech module
Module.prototype.require = function(id) {
  if (id === 'deepspeech') {
    return require('./mocks/deepspeech');
  }
  return originalRequire.apply(this, arguments);
};

// Set test environment
process.env.NODE_ENV = 'test';
